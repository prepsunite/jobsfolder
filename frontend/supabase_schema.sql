-- ============================================================================
-- PREPUNITE: PRODUCTION SUPABASE SQL MIGRATION SCRIPT
-- Copy & Paste this entire script into your Supabase Dashboard -> SQL Editor
-- ============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'STUDENT', -- 'STUDENT', 'ADMIN'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Payment Transactions Log Table (Idempotent Audit Log)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    payment_id VARCHAR(100) UNIQUE NOT NULL, -- Razorpay/Stripe Payment ID (Idempotency Key)
    order_id VARCHAR(100),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS', -- 'SUCCESS', 'FAILED', 'PENDING'
    item_type VARCHAR(30) NOT NULL, -- 'SINGLE_PAPER', 'MONTHLY_PASS'
    exam_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. User Subscriptions Table (Time-Bounded Passes)
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    plan_name VARCHAR(100) NOT NULL, -- 'Jobsfolder Pro Monthly Pass'
    payment_id VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'EXPIRED', 'CANCELLED'
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. User Paper Purchases Table (Granular Lifetime Paper Unlocks)
CREATE TABLE IF NOT EXISTS public.user_paper_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    exam_id VARCHAR(100) NOT NULL, -- e.g. 'tcs-nqt-2024'
    payment_id VARCHAR(100) UNIQUE NOT NULL,
    amount_paid DECIMAL(10, 2) NOT NULL,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Paper Tab Nodes Table (Hierarchical DocumentExplorer Content)
CREATE TABLE IF NOT EXISTS public.paper_tab_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    emoji VARCHAR(10) DEFAULT '📄',
    content TEXT, -- Rich HTML from TipTap (includes Base64 images)
    parent_id UUID REFERENCES public.paper_tab_nodes(id) ON DELETE CASCADE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. High-Performance Indexes
CREATE INDEX IF NOT EXISTS idx_transactions_email ON public.transactions(user_email);
CREATE INDEX IF NOT EXISTS idx_transactions_payment ON public.transactions(payment_id);
CREATE INDEX IF NOT EXISTS idx_subs_lookup ON public.user_subscriptions(user_email, status, expires_at);
CREATE INDEX IF NOT EXISTS idx_purchases_lookup ON public.user_paper_purchases(user_email, exam_id);
CREATE INDEX IF NOT EXISTS idx_nodes_exam ON public.paper_tab_nodes(exam_id, sort_order);

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_paper_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_tab_nodes ENABLE ROW LEVEL SECURITY;

-- 9. Row Level Security (RLS) Policies (Permissive for Client App API Key)
CREATE POLICY "Allow public read access to paper_tab_nodes" 
ON public.paper_tab_nodes FOR SELECT USING (true);

CREATE POLICY "Allow insert/select transactions" 
ON public.transactions FOR ALL USING (true);

CREATE POLICY "Allow insert/select user_subscriptions" 
ON public.user_subscriptions FOR ALL USING (true);

CREATE POLICY "Allow insert/select user_paper_purchases" 
ON public.user_paper_purchases FOR ALL USING (true);

-- 10. Database RPC Function: Verify Entitlement Live on Server
CREATE OR REPLACE FUNCTION public.check_user_paper_access(
    p_user_email VARCHAR,
    p_exam_id VARCHAR
) RETURNS BOOLEAN AS $$
DECLARE
    v_has_pass BOOLEAN := FALSE;
    v_has_paper BOOLEAN := FALSE;
BEGIN
    -- Check active monthly pass
    SELECT EXISTS (
        SELECT 1 FROM public.user_subscriptions
        WHERE user_email = p_user_email
          AND status = 'ACTIVE'
          AND expires_at > NOW()
    ) INTO v_has_pass;

    IF v_has_pass THEN
        RETURN TRUE;
    END IF;

    -- Check single paper purchase
    SELECT EXISTS (
        SELECT 1 FROM public.user_paper_purchases
        WHERE user_email = p_user_email
          AND exam_id = p_exam_id
    ) INTO v_has_paper;

    RETURN v_has_paper;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 11. STANDARDIZED USER PROFILES TABLE & AUTOMATIC ROLE ASSIGNMENT TRIGGER
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow public & client reads/writes
CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow insert/update profiles" ON public.profiles FOR ALL USING (true);

-- Automatic trigger to insert profile into public.profiles on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    CASE
      WHEN LOWER(NEW.email) IN ('venkatmukala9@gmail.com', 'venkat.mukala9@gmail.com', 'prepsunite@gmail.com', 'veen1kat@gmail.com') THEN 'admin'
      ELSE 'user'
    END,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    name = EXCLUDED.name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach Trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- Retroactive Update query to promote designated admin emails
UPDATE public.profiles
SET role = 'admin'
WHERE LOWER(email) IN ('venkatmukala9@gmail.com', 'venkat.mukala9@gmail.com', 'prepsunite@gmail.com', 'veen1kat@gmail.com');

-- ============================================================================
-- 12. DYNAMIC CONTENT TABLES FOR LIVE ADMIN SYNCHRONIZATION
-- ============================================================================

-- 12.1 Companies Table
CREATE TABLE IF NOT EXISTS public.companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  industry TEXT,
  headquarters TEXT,
  website_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12.2 Exams / Drive Papers Table
CREATE TABLE IF NOT EXISTS public.exams (
  id TEXT PRIMARY KEY,
  company_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  badge TEXT,
  content TEXT,
  old_papers TEXT,
  price DECIMAL(10, 2) DEFAULT 99,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12.3 Topic Practice Questions Table
CREATE TABLE IF NOT EXISTS public.topic_questions (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL,
  statement TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  structured_explanation JSONB,
  difficulty TEXT DEFAULT 'MEDIUM',
  difficulty_level INT DEFAULT 2,
  is_hidden BOOLEAN DEFAULT FALSE,
  question_number INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12.4 Student Interview Experiences Table
CREATE TABLE IF NOT EXISTS public.experiences (
  id TEXT PRIMARY KEY,
  company_slug TEXT NOT NULL,
  student_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  package TEXT,
  result TEXT NOT NULL,
  rounds JSONB,
  overall_experience TEXT,
  tips TEXT,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Public read companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Admin/Client manage companies" ON public.companies FOR ALL USING (true);

CREATE POLICY "Public read exams" ON public.exams FOR SELECT USING (true);
CREATE POLICY "Admin/Client manage exams" ON public.exams FOR ALL USING (true);

CREATE POLICY "Public read topic_questions" ON public.topic_questions FOR SELECT USING (true);
CREATE POLICY "Admin/Client manage topic_questions" ON public.topic_questions FOR ALL USING (true);

CREATE POLICY "Public read experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Admin/Client manage experiences" ON public.experiences FOR ALL USING (true);


