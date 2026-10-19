-- ============================================================
-- DPDP Act 2023, Rule 6 — Security Safeguards
-- RLS Migration for Payment Tables
-- PrepUnite / Jobsfolder
-- Run Date: August 2026
-- ============================================================
-- This migration applies Row Level Security to the 3 payment/
-- financial tables that were missing from schema_v3.sql.
-- 
-- IMPORTANT: The API routes (webhook.js, verify-payment.js)
-- use SUPABASE_SERVICE_ROLE_KEY which bypasses RLS — they are
-- unaffected. Only browser-client (anon/user key) access is
-- locked down by these policies.
-- ============================================================

-- ── transactions ────────────────────────────────────────────
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Users can only read their own transactions
DROP POLICY IF EXISTS "User reads own transactions" ON public.transactions;
CREATE POLICY "User reads own transactions"
  ON public.transactions
  FOR SELECT
  USING (
    user_email = (
      SELECT email FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Admin can read/write all transactions
DROP POLICY IF EXISTS "Admin full access transactions" ON public.transactions;
CREATE POLICY "Admin full access transactions"
  ON public.transactions
  FOR ALL
  USING (public.is_admin());

-- ── user_subscriptions ──────────────────────────────────────
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only read their own subscription
DROP POLICY IF EXISTS "User reads own subscription" ON public.user_subscriptions;
CREATE POLICY "User reads own subscription"
  ON public.user_subscriptions
  FOR SELECT
  USING (
    user_email = (
      SELECT email FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Admin can read/write all subscriptions
DROP POLICY IF EXISTS "Admin full access subscriptions" ON public.user_subscriptions;
CREATE POLICY "Admin full access subscriptions"
  ON public.user_subscriptions
  FOR ALL
  USING (public.is_admin());

-- ── user_paper_purchases ─────────────────────────────────────
ALTER TABLE public.user_paper_purchases ENABLE ROW LEVEL SECURITY;

-- Users can only read their own paper purchases
DROP POLICY IF EXISTS "User reads own paper purchases" ON public.user_paper_purchases;
CREATE POLICY "User reads own paper purchases"
  ON public.user_paper_purchases
  FOR SELECT
  USING (
    user_email = (
      SELECT email FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Admin can read/write all paper purchases
DROP POLICY IF EXISTS "Admin full access paper purchases" ON public.user_paper_purchases;
CREATE POLICY "Admin full access paper purchases"
  ON public.user_paper_purchases
  FOR ALL
  USING (public.is_admin());

-- ── Verification Query ───────────────────────────────────────
-- Run this after applying the migration to confirm RLS is on:
SELECT
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'transactions',
    'user_subscriptions',
    'user_paper_purchases'
  )
ORDER BY tablename;

-- Expected result:
-- tablename              | rls_enabled
-- -----------------------|------------
-- transactions           | true
-- user_paper_purchases   | true
-- user_subscriptions     | true
