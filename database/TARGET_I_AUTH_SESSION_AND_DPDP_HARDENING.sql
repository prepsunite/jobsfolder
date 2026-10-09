-- ====================================================================
-- PREPUNITE PRODUCTION DATABASE MIGRATION SCRIPT
-- TARGET I: AUTHENTICATION SECURITY, SESSION MANAGEMENT, RBAC & DPDP
-- FILE: TARGET_I_AUTH_SESSION_AND_DPDP_HARDENING.sql
-- ====================================================================

BEGIN;

-- --------------------------------------------------------------------
-- 1. CANONICAL SUPER ADMIN EMAIL EVALUATION FUNCTION
-- --------------------------------------------------------------------
-- Mathematically identical to frontend isSuperAdminEmail()
-- Normalizes dots in Gmail addresses, maps googlemail.com -> gmail.com,
-- and strictly REJECTS any plus-aliases (+tag) to prevent alias escalation.

CREATE OR REPLACE FUNCTION public.is_super_admin_email(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_clean TEXT;
  v_user TEXT;
  v_domain TEXT;
  v_norm_user TEXT;
  v_norm_email TEXT;
BEGIN
  IF p_email IS NULL OR TRIM(p_email) = '' THEN
    RETURN FALSE;
  END IF;

  v_clean := LOWER(TRIM(p_email));

  -- 1. Direct whitelist exact match
  IF v_clean IN (
    'venkatmukala9@gmail.com',
    'venkat.mukala9@gmail.com',
    'venkatmukala3@gmail.com',
    'venkat.mukala3@gmail.com',
    'prepsunite@gmail.com'
  ) THEN
    RETURN TRUE;
  END IF;

  -- 2. Gmail dot normalization & plus-alias rejection
  IF v_clean LIKE '%@gmail.com' OR v_clean LIKE '%@googlemail.com' THEN
    v_user := split_part(v_clean, '@', 1);
    v_domain := split_part(v_clean, '@', 2);

    -- 🛡️ SECURITY: Plus-aliases (+tag) NEVER receive super-admin privileges
    IF POSITION('+' IN v_user) > 0 THEN
      RETURN FALSE;
    END IF;

    -- Strip all dots
    v_norm_user := REPLACE(v_user, '.', '');
    v_norm_email := v_norm_user || '@gmail.com';

    IF v_norm_email IN (
      'venkatmukala9@gmail.com',
      'venkatmukala3@gmail.com',
      'prepsunite@gmail.com'
    ) THEN
      RETURN TRUE;
    END IF;
  END IF;

  RETURN FALSE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_super_admin_email(TEXT) TO anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- 2. HARDEN PUBLIC.IS_ADMIN() USING CANONICAL SUPER ADMIN FUNCTION
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_email TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Check JWT email claim
  v_email := auth.jwt() ->> 'email';
  IF public.is_super_admin_email(v_email) THEN
    RETURN TRUE;
  END IF;

  -- Check profiles table role and email
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND (
        LOWER(COALESCE(role, '')) = 'admin'
        OR public.is_super_admin_email(email)
      )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- 3. HARDEN HANDLE_NEW_USER() TRIGGER ON AUTH.USERS
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_email TEXT := LOWER(COALESCE(NEW.email, ''));
  v_name TEXT := COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(v_email, '@', 1));
  v_role TEXT := 'user';
  v_is_super BOOLEAN := FALSE;
BEGIN
  v_is_super := public.is_super_admin_email(v_email);
  IF v_is_super THEN
    v_role := 'admin';
  END IF;

  INSERT INTO public.profiles (
    id,
    email,
    name,
    role,
    avatar_url,
    consent_status,
    consent_accepted_at,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    v_email,
    v_name,
    v_role,
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'consent_status', 'pending'),
    CASE 
      WHEN NEW.raw_user_meta_data->>'consent_status' = 'accepted' THEN NOW()
      ELSE NULL
    END,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(public.profiles.name, EXCLUDED.name),
    avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
    role = CASE 
      WHEN v_is_super THEN 'admin'
      ELSE public.profiles.role
    END,
    updated_at = NOW();

  RETURN NEW;
END;
$$;

-- --------------------------------------------------------------------
-- 4. HARDEN DPDP CONSENT STORAGE ON PUBLIC.PROFILES
-- --------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'consent_status'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN consent_status VARCHAR(20) DEFAULT 'pending';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'consent_accepted_at'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN consent_accepted_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_consent_status ON public.profiles(consent_status);

-- RPC for clients to atomically update DPDP consent status
CREATE OR REPLACE FUNCTION public.update_user_dpdp_consent(
  p_status VARCHAR(20),
  p_accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to persist consent status.';
  END IF;

  IF p_status NOT IN ('pending', 'accepted', 'declined', 'withdrawn') THEN
    RAISE EXCEPTION 'Invalid consent status value.';
  END IF;

  UPDATE public.profiles
  SET 
    consent_status = p_status,
    consent_accepted_at = CASE 
      WHEN p_status = 'accepted' THEN COALESCE(p_accepted_at, NOW())
      ELSE NULL
    END,
    updated_at = NOW()
  WHERE id = auth.uid();

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_user_dpdp_consent(VARCHAR, TIMESTAMP WITH TIME ZONE) TO authenticated;

-- --------------------------------------------------------------------
-- 5. SECURE DPDP RIGHT-TO-ERASURE CASCADE (SECTION 12(3))
-- --------------------------------------------------------------------
-- Fixes Critical Vulnerability: Restricts execution strictly to caller's
-- own account or verified Super Admin. Purges personal data across all 8 subsystems.

CREATE OR REPLACE FUNCTION public.dpdp_delete_user_data(target_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  target_user_id UUID;
  v_clean_email TEXT;
  v_caller_email TEXT;
  v_is_authorized BOOLEAN := FALSE;
  v_placeholder_email TEXT;
BEGIN
  IF target_email IS NULL OR TRIM(target_email) = '' THEN
    RAISE EXCEPTION 'Target email cannot be null or empty.';
  END IF;

  v_clean_email := LOWER(TRIM(target_email));
  v_caller_email := LOWER(TRIM(COALESCE(auth.jwt() ->> 'email', '')));

  -- 🛡️ SECURITY AUTHORIZATION ENFORCEMENT:
  -- Only the data principal themselves OR an authenticated Super Admin can invoke erasure.
  v_is_authorized := public.is_admin() OR (v_caller_email = v_clean_email AND v_caller_email != '');

  IF NOT v_is_authorized THEN
    RAISE EXCEPTION 'Access Denied: You may only invoke erasure on your own authenticated account.';
  END IF;

  -- 1. Resolve user UUID from public.profiles
  SELECT id INTO target_user_id
  FROM public.profiles
  WHERE LOWER(email) = v_clean_email;

  IF target_user_id IS NULL THEN
    RETURN 'User profile not found for: ' || v_clean_email;
  END IF;

  v_placeholder_email := 'deleted_' || target_user_id || '@deleted.invalid';

  -- 2. Anonymize profile record (preserve UUID to maintain referential integrity without PII)
  UPDATE public.profiles
  SET
    name = 'Deleted Candidate',
    avatar_url = NULL,
    email = v_placeholder_email,
    consent_status = 'withdrawn',
    consent_accepted_at = NULL,
    college_id = NULL,
    roll_number = NULL,
    department = NULL,
    batch_year = NULL,
    target_role = NULL,
    target_company = NULL,
    graduation_year = NULL,
    updated_at = NOW()
  WHERE id = target_user_id;

  -- 3. Target F: Anonymize public placement experiences & delete upvotes
  UPDATE public.experiences
  SET
    student_name = 'Anonymous Student',
    college = 'Redacted Institution',
    user_id = NULL,
    user_email = NULL,
    updated_at = NOW()
  WHERE created_by = target_user_id 
     OR LOWER(user_email) = v_clean_email;

  DELETE FROM public.user_experience_upvotes
  WHERE user_id = target_user_id 
     OR LOWER(user_email) = v_clean_email;

  -- 4. Target G: Purge question practice telemetry & bookmarks
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_question_progress') THEN
    DELETE FROM public.user_question_progress
    WHERE user_id = target_user_id 
       OR LOWER(user_email) = v_clean_email;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_bookmarks') THEN
    DELETE FROM public.user_bookmarks
    WHERE user_id = target_user_id 
       OR LOWER(user_email) = v_clean_email;
  END IF;

  -- 5. Target E: Purge LeetCode synchronization & coding submissions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_leetcode_stats') THEN
    DELETE FROM public.user_leetcode_stats
    WHERE user_id = target_user_id 
       OR LOWER(user_email) = v_clean_email;
  END IF;

  -- 6. Target A/C: Scrub college student record & proctoring exam telemetry
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'college_students') THEN
    UPDATE public.college_students
    SET
      email = v_placeholder_email,
      name = 'Deleted Candidate',
      roll_number = NULL,
      updated_at = NOW()
    WHERE LOWER(email) = v_clean_email 
       OR user_id = target_user_id;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'student_exam_attempts') THEN
    UPDATE public.student_exam_attempts
    SET
      responses = '{}'::jsonb,
      proctor_events = '[]'::jsonb,
      updated_at = NOW()
    WHERE student_id IN (
      SELECT id::TEXT FROM public.college_students WHERE email = v_placeholder_email
    ) OR student_id = target_user_id::TEXT;
  END IF;

  -- 7. Target D & H: Anonymize financial ledger records (retained for 7-year statutory tax compliance)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'transactions') THEN
    UPDATE public.transactions
    SET user_email = v_placeholder_email
    WHERE LOWER(user_email) = v_clean_email;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_subscriptions') THEN
    UPDATE public.user_subscriptions
    SET user_email = v_placeholder_email, status = 'EXPIRED'
    WHERE LOWER(user_email) = v_clean_email;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_paper_purchases') THEN
    UPDATE public.user_paper_purchases
    SET user_email = v_placeholder_email
    WHERE LOWER(user_email) = v_clean_email;
  END IF;

  -- 8. Target F: Scrub contact and question grievance reports
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'feedback_reports') THEN
    UPDATE public.feedback_reports
    SET user_email = v_placeholder_email
    WHERE LOWER(user_email) = v_clean_email;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contact_submissions') THEN
    UPDATE public.contact_submissions
    SET email = v_placeholder_email, name = 'Deleted User'
    WHERE LOWER(email) = v_clean_email;
  END IF;

  -- 9. Log administrative audit trail
  INSERT INTO public.admin_audit_logs (
    admin_email, action, target_entity, target_id, after_data
  ) VALUES (
    COALESCE(auth.jwt() ->> 'email', 'system@dpdp-erasure'),
    'DPDP_RIGHT_TO_ERASURE_PROCESSED',
    'profiles',
    target_user_id::TEXT,
    jsonb_build_object(
      'processed_at', NOW(),
      'erasure_type', 'SECTION_12_3_COMPLETE_CASCADE',
      'initiator', v_caller_email
    )
  );

  RETURN 'DPDP Right to Erasure cascade successfully completed for: ' || v_clean_email;
END;
$$;

GRANT EXECUTE ON FUNCTION public.dpdp_delete_user_data(TEXT) TO authenticated, service_role;

-- --------------------------------------------------------------------
-- 6. STATUTORY CLIENT ERASURE REQUEST HELPER RPC
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.request_dpdp_user_deletion(p_reason TEXT DEFAULT 'User requested erasure under Section 12(3) DPDP Act 2023')
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_email TEXT;
  v_res TEXT;
BEGIN
  v_email := auth.jwt() ->> 'email';
  IF v_email IS NULL OR v_email = '' THEN
    RAISE EXCEPTION 'Authentication required to initiate data erasure.';
  END IF;

  -- Execute complete erasure cascade immediately
  v_res := public.dpdp_delete_user_data(v_email);

  RETURN jsonb_build_object(
    'status', 'COMPLETED',
    'message', v_res,
    'timestamp', NOW()
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.request_dpdp_user_deletion(TEXT) TO authenticated;

COMMIT;
