-- ============================================================================
-- Admin-Only Job Triage Votes (Thumbs Up / Thumbs Down)
-- Stores persistent admin review state (UP = Keep, DOWN = Flagged for Delete).
-- Strictly isolated via RLS: anonymous visitors and non-admin students have
-- zero SELECT/INSERT/UPDATE/DELETE access at the database level.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.job_admin_reviews (
  job_id UUID PRIMARY KEY REFERENCES public.job_listings(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('UP', 'DOWN')),
  updated_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_job_admin_reviews_vote
  ON public.job_admin_reviews (vote);

-- Lock down permissions: never grant anon/public access
REVOKE ALL ON public.job_admin_reviews FROM anon, PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_admin_reviews TO authenticated;

ALTER TABLE public.job_admin_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "job_admin_reviews_select_admin" ON public.job_admin_reviews;
DROP POLICY IF EXISTS "job_admin_reviews_insert_admin" ON public.job_admin_reviews;
DROP POLICY IF EXISTS "job_admin_reviews_update_admin" ON public.job_admin_reviews;
DROP POLICY IF EXISTS "job_admin_reviews_delete_admin" ON public.job_admin_reviews;

CREATE POLICY "job_admin_reviews_select_admin" ON public.job_admin_reviews
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL AND (SELECT public.is_admin()));

CREATE POLICY "job_admin_reviews_insert_admin" ON public.job_admin_reviews
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL AND (SELECT public.is_admin()));

CREATE POLICY "job_admin_reviews_update_admin" ON public.job_admin_reviews
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL AND (SELECT public.is_admin()))
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL AND (SELECT public.is_admin()));

CREATE POLICY "job_admin_reviews_delete_admin" ON public.job_admin_reviews
  FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL AND (SELECT public.is_admin()));

CREATE OR REPLACE FUNCTION public.update_job_admin_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = '';

DROP TRIGGER IF EXISTS trg_job_admin_reviews_updated_at ON public.job_admin_reviews;

CREATE TRIGGER trg_job_admin_reviews_updated_at
  BEFORE UPDATE ON public.job_admin_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_job_admin_reviews_updated_at();

NOTIFY pgrst, 'reload schema';
