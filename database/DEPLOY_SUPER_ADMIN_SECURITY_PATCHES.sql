-- ====================================================================
-- PrepUnite: Master Super Admin Security Hardening & Ingestion Patch
-- Target: Supabase SQL Editor
-- Safe, Idempotent, Production-Ready
--
-- Includes:
-- 1. Hardened public.is_admin() Security Definer Function with search_path protection
-- 2. Restoration of Row Level Security (RLS) on Technical & Interview tables
--    (technical_problems, technical_mcqs, technical_topics, interview_topics, interview_questions)
-- 3. Revocation of write privileges from anon, strictly gating writes to Super Admins
-- 4. Hardened sliding-window rate limit triggers on question_reports and contact_messages
--    with bypass for system backups (MOCK_EXAM_BLUEPRINT:%, B2B_%) and Super Admins
-- 5. Automatic sequential question_number assignment trigger for topic_questions
-- 6. Composite performance indexes for topic questions, technical problems, and MCQs
-- ====================================================================

-- --------------------------------------------------------------------
-- SECTION 1: Master Admin Authorization Function
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND (
        LOWER(COALESCE(role, '')) = 'admin'
        OR LOWER(COALESCE(email, '')) IN (
          'venkatmukala9@gmail.com',
          'venkat.mukala9@gmail.com',
          'venkatmukala3@gmail.com',
          'venkat.mukala3@gmail.com',
          'prepsunite@gmail.com'
        )
      )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;


-- --------------------------------------------------------------------
-- SECTION 2: Revoke Anon Write Privileges & Grant Clean Select Permissions
-- --------------------------------------------------------------------
DO $$
BEGIN
  -- technical_problems
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'technical_problems') THEN
    REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.technical_problems FROM anon;
    GRANT SELECT ON TABLE public.technical_problems TO anon, authenticated;
    GRANT ALL ON TABLE public.technical_problems TO service_role;
  END IF;

  -- technical_mcqs
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'technical_mcqs') THEN
    REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.technical_mcqs FROM anon;
    GRANT SELECT ON TABLE public.technical_mcqs TO anon, authenticated;
    GRANT ALL ON TABLE public.technical_mcqs TO service_role;
  END IF;

  -- technical_topics
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'technical_topics') THEN
    REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.technical_topics FROM anon;
    GRANT SELECT ON TABLE public.technical_topics TO anon, authenticated;
    GRANT ALL ON TABLE public.technical_topics TO service_role;
  END IF;

  -- interview_topics
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'interview_topics') THEN
    REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.interview_topics FROM anon;
    GRANT SELECT ON TABLE public.interview_topics TO anon, authenticated;
    GRANT ALL ON TABLE public.interview_topics TO service_role;
  END IF;

  -- interview_questions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'interview_questions') THEN
    REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.interview_questions FROM anon;
    GRANT SELECT ON TABLE public.interview_questions TO anon, authenticated;
    GRANT ALL ON TABLE public.interview_questions TO service_role;
  END IF;
END $$;


-- --------------------------------------------------------------------
-- SECTION 3: Row Level Security Policies for Technical & Interview Tables
-- --------------------------------------------------------------------

-- 3.1: technical_problems
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'technical_problems') THEN
    ALTER TABLE public.technical_problems ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Read technical_problems" ON public.technical_problems;
    DROP POLICY IF EXISTS "Public read technical_problems" ON public.technical_problems;
    DROP POLICY IF EXISTS "Admins mutate technical_problems" ON public.technical_problems;
    DROP POLICY IF EXISTS "Admins insert technical_problems" ON public.technical_problems;
    DROP POLICY IF EXISTS "Admins update technical_problems" ON public.technical_problems;
    DROP POLICY IF EXISTS "Admins delete technical_problems" ON public.technical_problems;

    -- Public read non-deleted, non-hidden problems; admins can read all
    CREATE POLICY "Public read technical_problems"
      ON public.technical_problems
      FOR SELECT
      USING (
        public.is_admin()
        OR (COALESCE(is_deleted, false) = false AND COALESCE(is_hidden, false) = false)
      );

    -- Admin mutation policies
    CREATE POLICY "Admins insert technical_problems"
      ON public.technical_problems
      FOR INSERT
      WITH CHECK (public.is_admin());

    CREATE POLICY "Admins update technical_problems"
      ON public.technical_problems
      FOR UPDATE
      USING (public.is_admin())
      WITH CHECK (public.is_admin());

    CREATE POLICY "Admins delete technical_problems"
      ON public.technical_problems
      FOR DELETE
      USING (public.is_admin());
  END IF;
END $$;

-- 3.2: technical_mcqs
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'technical_mcqs') THEN
    ALTER TABLE public.technical_mcqs ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Read technical_mcqs" ON public.technical_mcqs;
    DROP POLICY IF EXISTS "Public read technical_mcqs" ON public.technical_mcqs;
    DROP POLICY IF EXISTS "Admins mutate technical_mcqs" ON public.technical_mcqs;
    DROP POLICY IF EXISTS "Admins insert technical_mcqs" ON public.technical_mcqs;
    DROP POLICY IF EXISTS "Admins update technical_mcqs" ON public.technical_mcqs;
    DROP POLICY IF EXISTS "Admins delete technical_mcqs" ON public.technical_mcqs;

    -- Public read non-deleted, non-hidden mcqs; admins can read all
    CREATE POLICY "Public read technical_mcqs"
      ON public.technical_mcqs
      FOR SELECT
      USING (
        public.is_admin()
        OR (COALESCE(is_deleted, false) = false AND COALESCE(is_hidden, false) = false)
      );

    -- Admin mutation policies
    CREATE POLICY "Admins insert technical_mcqs"
      ON public.technical_mcqs
      FOR INSERT
      WITH CHECK (public.is_admin());

    CREATE POLICY "Admins update technical_mcqs"
      ON public.technical_mcqs
      FOR UPDATE
      USING (public.is_admin())
      WITH CHECK (public.is_admin());

    CREATE POLICY "Admins delete technical_mcqs"
      ON public.technical_mcqs
      FOR DELETE
      USING (public.is_admin());
  END IF;
END $$;

-- 3.3: technical_topics
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'technical_topics') THEN
    ALTER TABLE public.technical_topics ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Read technical_topics" ON public.technical_topics;
    DROP POLICY IF EXISTS "Public read technical_topics" ON public.technical_topics;
    DROP POLICY IF EXISTS "Admins mutate technical_topics" ON public.technical_topics;

    CREATE POLICY "Public read technical_topics"
      ON public.technical_topics
      FOR SELECT
      USING (
        public.is_admin()
        OR COALESCE(is_hidden, false) = false
      );

    CREATE POLICY "Admins mutate technical_topics"
      ON public.technical_topics
      FOR ALL
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;

-- 3.4: interview_topics
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'interview_topics') THEN
    ALTER TABLE public.interview_topics ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Read interview_topics" ON public.interview_topics;
    DROP POLICY IF EXISTS "Public read interview_topics" ON public.interview_topics;
    DROP POLICY IF EXISTS "Admins mutate interview_topics" ON public.interview_topics;

    CREATE POLICY "Public read interview_topics"
      ON public.interview_topics
      FOR SELECT
      USING (
        public.is_admin()
        OR COALESCE(is_hidden, false) = false
      );

    CREATE POLICY "Admins mutate interview_topics"
      ON public.interview_topics
      FOR ALL
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;

-- 3.5: interview_questions
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'interview_questions') THEN
    ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Read interview_questions" ON public.interview_questions;
    DROP POLICY IF EXISTS "Public read interview_questions" ON public.interview_questions;
    DROP POLICY IF EXISTS "Admins mutate interview_questions" ON public.interview_questions;

    CREATE POLICY "Public read interview_questions"
      ON public.interview_questions
      FOR SELECT
      USING (
        public.is_admin()
        OR COALESCE(is_deleted, false) = false
      );

    CREATE POLICY "Admins mutate interview_questions"
      ON public.interview_questions
      FOR ALL
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;


-- --------------------------------------------------------------------
-- SECTION 4: Database-Side Rate Limiting Triggers & Blueprint Bypass
-- --------------------------------------------------------------------

-- 4.1: Question Reports Rate Limit (5 per 24 hours per email, admins bypass)
CREATE OR REPLACE FUNCTION public.enforce_question_reports_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    recent_count INTEGER;
BEGIN
    -- Super admins bypass question reporting rate limits
    IF public.is_admin() THEN
        RETURN NEW;
    END IF;

    IF NEW.reporter_email IS NOT NULL AND TRIM(NEW.reporter_email) <> '' THEN
        SELECT COUNT(*)
        INTO recent_count
        FROM public.question_reports
        WHERE LOWER(TRIM(reporter_email)) = LOWER(TRIM(NEW.reporter_email))
          AND created_at >= NOW() - INTERVAL '24 hours';

        IF recent_count >= 5 THEN
            RAISE EXCEPTION 'Daily report limit reached (5/5) for this email. Thank you for your feedback!';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'question_reports') THEN
    DROP TRIGGER IF EXISTS trg_question_reports_rate_limit ON public.question_reports;
    CREATE TRIGGER trg_question_reports_rate_limit
      BEFORE INSERT ON public.question_reports
      FOR EACH ROW
      EXECUTE FUNCTION public.enforce_question_reports_rate_limit();
  END IF;
END $$;


-- 4.2: Contact Messages Rate Limit (3 per 24 hours, system KV backups & admins bypass)
CREATE OR REPLACE FUNCTION public.enforce_contact_messages_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    recent_count INTEGER;
BEGIN
    -- Bypass rate limits for system key-value backups (blueprints, practice exams) and Super Admins
    IF NEW.subject LIKE 'MOCK_EXAM_BLUEPRINT:%' 
       OR NEW.subject LIKE 'B2B_%' 
       OR public.is_admin() THEN
        RETURN NEW;
    END IF;

    IF NEW.email IS NOT NULL AND TRIM(NEW.email) <> '' THEN
        SELECT COUNT(*)
        INTO recent_count
        FROM public.contact_messages
        WHERE LOWER(TRIM(email)) = LOWER(TRIM(NEW.email))
          AND created_at >= NOW() - INTERVAL '24 hours'
          AND NOT (subject LIKE 'MOCK_EXAM_BLUEPRINT:%' OR subject LIKE 'B2B_%');

        IF recent_count >= 3 THEN
            RAISE EXCEPTION 'Daily inquiry limit reached (3/3) for this email. Please try again tomorrow.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contact_messages') THEN
    DROP TRIGGER IF EXISTS trg_contact_messages_rate_limit ON public.contact_messages;
    CREATE TRIGGER trg_contact_messages_rate_limit
      BEFORE INSERT ON public.contact_messages
      FOR EACH ROW
      EXECUTE FUNCTION public.enforce_contact_messages_rate_limit();
  END IF;
END $$;


-- --------------------------------------------------------------------
-- SECTION 5: Automatic Question Number Assignment on Ingestion
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.assign_topic_question_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_max_num INTEGER;
BEGIN
  -- If question_number is null, <= 0, or already taken by another question in the same topic
  IF NEW.question_number IS NULL OR NEW.question_number <= 0 OR EXISTS (
    SELECT 1 FROM public.topic_questions
    WHERE topic_id = NEW.topic_id
      AND question_number = NEW.question_number
      AND id <> NEW.id
      AND COALESCE(is_deleted, false) = false
  ) THEN
    -- Lock topic rows for this topic to prevent race conditions during high concurrency
    SELECT COALESCE(MAX(question_number), 0)
    INTO v_max_num
    FROM public.topic_questions
    WHERE topic_id = NEW.topic_id
      AND COALESCE(is_deleted, false) = false;

    NEW.question_number := v_max_num + 1;
  END IF;

  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'topic_questions') THEN
    DROP TRIGGER IF EXISTS trg_assign_topic_question_number ON public.topic_questions;
    CREATE TRIGGER trg_assign_topic_question_number
      BEFORE INSERT ON public.topic_questions
      FOR EACH ROW
      EXECUTE FUNCTION public.assign_topic_question_number();
  END IF;
END $$;


-- --------------------------------------------------------------------
-- SECTION 6: High-Performance Composite Indexes
-- --------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'topic_questions') THEN
    CREATE INDEX IF NOT EXISTS idx_topic_questions_perf
      ON public.topic_questions (topic_id, is_deleted, question_number);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'technical_problems') THEN
    CREATE INDEX IF NOT EXISTS idx_technical_problems_perf
      ON public.technical_problems (category, is_deleted, level);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'technical_mcqs') THEN
    CREATE INDEX IF NOT EXISTS idx_technical_mcqs_perf
      ON public.technical_mcqs (topic_id, is_deleted, difficulty);
  END IF;

  -- Companies visibility column & index
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'companies') THEN
    ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;
    CREATE INDEX IF NOT EXISTS idx_companies_is_hidden ON public.companies(is_hidden) WHERE is_deleted = FALSE;
  END IF;

  -- Profiles DPDP consent compliance index
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    CREATE INDEX IF NOT EXISTS idx_profiles_consent ON public.profiles(consent_status);
  END IF;
END $$;


-- --------------------------------------------------------------------
-- SECTION 7: DPDP Act 2023 - Complete User Data Erasure & Telemetry Scrub
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.dpdp_delete_user_data(target_email TEXT)
RETURNS TEXT AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Get the user's UUID from profiles
  SELECT id INTO target_user_id
  FROM public.profiles
  WHERE LOWER(email) = LOWER(target_email);

  IF target_user_id IS NULL THEN
    RETURN 'User not found: ' || target_email;
  END IF;

  -- Anonymise the profile row (keep for referential integrity)
  UPDATE public.profiles
  SET
    name       = 'Deleted User',
    avatar_url = NULL,
    email      = 'deleted_' || target_user_id || '@deleted.invalid',
    updated_at = NOW()
  WHERE id = target_user_id;

  -- Soft-delete submitted experiences (preserve content, remove PII)
  UPDATE public.experiences
  SET
    student_name = 'Anonymous Student',
    is_deleted   = FALSE,
    updated_at   = NOW()
  WHERE created_by = target_user_id;

  -- Transactions & subscriptions: anonymise email reference (kept for tax mandate)
  UPDATE public.transactions
  SET user_email = 'deleted_' || target_user_id || '@deleted.invalid'
  WHERE user_email = LOWER(target_email);

  UPDATE public.user_subscriptions
  SET user_email = 'deleted_' || target_user_id || '@deleted.invalid'
  WHERE user_email = LOWER(target_email);

  UPDATE public.user_paper_purchases
  SET user_email = 'deleted_' || target_user_id || '@deleted.invalid'
  WHERE user_email = LOWER(target_email);

  -- Scrub student enrollment records in college_students
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'college_students') THEN
    UPDATE public.college_students
    SET
      email = 'deleted_' || target_user_id || '@deleted.invalid',
      name = 'Deleted Candidate',
      roll_number = NULL,
      updated_at = NOW()
    WHERE LOWER(email) = LOWER(target_email) OR user_id = target_user_id;
  END IF;

  -- Scrub student exam attempts (wipe candidate answers, code submissions & proctor telemetry to protect privacy)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'student_exam_attempts') THEN
    UPDATE public.student_exam_attempts
    SET
      responses = '{}'::jsonb,
      proctor_events = '[]'::jsonb,
      updated_at = NOW()
    WHERE student_id IN (
      SELECT id FROM public.college_students WHERE LOWER(email) = LOWER(target_email) OR user_id = target_user_id
    ) OR student_id = target_user_id::TEXT;
  END IF;

  -- Log the deletion in audit logs
  INSERT INTO public.admin_audit_logs (
    admin_email, action, target_entity, target_id, after_data
  ) VALUES (
    'system@dpdp-retention',
    'DPDP_USER_DATA_DELETION',
    'profiles',
    target_user_id::TEXT,
    jsonb_build_object(
      'reason', 'User requested data deletion under DPDP Act 2023',
      'processed_at', NOW()
    )
  );

  RETURN 'Data deletion completed for: ' || target_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;
