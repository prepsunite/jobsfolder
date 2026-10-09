-- ====================================================================
-- TARGET F MASTER SECURITY, MODERATION & INTEGRITY HARDENING MIGRATION
-- Components:
--   1. [P0-01] Eliminate Auto-Approval Bypass on experiences (Trigger + Strict RLS)
--   2. [P0-02] DPDP Ownership Attribution (user_id, user_email columns & auto-binding)
--   3. [P1-01] Atomic Upvote Deduplication & Sybil Shield (user_experience_upvotes + RPC)
--   4. [P1-02] Authoritative 24h Rate Limiting on Reports & Contact Messages
--   5. [P2-01] Student Author Self-Management (View, Update, Retract Own Pending Posts)
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. EXPERIENCES TABLE SCHEMA UPGRADE
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id VARCHAR(255),
    company_slug VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    role_title VARCHAR(255) NOT NULL DEFAULT 'Software Engineer',
    student_name VARCHAR(255) NOT NULL DEFAULT 'Anonymous Student',
    college VARCHAR(255),
    year INT DEFAULT 2026,
    difficulty VARCHAR(50) DEFAULT 'MEDIUM',
    verdict VARCHAR(50) DEFAULT 'SELECTED',
    drive_type VARCHAR(50) DEFAULT 'ON_CAMPUS',
    rounds JSONB DEFAULT '[]'::JSONB,
    overall_experience TEXT,
    description TEXT,
    tips TEXT,
    upvotes INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'PENDING',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email VARCHAR(255)
);

-- Safely add missing columns
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS company_id VARCHAR(255);
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS company_slug VARCHAR(255);
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS role_title VARCHAR(255) DEFAULT 'Software Engineer';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS student_name VARCHAR(255) DEFAULT 'Anonymous Student';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS college VARCHAR(255);
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS year INT DEFAULT 2026;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS difficulty VARCHAR(50) DEFAULT 'MEDIUM';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS verdict VARCHAR(50) DEFAULT 'SELECTED';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS drive_type VARCHAR(50) DEFAULT 'ON_CAMPUS';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS rounds JSONB DEFAULT '[]'::JSONB;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS overall_experience TEXT;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS tips TEXT;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS upvotes INT DEFAULT 0;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'PENDING';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS user_email VARCHAR(255);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_experiences_user_id ON public.experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_experiences_user_email ON public.experiences(LOWER(TRIM(user_email)));
CREATE INDEX IF NOT EXISTS idx_experiences_status ON public.experiences(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_experiences_company_slug ON public.experiences(company_slug, status);
CREATE INDEX IF NOT EXISTS idx_experiences_upvotes ON public.experiences(upvotes DESC);

-- --------------------------------------------------------------------
-- 2. DEDUPLICATED UPVOTES LEDGER & ATOMIC TOGGLE RPC ([P1-01])
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.user_experience_upvotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email VARCHAR(255),
    client_identifier VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Unique indexes to prevent double voting
CREATE UNIQUE INDEX IF NOT EXISTS uq_exp_upvote_user_id 
    ON public.user_experience_upvotes(experience_id, user_id) 
    WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_exp_upvote_user_email 
    ON public.user_experience_upvotes(experience_id, LOWER(TRIM(user_email))) 
    WHERE user_email IS NOT NULL AND user_email <> '';

CREATE UNIQUE INDEX IF NOT EXISTS uq_exp_upvote_client_id 
    ON public.user_experience_upvotes(experience_id, client_identifier) 
    WHERE client_identifier IS NOT NULL AND client_identifier <> '';

-- Atomic Upvote Toggle Function
CREATE OR REPLACE FUNCTION public.toggle_experience_upvote(
    p_experience_id UUID,
    p_client_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_user_email TEXT;
    v_client_id TEXT;
    v_existing_id UUID := NULL;
    v_new_count INT;
BEGIN
    v_user_id := auth.uid();
    v_user_email := LOWER(TRIM(COALESCE(auth.jwt()->>'email', '')));
    v_client_id := NULLIF(TRIM(COALESCE(p_client_id, '')), '');

    -- Require at least one identity vector
    IF v_user_id IS NULL AND v_user_email = '' AND v_client_id IS NULL THEN
        -- Fallback to client identifier or generate anonymous identifier
        v_client_id := 'anon_client_' || p_experience_id::TEXT;
    END IF;

    -- Lock the experience row for concurrency safety
    PERFORM 1 FROM public.experiences WHERE id = p_experience_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Experience not found with id %', p_experience_id;
    END IF;

    -- Check if vote already exists
    IF v_user_id IS NOT NULL THEN
        SELECT id INTO v_existing_id
        FROM public.user_experience_upvotes
        WHERE experience_id = p_experience_id AND user_id = v_user_id;
    END IF;

    IF v_existing_id IS NULL AND v_user_email <> '' THEN
        SELECT id INTO v_existing_id
        FROM public.user_experience_upvotes
        WHERE experience_id = p_experience_id AND LOWER(TRIM(user_email)) = v_user_email;
    END IF;

    IF v_existing_id IS NULL AND v_client_id IS NOT NULL THEN
        SELECT id INTO v_existing_id
        FROM public.user_experience_upvotes
        WHERE experience_id = p_experience_id AND client_identifier = v_client_id;
    END IF;

    IF v_existing_id IS NOT NULL THEN
        -- User already upvoted -> Toggle OFF (Decrement)
        DELETE FROM public.user_experience_upvotes WHERE id = v_existing_id;

        UPDATE public.experiences
        SET upvotes = GREATEST(0, COALESCE(upvotes, 1) - 1),
            updated_at = NOW()
        WHERE id = p_experience_id
        RETURNING upvotes INTO v_new_count;

        RETURN jsonb_build_object(
            'upvoted', false,
            'upvotes', COALESCE(v_new_count, 0)
        );
    ELSE
        -- User has not upvoted -> Toggle ON (Increment)
        INSERT INTO public.user_experience_upvotes (
            experience_id,
            user_id,
            user_email,
            client_identifier
        ) VALUES (
            p_experience_id,
            v_user_id,
            NULLIF(v_user_email, ''),
            v_client_id
        );

        UPDATE public.experiences
        SET upvotes = COALESCE(upvotes, 0) + 1,
            updated_at = NOW()
        WHERE id = p_experience_id
        RETURNING upvotes INTO v_new_count;

        RETURN jsonb_build_object(
            'upvoted', true,
            'upvotes', COALESCE(v_new_count, 1)
        );
    END IF;
END;
$$;

-- Backward-compatibility wrapper for legacy increment_experience_upvotes callers
CREATE OR REPLACE FUNCTION public.increment_experience_upvotes(p_experience_id TEXT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_res JSONB;
BEGIN
    v_res := public.toggle_experience_upvote(p_experience_id::UUID, NULL);
    RETURN COALESCE((v_res->>'upvotes')::INT, 0);
EXCEPTION WHEN OTHERS THEN
    RETURN 0;
END;
$$;

-- --------------------------------------------------------------------
-- 3. INVARIANTS & SUBMISSION CONTROL TRIGGER ([P0-01], [P0-02])
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.enforce_experience_submission_invariants()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_is_admin BOOLEAN;
BEGIN
    v_is_admin := public.is_admin();

    IF TG_OP = 'INSERT' THEN
        -- Non-admins CANNOT self-approve or inject artificial upvotes
        IF NOT v_is_admin THEN
            NEW.status := 'PENDING';
            NEW.upvotes := 0;
            NEW.is_deleted := false;
        ELSE
            IF NEW.status IS NULL OR TRIM(NEW.status) = '' THEN
                NEW.status := 'APPROVED';
            END IF;
            NEW.upvotes := COALESCE(NEW.upvotes, 0);
            NEW.is_deleted := COALESCE(NEW.is_deleted, false);
        END IF;

        -- Bind user attribution
        IF auth.uid() IS NOT NULL THEN
            NEW.user_id := auth.uid();
        END IF;
        IF auth.jwt()->>'email' IS NOT NULL THEN
            NEW.user_email := LOWER(TRIM(auth.jwt()->>'email'));
        ELSIF NEW.user_email IS NOT NULL THEN
            NEW.user_email := LOWER(TRIM(NEW.user_email));
        END IF;

        NEW.created_at := COALESCE(NEW.created_at, NOW());
        NEW.updated_at := NOW();
        RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN
        NEW.updated_at := NOW();

        IF NOT v_is_admin THEN
            -- Non-admin cannot alter moderation status!
            NEW.status := OLD.status;
            -- Non-admin cannot alter upvotes directly!
            NEW.upvotes := OLD.upvotes;
            -- Non-admin cannot alter user attribution!
            NEW.user_id := OLD.user_id;
            NEW.user_email := OLD.user_email;
            NEW.created_at := OLD.created_at;

            -- Non-admins cannot alter an already APPROVED or REJECTED experience
            IF OLD.status <> 'PENDING' THEN
                RAISE EXCEPTION 'Cannot modify an interview experience after administrative review.';
            END IF;
        END IF;

        RETURN NEW;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_experience_invariants ON public.experiences;
CREATE TRIGGER trg_enforce_experience_invariants
    BEFORE INSERT OR UPDATE ON public.experiences
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_experience_submission_invariants();

-- --------------------------------------------------------------------
-- 4. HARDENED ROW LEVEL SECURITY (RLS) POLICIES ([P0-01], [P2-01])
-- --------------------------------------------------------------------

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_experience_upvotes ENABLE ROW LEVEL SECURITY;

-- Clean existing policies
DROP POLICY IF EXISTS "Public read approved experiences" ON public.experiences;
DROP POLICY IF EXISTS "Authenticated submit experiences" ON public.experiences;
DROP POLICY IF EXISTS "Admins update experiences" ON public.experiences;
DROP POLICY IF EXISTS "Admins delete experiences" ON public.experiences;
DROP POLICY IF EXISTS "Experiences read policy" ON public.experiences;
DROP POLICY IF EXISTS "Experiences insert policy" ON public.experiences;
DROP POLICY IF EXISTS "Experiences update policy" ON public.experiences;
DROP POLICY IF EXISTS "Experiences delete policy" ON public.experiences;

-- 4.1 SELECT Policy:
-- - Public sees APPROVED non-deleted posts
-- - Admins see all posts
-- - Authors can see their own PENDING or REJECTED posts
CREATE POLICY "Experiences read policy" ON public.experiences
    FOR SELECT USING (
        (COALESCE(is_deleted, false) = false AND status = 'APPROVED')
        OR public.is_admin()
        OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
        OR (auth.jwt()->>'email' IS NOT NULL AND LOWER(TRIM(user_email)) = LOWER(TRIM(auth.jwt()->>'email')))
    );

-- 4.2 INSERT Policy:
-- Public / authenticated can submit (Trigger forces status='PENDING' and upvotes=0 for non-admins)
CREATE POLICY "Experiences insert policy" ON public.experiences
    FOR INSERT WITH CHECK (true);

-- 4.3 UPDATE Policy:
-- - Super admins have full update permissions
-- - Authors can update their own posts while in PENDING status
CREATE POLICY "Experiences update policy" ON public.experiences
    FOR UPDATE USING (
        public.is_admin()
        OR (
            status = 'PENDING'
            AND COALESCE(is_deleted, false) = false
            AND (
                (auth.uid() IS NOT NULL AND user_id = auth.uid())
                OR (auth.jwt()->>'email' IS NOT NULL AND LOWER(TRIM(user_email)) = LOWER(TRIM(auth.jwt()->>'email')))
            )
        )
    ) WITH CHECK (
        public.is_admin()
        OR (
            status = 'PENDING'
            AND (
                (auth.uid() IS NOT NULL AND user_id = auth.uid())
                OR (auth.jwt()->>'email' IS NOT NULL AND LOWER(TRIM(user_email)) = LOWER(TRIM(auth.jwt()->>'email')))
            )
        )
    );

-- 4.4 DELETE Policy:
-- - Super admins can delete any post
-- - Authors can retract/delete their own PENDING post
CREATE POLICY "Experiences delete policy" ON public.experiences
    FOR DELETE USING (
        public.is_admin()
        OR (
            status = 'PENDING'
            AND (
                (auth.uid() IS NOT NULL AND user_id = auth.uid())
                OR (auth.jwt()->>'email' IS NOT NULL AND LOWER(TRIM(user_email)) = LOWER(TRIM(auth.jwt()->>'email')))
            )
        )
    );

-- 4.5 user_experience_upvotes RLS Policies
DROP POLICY IF EXISTS "Read experience upvotes" ON public.user_experience_upvotes;
CREATE POLICY "Read experience upvotes" ON public.user_experience_upvotes
    FOR SELECT USING (
        public.is_admin()
        OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
        OR (auth.jwt()->>'email' IS NOT NULL AND LOWER(TRIM(user_email)) = LOWER(TRIM(auth.jwt()->>'email')))
    );

DROP POLICY IF EXISTS "Manage experience upvotes" ON public.user_experience_upvotes;
CREATE POLICY "Manage experience upvotes" ON public.user_experience_upvotes
    FOR ALL USING (
        public.is_admin()
        OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
        OR (auth.jwt()->>'email' IS NOT NULL AND LOWER(TRIM(user_email)) = LOWER(TRIM(auth.jwt()->>'email')))
    );

-- --------------------------------------------------------------------
-- 5. QUESTION REPORTS & CONTACT MESSAGES 24H RATE LIMIT TRIGGERS ([P1-02])
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.enforce_question_reports_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_recent_count INT;
    v_email TEXT;
BEGIN
    IF public.is_admin() THEN
        RETURN NEW;
    END IF;

    v_email := LOWER(TRIM(COALESCE(NEW.reporter_email, auth.jwt()->>'email', '')));
    IF v_email <> '' THEN
        SELECT COUNT(*)
        INTO v_recent_count
        FROM public.question_reports
        WHERE LOWER(TRIM(reporter_email)) = v_email
          AND created_at >= NOW() - INTERVAL '24 hours';

        IF v_recent_count >= 5 THEN
            RAISE EXCEPTION 'Daily question report limit exceeded (maximum 5 reports per 24 hours). Thank you for your feedback!';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_question_reports_rate_limit ON public.question_reports;
CREATE TRIGGER trg_question_reports_rate_limit
    BEFORE INSERT ON public.question_reports
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_question_reports_rate_limit();


CREATE OR REPLACE FUNCTION public.enforce_contact_messages_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_recent_count INT;
    v_email TEXT;
BEGIN
    -- Super admins and internal blueprint sync calls bypass limits
    IF public.is_admin() 
       OR NEW.subject LIKE 'MOCK_EXAM_BLUEPRINT:%' 
       OR NEW.subject LIKE 'B2B_%' THEN
        RETURN NEW;
    END IF;

    v_email := LOWER(TRIM(COALESCE(NEW.email, auth.jwt()->>'email', '')));
    IF v_email <> '' THEN
        SELECT COUNT(*)
        INTO v_recent_count
        FROM public.contact_messages
        WHERE LOWER(TRIM(email)) = v_email
          AND created_at >= NOW() - INTERVAL '24 hours'
          AND NOT (subject LIKE 'MOCK_EXAM_BLUEPRINT:%' OR subject LIKE 'B2B_%');

        IF v_recent_count >= 3 THEN
            RAISE EXCEPTION 'Daily contact inquiry limit exceeded (maximum 3 inquiries per 24 hours). Please contact prepsunite@gmail.com directly for urgent assistance.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_contact_messages_rate_limit ON public.contact_messages;
CREATE TRIGGER trg_contact_messages_rate_limit
    BEFORE INSERT ON public.contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_contact_messages_rate_limit();

-- 5.1 Helper RPC for Feedback Rate Limits (Usable by non-admins despite strict RLS)
CREATE OR REPLACE FUNCTION public.check_feedback_rate_limit(
    p_email TEXT,
    p_type TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_norm_email TEXT;
    v_count INT := 0;
    v_max INT := 5;
BEGIN
    v_norm_email := LOWER(TRIM(COALESCE(p_email, auth.jwt()->>'email', '')));

    IF v_norm_email = '' THEN
        RETURN jsonb_build_object('allowed', true, 'count', 0, 'max', v_max, 'remaining', v_max);
    END IF;

    IF p_type = 'contact_message' THEN
        v_max := 3;
        SELECT COUNT(*) INTO v_count
        FROM public.contact_messages
        WHERE LOWER(TRIM(email)) = v_norm_email
          AND created_at >= NOW() - INTERVAL '24 hours'
          AND NOT (subject LIKE 'MOCK_EXAM_BLUEPRINT:%' OR subject LIKE 'B2B_%');
    ELSE
        v_max := 5;
        SELECT COUNT(*) INTO v_count
        FROM public.question_reports
        WHERE LOWER(TRIM(reporter_email)) = v_norm_email
          AND created_at >= NOW() - INTERVAL '24 hours';
    END IF;

    RETURN jsonb_build_object(
        'allowed', (v_count < v_max),
        'count', v_count,
        'max', v_max,
        'remaining', GREATEST(0, v_max - v_count)
    );
END;
$$;

-- --------------------------------------------------------------------
-- 6. DPDP USER DATA ERASURE ROUTINE INTEGRATION
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.anonymize_user_experience_data(
    p_user_id UUID,
    p_user_email TEXT
)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_affected INT := 0;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Administrative privileges required to invoke DPDP erasure routines.';
    END IF;

    -- Redact identifiable information on author's experiences
    UPDATE public.experiences
    SET student_name = 'Anonymous Student',
        college = 'Redacted',
        user_id = NULL,
        user_email = NULL,
        updated_at = NOW()
    WHERE (p_user_id IS NOT NULL AND user_id = p_user_id)
       OR (p_user_email IS NOT NULL AND LOWER(TRIM(user_email)) = LOWER(TRIM(p_user_email)));
       
    GET DIAGNOSTICS v_affected = ROW_COUNT;

    -- Delete upvote records to eliminate attribution link
    DELETE FROM public.user_experience_upvotes
    WHERE (p_user_id IS NOT NULL AND user_id = p_user_id)
       OR (p_user_email IS NOT NULL AND LOWER(TRIM(user_email)) = LOWER(TRIM(p_user_email)));

    RETURN v_affected;
END;
$$;

-- --------------------------------------------------------------------
-- 7. PERMISSIONS & GRANTS
-- --------------------------------------------------------------------

GRANT SELECT, INSERT, UPDATE, DELETE ON public.experiences TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_experience_upvotes TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.toggle_experience_upvote(UUID, TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.increment_experience_upvotes(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.check_feedback_rate_limit(TEXT, TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.anonymize_user_experience_data(UUID, TEXT) TO authenticated, service_role;
