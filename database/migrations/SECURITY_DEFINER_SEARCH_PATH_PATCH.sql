-- ====================================================================
-- Security Hardening Patch: Fix Mutable Search Path on SECURITY DEFINER Functions
-- Reference: CVE-2018-1058 / Supabase Studio Security Linter (function_search_path_mutable)
--
-- Setting search_path explicitly prevents malicious schema search-path hijacking
-- when SECURITY DEFINER functions execute with elevated superuser/owner privileges.
-- ====================================================================

DO $$
BEGIN
    -- 1. College Seat Cap & Entitlements
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'check_college_seat_cap') THEN
        EXECUTE 'ALTER FUNCTION public.check_college_seat_cap() SET search_path = public, auth';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'check_student_college_entitlement') THEN
        EXECUTE 'ALTER FUNCTION public.check_student_college_entitlement(TEXT) SET search_path = public, auth';
    END IF;

    -- 2. Mock Exam Anti-Cheat & Questions Fetcher
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'submit_and_grade_mock_attempt') THEN
        EXECUTE 'ALTER FUNCTION public.submit_and_grade_mock_attempt(UUID, JSONB, INT) SET search_path = public, auth';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_safe_exam_questions') THEN
        EXECUTE 'ALTER FUNCTION public.get_safe_exam_questions(UUID) SET search_path = public, auth';
    END IF;

    -- 3. Payment Fulfillment & Quota Management
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'fulfill_payment_order') THEN
        EXECUTE 'ALTER FUNCTION public.fulfill_payment_order(TEXT, TEXT, TEXT) SET search_path = public, auth';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'revoke_payment_entitlement') THEN
        EXECUTE 'ALTER FUNCTION public.revoke_payment_entitlement(TEXT, TEXT) SET search_path = public, auth';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'consume_mock_exam_quota') THEN
        EXECUTE 'ALTER FUNCTION public.consume_mock_exam_quota(TEXT, UUID) SET search_path = public, auth';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_mock_exam_quota_status') THEN
        EXECUTE 'ALTER FUNCTION public.get_mock_exam_quota_status(TEXT) SET search_path = public, auth';
    END IF;

    -- 4. Auth & Admin Helpers
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin') THEN
        EXECUTE 'ALTER FUNCTION public.is_admin() SET search_path = public, auth';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') THEN
        EXECUTE 'ALTER FUNCTION public.handle_new_user() SET search_path = public, auth';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'dpdp_anonymise_inactive_profiles') THEN
        EXECUTE 'ALTER FUNCTION public.dpdp_anonymise_inactive_profiles() SET search_path = public, auth';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'protect_exam_attempt_score_columns') THEN
        EXECUTE 'ALTER FUNCTION public.protect_exam_attempt_score_columns() SET search_path = public, auth';
    END IF;
END $$;
