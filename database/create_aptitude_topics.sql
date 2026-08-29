-- ====================================================================
-- Table: public.aptitude_topics
-- Description: Master directory of all 128 aptitude syllabus topics across
--              7 core categories with formula cheat-sheets and icon metadata.
-- ====================================================================

-- 1. Create Table
CREATE TABLE IF NOT EXISTS public.aptitude_topics (
    id VARCHAR(100) PRIMARY KEY,                         -- Canonical URL slug (e.g. 'numbers', 'time-and-distance')
    category_slug VARCHAR(100) NOT NULL,                 -- Category group (e.g. 'arithmetic-aptitude', 'data-interpretation')
    name VARCHAR(255) NOT NULL,                          -- Display title (e.g. 'Problems on Trains')
    cluster VARCHAR(150) NOT NULL,                       -- Sub-cluster header (e.g. 'Time & Motion')
    description TEXT,                                    -- Short overview description
    icon_name VARCHAR(100) DEFAULT 'Folder' NOT NULL,    -- Lucide React icon name
    formulas TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,       -- Array of key formulas / rules
    is_hidden BOOLEAN DEFAULT FALSE NOT NULL,            -- Admin toggle to hide/archive topic
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_aptitude_topics_category ON public.aptitude_topics(category_slug);
CREATE INDEX IF NOT EXISTS idx_aptitude_topics_cluster ON public.aptitude_topics(cluster);
CREATE INDEX IF NOT EXISTS idx_aptitude_topics_is_hidden ON public.aptitude_topics(is_hidden);

-- 3. Automatic Updated At Timestamp Trigger
CREATE OR REPLACE FUNCTION public.handle_aptitude_topics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_aptitude_topics_updated ON public.aptitude_topics;
CREATE TRIGGER on_aptitude_topics_updated
  BEFORE UPDATE ON public.aptitude_topics
  FOR EACH ROW EXECUTE FUNCTION public.handle_aptitude_topics_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.aptitude_topics ENABLE ROW LEVEL SECURITY;

-- 5. Helper Function: Check Admin Privileges
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

-- 6. Row Level Security Policies
DROP POLICY IF EXISTS "Public can view non-hidden aptitude topics" ON public.aptitude_topics;
CREATE POLICY "Public can view non-hidden aptitude topics"
  ON public.aptitude_topics
  FOR SELECT
  USING (
    is_hidden = false 
    OR (auth.role() = 'authenticated' AND public.is_admin())
  );

DROP POLICY IF EXISTS "Admins can insert aptitude topics" ON public.aptitude_topics;
CREATE POLICY "Admins can insert aptitude topics"
  ON public.aptitude_topics
  FOR INSERT
  WITH CHECK (
    public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can update aptitude topics" ON public.aptitude_topics;
CREATE POLICY "Admins can update aptitude topics"
  ON public.aptitude_topics
  FOR UPDATE
  USING (
    public.is_admin()
  )
  WITH CHECK (
    public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can delete aptitude topics" ON public.aptitude_topics;
CREATE POLICY "Admins can delete aptitude topics"
  ON public.aptitude_topics
  FOR DELETE
  USING (
    public.is_admin()
  );

-- 7. Grant Permissions
GRANT SELECT ON public.aptitude_topics TO anon, authenticated;
GRANT ALL ON public.aptitude_topics TO authenticated;
GRANT ALL ON public.aptitude_topics TO service_role;