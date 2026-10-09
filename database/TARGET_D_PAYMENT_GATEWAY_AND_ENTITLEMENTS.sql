-- ====================================================================
-- PrepUnite Target D Hardening: Payment Gateway, Webhook Invariants,
-- Order Ledger & Subscription Entitlement Control Plane
-- Run this in your Supabase SQL Editor
-- ====================================================================

-- ── 1. Server-Side Pre-Order Ledger (payment_orders) ──────────────────
CREATE TABLE IF NOT EXISTS public.payment_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(255) UNIQUE NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  item_type VARCHAR(64) NOT NULL,
  amount_paise INTEGER NOT NULL,
  amount_inr NUMERIC(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR' NOT NULL,
  exam_id VARCHAR(255),
  status VARCHAR(32) DEFAULT 'CREATED' NOT NULL, -- 'CREATED', 'PAID', 'REFUNDED', 'DISPUTED', 'EXPIRED', 'FAILED'
  payment_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payment_orders_user_email ON public.payment_orders(user_email);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON public.payment_orders(status);
CREATE INDEX IF NOT EXISTS idx_payment_orders_order_id ON public.payment_orders(order_id);

ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own payment orders" ON public.payment_orders;
CREATE POLICY "Users can read own payment orders"
  ON public.payment_orders
  FOR SELECT
  USING (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_email = auth.jwt()->>'email'
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Admins have full access to payment orders" ON public.payment_orders;
CREATE POLICY "Admins have full access to payment orders"
  ON public.payment_orders
  FOR ALL
  USING (public.is_admin());


-- ── 2. Idempotent Webhook Events Store (webhook_events) ──────────────
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id VARCHAR(255) UNIQUE NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB,
  processed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON public.webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON public.webhook_events(event_type);

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins have full access to webhook events" ON public.webhook_events;
CREATE POLICY "Admins have full access to webhook events"
  ON public.webhook_events
  FOR ALL
  USING (public.is_admin());


-- ── 3. Server-Side Mock Exam Generation Quotas (user_mock_exam_quotas) 
CREATE TABLE IF NOT EXISTS public.user_mock_exam_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL,
  month_key VARCHAR(10) NOT NULL, -- Format: 'YYYY-MM'
  used_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT uq_user_mock_exam_quota UNIQUE (user_email, month_key)
);

CREATE INDEX IF NOT EXISTS idx_user_mock_exam_quotas_lookup ON public.user_mock_exam_quotas(user_email, month_key);

ALTER TABLE public.user_mock_exam_quotas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own mock exam quotas" ON public.user_mock_exam_quotas;
CREATE POLICY "Users can read own mock exam quotas"
  ON public.user_mock_exam_quotas
  FOR SELECT
  USING (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_email = auth.jwt()->>'email'
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Admins have full access to mock exam quotas" ON public.user_mock_exam_quotas;
CREATE POLICY "Admins have full access to mock exam quotas"
  ON public.user_mock_exam_quotas
  FOR ALL
  USING (public.is_admin());


-- ── 4. RPC: fulfill_payment_order ─────────────────────────────────────
-- Authoritative payment fulfillment RPC executed with SECURITY DEFINER privileges.
-- Resolves purchased entitlements strictly from the server-locked payment_orders ledger,
-- eliminates cross-plan substitution attacks [P0-01], and atomically extends renewals [P1-02].
CREATE OR REPLACE FUNCTION public.fulfill_payment_order(
  p_order_id TEXT,
  p_payment_id TEXT,
  p_user_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order RECORD;
  v_normalized_email TEXT;
  v_days INTEGER := 30;
  v_plan_name TEXT := 'PrepUnite Pro (5 Mock Exams/mo)';
  v_existing_expiry TIMESTAMPTZ;
  v_new_expiry TIMESTAMPTZ;
BEGIN
  v_normalized_email := LOWER(TRIM(p_user_email));

  IF p_order_id IS NULL OR p_payment_id IS NULL OR v_normalized_email IS NULL THEN
    RAISE EXCEPTION 'Order ID, Payment ID, and User Email are required for fulfillment.';
  END IF;

  -- 1. Find and lock the pre-order record from ledger
  SELECT * INTO v_order
  FROM public.payment_orders
  WHERE order_id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order record % not found in server pre-order ledger.', p_order_id;
  END IF;

  -- Validate order ownership
  IF LOWER(TRIM(v_order.user_email)) != v_normalized_email THEN
    RAISE EXCEPTION 'Order ownership mismatch: Order % does not belong to %.', p_order_id, v_normalized_email;
  END IF;

  -- Idempotency check: if order is already PAID with the same payment_id, return success
  IF v_order.status = 'PAID' AND v_order.payment_id = p_payment_id THEN
    RETURN jsonb_build_object(
      'success', true,
      'already_fulfilled', true,
      'item_type', v_order.item_type,
      'order_id', p_order_id,
      'payment_id', p_payment_id
    );
  END IF;

  -- Mark ledger row as PAID
  UPDATE public.payment_orders
  SET status = 'PAID',
      payment_id = p_payment_id,
      updated_at = NOW()
  WHERE id = v_order.id;

  -- Upsert immutable transaction record
  INSERT INTO public.transactions (
    user_email,
    payment_id,
    order_id,
    amount,
    currency,
    status,
    item_type,
    exam_id,
    created_at
  ) VALUES (
    v_normalized_email,
    p_payment_id,
    p_order_id,
    v_order.amount_inr,
    COALESCE(v_order.currency, 'INR'),
    'SUCCESS',
    v_order.item_type,
    v_order.exam_id,
    NOW()
  )
  ON CONFLICT (payment_id) DO UPDATE SET
    status = 'SUCCESS',
    order_id = EXCLUDED.order_id,
    amount = EXCLUDED.amount,
    item_type = EXCLUDED.item_type;

  -- 2. Entitlement fulfillment based STRICTLY on ledger's v_order.item_type
  IF v_order.item_type IN ('SINGLE_PAPER', 'SINGLE') THEN
    IF v_order.exam_id IS NULL THEN
      RAISE EXCEPTION 'Exam ID is required for single company paper purchases.';
    END IF;

    -- Atomic extension [P1-02] for single paper: extend from existing expiry or now
    SELECT expires_at INTO v_existing_expiry
    FROM public.user_paper_purchases
    WHERE user_email = v_normalized_email AND exam_id = v_order.exam_id
    ORDER BY expires_at DESC
    LIMIT 1;

    IF v_existing_expiry IS NOT NULL AND v_existing_expiry > NOW() THEN
      v_new_expiry := v_existing_expiry + INTERVAL '30 days';
    ELSE
      v_new_expiry := NOW() + INTERVAL '30 days';
    END IF;

    INSERT INTO public.user_paper_purchases (
      user_email,
      exam_id,
      payment_id,
      amount_paid,
      expires_at,
      created_at
    ) VALUES (
      v_normalized_email,
      v_order.exam_id,
      p_payment_id,
      v_order.amount_inr,
      v_new_expiry,
      NOW()
    )
    ON CONFLICT (payment_id) DO UPDATE SET
      expires_at = EXCLUDED.expires_at,
      amount_paid = EXCLUDED.amount_paid;

  ELSE
    -- Subscription plans duration resolution
    IF v_order.item_type LIKE 'ULTRA%' THEN
      IF v_order.item_type LIKE '%6M%' THEN
        v_days := 180;
        v_plan_name := 'PrepUnite Ultra 6-Month Pass (Unlimited)';
      ELSIF v_order.item_type LIKE '%1Y%' OR v_order.item_type LIKE '%YEARLY%' THEN
        v_days := 365;
        v_plan_name := 'PrepUnite Ultra 1-Year Pass (Unlimited)';
      ELSE
        v_days := 30;
        v_plan_name := 'PrepUnite Ultra (Unlimited)';
      END IF;
    ELSIF v_order.item_type LIKE 'PRO%' THEN
      IF v_order.item_type LIKE '%6M%' THEN
        v_days := 180;
        v_plan_name := 'PrepUnite Pro 6-Month Pass (5 Mock Exams/mo)';
      ELSIF v_order.item_type LIKE '%1Y%' OR v_order.item_type LIKE '%YEARLY%' THEN
        v_days := 365;
        v_plan_name := 'PrepUnite Pro 1-Year Pass (5 Mock Exams/mo)';
      ELSE
        v_days := 30;
        v_plan_name := 'PrepUnite Pro (5 Mock Exams/mo)';
      END IF;
    ELSIF v_order.item_type IN ('PLUS', 'PLUS_MONTHLY', 'MONTHLY', 'MONTHLY_PASS') THEN
      v_days := 30;
      v_plan_name := 'PrepUnite Pro (5 Mock Exams/mo)';
    ELSIF v_order.item_type = 'QUARTERLY' THEN
      v_days := 90;
      v_plan_name := 'PrepUnite Pro Quarterly Pass';
    ELSIF v_order.item_type = 'YEARLY' THEN
      v_days := 365;
      v_plan_name := 'PrepUnite Ultra 1-Year Pass (Unlimited)';
    ELSE
      v_days := 30;
      v_plan_name := 'PrepUnite Pro (5 Mock Exams/mo)';
    END IF;

    -- Atomic extension [P1-02]: If user has active subscription, add days to existing expiry
    SELECT expires_at INTO v_existing_expiry
    FROM public.user_subscriptions
    WHERE user_email = v_normalized_email
      AND status = 'ACTIVE'
      AND expires_at > NOW()
    ORDER BY expires_at DESC
    LIMIT 1;

    IF v_existing_expiry IS NOT NULL AND v_existing_expiry > NOW() THEN
      v_new_expiry := v_existing_expiry + (v_days || ' days')::INTERVAL;
    ELSE
      v_new_expiry := NOW() + (v_days || ' days')::INTERVAL;
    END IF;

    INSERT INTO public.user_subscriptions (
      user_email,
      plan_name,
      payment_id,
      status,
      expires_at,
      created_at,
      updated_at
    ) VALUES (
      v_normalized_email,
      v_plan_name,
      p_payment_id,
      'ACTIVE',
      v_new_expiry,
      NOW(),
      NOW()
    )
    ON CONFLICT (payment_id) DO UPDATE SET
      plan_name = EXCLUDED.plan_name,
      status = 'ACTIVE',
      expires_at = EXCLUDED.expires_at,
      updated_at = NOW();
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'item_type', v_order.item_type,
    'plan_name', v_plan_name,
    'order_id', p_order_id,
    'payment_id', p_payment_id,
    'expires_at', v_new_expiry
  );
END;
$$;


-- ── 5. RPC: revoke_payment_entitlement ────────────────────────────────
-- Handles refunds and chargebacks / disputes [P1-03] by immediately expiring access.
CREATE OR REPLACE FUNCTION public.revoke_payment_entitlement(
  p_payment_id TEXT,
  p_reason TEXT DEFAULT 'REFUND_OR_DISPUTE'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_updated_subs INTEGER := 0;
  v_updated_papers INTEGER := 0;
  v_status_label TEXT;
BEGIN
  IF p_payment_id IS NULL THEN
    RAISE EXCEPTION 'Payment ID is required for entitlement revocation.';
  END IF;

  v_status_label := CASE 
    WHEN p_reason ILIKE '%DISPUTE%' THEN 'DISPUTED'
    ELSE 'REFUNDED'
  END;

  -- 1. Update payment orders ledger
  UPDATE public.payment_orders
  SET status = v_status_label,
      updated_at = NOW()
  WHERE payment_id = p_payment_id;

  -- 2. Update transaction status
  UPDATE public.transactions
  SET status = v_status_label
  WHERE payment_id = p_payment_id;

  -- 3. Revoke subscriptions linked to this payment_id
  UPDATE public.user_subscriptions
  SET status = 'REVOKED',
      expires_at = NOW(),
      updated_at = NOW()
  WHERE payment_id = p_payment_id
    AND status = 'ACTIVE';
  GET DIAGNOSTICS v_updated_subs = ROW_COUNT;

  -- 4. Revoke single paper access linked to this payment_id
  UPDATE public.user_paper_purchases
  SET expires_at = NOW()
  WHERE payment_id = p_payment_id
    AND expires_at > NOW();
  GET DIAGNOSTICS v_updated_papers = ROW_COUNT;

  RETURN jsonb_build_object(
    'success', true,
    'payment_id', p_payment_id,
    'revocation_reason', p_reason,
    'status', v_status_label,
    'subscriptions_revoked', v_updated_subs,
    'paper_access_revoked', v_updated_papers
  );
END;
$$;


-- ── 6. RPC: consume_mock_exam_quota ───────────────────────────────────
-- Atomic server-side quota verification and consumption [P0-03].
-- Replaces client-side localStorage bypass with row-locked database enforcement.
CREATE OR REPLACE FUNCTION public.consume_mock_exam_quota(
  p_user_email TEXT,
  p_exam_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_normalized_email TEXT;
  v_month_key TEXT;
  v_sub RECORD;
  v_is_campus_student BOOLEAN := false;
  v_is_ultra BOOLEAN := false;
  v_is_pro BOOLEAN := false;
  v_quota_limit INTEGER := 0;
  v_current_used INTEGER := 0;
  v_new_used INTEGER := 0;
BEGIN
  v_normalized_email := LOWER(TRIM(p_user_email));
  v_month_key := to_char(NOW(), 'YYYY-MM');

  IF v_normalized_email IS NULL OR v_normalized_email = '' OR v_normalized_email = 'guest@prepunite.com' THEN
    RAISE EXCEPTION 'Free tier does not include blueprint mock exams. Please sign in and upgrade to Pro or Ultra.';
  END IF;

  -- 1. Check institutional campus pass (colleges + college_students)
  SELECT EXISTS (
    SELECT 1 FROM public.college_students cs
    JOIN public.colleges c ON cs.college_id = c.id
    WHERE LOWER(TRIM(cs.email)) = v_normalized_email
      AND cs.status = 'ACTIVE'
      AND c.status = 'ACTIVE'
      AND (c.valid_until IS NULL OR c.valid_until > NOW())
  ) INTO v_is_campus_student;

  IF NOT v_is_campus_student THEN
    -- Check user_subscriptions for active campus pass
    SELECT EXISTS (
      SELECT 1 FROM public.user_subscriptions
      WHERE LOWER(TRIM(user_email)) = v_normalized_email
        AND payment_id LIKE 'B2B_CAMPUS_%'
        AND status = 'ACTIVE'
        AND expires_at > NOW()
    ) INTO v_is_campus_student;
  END IF;

  IF v_is_campus_student THEN
    -- Campus students have unlimited mock exam quota
    RETURN jsonb_build_object(
      'success', true,
      'plan', 'COLLEGE',
      'limit', 999,
      'used', 0,
      'remaining', 999,
      'message', 'Institutional Campus Pass: Unlimited mock exams enabled.'
    );
  END IF;

  -- 2. Check active personal subscription
  SELECT * INTO v_sub
  FROM public.user_subscriptions
  WHERE LOWER(TRIM(user_email)) = v_normalized_email
    AND status = 'ACTIVE'
    AND expires_at > NOW()
  ORDER BY expires_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Free tier does not include blueprint mock exams. Please upgrade to Pro (5 exams/mo) or Ultra (unlimited).';
  END IF;

  IF v_sub.plan_name ILIKE '%ULTRA%' THEN
    v_is_ultra := true;
  ELSIF v_sub.plan_name ILIKE '%PRO%' OR v_sub.plan_name ILIKE '%PLUS%' OR v_sub.plan_name ILIKE '%QUARTERLY%' THEN
    v_is_pro := true;
    v_quota_limit := 5;
  ELSE
    v_is_pro := true;
    v_quota_limit := 5;
  END IF;

  IF v_is_ultra THEN
    RETURN jsonb_build_object(
      'success', true,
      'plan', 'ULTRA',
      'limit', 999,
      'used', 0,
      'remaining', 999,
      'message', 'Ultra Pass: Unlimited mock exams enabled.'
    );
  END IF;

  -- 3. Atomic quota verification and increment for Pro tier (limit = 5)
  INSERT INTO public.user_mock_exam_quotas (user_email, month_key, used_count, created_at, updated_at)
  VALUES (v_normalized_email, v_month_key, 0, NOW(), NOW())
  ON CONFLICT (user_email, month_key) DO NOTHING;

  SELECT used_count INTO v_current_used
  FROM public.user_mock_exam_quotas
  WHERE user_email = v_normalized_email AND month_key = v_month_key
  FOR UPDATE;

  IF v_current_used >= v_quota_limit THEN
    RAISE EXCEPTION 'Monthly mock exam generation quota exceeded (%/%). Upgrade to Ultra for unlimited exams.', v_current_used, v_quota_limit;
  END IF;

  v_new_used := v_current_used + 1;

  UPDATE public.user_mock_exam_quotas
  SET used_count = v_new_used,
      updated_at = NOW()
  WHERE user_email = v_normalized_email AND month_key = v_month_key;

  RETURN jsonb_build_object(
    'success', true,
    'plan', 'PRO',
    'limit', v_quota_limit,
    'used', v_new_used,
    'remaining', v_quota_limit - v_new_used,
    'message', 'Mock exam quota successfully deducted.'
  );
END;
$$;


-- ── 7. RPC: get_mock_exam_quota_status ────────────────────────────────
-- Read-only status resolver for candidate UI dashboards.
CREATE OR REPLACE FUNCTION public.get_mock_exam_quota_status(p_user_email TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_normalized_email TEXT;
  v_month_key TEXT;
  v_sub RECORD;
  v_is_campus_student BOOLEAN := false;
  v_used INTEGER := 0;
  v_limit INTEGER := 0;
  v_plan TEXT := 'FREE';
  v_plan_name TEXT := 'Free Tier';
  v_expires_at TIMESTAMPTZ := NULL;
BEGIN
  IF p_user_email IS NULL OR p_user_email = '' OR p_user_email = 'guest@prepunite.com' THEN
    RETURN jsonb_build_object(
      'plan', 'FREE',
      'planName', 'Free Tier',
      'limit', 0,
      'used', 0,
      'remaining', 0,
      'canGenerate', false
    );
  END IF;

  v_normalized_email := LOWER(TRIM(p_user_email));
  v_month_key := to_char(NOW(), 'YYYY-MM');

  -- 1. Campus student check
  SELECT EXISTS (
    SELECT 1 FROM public.college_students cs
    JOIN public.colleges c ON cs.college_id = c.id
    WHERE LOWER(TRIM(cs.email)) = v_normalized_email
      AND cs.status = 'ACTIVE'
      AND c.status = 'ACTIVE'
      AND (c.valid_until IS NULL OR c.valid_until > NOW())
  ) INTO v_is_campus_student;

  IF NOT v_is_campus_student THEN
    SELECT EXISTS (
      SELECT 1 FROM public.user_subscriptions
      WHERE LOWER(TRIM(user_email)) = v_normalized_email
        AND payment_id LIKE 'B2B_CAMPUS_%'
        AND status = 'ACTIVE'
        AND expires_at > NOW()
    ) INTO v_is_campus_student;
  END IF;

  IF v_is_campus_student THEN
    RETURN jsonb_build_object(
      'plan', 'COLLEGE',
      'planName', 'Campus Partner Pass',
      'limit', 999,
      'used', 0,
      'remaining', 999,
      'canGenerate', true
    );
  END IF;

  -- 2. Personal B2C subscription check
  SELECT * INTO v_sub
  FROM public.user_subscriptions
  WHERE LOWER(TRIM(user_email)) = v_normalized_email
    AND status = 'ACTIVE'
    AND expires_at > NOW()
  ORDER BY expires_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'plan', 'FREE',
      'planName', 'Free Tier',
      'limit', 0,
      'used', 0,
      'remaining', 0,
      'canGenerate', false
    );
  END IF;

  v_expires_at := v_sub.expires_at;

  IF v_sub.plan_name ILIKE '%ULTRA%' THEN
    RETURN jsonb_build_object(
      'plan', 'ULTRA',
      'planName', v_sub.plan_name,
      'limit', 999,
      'used', 0,
      'remaining', 999,
      'canGenerate', true,
      'expiresAt', v_expires_at
    );
  END IF;

  -- Pro / Plus tier
  v_plan := 'PRO';
  v_plan_name := v_sub.plan_name;
  v_limit := 5;

  SELECT COALESCE(used_count, 0) INTO v_used
  FROM public.user_mock_exam_quotas
  WHERE user_email = v_normalized_email AND month_key = v_month_key;

  RETURN jsonb_build_object(
    'plan', v_plan,
    'planName', v_plan_name,
    'limit', v_limit,
    'used', v_used,
    'remaining', GREATEST(0, v_limit - v_used),
    'canGenerate', (v_used < v_limit),
    'expiresAt', v_expires_at
  );
END;
$$;
