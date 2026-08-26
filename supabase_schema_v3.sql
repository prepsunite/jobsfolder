-- ====================================================================
-- PrepUnite / Jobsfolder - Production Supabase Migration Script (v3)
-- Safe Column Alterations, Single Source of Truth, RBAC, Triggers, Soft Delete
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Profiles Table (User RBAC Storage)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user' NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user' NOT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Dynamic RLS Admin Validation Function
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

-- 4. Automatic Updated At Timestamp Function & Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Auto User Profile Creation Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    CASE 
      WHEN LOWER(NEW.email) IN ('venkatmukala9@gmail.com', 'venkat.mukala9@gmail.com', 'prepsunite@gmail.com', 'veen1kat@gmail.com') THEN 'admin'
      ELSE 'user'
    END,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.profiles.name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Companies Table
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    industry VARCHAR(150) DEFAULT 'IT Services & Consulting',
    company_size VARCHAR(100) DEFAULT '10,000+ employees',
    headquarters VARCHAR(150) DEFAULT 'Pan-India',
    description TEXT,
    website_url TEXT,
    logo_url TEXT,
    about_company TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS about_company TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE NOT NULL;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

DROP TRIGGER IF EXISTS tr_companies_updated_at ON public.companies;
CREATE TRIGGER tr_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 7. Exams Table
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    company_slug VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    badge VARCHAR(100) DEFAULT 'Campus Recruitment Drive',
    content TEXT,
    old_papers TEXT,
    price DECIMAL(10, 2) DEFAULT 99.00 NOT NULL,
    paper_tabs JSONB DEFAULT '[]'::jsonb,
    google_doc_embed_url TEXT,
    google_doc_edit_url TEXT,
    upvotes INT DEFAULT 0 NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS paper_tabs JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS google_doc_embed_url TEXT;
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS google_doc_edit_url TEXT;
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE NOT NULL;
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Safely Add Unique Constraint to Exams Table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_company_exam_name'
    ) THEN
        ALTER TABLE public.exams ADD CONSTRAINT uq_company_exam_name UNIQUE (company_slug, name);
    END IF;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

DROP TRIGGER IF EXISTS tr_exams_updated_at ON public.exams;
CREATE TRIGGER tr_exams_updated_at
  BEFORE UPDATE ON public.exams
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. Topic Questions Table
CREATE TABLE IF NOT EXISTS public.topic_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
    topic_id VARCHAR(150) NOT NULL,
    company_slug VARCHAR(255) NOT NULL,
    statement TEXT NOT NULL,
    options JSONB DEFAULT '[]'::jsonb NOT NULL,
    correct_answer INT NOT NULL,
    explanation TEXT,
    structured_explanation JSONB,
    difficulty VARCHAR(50) DEFAULT 'MEDIUM' NOT NULL,
    difficulty_level INT DEFAULT 2 NOT NULL,
    is_hidden BOOLEAN DEFAULT FALSE NOT NULL,
    question_number INT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.topic_questions ADD COLUMN IF NOT EXISTS exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE;
ALTER TABLE public.topic_questions ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.topic_questions ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.topic_questions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.topic_questions ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE NOT NULL;
ALTER TABLE public.topic_questions ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

DROP TRIGGER IF EXISTS tr_topic_questions_updated_at ON public.topic_questions;
CREATE TRIGGER tr_topic_questions_updated_at
  BEFORE UPDATE ON public.topic_questions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. Interview Experiences Table
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    company_slug VARCHAR(255) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    role_title VARCHAR(255) NOT NULL,
    college VARCHAR(255) DEFAULT 'Engineering College',
    year INT DEFAULT 2026,
    difficulty VARCHAR(50) DEFAULT 'MEDIUM',
    verdict VARCHAR(50) DEFAULT 'SELECTED',
    result VARCHAR(50) DEFAULT 'SELECTED',
    rounds JSONB DEFAULT '[]'::jsonb,
    overall_experience TEXT,
    tips TEXT,
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE NOT NULL;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

DROP TRIGGER IF EXISTS tr_experiences_updated_at ON public.experiences;
CREATE TRIGGER tr_experiences_updated_at
  BEFORE UPDATE ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 10. Paper Tab Nodes Table (Hierarchical Document Explorer)
CREATE TABLE IF NOT EXISTS public.paper_tab_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    emoji VARCHAR(20) DEFAULT '📄',
    content TEXT,
    parent_id UUID REFERENCES public.paper_tab_nodes(id) ON DELETE CASCADE,
    sort_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL
);

ALTER TABLE public.paper_tab_nodes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.paper_tab_nodes ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE NOT NULL;

DROP TRIGGER IF EXISTS tr_paper_tab_nodes_updated_at ON public.paper_tab_nodes;
CREATE TRIGGER tr_paper_tab_nodes_updated_at
  BEFORE UPDATE ON public.paper_tab_nodes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 11. Admin Audit Logs Table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    admin_email VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_entity VARCHAR(100) NOT NULL,
    target_id VARCHAR(255),
    before_data JSONB,
    after_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 12. High Performance Indexes
CREATE INDEX IF NOT EXISTS idx_companies_slug ON public.companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_active ON public.companies(is_deleted);
CREATE INDEX IF NOT EXISTS idx_exams_company ON public.exams(company_slug, is_deleted);
CREATE INDEX IF NOT EXISTS idx_topic_questions_lookup ON public.topic_questions(company_slug, topic_id, is_deleted);
CREATE INDEX IF NOT EXISTS idx_experiences_lookup ON public.experiences(company_slug, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_paper_tab_nodes_exam ON public.paper_tab_nodes(exam_id, is_deleted);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.admin_audit_logs(created_at DESC);

-- 13. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_tab_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 14. RLS Security Policies

-- Profiles Policies
DROP POLICY IF EXISTS "Public profile view" ON public.profiles;
CREATE POLICY "Public profile view" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users update self info non-role" ON public.profiles;
CREATE POLICY "Users update self info non-role" ON public.profiles FOR UPDATE 
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admin modify profiles" ON public.profiles;
CREATE POLICY "Admin modify profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- Companies Policies
DROP POLICY IF EXISTS "Public select active companies" ON public.companies;
CREATE POLICY "Public select active companies" ON public.companies FOR SELECT USING (is_deleted = false);

DROP POLICY IF EXISTS "Admin write companies" ON public.companies;
CREATE POLICY "Admin write companies" ON public.companies FOR ALL USING (public.is_admin());

-- Exams Policies
DROP POLICY IF EXISTS "Public select active exams" ON public.exams;
CREATE POLICY "Public select active exams" ON public.exams FOR SELECT USING (is_deleted = false);

DROP POLICY IF EXISTS "Admin write exams" ON public.exams;
CREATE POLICY "Admin write exams" ON public.exams FOR ALL USING (public.is_admin());

-- Topic Questions Policies
DROP POLICY IF EXISTS "Public select active questions" ON public.topic_questions;
CREATE POLICY "Public select active questions" ON public.topic_questions FOR SELECT USING (is_deleted = false AND is_hidden = false);

DROP POLICY IF EXISTS "Admin write questions" ON public.topic_questions;
CREATE POLICY "Admin write questions" ON public.topic_questions FOR ALL USING (public.is_admin());

-- Experiences Policies
DROP POLICY IF EXISTS "Public select approved experiences" ON public.experiences;
CREATE POLICY "Public select approved experiences" ON public.experiences FOR SELECT USING (is_deleted = false AND (status = 'APPROVED' OR public.is_admin()));

DROP POLICY IF EXISTS "Student insert pending experience" ON public.experiences;
CREATE POLICY "Student insert pending experience" ON public.experiences FOR INSERT WITH CHECK (status = 'PENDING');

DROP POLICY IF EXISTS "Admin write experiences" ON public.experiences;
CREATE POLICY "Admin write experiences" ON public.experiences FOR ALL USING (public.is_admin());

-- Paper Tab Nodes Policies
DROP POLICY IF EXISTS "Public select paper nodes" ON public.paper_tab_nodes;
CREATE POLICY "Public select paper nodes" ON public.paper_tab_nodes FOR SELECT USING (is_deleted = false);

DROP POLICY IF EXISTS "Admin write paper nodes" ON public.paper_tab_nodes;
CREATE POLICY "Admin write paper nodes" ON public.paper_tab_nodes FOR ALL USING (public.is_admin());

-- Admin Audit Logs Policies
DROP POLICY IF EXISTS "Admin select/insert audit logs" ON public.admin_audit_logs;
CREATE POLICY "Admin select/insert audit logs" ON public.admin_audit_logs FOR ALL USING (public.is_admin());

-- ============================================================
-- 15. DPDP Act 2023, Rule 6 — Payment Table RLS (CRITICAL)
-- Added: August 2026 — these were missing from original schema
-- ============================================================

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User reads own transactions" ON public.transactions;
CREATE POLICY "User reads own transactions"
  ON public.transactions FOR SELECT
  USING (user_email = (SELECT email FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admin full access transactions" ON public.transactions;
CREATE POLICY "Admin full access transactions"
  ON public.transactions FOR ALL USING (public.is_admin());

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User reads own subscription" ON public.user_subscriptions;
CREATE POLICY "User reads own subscription"
  ON public.user_subscriptions FOR SELECT
  USING (user_email = (SELECT email FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admin full access subscriptions" ON public.user_subscriptions;
CREATE POLICY "Admin full access subscriptions"
  ON public.user_subscriptions FOR ALL USING (public.is_admin());

ALTER TABLE public.user_paper_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User reads own paper purchases" ON public.user_paper_purchases;
CREATE POLICY "User reads own paper purchases"
  ON public.user_paper_purchases FOR SELECT
  USING (user_email = (SELECT email FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admin full access paper purchases" ON public.user_paper_purchases;
CREATE POLICY "Admin full access paper purchases"
  ON public.user_paper_purchases FOR ALL USING (public.is_admin());

