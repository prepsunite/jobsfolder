-- ====================================================================
-- PrepUnite: Phase 2 Comprehensive Database RLS Master Script
-- Safe, Idempotent Script for Supabase SQL Editor
--
-- This script hardens all core tables across the entire platform:
-- 1. experiences (Public can submit; only admins can approve/edit/delete)
-- 2. question_reports & contact_messages (Public can submit; only admins view/manage)
-- 3. technical & interview topics/questions (Public read active; admin mutate)
-- 4. aptitude_topics (Public read active; admin mutate)
-- 5. mock_exams & sections (Gated to admin mutations)
-- 6. student_exam_attempts (Students view their own; admin view all)
-- ====================================================================

-- Ensure is_admin() function exists
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS 
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
;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;


-- 1. EXPERIENCES (Interview Experiences)
DO 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'experiences') THEN
    ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Public read approved experiences" ON public.experiences;
    DROP POLICY IF EXISTS "Authenticated submit experiences" ON public.experiences;
    DROP POLICY IF EXISTS "Admins update experiences" ON public.experiences;
    DROP POLICY IF EXISTS "Admins delete experiences" ON public.experiences;

    CREATE POLICY "Public read approved experiences" ON public.experiences
      FOR SELECT USING (COALESCE(is_deleted, false) = false AND (status = 'APPROVED' OR public.is_admin()));

    CREATE POLICY "Authenticated submit experiences" ON public.experiences
      FOR INSERT WITH CHECK (true);

    CREATE POLICY "Admins update experiences" ON public.experiences
      FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

    CREATE POLICY "Admins delete experiences" ON public.experiences
      FOR DELETE USING (public.is_admin());
  END IF;
END ;


-- 2. QUESTION REPORTS & CONTACT MESSAGES
DO 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'question_reports') THEN
    ALTER TABLE public.question_reports ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Anyone submit question_reports" ON public.question_reports;
    DROP POLICY IF EXISTS "Admins manage question_reports" ON public.question_reports;

    CREATE POLICY "Anyone submit question_reports" ON public.question_reports
      FOR INSERT WITH CHECK (true);

    CREATE POLICY "Admins manage question_reports" ON public.question_reports
      FOR ALL USING (public.is_admin());
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contact_messages') THEN
    ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Anyone submit contact_messages" ON public.contact_messages;
    DROP POLICY IF EXISTS "Admins manage contact_messages" ON public.contact_messages;

    CREATE POLICY "Anyone submit contact_messages" ON public.contact_messages
      FOR INSERT WITH CHECK (true);

    CREATE POLICY "Admins manage contact_messages" ON public.contact_messages
      FOR ALL USING (public.is_admin());
  END IF;
END ;


-- 3. TECHNICAL & INTERVIEW CONTENT TABLES
DO 
BEGIN
  -- technical_topics
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'technical_topics') THEN
    ALTER TABLE public.technical_topics ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Read technical_topics" ON public.technical_topics;
    DROP POLICY IF EXISTS "Admins mutate technical_topics" ON public.technical_topics;

    CREATE POLICY "Read technical_topics" ON public.technical_topics
      FOR SELECT USING (COALESCE(is_hidden, false) = false OR public.is_admin());
    CREATE POLICY "Admins mutate technical_topics" ON public.technical_topics
      FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;

  -- technical_problems
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'technical_problems') THEN
    ALTER TABLE public.technical_problems ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Read technical_problems" ON public.technical_problems;
    DROP POLICY IF EXISTS "Admins mutate technical_problems" ON public.technical_problems;

    CREATE POLICY "Read technical_problems" ON public.technical_problems
      FOR SELECT USING (COALESCE(is_deleted, false) = false AND (COALESCE(is_hidden, false) = false OR public.is_admin()));
    CREATE POLICY "Admins mutate technical_problems" ON public.technical_problems
      FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;

  -- technical_mcqs
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'technical_mcqs') THEN
    ALTER TABLE public.technical_mcqs ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Read technical_mcqs" ON public.technical_mcqs;
    DROP POLICY IF EXISTS "Admins mutate technical_mcqs" ON public.technical_mcqs;

    CREATE POLICY "Read technical_mcqs" ON public.technical_mcqs
      FOR SELECT USING (COALESCE(is_deleted, false) = false AND (COALESCE(is_hidden, false) = false OR public.is_admin()));
    CREATE POLICY "Admins mutate technical_mcqs" ON public.technical_mcqs
      FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;

  -- interview_topics
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'interview_topics') THEN
    ALTER TABLE public.interview_topics ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Read interview_topics" ON public.interview_topics;
    DROP POLICY IF EXISTS "Admins mutate interview_topics" ON public.interview_topics;

    CREATE POLICY "Read interview_topics" ON public.interview_topics
      FOR SELECT USING (COALESCE(is_hidden, false) = false OR public.is_admin());
    CREATE POLICY "Admins mutate interview_topics" ON public.interview_topics
      FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;

  -- interview_questions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'interview_questions') THEN
    ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Read interview_questions" ON public.interview_questions;
    DROP POLICY IF EXISTS "Admins mutate interview_questions" ON public.interview_questions;

    CREATE POLICY "Read interview_questions" ON public.interview_questions
      FOR SELECT USING (COALESCE(is_deleted, false) = false AND (COALESCE(is_hidden, false) = false OR public.is_admin()));
    CREATE POLICY "Admins mutate interview_questions" ON public.interview_questions
      FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;

  -- aptitude_topics
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'aptitude_topics') THEN
    ALTER TABLE public.aptitude_topics ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Read aptitude_topics" ON public.aptitude_topics;
    DROP POLICY IF EXISTS "Admins mutate aptitude_topics" ON public.aptitude_topics;

    CREATE POLICY "Read aptitude_topics" ON public.aptitude_topics
      FOR SELECT USING (COALESCE(is_hidden, false) = false OR public.is_admin());
    CREATE POLICY "Admins mutate aptitude_topics" ON public.aptitude_topics
      FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;
END ;


-- 4. MOCK EXAMS & STUDENT ATTEMPTS
DO 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mock_exams') THEN
    ALTER TABLE public.mock_exams ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public read mock_exams" ON public.mock_exams;
    DROP POLICY IF EXISTS "Admins mutate mock_exams" ON public.mock_exams;

    CREATE POLICY "Public read mock_exams" ON public.mock_exams
      FOR SELECT USING (COALESCE(is_deleted, false) = false OR public.is_admin());
    CREATE POLICY "Admins mutate mock_exams" ON public.mock_exams
      FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'student_exam_attempts') THEN
    ALTER TABLE public.student_exam_attempts ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Students read own attempts" ON public.student_exam_attempts;
    DROP POLICY IF EXISTS "Students insert own attempts" ON public.student_exam_attempts;
    DROP POLICY IF EXISTS "Students update own attempts" ON public.student_exam_attempts;

    CREATE POLICY "Students read own attempts" ON public.student_exam_attempts
      FOR SELECT USING (
        public.is_admin()
        OR (auth.email() IS NOT NULL AND LOWER(student_email) = LOWER(auth.email()))
      );

    CREATE POLICY "Students insert own attempts" ON public.student_exam_attempts
      FOR INSERT WITH CHECK (
        public.is_admin()
        OR (auth.email() IS NOT NULL AND LOWER(student_email) = LOWER(auth.email()))
      );

    CREATE POLICY "Students update own attempts" ON public.student_exam_attempts
      FOR UPDATE USING (
        public.is_admin()
        OR (auth.email() IS NOT NULL AND LOWER(student_email) = LOWER(auth.email()))
      );
  END IF;
END ;
