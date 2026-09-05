-- ====================================================================
-- PrepUnite: Fix paper_tab_nodes is_free Column & RLS Policy
-- Run this in Supabase SQL Editor to resolve the last 2 missing items.
-- ====================================================================

-- 1. Add the missing is_free column
ALTER TABLE public.paper_tab_nodes 
ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT FALSE;

-- 2. Set the first tab (sort_order = 0) as free preview
UPDATE public.paper_tab_nodes 
SET is_free = true 
WHERE sort_order = 0 AND (is_free IS NULL OR is_free = false);

-- 3. Enable Row Level Security
ALTER TABLE public.paper_tab_nodes ENABLE ROW LEVEL SECURITY;

-- 4. Clean up any existing policies
DROP POLICY IF EXISTS "Public select paper nodes" ON public.paper_tab_nodes;
DROP POLICY IF EXISTS "Allow select" ON public.paper_tab_nodes;
DROP POLICY IF EXISTS "Allow public read access to paper_tab_nodes" ON public.paper_tab_nodes;
DROP POLICY IF EXISTS "Admin write paper nodes" ON public.paper_tab_nodes;
DROP POLICY IF EXISTS "Secure select paper nodes" ON public.paper_tab_nodes;

-- 5. Create Admin Write Policy
CREATE POLICY "Admin write paper nodes" 
ON public.paper_tab_nodes 
FOR ALL 
USING (public.is_admin());

-- 6. Create the Secure Select Policy
CREATE POLICY "Secure select paper nodes" 
ON public.paper_tab_nodes 
FOR SELECT 
USING (
  is_deleted = false AND (
    is_free = true 
    OR public.is_admin() 
    OR (
      auth.jwt()->>'email' IS NOT NULL 
      AND public.check_user_paper_access(LOWER(auth.jwt()->>'email'), exam_id::TEXT)
    )
  )
);
