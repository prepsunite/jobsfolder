-- ====================================================================
-- PrepUnite: Hardened RLS Security Migration for Technical & Interview Tables
-- Safe, Idempotent Script for Supabase SQL Editor
--
-- Description:
-- 1. Re-enables Row Level Security (RLS) on technical_problems, technical_mcqs,
--    interview_questions, technical_topics, and interview_topics.
-- 2. Revokes open mutation permissions from anon and regular authenticated users.
-- 3. Grants public SELECT access on non-deleted/non-hidden records.
-- 4. Strictly gates INSERT, UPDATE, and DELETE to verified Super Admins via public.is_admin().
-- ====================================================================

-- 1. Ensure public.is_admin() helper exists with secure search_path
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

-- 2. Revoke destructive write permissions from anon on technical and interview tables
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.technical_problems FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.technical_mcqs FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.interview_questions FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.technical_topics FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.interview_topics FROM anon;

-- Grant safe read permissions
GRANT SELECT ON TABLE public.technical_problems TO anon, authenticated;
GRANT SELECT ON TABLE public.technical_mcqs TO anon, authenticated;
GRANT SELECT ON TABLE public.interview_questions TO anon, authenticated;
GRANT SELECT ON TABLE public.technical_topics TO anon, authenticated;
GRANT SELECT ON TABLE public.interview_topics TO anon, authenticated;

-- Maintain full privileges for backend service_role
GRANT ALL ON TABLE public.technical_problems TO service_role;
GRANT ALL ON TABLE public.technical_mcqs TO service_role;
GRANT ALL ON TABLE public.interview_questions TO service_role;
GRANT ALL ON TABLE public.technical_topics TO service_role;
GRANT ALL ON TABLE public.interview_topics TO service_role;


-- 3. LOCK DOWN: technical_problems
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

    -- Only verified admins can mutate
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


-- 4. LOCK DOWN: technical_mcqs
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

    CREATE POLICY "Public read technical_mcqs"
      ON public.technical_mcqs
      FOR SELECT
      USING (
        public.is_admin()
        OR (COALESCE(is_deleted, false) = false AND COALESCE(is_hidden, false) = false)
      );

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


-- 5. LOCK DOWN: technical_topics
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


-- 6. LOCK DOWN: interview_topics
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


-- 7. LOCK DOWN: interview_questions
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
