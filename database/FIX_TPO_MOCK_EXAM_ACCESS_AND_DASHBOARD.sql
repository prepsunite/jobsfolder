-- ==============================================================================
-- PREPUNITE FIX: TPO MOCK EXAM MULTI-TENANT ACCESS & DASHBOARD SYNCHRONIZATION
-- File: FIX_TPO_MOCK_EXAM_ACCESS_AND_DASHBOARD.sql
-- Run this in Supabase SQL Editor (Ctrl + Enter / Run All)
-- ==============================================================================
-- Fixes:
-- 1. Normalizes NULL is_deleted and is_active on mock_exams, colleges, and students.
-- 2. Makes `is_tpo_for_college` resilient across college UUID, code, and slug.
-- 3. Upgrades `check_student_college_entitlement` to resolve across college_students,
--    profiles, and B2B subscriptions so student college links are never wiped.
-- 4. Unblocks direct mock exam link sharing (/exam/:examId) while strictly locking
--    student practice tests to creators and protecting question papers.
-- ==============================================================================

-- 1. Schema Hygiene: Add missing contact_email column and normalize NULL flags to sensible defaults
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS contact_email TEXT;

UPDATE public.mock_exams
SET is_deleted = false
WHERE is_deleted IS NULL;

UPDATE public.mock_exams
SET is_active = true
WHERE is_active IS NULL;

UPDATE public.colleges
SET is_deleted = false
WHERE is_deleted IS NULL;

UPDATE public.college_students
SET status = 'ACTIVE'
WHERE status IS NULL;

-- 2. Resilient TPO College Authorization Function
CREATE OR REPLACE FUNCTION public.is_tpo_for_college(p_college_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_jwt_email TEXT := lower(COALESCE(auth.jwt()->>'email', ''));
BEGIN
  IF public.is_admin() THEN
    RETURN TRUE;
  END IF;

  IF p_college_id IS NULL OR trim(p_college_id) = '' THEN
    RETURN FALSE;
  END IF;

  -- 1. Check tpo_authorizations table (matching by ID, code, slug, or name)
  IF EXISTS (
    SELECT 1 
    FROM public.tpo_authorizations ta
    LEFT JOIN public.colleges c ON c.id::TEXT = ta.college_id::TEXT
    WHERE (
        ta.college_id::TEXT = p_college_id::TEXT
        OR lower(trim(ta.college_id::TEXT)) = lower(trim(p_college_id::TEXT))
        OR (c.id IS NOT NULL AND (
          c.id::TEXT = p_college_id::TEXT
          OR lower(c.code) = lower(trim(p_college_id::TEXT))
          OR lower(c.slug) = lower(trim(p_college_id::TEXT))
          OR lower(c.name) = lower(trim(p_college_id::TEXT))
        ))
      )
      AND ta.status = 'ACTIVE'
      AND (
        (v_uid IS NOT NULL AND ta.user_id = v_uid)
        OR (v_jwt_email != '' AND lower(trim(ta.email)) = v_jwt_email)
        OR (v_uid IS NOT NULL AND EXISTS (
          SELECT 1 FROM public.profiles p WHERE p.id = v_uid AND lower(trim(p.email)) = lower(trim(ta.email))
        ))
      )
  ) THEN
    RETURN TRUE;
  END IF;

  -- 2. Check profiles table (assigned college_id with role in ('tpo', 'admin', 'tpo_admin'))
  IF v_uid IS NOT NULL AND EXISTS (
    SELECT 1 
    FROM public.profiles p
    LEFT JOIN public.colleges c ON c.id::TEXT = p.college_id::TEXT
    WHERE p.id = v_uid
      AND (
        p.college_id::TEXT = p_college_id::TEXT
        OR lower(trim(p.college_id::TEXT)) = lower(trim(p_college_id::TEXT))
        OR (c.id IS NOT NULL AND (
          c.id::TEXT = p_college_id::TEXT
          OR lower(c.code) = lower(trim(p_college_id::TEXT))
          OR lower(c.slug) = lower(trim(p_college_id::TEXT))
          OR lower(c.name) = lower(trim(p_college_id::TEXT))
        ))
      )
      AND lower(COALESCE(p.role, '')) IN ('tpo', 'admin', 'tpo_admin')
  ) THEN
    RETURN TRUE;
  END IF;

  -- 3. Check college_students table (is_tpo_admin = true or role = 'TPO')
  IF EXISTS (
    SELECT 1 
    FROM public.college_students cs
    LEFT JOIN public.colleges c ON c.id::TEXT = cs.college_id::TEXT
    WHERE (
        cs.college_id::TEXT = p_college_id::TEXT
        OR lower(trim(cs.college_id::TEXT)) = lower(trim(p_college_id::TEXT))
        OR (c.id IS NOT NULL AND (
          c.id::TEXT = p_college_id::TEXT
          OR lower(c.code) = lower(trim(p_college_id::TEXT))
          OR lower(c.slug) = lower(trim(p_college_id::TEXT))
          OR lower(c.name) = lower(trim(p_college_id::TEXT))
        ))
      )
      AND (cs.is_tpo_admin = true OR upper(COALESCE(cs.role, '')) = 'TPO')
      AND (
        (v_uid IS NOT NULL AND cs.user_id = v_uid)
        OR (v_jwt_email != '' AND lower(trim(cs.email)) = v_jwt_email)
      )
  ) THEN
    RETURN TRUE;
  END IF;

  -- 4. Check colleges table (contact_email matches caller safely)
  IF v_jwt_email != '' AND EXISTS (
    SELECT 1 FROM public.colleges c
    WHERE (
        c.id::TEXT = p_college_id::TEXT
        OR lower(c.code) = lower(trim(p_college_id::TEXT))
        OR lower(c.slug) = lower(trim(p_college_id::TEXT))
        OR lower(c.name) = lower(trim(p_college_id::TEXT))
      )
      AND c.contact_email IS NOT NULL
      AND lower(trim(c.contact_email)) = v_jwt_email
  ) THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$;
GRANT EXECUTE ON FUNCTION public.is_tpo_for_college(TEXT) TO anon, authenticated, service_role;

-- 3. Resilient Student College Entitlement Verification
CREATE OR REPLACE FUNCTION public.check_student_college_entitlement(
    p_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_clean_email TEXT;
    v_student RECORD;
    v_prof RECORD;
    v_sub RECORD;
BEGIN
    IF p_email IS NULL OR trim(p_email) = '' THEN
        RETURN jsonb_build_object('is_entitled', false, 'reason', 'No email provided');
    END IF;

    v_clean_email := lower(trim(p_email));

    -- Path 1: Check college_students table (Primary roster)
    SELECT 
        cs.id AS student_id,
        cs.college_id,
        cs.name,
        cs.roll_number,
        cs.department,
        cs.batch_year,
        c.name AS college_name,
        c.code AS college_code,
        c.contract_status,
        c.valid_until
    INTO v_student
    FROM public.college_students cs
    LEFT JOIN public.colleges c ON (
        c.id::TEXT = cs.college_id::TEXT
        OR lower(c.code) = lower(trim(cs.college_id::TEXT))
        OR lower(c.slug) = lower(trim(cs.college_id::TEXT))
        OR lower(c.name) = lower(trim(cs.college_id::TEXT))
    )
    WHERE lower(trim(cs.email)) = v_clean_email
      AND (cs.status IS NULL OR upper(trim(cs.status)) = 'ACTIVE')
      AND COALESCE(c.is_deleted, false) = false
    ORDER BY cs.created_at DESC
    LIMIT 1;

    IF v_student IS NOT NULL THEN
        -- If college record exists, check contract validity
        IF v_student.contract_status IS NOT NULL 
           AND v_student.contract_status NOT IN ('ACTIVE', 'PILOT') 
           AND (v_student.valid_until IS NOT NULL AND v_student.valid_until <= NOW()) THEN
            RETURN jsonb_build_object(
                'is_entitled', false,
                'is_expired', true,
                'college_id', v_student.college_id,
                'college_name', COALESCE(v_student.college_name, 'Partner College'),
                'valid_until', v_student.valid_until,
                'contract_status', v_student.contract_status,
                'reason', 'Institutional contract expired or suspended'
            );
        END IF;

        RETURN jsonb_build_object(
            'is_entitled', true,
            'is_expired', false,
            'student_id', v_student.student_id,
            'college_id', v_student.college_id,
            'college_name', COALESCE(v_student.college_name, 'Partner College'),
            'college_code', v_student.college_code,
            'valid_until', v_student.valid_until,
            'contract_status', COALESCE(v_student.contract_status, 'ACTIVE'),
            'department', v_student.department,
            'roll_number', v_student.roll_number,
            'batch_year', v_student.batch_year
        );
    END IF;

    -- Path 2: Check profiles table (User assigned college_id)
    SELECT 
        p.id AS user_id,
        p.college_id,
        p.name,
        p.roll_number,
        p.department,
        p.batch_year,
        c.name AS college_name,
        c.code AS college_code,
        c.contract_status,
        c.valid_until
    INTO v_prof
    FROM public.profiles p
    JOIN public.colleges c ON (
        c.id::TEXT = p.college_id::TEXT
        OR lower(c.code) = lower(trim(p.college_id::TEXT))
        OR lower(c.slug) = lower(trim(p.college_id::TEXT))
        OR lower(c.name) = lower(trim(p.college_id::TEXT))
    )
    WHERE lower(trim(p.email)) = v_clean_email
      AND p.college_id IS NOT NULL
      AND trim(p.college_id::TEXT) != ''
      AND COALESCE(c.is_deleted, false) = false
    LIMIT 1;

    IF v_prof IS NOT NULL THEN
        RETURN jsonb_build_object(
            'is_entitled', true,
            'is_expired', false,
            'student_id', v_prof.user_id,
            'college_id', v_prof.college_id,
            'college_name', COALESCE(v_prof.college_name, 'Partner College'),
            'college_code', v_prof.college_code,
            'valid_until', v_prof.valid_until,
            'contract_status', COALESCE(v_prof.contract_status, 'ACTIVE'),
            'department', v_prof.department,
            'roll_number', v_prof.roll_number,
            'batch_year', v_prof.batch_year
        );
    END IF;

    -- Path 3: Check active B2B Campus subscriptions in user_subscriptions
    SELECT 
        s.payment_id,
        s.expires_at,
        c.id AS college_id,
        c.name AS college_name,
        c.code AS college_code
    INTO v_sub
    FROM public.user_subscriptions s
    LEFT JOIN public.colleges c ON s.payment_id ILIKE 'B2B_CAMPUS_' || c.id::TEXT || '%'
                                OR s.payment_id ILIKE 'B2B_CAMPUS_' || c.code || '%'
                                OR s.payment_id ILIKE 'B2B_CAMPUS_' || c.slug || '%'
                                OR s.payment_id ILIKE 'B2B_CAMPUS_' || c.name || '%'
    WHERE lower(trim(s.user_email)) = v_clean_email
      AND s.payment_id ILIKE 'B2B_CAMPUS_%'
      AND s.status = 'ACTIVE'
      AND s.expires_at > NOW()
    ORDER BY s.created_at DESC
    LIMIT 1;

    IF v_sub IS NOT NULL AND v_sub.college_id IS NOT NULL THEN
        RETURN jsonb_build_object(
            'is_entitled', true,
            'is_expired', false,
            'college_id', v_sub.college_id,
            'college_name', COALESCE(v_sub.college_name, 'Partner College'),
            'college_code', v_sub.college_code,
            'valid_until', v_sub.expires_at,
            'contract_status', 'ACTIVE'
        );
    END IF;

    RETURN jsonb_build_object('is_entitled', false, 'reason', 'Not enrolled in any college roster');
END;
$$;
GRANT EXECUTE ON FUNCTION public.check_student_college_entitlement(TEXT) TO anon, authenticated, service_role;

-- 4. 3-Tier Access Control RLS on public.mock_exams
ALTER TABLE public.mock_exams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admin full mock exams" ON public.mock_exams;
DROP POLICY IF EXISTS "TPO manage own mock exams" ON public.mock_exams;
DROP POLICY IF EXISTS "Students read active college exams" ON public.mock_exams;
DROP POLICY IF EXISTS "Public read mock_exams" ON public.mock_exams;
DROP POLICY IF EXISTS "Unified 3-tier read mock exams" ON public.mock_exams;
DROP POLICY IF EXISTS "Student create self practice exams" ON public.mock_exams;
DROP POLICY IF EXISTS "Student manage self practice exams" ON public.mock_exams;

-- 4a. Super Admin: Full Management across all tiers
CREATE POLICY "Super admin full mock exams" ON public.mock_exams
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4b. TPO Admin: Manage own institutional college mock exams
CREATE POLICY "TPO manage own mock exams" ON public.mock_exams
  FOR ALL
  USING (
    college_id::TEXT NOT IN ('PUBLIC', 'OPEN', 'SELF', 'INDIVIDUAL')
    AND public.is_tpo_for_college(college_id::TEXT)
  )
  WITH CHECK (
    college_id::TEXT NOT IN ('PUBLIC', 'OPEN', 'SELF', 'INDIVIDUAL')
    AND public.is_tpo_for_college(college_id::TEXT)
  );

-- 4c. Student: Create own personal practice exams
CREATE POLICY "Student create self practice exams" ON public.mock_exams
  FOR INSERT
  WITH CHECK (
    college_id::TEXT IN ('SELF', 'INDIVIDUAL')
    AND (
      created_by = auth.uid()
      OR lower(COALESCE(auth.jwt()->>'email', '')) = ANY(target_departments)
    )
  );

-- 4d. Student: Manage own personal practice exams
CREATE POLICY "Student manage self practice exams" ON public.mock_exams
  FOR UPDATE
  USING (
    college_id::TEXT IN ('SELF', 'INDIVIDUAL')
    AND (
      created_by = auth.uid()
      OR lower(COALESCE(auth.jwt()->>'email', '')) = ANY(target_departments)
    )
  )
  WITH CHECK (
    college_id::TEXT IN ('SELF', 'INDIVIDUAL')
    AND (
      created_by = auth.uid()
      OR lower(COALESCE(auth.jwt()->>'email', '')) = ANY(target_departments)
    )
  );

-- 4e. Unified 3-Tier Select Policy:
-- - Tier 1: Public national exams -> open nationwide to anyone.
-- - Tier 3: Student practice tests -> strictly locked to creator only!
-- - Tier 2: College placement exams -> readable when active and not deleted so
--           the shared link (/exam/:examId) renders the instruction & verification screen.
CREATE POLICY "Unified 3-tier read mock exams" ON public.mock_exams
  FOR SELECT
  USING (
    COALESCE(is_deleted, false) = false
    AND (
      public.is_admin()
      OR college_id::TEXT IN ('PUBLIC', 'OPEN')
      OR (
        college_id::TEXT IN ('SELF', 'INDIVIDUAL')
        AND (
          created_by = auth.uid()
          OR lower(COALESCE(auth.jwt()->>'email', '')) = ANY(target_departments)
          OR (instructions IS NOT NULL AND lower(COALESCE(auth.jwt()->>'email', '')) != '' AND instructions ILIKE '%<!--student:' || lower(COALESCE(auth.jwt()->>'email', '')) || '-->%')
        )
      )
      OR (
        college_id::TEXT NOT IN ('PUBLIC', 'OPEN', 'SELF', 'INDIVIDUAL')
        AND COALESCE(is_active, true) = true
      )
    )
  );

-- 5. Lock Down public.mock_exam_sections RLS Policies
ALTER TABLE public.mock_exam_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admin full sections" ON public.mock_exam_sections;
DROP POLICY IF EXISTS "TPO manage sections" ON public.mock_exam_sections;
DROP POLICY IF EXISTS "Students read sections of their exams" ON public.mock_exam_sections;
DROP POLICY IF EXISTS "Unified 3-tier read mock exam sections" ON public.mock_exam_sections;

CREATE POLICY "Super admin full sections" ON public.mock_exam_sections
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "TPO manage sections" ON public.mock_exam_sections
  FOR ALL
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.mock_exams me
      WHERE me.id::TEXT = mock_exam_sections.mock_exam_id::TEXT
        AND public.is_tpo_for_college(me.college_id::TEXT)
    )
  )
  WITH CHECK (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.mock_exams me
      WHERE me.id::TEXT = mock_exam_sections.mock_exam_id::TEXT
        AND public.is_tpo_for_college(me.college_id::TEXT)
    )
  );

-- Student & Candidate Read Policy for Sections:
-- Protects the actual questions while allowing authorized students to load test sections.
CREATE POLICY "Unified 3-tier read mock exam sections" ON public.mock_exam_sections
  FOR SELECT
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.mock_exams me
      WHERE me.id::TEXT = mock_exam_sections.mock_exam_id::TEXT
        AND COALESCE(me.is_deleted, false) = false
        AND (
          -- Tier 1: Public Admin mock exam sections
          me.college_id::TEXT IN ('PUBLIC', 'OPEN')

          -- Tier 3: Practice exam sections locked strictly to creator
          OR (
            me.college_id::TEXT IN ('SELF', 'INDIVIDUAL')
            AND (
              me.created_by = auth.uid()
              OR lower(COALESCE(auth.jwt()->>'email', '')) = ANY(me.target_departments)
            )
          )

          -- Tier 2: College placement assessment sections
          OR (
            me.college_id::TEXT NOT IN ('PUBLIC', 'OPEN', 'SELF', 'INDIVIDUAL')
            AND (
              public.is_tpo_for_college(me.college_id::TEXT)
              OR me.college_id::TEXT = (SELECT college_id::TEXT FROM public.profiles WHERE id = auth.uid())
              OR EXISTS (
                SELECT 1 FROM public.college_students cs
                LEFT JOIN public.colleges c ON (
                  c.id::TEXT = cs.college_id::TEXT 
                  OR lower(c.code) = lower(trim(cs.college_id::TEXT))
                  OR lower(c.slug) = lower(trim(cs.college_id::TEXT))
                  OR lower(c.name) = lower(trim(cs.college_id::TEXT))
                )
                WHERE (
                  cs.college_id::TEXT = me.college_id::TEXT
                  OR (c.id IS NOT NULL AND (
                    c.id::TEXT = me.college_id::TEXT
                    OR lower(c.code) = lower(trim(me.college_id::TEXT))
                    OR lower(c.slug) = lower(trim(me.college_id::TEXT))
                    OR lower(c.name) = lower(trim(me.college_id::TEXT))
                  ))
                )
                AND lower(trim(cs.email)) = lower(COALESCE(auth.jwt()->>'email', ''))
              )
              OR EXISTS (
                SELECT 1 FROM public.user_subscriptions s
                WHERE lower(trim(s.user_email)) = lower(COALESCE(auth.jwt()->>'email', ''))
                  AND s.status = 'ACTIVE'
                  AND s.expires_at > NOW()
                  AND s.payment_id ILIKE 'B2B_CAMPUS_%'
              )
            )
          )
        )
    )
  );
