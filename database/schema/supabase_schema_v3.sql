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
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS college_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_tpo_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS roll_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS batch_year INTEGER;

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
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS upvotes INT DEFAULT 0;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS drive_type VARCHAR(50) DEFAULT 'ON_CAMPUS';

CREATE OR REPLACE FUNCTION public.increment_experience_upvotes(p_experience_id UUID)
RETURNS INT AS $$
DECLARE
  v_new_count INT;
BEGIN
  UPDATE public.experiences
  SET upvotes = COALESCE(upvotes, 0) + 1
  WHERE id = p_experience_id
  RETURNING upvotes INTO v_new_count;
  RETURN COALESCE(v_new_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.user_subscriptions ALTER COLUMN payment_id TYPE VARCHAR(255);

DROP POLICY IF EXISTS "User reads own subscription" ON public.user_subscriptions;
CREATE POLICY "User reads own subscription"
  ON public.user_subscriptions FOR SELECT
  USING (user_email = (SELECT email FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admin full access subscriptions" ON public.user_subscriptions;
CREATE POLICY "Admin full access subscriptions"
  ON public.user_subscriptions FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "TPO coordinator manage college student subscriptions" ON public.user_subscriptions;
CREATE POLICY "TPO coordinator manage college student subscriptions"
  ON public.user_subscriptions FOR ALL
  USING (
    payment_id LIKE 'B2B_CAMPUS_%' AND (
      public.is_admin() OR
      EXISTS (
        SELECT 1 FROM public.tpo_authorizations ta
        WHERE lower(ta.email) = lower(auth.jwt()->>'email')
          AND ta.status = 'ACTIVE'
          AND public.user_subscriptions.payment_id LIKE 'B2B_CAMPUS_' || ta.college_id::TEXT || '%'
      )
    )
  );

ALTER TABLE public.user_paper_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User reads own paper purchases" ON public.user_paper_purchases;
CREATE POLICY "User reads own paper purchases"
  ON public.user_paper_purchases FOR SELECT
  USING (user_email = (SELECT email FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admin full access paper purchases" ON public.user_paper_purchases;
CREATE POLICY "Admin full access paper purchases"
  ON public.user_paper_purchases FOR ALL USING (public.is_admin());

-- ============================================================
-- 16. Aptitude Topics Master Directory Table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.aptitude_topics (
    id VARCHAR(100) PRIMARY KEY,
    category_slug VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    cluster VARCHAR(150) NOT NULL,
    description TEXT,
    icon_name VARCHAR(100) DEFAULT 'Folder' NOT NULL,
    formulas TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    is_hidden BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_aptitude_topics_category ON public.aptitude_topics(category_slug);
CREATE INDEX IF NOT EXISTS idx_aptitude_topics_cluster ON public.aptitude_topics(cluster);
CREATE INDEX IF NOT EXISTS idx_aptitude_topics_is_hidden ON public.aptitude_topics(is_hidden);

ALTER TABLE public.aptitude_topics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view non-hidden aptitude topics" ON public.aptitude_topics;
CREATE POLICY "Public can view non-hidden aptitude topics"
  ON public.aptitude_topics FOR SELECT
  USING (is_hidden = false OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage aptitude topics" ON public.aptitude_topics;
CREATE POLICY "Admins can manage aptitude topics"
  ON public.aptitude_topics FOR ALL
  USING (public.is_admin());

-- ============================================================
-- 17. Question Reports & Contact Messages Tables
-- ============================================================
CREATE TABLE IF NOT EXISTS public.question_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id VARCHAR(255) NOT NULL,
    question_statement TEXT NOT NULL,
    company_slug VARCHAR(255),
    topic_id VARCHAR(150),
    issue_type VARCHAR(100) NOT NULL DEFAULT 'OTHER',
    details TEXT,
    reporter_email VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_question_reports_status ON public.question_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_question_reports_qid ON public.question_reports(question_id);

ALTER TABLE public.question_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert question reports" ON public.question_reports;
CREATE POLICY "Public insert question reports"
  ON public.question_reports FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access question reports" ON public.question_reports;
CREATE POLICY "Admin full access question reports"
  ON public.question_reports FOR ALL USING (public.is_admin());

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL DEFAULT 'General Inquiry',
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert contact messages" ON public.contact_messages;
CREATE POLICY "Public insert contact messages"
  ON public.contact_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access contact messages" ON public.contact_messages;
CREATE POLICY "Admin full access contact messages"
  ON public.contact_messages FOR ALL USING (public.is_admin());

-- ============================================================
-- 18. Topic Cheat Codes Table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.topic_cheat_codes (
    topic_id VARCHAR(150) PRIMARY KEY,
    content TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cheat_codes_topic ON public.topic_cheat_codes(topic_id);

ALTER TABLE public.topic_cheat_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public select cheat codes" ON public.topic_cheat_codes;
CREATE POLICY "Public select cheat codes"
  ON public.topic_cheat_codes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify cheat codes" ON public.topic_cheat_codes;
CREATE POLICY "Admin modify cheat codes"
  ON public.topic_cheat_codes FOR ALL USING (public.is_admin());

-- ============================================================
-- 19. Access Entitlement & Server-Side Redaction RPC Functions
-- ============================================================

-- Helper: Verify user access to exam or subscription
CREATE OR REPLACE FUNCTION public.check_user_paper_access(
    p_user_email VARCHAR,
    p_exam_id VARCHAR
) RETURNS BOOLEAN AS $$
DECLARE
    v_has_pass BOOLEAN := FALSE;
    v_has_paper BOOLEAN := FALSE;
    v_clean_email VARCHAR;
BEGIN
    IF p_user_email IS NULL OR p_user_email = '' THEN
        RETURN FALSE;
    END IF;

    v_clean_email := LOWER(TRIM(p_user_email));

    -- Check active subscription (Monthly / Quarterly / Yearly)
    SELECT EXISTS (
        SELECT 1 FROM public.user_subscriptions
        WHERE LOWER(user_email) = v_clean_email
          AND status = 'ACTIVE'
          AND expires_at > NOW()
    ) INTO v_has_pass;

    IF v_has_pass THEN
        RETURN TRUE;
    END IF;

    -- Check single paper purchase
    SELECT EXISTS (
        SELECT 1 FROM public.user_paper_purchases
        WHERE LOWER(user_email) = v_clean_email
          AND exam_id = p_exam_id
          AND expires_at > NOW()
    ) INTO v_has_paper;

    RETURN v_has_paper;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper: Recursively redact unpaid paper nodes on database server
CREATE OR REPLACE FUNCTION public.redact_paper_nodes(
  p_nodes JSONB,
  p_has_access BOOLEAN,
  p_is_public BOOLEAN
) RETURNS JSONB AS $$
DECLARE
  v_result JSONB := '[]'::jsonb;
  v_node JSONB;
  v_children JSONB;
  v_is_free BOOLEAN;
BEGIN
  IF p_nodes IS NULL OR jsonb_array_length(p_nodes) = 0 THEN
    RETURN '[]'::jsonb;
  END IF;

  IF p_has_access OR p_is_public THEN
    RETURN p_nodes;
  END IF;

  FOR v_node IN SELECT * FROM jsonb_array_elements(p_nodes) LOOP
    v_is_free := COALESCE((v_node->>'isFree')::boolean, (v_node->>'is_free')::boolean, false);
    
    IF v_node ? 'children' AND jsonb_array_length(v_node->'children') > 0 THEN
      v_children := public.redact_paper_nodes(v_node->'children', p_has_access, p_is_public);
      v_node := jsonb_set(v_node, '{children}', v_children);
    END IF;

    -- If NOT free and user lacks access, strip content to null on database server
    IF NOT v_is_free THEN
      v_node := jsonb_set(v_node, '{content}', 'null'::jsonb);
    END IF;

    v_result := v_result || jsonb_build_array(v_node);
  END LOOP;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Main RPC: Fetch company exams with database-level payload redaction
CREATE OR REPLACE FUNCTION public.get_secure_exams_by_company(
  p_company_slug TEXT,
  p_user_email TEXT DEFAULT NULL
) RETURNS TABLE (
  id UUID,
  company_id UUID,
  company_slug VARCHAR,
  name VARCHAR,
  badge VARCHAR,
  content TEXT,
  old_papers TEXT,
  price NUMERIC,
  paper_tabs JSONB,
  google_doc_embed_url TEXT,
  google_doc_edit_url TEXT,
  upvotes INT,
  is_public_exam BOOLEAN,
  has_user_access BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
DECLARE
  v_is_admin BOOLEAN := FALSE;
  v_effective_email TEXT := NULL;
  v_jwt_email TEXT;
BEGIN
  -- 1. Check if caller is authenticated admin
  v_is_admin := public.is_admin();

  -- 2. Verify identity: authenticated JWT email takes precedence over parameter
  v_jwt_email := auth.jwt() ->> 'email';
  IF v_jwt_email IS NOT NULL AND v_jwt_email != '' THEN
    v_effective_email := LOWER(TRIM(v_jwt_email));
  ELSIF v_is_admin AND p_user_email IS NOT NULL THEN
    v_effective_email := LOWER(TRIM(p_user_email));
  END IF;

  RETURN QUERY
  SELECT 
    e.id,
    e.company_id,
    e.company_slug,
    e.name,
    e.badge,
    e.content,
    e.old_papers,
    e.price,
    public.redact_paper_nodes(
      e.paper_tabs, 
      v_is_admin OR (v_effective_email IS NOT NULL AND public.check_user_paper_access(v_effective_email, e.id::text)),
      COALESCE(e.is_public_exam, false)
    ) AS paper_tabs,
    e.google_doc_embed_url,
    e.google_doc_edit_url,
    e.upvotes,
    COALESCE(e.is_public_exam, false) AS is_public_exam,
    (v_is_admin OR COALESCE(e.is_public_exam, false) OR (v_effective_email IS NOT NULL AND public.check_user_paper_access(v_effective_email, e.id::text))) AS has_user_access,
    e.created_at,
    e.updated_at
  FROM public.exams e
  WHERE e.company_slug = p_company_slug
    AND e.is_deleted = false
  ORDER BY e.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 23. Dedicated User Bookmarks Table (Prevents JWT Bloat & HTTP 431)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email VARCHAR(255) NOT NULL,
  item_type VARCHAR(50) NOT NULL, -- 'QUESTION', 'EXAM', 'EXPERIENCE'
  item_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT uq_user_item_bookmark UNIQUE (user_email, item_type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_user_bookmarks_lookup ON public.user_bookmarks(user_email, item_type);

ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own bookmarks" ON public.user_bookmarks;
CREATE POLICY "Users read own bookmarks" ON public.user_bookmarks FOR SELECT
  USING (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users insert own bookmarks" ON public.user_bookmarks;
CREATE POLICY "Users insert own bookmarks" ON public.user_bookmarks FOR INSERT
  WITH CHECK (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users delete own bookmarks" ON public.user_bookmarks;
CREATE POLICY "Users delete own bookmarks" ON public.user_bookmarks FOR DELETE
  USING (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_id = auth.uid()
  );

-- ============================================================
-- 24. Atomic Campus Student Subscription Provisioning RPC
-- ============================================================
CREATE OR REPLACE FUNCTION public.provision_campus_student_subscription(
  p_email TEXT,
  p_college_id TEXT,
  p_college_name TEXT,
  p_valid_until TIMESTAMPTZ
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_clean_email TEXT;
  v_plan_name TEXT;
  v_payment_id TEXT;
BEGIN
  v_clean_email := lower(trim(p_email));
  v_plan_name := 'Campus Pro Pass (' || coalesce(p_college_name, 'Partner College') || ')';
  v_payment_id := 'B2B_CAMPUS_' || p_college_id || '_' || md5(v_clean_email);

  INSERT INTO public.user_subscriptions (
    user_email,
    plan_name,
    payment_id,
    status,
    expires_at,
    updated_at
  ) VALUES (
    v_clean_email,
    v_plan_name,
    v_payment_id,
    'ACTIVE',
    p_valid_until,
    NOW()
  )
  ON CONFLICT (payment_id)
  DO UPDATE SET
    user_email = EXCLUDED.user_email,
    plan_name = EXCLUDED.plan_name,
    status = 'ACTIVE',
    expires_at = EXCLUDED.expires_at,
    updated_at = NOW();

  RETURN jsonb_build_object('success', true, 'email', v_clean_email);
END;
$$;

-- Allow students and TPOs to read multi-device mock exam sync payloads
DROP POLICY IF EXISTS "Public select B2B exam messages" ON public.contact_messages;
CREATE POLICY "Public select B2B exam messages"
  ON public.contact_messages FOR SELECT
  USING (subject LIKE 'B2B_EXAM:%');


