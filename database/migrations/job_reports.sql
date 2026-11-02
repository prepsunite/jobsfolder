-- ============================================================
-- Job Listing Reports & Moderation Migration
-- Safe, Idempotent Script for Supabase SQL Editor / CLI
-- ============================================================

-- 1. Table definition
CREATE TABLE IF NOT EXISTS public.job_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.job_listings(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'RESOLVED', 'DISMISSED')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_job_reports_status ON public.job_reports (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_reports_job_id ON public.job_reports (job_id);

-- 3. Row Level Security (RLS) Lockdown
ALTER TABLE public.job_reports ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to ensure clean, idempotent setup
DROP POLICY IF EXISTS "Public insert job reports" ON public.job_reports;
DROP POLICY IF EXISTS "Admins manage job reports" ON public.job_reports;

-- Policy A: Anyone (students, applicants, guests) can submit a report
CREATE POLICY "Public insert job reports"
  ON public.job_reports
  FOR INSERT
  WITH CHECK (true);

-- Policy B: Verified admins have full access (SELECT, UPDATE, DELETE)
CREATE POLICY "Admins manage job reports"
  ON public.job_reports
  FOR ALL
  USING (
    auth.uid() IS NOT NULL AND (
      (CASE WHEN to_regproc('public.is_admin') IS NOT NULL THEN public.is_admin() ELSE false END)
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
          AND (
            LOWER(COALESCE(profiles.role, '')) IN ('admin', 'superadmin', 'tpo_admin')
            OR LOWER(COALESCE(profiles.email, '')) IN (
              'mockfolder@gmail.com',
              'venkatmukala9@gmail.com',
              'prepsunite@gmail.com'
            )
          )
      )
      OR (auth.jwt() ->> 'email') IN (
        'mockfolder@gmail.com',
        'venkatmukala9@gmail.com',
        'prepsunite@gmail.com'
      )
    )
  );
