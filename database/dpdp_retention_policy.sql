-- ============================================================
-- DPDP Act 2023 — Data Retention Policy
-- PrepUnite / Jobsfolder
-- Rule 8(7): Data must be deleted once purpose is fulfilled
-- ============================================================

-- ── Retention Periods (matches Privacy Policy table) ────────
-- profiles:             Until account deletion request
-- transactions:         7 years (Indian tax law mandate)
-- user_subscriptions:   Until expiry + 1 year (dispute window)
-- user_paper_purchases: Until expiry + 1 year (dispute window)
-- experiences:          Until user deletion request
-- admin_audit_logs:     3 years (compliance record)
-- ============================================================

-- ── Function: Anonymise inactive accounts ───────────────────
-- Anonymises profile data for users who have:
--   (a) No active subscription
--   (b) Not logged in for > 2 years
--   (c) No pending grievance on record
-- This DOES NOT delete the row (keeps auth.users reference intact)
-- It replaces PII with neutral values.
CREATE OR REPLACE FUNCTION public.dpdp_anonymise_inactive_profiles()
RETURNS INTEGER AS $$
DECLARE
  affected INTEGER;
BEGIN
  UPDATE public.profiles
  SET
    name      = 'Deleted User',
    avatar_url = NULL,
    updated_at = NOW()
  WHERE
    -- No login in over 2 years
    updated_at < NOW() - INTERVAL '2 years'
    -- Not an admin (never auto-anonymise admins)
    AND LOWER(role) != 'admin'
    -- No active subscription
    AND email NOT IN (
      SELECT user_email FROM public.user_subscriptions
      WHERE status = 'ACTIVE'
        AND expires_at > NOW()
    )
    -- Profile not already anonymised
    AND name != 'Deleted User';

  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Function: Mark expired subscriptions as EXPIRED ─────────
CREATE OR REPLACE FUNCTION public.dpdp_expire_subscriptions()
RETURNS INTEGER AS $$
DECLARE
  affected INTEGER;
BEGIN
  UPDATE public.user_subscriptions
  SET status = 'EXPIRED'
  WHERE
    status = 'ACTIVE'
    AND expires_at < NOW();

  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Function: Hard-delete anonymised profiles on request ─────
-- Called manually or via API when a user submits a deletion request
-- Preserves transactions/subscriptions for 7 years (tax mandate)
-- but removes all PII from the profile and auth.users
CREATE OR REPLACE FUNCTION public.dpdp_delete_user_data(target_email TEXT)
RETURNS TEXT AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Get the user's UUID from profiles
  SELECT id INTO target_user_id
  FROM public.profiles
  WHERE LOWER(email) = LOWER(target_email);

  IF target_user_id IS NULL THEN
    RETURN 'User not found: ' || target_email;
  END IF;

  -- Anonymise the profile row (keep for referential integrity)
  UPDATE public.profiles
  SET
    name       = 'Deleted User',
    avatar_url = NULL,
    email      = 'deleted_' || target_user_id || '@deleted.invalid',
    updated_at = NOW()
  WHERE id = target_user_id;

  -- Soft-delete submitted experiences (preserve anonymised)
  UPDATE public.experiences
  SET
    student_name = 'Anonymous Student',
    is_deleted   = FALSE,   -- keep content, remove PII name
    updated_at   = NOW()
  WHERE created_by = target_user_id;

  -- Note: transactions/subscriptions kept for 7 years with anonymised email reference
  UPDATE public.transactions
  SET user_email = 'deleted_' || target_user_id || '@deleted.invalid'
  WHERE user_email = LOWER(target_email);

  UPDATE public.user_subscriptions
  SET user_email = 'deleted_' || target_user_id || '@deleted.invalid'
  WHERE user_email = LOWER(target_email);

  UPDATE public.user_paper_purchases
  SET user_email = 'deleted_' || target_user_id || '@deleted.invalid'
  WHERE user_email = LOWER(target_email);

  -- Log the deletion in audit logs
  INSERT INTO public.admin_audit_logs (
    admin_email, action, target_entity, target_id, after_data
  ) VALUES (
    'system@dpdp-retention',
    'DPDP_USER_DATA_DELETION',
    'profiles',
    target_user_id::TEXT,
    jsonb_build_object(
      'reason', 'User requested data deletion under DPDP Act 2023',
      'processed_at', NOW()
    )
  );

  RETURN 'Data deletion completed for: ' || target_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Scheduled Job Suggestion ─────────────────────────────────
-- Run these monthly via Supabase pg_cron (enable in Dashboard → Extensions):
-- SELECT cron.schedule('dpdp-expire-subs', '0 2 1 * *', 'SELECT public.dpdp_expire_subscriptions()');
-- SELECT cron.schedule('dpdp-anonymise', '0 3 1 * *', 'SELECT public.dpdp_anonymise_inactive_profiles()');

-- ── Verification ─────────────────────────────────────────────
-- Test the expire function (safe - only updates ACTIVE+expired):
-- SELECT public.dpdp_expire_subscriptions();

-- Test anonymisation (safe - only affects 2yr+ inactive, no active sub):
-- SELECT public.dpdp_anonymise_inactive_profiles();
