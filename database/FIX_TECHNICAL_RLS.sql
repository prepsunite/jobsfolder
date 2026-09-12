-- ====================================================================
-- Fix RLS Policies for Technical & Interview Tables
-- Description: Brings technical_problems, technical_mcqs, and
--              interview_questions into parity with topic_questions.
-- ====================================================================

-- 1. Disable RLS or grant open write policies (matching topic_questions)
ALTER TABLE IF EXISTS public.technical_problems DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.technical_mcqs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.interview_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.technical_topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.interview_topics DISABLE ROW LEVEL SECURITY;

-- 2. Grant full permissions to anon, authenticated, and service_role
GRANT ALL ON TABLE public.technical_problems TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.technical_mcqs TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.interview_questions TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.technical_topics TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.interview_topics TO anon, authenticated, service_role;
