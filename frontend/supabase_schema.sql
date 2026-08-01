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
