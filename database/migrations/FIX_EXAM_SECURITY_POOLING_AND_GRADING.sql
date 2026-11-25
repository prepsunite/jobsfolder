-- ============================================================================
-- PREPUNITE HARDENING MIGRATION: EXAM SECURITY, POOLING, CLOCKS & GRADING
-- File: database/migrations/FIX_EXAM_SECURITY_POOLING_AND_GRADING.sql
--
-- HIGH-STAKES CHECKPOINT SUMMARY:
--   Tables touched: mock_exams, mock_exam_sections, mock_exam_secrets (new),
--     student_exam_attempts, topic_questions, technical_mcqs,
--     technical_problems, aptitude_topics.
--   RPCs updated/added: get_mock_exam_quota_status, consume_mock_exam_quota,
--     get_aptitude_category_stats, start_mock_exam_attempt,
--     submit_exam_attempt_v2, get_safe_mock_exam_questions,
--     get_mock_exam_attempt_solutions, get_practice_topic_questions,
--     verify_practice_question_answer, get_practice_technical_mcqs,
--     verify_technical_mcq_answer, get_practice_technical_problems,
--     get_practice_problem_solution, get_cheatcode_formulas,
--     create_self_practice_mock_exam.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. SCHEMA ALIGNMENT (Idempotent additions for missing live DB columns)
-- ----------------------------------------------------------------------------
ALTER TABLE public.mock_exams
  ADD COLUMN IF NOT EXISTS enable_sectional_lock BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS enable_passcode_lock BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS access_passcode_hash TEXT;

ALTER TABLE public.mock_exam_sections
  ADD COLUMN IF NOT EXISTS section_type VARCHAR(30) DEFAULT 'MCQ',
  ADD COLUMN IF NOT EXISTS category VARCHAR(100),
  ADD COLUMN IF NOT EXISTS coding_track VARCHAR(50),
  ADD COLUMN IF NOT EXISTS difficulty VARCHAR(20),
  ADD COLUMN IF NOT EXISTS serve_count INT;

ALTER TABLE public.student_exam_attempts
  ADD COLUMN IF NOT EXISTS assigned_question_ids JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS shuffle_seed TEXT,
  ADD COLUMN IF NOT EXISTS server_deadline_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_heartbeat_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS result_summary JSONB;

-- ----------------------------------------------------------------------------
-- 2. DEDICATED SERVER-ONLY SECRETS TABLE FOR EXAM LAB PASSCODES
--    Prevents leaking <!--PASSCODE:PIN--> inside mock_exams.instructions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mock_exam_secrets (
  exam_id TEXT PRIMARY KEY,
  access_passcode TEXT,
  access_passcode_hash TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.mock_exam_secrets ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.mock_exam_secrets FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.mock_exam_secrets TO authenticated, service_role;

DROP POLICY IF EXISTS "Admins and college TPO manage exam secrets" ON public.mock_exam_secrets;
CREATE POLICY "Admins and college TPO manage exam secrets"
  ON public.mock_exam_secrets
  FOR ALL
  TO authenticated
  USING (
    (SELECT public.is_admin())
    OR EXISTS (
      SELECT 1 FROM public.mock_exams me
      WHERE me.id::TEXT = mock_exam_secrets.exam_id
        AND (SELECT public.is_tpo_for_college(me.college_id::TEXT))
    )
  )
  WITH CHECK (
    (SELECT public.is_admin())
    OR EXISTS (
      SELECT 1 FROM public.mock_exams me
      WHERE me.id::TEXT = mock_exam_secrets.exam_id
        AND (SELECT public.is_tpo_for_college(me.college_id::TEXT))
    )
  );

-- Migrate any legacy <!--PASSCODE:PIN--> tags out of mock_exams.instructions
DO $$
DECLARE
  r RECORD;
  v_pin TEXT;
  v_hash TEXT;
BEGIN
  FOR r IN (
    SELECT id::TEXT AS exam_id, instructions
    FROM public.mock_exams
    WHERE instructions ~ '<!--PASSCODE:.*?-->'
  ) LOOP
    v_pin := UPPER(TRIM((regexp_match(r.instructions, '<!--PASSCODE:(.*?)-->'))[1]));
    IF v_pin IS NOT NULL AND v_pin != '' THEN
      v_hash := encode(sha256(convert_to(v_pin, 'UTF8')), 'hex');
      INSERT INTO public.mock_exam_secrets (exam_id, access_passcode, access_passcode_hash, updated_at)
      VALUES (r.exam_id, v_pin, v_hash, NOW())
      ON CONFLICT (exam_id) DO UPDATE SET
        access_passcode = COALESCE(EXCLUDED.access_passcode, mock_exam_secrets.access_passcode),
        access_passcode_hash = COALESCE(EXCLUDED.access_passcode_hash, mock_exam_secrets.access_passcode_hash),
        updated_at = NOW();

      UPDATE public.mock_exams
      SET enable_passcode_lock = TRUE,
          access_passcode_hash = v_hash,
          instructions = regexp_replace(instructions, '<!--PASSCODE:.*?-->\n?', '', 'g')
      WHERE id::TEXT = r.exam_id;
    END IF;
  END LOOP;
END $$;

-- ----------------------------------------------------------------------------
-- 3. FIX QUOTA RPCS (Fix missing c.status column -> COALESCE(c.contract_status,'ACTIVE'))
--    AND PREVENT CROSS-USER QUOTA BURNING / FREE TIER DIRECT EXAM CREATION
-- ----------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.get_mock_exam_quota_status(TEXT);
CREATE OR REPLACE FUNCTION public.get_mock_exam_quota_status(p_user_email TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_normalized_email TEXT;
  v_caller_email TEXT;
  v_month_key TEXT;
  v_sub RECORD;
  v_is_campus_student BOOLEAN := false;
  v_used INTEGER := 0;
  v_limit INTEGER := 0;
  v_plan TEXT := 'FREE';
  v_plan_name TEXT := 'Free Tier';
  v_expires_at TIMESTAMPTZ := NULL;
BEGIN
  v_normalized_email := LOWER(TRIM(COALESCE(p_user_email, '')));
  v_caller_email := LOWER(TRIM(COALESCE(auth.jwt()->>'email', '')));

  IF v_normalized_email = '' OR v_normalized_email = 'guest@prepunite.com' THEN
    RETURN jsonb_build_object(
      'plan', 'FREE', 'planName', 'Free Tier', 'limit', 0, 'used', 0, 'remaining', 0, 'canGenerate', false
    );
  END IF;

  IF COALESCE(auth.jwt()->>'role', '') != 'service_role'
     AND NOT public.is_admin()
     AND (v_caller_email = '' OR v_caller_email != v_normalized_email) THEN
    RAISE EXCEPTION 'Unauthorized: Cannot query another user quota.';
  END IF;

  v_month_key := to_char(NOW(), 'YYYY-MM');

  SELECT EXISTS (
    SELECT 1 FROM public.college_students cs
    JOIN public.colleges c ON cs.college_id::TEXT = c.id::TEXT
    WHERE LOWER(TRIM(cs.email)) = v_normalized_email
      AND COALESCE(cs.status, 'ACTIVE') IN ('ACTIVE', 'ENROLLED')
      AND COALESCE(c.is_deleted, false) = false
      AND COALESCE(c.contract_status, 'ACTIVE') = 'ACTIVE'
      AND (c.valid_until IS NULL OR c.valid_until > NOW())
  ) INTO v_is_campus_student;

  IF NOT v_is_campus_student THEN
    SELECT EXISTS (
      SELECT 1 FROM public.user_subscriptions
      WHERE LOWER(TRIM(user_email)) = v_normalized_email
        AND payment_id LIKE 'B2B_CAMPUS_%'
        AND status = 'ACTIVE'
        AND expires_at > NOW()
    ) INTO v_is_campus_student;
  END IF;

  IF v_is_campus_student THEN
    RETURN jsonb_build_object(
      'plan', 'COLLEGE', 'planName', 'Campus Partner Pass', 'limit', 999, 'used', 0, 'remaining', 999, 'canGenerate', true
    );
  END IF;

  SELECT * INTO v_sub
  FROM public.user_subscriptions
  WHERE LOWER(TRIM(user_email)) = v_normalized_email
    AND status = 'ACTIVE'
    AND expires_at > NOW()
  ORDER BY expires_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'plan', 'FREE', 'planName', 'Free Tier', 'limit', 0, 'used', 0, 'remaining', 0, 'canGenerate', false
    );
  END IF;

  v_expires_at := v_sub.expires_at;

  IF v_sub.plan_name ILIKE '%ULTRA%' THEN
    RETURN jsonb_build_object(
      'plan', 'ULTRA', 'planName', v_sub.plan_name, 'limit', 999, 'used', 0, 'remaining', 999, 'canGenerate', true, 'expiresAt', v_expires_at
    );
  END IF;

  v_plan := 'PRO';
  v_plan_name := v_sub.plan_name;
  v_limit := 5;

  SELECT COALESCE(used_count, 0) INTO v_used
  FROM public.user_mock_exam_quotas
  WHERE LOWER(TRIM(user_email)) = v_normalized_email AND month_key = v_month_key;

  RETURN jsonb_build_object(
    'plan', v_plan, 'planName', v_plan_name, 'limit', v_limit, 'used', COALESCE(v_used, 0),
    'remaining', GREATEST(0, v_limit - COALESCE(v_used, 0)), 'canGenerate', (COALESCE(v_used, 0) < v_limit), 'expiresAt', v_expires_at
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_mock_exam_quota_status(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_mock_exam_quota_status(TEXT) TO authenticated, service_role;


DROP FUNCTION IF EXISTS public.consume_mock_exam_quota(TEXT, UUID);
DROP FUNCTION IF EXISTS public.consume_mock_exam_quota(TEXT, TEXT);
CREATE OR REPLACE FUNCTION public.consume_mock_exam_quota(
  p_user_email TEXT,
  p_exam_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_normalized_email TEXT;
  v_caller_email TEXT;
  v_month_key TEXT;
  v_sub RECORD;
  v_is_campus_student BOOLEAN := false;
  v_is_ultra BOOLEAN := false;
  v_quota_limit INTEGER := 0;
  v_current_used INTEGER := 0;
  v_new_used INTEGER := 0;
BEGIN
  v_normalized_email := LOWER(TRIM(COALESCE(p_user_email, '')));
  v_caller_email := LOWER(TRIM(COALESCE(auth.jwt()->>'email', '')));
  v_month_key := to_char(NOW(), 'YYYY-MM');

  IF v_normalized_email = '' OR v_normalized_email = 'guest@prepunite.com' THEN
    RAISE EXCEPTION 'Free tier does not include blueprint mock exams. Please sign in and upgrade to Pro or Ultra.';
  END IF;

  IF COALESCE(auth.jwt()->>'role', '') != 'service_role'
     AND NOT public.is_admin()
     AND (v_caller_email = '' OR v_caller_email != v_normalized_email) THEN
    RAISE EXCEPTION 'Unauthorized: Cannot consume another user quota.';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.college_students cs
    JOIN public.colleges c ON cs.college_id::TEXT = c.id::TEXT
    WHERE LOWER(TRIM(cs.email)) = v_normalized_email
      AND COALESCE(cs.status, 'ACTIVE') IN ('ACTIVE', 'ENROLLED')
      AND COALESCE(c.is_deleted, false) = false
      AND COALESCE(c.contract_status, 'ACTIVE') = 'ACTIVE'
      AND (c.valid_until IS NULL OR c.valid_until > NOW())
  ) INTO v_is_campus_student;

  IF NOT v_is_campus_student THEN
    SELECT EXISTS (
      SELECT 1 FROM public.user_subscriptions
      WHERE LOWER(TRIM(user_email)) = v_normalized_email
        AND payment_id LIKE 'B2B_CAMPUS_%'
        AND status = 'ACTIVE'
        AND expires_at > NOW()
    ) INTO v_is_campus_student;
  END IF;

  IF v_is_campus_student THEN
    RETURN jsonb_build_object(
      'success', true, 'plan', 'COLLEGE', 'limit', 999, 'used', 0, 'remaining', 999,
      'message', 'Institutional Campus Pass: Unlimited mock exams enabled.'
    );
  END IF;

  SELECT * INTO v_sub
  FROM public.user_subscriptions
  WHERE LOWER(TRIM(user_email)) = v_normalized_email
    AND status = 'ACTIVE'
    AND expires_at > NOW()
  ORDER BY expires_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Free tier does not include blueprint mock exams. Please upgrade to Pro (5 exams/mo) or Ultra (unlimited).';
  END IF;

  IF v_sub.plan_name ILIKE '%ULTRA%' THEN
    v_is_ultra := true;
  ELSE
    v_quota_limit := 5;
  END IF;

  IF v_is_ultra THEN
    RETURN jsonb_build_object(
      'success', true, 'plan', 'ULTRA', 'limit', 999, 'used', 0, 'remaining', 999,
      'message', 'Ultra Pass: Unlimited mock exams enabled.'
    );
  END IF;

  INSERT INTO public.user_mock_exam_quotas (user_email, month_key, used_count, created_at, updated_at)
  VALUES (v_normalized_email, v_month_key, 0, NOW(), NOW())
  ON CONFLICT (user_email, month_key) DO NOTHING;

  SELECT used_count INTO v_current_used
  FROM public.user_mock_exam_quotas
  WHERE user_email = v_normalized_email AND month_key = v_month_key
  FOR UPDATE;

  IF v_current_used >= v_quota_limit THEN
    RAISE EXCEPTION 'Monthly mock exam generation quota exceeded (%/%). Upgrade to Ultra for unlimited exams.', v_current_used, v_quota_limit;
  END IF;

  v_new_used := v_current_used + 1;

  UPDATE public.user_mock_exam_quotas
  SET used_count = v_new_used, updated_at = NOW()
  WHERE user_email = v_normalized_email AND month_key = v_month_key;

  RETURN jsonb_build_object(
    'success', true, 'plan', 'PRO', 'limit', v_quota_limit, 'used', v_new_used,
    'remaining', v_quota_limit - v_new_used, 'message', 'Mock exam quota successfully deducted.'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.consume_mock_exam_quota(TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.consume_mock_exam_quota(TEXT, TEXT) TO authenticated, service_role;

-- ----------------------------------------------------------------------------
-- 4. CLOSE FREE-TIER DIRECT INSERT ON MOCK_EXAMS & TIGHTEN ATTEMPTS RLS
-- ----------------------------------------------------------------------------
-- Students must create SELF exams via /api/campus-exams or RPC (enforcing quota)
DROP POLICY IF EXISTS "Student create self practice exams" ON public.mock_exams;
DROP POLICY IF EXISTS "Student manage self practice exams" ON public.mock_exams;

-- Harden student_exam_attempts policies: remove tautological OR EXISTS INSERT hole
DROP POLICY IF EXISTS "Super admin full attempts" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Student manage own attempts" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Student select own attempts" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Student insert own in_progress attempt" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Student update in_progress attempt responses" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Student submit own attempt" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "TPO view college attempts" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "TPO manage college exam attempts" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Attempts select policy" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Attempts write policy" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Attempts insert admin only" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Attempts update policy" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Attempts delete admin only" ON public.student_exam_attempts;

CREATE POLICY "Attempts select policy"
  ON public.student_exam_attempts
  FOR SELECT
  TO authenticated
  USING (
    (SELECT public.is_admin())
    OR student_id::TEXT = (SELECT auth.uid())::TEXT
    OR LOWER(COALESCE(student_id::TEXT, '')) = LOWER(COALESCE((SELECT auth.jwt()->>'email'), ''))
    OR LOWER(COALESCE(student_email, '')) = LOWER(COALESCE((SELECT auth.jwt()->>'email'), ''))
    OR (SELECT public.is_tpo_for_college(college_id::TEXT))
    OR EXISTS (
      SELECT 1 FROM public.mock_exams me
      WHERE me.id::TEXT = student_exam_attempts.mock_exam_id::TEXT
        AND (SELECT public.is_tpo_for_college(me.college_id::TEXT))
    )
  );

-- Direct client INSERT restricted to admins/TPOs; candidates start via start_mock_exam_attempt RPC or /api/campus-exams
CREATE POLICY "Attempts insert admin only"
  ON public.student_exam_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT public.is_admin()));

-- Candidates can only sync responses/heartbeat while IN_PROGRESS; trigger protects score/status/timing/seed columns
CREATE POLICY "Attempts update policy"
  ON public.student_exam_attempts
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT public.is_admin())
    OR (
      COALESCE(status, 'IN_PROGRESS') = 'IN_PROGRESS'
      AND (
        student_id::TEXT = (SELECT auth.uid())::TEXT
        OR LOWER(COALESCE(student_id::TEXT, '')) = LOWER(COALESCE((SELECT auth.jwt()->>'email'), ''))
        OR LOWER(COALESCE(student_email, '')) = LOWER(COALESCE((SELECT auth.jwt()->>'email'), ''))
      )
    )
  )
  WITH CHECK (
    (SELECT public.is_admin())
    OR (
      COALESCE(status, 'IN_PROGRESS') = 'IN_PROGRESS'
      AND (
        student_id::TEXT = (SELECT auth.uid())::TEXT
        OR LOWER(COALESCE(student_id::TEXT, '')) = LOWER(COALESCE((SELECT auth.jwt()->>'email'), ''))
        OR LOWER(COALESCE(student_email, '')) = LOWER(COALESCE((SELECT auth.jwt()->>'email'), ''))
      )
    )
  );

CREATE POLICY "Attempts delete admin only"
  ON public.student_exam_attempts
  FOR DELETE
  TO authenticated
  USING ((SELECT public.is_admin()));

-- Strengthen anti-tamper trigger: only trusted RPCs (prepunite.trusted_rpc='on'), service_role, or admins can mutate protected columns
CREATE OR REPLACE FUNCTION public.protect_exam_attempt_score_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_is_trusted BOOLEAN;
BEGIN
  v_is_trusted := (
    COALESCE(current_setting('prepunite.trusted_rpc', true), '') = 'on'
    OR COALESCE((SELECT auth.jwt() ->> 'role'), '') = 'service_role'
    OR (SELECT public.is_admin())
  );

  IF NOT v_is_trusted THEN
    IF OLD.status IN ('SUBMITTED', 'GRADED', 'TIMED_OUT', 'TERMINATED_MALPRACTICE') THEN
      RAISE EXCEPTION 'Finalized exam attempts are immutable.';
    END IF;

    -- Freeze server-authoritative fields against client REST tampering
    NEW.total_score := OLD.total_score;
    NEW.max_possible_score := OLD.max_possible_score;
    NEW.percentage := OLD.percentage;
    NEW.passed := OLD.passed;
    NEW.status := OLD.status;
    NEW.started_at := OLD.started_at;
    NEW.submitted_at := OLD.submitted_at;
    NEW.assigned_question_ids := OLD.assigned_question_ids;
    NEW.shuffle_seed := OLD.shuffle_seed;
    NEW.server_deadline_at := OLD.server_deadline_at;
    NEW.result_summary := OLD.result_summary;
    NEW.tab_switch_count := GREATEST(COALESCE(OLD.tab_switch_count, 0), COALESCE(NEW.tab_switch_count, 0));

    -- Preserve prior proctor_events log monotonically
    IF OLD.proctor_events IS NOT NULL
       AND jsonb_typeof(OLD.proctor_events) = 'array'
       AND (NEW.proctor_events IS NULL OR jsonb_typeof(NEW.proctor_events) != 'array'
            OR jsonb_array_length(NEW.proctor_events) < jsonb_array_length(OLD.proctor_events)) THEN
      NEW.proctor_events := OLD.proctor_events;
    END IF;
  END IF;

  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_attempt_scores ON public.student_exam_attempts;
CREATE TRIGGER trg_protect_attempt_scores
  BEFORE UPDATE ON public.student_exam_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_exam_attempt_score_columns();

-- ----------------------------------------------------------------------------
-- 5. LOCK DOWN RAW QUESTION BANKS & ANSWER COLUMNS FROM NON-ADMIN DIRECT READS
--    (Students read sanitized items via RPCs & /api/campus-exams)
-- ----------------------------------------------------------------------------
-- 5.1 topic_questions
DROP POLICY IF EXISTS "Public read topic_questions" ON public.topic_questions;
DROP POLICY IF EXISTS "Admin read topic_questions" ON public.topic_questions;
CREATE POLICY "Admin read topic_questions"
  ON public.topic_questions
  FOR SELECT
  TO authenticated
  USING ((SELECT public.is_admin()));

-- 5.2 technical_mcqs
DROP POLICY IF EXISTS "Public read technical_mcqs" ON public.technical_mcqs;
DROP POLICY IF EXISTS "Admin read technical_mcqs" ON public.technical_mcqs;
CREATE POLICY "Admin read technical_mcqs"
  ON public.technical_mcqs
  FOR SELECT
  TO authenticated
  USING ((SELECT public.is_admin()));

-- 5.3 technical_problems
DROP POLICY IF EXISTS "Public read technical_problems" ON public.technical_problems;
DROP POLICY IF EXISTS "Admin read technical_problems" ON public.technical_problems;
CREATE POLICY "Admin read technical_problems"
  ON public.technical_problems
  FOR SELECT
  TO authenticated
  USING ((SELECT public.is_admin()));

-- Drop & recreate safe_topic_questions (DROP VIEW prevents 42P16 on column casing/layout changes)
DROP VIEW IF EXISTS public.safe_topic_questions CASCADE;
CREATE VIEW public.safe_topic_questions
WITH (security_invoker = true) AS
SELECT
  id,
  topic_id,
  statement,
  options,
  difficulty,
  question_number,
  CASE
    WHEN structured_explanation IS NOT NULL AND jsonb_typeof(to_jsonb(structured_explanation)) = 'object'
      THEN (to_jsonb(structured_explanation) ->> 'passage')
    ELSE NULL
  END AS passage,
  CASE
    WHEN structured_explanation IS NOT NULL AND jsonb_typeof(to_jsonb(structured_explanation)) = 'object'
      THEN (to_jsonb(structured_explanation) ->> 'passageTitle')
    ELSE NULL
  END AS passagetitle
FROM public.topic_questions
WHERE COALESCE(is_deleted, false) = false AND COALESCE(is_hidden, false) = false;

REVOKE ALL ON public.safe_topic_questions FROM PUBLIC, anon;
GRANT SELECT ON public.safe_topic_questions TO authenticated, service_role;

-- ----------------------------------------------------------------------------
-- 6. SAFE EXAM & PRACTICE RPCS (Never leak answers during active/live exams)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._is_question_locked_for_caller(p_q_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid TEXT := COALESCE(auth.uid()::TEXT, '');
  v_email TEXT := LOWER(TRIM(COALESCE(auth.jwt()->>'email', '')));
BEGIN
  IF public.is_admin() THEN
    RETURN FALSE;
  END IF;

  -- Locked if question is inside any IN_PROGRESS attempt of caller
  IF v_uid != '' OR v_email != '' THEN
    IF EXISTS (
      SELECT 1
      FROM public.student_exam_attempts sea
      JOIN public.mock_exam_sections mes ON mes.mock_exam_id::TEXT = sea.mock_exam_id::TEXT
      WHERE sea.status = 'IN_PROGRESS'
        AND (
          (v_uid != '' AND sea.student_id::TEXT = v_uid)
          OR (v_email != '' AND (LOWER(COALESCE(sea.student_id::TEXT, '')) = v_email OR LOWER(COALESCE(sea.student_email, '')) = v_email))
        )
        AND p_q_id = ANY(COALESCE(mes.question_ids, '{}'::TEXT[]))
    ) THEN
      RETURN TRUE;
    END IF;
  END IF;

  -- Locked if question is inside a currently LIVE scheduled campus/public exam (window active)
  IF EXISTS (
    SELECT 1
    FROM public.mock_exams me
    JOIN public.mock_exam_sections mes ON mes.mock_exam_id::TEXT = me.id::TEXT
    WHERE COALESCE(me.is_deleted, false) = false
      AND COALESCE(me.is_active, true) = true
      AND COALESCE(me.college_id::TEXT, '') NOT IN ('SELF', 'INDIVIDUAL')
      AND (me.start_time IS NOT NULL OR me.end_time IS NOT NULL)
      AND (me.start_time IS NULL OR NOW() >= me.start_time)
      AND (me.end_time IS NULL OR NOW() < me.end_time)
      AND p_q_id = ANY(COALESCE(mes.question_ids, '{}'::TEXT[]))
  ) THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$;

REVOKE ALL ON FUNCTION public._is_question_locked_for_caller(TEXT) FROM PUBLIC, anon, authenticated;

-- 6.1 Sanitized Mock Exam Question Loader (MCQs + Tech MCQs + Coding, ZERO answers/solutions/hidden cases)
DROP FUNCTION IF EXISTS public.get_safe_mock_exam_questions(TEXT[]);
CREATE OR REPLACE FUNCTION public.get_safe_mock_exam_questions(p_question_ids TEXT[])
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_result JSONB := '[]'::jsonb;
  v_q RECORD;
  v_se JSONB;
  v_passage TEXT;
  v_passage_title TEXT;
BEGIN
  IF p_question_ids IS NULL OR array_length(p_question_ids, 1) IS NULL THEN
    RETURN '[]'::jsonb;
  END IF;

  -- 1. topic_questions (no correct_answer, no explanation, only passage stimulus)
  FOR v_q IN
    SELECT id::TEXT AS id, statement, options, difficulty, topic_id, question_number, structured_explanation
    FROM public.topic_questions
    WHERE id::TEXT = ANY(p_question_ids)
      AND COALESCE(is_deleted, false) = false
      AND COALESCE(is_hidden, false) = false
  LOOP
    v_passage := NULL;
    v_passage_title := NULL;
    BEGIN
      v_se := CASE
        WHEN jsonb_typeof(to_jsonb(v_q.structured_explanation)) = 'string'
          THEN (v_q.structured_explanation::TEXT)::JSONB
        ELSE to_jsonb(v_q.structured_explanation)
      END;
      v_passage := v_se ->> 'passage';
      v_passage_title := v_se ->> 'passageTitle';
    EXCEPTION WHEN OTHERS THEN
      v_passage := NULL;
      v_passage_title := NULL;
    END;

    v_result := v_result || jsonb_build_object(
      'id', v_q.id,
      'statement', v_q.statement,
      'options', v_q.options,
      'difficulty', v_q.difficulty,
      'topic_id', v_q.topic_id,
      'question_number', v_q.question_number,
      'passage', v_passage,
      'passageTitle', v_passage_title,
      'structured_explanation', CASE WHEN v_passage IS NOT NULL OR v_passage_title IS NOT NULL
        THEN jsonb_build_object('passage', v_passage, 'passageTitle', v_passage_title)
        ELSE NULL END
    );
  END LOOP;

  -- 2. technical_mcqs (no correct_option_index, no explanation)
  FOR v_q IN
    SELECT id::TEXT AS id, question, code_snippet, options, difficulty, topic_id
    FROM public.technical_mcqs
    WHERE id::TEXT = ANY(p_question_ids)
      AND COALESCE(is_deleted, false) = false
      AND COALESCE(is_hidden, false) = false
  LOOP
    v_result := v_result || jsonb_build_object(
      'id', v_q.id,
      'statement', v_q.question,
      'code_snippet', v_q.code_snippet,
      'options', v_q.options,
      'difficulty', COALESCE(v_q.difficulty, 'MEDIUM'),
      'topic_id', v_q.topic_id,
      'isTechnicalMcq', true
    );
  END LOOP;

  -- 3. technical_problems (visible sample cases only; strips hidden_test_cases and solutions)
  FOR v_q IN
    SELECT id::TEXT AS id, title, description, constraints, sample_input, sample_output,
           sample_cases, test_cases, level, category
    FROM public.technical_problems
    WHERE id::TEXT = ANY(p_question_ids)
      AND COALESCE(is_deleted, false) = false
      AND COALESCE(is_hidden, false) = false
  LOOP
    v_result := v_result || jsonb_build_object(
      'id', v_q.id,
      'title', v_q.title,
      'statement', v_q.description,
      'description', v_q.description,
      'options', '[]'::jsonb,
      'difficulty', COALESCE(v_q.level, 'MEDIUM'),
      'topic_id', v_q.category,
      'constraints', v_q.constraints,
      'sample_input', v_q.sample_input,
      'sample_output', v_q.sample_output,
      'test_cases', COALESCE((
        SELECT jsonb_agg(tc)
        FROM jsonb_array_elements(
          CASE
            WHEN v_q.sample_cases IS NOT NULL AND jsonb_typeof(to_jsonb(v_q.sample_cases)) = 'array' AND jsonb_array_length(to_jsonb(v_q.sample_cases)) > 0 THEN to_jsonb(v_q.sample_cases)
            WHEN v_q.test_cases IS NOT NULL AND jsonb_typeof(to_jsonb(v_q.test_cases)) = 'array' THEN to_jsonb(v_q.test_cases)
            ELSE '[]'::jsonb
          END
        ) tc
        WHERE COALESCE((tc ->> 'is_hidden')::BOOLEAN, false) = false
      ), '[]'::jsonb),
      'isCodingProblem', true
    );
  END LOOP;

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.get_safe_mock_exam_questions(TEXT[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_safe_mock_exam_questions(TEXT[]) TO authenticated, service_role;

-- 6.2 Safe Practice Topic Questions Loader (no correct_answer / explanation sent upfront)
DROP FUNCTION IF EXISTS public.get_practice_topic_questions(TEXT[], TEXT, INT, INT);
CREATE OR REPLACE FUNCTION public.get_practice_topic_questions(
  p_topic_ids TEXT[],
  p_difficulty TEXT DEFAULT 'ALL',
  p_limit INT DEFAULT 60,
  p_offset INT DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_items JSONB;
BEGIN
  SELECT COALESCE(jsonb_agg(row_obj), '[]'::jsonb)
  INTO v_items
  FROM (
    SELECT jsonb_build_object(
      'id', tq.id::TEXT,
      'topic_id', tq.topic_id,
      'question_number', tq.question_number,
      'statement', tq.statement,
      'options', tq.options,
      'difficulty', COALESCE(tq.difficulty, 'MEDIUM'),
      'difficulty_level', COALESCE(tq.difficulty_level, 2),
      'is_hidden', COALESCE(tq.is_hidden, false),
      'created_at', tq.created_at,
      'sample_input', tq.sample_input,
      'sample_output', tq.sample_output,
      'passage', CASE
        WHEN tq.structured_explanation IS NOT NULL AND jsonb_typeof(to_jsonb(tq.structured_explanation)) = 'object'
          THEN (to_jsonb(tq.structured_explanation) ->> 'passage')
        ELSE NULL END,
      'passageTitle', CASE
        WHEN tq.structured_explanation IS NOT NULL AND jsonb_typeof(to_jsonb(tq.structured_explanation)) = 'object'
          THEN (to_jsonb(tq.structured_explanation) ->> 'passageTitle')
        ELSE NULL END,
      'answer_locked', public._is_question_locked_for_caller(tq.id::TEXT)
    ) AS row_obj
    FROM public.topic_questions tq
    WHERE tq.topic_id = ANY(p_topic_ids)
      AND COALESCE(tq.is_deleted, false) = false
      AND COALESCE(tq.is_hidden, false) = false
      AND (p_difficulty IS NULL OR UPPER(p_difficulty) = 'ALL' OR UPPER(COALESCE(tq.difficulty, 'MEDIUM')) = UPPER(p_difficulty))
    ORDER BY tq.question_number ASC NULLS LAST, tq.created_at ASC
    LIMIT LEAST(GREATEST(COALESCE(p_limit, 60), 1), 100)
    OFFSET GREATEST(COALESCE(p_offset, 0), 0)
  ) sub;

  RETURN v_items;
END;
$$;

REVOKE ALL ON FUNCTION public.get_practice_topic_questions(TEXT[], TEXT, INT, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_practice_topic_questions(TEXT[], TEXT, INT, INT) TO anon, authenticated, service_role;

-- 6.3 Practice Answer Verification RPC (authenticated only, blocked during live/in-progress exam)
DROP FUNCTION IF EXISTS public.verify_practice_question_answer(TEXT, TEXT, BOOLEAN);
CREATE OR REPLACE FUNCTION public.verify_practice_question_answer(
  p_question_id TEXT,
  p_selected_option TEXT DEFAULT NULL,
  p_reveal BOOLEAN DEFAULT FALSE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_q RECORD;
  v_raw TEXT;
  v_correct_letter TEXT;
  v_sel TEXT;
  v_is_correct BOOLEAN := FALSE;
BEGIN
  IF auth.uid() IS NULL AND COALESCE(auth.jwt()->>'role', '') != 'service_role' THEN
    RAISE EXCEPTION 'Authentication required to verify answers.';
  END IF;

  IF public._is_question_locked_for_caller(p_question_id) THEN
    RETURN jsonb_build_object(
      'locked', true,
      'is_correct', false,
      'message', 'Answer verification is disabled while this question is part of an active examination window.'
    );
  END IF;

  SELECT id::TEXT AS id, correct_answer, explanation, structured_explanation
  INTO v_q
  FROM public.topic_questions
  WHERE id::TEXT = p_question_id
    AND COALESCE(is_deleted, false) = false;

  IF v_q IS NULL THEN
    RAISE EXCEPTION 'Question not found.';
  END IF;

  v_raw := UPPER(TRIM(COALESCE(v_q.correct_answer::TEXT, '0')));
  IF v_raw ~ '^\d+$' THEN
    v_correct_letter := CHR(65 + LEAST(GREATEST(v_raw::INT, 0), 5));
  ELSIF v_raw ~ '^[A-F]$' THEN
    v_correct_letter := v_raw;
  ELSE
    v_correct_letter := 'A';
  END IF;

  IF p_selected_option IS NOT NULL AND TRIM(p_selected_option) != '' THEN
    v_sel := UPPER(TRIM(p_selected_option));
    IF v_sel ~ '^\d+$' THEN
      v_sel := CHR(65 + LEAST(GREATEST(v_sel::INT, 0), 5));
    END IF;
    v_is_correct := (v_sel = v_correct_letter);
  END IF;

  RETURN jsonb_build_object(
    'locked', false,
    'is_correct', v_is_correct,
    'correct_answer', CASE WHEN v_is_correct OR COALESCE(p_reveal, false) THEN v_correct_letter ELSE NULL END,
    'explanation', CASE WHEN v_is_correct OR COALESCE(p_reveal, false) THEN COALESCE(v_q.explanation, '') ELSE NULL END,
    'structured_explanation', CASE WHEN v_is_correct OR COALESCE(p_reveal, false) THEN v_q.structured_explanation ELSE NULL END
  );
END;
$$;

REVOKE ALL ON FUNCTION public.verify_practice_question_answer(TEXT, TEXT, BOOLEAN) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.verify_practice_question_answer(TEXT, TEXT, BOOLEAN) TO authenticated, service_role;

-- 6.4 Practice Technical MCQs & Coding Safe RPCs
DROP FUNCTION IF EXISTS public.get_practice_technical_mcqs(TEXT);
CREATE OR REPLACE FUNCTION public.get_practice_technical_mcqs(p_topic_id TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_items JSONB;
BEGIN
  SELECT COALESCE(jsonb_agg(row_obj), '[]'::jsonb)
  INTO v_items
  FROM (
    SELECT jsonb_build_object(
      'id', tm.id::TEXT,
      'topic_id', tm.topic_id,
      'topic_name', tm.topic_name,
      'topic_category', tm.topic_category,
      'question', tm.question,
      'code_snippet', tm.code_snippet,
      'options', tm.options,
      'company_tags', tm.company_tags,
      'difficulty', COALESCE(tm.difficulty, 'MEDIUM'),
      'sort_order', COALESCE(tm.sort_order, 0),
      'created_at', tm.created_at,
      'answer_locked', public._is_question_locked_for_caller(tm.id::TEXT)
    ) AS row_obj
    FROM public.technical_mcqs tm
    WHERE COALESCE(tm.is_deleted, false) = false
      AND COALESCE(tm.is_hidden, false) = false
      AND (p_topic_id IS NULL OR tm.topic_id = p_topic_id)
    ORDER BY tm.sort_order ASC, tm.created_at ASC
  ) sub;
  RETURN v_items;
END;
$$;

REVOKE ALL ON FUNCTION public.get_practice_technical_mcqs(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_practice_technical_mcqs(TEXT) TO anon, authenticated, service_role;

DROP FUNCTION IF EXISTS public.verify_technical_mcq_answer(TEXT, INT, BOOLEAN);
CREATE OR REPLACE FUNCTION public.verify_technical_mcq_answer(
  p_mcq_id TEXT,
  p_selected_index INT DEFAULT NULL,
  p_reveal BOOLEAN DEFAULT FALSE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_m RECORD;
  v_is_correct BOOLEAN := FALSE;
BEGIN
  IF auth.uid() IS NULL AND COALESCE(auth.jwt()->>'role', '') != 'service_role' THEN
    RAISE EXCEPTION 'Authentication required to verify Technical MCQ answers.';
  END IF;

  IF public._is_question_locked_for_caller(p_mcq_id) THEN
    RETURN jsonb_build_object(
      'locked', true,
      'is_correct', false,
      'message', 'Answer verification is disabled while this question is part of an active examination window.'
    );
  END IF;

  SELECT id::TEXT AS id, correct_option_index, explanation
  INTO v_m
  FROM public.technical_mcqs
  WHERE id::TEXT = p_mcq_id
    AND COALESCE(is_deleted, false) = false;

  IF v_m IS NULL THEN
    RAISE EXCEPTION 'Technical MCQ not found.';
  END IF;

  IF p_selected_index IS NOT NULL THEN
    v_is_correct := (p_selected_index = v_m.correct_option_index);
  END IF;

  RETURN jsonb_build_object(
    'locked', false,
    'is_correct', v_is_correct,
    'correct_option_index', CASE WHEN v_is_correct OR COALESCE(p_reveal, false) THEN v_m.correct_option_index ELSE NULL END,
    'explanation', CASE WHEN v_is_correct OR COALESCE(p_reveal, false) THEN COALESCE(v_m.explanation, '') ELSE NULL END
  );
END;
$$;

REVOKE ALL ON FUNCTION public.verify_technical_mcq_answer(TEXT, INT, BOOLEAN) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.verify_technical_mcq_answer(TEXT, INT, BOOLEAN) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.get_practice_technical_problems(TEXT, TEXT);
CREATE OR REPLACE FUNCTION public.get_practice_technical_problems(
  p_track TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_items JSONB;
BEGIN
  SELECT COALESCE(jsonb_agg(row_obj), '[]'::jsonb)
  INTO v_items
  FROM (
    SELECT jsonb_build_object(
      'id', tp.id::TEXT,
      'topic_id', tp.topic_id,
      'track', tp.track,
      'title', tp.title,
      'slug', tp.slug,
      'level', tp.level,
      'category', tp.category,
      'category_label', tp.category_label,
      'description', tp.description,
      'constraints', tp.constraints,
      'sample_input', tp.sample_input,
      'sample_output', tp.sample_output,
      'test_cases', COALESCE((
        SELECT jsonb_agg(tc)
        FROM jsonb_array_elements(
          CASE
            WHEN tp.sample_cases IS NOT NULL AND jsonb_typeof(to_jsonb(tp.sample_cases)) = 'array' AND jsonb_array_length(to_jsonb(tp.sample_cases)) > 0 THEN to_jsonb(tp.sample_cases)
            WHEN tp.test_cases IS NOT NULL AND jsonb_typeof(to_jsonb(tp.test_cases)) = 'array' THEN to_jsonb(tp.test_cases)
            ELSE '[]'::jsonb
          END
        ) tc
        WHERE COALESCE((tc ->> 'is_hidden')::BOOLEAN, false) = false
      ), '[]'::jsonb),
      'time_complexity', tp.time_complexity,
      'space_complexity', tp.space_complexity,
      'hints', tp.hints,
      'company_tags', tp.company_tags,
      'sort_order', tp.sort_order,
      'created_at', tp.created_at
    ) AS row_obj
    FROM public.technical_problems tp
    WHERE COALESCE(tp.is_deleted, false) = false
      AND COALESCE(tp.is_hidden, false) = false
      AND (p_track IS NULL OR tp.track = p_track)
      AND (p_category IS NULL OR tp.category = p_category)
    ORDER BY tp.sort_order ASC, tp.created_at ASC
  ) sub;
  RETURN v_items;
END;
$$;

REVOKE ALL ON FUNCTION public.get_practice_technical_problems(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_practice_technical_problems(TEXT, TEXT) TO anon, authenticated, service_role;

DROP FUNCTION IF EXISTS public.get_practice_problem_solution(TEXT);
CREATE OR REPLACE FUNCTION public.get_practice_problem_solution(p_problem_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_p RECORD;
BEGIN
  IF auth.uid() IS NULL AND COALESCE(auth.jwt()->>'role', '') != 'service_role' THEN
    RAISE EXCEPTION 'Authentication required to inspect reference solutions.';
  END IF;

  IF public._is_question_locked_for_caller(p_problem_id) THEN
    RETURN jsonb_build_object('locked', true, 'message', 'Solutions are locked during active exam sessions.');
  END IF;

  SELECT id::TEXT AS id, explanation, solutions, time_complexity, space_complexity
  INTO v_p
  FROM public.technical_problems
  WHERE id::TEXT = p_problem_id AND COALESCE(is_deleted, false) = false;

  IF v_p IS NULL THEN
    RETURN jsonb_build_object('locked', false, 'solutions', '{}'::jsonb, 'explanation', '');
  END IF;

  RETURN jsonb_build_object(
    'locked', false,
    'explanation', COALESCE(v_p.explanation, ''),
    'solutions', COALESCE(v_p.solutions, '{}'::jsonb),
    'time_complexity', v_p.time_complexity,
    'space_complexity', v_p.space_complexity
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_practice_problem_solution(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_practice_problem_solution(TEXT) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.get_cheatcode_formulas(TEXT);
CREATE OR REPLACE FUNCTION public.get_cheatcode_formulas(p_topic_id TEXT)
RETURNS TEXT[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_formulas TEXT[] := '{}'::TEXT[];
BEGIN
  SELECT COALESCE(array_agg(DISTINCT f), '{}'::TEXT[])
  INTO v_formulas
  FROM (
    SELECT TRIM(elem) AS f
    FROM public.topic_questions tq,
         LATERAL jsonb_array_elements_text(
           CASE
             WHEN tq.structured_explanation IS NOT NULL AND jsonb_typeof(to_jsonb(tq.structured_explanation)) = 'object' THEN
               CASE
                 WHEN jsonb_typeof(COALESCE(to_jsonb(tq.structured_explanation) -> 'formulaUsed', to_jsonb(tq.structured_explanation) -> 'formulasUsed')) = 'array'
                   THEN COALESCE(to_jsonb(tq.structured_explanation) -> 'formulaUsed', to_jsonb(tq.structured_explanation) -> 'formulasUsed')
                 ELSE '[]'::jsonb
               END
             ELSE '[]'::jsonb
           END
         ) elem
    WHERE tq.topic_id = p_topic_id
      AND COALESCE(tq.is_deleted, false) = false
      AND COALESCE(tq.is_hidden, false) = false
    LIMIT 100
  ) s
  WHERE f != '';
  RETURN v_formulas;
END;
$$;

REVOKE ALL ON FUNCTION public.get_cheatcode_formulas(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_cheatcode_formulas(TEXT) TO anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- 7. FIX get_aptitude_category_stats SLUG NORMALIZATION & HIDDEN FILTER
-- ----------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.get_aptitude_category_stats(TEXT);
CREATE OR REPLACE FUNCTION public.get_aptitude_category_stats(p_category_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_clean_slug TEXT;
  v_total INT := 0;
  v_easy INT := 0;
  v_medium INT := 0;
  v_hard INT := 0;
  v_topic_counts JSONB := '{}'::JSONB;
BEGIN
  v_clean_slug := CASE LOWER(TRIM(COALESCE(p_category_slug, '')))
    WHEN 'non-verbal-reasoning' THEN 'nonverbal-reasoning'
    WHEN 'nonverbal' THEN 'nonverbal-reasoning'
    WHEN 'tech-aptitude' THEN 'technical-aptitude'
    ELSE LOWER(TRIM(COALESCE(p_category_slug, '')))
  END;

  WITH cat_topics AS (
    SELECT id, LOWER(TRIM(id)) AS norm_id
    FROM public.aptitude_topics
    WHERE LOWER(TRIM(category_slug)) = v_clean_slug
      AND COALESCE(is_hidden, false) = false
  ),
  matched_questions AS (
    SELECT DISTINCT
      ct.norm_id AS topic_id,
      tq.id AS question_id,
      UPPER(COALESCE(tq.difficulty, 'MEDIUM')) AS diff
    FROM cat_topics ct
    JOIN public.topic_questions tq
      ON LOWER(TRIM(tq.topic_id)) = ct.norm_id
      OR REGEXP_REPLACE(LOWER(TRIM(tq.topic_id)), '[^a-z0-9]', '', 'g') = REGEXP_REPLACE(ct.norm_id, '[^a-z0-9]', '', 'g')
    WHERE COALESCE(tq.is_deleted, false) = false
      AND COALESCE(tq.is_hidden, false) = false
  ),
  q_stats AS (
    SELECT topic_id, diff, COUNT(*)::INT AS cnt
    FROM matched_questions
    GROUP BY topic_id, diff
  ),
  topic_agg AS (
    SELECT topic_id, SUM(cnt)::INT AS total_in_topic
    FROM q_stats
    GROUP BY topic_id
  )
  SELECT
    COALESCE(SUM(cnt), 0)::INT,
    COALESCE(SUM(cnt) FILTER (WHERE diff = 'EASY'), 0)::INT,
    COALESCE(SUM(cnt) FILTER (WHERE diff = 'MEDIUM'), 0)::INT,
    COALESCE(SUM(cnt) FILTER (WHERE diff = 'HARD'), 0)::INT,
    COALESCE((SELECT jsonb_object_agg(topic_id, total_in_topic) FROM topic_agg), '{}'::JSONB)
  INTO v_total, v_easy, v_medium, v_hard, v_topic_counts
  FROM q_stats;

  RETURN jsonb_build_object(
    'category_slug', v_clean_slug,
    'total_questions', COALESCE(v_total, 0),
    'easy_total', COALESCE(v_easy, 0),
    'medium_total', COALESCE(v_medium, 0),
    'hard_total', COALESCE(v_hard, 0),
    'topic_counts', COALESCE(v_topic_counts, '{}'::JSONB)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_aptitude_category_stats(TEXT) TO anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- 8. AUTHORITATIVE SERVER EXAM START, GRADING v2 & SOLUTION UNLOCK RPCS
-- ----------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.start_mock_exam_attempt(TEXT, TEXT);
CREATE OR REPLACE FUNCTION public.start_mock_exam_attempt(
  p_exam_id TEXT,
  p_passcode TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid TEXT := COALESCE(auth.uid()::TEXT, '');
  v_email TEXT := LOWER(TRIM(COALESCE(auth.jwt()->>'email', '')));
  v_exam RECORD;
  v_secret RECORD;
  v_existing RECORD;
  v_attempt_id TEXT;
  v_seed TEXT;
  v_section RECORD;
  v_assigned JSONB := '[]'::jsonb;
  v_sec_serve INT;
  v_pool TEXT[];
  v_picked TEXT[];
  v_deadline TIMESTAMPTZ;
  v_clean_pin TEXT;
  v_pin_hash TEXT;
BEGIN
  IF v_uid = '' OR v_email = '' THEN
    RAISE EXCEPTION 'Authentication required to start an assessment.';
  END IF;

  SELECT * INTO v_exam
  FROM public.mock_exams
  WHERE id::TEXT = p_exam_id
    AND COALESCE(is_deleted, false) = false;

  IF v_exam IS NULL THEN
    RAISE EXCEPTION 'Assessment not found.';
  END IF;

  IF COALESCE(v_exam.is_active, true) = false AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'This assessment is currently inactive.';
  END IF;

  -- Authoritative server schedule guard
  IF NOT public.is_admin() THEN
    IF v_exam.start_time IS NOT NULL AND NOW() < v_exam.start_time THEN
      RAISE EXCEPTION 'Assessment window has not opened yet.';
    END IF;
    IF v_exam.end_time IS NOT NULL AND NOW() >= v_exam.end_time THEN
      RAISE EXCEPTION 'Assessment window has already concluded.';
    END IF;
  END IF;

  -- Tier access check
  IF UPPER(COALESCE(v_exam.college_id::TEXT, '')) IN ('SELF', 'INDIVIDUAL') THEN
    IF NOT public.is_admin()
       AND COALESCE(v_exam.created_by::TEXT, '') != v_uid
       AND NOT (v_email = ANY(COALESCE(v_exam.target_departments, '{}'::TEXT[]))) THEN
      RAISE EXCEPTION 'Forbidden: This private practice assessment belongs to another user.';
    END IF;
  ELSIF UPPER(COALESCE(v_exam.college_id::TEXT, '')) NOT IN ('PUBLIC', 'OPEN') THEN
    IF NOT public.is_admin() AND NOT public.is_tpo_for_college(v_exam.college_id::TEXT) THEN
      IF NOT EXISTS (
        SELECT 1 FROM public.college_students cs
        LEFT JOIN public.colleges c ON (
          c.id::TEXT = cs.college_id::TEXT
          OR LOWER(c.code) = LOWER(TRIM(cs.college_id::TEXT))
          OR LOWER(c.slug) = LOWER(TRIM(cs.college_id::TEXT))
        )
        WHERE (
          cs.college_id::TEXT = v_exam.college_id::TEXT
          OR c.id::TEXT = v_exam.college_id::TEXT
        )
        AND (LOWER(TRIM(cs.email)) = v_email OR cs.user_id::TEXT = v_uid)
        AND COALESCE(cs.status, 'ACTIVE') IN ('ACTIVE', 'ENROLLED')
      ) THEN
        RAISE EXCEPTION 'Forbidden: You are not enrolled in the authorized college for this drive.';
      END IF;
    END IF;
  END IF;

  -- Resume existing attempt if found
  SELECT * INTO v_existing
  FROM public.student_exam_attempts
  WHERE mock_exam_id::TEXT = p_exam_id
    AND (student_id::TEXT = v_uid OR LOWER(COALESCE(student_id::TEXT, '')) = v_email OR LOWER(COALESCE(student_email, '')) = v_email)
  ORDER BY created_at DESC
  LIMIT 1
  FOR UPDATE;

  IF v_existing IS NOT NULL THEN
    RETURN to_jsonb(v_existing);
  END IF;

  -- Server-side passcode verification (never skips or leaks plaintext PIN)
  SELECT * INTO v_secret FROM public.mock_exam_secrets WHERE exam_id = p_exam_id;
  IF COALESCE(v_exam.enable_passcode_lock, false) = true OR v_secret IS NOT NULL OR v_exam.access_passcode_hash IS NOT NULL THEN
    v_clean_pin := UPPER(TRIM(COALESCE(p_passcode, '')));
    IF v_clean_pin = '' THEN
      RAISE EXCEPTION 'Passcode required to unlock this examination.';
    END IF;
    v_pin_hash := encode(sha256(convert_to(v_clean_pin, 'UTF8')), 'hex');
    IF v_pin_hash != COALESCE(v_secret.access_passcode_hash, v_exam.access_passcode_hash, '')
       AND v_clean_pin != UPPER(TRIM(COALESCE(v_secret.access_passcode, ''))) THEN
      RAISE EXCEPTION 'Invalid lab access PIN.';
    END IF;
  END IF;

  v_attempt_id := 'att-' || p_exam_id || '-' || regexp_replace(v_email, '[^a-zA-Z0-9_-]', '_', 'g');
  v_seed := encode(sha256(convert_to(v_attempt_id || ':' || clock_timestamp()::TEXT || ':' || random()::TEXT, 'UTF8')), 'hex');

  -- Deterministic server subset assignment per section
  FOR v_section IN
    SELECT * FROM public.mock_exam_sections
    WHERE mock_exam_id::TEXT = p_exam_id
    ORDER BY section_order ASC
  LOOP
    v_pool := COALESCE(v_section.question_ids, '{}'::TEXT[]);
    v_sec_serve := LEAST(COALESCE(array_length(v_pool, 1), 0), GREATEST(1, COALESCE(v_section.serve_count, array_length(v_pool, 1), 1)));
    IF v_sec_serve > 0 THEN
      IF COALESCE(v_exam.shuffle_questions, true) THEN
        SELECT array_agg(qid ORDER BY encode(sha256(convert_to(v_seed || ':' || v_section.id::TEXT || ':' || qid, 'UTF8')), 'hex'))
        INTO v_picked
        FROM (
          SELECT unnest(v_pool) AS qid
        ) s;
        v_picked := v_picked[1:v_sec_serve];
      ELSE
        v_picked := v_pool[1:v_sec_serve];
      END IF;
      v_assigned := v_assigned || to_jsonb(COALESCE(v_picked, '{}'::TEXT[]));
    END IF;
  END LOOP;

  v_deadline := NOW() + (COALESCE(v_exam.duration_minutes, 90) * INTERVAL '1 minute');
  IF v_exam.end_time IS NOT NULL THEN
    v_deadline := LEAST(v_deadline, v_exam.end_time);
  END IF;

  SET LOCAL prepunite.trusted_rpc = 'on';

  INSERT INTO public.student_exam_attempts (
    id, mock_exam_id, student_id, student_email, college_id, status,
    started_at, server_deadline_at, last_heartbeat_at, time_spent_seconds,
    total_score, max_possible_score, percentage, passed,
    tab_switch_count, proctor_events, responses, assigned_question_ids, shuffle_seed
  ) VALUES (
    v_attempt_id, p_exam_id, v_uid, v_email, COALESCE(v_exam.college_id::TEXT, 'PUBLIC'), 'IN_PROGRESS',
    NOW(), v_deadline, NOW(), 0,
    0, 0, 0, false,
    0, '[]'::jsonb, '{}'::jsonb, v_assigned, v_seed
  )
  ON CONFLICT (id) DO UPDATE SET updated_at = NOW()
  RETURNING * INTO v_existing;

  RETURN to_jsonb(v_existing);
END;
$$;

REVOKE ALL ON FUNCTION public.start_mock_exam_attempt(TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.start_mock_exam_attempt(TEXT, TEXT) TO authenticated, service_role;


-- Unified Server-Authoritative Grading RPC v2
DROP FUNCTION IF EXISTS public.submit_exam_attempt_v2(TEXT, JSONB, INT, JSONB, INT, TEXT);
CREATE OR REPLACE FUNCTION public.submit_exam_attempt_v2(
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
  v_total_score NUMERIC := 0.00;
  v_max_possible_score NUMERIC := 0.00;
  v_percentage NUMERIC := 0.00;
  v_passed BOOLEAN := false;
  v_status TEXT;
  v_graded_responses JSONB := '{}'::jsonb;
  v_item_resp JSONB;
  v_marked_review BOOLEAN;
  v_time_spent INT;
  v_raw_correct TEXT;
  v_effective_tab_switches INT;
  v_is_service BOOLEAN := (COALESCE((SELECT auth.jwt()->>'role'), '') = 'service_role');
  v_owner_email TEXT;
  v_actual_elapsed INT;
  v_deadline TIMESTAMPTZ;

  v_sec_q_count INT;
  v_sec_attempted INT;
  v_sec_correct INT;
  v_sec_incorrect INT;
  v_sec_score NUMERIC;
  v_sec_max NUMERIC;
  v_clamped_sec_score NUMERIC;

  v_total_questions INT := 0;
  v_total_attempted INT := 0;
  v_total_correct INT := 0;
  v_total_incorrect INT := 0;
  v_sections_summary JSONB := '[]'::jsonb;
  v_result_summary JSONB;

  v_test_cases_passed INT;
  v_total_test_cases INT;
  v_pass_ratio NUMERIC;
  v_coding_marks NUMERIC;
  v_assigned_subset JSONB;
  v_sub_rec RECORD;
BEGIN
  SELECT * INTO v_attempt
  FROM public.student_exam_attempts
  WHERE id::TEXT = p_attempt_id::TEXT
  FOR UPDATE;

  IF v_attempt IS NULL THEN
    RAISE EXCEPTION 'Attempt % not found.', p_attempt_id;
  END IF;

  IF NOT (
    v_is_service
    OR public.is_admin()
    OR public.is_tpo_for_college(v_attempt.college_id::TEXT)
    OR v_attempt.student_id::TEXT = COALESCE(auth.uid()::TEXT, '')
    OR v_attempt.student_id::TEXT = LOWER(COALESCE(auth.jwt()->>'email', ''))
    OR LOWER(COALESCE(v_attempt.student_email, '')) = LOWER(COALESCE(auth.jwt()->>'email', ''))
  ) THEN
    RAISE EXCEPTION 'Unauthorized: You do not own this exam attempt.';
  END IF;

  IF v_attempt.status IN ('SUBMITTED', 'GRADED', 'TIMED_OUT', 'TERMINATED_MALPRACTICE') AND NOT public.is_admin() AND NOT v_is_service THEN
    RETURN jsonb_build_object(
      'id', v_attempt.id,
      'status', v_attempt.status,
      'total_score', v_attempt.total_score,
      'max_possible_score', v_attempt.max_possible_score,
      'percentage', v_attempt.percentage,
      'passed', v_attempt.passed,
      'already_finalized', true
    );
  END IF;

  SELECT * INTO v_exam FROM public.mock_exams WHERE id::TEXT = v_attempt.mock_exam_id::TEXT;
  IF v_exam IS NULL THEN
    RAISE EXCEPTION 'Associated mock exam not found.';
  END IF;

  -- Compute server elapsed time & deadline from started_at + duration_minutes and exam end_time
  v_actual_elapsed := GREATEST(0, COALESCE(EXTRACT(EPOCH FROM (NOW() - COALESCE(v_attempt.started_at, NOW())))::INT, p_time_spent_seconds, 0));
  v_deadline := COALESCE(
    v_attempt.server_deadline_at,
    LEAST(
      COALESCE(v_attempt.started_at, NOW()) + (COALESCE(v_exam.duration_minutes, 90) * INTERVAL '1 minute'),
      COALESCE(v_exam.end_time, 'infinity'::timestamptz)
    )
  );

  IF NOW() > (v_deadline + INTERVAL '2 minutes') AND NOT public.is_admin() AND NOT v_is_service THEN
    v_status := 'TIMED_OUT';
  END IF;

  v_effective_tab_switches := GREATEST(
    COALESCE(p_tab_switch_count, 0),
    COALESCE(v_attempt.tab_switch_count, 0),
    CASE WHEN jsonb_typeof(p_proctor_events) = 'array' THEN jsonb_array_length(p_proctor_events) ELSE 0 END
  );

  IF v_status IS NULL THEN
    IF p_status_override = 'TERMINATED_MALPRACTICE'
       OR (COALESCE(v_exam.enable_tab_switch_detection, true) AND v_effective_tab_switches >= COALESCE(v_exam.max_tab_switches_allowed, 3)) THEN
      v_status := 'TERMINATED_MALPRACTICE';
    ELSIF p_status_override = 'TIMED_OUT' THEN
      v_status := 'TIMED_OUT';
    ELSIF (v_is_service OR public.is_admin()) AND p_status_override IS NOT NULL AND p_status_override != '' THEN
      v_status := p_status_override;
    ELSE
      v_status := 'SUBMITTED';
    END IF;
  END IF;

  -- SECURITY FIX: Always prefer server-stored assigned_question_ids; NEVER trust client __assigned_question_ids
  IF v_attempt.assigned_question_ids IS NOT NULL
     AND jsonb_typeof(v_attempt.assigned_question_ids) = 'array'
     AND jsonb_array_length(v_attempt.assigned_question_ids) > 0 THEN
    v_assigned_subset := v_attempt.assigned_question_ids;
  ELSE
    v_assigned_subset := NULL;
  END IF;

  v_owner_email := LOWER(TRIM(COALESCE(v_attempt.student_email, auth.jwt()->>'email', '')));

  FOR v_section IN
    SELECT * FROM public.mock_exam_sections
    WHERE mock_exam_id::TEXT = v_exam.id::TEXT
    ORDER BY section_order ASC
  LOOP
    v_marks_per_q := COALESCE(v_section.marks_per_correct, 1.00);
    v_neg_mark := COALESCE(v_section.negative_marking, 0.00);
    v_sec_q_count := 0;
    v_sec_attempted := 0;
    v_sec_correct := 0;
    v_sec_incorrect := 0;
    v_sec_score := 0.00;
    v_sec_max := 0.00;

    IF v_section.question_ids IS NOT NULL THEN
      FOREACH v_q_id IN ARRAY v_section.question_ids
      LOOP
        IF v_assigned_subset IS NOT NULL AND NOT (v_assigned_subset ? v_q_id) THEN
          CONTINUE;
        END IF;

        v_sec_max := v_sec_max + v_marks_per_q;
        v_max_possible_score := v_max_possible_score + v_marks_per_q;
        v_total_questions := v_total_questions + 1;
        v_sec_q_count := v_sec_q_count + 1;

        v_item_resp := p_responses -> v_q_id;
        v_marked_review := COALESCE((v_item_resp->>'marked_for_review')::BOOLEAN, (v_item_resp->>'marked_review')::BOOLEAN, false);
        v_time_spent := COALESCE((v_item_resp->>'time_spent_seconds')::INT, (v_item_resp->>'time_spent_sec')::INT, 0);

        IF COALESCE(v_section.section_type, '') = 'CODING'
           OR COALESCE(v_section.category, '') = 'coding'
           OR v_q_id LIKE 'lc-%'
           OR v_q_id LIKE 'p150-%'
           OR v_q_id LIKE 'custom-p150-%'
           OR v_q_id LIKE 'custom-programming_%'
           OR EXISTS (SELECT 1 FROM public.technical_problems tp WHERE tp.id::TEXT = v_q_id) THEN
          IF v_item_resp IS NOT NULL AND TRIM(COALESCE(v_item_resp->>'code_solution', '')) != '' THEN
            v_sec_attempted := v_sec_attempted + 1;
            v_total_attempted := v_total_attempted + 1;

            IF v_is_service THEN
              -- Trusted server execution pipeline (HMAC-verified or re-executed in /api/campus-exams)
              v_test_cases_passed := GREATEST(0, COALESCE((v_item_resp->>'test_cases_passed')::INT, 0));
              v_total_test_cases := GREATEST(1, COALESCE((v_item_resp->>'total_test_cases')::INT, 1));
            ELSE
              -- Direct client RPC call: verify strictly against immutable server submission ledger!
              SELECT passed_cases, total_cases INTO v_sub_rec
              FROM public.user_technical_submissions
              WHERE LOWER(user_email) = v_owner_email
                AND problem_id = v_q_id
                AND source_code = (v_item_resp->>'code_solution')
                AND created_at >= COALESCE(v_attempt.started_at, NOW() - INTERVAL '6 hours')
              ORDER BY created_at DESC
              LIMIT 1;
              v_test_cases_passed := COALESCE(v_sub_rec.passed_cases, 0);
              v_total_test_cases := GREATEST(1, COALESCE(v_sub_rec.total_cases, 1));
            END IF;

            v_pass_ratio := LEAST(1.00, GREATEST(0.00, v_test_cases_passed::NUMERIC / v_total_test_cases::NUMERIC));
            v_coding_marks := ROUND(v_marks_per_q * v_pass_ratio, 2);
            v_sec_score := v_sec_score + v_coding_marks;

            IF v_pass_ratio >= 0.80 THEN
              v_sec_correct := v_sec_correct + 1;
              v_total_correct := v_total_correct + 1;
              v_is_correct := true;
            ELSE
              v_sec_incorrect := v_sec_incorrect + 1;
              v_total_incorrect := v_total_incorrect + 1;
              v_is_correct := false;
            END IF;

            v_graded_responses := v_graded_responses || jsonb_build_object(
              v_q_id,
              jsonb_build_object(
                'code_solution', v_item_resp->>'code_solution',
                'code_language', COALESCE(v_item_resp->>'code_language', 'python'),
                'test_cases_passed', v_test_cases_passed,
                'total_test_cases', v_total_test_cases,
                'is_correct', v_is_correct,
                'marks_earned', v_coding_marks,
                'marked_review', v_marked_review,
                'time_spent_sec', v_time_spent
              )
            );
          END IF;
        ELSE
          v_raw_correct := NULL;
          SELECT COALESCE(tq.correct_answer::TEXT, tm.correct_option_index::TEXT)
          INTO v_raw_correct
          FROM (SELECT 1) _
          LEFT JOIN public.topic_questions tq ON tq.id::TEXT = v_q_id
          LEFT JOIN public.technical_mcqs tm ON tm.id::TEXT = v_q_id;

          IF v_raw_correct IS NOT NULL THEN
            v_raw_correct := UPPER(TRIM(v_raw_correct));
            IF v_raw_correct ~ '^\d+$' THEN
              v_correct_ans := v_raw_correct::INT;
            ELSIF v_raw_correct ~ '^[A-F]$' THEN
              v_correct_ans := ASCII(v_raw_correct) - 65;
            ELSE
              v_correct_ans := -1;
            END IF;
          ELSE
            v_correct_ans := -1;
          END IF;

          IF v_item_resp IS NOT NULL
             AND (v_item_resp->>'selected_option') IS NOT NULL
             AND (v_item_resp->>'selected_option') != 'null'
             AND (v_item_resp->>'selected_option') ~ '^-?\d+$' THEN
            v_student_selected := (v_item_resp->>'selected_option')::INT;
            v_sec_attempted := v_sec_attempted + 1;
            v_total_attempted := v_total_attempted + 1;

            IF v_correct_ans >= 0 AND v_student_selected = v_correct_ans THEN
              v_is_correct := true;
              v_sec_score := v_sec_score + v_marks_per_q;
              v_sec_correct := v_sec_correct + 1;
              v_total_correct := v_total_correct + 1;
            ELSE
              v_is_correct := false;
              v_sec_score := v_sec_score - v_neg_mark;
              v_sec_incorrect := v_sec_incorrect + 1;
              v_total_incorrect := v_total_incorrect + 1;
            END IF;

            v_graded_responses := v_graded_responses || jsonb_build_object(
              v_q_id,
              jsonb_build_object(
                'selected_option', v_student_selected,
                'selected_label', v_item_resp->>'selected_label',
                'is_correct', v_is_correct,
                'marked_review', v_marked_review,
                'time_spent_sec', v_time_spent
              )
            );
          END IF;
        END IF;
      END LOOP;
    END IF;

    v_clamped_sec_score := GREATEST(0.00, v_sec_score);
    v_total_score := v_total_score + v_clamped_sec_score;

    v_sections_summary := v_sections_summary || jsonb_build_object(
      'section_id', v_section.id,
      'section_name', v_section.name,
      'total_questions', v_sec_q_count,
      'attempted', v_sec_attempted,
      'correct', v_sec_correct,
      'incorrect', v_sec_incorrect,
      'unattempted', GREATEST(0, v_sec_q_count - v_sec_attempted),
      'score', v_clamped_sec_score,
      'max_score', v_sec_max,
      'percentage', CASE WHEN v_sec_max > 0 THEN ROUND((v_clamped_sec_score / v_sec_max) * 100.0, 1) ELSE 0 END,
      'accuracy', CASE WHEN v_sec_attempted > 0 THEN ROUND((v_sec_correct::NUMERIC / v_sec_attempted::NUMERIC) * 100.0, 1) ELSE 0 END
    );
  END LOOP;

  IF v_max_possible_score > 0 THEN
    v_percentage := ROUND((v_total_score / v_max_possible_score) * 100.0, 2);
    v_passed := (v_status != 'TERMINATED_MALPRACTICE') AND (v_percentage >= COALESCE(v_exam.passing_percentage, 40.00));
  ELSE
    v_max_possible_score := COALESCE(v_exam.total_marks, 100.00);
    v_percentage := 0.00;
    v_passed := false;
  END IF;

  v_result_summary := jsonb_build_object(
    'total_score', v_total_score,
    'max_score', v_max_possible_score,
    'percentage', v_percentage,
    'passed', v_passed,
    'tier', CASE
      WHEN v_status = 'TERMINATED_MALPRACTICE' THEN 'MALPRACTICE'
      WHEN v_percentage >= 70 THEN 'TIER_1'
      WHEN v_percentage >= 50 THEN 'TIER_2'
      ELSE 'TIER_3'
    END,
    'tier_label', CASE
      WHEN v_status = 'TERMINATED_MALPRACTICE' THEN 'Disqualified (Proctor Violation)'
      WHEN v_percentage >= 70 THEN 'Tier-1 Industry Ready'
      WHEN v_percentage >= 50 THEN 'Tier-2 Campus Ready'
      ELSE 'Tier-3 Needs Upskilling'
    END,
    'total_questions', v_total_questions,
    'total_attempted', v_total_attempted,
    'total_correct', v_total_correct,
    'total_incorrect', v_total_incorrect,
    'total_unattempted', GREATEST(0, v_total_questions - v_total_attempted),
    'overall_accuracy', CASE WHEN v_total_attempted > 0 THEN ROUND((v_total_correct::NUMERIC / v_total_attempted::NUMERIC) * 100.0, 1) ELSE 0 END,
    'time_spent_seconds', v_actual_elapsed,
    'tab_switch_count', v_effective_tab_switches,
    'proctor_status', CASE WHEN v_status = 'TERMINATED_MALPRACTICE' THEN 'MALPRACTICE_TERMINATED' WHEN v_effective_tab_switches > 0 THEN 'WARNING' ELSE 'CLEAN' END,
    'sections', v_sections_summary
  );

  SET LOCAL prepunite.trusted_rpc = 'on';

  UPDATE public.student_exam_attempts
  SET
    status = v_status,
    total_score = v_total_score,
    max_possible_score = v_max_possible_score,
    percentage = v_percentage,
    passed = v_passed,
    tab_switch_count = v_effective_tab_switches,
    proctor_events = COALESCE(p_proctor_events, '[]'::jsonb),
    time_spent_seconds = v_actual_elapsed,
    responses = v_graded_responses || jsonb_build_object('__result_summary', v_result_summary),
    result_summary = v_result_summary,
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
    'time_spent_seconds', v_actual_elapsed,
    'responses', v_graded_responses,
    'result_summary', v_result_summary
  );
END;
$$;

REVOKE ALL ON FUNCTION public.submit_exam_attempt_v2(TEXT, JSONB, INT, JSONB, INT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_exam_attempt_v2(TEXT, JSONB, INT, JSONB, INT, TEXT) TO authenticated, service_role;


-- Hardened get_mock_exam_attempt_solutions: enforces end_time anti-leak on DB + covers MCQs, Tech MCQs, Coding
DROP FUNCTION IF EXISTS public.get_mock_exam_attempt_solutions(TEXT);
CREATE OR REPLACE FUNCTION public.get_mock_exam_attempt_solutions(p_attempt_id TEXT)
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
  v_assigned JSONB;
  v_questions JSONB := '[]'::jsonb;
  v_is_privileged BOOLEAN := FALSE;
BEGIN
  SELECT * INTO v_attempt
  FROM public.student_exam_attempts
  WHERE id::TEXT = p_attempt_id::TEXT;

  IF v_attempt IS NULL THEN
    RAISE EXCEPTION 'Attempt not found';
  END IF;

  IF v_attempt.status NOT IN ('SUBMITTED', 'GRADED', 'TIMED_OUT', 'TERMINATED_MALPRACTICE') THEN
    RAISE EXCEPTION 'Solutions are only accessible after the exam has been submitted.';
  END IF;

  v_is_privileged := (
    COALESCE(auth.jwt()->>'role', '') = 'service_role'
    OR public.is_admin()
    OR public.is_tpo_for_college(v_attempt.college_id::TEXT)
  );

  IF NOT (
    v_is_privileged
    OR v_attempt.student_id::TEXT = COALESCE(auth.uid()::TEXT, '')
    OR v_attempt.student_id::TEXT = LOWER(COALESCE(auth.jwt()->>'email', ''))
    OR LOWER(COALESCE(v_attempt.student_email, '')) = LOWER(COALESCE(auth.jwt()->>'email', ''))
  ) THEN
    RAISE EXCEPTION 'Access denied to this attempt review';
  END IF;

  SELECT * INTO v_exam FROM public.mock_exams WHERE id::TEXT = v_attempt.mock_exam_id::TEXT;
  IF v_exam IS NOT NULL THEN
    -- Anti-Leak Window Gate on Server: scheduled campus/public drives keep solutions locked until end_time passes
    -- Personal SELF / INDIVIDUAL practice exams unlock immediately upon submission
    IF NOT v_is_privileged
       AND UPPER(COALESCE(v_exam.college_id::TEXT, '')) NOT IN ('SELF', 'INDIVIDUAL')
       AND (v_exam.start_time IS NOT NULL OR v_exam.end_time IS NOT NULL)
       AND (v_exam.end_time IS NULL OR NOW() < v_exam.end_time) THEN
      RETURN jsonb_build_object(
        'attempt_id', p_attempt_id,
        'isWindowLive', true,
        'examEndTime', v_exam.end_time,
        'status', v_attempt.status,
        'total_score', v_attempt.total_score,
        'max_possible_score', v_attempt.max_possible_score,
        'percentage', v_attempt.percentage,
        'passed', v_attempt.passed,
        'questions', '[]'::jsonb
      );
    END IF;

    v_assigned := CASE
      WHEN v_attempt.assigned_question_ids IS NOT NULL
           AND jsonb_typeof(v_attempt.assigned_question_ids) = 'array'
           AND jsonb_array_length(v_attempt.assigned_question_ids) > 0
      THEN v_attempt.assigned_question_ids
      ELSE NULL
    END;

    FOR v_section IN
      SELECT * FROM public.mock_exam_sections
      WHERE mock_exam_id::TEXT = v_exam.id::TEXT
      ORDER BY section_order ASC
    LOOP
      IF v_section.question_ids IS NOT NULL THEN
        FOREACH v_q_id IN ARRAY v_section.question_ids
        LOOP
          IF v_assigned IS NOT NULL AND NOT (v_assigned ? v_q_id) THEN
            CONTINUE;
          END IF;

          SELECT id::TEXT AS id, statement, options, difficulty, topic_id, question_number,
                 correct_answer, explanation, structured_explanation
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
              'explanation', v_q.explanation,
              'structured_explanation', v_q.structured_explanation
            );
            CONTINUE;
          END IF;

          SELECT id::TEXT AS id, question, code_snippet, options, difficulty, topic_id, correct_option_index, explanation
          INTO v_q
          FROM public.technical_mcqs
          WHERE id::TEXT = v_q_id;

          IF v_q IS NOT NULL THEN
            v_questions := v_questions || jsonb_build_object(
              'id', v_q.id,
              'statement', v_q.question,
              'code_snippet', v_q.code_snippet,
              'options', v_q.options,
              'difficulty', v_q.difficulty,
              'topic_id', v_q.topic_id,
              'correct_answer', v_q.correct_option_index,
              'explanation', v_q.explanation,
              'isTechnicalMcq', true
            );
            CONTINUE;
          END IF;

          SELECT id::TEXT AS id, title, description, constraints, sample_input, sample_output,
                 explanation, test_cases, solutions, level, category
          INTO v_q
          FROM public.technical_problems
          WHERE id::TEXT = v_q_id;

          IF v_q IS NOT NULL THEN
            v_questions := v_questions || jsonb_build_object(
              'id', v_q.id,
              'title', v_q.title,
              'statement', v_q.description,
              'description', v_q.description,
              'options', '[]'::jsonb,
              'difficulty', COALESCE(v_q.level, 'MEDIUM'),
              'topic_id', v_q.category,
              'structured_explanation', v_q.explanation,
              'constraints', v_q.constraints,
              'sample_input', v_q.sample_input,
              'sample_output', v_q.sample_output,
              'test_cases', v_q.test_cases,
              'solutions', v_q.solutions,
              'isCodingProblem', true
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
    'questions', v_questions,
    'isWindowLive', false,
    'examEndTime', v_exam.end_time
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_mock_exam_attempt_solutions(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_mock_exam_attempt_solutions(TEXT) TO authenticated, service_role;

-- Safe quota-enforced Self-Practice Mock Exam creation RPC
DROP FUNCTION IF EXISTS public.create_self_practice_mock_exam(JSONB, JSONB);
CREATE OR REPLACE FUNCTION public.create_self_practice_mock_exam(
  p_exam JSONB,
  p_sections JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid_uuid UUID := auth.uid();
  v_uid TEXT := COALESCE(auth.uid()::TEXT, '');
  v_email TEXT := LOWER(TRIM(COALESCE(auth.jwt()->>'email', '')));
  v_exam_id TEXT;
  v_sec JSONB;
  v_idx INT := 0;
  v_q_arr TEXT[];
  v_t_arr TEXT[];
BEGIN
  IF v_uid_uuid IS NULL OR v_uid = '' OR v_email = '' THEN
    RAISE EXCEPTION 'Authentication required to create a self-practice assessment.';
  END IF;

  v_exam_id := COALESCE(NULLIF(TRIM(p_exam->>'id'), ''), 'self-' || replace(gen_random_uuid()::TEXT, '-', ''));

  PERFORM public.consume_mock_exam_quota(v_email, v_exam_id);

  INSERT INTO public.mock_exams (
    id, college_id, created_by, title, target_company, description, instructions,
    duration_minutes, total_marks, passing_percentage, start_time, end_time,
    is_active, enable_tab_switch_detection, max_tab_switches_allowed,
    enable_fullscreen_lock, shuffle_questions, shuffle_options,
    show_results_immediately, enable_sectional_lock, target_departments
  ) VALUES (
    v_exam_id,
    'SELF',
    v_uid_uuid,
    COALESCE(NULLIF(TRIM(p_exam->>'title'), ''), 'Self Practice Assessment'),
    COALESCE(NULLIF(TRIM(p_exam->>'target_company'), ''), 'General'),
    COALESCE(p_exam->>'description', ''),
    COALESCE(p_exam->>'instructions', ''),
    LEAST(300, GREATEST(5, COALESCE((p_exam->>'duration_minutes')::INT, 60))),
    GREATEST(1, ROUND(COALESCE((p_exam->>'total_marks')::NUMERIC, 100)))::INT,
    LEAST(100, GREATEST(0, ROUND(COALESCE((p_exam->>'passing_percentage')::NUMERIC, 40))))::INT,
    NOW(),
    NOW() + INTERVAL '30 days',
    true,
    COALESCE((p_exam->>'enable_tab_switch_detection')::BOOLEAN, false),
    GREATEST(1, COALESCE((p_exam->>'max_tab_switches_allowed')::INT, 5)),
    COALESCE((p_exam->>'enable_fullscreen_lock')::BOOLEAN, false),
    COALESCE((p_exam->>'shuffle_questions')::BOOLEAN, true),
    COALESCE((p_exam->>'shuffle_options')::BOOLEAN, true),
    true,
    COALESCE((p_exam->>'enable_sectional_lock')::BOOLEAN, false),
    ARRAY[v_email]
  )
  ON CONFLICT (id) DO NOTHING;

  IF p_sections IS NOT NULL AND jsonb_typeof(p_sections) = 'array' THEN
    FOR v_sec IN SELECT * FROM jsonb_array_elements(p_sections)
    LOOP
      v_idx := v_idx + 1;
      SELECT COALESCE(array_agg(x), '{}'::TEXT[]) INTO v_q_arr
      FROM jsonb_array_elements_text(COALESCE(v_sec->'question_ids', '[]'::jsonb)) x;
      SELECT COALESCE(array_agg(x), '{}'::TEXT[]) INTO v_t_arr
      FROM jsonb_array_elements_text(COALESCE(v_sec->'topic_ids', '[]'::jsonb)) x;

      INSERT INTO public.mock_exam_sections (
        id, mock_exam_id, name, section_order, section_type, category,
        coding_track, difficulty, serve_count, duration_minutes,
        marks_per_correct, negative_marking, question_ids, topic_ids
      ) VALUES (
        COALESCE(NULLIF(TRIM(v_sec->>'id'), ''), 'sec-' || v_exam_id || '-' || v_idx),
        v_exam_id,
        COALESCE(NULLIF(TRIM(v_sec->>'name'), ''), 'Section ' || v_idx),
        COALESCE((v_sec->>'section_order')::INT, v_idx),
        COALESCE(NULLIF(TRIM(v_sec->>'section_type'), ''), 'MCQ'),
        v_sec->>'category',
        v_sec->>'coding_track',
        v_sec->>'difficulty',
        (v_sec->>'serve_count')::INT,
        (v_sec->>'duration_minutes')::INT,
        GREATEST(0.25, COALESCE((v_sec->>'marks_per_correct')::NUMERIC, 1)),
        GREATEST(0, COALESCE((v_sec->>'negative_marking')::NUMERIC, 0)),
        v_q_arr,
        v_t_arr
      );
    END LOOP;
  END IF;

  RETURN jsonb_build_object('success', true, 'id', v_exam_id);
END;
$$;

REVOKE ALL ON FUNCTION public.create_self_practice_mock_exam(JSONB, JSONB) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_self_practice_mock_exam(JSONB, JSONB) TO authenticated, service_role;

COMMIT;
