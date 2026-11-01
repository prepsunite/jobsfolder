-- ============================================================
-- Jobs & Internships Board Migration
-- Safe, Idempotent Script for Supabase SQL Editor / CLI
-- ============================================================

-- 1. Table definition
CREATE TABLE IF NOT EXISTS public.job_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  type TEXT NOT NULL CHECK (type IN ('JOB', 'INTERNSHIP')),
  location TEXT NOT NULL DEFAULT 'Remote',
  experience_min INTEGER NOT NULL DEFAULT 0,  -- years
  experience_max INTEGER,                      -- years, null = any
  stipend_or_salary TEXT,                      -- e.g. "₹20,000/month" or "₹8–12 LPA"
  description TEXT,
  apply_url TEXT NOT NULL,
  deadline TIMESTAMPTZ,                        -- null = no deadline / rolling
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_job_listings_is_active ON public.job_listings (is_active);
CREATE INDEX IF NOT EXISTS idx_job_listings_type ON public.job_listings (type);
CREATE INDEX IF NOT EXISTS idx_job_listings_sort ON public.job_listings (is_featured DESC, sort_order ASC, created_at DESC);

-- 3. Row Level Security (RLS) Lockdown
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to ensure clean, idempotent setup
DROP POLICY IF EXISTS "Public read active job listings" ON public.job_listings;
DROP POLICY IF EXISTS "Admin full access job listings" ON public.job_listings;
DROP POLICY IF EXISTS "Admins full access job listings" ON public.job_listings;
DROP POLICY IF EXISTS "Admins insert job listings" ON public.job_listings;
DROP POLICY IF EXISTS "Admins update job listings" ON public.job_listings;
DROP POLICY IF EXISTS "Admins delete job listings" ON public.job_listings;

-- Policy A: Students, guests & public can ONLY read active listings
CREATE POLICY "Public read active job listings"
  ON public.job_listings
  FOR SELECT
  USING (is_active = true);

-- Helper expression for admin check: uses public.is_admin() if available,
-- with a fallback to checking profiles role / verified super admin emails.
-- Only verified admins can view all listings (including inactive) and mutate.
CREATE POLICY "Admins select all job listings"
  ON public.job_listings
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND (
      (CASE WHEN to_regproc('public.is_admin') IS NOT NULL THEN public.is_admin() ELSE false END)
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
          AND (
            LOWER(COALESCE(profiles.role, '')) = 'admin'
            OR LOWER(COALESCE(profiles.email, '')) IN (
              'mockfolder@gmail.com',
              'venkatmukala9@gmail.com',
              'venkat.mukala9@gmail.com',
              'venkatmukala3@gmail.com',
              'venkat.mukala3@gmail.com',
              'prepsunite@gmail.com'
            )
          )
      )
    )
  );

CREATE POLICY "Admins insert job listings"
  ON public.job_listings
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND (
      (CASE WHEN to_regproc('public.is_admin') IS NOT NULL THEN public.is_admin() ELSE false END)
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
          AND (
            LOWER(COALESCE(profiles.role, '')) = 'admin'
            OR LOWER(COALESCE(profiles.email, '')) IN (
              'mockfolder@gmail.com',
              'venkatmukala9@gmail.com',
              'venkat.mukala9@gmail.com',
              'venkatmukala3@gmail.com',
              'venkat.mukala3@gmail.com',
              'prepsunite@gmail.com'
            )
          )
      )
    )
  );

CREATE POLICY "Admins update job listings"
  ON public.job_listings
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND (
      (CASE WHEN to_regproc('public.is_admin') IS NOT NULL THEN public.is_admin() ELSE false END)
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
          AND (
            LOWER(COALESCE(profiles.role, '')) = 'admin'
            OR LOWER(COALESCE(profiles.email, '')) IN (
              'mockfolder@gmail.com',
              'venkatmukala9@gmail.com',
              'venkat.mukala9@gmail.com',
              'venkatmukala3@gmail.com',
              'venkat.mukala3@gmail.com',
              'prepsunite@gmail.com'
            )
          )
      )
    )
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND (
      (CASE WHEN to_regproc('public.is_admin') IS NOT NULL THEN public.is_admin() ELSE false END)
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
          AND (
            LOWER(COALESCE(profiles.role, '')) = 'admin'
            OR LOWER(COALESCE(profiles.email, '')) IN (
              'mockfolder@gmail.com',
              'venkatmukala9@gmail.com',
              'venkat.mukala9@gmail.com',
              'venkatmukala3@gmail.com',
              'venkat.mukala3@gmail.com',
              'prepsunite@gmail.com'
            )
          )
      )
    )
  );

CREATE POLICY "Admins delete job listings"
  ON public.job_listings
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND (
      (CASE WHEN to_regproc('public.is_admin') IS NOT NULL THEN public.is_admin() ELSE false END)
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
          AND (
            LOWER(COALESCE(profiles.role, '')) = 'admin'
            OR LOWER(COALESCE(profiles.email, '')) IN (
              'mockfolder@gmail.com',
              'venkatmukala9@gmail.com',
              'venkat.mukala9@gmail.com',
              'venkatmukala3@gmail.com',
              'venkat.mukala3@gmail.com',
              'prepsunite@gmail.com'
            )
          )
      )
    )
  );

-- 4. Permissions
GRANT SELECT ON public.job_listings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.job_listings TO authenticated;

-- 5. Updated_at Trigger
CREATE OR REPLACE FUNCTION update_job_listings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = '';

DROP TRIGGER IF EXISTS trg_job_listings_updated_at ON public.job_listings;

CREATE TRIGGER trg_job_listings_updated_at
  BEFORE UPDATE ON public.job_listings
  FOR EACH ROW EXECUTE FUNCTION update_job_listings_updated_at();
