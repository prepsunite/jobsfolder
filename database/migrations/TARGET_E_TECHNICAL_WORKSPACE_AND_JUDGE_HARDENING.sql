-- ============================================================================
-- PREPUNITE TARGET E HARDENING: TECHNICAL WORKSPACE & ONLINE JUDGE SECURITY
-- Migration Name: TARGET_E_TECHNICAL_WORKSPACE_AND_JUDGE_HARDENING.sql
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- ── 1. Create user_technical_submissions Table (Immutable Audit Ledger) ───────
CREATE TABLE IF NOT EXISTS public.user_technical_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) NOT NULL,
    problem_id VARCHAR(100) NOT NULL REFERENCES public.technical_problems(id) ON DELETE CASCADE,
    language VARCHAR(50) NOT NULL,              -- 'python', 'cpp', 'java', 'c'
    source_code TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,                -- 'ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'COMPILATION_ERROR', 'RUNTIME_ERROR'
    runtime_ms INTEGER DEFAULT 0 NOT NULL,
    memory_kb INTEGER DEFAULT 0 NOT NULL,
    passed_cases INTEGER DEFAULT 0 NOT NULL,
    total_cases INTEGER DEFAULT 0 NOT NULL,
    error_output TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_submissions_user_problem ON public.user_technical_submissions(user_email, problem_id);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON public.user_technical_submissions(created_at DESC);

-- ── 2. Add Separate Public Sample Cases and Hidden Test Cases Columns ────────
ALTER TABLE public.technical_problems 
  ADD COLUMN IF NOT EXISTS sample_cases JSONB DEFAULT '[]'::jsonb NOT NULL,
  ADD COLUMN IF NOT EXISTS hidden_test_cases JSONB DEFAULT '[]'::jsonb NOT NULL;

-- ── 3. Enable RLS on user_technical_submissions ──────────────────────────────
ALTER TABLE public.user_technical_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own submissions" ON public.user_technical_submissions;
CREATE POLICY "Users read own submissions"
  ON public.user_technical_submissions FOR SELECT
  USING (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_email = auth.jwt()->>'email'
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Super admins manage submissions" ON public.user_technical_submissions;
CREATE POLICY "Super admins manage submissions"
  ON public.user_technical_submissions FOR ALL
  USING (public.is_admin());

-- ── 4. FIX OPEN RLS ON USER PROGRESS TABLES [P0-03] ─────────────────────────
-- Revoke the overly permissive 'USING (true)' policies from create_technical_and_interview_tables.sql
ALTER TABLE public.user_technical_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mcq_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interview_progress ENABLE ROW LEVEL SECURITY;

-- 4.1 user_technical_progress
DROP POLICY IF EXISTS "Users can manage own technical progress" ON public.user_technical_progress;
DROP POLICY IF EXISTS "Users read own technical progress" ON public.user_technical_progress;
DROP POLICY IF EXISTS "Users insert own technical progress" ON public.user_technical_progress;
DROP POLICY IF EXISTS "Users update own technical progress" ON public.user_technical_progress;
DROP POLICY IF EXISTS "Users delete own technical progress" ON public.user_technical_progress;

CREATE POLICY "Users read own technical progress"
  ON public.user_technical_progress FOR SELECT
  USING (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_email = auth.jwt()->>'email'
    OR public.is_admin()
  );

CREATE POLICY "Users insert own technical progress"
  ON public.user_technical_progress FOR INSERT
  WITH CHECK (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_email = auth.jwt()->>'email'
    OR public.is_admin()
  );

CREATE POLICY "Users update own technical progress"
  ON public.user_technical_progress FOR UPDATE
  USING (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_email = auth.jwt()->>'email'
    OR public.is_admin()
  )
  WITH CHECK (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_email = auth.jwt()->>'email'
    OR public.is_admin()
  );

CREATE POLICY "Users delete own technical progress"
  ON public.user_technical_progress FOR DELETE
  USING (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_email = auth.jwt()->>'email'
    OR public.is_admin()
  );

-- 4.2 user_mcq_progress
DROP POLICY IF EXISTS "Users can manage own mcq progress" ON public.user_mcq_progress;
DROP POLICY IF EXISTS "Users read own mcq progress" ON public.user_mcq_progress;
DROP POLICY IF EXISTS "Users mutate own mcq progress" ON public.user_mcq_progress;

CREATE POLICY "Users read own mcq progress"
  ON public.user_mcq_progress FOR SELECT
  USING (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_email = auth.jwt()->>'email'
    OR public.is_admin()
  );

CREATE POLICY "Users mutate own mcq progress"
  ON public.user_mcq_progress FOR ALL
  USING (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_email = auth.jwt()->>'email'
    OR public.is_admin()
  )
  WITH CHECK (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_email = auth.jwt()->>'email'
    OR public.is_admin()
  );

-- 4.3 user_interview_progress
DROP POLICY IF EXISTS "Users can manage own interview progress" ON public.user_interview_progress;
DROP POLICY IF EXISTS "Users read own interview progress" ON public.user_interview_progress;
DROP POLICY IF EXISTS "Users mutate own interview progress" ON public.user_interview_progress;

CREATE POLICY "Users read own interview progress"
  ON public.user_interview_progress FOR SELECT
  USING (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_email = auth.jwt()->>'email'
    OR public.is_admin()
  );

CREATE POLICY "Users mutate own interview progress"
  ON public.user_interview_progress FOR ALL
  USING (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_email = auth.jwt()->>'email'
    OR public.is_admin()
  )
  WITH CHECK (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_email = auth.jwt()->>'email'
    OR public.is_admin()
  );

-- ── 5. Revoke direct anon mutations on user progress tables ──────────────────
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.user_technical_progress FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.user_mcq_progress FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.user_interview_progress FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.user_technical_submissions FROM anon;

-- ── 6. Atomic RPC: record_verified_coding_submission ─────────────────────────
-- Called exclusively by the backend /api/execute-code handler after all test cases execute
CREATE OR REPLACE FUNCTION public.record_verified_coding_submission(
    p_user_email TEXT,
    p_problem_id TEXT,
    p_language TEXT,
    p_source_code TEXT,
    p_status TEXT,
    p_runtime_ms INTEGER,
    p_memory_kb INTEGER,
    p_passed_cases INTEGER,
    p_total_cases INTEGER,
    p_error_output TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_clean_email TEXT;
    v_submission_id UUID;
    v_is_accepted BOOLEAN;
    v_problem_track TEXT;
BEGIN
    v_clean_email := LOWER(TRIM(p_user_email));
    v_is_accepted := (p_status = 'ACCEPTED' AND p_passed_cases = p_total_cases AND p_total_cases > 0);

    -- 1. Insert immutable submission record
    INSERT INTO public.user_technical_submissions (
        user_email,
        problem_id,
        language,
        source_code,
        status,
        runtime_ms,
        memory_kb,
        passed_cases,
        total_cases,
        error_output,
        created_at
    ) VALUES (
        v_clean_email,
        p_problem_id,
        p_language,
        p_source_code,
        p_status,
        p_runtime_ms,
        p_memory_kb,
        p_passed_cases,
        p_total_cases,
        p_error_output,
        NOW()
    ) RETURNING id INTO v_submission_id;

    -- 2. If all test cases passed, update user_technical_progress
    IF v_is_accepted THEN
        SELECT track INTO v_problem_track
        FROM public.technical_problems
        WHERE id = p_problem_id;

        INSERT INTO public.user_technical_progress (
            user_email,
            problem_id,
            track,
            is_solved,
            completed_at,
            last_attempted_at
        ) VALUES (
            v_clean_email,
            p_problem_id,
            COALESCE(v_problem_track, 'PROGRAMMING_150'),
            TRUE,
            NOW(),
            NOW()
        )
        ON CONFLICT (user_email, problem_id) DO UPDATE SET
            is_solved = TRUE,
            completed_at = COALESCE(user_technical_progress.completed_at, NOW()),
            last_attempted_at = NOW();
    ELSE
        -- Update last_attempted_at without setting is_solved = true
        INSERT INTO public.user_technical_progress (
            user_email,
            problem_id,
            track,
            is_solved,
            completed_at,
            last_attempted_at
        ) VALUES (
            v_clean_email,
            p_problem_id,
            'PROGRAMMING_150',
            FALSE,
            NULL,
            NOW()
        )
        ON CONFLICT (user_email, problem_id) DO UPDATE SET
            last_attempted_at = NOW();
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'submission_id', v_submission_id,
        'is_accepted', v_is_accepted
    );
END;
$$;
