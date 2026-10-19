-- ====================================================================
-- PrepUnite: Database-Level Admin Enforcement & RLS Lockdown
-- Safe, Idempotent Script for Supabase SQL Editor
--
-- This script ensures:
-- 1. public.is_admin() checks profiles.role and verified admin emails at DB level.
-- 2. Row Level Security (RLS) is enabled on core tables.
-- 3. Only verified admins can INSERT, UPDATE, or DELETE exams, companies, and questions.
-- 4. Normal students can read non-deleted public content, but CANNOT mutate anything,
--    even if they tamper with localStorage or browser DevTools.
-- ====================================================================

-- 1. Helper function to check if current user is an authenticated Super Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- 1. Check if auth user exists
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  -- 2. Check if user is marked as admin in profiles or matches trusted super-admin emails
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

-- 2. LOCK DOWN EXAMS TABLE
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to ensure clean idempotent setup
DROP POLICY IF EXISTS "Public read exams" ON public.exams;
DROP POLICY IF EXISTS "Admins insert exams" ON public.exams;
DROP POLICY IF EXISTS "Admins update exams" ON public.exams;
DROP POLICY IF EXISTS "Admins delete exams" ON public.exams;

-- Public can read non-deleted exams (RPC redacts paper_tabs)
CREATE POLICY "Public read exams"
  ON public.exams
  FOR SELECT
  USING (COALESCE(is_deleted, false) = false);

-- Only admins can mutate exams
CREATE POLICY "Admins insert exams"
  ON public.exams
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins update exams"
  ON public.exams
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins delete exams"
  ON public.exams
  FOR DELETE
  USING (public.is_admin());


-- 3. LOCK DOWN COMPANIES TABLE
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read companies" ON public.companies;
DROP POLICY IF EXISTS "Admins insert companies" ON public.companies;
DROP POLICY IF EXISTS "Admins update companies" ON public.companies;
DROP POLICY IF EXISTS "Admins delete companies" ON public.companies;

-- Public can read companies
CREATE POLICY "Public read companies"
  ON public.companies
  FOR SELECT
  USING (true);

-- Only admins can create/update/delete companies
CREATE POLICY "Admins insert companies"
  ON public.companies
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins update companies"
  ON public.companies
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins delete companies"
  ON public.companies
  FOR DELETE
  USING (public.is_admin());


-- 4. LOCK DOWN TOPIC QUESTIONS TABLE
ALTER TABLE public.topic_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read topic_questions" ON public.topic_questions;
DROP POLICY IF EXISTS "Admins insert topic_questions" ON public.topic_questions;
DROP POLICY IF EXISTS "Admins update topic_questions" ON public.topic_questions;
DROP POLICY IF EXISTS "Admins delete topic_questions" ON public.topic_questions;

-- Public read only non-hidden questions; admins can read all
CREATE POLICY "Public read topic_questions"
  ON public.topic_questions
  FOR SELECT
  USING (COALESCE(is_hidden, false) = false OR public.is_admin());

-- Only admins can create/update/delete topic questions
CREATE POLICY "Admins insert topic_questions"
  ON public.topic_questions
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins update topic_questions"
  ON public.topic_questions
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins delete topic_questions"
  ON public.topic_questions
  FOR DELETE
  USING (public.is_admin());
