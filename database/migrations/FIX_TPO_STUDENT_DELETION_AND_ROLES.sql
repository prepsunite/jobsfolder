-- ====================================================================
-- FIX: TPO & Student Relationship, RLS Permissions, and Lifecycle RPCs
-- Date: 2026-09-24
-- Description:
--   1. Fixes is_tpo_for_college function (resolves status = 'ACTIVE' vs is_active bug,
--      supports college UUID, slug, and code matching).
--   2. Adds atomic SECURITY DEFINER RPC remove_college_student for reliable,
--      fail-safe student removal that revokes licenses, clears profiles,
--      updates user_subscriptions, and cleans up contact_messages backups.
--   3. Adds atomic SECURITY DEFINER RPC assign_college_tpo to promote a user to TPO,
--      updating profiles.is_tpo_admin and cleanly removing them from the student roster.
--   4. Adds atomic SECURITY DEFINER RPC revoke_college_tpo to revoke TPO status.
--   5. Fixes RLS policies on profiles to allow setting college_id = null for removed students.
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. Helper function: is_tpo_for_college (Robust, multi-tenant check)
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_tpo_for_college(p_college_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_jwt_email TEXT := lower(COALESCE(auth.jwt()->>'email', ''));
  v_resolved_cid TEXT := p_college_id;
BEGIN
  IF v_uid IS NULL AND (v_jwt_email IS NULL OR v_jwt_email = '') THEN
    RETURN FALSE;
  END IF;

  -- 1. Super admin bypass
  IF public.is_admin() THEN
    RETURN TRUE;
  END IF;

  IF p_college_id IS NULL OR p_college_id = '' THEN
    RETURN FALSE;
  END IF;

  -- 2. Check tpo_authorizations table (matching by ID, slug, or code)
  IF EXISTS (
    SELECT 1 FROM public.tpo_authorizations ta
    LEFT JOIN public.colleges c ON c.id::TEXT = ta.college_id::TEXT
    WHERE ta.status = 'ACTIVE'
      AND (
        ta.college_id::TEXT = p_college_id::TEXT
        OR (c.id IS NOT NULL AND (c.id::TEXT = p_college_id::TEXT OR c.slug = p_college_id OR c.code = p_college_id))
      )
      AND (
        (v_uid IS NOT NULL AND ta.user_id = v_uid)
        OR (v_jwt_email != '' AND lower(ta.email) = v_jwt_email)
        OR (v_uid IS NOT NULL AND EXISTS (
          SELECT 1 FROM public.profiles p WHERE p.id = v_uid AND lower(p.email) = lower(ta.email)
        ))
      )
  ) THEN
    RETURN TRUE;
  END IF;

  -- 3. Check profiles table for is_tpo_admin
  IF v_uid IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.profiles p
    LEFT JOIN public.colleges c ON c.id::TEXT = p.college_id::TEXT
    WHERE p.id = v_uid
      AND p.is_tpo_admin = true
      AND (
        p.college_id::TEXT = p_college_id::TEXT
        OR (c.id IS NOT NULL AND (c.id::TEXT = p_college_id::TEXT OR c.slug = p_college_id OR c.code = p_college_id))
      )
  ) THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_tpo_for_college(TEXT) TO anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- 2. Atomic Student Removal RPC (SECURITY DEFINER)
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.remove_college_student(
  p_college_id TEXT,
  p_student_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_caller_uid UUID := auth.uid();
  v_caller_email TEXT := lower(COALESCE(auth.jwt()->>'email', ''));
  v_clean_email TEXT;
  v_col RECORD;
  v_target_cids TEXT[];
  v_deleted_count INT := 0;
BEGIN
  -- Validate inputs
  IF p_student_email IS NULL OR trim(p_student_email) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Student email is required.');
  END IF;

  IF p_college_id IS NULL OR trim(p_college_id) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'College ID is required.');
  END IF;

  v_clean_email := lower(trim(p_student_email));

  -- Verify caller authorization (must be TPO for this college or super admin)
  IF NOT public.is_tpo_for_college(p_college_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized: You are not an active TPO for this college.');
  END IF;

  -- Protect TPO Accounts: A TPO cannot delete another TPO or themselves through student deletion
  IF EXISTS (
    SELECT 1 FROM public.tpo_authorizations ta
    WHERE lower(ta.email) = v_clean_email
      AND ta.status = 'ACTIVE'
  ) THEN
    -- If this is a TPO, only clean up their college_students row so they don't consume a student license seat,
    -- but do NOT revoke their TPO profile or TPO authorization!
    DELETE FROM public.college_students
    WHERE lower(email) = v_clean_email;

    RETURN jsonb_build_object(
      'success', true,
      'is_tpo', true,
      'message', 'TPO user removed from student roster; their TPO administrator credentials remain active.'
    );
  END IF;

  -- Resolve college IDs (UUID, code, slug)
  v_target_cids := ARRAY[p_college_id];
  SELECT id, code, slug INTO v_col
  FROM public.colleges
  WHERE id::TEXT = p_college_id OR code = p_college_id OR slug = p_college_id
  LIMIT 1;

  IF v_col IS NOT NULL THEN
    IF v_col.id::TEXT != ALL(v_target_cids) THEN
      v_target_cids := array_append(v_target_cids, v_col.id::TEXT);
    END IF;
    IF v_col.code IS NOT NULL AND v_col.code != ALL(v_target_cids) THEN
      v_target_cids := array_append(v_target_cids, v_col.code);
    END IF;
    IF v_col.slug IS NOT NULL AND v_col.slug != ALL(v_target_cids) THEN
      v_target_cids := array_append(v_target_cids, v_col.slug);
    END IF;
  END IF;

  -- 1. Delete from college_students table
  DELETE FROM public.college_students
  WHERE lower(email) = v_clean_email
    AND college_id::TEXT = ANY(v_target_cids);

  -- 2. Clear college affiliation in profiles table
  UPDATE public.profiles
  SET 
    college_id = NULL,
    roll_number = NULL,
    department = NULL,
    batch_year = NULL,
    updated_at = NOW()
  WHERE lower(email) = v_clean_email
    AND (college_id::TEXT = ANY(v_target_cids) OR college_id IS NULL)
    AND COALESCE(is_tpo_admin, false) = false;

  -- 3. Revoke active Campus Pro Pass in user_subscriptions
  UPDATE public.user_subscriptions
  SET 
    status = 'EXPIRED',
    expires_at = NOW() - INTERVAL '1 second',
    updated_at = NOW()
  WHERE lower(user_email) = v_clean_email
    AND (
      payment_id LIKE 'B2B_CAMPUS_%'
      OR plan_name ILIKE '%Campus Pro Pass%'
      OR plan_name ILIKE '%College%'
    );

  -- 4. Mark cloud resilience contact_messages as DELETED
  UPDATE public.contact_messages
  SET status = 'DELETED'
  WHERE subject LIKE 'B2B_STUDENT:%'
    AND (
      message ILIKE '%"' || v_clean_email || '"%'
      OR message ILIKE '%"email":"' || v_clean_email || '"%'
    );

  RETURN jsonb_build_object(
    'success', true,
    'email', v_clean_email,
    'college_id', p_college_id,
    'message', 'Student successfully removed and institutional access revoked.'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.remove_college_student(TEXT, TEXT) TO anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- 3. Atomic TPO Assignment RPC (SECURITY DEFINER)
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.assign_college_tpo(
  p_college_id TEXT,
  p_email TEXT,
  p_max_licenses INT DEFAULT 1500
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_clean_email TEXT;
  v_col RECORD;
  v_resolved_cid TEXT;
  v_existing_user_id UUID;
BEGIN
  -- Strict Super Admin requirement
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized: Only platform administrators can assign TPO Coordinators.');
  END IF;

  v_clean_email := lower(trim(p_email));
  IF v_clean_email = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Email is required.');
  END IF;

  -- Resolve College
  SELECT id, name, code, max_licenses INTO v_col
  FROM public.colleges
  WHERE id::TEXT = p_college_id OR code = p_college_id OR slug = p_college_id
  LIMIT 1;

  IF v_col IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'College not found.');
  END IF;

  v_resolved_cid := v_col.id::TEXT;

  -- Lookup user ID from auth.users or profiles
  SELECT id INTO v_existing_user_id
  FROM public.profiles
  WHERE lower(email) = v_clean_email
  LIMIT 1;

  -- 1. Insert or update in tpo_authorizations
  INSERT INTO public.tpo_authorizations (
    college_id,
    email,
    user_id,
    status,
    max_licenses,
    assigned_at,
    updated_at
  ) VALUES (
    v_resolved_cid,
    v_clean_email,
    v_existing_user_id,
    'ACTIVE',
    COALESCE(p_max_licenses, v_col.max_licenses, 1500),
    NOW(),
    NOW()
  )
  ON CONFLICT (college_id, email)
  DO UPDATE SET
    status = 'ACTIVE',
    user_id = COALESCE(EXCLUDED.user_id, public.tpo_authorizations.user_id),
    max_licenses = EXCLUDED.max_licenses,
    updated_at = NOW();

  -- 2. Update profiles table: set is_tpo_admin = true and college_id
  UPDATE public.profiles
  SET 
    is_tpo_admin = true,
    college_id = v_resolved_cid,
    role = 'user', -- TPOs are 'user' on platform, but is_tpo_admin = true
    updated_at = NOW()
  WHERE lower(email) = v_clean_email;

  -- 3. If this email was enrolled as a student in college_students,
  -- remove them from the student roster so they do NOT consume a student seat
  -- and do NOT appear on their own student directory!
  DELETE FROM public.college_students
  WHERE lower(email) = v_clean_email;

  -- Clean up any student contact_messages backups
  UPDATE public.contact_messages
  SET status = 'DELETED'
  WHERE subject LIKE 'B2B_STUDENT:%'
    AND message ILIKE '%"' || v_clean_email || '"%';

  -- Revoke any student subscription pass so license seat is freed
  UPDATE public.user_subscriptions
  SET status = 'EXPIRED', expires_at = NOW() - INTERVAL '1 second'
  WHERE lower(user_email) = v_clean_email AND payment_id LIKE 'B2B_CAMPUS_%';

  RETURN jsonb_build_object(
    'success', true,
    'college_id', v_resolved_cid,
    'college_name', v_col.name,
    'email', v_clean_email,
    'message', 'Authorized ' || v_clean_email || ' as TPO Coordinator for ' || v_col.name || '.'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.assign_college_tpo(TEXT, TEXT, INT) TO anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- 4. Atomic TPO Revocation RPC (SECURITY DEFINER)
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.revoke_college_tpo(
  p_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_clean_email TEXT;
BEGIN
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized: Only platform administrators can revoke TPO Coordinators.');
  END IF;

  v_clean_email := lower(trim(p_email));

  -- 1. Deactivate in tpo_authorizations
  UPDATE public.tpo_authorizations
  SET status = 'REVOKED', updated_at = NOW()
  WHERE lower(email) = v_clean_email;

  -- 2. Strip TPO privileges in profiles
  UPDATE public.profiles
  SET 
    is_tpo_admin = false,
    college_id = NULL,
    role = 'user',
    updated_at = NOW()
  WHERE lower(email) = v_clean_email;

  -- 3. Deactivate cloud backup messages
  UPDATE public.contact_messages
  SET status = 'REVOKED'
  WHERE subject = 'B2B_TPO_AUTH:' || v_clean_email
     OR (email = v_clean_email AND subject LIKE 'B2B_TPO_AUTH:%');

  RETURN jsonb_build_object(
    'success', true,
    'email', v_clean_email,
    'message', 'Revoked TPO Coordinator privileges for ' || v_clean_email || '.'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.revoke_college_tpo(TEXT) TO anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- 5. Fix Profiles RLS Policies
-- --------------------------------------------------------------------
-- Allow TPOs to clear college_id for students of their college
DROP POLICY IF EXISTS "TPO update college students" ON public.profiles;
CREATE POLICY "TPO update college students"
  ON public.profiles
  FOR UPDATE
  USING (
    public.is_admin()
    OR (
      EXISTS (
        SELECT 1 FROM public.profiles tpo
        WHERE tpo.id = auth.uid()
          AND tpo.is_tpo_admin = true
          AND tpo.college_id IS NOT NULL
          AND (
            public.profiles.college_id IS NULL
            OR public.profiles.college_id::text = tpo.college_id::text
          )
      )
    )
    OR public.is_tpo_for_college(public.profiles.college_id::text)
  )
  WITH CHECK (
    public.is_admin()
    OR (
      -- Allow setting college_id to NULL (removal) or matching TPO's college
      (
        public.profiles.college_id IS NULL
        OR EXISTS (
          SELECT 1 FROM public.profiles tpo
          WHERE tpo.id = auth.uid()
            AND tpo.is_tpo_admin = true
            AND tpo.college_id IS NOT NULL
            AND public.profiles.college_id::text = tpo.college_id::text
        )
        OR public.is_tpo_for_college(public.profiles.college_id::text)
      )
      AND LOWER(COALESCE(public.profiles.role, 'user')) = 'user'
      AND COALESCE(public.profiles.is_tpo_admin, false) = false
    )
  );

-- Allow authenticated users to synchronize their own TPO state if verified in tpo_authorizations
DROP POLICY IF EXISTS "Users update self info non-role" ON public.profiles;
CREATE POLICY "Users update self info non-role"
  ON public.profiles
  FOR UPDATE
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (
    public.is_admin()
    OR (
      id = auth.uid()
      AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
      -- Allow is_tpo_admin and college_id to be set IF pre-authorized in tpo_authorizations table
      AND (
        (
          COALESCE(is_tpo_admin, false) = (SELECT COALESCE(p.is_tpo_admin, false) FROM public.profiles p WHERE p.id = auth.uid())
          AND COALESCE(college_id, '') = (SELECT COALESCE(p.college_id, '') FROM public.profiles p WHERE p.id = auth.uid())
        )
        OR EXISTS (
          SELECT 1 FROM public.tpo_authorizations ta
          WHERE lower(ta.email) = lower(auth.jwt()->>'email')
            AND ta.status = 'ACTIVE'
            AND (college_id IS NULL OR ta.college_id::text = college_id::text)
        )
      )
    )
  );

-- --------------------------------------------------------------------
-- 6. Server-Side College Real-Time Student Usage RPC (SECURITY DEFINER)
-- --------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.get_colleges_usage_summary();

CREATE OR REPLACE FUNCTION public.get_colleges_usage_summary()
RETURNS TABLE (
    college_id TEXT,
    enrolled_count BIGINT,
    active_exams_count BIGINT
) LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT 
        c.id::TEXT AS college_id,
        COUNT(DISTINCT cs.email) AS enrolled_count,
        COUNT(DISTINCT me.id) AS active_exams_count
    FROM public.colleges c
    LEFT JOIN public.college_students cs 
        ON (cs.college_id::TEXT = c.id::TEXT OR (c.code IS NOT NULL AND cs.college_id::TEXT = c.code::TEXT))
        AND COALESCE(cs.status, 'ACTIVE') = 'ACTIVE'
        AND COALESCE(cs.role, 'STUDENT') NOT IN ('TPO_ADMIN', 'TPO')
        AND NOT EXISTS (
            SELECT 1 FROM public.tpo_authorizations ta 
            WHERE lower(ta.email) = lower(cs.email) AND ta.status = 'ACTIVE'
        )
    LEFT JOIN public.mock_exams me 
        ON (me.college_id::TEXT = c.id::TEXT OR (c.code IS NOT NULL AND me.college_id::TEXT = c.code::TEXT))
        AND COALESCE(me.is_deleted, false) = false 
        AND COALESCE(me.is_active, true) = true
    GROUP BY c.id;
$$;

GRANT EXECUTE ON FUNCTION public.get_colleges_usage_summary() TO anon, authenticated, service_role;

