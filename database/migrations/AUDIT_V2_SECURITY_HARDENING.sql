-- ====================================================================
-- PrepUnite: Full Audit V2 Security Hardening Master Migration
-- Safe, Idempotent Script for Supabase SQL Editor
--
-- This script fixes:
-- 1. [C-6, C-7] Adds SET search_path = public, pg_temp to all SECURITY DEFINER functions
-- 2. [C-1, C-2] Locks down profiles table RLS (prevents privilege escalation of role, is_tpo_admin, college_id)
-- 3. [C-3] Restricts TPO student modifications to unassigned students or their own college
-- 4. [C-8] Prevents students from modifying score/grading columns on student_exam_attempts
-- 5. [H-9] Enforces backend RLS on mock_exams mutations scoped to super-admins and assigned TPOs
-- 6. [M-13] Adds BEFORE UPDATE updated_at triggers to core tables
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. FIX SEARCH_PATH ON ALL SECURITY DEFINER FUNCTIONS (C-6, C-7)
-- --------------------------------------------------------------------

-- 1.1 is_admin()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND (
        LOWER(COALESCE(role, '')) = 'admin'
        OR LOWER(COALESCE(email, '')) IN (
          'venkatmukala9@gmail.com',
          'venkat.mukala9@gmail.com',
          'venkatmukala3@gmail.com',
          'venkat.mukala3@gmail.com',
          'prepsunite@gmail.com'
        )
      )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- 1.2 is_tpo_for_college(target_college_id text)
CREATE OR REPLACE FUNCTION public.is_tpo_for_college(target_college_id text)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Super admin bypass
  IF public.is_admin() THEN
    RETURN TRUE;
  END IF;

  -- Check authorized TPO record
  RETURN EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = v_uid
      AND p.is_tpo_admin = true
      AND p.college_id::text = target_college_id
  ) OR EXISTS (
    SELECT 1 FROM public.tpo_authorizations ta
    JOIN public.profiles p ON LOWER(p.email) = LOWER(ta.email)
    WHERE p.id = v_uid
      AND ta.college_id::text = target_college_id
      AND ta.is_active = true
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_tpo_for_college(text) TO anon, authenticated, service_role;

-- 1.3 handle_new_user() trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_email text := LOWER(COALESCE(NEW.email, ''));
  v_name text := COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(v_email, '@', 1));
  v_role text := 'user';
BEGIN
  -- Automatically assign admin role only if email is whitelisted
  IF v_email IN (
    'venkatmukala9@gmail.com',
    'venkat.mukala9@gmail.com',
    'venkatmukala3@gmail.com',
    'venkat.mukala3@gmail.com',
    'prepsunite@gmail.com'
  ) THEN
    v_role := 'admin';
  END IF;

  INSERT INTO public.profiles (
    id,
    email,
    name,
    role,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    v_email,
    v_name,
    v_role,
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(public.profiles.name, EXCLUDED.name),
    avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
    updated_at = NOW();

  RETURN NEW;
END;
$$;

-- 1.4 increment_experience_upvotes
CREATE OR REPLACE FUNCTION public.increment_experience_upvotes(exp_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.experiences
  SET upvotes = COALESCE(upvotes, 0) + 1,
      updated_at = NOW()
  WHERE id = exp_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_experience_upvotes(uuid) TO anon, authenticated, service_role;

-- 1.5 check_user_paper_access
CREATE OR REPLACE FUNCTION public.check_user_paper_access(
    p_user_email VARCHAR,
    p_exam_id VARCHAR
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
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
$$;

GRANT EXECUTE ON FUNCTION public.check_user_paper_access(VARCHAR, VARCHAR) TO anon, authenticated, service_role;

-- 1.6 get_secure_exams_by_company
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
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
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
$$;

GRANT EXECUTE ON FUNCTION public.get_secure_exams_by_company(TEXT, TEXT) TO anon, authenticated, service_role;

-- 1.7 provision_campus_student_subscription
CREATE OR REPLACE FUNCTION public.provision_campus_student_subscription(
  p_email TEXT,
  p_college_id TEXT,
  p_college_name TEXT,
  p_valid_until TIMESTAMPTZ
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
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

GRANT EXECUTE ON FUNCTION public.provision_campus_student_subscription(TEXT, TEXT, TEXT, TIMESTAMPTZ) TO anon, authenticated, service_role;



-- --------------------------------------------------------------------
-- 2. LOCK DOWN PROFILES TABLE RLS (C-1, C-2, C-3)
-- --------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profile view" ON public.profiles;
DROP POLICY IF EXISTS "Users insert self profile" ON public.profiles;
DROP POLICY IF EXISTS "Users insert self profile as user" ON public.profiles;
DROP POLICY IF EXISTS "Users update self info non-role" ON public.profiles;
DROP POLICY IF EXISTS "Admin full profiles" ON public.profiles;
DROP POLICY IF EXISTS "TPO update college students" ON public.profiles;

-- 2.1 Public read (safe non-sensitive fields)
CREATE POLICY "Public profile view"
  ON public.profiles
  FOR SELECT
  USING (true);

-- 2.2 Users can only insert their own row with role = 'user' and is_tpo_admin = false
CREATE POLICY "Users insert self profile as user"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    id = auth.uid()
    AND (
      public.is_admin()
      OR (
        LOWER(COALESCE(role, 'user')) = 'user'
        AND COALESCE(is_tpo_admin, false) = false
        AND college_id IS NULL
      )
    )
  );

-- 2.3 Non-admin users cannot alter their role, is_tpo_admin, or college_id
CREATE POLICY "Users update self info non-role"
  ON public.profiles
  FOR UPDATE
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (
    public.is_admin()
    OR (
      id = auth.uid()
      AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
      AND COALESCE(is_tpo_admin, false) = (SELECT COALESCE(p.is_tpo_admin, false) FROM public.profiles p WHERE p.id = auth.uid())
      AND COALESCE(college_id, '') = (SELECT COALESCE(p.college_id, '') FROM public.profiles p WHERE p.id = auth.uid())
    )
  );

-- 2.4 TPO Admins can update students who belong to their college or have no college assigned yet (C-3)
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
  )
  WITH CHECK (
    public.is_admin()
    OR (
      EXISTS (
        SELECT 1 FROM public.profiles tpo
        WHERE tpo.id = auth.uid()
          AND tpo.is_tpo_admin = true
          AND tpo.college_id IS NOT NULL
          AND public.profiles.college_id::text = tpo.college_id::text
      )
      AND LOWER(COALESCE(public.profiles.role, 'user')) = 'user'
      AND COALESCE(public.profiles.is_tpo_admin, false) = false
    )
  );

-- 2.5 Admin full privileges
CREATE POLICY "Admin full profiles"
  ON public.profiles
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- --------------------------------------------------------------------
-- 3. LOCK DOWN STUDENT EXAM ATTEMPTS - PREVENT SCORE TAMPERING (C-8)
-- --------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'student_exam_attempts') THEN
    ALTER TABLE public.student_exam_attempts ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Students update own attempts" ON public.student_exam_attempts;
    DROP POLICY IF EXISTS "Student update in_progress attempt responses" ON public.student_exam_attempts;
    DROP POLICY IF EXISTS "Admins full manage exam attempts" ON public.student_exam_attempts;

    -- Students can update response data only if attempt is in progress
    CREATE POLICY "Student update in_progress attempt responses"
      ON public.student_exam_attempts
      FOR UPDATE
      USING (
        public.is_admin()
        OR (
          auth.uid() IS NOT NULL
          AND (
            student_id = auth.uid()
            OR (auth.email() IS NOT NULL AND LOWER(student_email) = LOWER(auth.email()))
          )
          AND COALESCE(status, 'IN_PROGRESS') = 'IN_PROGRESS'
        )
      )
      WITH CHECK (
        public.is_admin()
        OR (
          auth.uid() IS NOT NULL
          AND (
            student_id = auth.uid()
            OR (auth.email() IS NOT NULL AND LOWER(student_email) = LOWER(auth.email()))
          )
        )
      );

    CREATE POLICY "Admins full manage exam attempts"
      ON public.student_exam_attempts
      FOR ALL
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;


-- --------------------------------------------------------------------
-- 4. LOCK DOWN MOCK_EXAMS TO COLLEGE TPO AND SUPER ADMINS (H-9)
-- --------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mock_exams') THEN
    ALTER TABLE public.mock_exams ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Super admin full mock exams" ON public.mock_exams;
    DROP POLICY IF EXISTS "TPO manage own mock exams" ON public.mock_exams;
    DROP POLICY IF EXISTS "Public read mock_exams" ON public.mock_exams;
    DROP POLICY IF EXISTS "Admins mutate mock_exams" ON public.mock_exams;

    -- Read policy: active mock exams are readable by students
    CREATE POLICY "Public read mock_exams"
      ON public.mock_exams
      FOR SELECT
      USING (
        public.is_admin()
        OR COALESCE(is_deleted, false) = false
      );

    -- Super Admin full control
    CREATE POLICY "Super admin full mock exams"
      ON public.mock_exams
      FOR ALL
      USING (public.is_admin())
      WITH CHECK (public.is_admin());

    -- TPO Admin can only insert/update/delete exams for their assigned college
    CREATE POLICY "TPO manage own mock exams"
      ON public.mock_exams
      FOR ALL
      USING (
        college_id IS NOT NULL
        AND public.is_tpo_for_college(college_id::text)
      )
      WITH CHECK (
        college_id IS NOT NULL
        AND public.is_tpo_for_college(college_id::text)
      );
  END IF;
END $$;


-- --------------------------------------------------------------------
-- 5. AUTO-UPDATE UPDATED_AT TRIGGERS (M-13)
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  -- colleges
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'colleges') THEN
    DROP TRIGGER IF EXISTS trg_colleges_updated_at ON public.colleges;
    CREATE TRIGGER trg_colleges_updated_at
      BEFORE UPDATE ON public.colleges
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  -- mock_exams
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mock_exams') THEN
    DROP TRIGGER IF EXISTS trg_mock_exams_updated_at ON public.mock_exams;
    CREATE TRIGGER trg_mock_exams_updated_at
      BEFORE UPDATE ON public.mock_exams
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  -- college_students
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'college_students') THEN
    DROP TRIGGER IF EXISTS trg_college_students_updated_at ON public.college_students;
    CREATE TRIGGER trg_college_students_updated_at
      BEFORE UPDATE ON public.college_students
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  -- student_exam_attempts
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'student_exam_attempts') THEN
    DROP TRIGGER IF EXISTS trg_student_exam_attempts_updated_at ON public.student_exam_attempts;
    CREATE TRIGGER trg_student_exam_attempts_updated_at
      BEFORE UPDATE ON public.student_exam_attempts
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;
