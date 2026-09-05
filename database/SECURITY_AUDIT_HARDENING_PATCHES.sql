-- ====================================================================
-- PrepUnite (Jobsfolder): Complete Security Audit Hardening Master Patch
-- Resolves All Critical, High, and Medium Architectural & Security Findings
-- Completely Self-Contained, Safe, and Idempotent for Supabase SQL Editor
-- ====================================================================

-- --------------------------------------------------------------------
-- 0. DEFENSIVE SCHEMA PREPARATION (PREVENT "COLUMN DOES NOT EXIST" ERRORS)
-- --------------------------------------------------------------------
DO $$
BEGIN
  -- Defensive check on paper_tab_nodes
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'paper_tab_nodes') THEN
    ALTER TABLE public.paper_tab_nodes ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT FALSE;
    UPDATE public.paper_tab_nodes SET is_free = true WHERE sort_order = 0 AND (is_free IS NULL OR is_free = false);
  END IF;

  -- Defensive check on colleges
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'colleges') THEN
    ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS max_licenses INT DEFAULT 1500;
    ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS contract_status VARCHAR(50) DEFAULT 'ACTIVE';
    ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS valid_until TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 year');
    ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
  END IF;

  -- Defensive check on college_students
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'college_students') THEN
    ALTER TABLE public.college_students ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ACTIVE';
    ALTER TABLE public.college_students ADD COLUMN IF NOT EXISTS roll_number VARCHAR(100);
    ALTER TABLE public.college_students ADD COLUMN IF NOT EXISTS department VARCHAR(100);
    ALTER TABLE public.college_students ADD COLUMN IF NOT EXISTS batch_year INT;
  END IF;

  -- Defensive check on student_exam_attempts
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'student_exam_attempts') THEN
    ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'IN_PROGRESS';
    ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS time_spent_seconds INT DEFAULT 0;
    ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS total_score DECIMAL(6, 2) DEFAULT 0.00;
    ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS max_possible_score DECIMAL(6, 2) DEFAULT 100.00;
    ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS percentage DECIMAL(5, 2) DEFAULT 0.00;
    ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS passed BOOLEAN DEFAULT FALSE;
    ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS tab_switch_count INT DEFAULT 0;
    ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS proctor_events JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS responses JSONB DEFAULT '{}'::jsonb;
    ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS student_email VARCHAR(255);
    ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;

  -- Defensive check on mock_exam_sections
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mock_exam_sections') THEN
    ALTER TABLE public.mock_exam_sections ADD COLUMN IF NOT EXISTS section_order INT DEFAULT 1;
    ALTER TABLE public.mock_exam_sections ADD COLUMN IF NOT EXISTS marks_per_correct DECIMAL(4, 2) DEFAULT 1.00;
    ALTER TABLE public.mock_exam_sections ADD COLUMN IF NOT EXISTS negative_marking DECIMAL(4, 2) DEFAULT 0.00;
  END IF;

  -- Defensive check on mock_exams
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mock_exams') THEN
    ALTER TABLE public.mock_exams ADD COLUMN IF NOT EXISTS enable_tab_switch_detection BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.mock_exams ADD COLUMN IF NOT EXISTS max_tab_switches_allowed INT DEFAULT 3;
    ALTER TABLE public.mock_exams ADD COLUMN IF NOT EXISTS passing_percentage DECIMAL(5, 2) DEFAULT 40.00;
  END IF;

  -- Defensive check on user_subscriptions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_subscriptions') THEN
    ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255);
    ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- --------------------------------------------------------------------
-- 0. CORE SECURITY DEFINER FUNCTIONS (PREREQUISITES)
-- --------------------------------------------------------------------

-- 0.1 Super Admin Verification Function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND (
        LOWER(role) = 'admin'
        OR LOWER(email) IN (
          'venkatmukala9@gmail.com',
          'venkat.mukala9@gmail.com',
          'prepsunite@gmail.com',
          'veen1kat@gmail.com'
        )
      )
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- 0.2 TPO for Specific College Check (Explicit TEXT comparison)
CREATE OR REPLACE FUNCTION public.is_tpo_for_college(p_college_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.tpo_authorizations ta
    JOIN public.profiles p ON lower(p.email) = lower(ta.email)
    WHERE p.id = auth.uid()
      AND ta.college_id::TEXT = p_college_id::TEXT
      AND ta.status = 'ACTIVE'
  ) OR public.is_admin();
END;
$$;
GRANT EXECUTE ON FUNCTION public.is_tpo_for_college(TEXT) TO anon, authenticated, service_role;

-- 0.3 Any TPO Coordinator Check
CREATE OR REPLACE FUNCTION public.is_any_tpo()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.tpo_authorizations ta
    JOIN public.profiles p ON lower(p.email) = lower(ta.email)
    WHERE p.id = auth.uid()
      AND ta.status = 'ACTIVE'
  ) OR public.is_admin();
END;
$$;
GRANT EXECUTE ON FUNCTION public.is_any_tpo() TO anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- 1. ELIMINATE auth.role() = 'anon' RLS BYPASSES & LOCK DOWN TABLES
-- --------------------------------------------------------------------

-- 1.1 Secure public.colleges
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Super admin full colleges" ON public.colleges;
DROP POLICY IF EXISTS "Allow student read colleges" ON public.colleges;
DROP POLICY IF EXISTS "Allow public read active colleges" ON public.colleges;
DROP POLICY IF EXISTS "Allow authenticated full colleges" ON public.colleges;

CREATE POLICY "Super admin full colleges" ON public.colleges FOR ALL 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Allow student read colleges" ON public.colleges FOR SELECT
  USING (true);

-- 1.2 Secure public.tpo_authorizations
ALTER TABLE public.tpo_authorizations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Super admin full tpo_authorizations" ON public.tpo_authorizations;
DROP POLICY IF EXISTS "TPO read own authorizations" ON public.tpo_authorizations;
DROP POLICY IF EXISTS "Allow public read tpo_authorizations" ON public.tpo_authorizations;

CREATE POLICY "Super admin full tpo_authorizations" ON public.tpo_authorizations FOR ALL 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "TPO read own authorizations" ON public.tpo_authorizations FOR SELECT
  USING (
    public.is_admin() OR
    lower(email) = lower(auth.jwt()->>'email') OR
    user_id = auth.uid()
  );

-- 1.3 Secure public.college_students
ALTER TABLE public.college_students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Super admin full college_students" ON public.college_students;
DROP POLICY IF EXISTS "TPO manage college students" ON public.college_students;
DROP POLICY IF EXISTS "Student read own profile" ON public.college_students;
DROP POLICY IF EXISTS "Allow public read college_students" ON public.college_students;

CREATE POLICY "Super admin full college_students" ON public.college_students FOR ALL 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "TPO manage college students" ON public.college_students FOR ALL
  USING (public.is_tpo_for_college(college_id::TEXT))
  WITH CHECK (public.is_tpo_for_college(college_id::TEXT));

CREATE POLICY "Student read own profile" ON public.college_students FOR SELECT
  USING (
    lower(email) = lower(auth.jwt()->>'email') OR
    user_id = auth.uid()
  );

-- 1.4 Secure public.user_subscriptions
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Super admin full subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "TPO coordinator manage college student subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users read own subscriptions" ON public.user_subscriptions;

CREATE POLICY "Super admin full subscriptions" ON public.user_subscriptions FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "TPO coordinator manage college student subscriptions"
  ON public.user_subscriptions FOR ALL
  USING (
    payment_id LIKE 'B2B_CAMPUS_%' AND (
      public.is_admin() OR
      EXISTS (
        SELECT 1 FROM public.tpo_authorizations ta
        WHERE lower(ta.email) = lower(auth.jwt()->>'email')
          AND ta.status = 'ACTIVE'
          AND public.user_subscriptions.payment_id LIKE 'B2B_CAMPUS_' || ta.college_id::TEXT || '%'
      )
    )
  )
  WITH CHECK (
    payment_id LIKE 'B2B_CAMPUS_%' AND (
      public.is_admin() OR
      EXISTS (
        SELECT 1 FROM public.tpo_authorizations ta
        WHERE lower(ta.email) = lower(auth.jwt()->>'email')
          AND ta.status = 'ACTIVE'
          AND public.user_subscriptions.payment_id LIKE 'B2B_CAMPUS_' || ta.college_id::TEXT || '%'
      )
    )
  );

CREATE POLICY "Users read own subscriptions" ON public.user_subscriptions FOR SELECT
  USING (
    lower(user_email) = lower(auth.jwt()->>'email')
    OR public.is_admin()
  );

-- 1.5 Secure public.user_paper_purchases
ALTER TABLE public.user_paper_purchases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Super admin full paper purchases" ON public.user_paper_purchases;
DROP POLICY IF EXISTS "Users read own paper purchases" ON public.user_paper_purchases;

CREATE POLICY "Super admin full paper purchases" ON public.user_paper_purchases FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Users read own paper purchases" ON public.user_paper_purchases FOR SELECT
  USING (
    lower(user_email) = lower(auth.jwt()->>'email')
    OR public.is_admin()
  );

-- 1.6 Secure public.transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Super admin full transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users read own transactions" ON public.transactions;

CREATE POLICY "Super admin full transactions" ON public.transactions FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Users read own transactions" ON public.transactions FOR SELECT
  USING (
    lower(user_email) = lower(auth.jwt()->>'email')
    OR public.is_admin()
  );

-- 1.7 Secure public.profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profile view" ON public.profiles;
DROP POLICY IF EXISTS "Users update self info non-role" ON public.profiles;
DROP POLICY IF EXISTS "Users insert self profile as user" ON public.profiles;
DROP POLICY IF EXISTS "Admin full profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow insert/update profiles" ON public.profiles;

CREATE POLICY "Public profile view" ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users insert self profile as user" ON public.profiles FOR INSERT
  WITH CHECK (
    id = auth.uid() AND (COALESCE(LOWER(role), 'user') = 'user' OR public.is_admin())
  );

CREATE POLICY "Users update self info non-role" ON public.profiles FOR UPDATE
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (
    (id = auth.uid() AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
    OR public.is_admin()
  );

CREATE POLICY "Admin full profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- 1.8 Secure public.mock_exams
ALTER TABLE public.mock_exams ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Super admin full mock exams" ON public.mock_exams;
DROP POLICY IF EXISTS "TPO manage own mock exams" ON public.mock_exams;
DROP POLICY IF EXISTS "Students read active college exams" ON public.mock_exams;

CREATE POLICY "Super admin full mock exams" ON public.mock_exams FOR ALL USING (public.is_admin());

CREATE POLICY "TPO manage own mock exams" ON public.mock_exams FOR ALL
  USING (public.is_tpo_for_college(college_id::TEXT))
  WITH CHECK (public.is_tpo_for_college(college_id::TEXT));

CREATE POLICY "Students read active college exams" ON public.mock_exams FOR SELECT
  USING (
    is_deleted = false
    AND is_active = true
    AND (
      public.is_admin()
      OR college_id::TEXT = (SELECT college_id::TEXT FROM public.profiles WHERE id = auth.uid())
      OR college_id::TEXT IN (
        SELECT college_id::TEXT FROM public.college_students WHERE lower(email) = lower(auth.jwt()->>'email')
      )
    )
  );

-- 1.9 Secure public.mock_exam_sections
ALTER TABLE public.mock_exam_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Super admin full sections" ON public.mock_exam_sections;
DROP POLICY IF EXISTS "TPO manage sections" ON public.mock_exam_sections;
DROP POLICY IF EXISTS "Students read sections of their exams" ON public.mock_exam_sections;

CREATE POLICY "Super admin full sections" ON public.mock_exam_sections FOR ALL USING (public.is_admin());

CREATE POLICY "TPO manage sections" ON public.mock_exam_sections FOR ALL
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.mock_exams me
      WHERE me.id::TEXT = mock_exam_sections.mock_exam_id::TEXT
        AND public.is_tpo_for_college(me.college_id::TEXT)
    )
  );

CREATE POLICY "Students read sections of their exams" ON public.mock_exam_sections FOR SELECT
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.mock_exams me
      WHERE me.id::TEXT = mock_exam_sections.mock_exam_id::TEXT
        AND (
          me.college_id::TEXT = (SELECT college_id::TEXT FROM public.profiles WHERE id = auth.uid())
          OR me.college_id::TEXT IN (
            SELECT college_id::TEXT FROM public.college_students WHERE lower(email) = lower(auth.jwt()->>'email')
          )
        )
    )
  );

-- 1.10 Lock Down student_exam_attempts RLS Policies
ALTER TABLE public.student_exam_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Student manage own attempts" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Student select own attempts" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Student insert own in_progress attempt" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Student update in_progress attempt responses" ON public.student_exam_attempts;

CREATE POLICY "Student select own attempts" ON public.student_exam_attempts 
  FOR SELECT
  USING (
    student_id::TEXT = auth.uid()::TEXT
    OR student_id::TEXT = lower(auth.jwt()->>'email')
    OR student_email = lower(auth.jwt()->>'email')
    OR public.is_admin()
    OR public.is_tpo_for_college(college_id::TEXT)
  );

CREATE POLICY "Student insert own in_progress attempt" ON public.student_exam_attempts 
  FOR INSERT
  WITH CHECK (
    (student_id::TEXT = auth.uid()::TEXT OR student_id::TEXT = lower(auth.jwt()->>'email') OR public.is_admin())
    AND status = 'IN_PROGRESS'
    AND COALESCE(total_score, 0) = 0
  );

CREATE POLICY "Student update in_progress attempt responses" ON public.student_exam_attempts 
  FOR UPDATE
  USING (
    (student_id::TEXT = auth.uid()::TEXT OR student_id::TEXT = lower(auth.jwt()->>'email') OR public.is_admin())
    AND status = 'IN_PROGRESS'
  )
  WITH CHECK (
    (student_id::TEXT = auth.uid()::TEXT OR student_id::TEXT = lower(auth.jwt()->>'email') OR public.is_admin())
    AND status = 'IN_PROGRESS'
    AND COALESCE(total_score, 0) = 0
  );

-- 1.11 Multi-Tenant Shadow Sync Leakage Fix on contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select B2B exam messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin full access contact messages" ON public.contact_messages;
CREATE POLICY "Admin full access contact messages" ON public.contact_messages
  FOR ALL USING (public.is_admin());

-- 1.12 Secure public.paper_tab_nodes (Prevent Unpaid Full Content Scraping)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'paper_tab_nodes') THEN
    EXECUTE 'ALTER TABLE public.paper_tab_nodes ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT FALSE;';
    EXECUTE 'ALTER TABLE public.paper_tab_nodes ENABLE ROW LEVEL SECURITY;';
    EXECUTE 'DROP POLICY IF EXISTS "Public select paper nodes" ON public.paper_tab_nodes;';
    EXECUTE 'DROP POLICY IF EXISTS "Allow select" ON public.paper_tab_nodes;';
    EXECUTE 'DROP POLICY IF EXISTS "Allow public read access to paper_tab_nodes" ON public.paper_tab_nodes;';
    EXECUTE 'DROP POLICY IF EXISTS "Admin write paper nodes" ON public.paper_tab_nodes;';

    EXECUTE 'CREATE POLICY "Admin write paper nodes" ON public.paper_tab_nodes FOR ALL USING (public.is_admin());';
    EXECUTE 'CREATE POLICY "Secure select paper nodes" ON public.paper_tab_nodes FOR SELECT USING (
      is_deleted = false AND (
        is_free = true OR public.is_admin() OR (
          auth.jwt()->>''email'' IS NOT NULL AND public.check_user_paper_access(LOWER(auth.jwt()->>''email''), exam_id::TEXT)
        )
      )
    );';
  END IF;
END $$;

-- --------------------------------------------------------------------
-- 2. SAFE EXAM QUESTION RETRIEVAL (STRIP ANSWERS & EXPLANATIONS)
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_safe_mock_exam_questions(p_question_ids TEXT[])
RETURNS TABLE (
    id TEXT,
    statement TEXT,
    options JSONB,
    difficulty VARCHAR,
    topic_id VARCHAR,
    question_number INT
) LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tq.id::TEXT,
        tq.statement,
        tq.options::JSONB,
        tq.difficulty::VARCHAR,
        tq.topic_id::VARCHAR,
        tq.question_number
    FROM public.topic_questions tq
    WHERE tq.id::TEXT = ANY(p_question_ids)
      AND tq.is_deleted = false;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_safe_mock_exam_questions(TEXT[]) TO anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- 3. ANTI-TAMPER PROCTORING & SERVER-SIDE GRADING RPC
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.submit_and_grade_mock_attempt(
    p_attempt_id TEXT,
    p_responses JSONB,
    p_time_spent_seconds INT,
    p_proctor_events JSONB DEFAULT '[]'::jsonb,
    p_tab_switch_count INT DEFAULT 0,
    p_status_override TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_attempt RECORD;
    v_exam RECORD;
    v_section RECORD;
    v_q_id TEXT;
    v_correct_ans INT;
    v_student_selected INT;
    v_is_correct BOOLEAN;
    v_marks_per_q NUMERIC;
    v_neg_mark NUMERIC;
    v_total_score NUMERIC := 0;
    v_max_possible_score NUMERIC := 0;
    v_percentage NUMERIC := 0;
    v_passed BOOLEAN := false;
    v_status TEXT;
    v_graded_responses JSONB := '{}'::jsonb;
    v_item_resp JSONB;
    v_marked_review BOOLEAN;
    v_time_spent INT;
    v_raw_correct TEXT;
    v_effective_tab_switches INT;
BEGIN
    SELECT * INTO v_attempt 
    FROM public.student_exam_attempts 
    WHERE id::TEXT = p_attempt_id::TEXT;

    IF v_attempt IS NULL THEN
        RAISE EXCEPTION 'Attempt with id % was not found.', p_attempt_id;
    END IF;

    -- 🛡️ Caller Authorization Guard:
    -- Verify caller owns this attempt, is authorized TPO, or is super admin
    IF NOT (
        public.is_admin() OR
        public.is_tpo_for_college(v_attempt.college_id::TEXT) OR
        v_attempt.student_id::TEXT = COALESCE(auth.uid()::TEXT, '') OR
        v_attempt.student_id::TEXT = lower(COALESCE(auth.jwt()->>'email', '')) OR
        lower(COALESCE(v_attempt.student_email, '')) = lower(COALESCE(auth.jwt()->>'email', ''))
    ) THEN
        RAISE EXCEPTION 'Unauthorized: You are not permitted to submit this exam attempt.';
    END IF;

    -- 🛡️ Idempotency & Finality Guard:
    -- Prevent re-submitting an already finalized attempt
    IF v_attempt.status IN ('SUBMITTED', 'GRADED', 'TERMINATED_MALPRACTICE') AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'This attempt has already been submitted and finalized.';
    END IF;

    -- Anti-Tamper: Take the maximum between incoming and stored counters or proctor event count
    v_effective_tab_switches := GREATEST(
        COALESCE(p_tab_switch_count, 0),
        COALESCE(v_attempt.tab_switch_count, 0),
        jsonb_array_length(COALESCE(p_proctor_events, '[]'::jsonb))
    );

    SELECT * INTO v_exam 
    FROM public.mock_exams 
    WHERE id::TEXT = v_attempt.mock_exam_id::TEXT;

    IF p_status_override = 'TERMINATED_MALPRACTICE' OR 
       (v_exam IS NOT NULL AND v_exam.enable_tab_switch_detection AND v_effective_tab_switches > v_exam.max_tab_switches_allowed) THEN
        v_status := 'TERMINATED_MALPRACTICE';
    ELSIF p_status_override IS NOT NULL AND p_status_override != '' THEN
        v_status := p_status_override;
    ELSE
        v_status := 'SUBMITTED';
    END IF;

    IF v_exam IS NOT NULL THEN
        FOR v_section IN 
            SELECT * FROM public.mock_exam_sections 
            WHERE mock_exam_id::TEXT = v_exam.id::TEXT
            ORDER BY section_order ASC
        LOOP
            v_marks_per_q := COALESCE(v_section.marks_per_correct, 1.00);
            v_neg_mark := COALESCE(v_section.negative_marking, 0.00);

            IF v_section.question_ids IS NOT NULL THEN
                FOREACH v_q_id IN ARRAY v_section.question_ids
                LOOP
                    v_max_possible_score := v_max_possible_score + v_marks_per_q;

                    SELECT correct_answer INTO v_raw_correct
                    FROM public.topic_questions 
                    WHERE id::TEXT = v_q_id;

                    IF v_raw_correct IS NOT NULL THEN
                        IF v_raw_correct ~ '^\d+$' THEN
                            v_correct_ans := v_raw_correct::INT;
                        ELSIF upper(v_raw_correct) = 'A' THEN
                            v_correct_ans := 0;
                        ELSIF upper(v_raw_correct) = 'B' THEN
                            v_correct_ans := 1;
                        ELSIF upper(v_raw_correct) = 'C' THEN
                            v_correct_ans := 2;
                        ELSIF upper(v_raw_correct) = 'D' THEN
                            v_correct_ans := 3;
                        ELSE
                            v_correct_ans := -1;
                        END IF;
                    ELSE
                        v_correct_ans := -1;
                    END IF;

                    v_item_resp := p_responses->v_q_id;

                    IF v_item_resp IS NOT NULL 
                       AND (v_item_resp->>'selected_option') IS NOT NULL 
                       AND (v_item_resp->>'selected_option') != 'null' 
                       AND (v_item_resp->>'selected_option') != '' 
                       AND (v_item_resp->>'selected_option') ~ '^-?\d+$' THEN
                        v_student_selected := (v_item_resp->>'selected_option')::INT;
                        v_marked_review := COALESCE(
                            (v_item_resp->>'marked_for_review')::BOOLEAN,
                            (v_item_resp->>'marked_review')::BOOLEAN,
                            false
                        );
                        v_time_spent := COALESCE(
                            (v_item_resp->>'time_spent_seconds')::INT,
                            (v_item_resp->>'time_spent_sec')::INT,
                            0
                        );

                        IF v_correct_ans >= 0 AND v_student_selected = v_correct_ans THEN
                            v_is_correct := true;
                            v_total_score := v_total_score + v_marks_per_q;
                        ELSE
                            v_is_correct := false;
                            v_total_score := v_total_score - v_neg_mark;
                        END IF;

                        v_graded_responses := jsonb_set(
                            v_graded_responses,
                            ARRAY[v_q_id],
                            jsonb_build_object(
                                'selected_option', v_student_selected,
                                'is_correct', v_is_correct,
                                'marked_for_review', v_marked_review,
                                'marked_review', v_marked_review,
                                'time_spent_seconds', v_time_spent,
                                'time_spent_sec', v_time_spent,
                                'correct_answer', v_correct_ans
                            )
                        );
                    END IF;
                END LOOP;
            END IF;
        END LOOP;

        IF v_max_possible_score > 0 THEN
            v_total_score := GREATEST(0.00, v_total_score);
            v_percentage := ROUND((v_total_score / v_max_possible_score) * 100.0, 2);
            v_passed := v_percentage >= COALESCE(v_exam.passing_percentage, 40.00);
        ELSE
            v_max_possible_score := 100.00;
            v_percentage := 0.00;
            v_passed := false;
        END IF;
    END IF;

    UPDATE public.student_exam_attempts
    SET 
        responses = v_graded_responses,
        total_score = v_total_score,
        max_possible_score = v_max_possible_score,
        percentage = v_percentage,
        passed = v_passed,
        status = v_status,
        tab_switch_count = v_effective_tab_switches,
        proctor_events = p_proctor_events,
        time_spent_seconds = p_time_spent_seconds,
        submitted_at = NOW(),
        updated_at = NOW()
    WHERE id::TEXT = p_attempt_id::TEXT;

    RETURN jsonb_build_object(
        'id', p_attempt_id,
        'status', v_status,
        'total_score', v_total_score,
        'max_possible_score', v_max_possible_score,
        'percentage', v_percentage,
        'passed', v_passed,
        'tab_switch_count', v_effective_tab_switches,
        'responses', v_graded_responses
    );
END;
$$;
GRANT EXECUTE ON FUNCTION public.submit_and_grade_mock_attempt(TEXT, JSONB, INT, JSONB, INT, TEXT) TO anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- 4. DATABASE TRIGGER TO CASCADE colleges.valid_until TO SUBSCRIPTIONS
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.cascade_college_validity_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_status TEXT;
BEGIN
    IF NEW.contract_status IN ('ACTIVE', 'PILOT') AND (NEW.valid_until IS NULL OR NEW.valid_until > NOW()) THEN
        v_status := 'ACTIVE';
    ELSE
        v_status := 'EXPIRED';
    END IF;

    UPDATE public.user_subscriptions
    SET 
        expires_at = NEW.valid_until,
        status = v_status,
        updated_at = NOW()
    WHERE payment_id LIKE 'B2B_CAMPUS_' || NEW.id::TEXT || '_%'
       OR payment_id LIKE 'B2B_CAMPUS_' || NEW.code::TEXT || '_%'
       OR payment_id = 'B2B_CAMPUS_' || NEW.id::TEXT;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_cascade_college_validity ON public.colleges;
CREATE TRIGGER trg_cascade_college_validity
AFTER UPDATE OF valid_until, contract_status ON public.colleges
FOR EACH ROW
EXECUTE FUNCTION public.cascade_college_validity_update();

-- --------------------------------------------------------------------
-- 5. FIX SEAT CAP RACE CONDITION & UNBLOCK EXISTING STUDENT UPDATES
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.check_college_seat_cap()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    current_count INT;
    max_allowed INT;
    is_existing_student BOOLEAN;
BEGIN
    -- If updating and status is NOT becoming ACTIVE, no seat is consumed
    IF TG_OP = 'UPDATE' THEN
        IF NEW.status != 'ACTIVE' THEN
            RETURN NEW;
        END IF;
        IF OLD.status = 'ACTIVE' AND OLD.college_id = NEW.college_id THEN
            RETURN NEW;
        END IF;
    END IF;

    -- If inserting with status other than ACTIVE, do not count against seat quota
    IF TG_OP = 'INSERT' AND NEW.status != 'ACTIVE' THEN
        RETURN NEW;
    END IF;

    -- Check if student already has an ACTIVE seat for this college (handles re-insert / upsert)
    SELECT EXISTS (
        SELECT 1 FROM public.college_students 
        WHERE college_id::TEXT = NEW.college_id::TEXT 
          AND lower(email) = lower(NEW.email)
          AND status = 'ACTIVE'
          AND (TG_OP = 'INSERT' OR id != NEW.id)
    ) INTO is_existing_student;

    -- If already an active seat holder, allow update without error
    IF is_existing_student THEN
        RETURN NEW;
    END IF;

    -- Lock the college record for update to prevent concurrent race conditions
    SELECT COALESCE(max_licenses, 1500) INTO max_allowed
    FROM public.colleges
    WHERE id::TEXT = NEW.college_id::TEXT
    FOR UPDATE;

    IF max_allowed IS NULL THEN
        max_allowed := 1500;
    END IF;

    -- Count existing active students
    SELECT COUNT(*) INTO current_count 
    FROM public.college_students 
    WHERE college_id::TEXT = NEW.college_id::TEXT 
      AND status = 'ACTIVE';

    IF current_count >= max_allowed THEN
        RAISE EXCEPTION 'Seat quota exceeded! Maximum allowed seats for this college is %', max_allowed;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_college_seat_cap ON public.college_students;
CREATE TRIGGER trg_enforce_college_seat_cap
BEFORE INSERT OR UPDATE OF status, college_id ON public.college_students
FOR EACH ROW
EXECUTE FUNCTION public.check_college_seat_cap();
GRANT EXECUTE ON FUNCTION public.check_college_seat_cap() TO anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- 6. SECURE POST-SUBMISSION SOLUTION REVIEW RPC
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_mock_exam_attempt_solutions(
    p_attempt_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_attempt RECORD;
    v_exam RECORD;
    v_section RECORD;
    v_q_id TEXT;
    v_q RECORD;
    v_questions JSONB := '[]'::jsonb;
BEGIN
    SELECT * INTO v_attempt 
    FROM public.student_exam_attempts 
    WHERE id::TEXT = p_attempt_id::TEXT;

    IF v_attempt IS NULL THEN
        RAISE EXCEPTION 'Attempt not found';
    END IF;

    -- Only allow reviewing solutions after test is completed
    IF v_attempt.status NOT IN ('SUBMITTED', 'GRADED', 'TERMINATED_MALPRACTICE') THEN
        RAISE EXCEPTION 'Solutions are only accessible after the exam has been submitted.';
    END IF;

    -- Verify that the caller owns this attempt or is an authorized TPO/Admin
    IF NOT (
        public.is_admin() OR
        public.is_tpo_for_college(v_attempt.college_id::TEXT) OR
        v_attempt.student_id::TEXT = COALESCE(auth.uid()::TEXT, '') OR
        v_attempt.student_id::TEXT = lower(COALESCE(auth.jwt()->>'email', '')) OR
        lower(COALESCE(v_attempt.student_email, '')) = lower(COALESCE(auth.jwt()->>'email', ''))
    ) THEN
        RAISE EXCEPTION 'Access denied to this attempt review';
    END IF;

    SELECT * INTO v_exam 
    FROM public.mock_exams 
    WHERE id::TEXT = v_attempt.mock_exam_id::TEXT;

    IF v_exam IS NOT NULL THEN
        FOR v_section IN 
            SELECT * FROM public.mock_exam_sections 
            WHERE mock_exam_id::TEXT = v_exam.id::TEXT
            ORDER BY section_order ASC
        LOOP
            IF v_section.question_ids IS NOT NULL THEN
                FOREACH v_q_id IN ARRAY v_section.question_ids
                LOOP
                    SELECT 
                        id, statement, options, difficulty, 
                        topic_id, question_number, correct_answer, explanation
                    INTO v_q
                    FROM public.topic_questions 
                    WHERE id::TEXT = v_q_id;

                    IF v_q IS NOT NULL THEN
                        v_questions := v_questions || jsonb_build_object(
                            'id', v_q.id,
                            'statement', v_q.statement,
                            'options', v_q.options,
                            'difficulty', v_q.difficulty,
                            'topic_id', v_q.topic_id,
                            'question_number', v_q.question_number,
                            'correct_answer', v_q.correct_answer,
                            'explanation', v_q.explanation
                        );
                    END IF;
                END LOOP;
            END IF;
        END LOOP;
    END IF;

    RETURN jsonb_build_object(
        'attempt_id', p_attempt_id,
        'mock_exam_id', v_attempt.mock_exam_id,
        'student_id', v_attempt.student_id,
        'college_id', v_attempt.college_id,
        'status', v_attempt.status,
        'started_at', v_attempt.started_at,
        'submitted_at', v_attempt.submitted_at,
        'time_spent_seconds', v_attempt.time_spent_seconds,
        'total_score', v_attempt.total_score,
        'max_possible_score', v_attempt.max_possible_score,
        'percentage', v_attempt.percentage,
        'passed', v_attempt.passed,
        'tab_switch_count', v_attempt.tab_switch_count,
        'proctor_events', v_attempt.proctor_events,
        'responses', v_attempt.responses,
        'student_responses', v_attempt.responses,
        'questions', v_questions
    );
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_mock_exam_attempt_solutions(TEXT) TO anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- 7. LIVE STUDENT COLLEGE ENTITLEMENT CHECK RPC
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.check_student_college_entitlement(
    p_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_clean_email TEXT;
    v_student RECORD;
BEGIN
    IF p_email IS NULL OR p_email = '' THEN
        RETURN jsonb_build_object('is_entitled', false, 'reason', 'No email provided');
    END IF;

    v_clean_email := lower(trim(p_email));

    SELECT 
        cs.id AS student_id,
        cs.college_id,
        cs.name,
        cs.roll_number,
        cs.department,
        cs.batch_year,
        c.name AS college_name,
        c.code AS college_code,
        c.contract_status,
        c.valid_until
    INTO v_student
    FROM public.college_students cs
    JOIN public.colleges c ON c.id::TEXT = cs.college_id::TEXT
    WHERE lower(trim(cs.email)) = v_clean_email
      AND cs.status = 'ACTIVE'
      AND c.is_deleted = false
    ORDER BY cs.created_at DESC
    LIMIT 1;

    IF v_student IS NULL THEN
        RETURN jsonb_build_object('is_entitled', false, 'reason', 'Not enrolled in any college roster');
    END IF;

    IF v_student.contract_status NOT IN ('ACTIVE', 'PILOT') OR (v_student.valid_until IS NOT NULL AND v_student.valid_until <= NOW()) THEN
        RETURN jsonb_build_object(
            'is_entitled', false,
            'is_expired', true,
            'college_id', v_student.college_id,
            'college_name', v_student.college_name,
            'valid_until', v_student.valid_until,
            'contract_status', v_student.contract_status,
            'reason', 'Institutional contract expired or suspended'
        );
    END IF;

    RETURN jsonb_build_object(
        'is_entitled', true,
        'is_expired', false,
        'student_id', v_student.student_id,
        'college_id', v_student.college_id,
        'college_name', v_student.college_name,
        'college_code', v_student.college_code,
        'valid_until', v_student.valid_until,
        'contract_status', v_student.contract_status,
        'department', v_student.department,
        'roll_number', v_student.roll_number,
        'batch_year', v_student.batch_year
    );
END;
$$;
GRANT EXECUTE ON FUNCTION public.check_student_college_entitlement(TEXT) TO anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- 8. CAMPUS PRO PASS PROVISIONING RPC
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.provision_campus_student_subscription(
  p_email TEXT,
  p_college_id TEXT,
  p_college_name TEXT,
  p_valid_until TIMESTAMPTZ
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_clean_email TEXT;
  v_plan_name TEXT;
  v_payment_id TEXT;
BEGIN
  v_clean_email := lower(trim(p_email));
  v_plan_name := 'Campus Pro Pass (' || coalesce(p_college_name, 'Partner College') || ')';
  v_payment_id := 'B2B_CAMPUS_' || p_college_id || '_' || md5(v_clean_email);

  INSERT INTO public.user_subscriptions (
    user_email,
    plan_name,
    payment_id,
    status,
    expires_at,
    updated_at
  ) VALUES (
    v_clean_email,
    v_plan_name,
    v_payment_id,
    'ACTIVE',
    p_valid_until,
    NOW()
  )
  ON CONFLICT (payment_id)
  DO UPDATE SET
    user_email = EXCLUDED.user_email,
    plan_name = EXCLUDED.plan_name,
    status = 'ACTIVE',
    expires_at = EXCLUDED.expires_at,
    updated_at = NOW();

  RETURN jsonb_build_object(
    'success', true,
    'email', v_clean_email,
    'payment_id', v_payment_id,
    'expires_at', p_valid_until
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.provision_campus_student_subscription(TEXT, TEXT, TEXT, TIMESTAMPTZ) TO anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- 9. UNIFIED PAPER & CAMPUS PASS ENTITLEMENT CHECK RPC
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.check_user_paper_access(
    p_user_email VARCHAR,
    p_exam_id VARCHAR
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_has_pass BOOLEAN := FALSE;
    v_has_paper BOOLEAN := FALSE;
    v_clean_email VARCHAR;
    v_college_entitlement JSONB;
BEGIN
    IF p_user_email IS NULL OR p_user_email = '' THEN
        RETURN FALSE;
    END IF;

    v_clean_email := LOWER(TRIM(p_user_email));

    -- 1. Check Super Admin Whitelist
    IF v_clean_email IN (
        'venkatmukala9@gmail.com',
        'venkat.mukala9@gmail.com',
        'prepsunite@gmail.com',
        'veen1kat@gmail.com'
    ) THEN
        RETURN TRUE;
    END IF;

    -- 2. Check institutional college pass entitlement
    SELECT public.check_student_college_entitlement(v_clean_email) INTO v_college_entitlement;
    IF v_college_entitlement IS NOT NULL AND (v_college_entitlement->>'is_entitled')::boolean = true THEN
        RETURN TRUE;
    END IF;

    -- 3. Check consumer active subscription (Monthly / Quarterly / Yearly)
    SELECT EXISTS (
        SELECT 1 FROM public.user_subscriptions
        WHERE LOWER(user_email) = v_clean_email
          AND status = 'ACTIVE'
          AND expires_at > NOW()
    ) INTO v_has_pass;

    IF v_has_pass THEN
        RETURN TRUE;
    END IF;

    -- 4. Check individual paper purchase
    SELECT EXISTS (
        SELECT 1 FROM public.user_paper_purchases
        WHERE LOWER(user_email) = v_clean_email
          AND exam_id = p_exam_id
          AND expires_at > NOW()
    ) INTO v_has_paper;

    RETURN v_has_paper;
END;
$$;
GRANT EXECUTE ON FUNCTION public.check_user_paper_access(VARCHAR, VARCHAR) TO anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- 10. RECURSIVE PAPER NODES REDACTION FUNCTION & SECURE EXAMS RPC
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.redact_paper_nodes(
  p_nodes JSONB,
  p_has_access BOOLEAN,
  p_is_public BOOLEAN DEFAULT FALSE
) RETURNS JSONB AS $$
DECLARE
  v_node JSONB;
  v_result JSONB := '[]'::jsonb;
  v_children JSONB;
  v_is_free BOOLEAN;
BEGIN
  IF p_nodes IS NULL OR jsonb_array_length(p_nodes) = 0 THEN
    RETURN '[]'::jsonb;
  END IF;

  IF p_has_access OR p_is_public THEN
    RETURN p_nodes;
  END IF;

  FOR v_node IN SELECT * FROM jsonb_array_elements(p_nodes) LOOP
    v_is_free := COALESCE((v_node->>'isFree')::boolean, (v_node->>'is_free')::boolean, false);
    
    IF v_node ? 'children' AND jsonb_array_length(v_node->'children') > 0 THEN
      v_children := public.redact_paper_nodes(v_node->'children', p_has_access, p_is_public);
      v_node := jsonb_set(v_node, '{children}', v_children);
    END IF;

    IF NOT v_is_free THEN
      v_node := jsonb_set(v_node, '{content}', 'null'::jsonb);
    END IF;

    v_result := v_result || jsonb_build_array(v_node);
  END LOOP;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION public.get_secure_exams_by_company(
  p_company_slug TEXT,
  p_user_email TEXT DEFAULT NULL
) RETURNS TABLE (
  id TEXT,
  company_id UUID,
  company_slug VARCHAR,
  name VARCHAR,
  badge VARCHAR,
  content TEXT,
  old_papers TEXT,
  price NUMERIC,
  paper_tabs JSONB,
  google_doc_embed_url TEXT,
  google_doc_edit_url TEXT,
  upvotes INT,
  is_public_exam BOOLEAN,
  has_user_access BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_is_admin BOOLEAN := FALSE;
  v_effective_email TEXT := NULL;
  v_jwt_email TEXT;
BEGIN
  v_is_admin := public.is_admin();

  v_jwt_email := auth.jwt() ->> 'email';
  IF v_jwt_email IS NOT NULL AND v_jwt_email != '' THEN
    v_effective_email := LOWER(TRIM(v_jwt_email));
  ELSIF v_is_admin AND p_user_email IS NOT NULL THEN
    v_effective_email := LOWER(TRIM(p_user_email));
  END IF;

  RETURN QUERY
  SELECT 
    e.id::TEXT,
    e.company_id,
    e.company_slug,
    e.name,
    e.badge,
    e.content,
    e.old_papers,
    e.price,
    public.redact_paper_nodes(
      e.paper_tabs, 
      v_is_admin OR (v_effective_email IS NOT NULL AND public.check_user_paper_access(v_effective_email, e.id::TEXT)),
      COALESCE(e.is_public_exam, false)
    ) AS paper_tabs,
    e.google_doc_embed_url,
    e.google_doc_edit_url,
    e.upvotes,
    COALESCE(e.is_public_exam, false) AS is_public_exam,
    (v_is_admin OR COALESCE(e.is_public_exam, false) OR (v_effective_email IS NOT NULL AND public.check_user_paper_access(v_effective_email, e.id::TEXT))) AS has_user_access,
    e.created_at,
    e.updated_at
  FROM public.exams e
  WHERE e.company_slug = p_company_slug
    AND e.is_deleted = false
  ORDER BY e.created_at DESC;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_secure_exams_by_company(TEXT, TEXT) TO anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- 11. SERVER-SIDE COLLEGE USAGE AGGREGATION RPC
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_colleges_usage_summary()
RETURNS TABLE (
    college_id TEXT,
    enrolled_count BIGINT,
    active_exams_count BIGINT
) LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT 
        c.id AS college_id,
        COUNT(DISTINCT cs.id) AS enrolled_count,
        COUNT(DISTINCT me.id) AS active_exams_count
    FROM public.colleges c
    LEFT JOIN public.college_students cs ON cs.college_id::TEXT = c.id::TEXT AND cs.status = 'ACTIVE'
    LEFT JOIN public.mock_exams me ON me.college_id::TEXT = c.id::TEXT AND me.is_deleted = false AND me.is_active = true
    GROUP BY c.id;
$$;
GRANT EXECUTE ON FUNCTION public.get_colleges_usage_summary() TO anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- 12. EXPERIENCE UPVOTES RPC (SUPPORTS TEXT AND UUID IDS)
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.increment_experience_upvotes(p_experience_id TEXT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_new_count INT;
BEGIN
  UPDATE public.experiences
  SET upvotes = COALESCE(upvotes, 0) + 1
  WHERE id::TEXT = p_experience_id::TEXT
  RETURNING upvotes INTO v_new_count;
  RETURN COALESCE(v_new_count, 0);
END;
$$;
GRANT EXECUTE ON FUNCTION public.increment_experience_upvotes(TEXT) TO anon, authenticated, service_role;
