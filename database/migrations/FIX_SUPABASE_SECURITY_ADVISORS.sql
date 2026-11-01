-- ====================================================================
-- PrepUnite: Master Supabase Advisor Security Remediation
-- File: database/migrations/FIX_SUPABASE_SECURITY_ADVISORS.sql
-- Target: Supabase SQL Editor
--
-- REMEDIATIONS:
-- 1. [ERROR] security_definer_view: safe_topic_questions -> security_invoker = true
-- 2. [WARN]  function_search_path_mutable: Locks search_path = public, pg_temp
-- 3. [WARN]  rls_policy_always_true: Drops duplicate insert policies & enforces non-empty field checks
-- 4. [WARN]  anon_security_definer_function_executable: Revokes anon from backend/admin/authenticated RPCs
-- 5. [WARN]  authenticated_security_definer_function_executable: Revokes authenticated from internal webhooks;
--            converts safe read-only RPCs to SECURITY INVOKER
-- ====================================================================

BEGIN;

-- ====================================================================
-- 1. FIX [ERROR]: security_definer_view (safe_topic_questions)
-- In Postgres 15+, views on RLS tables must use security_invoker = true
-- ====================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'safe_topic_questions') THEN
    ALTER VIEW public.safe_topic_questions SET (security_invoker = true);
  END IF;
END $$;


-- ====================================================================
-- 2. FIX [WARN]: function_search_path_mutable
-- Sets immutable search_path = public, pg_temp on all flagged functions
-- ====================================================================
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT p.oid::regprocedure AS proc_sig
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'check_user_paper_access',
        'redact_paper_nodes',
        'protect_exam_attempt_score_columns',
        'get_server_timestamp',
        'dpdp_anonymise_inactive_profiles',
        'dpdp_expire_subscriptions',
        'fulfill_payment_order',
        'revoke_payment_entitlement',
        'consume_mock_exam_quota',
        'get_mock_exam_quota_status'
      )
  ) LOOP
    EXECUTE 'ALTER FUNCTION ' || r.proc_sig || ' SET search_path = public, pg_temp;';
  END LOOP;
END $$;


-- ====================================================================
-- 3. FIX [WARN]: rls_policy_always_true
-- Removes duplicate policies & replaces WITH CHECK (true) with validated constraints
-- ====================================================================

-- 3.1 contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone submit contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Public insert contact messages" ON public.contact_messages;

CREATE POLICY "Public insert contact messages" ON public.contact_messages
  FOR INSERT
  WITH CHECK (
    length(trim(COALESCE(email, ''))) > 3
    AND length(trim(COALESCE(message, ''))) > 0
  );

-- 3.2 question_reports
ALTER TABLE public.question_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone submit question_reports" ON public.question_reports;
DROP POLICY IF EXISTS "Public insert question reports" ON public.question_reports;

CREATE POLICY "Public insert question reports" ON public.question_reports
  FOR INSERT
  WITH CHECK (
    length(trim(COALESCE(question_id, ''))) > 0
    AND (
      length(trim(COALESCE(question_statement, ''))) > 0
      OR length(trim(COALESCE(details, ''))) > 0
    )
  );

-- 3.3 experiences
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Experiences insert policy" ON public.experiences;

CREATE POLICY "Experiences insert policy" ON public.experiences
  FOR INSERT
  WITH CHECK (
    length(trim(COALESCE(company_slug, ''))) > 0
    AND length(trim(COALESCE(role_title, ''))) > 0
  );


-- ====================================================================
-- 4. CONVERT SAFE READ FUNCTIONS TO SECURITY INVOKER
-- These functions do not need elevated DB owner privileges
-- ====================================================================

-- 4.1 get_server_timestamp(): Just returns NOW()
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT p.oid::regprocedure AS proc_sig
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'get_server_timestamp'
  ) LOOP
    EXECUTE 'ALTER FUNCTION ' || r.proc_sig || ' SECURITY INVOKER;';
  END LOOP;
END $$;

-- 4.2 get_aptitude_category_stats(): Aggregates public topics/questions
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT p.oid::regprocedure AS proc_sig
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'get_aptitude_category_stats'
  ) LOOP
    EXECUTE 'ALTER FUNCTION ' || r.proc_sig || ' SECURITY INVOKER;';
  END LOOP;
END $$;


-- ====================================================================
-- 5. FIX [WARN]: anon_security_definer_function_executable &
--                authenticated_security_definer_function_executable
-- ====================================================================

-- 5.1 BACKEND-ONLY / WEBHOOK / TRIGGER / CRON FUNCTIONS
-- Strictly accessible ONLY to service_role (payment webhooks, internal cron, DPDP purge)
-- Revokes from public, anon, and authenticated
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT p.oid::regprocedure AS proc_sig
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'fulfill_payment_order',
        'revoke_payment_entitlement',
        'dpdp_delete_user_data',
        'erase_user_learning_and_bookmark_data',
        'erase_user_paper_purchases',
        'provision_campus_student_subscription',
        'protect_exam_attempt_score_columns',
        'dpdp_anonymise_inactive_profiles',
        'dpdp_expire_subscriptions',
        'increment_experience_upvotes'
      )
  ) LOOP
    EXECUTE 'REVOKE ALL ON FUNCTION ' || r.proc_sig || ' FROM public, anon, authenticated;';
    EXECUTE 'GRANT EXECUTE ON FUNCTION ' || r.proc_sig || ' TO service_role;';
  END LOOP;
END $$;

-- 5.2 AUTHENTICATED-ONLY & ADMIN-ONLY RPC FUNCTIONS
-- Revokes from anon and public (guests cannot execute); keeps execute for authenticated & service_role
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT p.oid::regprocedure AS proc_sig
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'assign_college_tpo',
        'revoke_college_tpo',
        'remove_college_student',
        'get_colleges_usage_summary',
        'save_exam_paper_tabs',
        'submit_and_grade_mock_attempt',
        'toggle_experience_upvote',
        'update_user_dpdp_consent',
        'request_dpdp_user_deletion',
        'get_mock_exam_attempt_solutions',
        'get_safe_mock_exam_questions',
        'consume_mock_exam_quota',
        'get_mock_exam_quota_status',
        'check_user_paper_access',
        'check_student_college_entitlement',
        'is_admin',
        'is_any_tpo',
        'is_tpo_user',
        'is_super_admin_email',
        'is_tpo_for_college'
      )
  ) LOOP
    EXECUTE 'REVOKE EXECUTE ON FUNCTION ' || r.proc_sig || ' FROM public, anon;';
    EXECUTE 'GRANT EXECUTE ON FUNCTION ' || r.proc_sig || ' TO authenticated, service_role;';
  END LOOP;
END $$;

-- 5.3 PUBLIC / GUEST ACCESSIBLE RPCs (Explicitly audited with internal parameter security)
-- check_feedback_rate_limit & get_secure_exams_by_company can be called by anon + authenticated
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT p.oid::regprocedure AS proc_sig
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'check_feedback_rate_limit',
        'get_secure_exams_by_company',
        'get_secure_exam_by_id',
        'get_server_timestamp',
        'get_aptitude_category_stats'
      )
  ) LOOP
    EXECUTE 'GRANT EXECUTE ON FUNCTION ' || r.proc_sig || ' TO anon, authenticated, service_role;';
  END LOOP;
END $$;

COMMIT;
