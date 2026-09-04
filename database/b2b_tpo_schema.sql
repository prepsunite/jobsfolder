-- ====================================================================
-- PrepUnite B2B Institutional Schema: Colleges, TPO Admins & Mock Exams
-- Migration v4: Multi-tenant College CRT Integration & Online Testing Platform
-- ====================================================================

-- 0. Ensure profiles table has institutional college reference columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS college_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_tpo_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS roll_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS batch_year INTEGER;

-- 1. Colleges Master Table
CREATE TABLE IF NOT EXISTS public.colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. "CBIT", "GRIET", "SRM"
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    contract_status VARCHAR(50) DEFAULT 'ACTIVE' NOT NULL, -- 'ACTIVE', 'PILOT', 'EXPIRED'
    max_licenses INT DEFAULT 1000 NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 year') NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_colleges_slug ON public.colleges(slug);
CREATE INDEX IF NOT EXISTS idx_colleges_code ON public.colleges(code);

-- 2. College Batches Table
CREATE TABLE IF NOT EXISTS public.college_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL, -- e.g. "Batch 2026 - Final Year CRT"
    passout_year INT NOT NULL,  -- 2026
    departments TEXT[] DEFAULT '{"CSE","IT","ECE","EEE","MECH","CIVIL"}'::TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_college_batches_cid ON public.college_batches(college_id);

-- 3. Dedicated TPO Authorizations Table (Pre-authorization by Email)
CREATE TABLE IF NOT EXISTS public.tpo_authorizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE NOT NULL,
    email VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE' NOT NULL CHECK (status IN ('ACTIVE', 'SUSPENDED', 'REVOKED')),
    max_licenses INT DEFAULT 1000 NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT uq_tpo_college_email UNIQUE (college_id, email)
);

CREATE INDEX IF NOT EXISTS idx_tpo_auth_email ON public.tpo_authorizations(email);
CREATE INDEX IF NOT EXISTS idx_tpo_auth_college ON public.tpo_authorizations(college_id);

-- 4. College Enrolled Students Table
CREATE TABLE IF NOT EXISTS public.college_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE NOT NULL,
    batch_id UUID REFERENCES public.college_batches(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    roll_number VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    batch_year INT NOT NULL,
    status VARCHAR(50) DEFAULT 'ENROLLED' NOT NULL CHECK (status IN ('ENROLLED', 'ALUMNI', 'REVOKED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_college_roll UNIQUE (college_id, roll_number),
    CONSTRAINT uq_college_email UNIQUE (college_id, email)
);

CREATE INDEX IF NOT EXISTS idx_college_students_cid ON public.college_students(college_id);
CREATE INDEX IF NOT EXISTS idx_college_students_email ON public.college_students(email);
CREATE INDEX IF NOT EXISTS idx_college_students_roll ON public.college_students(roll_number);

-- 5. Helper function: Is current user a PrepUnite Super Admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND (
        role = 'admin'
        OR email IN (
          'venkatmukala9@gmail.com',
          'venkat.mukala9@gmail.com',
          'prepsunite@gmail.com'
        )
      )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Is user a TPO admin for a specific college?
CREATE OR REPLACE FUNCTION public.is_tpo_for_college(p_college_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.tpo_authorizations ta
    JOIN public.profiles p ON lower(p.email) = lower(ta.email)
    WHERE p.id = auth.uid()
      AND ta.college_id = p_college_id
      AND ta.status = 'ACTIVE'
  ) OR public.is_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Is current user ANY TPO admin?
CREATE OR REPLACE FUNCTION public.is_any_tpo()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.tpo_authorizations ta
    JOIN public.profiles p ON lower(p.email) = lower(ta.email)
    WHERE p.id = auth.uid()
      AND ta.status = 'ACTIVE'
  ) OR public.is_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Mock Exams Table
CREATE TABLE IF NOT EXISTS public.mock_exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    target_company VARCHAR(100) DEFAULT 'General Aptitude' NOT NULL,
    description TEXT,
    instructions TEXT,
    duration_minutes INT DEFAULT 90 NOT NULL,
    total_marks INT DEFAULT 100 NOT NULL,
    passing_percentage INT DEFAULT 40 NOT NULL,
    
    -- Schedule window
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    
    -- Anti-Cheat Settings
    enable_tab_switch_detection BOOLEAN DEFAULT TRUE NOT NULL,
    max_tab_switches_allowed INT DEFAULT 3 NOT NULL,
    enable_fullscreen_lock BOOLEAN DEFAULT TRUE NOT NULL,
    shuffle_questions BOOLEAN DEFAULT TRUE NOT NULL,
    shuffle_options BOOLEAN DEFAULT TRUE NOT NULL,
    show_results_immediately BOOLEAN DEFAULT TRUE NOT NULL,
    
    -- Target filter (empty array = open to all students of this college)
    target_departments TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    target_batch_year INT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_mock_exams_college ON public.mock_exams(college_id, is_deleted);
CREATE INDEX IF NOT EXISTS idx_mock_exams_schedule ON public.mock_exams(start_time, end_time);

-- 5. Mock Exam Sections Table
CREATE TABLE IF NOT EXISTS public.mock_exam_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mock_exam_id UUID REFERENCES public.mock_exams(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(150) NOT NULL, -- e.g. "Numerical Ability", "Verbal", "Reasoning", "Technical"
    section_order INT DEFAULT 1 NOT NULL,
    duration_minutes INT, -- Optional per-section countdown timer
    marks_per_correct DECIMAL(4, 2) DEFAULT 1.00 NOT NULL,
    negative_marking DECIMAL(4, 2) DEFAULT 0.00 NOT NULL,
    
    -- Selected question IDs pooled strictly from master `topic_questions`
    question_ids UUID[] DEFAULT '{}'::UUID[] NOT NULL,
    topic_ids TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_mock_exam_sections_exam ON public.mock_exam_sections(mock_exam_id);

-- 6. Student Exam Attempts Table
CREATE TABLE IF NOT EXISTS public.student_exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mock_exam_id UUID REFERENCES public.mock_exams(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE NOT NULL,
    
    status VARCHAR(50) DEFAULT 'IN_PROGRESS' NOT NULL, -- 'IN_PROGRESS', 'SUBMITTED', 'TERMINATED_MALPRACTICE', 'TIMED_OUT'
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE,
    time_spent_seconds INT DEFAULT 0 NOT NULL,
    
    -- Scoring
    total_score DECIMAL(6, 2) DEFAULT 0.00 NOT NULL,
    max_possible_score DECIMAL(6, 2) DEFAULT 100.00 NOT NULL,
    percentage DECIMAL(5, 2) DEFAULT 0.00 NOT NULL,
    passed BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Telemetry / Anti-Cheat
    tab_switch_count INT DEFAULT 0 NOT NULL,
    proctor_events JSONB DEFAULT '[]'::jsonb NOT NULL,
    
    -- Responses JSON Map: { [question_id]: { selected_option: number, is_correct: boolean, time_spent_sec: number, marked_review: boolean } }
    responses JSONB DEFAULT '{}'::jsonb NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(mock_exam_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam ON public.student_exam_attempts(mock_exam_id, status);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_student ON public.student_exam_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_college ON public.student_exam_attempts(college_id);

-- ====================================================================
-- 7. Row-Level Security (RLS) Policies
-- ====================================================================

ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_exam_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_exam_attempts ENABLE ROW LEVEL SECURITY;

-- Colleges RLS:
DROP POLICY IF EXISTS "Super admin full colleges" ON public.colleges;
CREATE POLICY "Super admin full colleges" ON public.colleges FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "View own college" ON public.colleges;
CREATE POLICY "View own college" ON public.colleges FOR SELECT
  USING (
    id = (SELECT college_id FROM public.profiles WHERE id = auth.uid())
    OR is_deleted = false
  );

-- College Batches RLS:
DROP POLICY IF EXISTS "Super admin full batches" ON public.college_batches;
CREATE POLICY "Super admin full batches" ON public.college_batches FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "TPO manage own college batches" ON public.college_batches;
CREATE POLICY "TPO manage own college batches" ON public.college_batches FOR ALL
  USING (public.is_tpo_for_college(college_id));

DROP POLICY IF EXISTS "Students view own college batches" ON public.college_batches;
CREATE POLICY "Students view own college batches" ON public.college_batches FOR SELECT
  USING (college_id = (SELECT college_id FROM public.profiles WHERE id = auth.uid()));

-- Mock Exams RLS:
DROP POLICY IF EXISTS "Super admin full mock exams" ON public.mock_exams;
CREATE POLICY "Super admin full mock exams" ON public.mock_exams FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "TPO manage own mock exams" ON public.mock_exams;
CREATE POLICY "TPO manage own mock exams" ON public.mock_exams FOR ALL
  USING (public.is_tpo_for_college(college_id))
  WITH CHECK (public.is_tpo_for_college(college_id));

DROP POLICY IF EXISTS "Students read active college exams" ON public.mock_exams;
CREATE POLICY "Students read active college exams" ON public.mock_exams FOR SELECT
  USING (
    is_deleted = false
    AND is_active = true
    AND college_id = (SELECT college_id FROM public.profiles WHERE id = auth.uid())
  );

-- Mock Exam Sections RLS:
DROP POLICY IF EXISTS "Super admin full sections" ON public.mock_exam_sections;
CREATE POLICY "Super admin full sections" ON public.mock_exam_sections FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "TPO manage sections" ON public.mock_exam_sections;
CREATE POLICY "TPO manage sections" ON public.mock_exam_sections FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.mock_exams me
      WHERE me.id = mock_exam_sections.mock_exam_id
        AND public.is_tpo_for_college(me.college_id)
    )
  );

DROP POLICY IF EXISTS "Students read sections of their exams" ON public.mock_exam_sections;
CREATE POLICY "Students read sections of their exams" ON public.mock_exam_sections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.mock_exams me
      WHERE me.id = mock_exam_sections.mock_exam_id
        AND me.is_deleted = false
        AND me.college_id = (SELECT college_id FROM public.profiles WHERE id = auth.uid())
    )
  );

-- Student Exam Attempts RLS:
DROP POLICY IF EXISTS "Super admin full attempts" ON public.student_exam_attempts;
CREATE POLICY "Super admin full attempts" ON public.student_exam_attempts FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "TPO view college attempts" ON public.student_exam_attempts;
CREATE POLICY "TPO view college attempts" ON public.student_exam_attempts FOR SELECT
  USING (public.is_tpo_for_college(college_id));

DROP POLICY IF EXISTS "Student read own attempt" ON public.student_exam_attempts;
CREATE POLICY "Student read own attempt" ON public.student_exam_attempts FOR SELECT
  USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Student insert own attempt" ON public.student_exam_attempts;
CREATE POLICY "Student insert own attempt" ON public.student_exam_attempts FOR INSERT
  WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Student update own in-progress attempt" ON public.student_exam_attempts;
CREATE POLICY "Student update own in-progress attempt" ON public.student_exam_attempts FOR UPDATE
  USING (student_id = auth.uid());

-- TPO Authorizations RLS:
ALTER TABLE public.tpo_authorizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admin full tpo_authorizations" ON public.tpo_authorizations;
CREATE POLICY "Super admin full tpo_authorizations" ON public.tpo_authorizations FOR ALL USING (public.is_admin() OR auth.role() = 'anon');

DROP POLICY IF EXISTS "TPO read own authorization" ON public.tpo_authorizations;
CREATE POLICY "TPO read own authorization" ON public.tpo_authorizations FOR SELECT
  USING (
    lower(email) = lower(auth.jwt()->>'email')
    OR user_id = auth.uid()
  );

-- College Students RLS:
ALTER TABLE public.college_students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admin full college_students" ON public.college_students;
CREATE POLICY "Super admin full college_students" ON public.college_students FOR ALL USING (public.is_admin() OR auth.role() = 'anon');

DROP POLICY IF EXISTS "TPO manage own college students" ON public.college_students;
CREATE POLICY "TPO manage own college students" ON public.college_students FOR ALL
  USING (public.is_tpo_for_college(college_id));

DROP POLICY IF EXISTS "Student view own enrollment" ON public.college_students;
CREATE POLICY "Student view own enrollment" ON public.college_students FOR SELECT
  USING (
    lower(email) = lower(auth.jwt()->>'email')
    OR user_id = auth.uid()
  );

-- ====================================================================
-- Institutional Subscription Provisioning for TPO Coordinators
-- ====================================================================

ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.user_subscriptions ALTER COLUMN payment_id TYPE VARCHAR(255);

DROP POLICY IF EXISTS "TPO coordinator manage college student subscriptions" ON public.user_subscriptions;
CREATE POLICY "TPO coordinator manage college student subscriptions"
  ON public.user_subscriptions FOR ALL
  USING (
    payment_id LIKE 'B2B_CAMPUS_%' AND (
      public.is_admin() OR
      EXISTS (
        SELECT 1 FROM public.tpo_authorizations ta
        WHERE lower(ta.email) = lower(auth.jwt()->>'email')
          AND ta.status = 'ACTIVE'
          AND public.user_subscriptions.payment_id LIKE 'B2B_CAMPUS_' || ta.college_id || '%'
      )
    )
  );

-- RPC Function for atomic, privileged campus student entitlement provisioning
CREATE OR REPLACE FUNCTION public.provision_campus_student_subscription(
  p_email TEXT,
  p_college_id TEXT,
  p_college_name TEXT,
  p_valid_until TIMESTAMPTZ
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
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

