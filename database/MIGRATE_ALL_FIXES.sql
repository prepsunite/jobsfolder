-- ====================================================================
-- PrepUnite: Master Database Migration & Schema Fix Script
-- Safe, Idempotent, Zero Data-Loss Migration for Supabase SQL Editor
-- Resolves:
--   1. "operator does not exist: uuid = text" (Explicit ::TEXT type casts)
--   2. "column 'user_id' does not exist" (Alter existing tables before policies)
--   3. Missing tables: colleges, college_batches, mock_exams,
--      mock_exam_sections, student_exam_attempts, user_bookmarks
--   4. Missing columns on tpo_authorizations, college_students,
--      user_subscriptions, user_paper_purchases, admin_audit_logs
-- ====================================================================

-- --------------------------------------------------------------------
-- STEP 1: Enable Necessary Postgres Extensions
-- --------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------------------------------------------
-- STEP 2: Alter Existing Tables (Add Missing Columns FIRST)
-- --------------------------------------------------------------------

-- 2.1 Profiles Table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS college_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_tpo_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS roll_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS batch_year INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS consent_status VARCHAR(50) DEFAULT 'CONSENT_GRANTED';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS consent_accepted_at TIMESTAMPTZ DEFAULT NOW();

-- 2.2 TPO Authorizations Table (Create if not exists, then ensure all columns)
CREATE TABLE IF NOT EXISTS public.tpo_authorizations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    college_id TEXT NOT NULL,
    email VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE' NOT NULL,
    max_licenses INT DEFAULT 1500 NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.tpo_authorizations ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.tpo_authorizations ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.tpo_authorizations ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ACTIVE';
ALTER TABLE public.tpo_authorizations ADD COLUMN IF NOT EXISTS max_licenses INT DEFAULT 1500;
ALTER TABLE public.tpo_authorizations ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.tpo_authorizations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_tpo_auth_email ON public.tpo_authorizations(email);
CREATE INDEX IF NOT EXISTS idx_tpo_auth_college ON public.tpo_authorizations(college_id);

-- 2.3 College Students Table (Create if not exists, then ensure all columns)
CREATE TABLE IF NOT EXISTS public.college_students (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    college_id TEXT NOT NULL,
    batch_id TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    roll_number VARCHAR(100),
    department VARCHAR(100),
    batch_year INT,
    status VARCHAR(50) DEFAULT 'ACTIVE' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.college_students ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.college_students ADD COLUMN IF NOT EXISTS batch_id TEXT;
ALTER TABLE public.college_students ADD COLUMN IF NOT EXISTS roll_number VARCHAR(100);
ALTER TABLE public.college_students ADD COLUMN IF NOT EXISTS department VARCHAR(100);
ALTER TABLE public.college_students ADD COLUMN IF NOT EXISTS batch_year INT;
ALTER TABLE public.college_students ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ACTIVE';
ALTER TABLE public.college_students ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.college_students ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_college_students_cid ON public.college_students(college_id);
CREATE INDEX IF NOT EXISTS idx_college_students_email ON public.college_students(email);
CREATE INDEX IF NOT EXISTS idx_college_students_roll ON public.college_students(roll_number);

-- 2.4 User Subscriptions Table
ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2.5 User Paper Purchases Table
ALTER TABLE public.user_paper_purchases ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ACTIVE';

-- 2.6 Admin Audit Logs Table
ALTER TABLE public.admin_audit_logs ADD COLUMN IF NOT EXISTS target_resource VARCHAR(150);
ALTER TABLE public.admin_audit_logs ADD COLUMN IF NOT EXISTS target_table VARCHAR(150);
ALTER TABLE public.admin_audit_logs ADD COLUMN IF NOT EXISTS details JSONB;
ALTER TABLE public.admin_audit_logs ADD COLUMN IF NOT EXISTS ip_address VARCHAR(100);

-- 2.7 Colleges Defensive Alters
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS max_licenses INT DEFAULT 1500;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS contract_status VARCHAR(50) DEFAULT 'ACTIVE';
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS valid_until TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 year');
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

-- 2.8 Student Exam Attempts Defensive Alters
ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'IN_PROGRESS';
ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS time_spent_seconds INT DEFAULT 0;
ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS total_score DECIMAL(6, 2) DEFAULT 0.00;
ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS max_possible_score DECIMAL(6, 2) DEFAULT 100.00;
ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS percentage DECIMAL(5, 2) DEFAULT 0.00;
ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS passed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS tab_switch_count INT DEFAULT 0;
ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS proctor_events JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS responses JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS student_email VARCHAR(255);
ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.student_exam_attempts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- --------------------------------------------------------------------
-- STEP 3: Create Missing Master & Institutional Tables
-- --------------------------------------------------------------------

-- 3.1 Colleges Master Table
CREATE TABLE IF NOT EXISTS public.colleges (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    slug VARCHAR(100),
    logo_url TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    contract_status VARCHAR(50) DEFAULT 'ACTIVE' NOT NULL,
    max_licenses INT DEFAULT 1500 NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 year') NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_colleges_slug ON public.colleges(slug);
CREATE INDEX IF NOT EXISTS idx_colleges_code ON public.colleges(code);

-- 3.2 College Batches Table
CREATE TABLE IF NOT EXISTS public.college_batches (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    college_id TEXT NOT NULL,
    name VARCHAR(100) NOT NULL,
    passout_year INT NOT NULL,
    departments TEXT[] DEFAULT '{"CSE","IT","ECE","EEE","MECH","CIVIL"}'::TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_college_batches_cid ON public.college_batches(college_id);

-- 3.3 Mock Exams Table
CREATE TABLE IF NOT EXISTS public.mock_exams (
    id TEXT PRIMARY KEY DEFAULT ('exam-' || lower(substr(md5(random()::text), 1, 8))),
    college_id TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    target_company VARCHAR(100) DEFAULT 'General Aptitude' NOT NULL,
    description TEXT,
    instructions TEXT,
    duration_minutes INT DEFAULT 90 NOT NULL,
    total_marks INT DEFAULT 100 NOT NULL,
    passing_percentage INT DEFAULT 40 NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    enable_tab_switch_detection BOOLEAN DEFAULT TRUE NOT NULL,
    max_tab_switches_allowed INT DEFAULT 3 NOT NULL,
    enable_fullscreen_lock BOOLEAN DEFAULT TRUE NOT NULL,
    shuffle_questions BOOLEAN DEFAULT TRUE NOT NULL,
    shuffle_options BOOLEAN DEFAULT TRUE NOT NULL,
    show_results_immediately BOOLEAN DEFAULT TRUE NOT NULL,
    target_departments TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    target_batch_year INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_mock_exams_college ON public.mock_exams(college_id, is_deleted);
CREATE INDEX IF NOT EXISTS idx_mock_exams_schedule ON public.mock_exams(start_time, end_time);

-- 3.4 Mock Exam Sections Table
CREATE TABLE IF NOT EXISTS public.mock_exam_sections (
    id TEXT PRIMARY KEY DEFAULT ('sec-' || lower(substr(md5(random()::text), 1, 8))),
    mock_exam_id TEXT NOT NULL,
    name VARCHAR(150) NOT NULL,
    section_order INT DEFAULT 1 NOT NULL,
    duration_minutes INT,
    marks_per_correct DECIMAL(4, 2) DEFAULT 1.00 NOT NULL,
    negative_marking DECIMAL(4, 2) DEFAULT 0.00 NOT NULL,
    question_ids TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    topic_ids TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_mock_exam_sections_exam ON public.mock_exam_sections(mock_exam_id);

-- 3.5 Student Exam Attempts Table
CREATE TABLE IF NOT EXISTS public.student_exam_attempts (
    id TEXT PRIMARY KEY DEFAULT ('att-' || lower(substr(md5(random()::text), 1, 8))),
    mock_exam_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    college_id TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'IN_PROGRESS' NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE,
    time_spent_seconds INT DEFAULT 0 NOT NULL,
    total_score DECIMAL(6, 2) DEFAULT 0.00 NOT NULL,
    max_possible_score DECIMAL(6, 2) DEFAULT 100.00 NOT NULL,
    percentage DECIMAL(5, 2) DEFAULT 0.00 NOT NULL,
    passed BOOLEAN DEFAULT FALSE NOT NULL,
    tab_switch_count INT DEFAULT 0 NOT NULL,
    proctor_events JSONB DEFAULT '[]'::jsonb NOT NULL,
    responses JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam ON public.student_exam_attempts(mock_exam_id, status);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_student ON public.student_exam_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_college ON public.student_exam_attempts(college_id);

-- 3.6 User Bookmarks Table
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email VARCHAR(255) NOT NULL,
  item_type VARCHAR(50) NOT NULL,
  item_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT uq_user_item_bookmark UNIQUE (user_email, item_type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_user_bookmarks_lookup ON public.user_bookmarks(user_email, item_type);

-- --------------------------------------------------------------------
-- STEP 4: Helper Functions (SECURITY DEFINER with explicit type safety)
-- --------------------------------------------------------------------

-- 4.1 Admin Check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND (
        LOWER(role) = 'admin'
        OR LOWER(email) IN (
          'venkatmukala9@gmail.com',
          'venkat.mukala9@gmail.com',
          'prepsunite@gmail.com',
          'veen1kat@gmail.com'
        )
      )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4.2 TPO for Specific College Check (Explicit TEXT comparison)
CREATE OR REPLACE FUNCTION public.is_tpo_for_college(p_college_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.tpo_authorizations ta
    JOIN public.profiles p ON lower(p.email) = lower(ta.email)
    WHERE p.id = auth.uid()
      AND ta.college_id::TEXT = p_college_id::TEXT
      AND ta.status = 'ACTIVE'
  ) OR public.is_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4.3 ANY TPO Check
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

-- 4.4 Campus Student Subscription Provisioning RPC
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

-- --------------------------------------------------------------------
-- STEP 5: Enable Row-Level Security (RLS) on All Tables
-- --------------------------------------------------------------------
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tpo_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_exam_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- STEP 6: Row-Level Security Policies (With Explicit Type Casts)
-- --------------------------------------------------------------------

-- 6.1 Colleges RLS
DROP POLICY IF EXISTS "Super admin full colleges" ON public.colleges;
CREATE POLICY "Super admin full colleges" ON public.colleges FOR ALL 
  USING (public.is_admin() OR auth.role() = 'anon')
  WITH CHECK (public.is_admin() OR auth.role() = 'anon');

DROP POLICY IF EXISTS "View own college" ON public.colleges;
CREATE POLICY "View own college" ON public.colleges FOR SELECT
  USING (
    public.is_admin() OR
    id::TEXT = (SELECT college_id::TEXT FROM public.profiles WHERE id = auth.uid())
    OR is_deleted = false
  );

-- 6.2 College Batches RLS
DROP POLICY IF EXISTS "Super admin full batches" ON public.college_batches;
CREATE POLICY "Super admin full batches" ON public.college_batches FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "TPO manage own college batches" ON public.college_batches;
CREATE POLICY "TPO manage own college batches" ON public.college_batches FOR ALL
  USING (public.is_tpo_for_college(college_id::TEXT));

DROP POLICY IF EXISTS "Students view own college batches" ON public.college_batches;
CREATE POLICY "Students view own college batches" ON public.college_batches FOR SELECT
  USING (
    public.is_admin() OR
    college_id::TEXT = (SELECT college_id::TEXT FROM public.profiles WHERE id = auth.uid())
  );

-- 6.3 TPO Authorizations RLS
DROP POLICY IF EXISTS "Super admin full tpo_authorizations" ON public.tpo_authorizations;
CREATE POLICY "Super admin full tpo_authorizations" ON public.tpo_authorizations FOR ALL 
  USING (public.is_admin() OR auth.role() = 'anon');

DROP POLICY IF EXISTS "TPO read own authorization" ON public.tpo_authorizations;
CREATE POLICY "TPO read own authorization" ON public.tpo_authorizations FOR SELECT
  USING (
    lower(email) = lower(auth.jwt()->>'email')
    OR (user_id IS NOT NULL AND user_id = auth.uid())
  );

-- 6.4 College Students RLS
DROP POLICY IF EXISTS "Super admin full college_students" ON public.college_students;
CREATE POLICY "Super admin full college_students" ON public.college_students FOR ALL 
  USING (public.is_admin() OR auth.role() = 'anon');

DROP POLICY IF EXISTS "TPO manage own college students" ON public.college_students;
CREATE POLICY "TPO manage own college students" ON public.college_students FOR ALL
  USING (public.is_tpo_for_college(college_id::TEXT));

DROP POLICY IF EXISTS "Student view own enrollment" ON public.college_students;
CREATE POLICY "Student view own enrollment" ON public.college_students FOR SELECT
  USING (
    lower(email) = lower(auth.jwt()->>'email')
    OR (user_id IS NOT NULL AND user_id = auth.uid())
  );

-- 6.5 Mock Exams RLS
DROP POLICY IF EXISTS "Super admin full mock exams" ON public.mock_exams;
CREATE POLICY "Super admin full mock exams" ON public.mock_exams FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "TPO manage own mock exams" ON public.mock_exams;
CREATE POLICY "TPO manage own mock exams" ON public.mock_exams FOR ALL
  USING (public.is_tpo_for_college(college_id::TEXT))
  WITH CHECK (public.is_tpo_for_college(college_id::TEXT));

DROP POLICY IF EXISTS "Students read active college exams" ON public.mock_exams;
CREATE POLICY "Students read active college exams" ON public.mock_exams FOR SELECT
  USING (
    is_deleted = false
    AND is_active = true
    AND (
      public.is_admin()
      OR college_id::TEXT = (SELECT college_id::TEXT FROM public.profiles WHERE id = auth.uid())
      OR college_id::TEXT IN (
        SELECT college_id::TEXT FROM public.college_students WHERE lower(email) = lower(auth.jwt()->>'email')
      )
    )
  );

-- 6.6 Mock Exam Sections RLS
DROP POLICY IF EXISTS "Super admin full sections" ON public.mock_exam_sections;
CREATE POLICY "Super admin full sections" ON public.mock_exam_sections FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "TPO manage sections" ON public.mock_exam_sections;
CREATE POLICY "TPO manage sections" ON public.mock_exam_sections FOR ALL
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.mock_exams me
      WHERE me.id::TEXT = mock_exam_sections.mock_exam_id::TEXT
        AND public.is_tpo_for_college(me.college_id::TEXT)
    )
  );

DROP POLICY IF EXISTS "Students read sections of their exams" ON public.mock_exam_sections;
CREATE POLICY "Students read sections of their exams" ON public.mock_exam_sections FOR SELECT
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.mock_exams me
      WHERE me.id::TEXT = mock_exam_sections.mock_exam_id::TEXT
        AND (
          me.college_id::TEXT = (SELECT college_id::TEXT FROM public.profiles WHERE id = auth.uid())
          OR me.college_id::TEXT IN (
            SELECT college_id::TEXT FROM public.college_students WHERE lower(email) = lower(auth.jwt()->>'email')
          )
        )
        AND me.is_active = true
        AND me.is_deleted = false
    )
  );

-- 6.7 Student Exam Attempts RLS
DROP POLICY IF EXISTS "Super admin full attempts" ON public.student_exam_attempts;
CREATE POLICY "Super admin full attempts" ON public.student_exam_attempts FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Student manage own attempts" ON public.student_exam_attempts;
CREATE POLICY "Student manage own attempts" ON public.student_exam_attempts FOR ALL
  USING (
    student_id::TEXT = auth.uid()::TEXT
    OR student_id::TEXT = lower(auth.jwt()->>'email')
  );

DROP POLICY IF EXISTS "TPO view college attempts" ON public.student_exam_attempts;
CREATE POLICY "TPO view college attempts" ON public.student_exam_attempts FOR SELECT
  USING (public.is_tpo_for_college(college_id::TEXT));

-- 6.8 User Subscriptions TPO Policy
DROP POLICY IF EXISTS "TPO coordinator manage college student subscriptions" ON public.user_subscriptions;
CREATE POLICY "TPO coordinator manage college student subscriptions"
  ON public.user_subscriptions FOR ALL
  USING (
    payment_id LIKE 'B2B_CAMPUS_%' AND (
      public.is_admin() OR
      auth.role() = 'anon' OR
      EXISTS (
        SELECT 1 FROM public.tpo_authorizations ta
        WHERE lower(ta.email) = lower(auth.jwt()->>'email')
          AND ta.status = 'ACTIVE'
          AND public.user_subscriptions.payment_id LIKE 'B2B_CAMPUS_' || ta.college_id::TEXT || '%'
      )
    )
  )
  WITH CHECK (
    payment_id LIKE 'B2B_CAMPUS_%' AND (
      public.is_admin() OR
      auth.role() = 'anon' OR
      EXISTS (
        SELECT 1 FROM public.tpo_authorizations ta
        WHERE lower(ta.email) = lower(auth.jwt()->>'email')
          AND ta.status = 'ACTIVE'
          AND public.user_subscriptions.payment_id LIKE 'B2B_CAMPUS_' || ta.college_id::TEXT || '%'
      )
    )
  );

-- 6.9 User Bookmarks RLS
DROP POLICY IF EXISTS "Users read own bookmarks" ON public.user_bookmarks;
CREATE POLICY "Users read own bookmarks" ON public.user_bookmarks FOR SELECT
  USING (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users insert own bookmarks" ON public.user_bookmarks;
CREATE POLICY "Users insert own bookmarks" ON public.user_bookmarks FOR INSERT
  WITH CHECK (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users delete own bookmarks" ON public.user_bookmarks;
CREATE POLICY "Users delete own bookmarks" ON public.user_bookmarks FOR DELETE
  USING (
    user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    OR user_id = auth.uid()
  );

-- 6.10 Multi-device Exam Sync Policy on contact_messages
DROP POLICY IF EXISTS "Public select B2B exam messages" ON public.contact_messages;
CREATE POLICY "Public select B2B exam messages"
  ON public.contact_messages FOR SELECT
  USING (subject LIKE 'B2B_EXAM:%');

-- --------------------------------------------------------------------
-- STEP 8: Hard-Locked Institutional Security & Anti-Cheat RPC Engine
-- --------------------------------------------------------------------

-- 8.1 Database-Level Seat Cap Enforcement Trigger
CREATE OR REPLACE FUNCTION public.check_college_seat_cap()
RETURNS TRIGGER AS $$
DECLARE
    current_count INT;
    max_allowed INT := 1500;
BEGIN
    SELECT COUNT(*) INTO current_count 
    FROM public.college_students 
    WHERE college_id::TEXT = NEW.college_id::TEXT 
      AND status = 'ACTIVE';

    SELECT COALESCE(max_licenses, 1500) INTO max_allowed
    FROM public.colleges
    WHERE id::TEXT = NEW.college_id::TEXT;

    max_allowed := COALESCE(max_allowed, 1500);

    IF current_count >= max_allowed THEN
        RAISE EXCEPTION 'Seat quota exceeded! Maximum allowed seats for this college is %', max_allowed;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_enforce_college_seat_cap ON public.college_students;
CREATE TRIGGER trg_enforce_college_seat_cap
BEFORE INSERT ON public.college_students
FOR EACH ROW
EXECUTE FUNCTION public.check_college_seat_cap();

-- 8.2 Live Student Institutional College Entitlement Check RPC
CREATE OR REPLACE FUNCTION public.check_student_college_entitlement(
    p_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_clean_email TEXT;
    v_student RECORD;
BEGIN
    IF p_email IS NULL OR p_email = '' THEN
        RETURN jsonb_build_object('is_entitled', false, 'reason', 'No email provided');
    END IF;

    v_clean_email := lower(trim(p_email));

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
    JOIN public.colleges c ON c.id::TEXT = cs.college_id::TEXT
    WHERE lower(trim(cs.email)) = v_clean_email
      AND cs.status = 'ACTIVE'
      AND c.is_deleted = false
    ORDER BY cs.created_at DESC
    LIMIT 1;

    IF v_student IS NULL THEN
        RETURN jsonb_build_object('is_entitled', false, 'reason', 'Not enrolled in any college roster');
    END IF;

    IF v_student.contract_status NOT IN ('ACTIVE', 'PILOT') OR (v_student.valid_until IS NOT NULL AND v_student.valid_until <= NOW()) THEN
        RETURN jsonb_build_object(
            'is_entitled', false,
            'is_expired', true,
            'college_id', v_student.college_id,
            'college_name', v_student.college_name,
            'reason', 'Institutional license expired or suspended'
        );
    END IF;

    RETURN jsonb_build_object(
        'is_entitled', true,
        'is_expired', false,
        'college_id', v_student.college_id,
        'college_name', v_student.college_name,
        'college_code', v_student.college_code,
        'roll_number', v_student.roll_number,
        'department', v_student.department,
        'batch_year', v_student.batch_year,
        'valid_until', v_student.valid_until
    );
END;
$$;

-- 8.3 Server-Side Mock Exam Grading RPC (Prevents DevTools Score Manipulation & Answer Leakage)
CREATE OR REPLACE FUNCTION public.submit_and_grade_mock_attempt(
    p_attempt_id TEXT,
    p_responses JSONB,
    p_time_spent_seconds INT,
    p_proctor_events JSONB DEFAULT '[]'::jsonb,
    p_tab_switch_count INT DEFAULT 0,
    p_status_override TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_attempt RECORD;
    v_exam RECORD;
    v_section RECORD;
    v_q_id TEXT;
    v_correct_ans INT;
    v_student_selected INT;
    v_is_correct BOOLEAN;
    v_marks_per_q NUMERIC;
    v_neg_mark NUMERIC;
    v_total_score NUMERIC := 0;
    v_max_possible_score NUMERIC := 0;
    v_percentage NUMERIC := 0;
    v_passed BOOLEAN := false;
    v_status TEXT;
    v_graded_responses JSONB := '{}'::jsonb;
    v_item_resp JSONB;
    v_marked_review BOOLEAN;
    v_time_spent INT;
    v_raw_correct TEXT;
BEGIN
    SELECT * INTO v_attempt 
    FROM public.student_exam_attempts 
    WHERE id::TEXT = p_attempt_id::TEXT;

    IF v_attempt IS NULL THEN
        INSERT INTO public.student_exam_attempts (
            id,
            mock_exam_id,
            student_id,
            college_id,
            status,
            started_at
        ) VALUES (
            p_attempt_id,
            'unknown-exam',
            COALESCE(auth.uid()::TEXT, 'anonymous'),
            'unknown-college',
            'IN_PROGRESS',
            NOW()
        );
        SELECT * INTO v_attempt FROM public.student_exam_attempts WHERE id::TEXT = p_attempt_id::TEXT;
    END IF;

    SELECT * INTO v_exam 
    FROM public.mock_exams 
    WHERE id::TEXT = v_attempt.mock_exam_id::TEXT;

    IF p_status_override IS NOT NULL AND p_status_override != '' THEN
        v_status := p_status_override;
    ELSIF v_exam IS NOT NULL AND v_exam.enable_tab_switch_detection AND p_tab_switch_count > v_exam.max_tab_switches_allowed THEN
        v_status := 'TERMINATED_MALPRACTICE';
    ELSE
        v_status := 'SUBMITTED';
    END IF;

    IF v_exam IS NOT NULL THEN
        FOR v_section IN 
            SELECT * FROM public.mock_exam_sections 
            WHERE mock_exam_id::TEXT = v_exam.id::TEXT
            ORDER BY section_order ASC
        LOOP
            v_marks_per_q := COALESCE(v_section.marks_per_correct, 1.00);
            v_neg_mark := COALESCE(v_section.negative_marking, 0.00);

            IF v_section.question_ids IS NOT NULL THEN
                FOREACH v_q_id IN ARRAY v_section.question_ids
                LOOP
                    v_max_possible_score := v_max_possible_score + v_marks_per_q;

                    SELECT correct_answer INTO v_raw_correct
                    FROM public.topic_questions 
                    WHERE id::TEXT = v_q_id;

                    IF v_raw_correct IS NOT NULL THEN
                        IF v_raw_correct ~ '^\d+$' THEN
                            v_correct_ans := v_raw_correct::INT;
                        ELSIF upper(v_raw_correct) = 'A' THEN
                            v_correct_ans := 0;
                        ELSIF upper(v_raw_correct) = 'B' THEN
                            v_correct_ans := 1;
                        ELSIF upper(v_raw_correct) = 'C' THEN
                            v_correct_ans := 2;
                        ELSIF upper(v_raw_correct) = 'D' THEN
                            v_correct_ans := 3;
                        ELSE
                            v_correct_ans := -1;
                        END IF;
                    ELSE
                        v_correct_ans := -1;
                    END IF;

                    v_item_resp := p_responses -> v_q_id;
                    v_student_selected := NULL;
                    v_marked_review := false;
                    v_time_spent := 0;

                    IF v_item_resp IS NOT NULL THEN
                        IF v_item_resp ? 'selected_option' AND v_item_resp ->> 'selected_option' IS NOT NULL THEN
                            v_student_selected := (v_item_resp ->> 'selected_option')::INT;
                        END IF;
                        v_marked_review := COALESCE((v_item_resp ->> 'marked_review')::BOOLEAN, false);
                        v_time_spent := COALESCE((v_item_resp ->> 'time_spent_sec')::INT, 0);
                    END IF;

                    IF v_student_selected IS NOT NULL THEN
                        IF v_correct_ans >= 0 AND v_student_selected = v_correct_ans THEN
                            v_is_correct := true;
                            v_total_score := v_total_score + v_marks_per_q;
                        ELSE
                            v_is_correct := false;
                            v_total_score := v_total_score - v_neg_mark;
                        END IF;
                    ELSE
                        v_is_correct := false;
                    END IF;

                    v_graded_responses := jsonb_set(
                        v_graded_responses,
                        ARRAY[v_q_id],
                        jsonb_build_object(
                            'selected_option', v_student_selected,
                            'is_correct', v_is_correct,
                            'marked_review', v_marked_review,
                            'time_spent_sec', v_time_spent
                        )
                    );
                END LOOP;
            END IF;
        END LOOP;
    END IF;

    IF v_max_possible_score <= 0 THEN
        v_max_possible_score := COALESCE(v_exam.total_marks, 100);
    END IF;

    IF v_total_score < 0 THEN
        v_total_score := 0;
    END IF;

    v_percentage := ROUND(((v_total_score / v_max_possible_score) * 100)::NUMERIC, 2);
    v_passed := v_percentage >= COALESCE(v_exam.passing_percentage, 40);

    UPDATE public.student_exam_attempts
    SET
        status = v_status,
        submitted_at = NOW(),
        time_spent_seconds = p_time_spent_seconds,
        total_score = v_total_score,
        max_possible_score = v_max_possible_score,
        percentage = v_percentage,
        passed = v_passed,
        tab_switch_count = p_tab_switch_count,
        proctor_events = p_proctor_events,
        responses = v_graded_responses,
        updated_at = NOW()
    WHERE id::TEXT = p_attempt_id::TEXT;

    RETURN jsonb_build_object(
        'id', p_attempt_id,
        'status', v_status,
        'total_score', v_total_score,
        'max_possible_score', v_max_possible_score,
        'percentage', v_percentage,
        'passed', v_passed,
        'responses', v_graded_responses
    );
END;
$$;

-- 8.4 Unified Paper & Campus Pass Entitlement Check RPC
CREATE OR REPLACE FUNCTION public.check_user_paper_access(
    p_user_email VARCHAR,
    p_exam_id VARCHAR
) RETURNS BOOLEAN AS $$
DECLARE
    v_has_pass BOOLEAN := FALSE;
    v_has_paper BOOLEAN := FALSE;
    v_clean_email VARCHAR;
    v_college_entitlement JSONB;
BEGIN
    IF p_user_email IS NULL OR p_user_email = '' THEN
        RETURN FALSE;
    END IF;

    v_clean_email := LOWER(TRIM(p_user_email));

    -- 1. Check Super Admin Whitelist
    IF v_clean_email IN (
        'venkatmukala9@gmail.com',
        'venkat.mukala9@gmail.com',
        'venkatmukala3@gmail.com',
        'venkat.mukala3@gmail.com',
        'prepsunite@gmail.com'
    ) THEN
        RETURN TRUE;
    END IF;

    -- 2. Check institutional college pass entitlement
    SELECT public.check_student_college_entitlement(v_clean_email) INTO v_college_entitlement;
    IF v_college_entitlement IS NOT NULL AND (v_college_entitlement->>'is_entitled')::boolean = true THEN
        RETURN TRUE;
    END IF;

    -- 3. Check consumer active subscription (Monthly / Quarterly / Yearly)
    SELECT EXISTS (
        SELECT 1 FROM public.user_subscriptions
        WHERE LOWER(user_email) = v_clean_email
          AND status = 'ACTIVE'
          AND expires_at > NOW()
    ) INTO v_has_pass;

    IF v_has_pass THEN
        RETURN TRUE;
    END IF;

    -- 4. Check individual paper purchase
    SELECT EXISTS (
        SELECT 1 FROM public.user_paper_purchases
        WHERE LOWER(user_email) = v_clean_email
          AND exam_id = p_exam_id
          AND expires_at > NOW()
    ) INTO v_has_paper;

    RETURN v_has_paper;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --------------------------------------------------------------------
-- STEP 9: Grant Necessary Permissions to Authenticated & Anon Roles
-- --------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

GRANT EXECUTE ON FUNCTION public.check_college_seat_cap() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.check_student_college_entitlement(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.submit_and_grade_mock_attempt(TEXT, JSONB, INT, JSONB, INT, TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.check_user_paper_access(VARCHAR, VARCHAR) TO anon, authenticated, service_role;

-- Verification notification
DO $$
BEGIN
  RAISE NOTICE 'PrepUnite database migration applied successfully without errors!';
END $$;
