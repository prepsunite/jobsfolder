-- ====================================================================
-- PrepUnite: Strategic Security Hardening & Advisory Remediation
-- File: database/migrations/STRATEGIC_SECURITY_HARDENING_AND_ADVISORY_FIXES.sql
--
-- ARCHITECTURAL RATIONALE:
-- 1. Drops legacy development policies (FOR ALL USING true) that were silently
--    overriding fine-grained admin and user policies via Postgres permissive OR evaluation.
-- 2. Enforces strict row ownership (auth.uid() / auth.jwt()->>'email') on user profiles,
--    transactions, subscriptions, and progress tables.
-- 3. Locks down mutation (DELETE / UPDATE) on public contact & question reports while
--    preserving public INSERT for legitimate unauthenticated contact submissions.
-- 4. Retains client-facing RPCs (get_secure_exams_by_company, submit_and_grade_mock_attempt, etc.)
--    so student test workflows NEVER break.
-- 5. Revokes HTTP RPC access only on internal database triggers and maintenance crons.
-- 6. Sets search_path = public, pg_temp on functions to eliminate search-path injection.
-- 7. Fixes security_invoker on the safe_topic_questions view.
-- ====================================================================

-- ====================================================================
-- SECTION 1: CLEAN UP GHOST PERMISSIVE POLICIES
-- ====================================================================

-- 1.1 College Students
DROP POLICY IF EXISTS "Allow all on college_students" ON public.college_students;

-- 1.2 Companies
DROP POLICY IF EXISTS "Admin/Client manage companies" ON public.companies;
DROP POLICY IF EXISTS "Allow all operations companies" ON public.companies;

-- 1.3 Exams
DROP POLICY IF EXISTS "Admin/Client manage exams" ON public.exams;
DROP POLICY IF EXISTS "Allow all operations exams" ON public.exams;

-- 1.4 Topic Questions
DROP POLICY IF EXISTS "Admin/Client manage topic_questions" ON public.topic_questions;
DROP POLICY IF EXISTS "Allow all operations topic_questions" ON public.topic_questions;

-- 1.5 Paper Tab Nodes
DROP POLICY IF EXISTS "Allow all operations paper_tab_nodes" ON public.paper_tab_nodes;

-- 1.6 Experiences
DROP POLICY IF EXISTS "Admin/Client manage experiences" ON public.experiences;
DROP POLICY IF EXISTS "Allow all operations experiences" ON public.experiences;
DROP POLICY IF EXISTS "Authenticated submit experiences" ON public.experiences;

-- 1.7 TPO Authorizations
DROP POLICY IF EXISTS "Allow all on tpo_authorizations" ON public.tpo_authorizations;

-- 1.8 Transactions & Subscriptions & Purchases
DROP POLICY IF EXISTS "Allow insert/select transactions" ON public.transactions;
DROP POLICY IF EXISTS "Allow select/insert" ON public.transactions;

DROP POLICY IF EXISTS "Allow insert/select user_subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Allow select/insert" ON public.user_subscriptions;

DROP POLICY IF EXISTS "Allow insert/select user_paper_purchases" ON public.user_paper_purchases;
DROP POLICY IF EXISTS "Allow select/insert" ON public.user_paper_purchases;

-- 1.9 User Progress Tables (Drop all legacy variants)
DROP POLICY IF EXISTS "Users can manage own technical progress" ON public.user_technical_progress;
DROP POLICY IF EXISTS "Users manage own technical progress" ON public.user_technical_progress;
DROP POLICY IF EXISTS "Users can manage own mcq progress" ON public.user_mcq_progress;
DROP POLICY IF EXISTS "Users manage own mcq progress" ON public.user_mcq_progress;
DROP POLICY IF EXISTS "Users can manage own interview progress" ON public.user_interview_progress;
DROP POLICY IF EXISTS "Users manage own interview progress" ON public.user_interview_progress;

-- 1.10 Profiles
DROP POLICY IF EXISTS "Allow insert on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow update on profiles" ON public.profiles;

-- 1.11 Public Inboxes (Drop wide-open UPDATE and DELETE)
DROP POLICY IF EXISTS "Public delete contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Public update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Public delete question reports" ON public.question_reports;
DROP POLICY IF EXISTS "Public update question reports" ON public.question_reports;


-- ====================================================================
-- SECTION 2: ESTABLISH PROPER, SCOPED RLS POLICIES
-- ====================================================================

-- 2.1 Profiles: Self-manage or Super Admin manage
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles public read" ON public.profiles;
CREATE POLICY "Profiles public read"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users manage own profile insert" ON public.profiles;
CREATE POLICY "Users manage own profile insert"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id 
    OR lower(email) = lower(auth.jwt()->>'email')
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Users manage own profile update" ON public.profiles;
CREATE POLICY "Users manage own profile update"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id 
    OR lower(email) = lower(auth.jwt()->>'email')
    OR public.is_admin()
  )
  WITH CHECK (
    auth.uid() = id 
    OR lower(email) = lower(auth.jwt()->>'email')
    OR public.is_admin()
  );

-- 2.2 Transactions: Read-only for owners & admins. Mutations handled by backend service_role.
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own transactions" ON public.transactions;
CREATE POLICY "Users select own transactions"
  ON public.transactions FOR SELECT
  TO authenticated
  USING (
    lower(user_email) = lower(auth.jwt()->>'email')
    OR public.is_admin()
  );

-- 2.3 User Subscriptions: Read-only for owners & admins.
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own subscriptions" ON public.user_subscriptions;
CREATE POLICY "Users select own subscriptions"
  ON public.user_subscriptions FOR SELECT
  TO authenticated
  USING (
    lower(user_email) = lower(auth.jwt()->>'email')
    OR public.is_admin()
  );

-- 2.4 User Paper Purchases: Read-only for owners & admins.
ALTER TABLE public.user_paper_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own paper purchases" ON public.user_paper_purchases;
CREATE POLICY "Users select own paper purchases"
  ON public.user_paper_purchases FOR SELECT
  TO authenticated
  USING (
    lower(user_email) = lower(auth.jwt()->>'email')
    OR public.is_admin()
  );

-- 2.5 User Progress Tables: Scoped strictly to authenticated owner's email
ALTER TABLE public.user_technical_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own technical progress" ON public.user_technical_progress;
DROP POLICY IF EXISTS "Users can manage own technical progress" ON public.user_technical_progress;
CREATE POLICY "Users manage own technical progress"
  ON public.user_technical_progress FOR ALL
  TO authenticated
  USING (lower(user_email) = lower(auth.jwt()->>'email') OR public.is_admin())
  WITH CHECK (lower(user_email) = lower(auth.jwt()->>'email') OR public.is_admin());

ALTER TABLE public.user_mcq_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own mcq progress" ON public.user_mcq_progress;
DROP POLICY IF EXISTS "Users can manage own mcq progress" ON public.user_mcq_progress;
CREATE POLICY "Users manage own mcq progress"
  ON public.user_mcq_progress FOR ALL
  TO authenticated
  USING (lower(user_email) = lower(auth.jwt()->>'email') OR public.is_admin())
  WITH CHECK (lower(user_email) = lower(auth.jwt()->>'email') OR public.is_admin());

ALTER TABLE public.user_interview_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own interview progress" ON public.user_interview_progress;
DROP POLICY IF EXISTS "Users can manage own interview progress" ON public.user_interview_progress;
CREATE POLICY "Users manage own interview progress"
  ON public.user_interview_progress FOR ALL
  TO authenticated
  USING (lower(user_email) = lower(auth.jwt()->>'email') OR public.is_admin())
  WITH CHECK (lower(user_email) = lower(auth.jwt()->>'email') OR public.is_admin());

-- 2.6 Contact Messages: Public insert only. Management reserved for Super Admins.
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert contact messages" ON public.contact_messages;
CREATE POLICY "Public insert contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage contact messages" ON public.contact_messages;
CREATE POLICY "Admin manage contact messages"
  ON public.contact_messages FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 2.7 Question Reports: Public/User insert only. Management reserved for Super Admins.
ALTER TABLE public.question_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert question reports" ON public.question_reports;
CREATE POLICY "Public insert question reports"
  ON public.question_reports FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage question reports" ON public.question_reports;
CREATE POLICY "Admin manage question reports"
  ON public.question_reports FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 2.8 Experiences: Public view approved, authenticated submit/manage own, admins manage all
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public view approved experiences" ON public.experiences;
CREATE POLICY "Public view approved experiences"
  ON public.experiences FOR SELECT
  USING (
    (status = 'APPROVED' AND COALESCE(is_deleted, false) = false)
    OR public.is_admin()
    OR (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  );

DROP POLICY IF EXISTS "Authenticated submit own experiences" ON public.experiences;
CREATE POLICY "Authenticated submit own experiences"
  ON public.experiences FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id 
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Users update own experiences" ON public.experiences;
CREATE POLICY "Users update own experiences"
  ON public.experiences FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR public.is_admin()
  )
  WITH CHECK (
    auth.uid() = user_id 
    OR public.is_admin()
  );


-- ====================================================================
-- SECTION 3: HARDEN FUNCTION SEARCH PATHS
-- Eliminates mutable role search_path vulnerabilities
-- ====================================================================

-- 3.1 Trigger & Parameterless Functions
ALTER FUNCTION public.handle_new_admin_user() SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_new_user_profile() SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_new_user() SET search_path = public, pg_temp;
ALTER FUNCTION public.sync_profile_to_users() SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_aptitude_topics_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.is_tpo_user() SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_technical_topics_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.protect_exam_attempt_score_columns() SET search_path = public, pg_temp;
ALTER FUNCTION public.get_server_timestamp() SET search_path = public, pg_temp;
ALTER FUNCTION public.dpdp_anonymise_inactive_profiles() SET search_path = public, pg_temp;
ALTER FUNCTION public.dpdp_expire_subscriptions() SET search_path = public, pg_temp;

-- 3.2 Overloaded Functions (Guarded for text, uuid, jsonb signatures)
DO $$
BEGIN
  -- increment_experience_upvotes overloads
  BEGIN
    ALTER FUNCTION public.increment_experience_upvotes(text) SET search_path = public, pg_temp;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    ALTER FUNCTION public.increment_experience_upvotes(uuid) SET search_path = public, pg_temp;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  -- redact_paper_nodes overloads
  BEGIN
    ALTER FUNCTION public.redact_paper_nodes(jsonb, boolean, boolean) SET search_path = public, pg_temp;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    ALTER FUNCTION public.redact_paper_nodes(jsonb, boolean) SET search_path = public, pg_temp;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    ALTER FUNCTION public.redact_paper_nodes(jsonb) SET search_path = public, pg_temp;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
END $$;


-- ====================================================================
-- SECTION 4: REVOKE EXECUTE ON INTERNAL TRIGGER & CRON FUNCTIONS
-- Prevents exposing internal DB triggers and background jobs as REST RPC endpoints
-- ====================================================================

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT p.oid, p.proname, pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'handle_new_user',
        'handle_new_user_profile',
        'handle_new_admin_user',
        'sync_profile_to_users',
        'protect_exam_attempt_score_columns',
        'enforce_contact_messages_rate_limit',
        'enforce_experience_submission_invariants',
        'enforce_question_reports_rate_limit',
        'assign_topic_question_number',
        'cascade_college_validity_update',
        'check_college_seat_cap',
        'dpdp_anonymise_inactive_profiles',
        'dpdp_expire_subscriptions'
      )
  ) LOOP
    BEGIN
      EXECUTE format('REVOKE EXECUTE ON FUNCTION public.%I(%s) FROM anon, authenticated, public', r.proname, r.args);
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Notice revoking execute on %: %', r.proname, SQLERRM;
    END;
  END LOOP;
END $$;


-- ====================================================================
-- SECTION 5: SECURITY DEFINER VIEW FIX
-- Recreates safe_topic_questions with security_invoker = true
-- ====================================================================

CREATE OR REPLACE VIEW public.safe_topic_questions 
WITH (security_invoker = true) AS
SELECT 
  id, 
  topic_id, 
  statement, 
  options, 
  difficulty, 
  question_number,
  structured_explanation->>'passage' AS passage,
  structured_explanation->>'passageTitle' AS passageTitle
FROM public.topic_questions
WHERE COALESCE(is_deleted, false) = false AND COALESCE(is_hidden, false) = false;

GRANT SELECT ON public.safe_topic_questions TO authenticated, anon;


-- ====================================================================
-- SECTION 6: STORAGE BUCKET LISTING PRIVACY
-- Disables global directory listing on public_assets bucket
-- ====================================================================

DROP POLICY IF EXISTS "Public Assets Read" ON storage.objects;

