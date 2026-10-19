-- ====================================================================
-- PrepUnite: Master Consolidated Recent Migrations (All Targets C -> I)
-- File: database/CONSOLIDATED_ALL_RECENT_MIGRATIONS.sql
-- Target: Supabase SQL Editor
--
-- PURPOSE:
-- Executes all database migrations, tables, columns, security policies,
-- triggers, indexes, and RPCs from the last 20 to 30 git pushes in ONE shot.
--
-- SAFETY:
-- 100% IDEMPOTENT. All statements use IF NOT EXISTS, CREATE OR REPLACE,
-- and DROP POLICY IF EXISTS. Running this script multiple times is completely
-- safe and will NOT overwrite or duplicate existing student data.
-- ====================================================================

BEGIN;

-- ── 0. PostgreSQL Extensions ─────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ── 1. TARGET C: STUDENT EXAM & SCORING TAMPER PROTECTION ────────────

-- 1.1 Add Proctoring & Anti-Cheat Columns on student_exam_attempts
ALTER TABLE public.student_exam_attempts 
  ADD COLUMN IF NOT EXISTS tab_switch_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS proctor_events JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS responses JSONB DEFAULT '{}'::jsonb;

-- 1.2 Anti-Tamper Trigger: Protect exam attempt score columns from client forgery
CREATE OR REPLACE FUNCTION public.protect_exam_attempt_score_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF (auth.jwt() ->> 'role') != 'service_role' AND current_user != 'postgres' THEN
    IF (OLD.status IN ('SUBMITTED', 'GRADED', 'TIMED_OUT', 'TERMINATED_MALPRACTICE')) THEN
      RAISE EXCEPTION 'Finalized exam attempts are immutable.';
    END IF;
    NEW.total_score := OLD.total_score;
    NEW.percentage := OLD.percentage;
    NEW.passed := OLD.passed;
    NEW.max_possible_score := OLD.max_possible_score;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_attempt_scores ON public.student_exam_attempts;
CREATE TRIGGER trg_protect_attempt_scores
BEFORE UPDATE ON public.student_exam_attempts
FOR EACH ROW
EXECUTE FUNCTION public.protect_exam_attempt_score_columns();

-- 1.3 Anti-Leak View: Prevent exposure of correct_answer during exams
CREATE OR REPLACE VIEW public.safe_topic_questions AS
SELECT 
  id, 
  topic_id, 
  statement, 
  options, 
  difficulty, 
  question_number,
  structured_explanation->>'passage' AS passage,
  structured_explanation->>'passageTitle' AS passageTitle
FROM public.topic_questions
WHERE COALESCE(is_deleted, false) = false AND COALESCE(is_hidden, false) = false;

GRANT SELECT ON public.safe_topic_questions TO authenticated, anon;

-- 1.4 Server-Side Clock Timestamp RPC: Eliminates laptop clock skew
CREATE OR REPLACE FUNCTION public.get_server_timestamp()
RETURNS TIMESTAMPTZ
LANGUAGE sql
STABLE
AS $$
  SELECT NOW();
$$;

GRANT EXECUTE ON FUNCTION public.get_server_timestamp() TO authenticated, anon;


-- ── 2. TARGET D: PAYMENT GATEWAY & WEBHOOK IDEMPOTENCY ───────────────

-- 2.1 Server-Side Pre-Order Ledger (payment_orders)
CREATE TABLE IF NOT EXISTS public.payment_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(255) UNIQUE NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  item_type VARCHAR(64) NOT NULL,
  amount_paise INTEGER NOT NULL,
  amount_inr NUMERIC(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR' NOT NULL,
  exam_id VARCHAR(255),
  status VARCHAR(32) DEFAULT 'CREATED' NOT NULL,
  payment_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payment_orders_user_email ON public.payment_orders(user_email);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON public.payment_orders(status);
CREATE INDEX IF NOT EXISTS idx_payment_orders_order_id ON public.payment_orders(order_id);

ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own payment orders" ON public.payment_orders;
CREATE POLICY "Users can read own payment orders"
  ON public.payment_orders FOR SELECT
  USING (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_email = auth.jwt()->>'email'
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Admins have full access to payment orders" ON public.payment_orders;
CREATE POLICY "Admins have full access to payment orders"
  ON public.payment_orders FOR ALL
  USING (public.is_admin());

-- 2.2 Idempotent Webhook Events Store (webhook_events)
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id VARCHAR(255) UNIQUE NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB,
  processed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON public.webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON public.webhook_events(event_type);

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins have full access to webhook events" ON public.webhook_events;
CREATE POLICY "Admins have full access to webhook events"
  ON public.webhook_events FOR ALL
  USING (public.is_admin());


-- ── 3. TARGET E: TECHNICAL CODING WORKSPACE & ONLINE JUDGE ────────────

-- 3.1 Immutable Code Submissions Audit Ledger
CREATE TABLE IF NOT EXISTS public.user_technical_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) NOT NULL,
    problem_id VARCHAR(100) NOT NULL,
    language VARCHAR(50) NOT NULL,
    source_code TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    runtime_ms INTEGER DEFAULT 0 NOT NULL,
    memory_kb INTEGER DEFAULT 0 NOT NULL,
    passed_cases INTEGER DEFAULT 0 NOT NULL,
    total_cases INTEGER DEFAULT 0 NOT NULL,
    error_output TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_submissions_user_problem ON public.user_technical_submissions(user_email, problem_id);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON public.user_technical_submissions(created_at DESC);

ALTER TABLE public.user_technical_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own submissions" ON public.user_technical_submissions;
CREATE POLICY "Users read own submissions"
  ON public.user_technical_submissions FOR SELECT
  USING (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_email = auth.jwt()->>'email'
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Users insert own submissions" ON public.user_technical_submissions;
CREATE POLICY "Users insert own submissions"
  ON public.user_technical_submissions FOR INSERT
  WITH CHECK (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_email = auth.jwt()->>'email'
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Super admins manage submissions" ON public.user_technical_submissions;
CREATE POLICY "Super admins manage submissions"
  ON public.user_technical_submissions FOR ALL
  USING (public.is_admin());

-- 3.2 Add sample_cases and hidden_test_cases columns on technical_problems
ALTER TABLE public.technical_problems 
  ADD COLUMN IF NOT EXISTS sample_cases JSONB DEFAULT '[]'::jsonb NOT NULL,
  ADD COLUMN IF NOT EXISTS hidden_test_cases JSONB DEFAULT '[]'::jsonb NOT NULL;

-- 3.3 Secure Progress Tables RLS
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_technical_progress') THEN
    ALTER TABLE public.user_technical_progress ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users manage own technical progress" ON public.user_technical_progress;
    CREATE POLICY "Users manage own technical progress" ON public.user_technical_progress FOR ALL
      USING (user_email = (SELECT email FROM public.profiles WHERE id = auth.uid()) OR user_email = auth.jwt()->>'email' OR public.is_admin());
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_mcq_progress') THEN
    ALTER TABLE public.user_mcq_progress ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users manage own mcq progress" ON public.user_mcq_progress;
    CREATE POLICY "Users manage own mcq progress" ON public.user_mcq_progress FOR ALL
      USING (user_email = (SELECT email FROM public.profiles WHERE id = auth.uid()) OR user_email = auth.jwt()->>'email' OR public.is_admin());
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_interview_progress') THEN
    ALTER TABLE public.user_interview_progress ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users manage own interview progress" ON public.user_interview_progress;
    CREATE POLICY "Users manage own interview progress" ON public.user_interview_progress FOR ALL
      USING (user_email = (SELECT email FROM public.profiles WHERE id = auth.uid()) OR user_email = auth.jwt()->>'email' OR public.is_admin());
  END IF;
END $$;


-- ── 4. TARGET F: COMMUNITY PLACEMENT EXPERIENCES & UPVOTES ────────────

-- 4.1 Experiences Table & Column Invariants
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id VARCHAR(255),
    company_slug VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    role_title VARCHAR(255) NOT NULL DEFAULT 'Software Engineer',
    student_name VARCHAR(255) NOT NULL DEFAULT 'Anonymous Student',
    college VARCHAR(255),
    year INT DEFAULT 2026,
    difficulty VARCHAR(50) DEFAULT 'MEDIUM',
    verdict VARCHAR(50) DEFAULT 'SELECTED',
    drive_type VARCHAR(50) DEFAULT 'ON_CAMPUS',
    rounds JSONB DEFAULT '[]'::JSONB,
    overall_experience TEXT,
    description TEXT,
    tips TEXT,
    upvotes INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'PENDING',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email VARCHAR(255)
);

ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS company_id VARCHAR(255);
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS company_slug VARCHAR(255);
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS user_email VARCHAR(255);
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS upvotes INT DEFAULT 0;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'PENDING';

CREATE INDEX IF NOT EXISTS idx_experiences_company_slug ON public.experiences(company_slug);
CREATE INDEX IF NOT EXISTS idx_experiences_status ON public.experiences(status);
CREATE INDEX IF NOT EXISTS idx_experiences_user_id ON public.experiences(user_id);

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read approved experiences" ON public.experiences;
CREATE POLICY "Public read approved experiences" ON public.experiences FOR SELECT
  USING (status = 'APPROVED' AND COALESCE(is_deleted, false) = false);

DROP POLICY IF EXISTS "Users can read own pending experiences" ON public.experiences;
CREATE POLICY "Users can read own pending experiences" ON public.experiences FOR SELECT
  USING (
    user_id = auth.uid() 
    OR user_email = auth.jwt()->>'email'
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Authenticated users create pending experiences" ON public.experiences;
CREATE POLICY "Authenticated users create pending experiences" ON public.experiences FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins full access to experiences" ON public.experiences;
CREATE POLICY "Admins full access to experiences" ON public.experiences FOR ALL
  USING (public.is_admin());

-- 4.2 User Experience Upvotes Ledger
CREATE TABLE IF NOT EXISTS public.user_experience_upvotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_experience_user_upvote UNIQUE(experience_id, user_email)
);

CREATE INDEX IF NOT EXISTS idx_upvotes_user_email ON public.user_experience_upvotes(user_email);
CREATE INDEX IF NOT EXISTS idx_upvotes_experience_id ON public.user_experience_upvotes(experience_id);

ALTER TABLE public.user_experience_upvotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own experience upvotes" ON public.user_experience_upvotes;
CREATE POLICY "Users manage own experience upvotes" ON public.user_experience_upvotes FOR ALL
  USING (user_email = (SELECT email FROM public.profiles WHERE id = auth.uid()) OR user_email = auth.jwt()->>'email' OR public.is_admin());

-- 4.3 Atomic Upvote Toggle RPC
CREATE OR REPLACE FUNCTION public.toggle_experience_upvote(
    p_experience_id UUID,
    p_user_id UUID,
    p_user_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_clean_email TEXT;
    v_has_upvoted BOOLEAN;
    v_new_count INT;
BEGIN
    v_clean_email := LOWER(TRIM(COALESCE(p_user_email, '')));
    IF v_clean_email = '' THEN
        RAISE EXCEPTION 'A valid user email is required to vote.';
    END IF;

    SELECT EXISTS(
        SELECT 1 FROM public.user_experience_upvotes
        WHERE experience_id = p_experience_id AND user_email = v_clean_email
    ) INTO v_has_upvoted;

    IF v_has_upvoted THEN
        DELETE FROM public.user_experience_upvotes
        WHERE experience_id = p_experience_id AND user_email = v_clean_email;

        UPDATE public.experiences
        SET upvotes = GREATEST(0, COALESCE(upvotes, 1) - 1), updated_at = NOW()
        WHERE id = p_experience_id
        RETURNING upvotes INTO v_new_count;

        RETURN jsonb_build_object('hasUpvoted', false, 'upvotes', v_new_count);
    ELSE
        INSERT INTO public.user_experience_upvotes (experience_id, user_id, user_email)
        VALUES (p_experience_id, p_user_id, v_clean_email)
        ON CONFLICT (experience_id, user_email) DO NOTHING;

        UPDATE public.experiences
        SET upvotes = COALESCE(upvotes, 0) + 1, updated_at = NOW()
        WHERE id = p_experience_id
        RETURNING upvotes INTO v_new_count;

        RETURN jsonb_build_object('hasUpvoted', true, 'upvotes', v_new_count);
    END IF;
END;
$$;

-- 4.4 Invariants & Submission Moderation Trigger
CREATE OR REPLACE FUNCTION public.enforce_experience_submission_invariants()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_is_admin BOOLEAN;
BEGIN
    v_is_admin := public.is_admin();

    IF TG_OP = 'INSERT' THEN
        IF NOT v_is_admin THEN
            NEW.status := 'PENDING';
            NEW.upvotes := 0;
            NEW.is_deleted := false;
        ELSE
            IF NEW.status IS NULL OR TRIM(NEW.status) = '' THEN
                NEW.status := 'APPROVED';
            END IF;
            NEW.upvotes := COALESCE(NEW.upvotes, 0);
            NEW.is_deleted := COALESCE(NEW.is_deleted, false);
        END IF;

        IF auth.uid() IS NOT NULL THEN
            NEW.user_id := auth.uid();
        END IF;
        IF auth.jwt()->>'email' IS NOT NULL THEN
            NEW.user_email := LOWER(TRIM(auth.jwt()->>'email'));
        ELSIF NEW.user_email IS NOT NULL THEN
            NEW.user_email := LOWER(TRIM(NEW.user_email));
        END IF;

        NEW.created_at := COALESCE(NEW.created_at, NOW());
        NEW.updated_at := NOW();
        RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN
        NEW.updated_at := NOW();

        IF NOT v_is_admin THEN
            NEW.status := OLD.status;
            NEW.upvotes := OLD.upvotes;
            NEW.user_id := OLD.user_id;
            NEW.user_email := OLD.user_email;
            NEW.created_at := OLD.created_at;

            IF OLD.status <> 'PENDING' THEN
                RAISE EXCEPTION 'Cannot modify an interview experience after administrative review.';
            END IF;
        END IF;

        RETURN NEW;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_experience_invariants ON public.experiences;
CREATE TRIGGER trg_enforce_experience_invariants
    BEFORE INSERT OR UPDATE ON public.experiences
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_experience_submission_invariants();

-- 4.5 Anti-Spam Feedback Rate Limit RPC
CREATE OR REPLACE FUNCTION public.check_feedback_rate_limit(
    p_email TEXT,
    p_type TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_norm_email TEXT;
    v_count INT := 0;
    v_max INT := 5;
BEGIN
    v_norm_email := LOWER(TRIM(COALESCE(p_email, auth.jwt()->>'email', '')));

    IF v_norm_email = '' THEN
        RETURN jsonb_build_object('allowed', true, 'count', 0, 'max', v_max, 'remaining', v_max);
    END IF;

    IF p_type = 'contact_message' THEN
        v_max := 3;
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contact_messages') THEN
            SELECT COUNT(*) INTO v_count
            FROM public.contact_messages
            WHERE LOWER(TRIM(email)) = v_norm_email
              AND created_at >= NOW() - INTERVAL '24 hours'
              AND NOT (subject LIKE 'MOCK_EXAM_BLUEPRINT:%' OR subject LIKE 'B2B_%');
        END IF;
    ELSE
        v_max := 5;
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'question_reports') THEN
            SELECT COUNT(*) INTO v_count
            FROM public.question_reports
            WHERE LOWER(TRIM(reporter_email)) = v_norm_email
              AND created_at >= NOW() - INTERVAL '24 hours';
        END IF;
    END IF;

    RETURN jsonb_build_object(
        'allowed', (v_count < v_max),
        'count', v_count,
        'max', v_max,
        'remaining', GREATEST(0, v_max - v_count)
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_feedback_rate_limit(TEXT, TEXT) TO anon, authenticated, service_role;



-- ── 5. TARGET G: APTITUDE LEARNING, BOOKMARKS & CATEGORY STATS ────────

-- 5.1 User Question Progress Table
CREATE TABLE IF NOT EXISTS public.user_question_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    question_id VARCHAR(255) NOT NULL,
    topic_id VARCHAR(150),
    category_slug VARCHAR(100),
    difficulty VARCHAR(20) DEFAULT 'MEDIUM',
    selected_option VARCHAR(10),
    correct_option VARCHAR(10),
    wrong_attempts INT DEFAULT 0,
    is_solved BOOLEAN NOT NULL DEFAULT FALSE,
    is_revealed BOOLEAN NOT NULL DEFAULT FALSE,
    first_try_correct BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_user_question UNIQUE (user_email, question_id)
);

ALTER TABLE public.user_question_progress 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_uqp_user_email ON public.user_question_progress(user_email);
CREATE INDEX IF NOT EXISTS idx_uqp_topic_id ON public.user_question_progress(topic_id);

ALTER TABLE public.user_question_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own question progress" ON public.user_question_progress;
CREATE POLICY "Users can manage own question progress" ON public.user_question_progress FOR ALL
  USING (user_email = (SELECT email FROM public.profiles WHERE id = auth.uid()) OR user_email = auth.jwt()->>'email' OR public.is_admin());

-- 5.2 Aptitude Category Aggregation RPC
CREATE OR REPLACE FUNCTION public.get_aptitude_category_stats(p_category_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_clean_slug TEXT;
    v_total INT := 0;
    v_easy INT := 0;
    v_medium INT := 0;
    v_hard INT := 0;
    v_topic_counts JSONB := '{}'::JSONB;
BEGIN
    v_clean_slug := LOWER(TRIM(COALESCE(p_category_slug, '')));

    WITH cat_topics AS (
        SELECT id, LOWER(TRIM(id)) AS norm_id
        FROM public.aptitude_topics
        WHERE LOWER(TRIM(category_slug)) = v_clean_slug
    ),
    q_stats AS (
        SELECT 
            ct.id AS topic_id,
            UPPER(COALESCE(tq.difficulty, 'MEDIUM')) AS diff,
            COUNT(*)::INT as cnt
        FROM cat_topics ct
        JOIN public.topic_questions tq 
          ON (
            LOWER(TRIM(tq.topic_id)) = ct.norm_id
            OR (ct.norm_id = 'reading-comprehension' AND LOWER(TRIM(tq.topic_id)) = 'comprehension')
            OR (ct.norm_id = 'comprehension' AND LOWER(TRIM(tq.topic_id)) = 'reading-comprehension')
          )
        WHERE COALESCE(tq.is_deleted, false) = false
        GROUP BY ct.id, UPPER(COALESCE(tq.difficulty, 'MEDIUM'))
    ),
    topic_agg AS (
        SELECT topic_id, SUM(cnt)::INT as total_in_topic
        FROM q_stats
        GROUP BY topic_id
    )
    SELECT
        COALESCE(SUM(cnt), 0)::INT,
        COALESCE(SUM(cnt) FILTER (WHERE diff = 'EASY'), 0)::INT,
        COALESCE(SUM(cnt) FILTER (WHERE diff = 'MEDIUM'), 0)::INT,
        COALESCE(SUM(cnt) FILTER (WHERE diff = 'HARD'), 0)::INT,
        COALESCE(
            (SELECT jsonb_object_agg(topic_id, total_in_topic) FROM topic_agg),
            '{}'::JSONB
        )
    INTO
        v_total, v_easy, v_medium, v_hard, v_topic_counts
    FROM q_stats;

    RETURN jsonb_build_object(
        'totalQuestions', v_total,
        'difficultyStats', jsonb_build_object('easy', v_easy, 'medium', v_medium, 'hard', v_hard),
        'topicQuestionCounts', v_topic_counts
    );
END;
$$;

-- 5.3 DPDP Erase Learning Progress RPC
CREATE OR REPLACE FUNCTION public.erase_user_learning_and_bookmark_data(p_email TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_clean_email TEXT;
    v_prog_deleted INT := 0;
    v_bm_deleted INT := 0;
BEGIN
    v_clean_email := LOWER(TRIM(COALESCE(p_email, '')));
    IF v_clean_email = '' THEN
        RAISE EXCEPTION 'A valid email is required.';
    END IF;

    DELETE FROM public.user_question_progress WHERE LOWER(TRIM(user_email)) = v_clean_email;
    GET DIAGNOSTICS v_prog_deleted = ROW_COUNT;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_bookmarks') THEN
        DELETE FROM public.user_bookmarks WHERE LOWER(TRIM(user_email)) = v_clean_email;
        GET DIAGNOSTICS v_bm_deleted = ROW_COUNT;
    END IF;

    RETURN jsonb_build_object('success', true, 'progressRecordsErased', v_prog_deleted, 'bookmarksErased', v_bm_deleted);
END;
$$;


-- ── 6. TARGET H: COMPANY PLACEMENT PAPERS & DRM ───────────────────────

-- 6.1 Ensure paper_tabs and is_public_exam exist on public.exams
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'exams') THEN
    ALTER TABLE public.exams 
      ADD COLUMN IF NOT EXISTS paper_tabs JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS is_public_exam BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 99;
  END IF;
END $$;

-- 6.2 User Paper Purchases Table (DRM single paper unlock)
CREATE TABLE IF NOT EXISTS public.user_paper_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL,
  exam_id VARCHAR(255) NOT NULL,
  payment_id VARCHAR(255),
  order_id VARCHAR(255),
  amount_inr NUMERIC(10,2) DEFAULT 99 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 year') NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_paper_purchases_email_exam ON public.user_paper_purchases(user_email, exam_id);

ALTER TABLE public.user_paper_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own paper purchases" ON public.user_paper_purchases;
CREATE POLICY "Users can read own paper purchases" ON public.user_paper_purchases FOR SELECT
  USING (user_email = (SELECT email FROM public.profiles WHERE id = auth.uid()) OR user_email = auth.jwt()->>'email' OR public.is_admin());

-- 6.3 Secure Exam Fetchers RPC
CREATE OR REPLACE FUNCTION public.get_secure_exams_by_company(p_company_slug TEXT)
RETURNS SETOF JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT jsonb_build_object(
    'id', e.id,
    'title', e.title,
    'slug', e.slug,
    'company_id', e.company_id,
    'year', e.year,
    'round', e.round,
    'duration_minutes', e.duration_minutes,
    'total_marks', e.total_marks,
    'price', COALESCE(e.price, 99),
    'is_public_exam', COALESCE(e.is_public_exam, false),
    'is_premium', COALESCE(e.is_premium, false),
    'paper_tabs_count', jsonb_array_length(COALESCE(e.paper_tabs, '[]'::jsonb))
  )
  FROM public.exams e
  JOIN public.companies c ON e.company_id = c.id
  WHERE LOWER(c.slug) = LOWER(p_company_slug)
    AND COALESCE(e.is_deleted, false) = false
  ORDER BY e.year DESC, e.created_at DESC;
END;
$$;

-- 6.4 DRM Recursive Paper Nodes Redaction Function
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

-- 6.5 Secure Single Exam Viewer RPC (Deep-link & DRM Protection)
DROP FUNCTION IF EXISTS public.get_secure_exam_by_id(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.get_secure_exam_by_id(TEXT);

CREATE OR REPLACE FUNCTION public.get_secure_exam_by_id(
  p_exam_id TEXT,
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
  WHERE e.id::TEXT = p_exam_id
    AND e.is_deleted = false
  LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_secure_exam_by_id(TEXT, TEXT) TO anon, authenticated, service_role;

-- 6.6 Atomic Exam Paper Tabs Synchronizer RPC
CREATE OR REPLACE FUNCTION public.save_exam_paper_tabs(
  p_exam_id TEXT,
  p_tabs JSONB
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_node JSONB;
  v_child JSONB;
  v_idx INT := 0;
  v_child_idx INT := 0;
  v_active_node_ids TEXT[] := ARRAY[]::TEXT[];
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access Denied: Only authenticated administrators can modify exam paper tabs.';
  END IF;

  UPDATE public.exams
  SET paper_tabs = p_tabs,
      updated_at = NOW()
  WHERE id::TEXT = p_exam_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Exam with ID % not found.', p_exam_id;
  END IF;

  IF p_tabs IS NOT NULL AND jsonb_array_length(p_tabs) > 0 THEN
    FOR v_node IN SELECT * FROM jsonb_array_elements(p_tabs) LOOP
      v_idx := v_idx + 1;
      v_active_node_ids := array_append(v_active_node_ids, v_node->>'id');

      INSERT INTO public.paper_tab_nodes (
        id, exam_id, title, emoji, content, parent_id, sort_order, is_free, is_deleted, updated_at
      ) VALUES (
        v_node->>'id',
        p_exam_id,
        COALESCE(v_node->>'title', 'Untitled Section'),
        COALESCE(v_node->>'emoji', '📄'),
        COALESCE(v_node->>'content', ''),
        NULL,
        v_idx,
        COALESCE((v_node->>'isFree')::boolean, (v_node->>'is_free')::boolean, false),
        FALSE,
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        emoji = EXCLUDED.emoji,
        content = EXCLUDED.content,
        parent_id = EXCLUDED.parent_id,
        sort_order = EXCLUDED.sort_order,
        is_free = EXCLUDED.is_free,
        is_deleted = FALSE,
        updated_at = NOW();

      IF v_node ? 'children' AND jsonb_array_length(v_node->'children') > 0 THEN
        v_child_idx := 0;
        FOR v_child IN SELECT * FROM jsonb_array_elements(v_node->'children') LOOP
          v_child_idx := v_child_idx + 1;
          v_active_node_ids := array_append(v_active_node_ids, v_child->>'id');

          INSERT INTO public.paper_tab_nodes (
            id, exam_id, title, emoji, content, parent_id, sort_order, is_free, is_deleted, updated_at
          ) VALUES (
            v_child->>'id',
            p_exam_id,
            COALESCE(v_child->>'title', 'Untitled Subtab'),
            COALESCE(v_child->>'emoji', '📄'),
            COALESCE(v_child->>'content', ''),
            v_node->>'id',
            v_child_idx,
            COALESCE((v_child->>'isFree')::boolean, (v_child->>'is_free')::boolean, false),
            FALSE,
            NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            emoji = EXCLUDED.emoji,
            content = EXCLUDED.content,
            parent_id = EXCLUDED.parent_id,
            sort_order = EXCLUDED.sort_order,
            is_free = EXCLUDED.is_free,
            is_deleted = FALSE,
            updated_at = NOW();
        END LOOP;
      END IF;
    END LOOP;

    UPDATE public.paper_tab_nodes
    SET is_deleted = TRUE,
        updated_at = NOW()
    WHERE exam_id = p_exam_id
      AND NOT (id = ANY(v_active_node_ids));
  ELSE
    UPDATE public.paper_tab_nodes
    SET is_deleted = TRUE,
        updated_at = NOW()
    WHERE exam_id = p_exam_id;
  END IF;

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.save_exam_paper_tabs(TEXT, JSONB) TO authenticated, service_role;

-- 6.7 DPDP User Paper Purchases Erasure RPC
CREATE OR REPLACE FUNCTION public.erase_user_paper_purchases(
    p_user_id UUID,
    p_user_email TEXT
)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_affected INT := 0;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Administrative privileges required for DPDP right-to-erasure.';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_paper_purchases') THEN
        DELETE FROM public.user_paper_purchases
        WHERE (p_user_id IS NOT NULL AND user_id = p_user_id)
           OR (p_user_email IS NOT NULL AND LOWER(TRIM(user_email)) = LOWER(TRIM(p_user_email)));
        GET DIAGNOSTICS v_affected = ROW_COUNT;
    END IF;

    RETURN v_affected;
END;
$$;

GRANT EXECUTE ON FUNCTION public.erase_user_paper_purchases(UUID, TEXT) TO authenticated, service_role;



-- ── 7. TARGET I & DPDP: AUTH RBAC & USER CONSENT ──────────────────────

-- 7.1 Canonical Super Admin Email Evaluation Function
CREATE OR REPLACE FUNCTION public.is_super_admin_email(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_clean TEXT;
  v_user TEXT;
  v_norm_user TEXT;
  v_norm_email TEXT;
BEGIN
  IF p_email IS NULL OR TRIM(p_email) = '' THEN
    RETURN FALSE;
  END IF;

  v_clean := LOWER(TRIM(p_email));

  IF v_clean IN (
    'venkatmukala9@gmail.com',
    'venkat.mukala9@gmail.com',
    'venkatmukala3@gmail.com',
    'venkat.mukala3@gmail.com',
    'prepsunite@gmail.com'
  ) THEN
    RETURN TRUE;
  END IF;

  IF v_clean LIKE '%@gmail.com' OR v_clean LIKE '%@googlemail.com' THEN
    v_user := split_part(v_clean, '@', 1);

    IF POSITION('+' IN v_user) > 0 THEN
      RETURN FALSE;
    END IF;

    v_norm_user := REPLACE(v_user, '.', '');
    v_norm_email := v_norm_user || '@gmail.com';

    IF v_norm_email IN (
      'venkatmukala9@gmail.com',
      'venkatmukala3@gmail.com',
      'prepsunite@gmail.com'
    ) THEN
      RETURN TRUE;
    END IF;
  END IF;

  RETURN FALSE;
END;
$$;

-- 7.2 Profiles DPDP Columns
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS consent_status VARCHAR(50) DEFAULT 'CONSENT_GRANTED',
  ADD COLUMN IF NOT EXISTS consent_accepted_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_profiles_consent_status ON public.profiles(consent_status);

-- 7.3 DPDP User Consent RPC
CREATE OR REPLACE FUNCTION public.update_user_dpdp_consent(p_status TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID;
  v_status TEXT;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  v_status := UPPER(TRIM(COALESCE(p_status, '')));
  IF v_status NOT IN ('CONSENT_GRANTED', 'CONSENT_WITHDRAWN', 'CONSENT_PENDING') THEN
    RAISE EXCEPTION 'Invalid consent status value.';
  END IF;

  UPDATE public.profiles
  SET 
    consent_status = v_status,
    consent_accepted_at = CASE WHEN v_status = 'CONSENT_GRANTED' THEN NOW() ELSE consent_accepted_at END,
    updated_at = NOW()
  WHERE id = v_uid;

  RETURN jsonb_build_object('success', true, 'status', v_status);
END;
$$;

-- 7.4 DPDP Inactive Profiles Anonymiser
CREATE OR REPLACE FUNCTION public.dpdp_anonymise_inactive_profiles()
RETURNS INTEGER AS $$
DECLARE
  affected INTEGER;
BEGIN
  UPDATE public.profiles
  SET
    name = 'Deleted User',
    avatar_url = NULL,
    updated_at = NOW()
  WHERE
    updated_at < NOW() - INTERVAL '2 years'
    AND LOWER(COALESCE(role, 'student')) != 'admin'
    AND name != 'Deleted User';

  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7.5 DPDP Expire Subscriptions Cleaner
CREATE OR REPLACE FUNCTION public.dpdp_expire_subscriptions()
RETURNS INTEGER AS $$
DECLARE
  affected INTEGER;
BEGIN
  UPDATE public.user_subscriptions
  SET status = 'EXPIRED'
  WHERE status = 'ACTIVE' AND expires_at < NOW();

  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7.6 DPDP Right to Erasure Cascade Function
CREATE OR REPLACE FUNCTION public.dpdp_delete_user_data(target_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  target_user_id UUID;
  v_clean_email TEXT;
  v_caller_email TEXT;
  v_is_authorized BOOLEAN := FALSE;
  v_placeholder_email TEXT;
BEGIN
  IF target_email IS NULL OR TRIM(target_email) = '' THEN
    RAISE EXCEPTION 'Target email cannot be null or empty.';
  END IF;

  v_clean_email := LOWER(TRIM(target_email));
  v_caller_email := LOWER(TRIM(COALESCE(auth.jwt() ->> 'email', '')));

  v_is_authorized := public.is_admin() OR (v_caller_email = v_clean_email AND v_caller_email != '');

  IF NOT v_is_authorized THEN
    RAISE EXCEPTION 'Access Denied: You may only invoke erasure on your own authenticated account.';
  END IF;

  SELECT id INTO target_user_id
  FROM public.profiles
  WHERE LOWER(email) = v_clean_email;

  IF target_user_id IS NULL THEN
    RETURN 'User profile not found for: ' || v_clean_email;
  END IF;

  v_placeholder_email := 'deleted_' || target_user_id || '@deleted.invalid';

  UPDATE public.profiles
  SET
    name = 'Deleted Candidate',
    avatar_url = NULL,
    email = v_placeholder_email,
    consent_status = 'withdrawn',
    consent_accepted_at = NULL,
    updated_at = NOW()
  WHERE id = target_user_id;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'experiences') THEN
    UPDATE public.experiences
    SET
      student_name = 'Anonymous Student',
      college = 'Redacted Institution',
      user_id = NULL,
      user_email = NULL,
      updated_at = NOW()
    WHERE user_id = target_user_id OR LOWER(user_email) = v_clean_email;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_experience_upvotes') THEN
    DELETE FROM public.user_experience_upvotes
    WHERE user_id = target_user_id OR LOWER(user_email) = v_clean_email;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_question_progress') THEN
    DELETE FROM public.user_question_progress
    WHERE user_id = target_user_id OR LOWER(user_email) = v_clean_email;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_bookmarks') THEN
    DELETE FROM public.user_bookmarks
    WHERE user_id = target_user_id OR LOWER(user_email) = v_clean_email;
  END IF;

  RETURN 'DPDP Right to Erasure cascade successfully completed for: ' || v_clean_email;
END;
$$;

GRANT EXECUTE ON FUNCTION public.dpdp_delete_user_data(TEXT) TO authenticated, service_role;

-- 7.7 DPDP Right to Erasure Statutory Request RPC
CREATE OR REPLACE FUNCTION public.request_dpdp_user_deletion(p_reason TEXT DEFAULT 'User requested erasure under Section 12(3) DPDP Act 2023')
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_email TEXT;
  v_res TEXT;
BEGIN
  v_email := auth.jwt() ->> 'email';
  IF v_email IS NULL OR v_email = '' THEN
    RAISE EXCEPTION 'Authentication required to initiate data erasure.';
  END IF;

  v_res := public.dpdp_delete_user_data(v_email);

  RETURN jsonb_build_object(
    'status', 'COMPLETED',
    'message', v_res,
    'timestamp', NOW()
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.request_dpdp_user_deletion(TEXT) TO authenticated;

COMMIT;

