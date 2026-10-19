-- ====================================================================
-- PrepUnite / Jobsfolder - Supabase Database Schema & Migration Script
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'STUDENT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Payment Transactions Audit Log Table (Idempotency Key via UNIQUE payment_id)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    payment_id VARCHAR(100) UNIQUE NOT NULL,
    order_id VARCHAR(100),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
    item_type VARCHAR(30) NOT NULL, -- 'SINGLE_PAPER', 'MONTHLY_PASS'
    exam_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. User Subscriptions Table (Time-Bounded Global Passes)
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    plan_name VARCHAR(100) NOT NULL,
    payment_id VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. User Paper Purchases Table (Granular 1-Year Single Paper Unlocks)
CREATE TABLE IF NOT EXISTS public.user_paper_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    exam_id VARCHAR(100) NOT NULL,
    payment_id VARCHAR(100) UNIQUE NOT NULL,
    amount_paid DECIMAL(10, 2) NOT NULL,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 year')
);

-- Ensure expires_at column exists if table was created previously
ALTER TABLE public.user_paper_purchases ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 year');

-- 6. Document Explorer Hierarchical Paper Content Table
CREATE TABLE IF NOT EXISTS public.paper_tab_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    emoji VARCHAR(10) DEFAULT '📄',
    content TEXT, -- TipTap HTML payload with Base64 images
    parent_id UUID REFERENCES public.paper_tab_nodes(id) ON DELETE CASCADE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. High-Performance Indexing
CREATE INDEX IF NOT EXISTS idx_transactions_email ON public.transactions(user_email);
CREATE INDEX IF NOT EXISTS idx_subs_lookup ON public.user_subscriptions(user_email, status, expires_at);
CREATE INDEX IF NOT EXISTS idx_purchases_lookup ON public.user_paper_purchases(user_email, exam_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_paper_nodes_exam ON public.paper_tab_nodes(exam_id);

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_paper_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_tab_nodes ENABLE ROW LEVEL SECURITY;

-- Anonymous/Authenticated Policies
DROP POLICY IF EXISTS "Allow select/insert" ON public.transactions;
DROP POLICY IF EXISTS "Select own transactions or admin" ON public.transactions;
CREATE POLICY "Select own transactions or admin" 
ON public.transactions FOR SELECT 
USING (user_email = (auth.jwt() ->> 'email') OR auth.jwt() IS NULL);

DROP POLICY IF EXISTS "Allow select/insert" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Select own subscriptions or admin" ON public.user_subscriptions;
CREATE POLICY "Select own subscriptions or admin" 
ON public.user_subscriptions FOR SELECT 
USING (user_email = (auth.jwt() ->> 'email') OR auth.jwt() IS NULL);

DROP POLICY IF EXISTS "Allow select/insert" ON public.user_paper_purchases;
DROP POLICY IF EXISTS "Select own paper purchases or admin" ON public.user_paper_purchases;
CREATE POLICY "Select own paper purchases or admin" 
ON public.user_paper_purchases FOR SELECT 
USING (user_email = (auth.jwt() ->> 'email') OR auth.jwt() IS NULL);

DROP POLICY IF EXISTS "Allow select" ON public.paper_tab_nodes;
CREATE POLICY "Allow select" ON public.paper_tab_nodes FOR SELECT USING (true);

-- 9. Supabase RPC Function: Check User Paper Access Live on Database (1-Year Rule for Single Paper)
CREATE OR REPLACE FUNCTION public.check_user_paper_access(
    p_user_email VARCHAR,
    p_exam_id VARCHAR
) RETURNS BOOLEAN AS $$
BEGIN
    -- 1. Check active monthly pass
    IF EXISTS (
        SELECT 1 FROM public.user_subscriptions
        WHERE user_email = p_user_email AND status = 'ACTIVE' AND expires_at > NOW()
    ) THEN
        RETURN TRUE;
    END IF;

    -- 2. Check single paper purchase (valid for 1 year from purchase)
    RETURN EXISTS (
        SELECT 1 FROM public.user_paper_purchases
        WHERE user_email = p_user_email 
          AND exam_id = p_exam_id 
          AND (expires_at IS NULL OR expires_at > NOW())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

