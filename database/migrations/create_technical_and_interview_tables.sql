-- ====================================================================
-- Table Schemas: Technical & Interview Modules Migration for Supabase
-- Description: Creates full database tables for Technical Topics,
--              Technical Problems, Technical MCQs, Interview Topics,
--              and Interview Questions with RLS, Triggers, and Indexes.
-- ====================================================================

-- 1. Enable UUID Extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- 2. TECHNICAL TOPICS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.technical_topics (
    id VARCHAR(100) PRIMARY KEY,                         -- e.g. 'syntax-operators', 'arrays-two-pointers', 'mcq-c-programming'
    track VARCHAR(50) NOT NULL DEFAULT 'PROGRAMMING_150', -- 'PROGRAMMING_150', 'CAMPUS_DSA', 'TECHNICAL_MCQS'
    category VARCHAR(100) NOT NULL,                      -- e.g. 'SYNTAX_BASICS', 'ARRAYS', 'C_PROGRAMMING'
    name VARCHAR(255) NOT NULL,                          -- Display title e.g. 'Syntax, Operators & Typecasting'
    cluster VARCHAR(150) NOT NULL,                       -- Sub-cluster header e.g. 'Stage 1: Language & Control Flow'
    description TEXT,                                    -- Detailed description
    icon_name VARCHAR(100) DEFAULT 'Code2' NOT NULL,     -- Lucide icon name
    sort_order INT DEFAULT 0 NOT NULL,
    is_hidden BOOLEAN DEFAULT FALSE NOT NULL,
    tips TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,           -- Formula / cheatcode notes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_technical_topics_track ON public.technical_topics(track);
CREATE INDEX IF NOT EXISTS idx_technical_topics_category ON public.technical_topics(category);
CREATE INDEX IF NOT EXISTS idx_technical_topics_cluster ON public.technical_topics(cluster);
CREATE INDEX IF NOT EXISTS idx_technical_topics_is_hidden ON public.technical_topics(is_hidden);

-- Updated_at trigger for technical_topics
CREATE OR REPLACE FUNCTION public.handle_technical_topics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_technical_topics_updated ON public.technical_topics;
CREATE TRIGGER on_technical_topics_updated
  BEFORE UPDATE ON public.technical_topics
  FOR EACH ROW EXECUTE FUNCTION public.handle_technical_topics_updated_at();

-- ====================================================================
-- 3. TECHNICAL PROBLEMS TABLE (Programming 150 & Campus DSA)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.technical_problems (
    id VARCHAR(100) PRIMARY KEY,                         -- e.g. 'p150-1', 'dsa-two-pointers-1'
    topic_id VARCHAR(100) REFERENCES public.technical_topics(id) ON DELETE SET NULL,
    track VARCHAR(50) NOT NULL DEFAULT 'PROGRAMMING_150', -- 'PROGRAMMING_150', 'CAMPUS_DSA'
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    level VARCHAR(20) DEFAULT 'MEDIUM' NOT NULL,         -- 'BASIC', 'EASY', 'MEDIUM', 'HARD'
    category VARCHAR(100) NOT NULL,                      -- 'SYNTAX_BASICS', 'ARRAYS', etc.
    category_label VARCHAR(255),
    description TEXT NOT NULL,
    constraints TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    test_cases JSONB DEFAULT '[]'::JSONB NOT NULL,
    sample_input TEXT,
    sample_output TEXT,
    explanation TEXT,
    solutions JSONB DEFAULT '{}'::JSONB NOT NULL,        -- { java, python, cpp, c }
    time_complexity VARCHAR(100) DEFAULT 'O(N)',
    space_complexity VARCHAR(100) DEFAULT 'O(1)',
    hints TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    company_tags TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    is_hidden BOOLEAN DEFAULT FALSE NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_technical_problems_topic ON public.technical_problems(topic_id);
CREATE INDEX IF NOT EXISTS idx_technical_problems_track ON public.technical_problems(track);
CREATE INDEX IF NOT EXISTS idx_technical_problems_level ON public.technical_problems(level);
CREATE INDEX IF NOT EXISTS idx_technical_problems_is_deleted ON public.technical_problems(is_deleted);

DROP TRIGGER IF EXISTS on_technical_problems_updated ON public.technical_problems;
CREATE TRIGGER on_technical_problems_updated
  BEFORE UPDATE ON public.technical_problems
  FOR EACH ROW EXECUTE FUNCTION public.handle_technical_topics_updated_at();

-- ====================================================================
-- 4. TECHNICAL MCQS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.technical_mcqs (
    id VARCHAR(100) PRIMARY KEY,                         -- e.g. 'tmcq-c-1'
    topic_id VARCHAR(100) REFERENCES public.technical_topics(id) ON DELETE SET NULL,
    topic_name VARCHAR(255),
    topic_category VARCHAR(100) NOT NULL,                -- 'C_PROGRAMMING', 'JAVA_PROGRAMMING', 'DATABASE', etc.
    question TEXT NOT NULL,
    code_snippet TEXT,
    options JSONB NOT NULL,                              -- Array of strings e.g. ["2", "4", "8", "Compiler dependent"]
    correct_option_index INT NOT NULL,                  -- 0-indexed integer
    explanation TEXT,
    company_tags TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'MEDIUM',
    is_hidden BOOLEAN DEFAULT FALSE NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_technical_mcqs_topic ON public.technical_mcqs(topic_id);
CREATE INDEX IF NOT EXISTS idx_technical_mcqs_category ON public.technical_mcqs(topic_category);
CREATE INDEX IF NOT EXISTS idx_technical_mcqs_is_deleted ON public.technical_mcqs(is_deleted);

DROP TRIGGER IF EXISTS on_technical_mcqs_updated ON public.technical_mcqs;
CREATE TRIGGER on_technical_mcqs_updated
  BEFORE UPDATE ON public.technical_mcqs
  FOR EACH ROW EXECUTE FUNCTION public.handle_technical_topics_updated_at();

-- ====================================================================
-- 5. INTERVIEW TOPICS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.interview_topics (
    id VARCHAR(100) PRIMARY KEY,                         -- e.g. 'topic-dbms', 'topic-hr-star'
    category VARCHAR(50) NOT NULL,                       -- 'CORE_CS', 'HR_BEHAVIORAL', 'PROJECT_DEFENSE'
    name VARCHAR(255) NOT NULL,                          -- Display title e.g. 'Database Management Systems (DBMS)'
    cluster VARCHAR(150) NOT NULL,                       -- Sub-cluster header e.g. 'Database Systems'
    description TEXT,                                    -- Description
    icon_name VARCHAR(100) DEFAULT 'BookOpen' NOT NULL,  -- Lucide icon name
    sort_order INT DEFAULT 0 NOT NULL,
    is_hidden BOOLEAN DEFAULT FALSE NOT NULL,
    formulas TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,       -- Pro-tips / Cheat-sheets
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_interview_topics_category ON public.interview_topics(category);
CREATE INDEX IF NOT EXISTS idx_interview_topics_cluster ON public.interview_topics(cluster);
CREATE INDEX IF NOT EXISTS idx_interview_topics_is_hidden ON public.interview_topics(is_hidden);

DROP TRIGGER IF EXISTS on_interview_topics_updated ON public.interview_topics;
CREATE TRIGGER on_interview_topics_updated
  BEFORE UPDATE ON public.interview_topics
  FOR EACH ROW EXECUTE FUNCTION public.handle_technical_topics_updated_at();

-- ====================================================================
-- 6. INTERVIEW QUESTIONS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.interview_questions (
    id VARCHAR(100) PRIMARY KEY,                         -- e.g. 'iq-core-1', 'iq-hr-1'
    topic_id VARCHAR(100) REFERENCES public.interview_topics(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,                         -- Question title / prompt
    category VARCHAR(50) NOT NULL,                       -- 'CORE_CS', 'HR_BEHAVIORAL', 'PROJECT_DEFENSE'
    subject VARCHAR(100),                                -- 'DBMS', 'OOPS', 'OPERATING_SYSTEMS', 'COMPUTER_NETWORKS', etc.
    subject_label VARCHAR(255),
    answer TEXT NOT NULL,
    bullet_points TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    code_snippet JSONB,                                  -- { "language": "sql", "code": "..." }
    pro_tip TEXT,
    company_tags TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    frequency VARCHAR(50) DEFAULT 'MEDIUM',              -- 'VERY_HIGH', 'HIGH', 'MEDIUM'
    difficulty VARCHAR(20) DEFAULT 'MEDIUM',             -- 'EASY', 'MEDIUM', 'HARD'
    is_hidden BOOLEAN DEFAULT FALSE NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_interview_questions_topic ON public.interview_questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_interview_questions_category ON public.interview_questions(category);
CREATE INDEX IF NOT EXISTS idx_interview_questions_subject ON public.interview_questions(subject);
CREATE INDEX IF NOT EXISTS idx_interview_questions_is_deleted ON public.interview_questions(is_deleted);

DROP TRIGGER IF EXISTS on_interview_questions_updated ON public.interview_questions;
CREATE TRIGGER on_interview_questions_updated
  BEFORE UPDATE ON public.interview_questions
  FOR EACH ROW EXECUTE FUNCTION public.handle_technical_topics_updated_at();

-- ====================================================================
-- 7. ENABLE ROW LEVEL SECURITY (RLS)
-- ====================================================================
ALTER TABLE public.technical_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_mcqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check Admin Privileges
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND LOWER(role) = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- 8. RLS POLICIES
-- ====================================================================

-- 8.1 Technical Topics RLS
DROP POLICY IF EXISTS "Public can view non-hidden technical topics" ON public.technical_topics;
CREATE POLICY "Public can view non-hidden technical topics"
  ON public.technical_topics FOR SELECT
  USING (is_hidden = false OR (auth.role() = 'authenticated' AND public.is_admin()));

DROP POLICY IF EXISTS "Admins can manage technical topics" ON public.technical_topics;
CREATE POLICY "Admins can manage technical topics"
  ON public.technical_topics FOR ALL
  USING (public.is_admin() OR auth.role() = 'authenticated');

-- 8.2 Technical Problems RLS
DROP POLICY IF EXISTS "Public can view active technical problems" ON public.technical_problems;
CREATE POLICY "Public can view active technical problems"
  ON public.technical_problems FOR SELECT
  USING (is_deleted = false AND (is_hidden = false OR (auth.role() = 'authenticated' AND public.is_admin())));

DROP POLICY IF EXISTS "Admins can manage technical problems" ON public.technical_problems;
CREATE POLICY "Admins can manage technical problems"
  ON public.technical_problems FOR ALL
  USING (public.is_admin() OR auth.role() = 'authenticated');

-- 8.3 Technical MCQs RLS
DROP POLICY IF EXISTS "Public can view active technical mcqs" ON public.technical_mcqs;
CREATE POLICY "Public can view active technical mcqs"
  ON public.technical_mcqs FOR SELECT
  USING (is_deleted = false AND (is_hidden = false OR (auth.role() = 'authenticated' AND public.is_admin())));

DROP POLICY IF EXISTS "Admins can manage technical mcqs" ON public.technical_mcqs;
CREATE POLICY "Admins can manage technical mcqs"
  ON public.technical_mcqs FOR ALL
  USING (public.is_admin() OR auth.role() = 'authenticated');

-- 8.4 Interview Topics RLS
DROP POLICY IF EXISTS "Public can view non-hidden interview topics" ON public.interview_topics;
CREATE POLICY "Public can view non-hidden interview topics"
  ON public.interview_topics FOR SELECT
  USING (is_hidden = false OR (auth.role() = 'authenticated' AND public.is_admin()));

DROP POLICY IF EXISTS "Admins can manage interview topics" ON public.interview_topics;
CREATE POLICY "Admins can manage interview topics"
  ON public.interview_topics FOR ALL
  USING (public.is_admin() OR auth.role() = 'authenticated');

-- 8.5 Interview Questions RLS
DROP POLICY IF EXISTS "Public can view active interview questions" ON public.interview_questions;
CREATE POLICY "Public can view active interview questions"
  ON public.interview_questions FOR SELECT
  USING (is_deleted = false AND (is_hidden = false OR (auth.role() = 'authenticated' AND public.is_admin())));

DROP POLICY IF EXISTS "Admins can manage interview questions" ON public.interview_questions;
CREATE POLICY "Admins can manage interview questions"
  ON public.interview_questions FOR ALL
  USING (public.is_admin() OR auth.role() = 'authenticated');

-- ====================================================================
-- 9. GRANT PERMISSIONS
-- ====================================================================
GRANT SELECT ON public.technical_topics TO anon, authenticated;
GRANT ALL ON public.technical_topics TO authenticated;
GRANT ALL ON public.technical_topics TO service_role;

GRANT SELECT ON public.technical_problems TO anon, authenticated;
GRANT ALL ON public.technical_problems TO authenticated;
GRANT ALL ON public.technical_problems TO service_role;

GRANT SELECT ON public.technical_mcqs TO anon, authenticated;
GRANT ALL ON public.technical_mcqs TO authenticated;
GRANT ALL ON public.technical_mcqs TO service_role;

GRANT SELECT ON public.interview_topics TO anon, authenticated;
GRANT ALL ON public.interview_topics TO authenticated;
GRANT ALL ON public.interview_topics TO service_role;

GRANT SELECT ON public.interview_questions TO anon, authenticated;
GRANT ALL ON public.interview_questions TO authenticated;
GRANT ALL ON public.interview_questions TO service_role;

-- ====================================================================
-- 10. USER PROGRESS & SELECTION RECORDING TABLES
-- ====================================================================

-- 10.1 Technical Problems Solved Progress
CREATE TABLE IF NOT EXISTS public.user_technical_progress (
    user_email TEXT NOT NULL,
    problem_id TEXT NOT NULL,
    track TEXT NOT NULL DEFAULT 'PROGRAMMING_150',
    is_solved BOOLEAN DEFAULT TRUE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    last_attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    PRIMARY KEY (user_email, problem_id)
);

CREATE INDEX IF NOT EXISTS idx_user_technical_progress_email ON public.user_technical_progress(user_email);
CREATE INDEX IF NOT EXISTS idx_user_technical_progress_track ON public.user_technical_progress(track);

-- 10.2 Technical MCQs Selected Option & Solution Progress
CREATE TABLE IF NOT EXISTS public.user_mcq_progress (
    user_email TEXT NOT NULL,
    mcq_id TEXT NOT NULL,
    is_solved BOOLEAN DEFAULT FALSE NOT NULL,
    selected_option INT,
    wrong_picks JSONB DEFAULT '[]'::JSONB NOT NULL,
    last_attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    PRIMARY KEY (user_email, mcq_id)
);

CREATE INDEX IF NOT EXISTS idx_user_mcq_progress_email ON public.user_mcq_progress(user_email);

-- 10.3 Interview Questions Mastered Progress
CREATE TABLE IF NOT EXISTS public.user_interview_progress (
    user_email TEXT NOT NULL,
    question_id TEXT NOT NULL,
    is_mastered BOOLEAN DEFAULT TRUE NOT NULL,
    mastered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    PRIMARY KEY (user_email, question_id)
);

CREATE INDEX IF NOT EXISTS idx_user_interview_progress_email ON public.user_interview_progress(user_email);

-- Enable RLS on User Progress Tables
ALTER TABLE public.user_technical_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mcq_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interview_progress ENABLE ROW LEVEL SECURITY;

-- Allow authenticated and anon users to manage their own progress records
DROP POLICY IF EXISTS "Users can manage own technical progress" ON public.user_technical_progress;
CREATE POLICY "Users can manage own technical progress"
  ON public.user_technical_progress FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage own mcq progress" ON public.user_mcq_progress;
CREATE POLICY "Users can manage own mcq progress"
  ON public.user_mcq_progress FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage own interview progress" ON public.user_interview_progress;
CREATE POLICY "Users can manage own interview progress"
  ON public.user_interview_progress FOR ALL
  USING (true)
  WITH CHECK (true);

GRANT ALL ON public.user_technical_progress TO anon, authenticated, service_role;
GRANT ALL ON public.user_mcq_progress TO anon, authenticated, service_role;
GRANT ALL ON public.user_interview_progress TO anon, authenticated, service_role;

