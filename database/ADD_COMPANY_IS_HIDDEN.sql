-- ====================================================================
-- PrepUnite: Add is_hidden column to companies table
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/tufajuhxjfbrbxsfzbpx/sql/new
-- ====================================================================

-- 1. Add is_hidden column with default false
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;

-- 2. Create index for fast filtering
CREATE INDEX IF NOT EXISTS idx_companies_is_hidden 
ON public.companies(is_hidden) 
WHERE is_deleted = FALSE;

-- 3. Grant permissions to anon, authenticated, and service_role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO anon, authenticated, service_role;

-- 4. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
