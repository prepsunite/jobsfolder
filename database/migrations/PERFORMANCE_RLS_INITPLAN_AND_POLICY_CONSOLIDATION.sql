-- ====================================================================
-- PrepUnite: Database Performance & RLS Policy Consolidation
-- File: database/migrations/PERFORMANCE_RLS_INITPLAN_AND_POLICY_CONSOLIDATION.sql
--
-- ARCHITECTURAL RATIONALE:
-- 1. FIXES auth_rls_initplan (Linter Rule 0003):
--    Replaces row-by-row function evaluation (auth.uid(), auth.jwt(), public.is_admin())
--    with scalar subqueries: (SELECT auth.uid()), (SELECT auth.jwt()->>'email'), (SELECT public.is_admin()).
--    This enables PostgreSQL to generate an InitPlan, executing the function ONCE per query
--    instead of once per evaluated row. (5x - 100x speedup at scale).
-- 2. FIXES multiple_permissive_policies (Linter Rule 0006):
--    Drops legacy and duplicate policies accumulated across past migrations on:
--    aptitude_topics, companies, colleges, college_batches, college_students,
--    student_exam_attempts, transactions, user_subscriptions, user_paper_purchases, etc.
--    Replaces them with single, consolidated, canonical policies per role/action.
-- ====================================================================

-- ====================================================================
-- SECTION 1: CONTENT CATALOG TABLES (Aptitude, Companies, Technical, Interview)
-- ====================================================================

-- 1.1 APTITUDE TOPICS
DROP POLICY IF EXISTS "Admins can delete aptitude topics" ON public.aptitude_topics;
DROP POLICY IF EXISTS "Admins can insert aptitude topics" ON public.aptitude_topics;
DROP POLICY IF EXISTS "Admins can update aptitude topics" ON public.aptitude_topics;
DROP POLICY IF EXISTS "Admins can manage aptitude topics" ON public.aptitude_topics;
DROP POLICY IF EXISTS "Admins mutate aptitude_topics" ON public.aptitude_topics;
DROP POLICY IF EXISTS "Public can view non-hidden aptitude topics" ON public.aptitude_topics;
DROP POLICY IF EXISTS "Read aptitude_topics" ON public.aptitude_topics;
DROP POLICY IF EXISTS "Public read aptitude_topics" ON public.aptitude_topics;
DROP POLICY IF EXISTS "Admin manage aptitude_topics" ON public.aptitude_topics;

ALTER TABLE public.aptitude_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read aptitude_topics"
  ON public.aptitude_topics FOR SELECT
  USING (COALESCE(is_hidden, false) = false OR (SELECT public.is_admin()));

CREATE POLICY "Admin manage aptitude_topics"
  ON public.aptitude_topics FOR ALL
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));


-- 1.2 COMPANIES
DROP POLICY IF EXISTS "Admin write companies" ON public.companies;
DROP POLICY IF EXISTS "Admins delete companies" ON public.companies;
DROP POLICY IF EXISTS "Admins insert companies" ON public.companies;
DROP POLICY IF EXISTS "Admins update companies" ON public.companies;
DROP POLICY IF EXISTS "Public read companies" ON public.companies;
DROP POLICY IF EXISTS "Public select active companies" ON public.companies;
DROP POLICY IF EXISTS "Admin manage companies" ON public.companies;

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read companies"
  ON public.companies FOR SELECT
  USING (COALESCE(is_deleted, false) = false OR (SELECT public.is_admin()));

CREATE POLICY "Admin manage companies"
  ON public.companies FOR ALL
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));


-- 1.3 TECHNICAL TOPICS
DROP POLICY IF EXISTS "Admins can manage technical topics" ON public.technical_topics;
DROP POLICY IF EXISTS "Public can view non-hidden technical topics" ON public.technical_topics;
DROP POLICY IF EXISTS "Public read technical_topics" ON public.technical_topics;
DROP POLICY IF EXISTS "Admin manage technical_topics" ON public.technical_topics;

ALTER TABLE public.technical_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read technical_topics"
  ON public.technical_topics FOR SELECT
  USING (COALESCE(is_hidden, false) = false OR (SELECT public.is_admin()));

CREATE POLICY "Admin manage technical_topics"
  ON public.technical_topics FOR ALL
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));


-- 1.4 TECHNICAL PROBLEMS
DROP POLICY IF EXISTS "Admins can manage technical problems" ON public.technical_problems;
DROP POLICY IF EXISTS "Public can view active technical problems" ON public.technical_problems;
DROP POLICY IF EXISTS "Public read technical_problems" ON public.technical_problems;
DROP POLICY IF EXISTS "Admin manage technical_problems" ON public.technical_problems;

ALTER TABLE public.technical_problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read technical_problems"
  ON public.technical_problems FOR SELECT
  USING (COALESCE(is_deleted, false) = false AND (COALESCE(is_hidden, false) = false OR (SELECT public.is_admin())));

CREATE POLICY "Admin manage technical_problems"
  ON public.technical_problems FOR ALL
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));


-- 1.5 TECHNICAL MCQS
DROP POLICY IF EXISTS "Admins can manage technical mcqs" ON public.technical_mcqs;
DROP POLICY IF EXISTS "Public can view active technical mcqs" ON public.technical_mcqs;
DROP POLICY IF EXISTS "Public read technical_mcqs" ON public.technical_mcqs;
DROP POLICY IF EXISTS "Admin manage technical_mcqs" ON public.technical_mcqs;

ALTER TABLE public.technical_mcqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read technical_mcqs"
  ON public.technical_mcqs FOR SELECT
  USING (COALESCE(is_deleted, false) = false AND (COALESCE(is_hidden, false) = false OR (SELECT public.is_admin())));

CREATE POLICY "Admin manage technical_mcqs"
  ON public.technical_mcqs FOR ALL
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));


-- 1.6 INTERVIEW TOPICS
DROP POLICY IF EXISTS "Admins can manage interview topics" ON public.interview_topics;
DROP POLICY IF EXISTS "Public can view non-hidden interview topics" ON public.interview_topics;
DROP POLICY IF EXISTS "Public read interview_topics" ON public.interview_topics;
DROP POLICY IF EXISTS "Admin manage interview_topics" ON public.interview_topics;

ALTER TABLE public.interview_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read interview_topics"
  ON public.interview_topics FOR SELECT
  USING (COALESCE(is_hidden, false) = false OR (SELECT public.is_admin()));

CREATE POLICY "Admin manage interview_topics"
  ON public.interview_topics FOR ALL
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));


-- 1.7 INTERVIEW QUESTIONS
DROP POLICY IF EXISTS "Admins can manage interview questions" ON public.interview_questions;
DROP POLICY IF EXISTS "Public can view active interview questions" ON public.interview_questions;
DROP POLICY IF EXISTS "Public read interview_questions" ON public.interview_questions;
DROP POLICY IF EXISTS "Admin manage interview_questions" ON public.interview_questions;

ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read interview_questions"
  ON public.interview_questions FOR SELECT
  USING (COALESCE(is_deleted, false) = false AND (COALESCE(is_hidden, false) = false OR (SELECT public.is_admin())));

CREATE POLICY "Admin manage interview_questions"
  ON public.interview_questions FOR ALL
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));


-- 1.8 TOPIC CHEAT CODES
DROP POLICY IF EXISTS "Allow all authenticated users to modify cheat codes" ON public.topic_cheat_codes;
DROP POLICY IF EXISTS "Public read cheat codes" ON public.topic_cheat_codes;
DROP POLICY IF EXISTS "Admin manage cheat codes" ON public.topic_cheat_codes;

ALTER TABLE public.topic_cheat_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read cheat codes"
  ON public.topic_cheat_codes FOR SELECT
  USING (true);

CREATE POLICY "Admin manage cheat codes"
  ON public.topic_cheat_codes FOR ALL
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));


-- 1.9 PAPER TAB NODES
DROP POLICY IF EXISTS "Secure select paper nodes" ON public.paper_tab_nodes;
DROP POLICY IF EXISTS "Public read paper tab nodes" ON public.paper_tab_nodes;
DROP POLICY IF EXISTS "Admin manage paper tab nodes" ON public.paper_tab_nodes;

ALTER TABLE public.paper_tab_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read paper tab nodes"
  ON public.paper_tab_nodes FOR SELECT
  USING (COALESCE(is_deleted, false) = false OR (SELECT public.is_admin()));

CREATE POLICY "Admin manage paper tab nodes"
  ON public.paper_tab_nodes FOR ALL
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));


-- ====================================================================
-- SECTION 2: B2B, COLLEGES & TPO TABLES
-- ====================================================================

-- 2.1 COLLEGES
DROP POLICY IF EXISTS "Super admin full colleges" ON public.colleges;
DROP POLICY IF EXISTS "Superadmin full colleges" ON public.colleges;
DROP POLICY IF EXISTS "Allow student read colleges" ON public.colleges;
DROP POLICY IF EXISTS "Public read colleges" ON public.colleges;
DROP POLICY IF EXISTS "View own college" ON public.colleges;
DROP POLICY IF EXISTS "TPO update own college" ON public.colleges;
DROP POLICY IF EXISTS "Allow public read active colleges" ON public.colleges;
DROP POLICY IF EXISTS "Allow authenticated full colleges" ON public.colleges;

ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Colleges read policy"
  ON public.colleges FOR SELECT
  USING (
    COALESCE(contract_status, 'ACTIVE') = 'ACTIVE'
    OR (SELECT public.is_admin())
    OR (SELECT public.is_tpo_for_college(id::text))
  );

CREATE POLICY "Super admin full colleges"
  ON public.colleges FOR ALL
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "TPO update own college"
  ON public.colleges FOR UPDATE
  TO authenticated
  USING ((SELECT public.is_tpo_for_college(id::text)))
  WITH CHECK ((SELECT public.is_tpo_for_college(id::text)));


-- 2.2 COLLEGE BATCHES
DROP POLICY IF EXISTS "Batches read policy" ON public.college_batches;
DROP POLICY IF EXISTS "Batches write policy" ON public.college_batches;
DROP POLICY IF EXISTS "Students view own college batches" ON public.college_batches;
DROP POLICY IF EXISTS "Super admin full batches" ON public.college_batches;
DROP POLICY IF EXISTS "TPO manage own college batches" ON public.college_batches;

ALTER TABLE public.college_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Batches read policy"
  ON public.college_batches FOR SELECT
  USING (
    (SELECT public.is_admin())
    OR (SELECT public.is_tpo_for_college(college_id))
    OR EXISTS (
      SELECT 1 FROM public.college_students cs
      WHERE cs.college_id = college_batches.college_id
        AND (
          cs.user_id = (SELECT auth.uid())
          OR LOWER(cs.email) = LOWER((SELECT auth.jwt()->>'email'))
        )
    )
  );

CREATE POLICY "Batches admin and tpo manage"
  ON public.college_batches FOR ALL
  TO authenticated
  USING (
    (SELECT public.is_admin())
    OR (SELECT public.is_tpo_for_college(college_id))
  )
  WITH CHECK (
    (SELECT public.is_admin())
    OR (SELECT public.is_tpo_for_college(college_id))
  );


-- 2.3 COLLEGE STUDENTS
DROP POLICY IF EXISTS "College students read policy" ON public.college_students;
DROP POLICY IF EXISTS "College students write policy" ON public.college_students;
DROP POLICY IF EXISTS "Student read own profile" ON public.college_students;
DROP POLICY IF EXISTS "Student view own enrollment" ON public.college_students;
DROP POLICY IF EXISTS "Super admin full college_students" ON public.college_students;
DROP POLICY IF EXISTS "TPO manage college students" ON public.college_students;
DROP POLICY IF EXISTS "TPO manage own college students" ON public.college_students;

ALTER TABLE public.college_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "College students select policy"
  ON public.college_students FOR SELECT
  USING (
    (SELECT public.is_admin())
    OR (SELECT public.is_tpo_for_college(college_id))
    OR user_id = (SELECT auth.uid())
    OR LOWER(email) = LOWER((SELECT auth.jwt()->>'email'))
  );

CREATE POLICY "College students manage policy"
  ON public.college_students FOR ALL
  TO authenticated
  USING (
    (SELECT public.is_admin())
    OR (SELECT public.is_tpo_for_college(college_id))
  )
  WITH CHECK (
    (SELECT public.is_admin())
    OR (SELECT public.is_tpo_for_college(college_id))
  );


-- 2.4 TPO AUTHORIZATIONS
DROP POLICY IF EXISTS "TPO auth read policy" ON public.tpo_authorizations;
DROP POLICY IF EXISTS "TPO read own authorization" ON public.tpo_authorizations;
DROP POLICY IF EXISTS "TPO read own authorizations" ON public.tpo_authorizations;
DROP POLICY IF EXISTS "Super admin full tpo" ON public.tpo_authorizations;

ALTER TABLE public.tpo_authorizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "TPO authorizations select policy"
  ON public.tpo_authorizations FOR SELECT
  USING (
    (SELECT public.is_admin())
    OR user_id = (SELECT auth.uid())
    OR LOWER(email) = LOWER((SELECT auth.jwt()->>'email'))
  );

CREATE POLICY "Super admin manage tpo authorizations"
  ON public.tpo_authorizations FOR ALL
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));


-- 2.5 MOCK EXAMS & SECTIONS
DROP POLICY IF EXISTS "Mock exams read policy" ON public.mock_exams;
DROP POLICY IF EXISTS "Student create self practice exams" ON public.mock_exams;
DROP POLICY IF EXISTS "Student manage self practice exams" ON public.mock_exams;
DROP POLICY IF EXISTS "Unified 3-tier read mock exams" ON public.mock_exams;
DROP POLICY IF EXISTS "Super admin full mock_exams" ON public.mock_exams;
DROP POLICY IF EXISTS "TPO manage own college mock_exams" ON public.mock_exams;

ALTER TABLE public.mock_exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Unified mock exams read policy"
  ON public.mock_exams FOR SELECT
  USING (
    (SELECT public.is_admin())
    OR (SELECT public.is_tpo_for_college(college_id))
    OR created_by = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.college_students cs
      WHERE cs.college_id = mock_exams.college_id
        AND (
          cs.user_id = (SELECT auth.uid())
          OR LOWER(cs.email) = LOWER((SELECT auth.jwt()->>'email'))
        )
    )
  );

CREATE POLICY "Mock exams manage policy"
  ON public.mock_exams FOR ALL
  TO authenticated
  USING (
    (SELECT public.is_admin())
    OR (SELECT public.is_tpo_for_college(college_id))
    OR created_by = (SELECT auth.uid())
  )
  WITH CHECK (
    (SELECT public.is_admin())
    OR (SELECT public.is_tpo_for_college(college_id))
    OR created_by = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Student manage self practice sections" ON public.mock_exam_sections;
DROP POLICY IF EXISTS "Unified 3-tier read mock exam sections" ON public.mock_exam_sections;

ALTER TABLE public.mock_exam_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Unified mock exam sections read policy"
  ON public.mock_exam_sections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.mock_exams me
      WHERE me.id = mock_exam_sections.mock_exam_id
        AND (
          (SELECT public.is_admin())
          OR (SELECT public.is_tpo_for_college(me.college_id))
          OR me.created_by = (SELECT auth.uid())
          OR EXISTS (
            SELECT 1 FROM public.college_students cs
            WHERE cs.college_id = me.college_id
              AND (
                cs.user_id = (SELECT auth.uid())
                OR LOWER(cs.email) = LOWER((SELECT auth.jwt()->>'email'))
              )
          )
        )
    )
  );

CREATE POLICY "Mock exam sections manage policy"
  ON public.mock_exam_sections FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.mock_exams me
      WHERE me.id = mock_exam_sections.mock_exam_id
        AND (
          (SELECT public.is_admin())
          OR (SELECT public.is_tpo_for_college(me.college_id))
          OR me.created_by = (SELECT auth.uid())
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.mock_exams me
      WHERE me.id = mock_exam_sections.mock_exam_id
        AND (
          (SELECT public.is_admin())
          OR (SELECT public.is_tpo_for_college(me.college_id))
          OR me.created_by = (SELECT auth.uid())
        )
    )
  );


-- 2.6 STUDENT EXAM ATTEMPTS (Consolidate 9 duplicate policies)
DROP POLICY IF EXISTS "Attempts insert policy" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Attempts read policy" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Attempts update policy" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Student insert own in_progress attempt" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Student select own attempts" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Student update in_progress attempt responses" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Students insert own attempts" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Students read own attempts" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Students update own attempts" ON public.student_exam_attempts;

ALTER TABLE public.student_exam_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Student exam attempts select policy"
  ON public.student_exam_attempts FOR SELECT
  USING (
    student_id = (SELECT auth.uid())::text
    OR (SELECT public.is_admin())
    OR (SELECT public.is_tpo_for_college(college_id))
  );

CREATE POLICY "Student exam attempts insert policy"
  ON public.student_exam_attempts FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id = (SELECT auth.uid())::text
    OR (SELECT public.is_admin())
  );

CREATE POLICY "Student exam attempts update policy"
  ON public.student_exam_attempts FOR UPDATE
  TO authenticated
  USING (
    student_id = (SELECT auth.uid())::text
    OR (SELECT public.is_admin())
    OR (SELECT public.is_tpo_for_college(college_id))
  )
  WITH CHECK (
    student_id = (SELECT auth.uid())::text
    OR (SELECT public.is_admin())
  );


-- ====================================================================
-- SECTION 3: USER PROFILES, BILLING & ENTITLEMENTS
-- ====================================================================

-- 3.1 PROFILES
DROP POLICY IF EXISTS "TPO update college students" ON public.profiles;
DROP POLICY IF EXISTS "Users insert self profile as user" ON public.profiles;
DROP POLICY IF EXISTS "Users manage own profile insert" ON public.profiles;
DROP POLICY IF EXISTS "Users manage own profile update" ON public.profiles;
DROP POLICY IF EXISTS "Users update self info non-role" ON public.profiles;
DROP POLICY IF EXISTS "Profiles public read" ON public.profiles;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles public read"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = id
    OR LOWER(email) = LOWER((SELECT auth.jwt()->>'email'))
    OR (SELECT public.is_admin())
  );

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.uid()) = id
    OR LOWER(email) = LOWER((SELECT auth.jwt()->>'email'))
    OR (SELECT public.is_admin())
  )
  WITH CHECK (
    (SELECT auth.uid()) = id
    OR LOWER(email) = LOWER((SELECT auth.jwt()->>'email'))
    OR (SELECT public.is_admin())
  );


-- 3.2 TRANSACTIONS (Consolidate 3 duplicate policies)
DROP POLICY IF EXISTS "User reads own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users read own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users select own transactions" ON public.transactions;

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own transactions"
  ON public.transactions FOR SELECT
  USING (
    LOWER(user_email) = LOWER((SELECT auth.jwt()->>'email'))
    OR (SELECT public.is_admin())
  );


-- 3.3 USER SUBSCRIPTIONS (Consolidate 4 duplicate policies)
DROP POLICY IF EXISTS "TPO coordinator manage college student subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "User reads own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users read own subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users select own subscriptions" ON public.user_subscriptions;

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own subscriptions"
  ON public.user_subscriptions FOR SELECT
  USING (
    LOWER(user_email) = LOWER((SELECT auth.jwt()->>'email'))
    OR (SELECT public.is_admin())
  );


-- 3.4 USER PAPER PURCHASES (Consolidate 4 duplicate policies)
DROP POLICY IF EXISTS "User reads own paper purchases" ON public.user_paper_purchases;
DROP POLICY IF EXISTS "Users can read own paper purchases" ON public.user_paper_purchases;
DROP POLICY IF EXISTS "Users read own paper purchases" ON public.user_paper_purchases;
DROP POLICY IF EXISTS "Users select own paper purchases" ON public.user_paper_purchases;

ALTER TABLE public.user_paper_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own paper purchases"
  ON public.user_paper_purchases FOR SELECT
  USING (
    LOWER(user_email) = LOWER((SELECT auth.jwt()->>'email'))
    OR (SELECT public.is_admin())
  );


-- 3.5 PAYMENT ORDERS
DROP POLICY IF EXISTS "Users can read own payment orders" ON public.payment_orders;
DROP POLICY IF EXISTS "Users select own payment orders" ON public.payment_orders;

ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own payment orders"
  ON public.payment_orders FOR SELECT
  USING (
    LOWER(user_email) = LOWER((SELECT auth.jwt()->>'email'))
    OR (SELECT public.is_admin())
  );


-- ====================================================================
-- SECTION 4: USER LEARNING, PROGRESS & COMMUNITY
-- ====================================================================

-- 4.1 EXPERIENCES (Consolidate 6 duplicate policies)
DROP POLICY IF EXISTS "Authenticated submit own experiences" ON public.experiences;
DROP POLICY IF EXISTS "Authenticated users can insert experiences" ON public.experiences;
DROP POLICY IF EXISTS "Authenticated users create pending experiences" ON public.experiences;
DROP POLICY IF EXISTS "Public view approved experiences" ON public.experiences;
DROP POLICY IF EXISTS "Users can read own pending experiences" ON public.experiences;
DROP POLICY IF EXISTS "Users update own experiences" ON public.experiences;
DROP POLICY IF EXISTS "Experiences select policy" ON public.experiences;
DROP POLICY IF EXISTS "Experiences insert policy" ON public.experiences;
DROP POLICY IF EXISTS "Experiences update policy" ON public.experiences;
DROP POLICY IF EXISTS "Experiences delete policy" ON public.experiences;

ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS user_email VARCHAR(255);
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Experiences select policy"
  ON public.experiences FOR SELECT
  USING (
    (COALESCE(is_deleted, false) = false AND status = 'APPROVED')
    OR (SELECT public.is_admin())
    OR ((SELECT auth.uid()) IS NOT NULL AND (user_id = (SELECT auth.uid()) OR created_by = (SELECT auth.uid())))
    OR ((SELECT auth.jwt()->>'email') IS NOT NULL AND LOWER(TRIM(user_email)) = LOWER(TRIM((SELECT auth.jwt()->>'email'))))
  );

CREATE POLICY "Experiences insert policy"
  ON public.experiences FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Experiences update policy"
  ON public.experiences FOR UPDATE
  TO authenticated
  USING (
    (SELECT public.is_admin())
    OR (
      status = 'PENDING'
      AND COALESCE(is_deleted, false) = false
      AND (
        ((SELECT auth.uid()) IS NOT NULL AND (user_id = (SELECT auth.uid()) OR created_by = (SELECT auth.uid())))
        OR ((SELECT auth.jwt()->>'email') IS NOT NULL AND LOWER(TRIM(user_email)) = LOWER(TRIM((SELECT auth.jwt()->>'email'))))
      )
    )
  )
  WITH CHECK (
    (SELECT public.is_admin())
    OR (
      status = 'PENDING'
      AND (
        ((SELECT auth.uid()) IS NOT NULL AND (user_id = (SELECT auth.uid()) OR created_by = (SELECT auth.uid())))
        OR ((SELECT auth.jwt()->>'email') IS NOT NULL AND LOWER(TRIM(user_email)) = LOWER(TRIM((SELECT auth.jwt()->>'email'))))
      )
    )
  );

CREATE POLICY "Experiences delete policy"
  ON public.experiences FOR DELETE
  TO authenticated
  USING (
    (SELECT public.is_admin())
    OR (
      status = 'PENDING'
      AND (
        ((SELECT auth.uid()) IS NOT NULL AND (user_id = (SELECT auth.uid()) OR created_by = (SELECT auth.uid())))
        OR ((SELECT auth.jwt()->>'email') IS NOT NULL AND LOWER(TRIM(user_email)) = LOWER(TRIM((SELECT auth.jwt()->>'email'))))
      )
    )
  );


-- 4.2 USER EXPERIENCE UPVOTES
DROP POLICY IF EXISTS "Users manage own experience upvotes" ON public.user_experience_upvotes;
DROP POLICY IF EXISTS "Read experience upvotes" ON public.user_experience_upvotes;
DROP POLICY IF EXISTS "Manage experience upvotes" ON public.user_experience_upvotes;

ALTER TABLE public.user_experience_upvotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own experience upvotes"
  ON public.user_experience_upvotes FOR SELECT
  USING (
    (SELECT public.is_admin())
    OR ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()))
    OR ((SELECT auth.jwt()->>'email') IS NOT NULL AND LOWER(TRIM(user_email)) = LOWER(TRIM((SELECT auth.jwt()->>'email'))))
  );

CREATE POLICY "Users manage own experience upvotes"
  ON public.user_experience_upvotes FOR ALL
  TO authenticated
  USING (
    (SELECT public.is_admin())
    OR ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()))
    OR ((SELECT auth.jwt()->>'email') IS NOT NULL AND LOWER(TRIM(user_email)) = LOWER(TRIM((SELECT auth.jwt()->>'email'))))
  )
  WITH CHECK (
    (SELECT public.is_admin())
    OR ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()))
    OR ((SELECT auth.jwt()->>'email') IS NOT NULL AND LOWER(TRIM(user_email)) = LOWER(TRIM((SELECT auth.jwt()->>'email'))))
  );


-- 4.3 USER BOOKMARKS (Consolidate 4 duplicate policies)
DROP POLICY IF EXISTS "Bookmarks owner access" ON public.user_bookmarks;
DROP POLICY IF EXISTS "Users delete own bookmarks" ON public.user_bookmarks;
DROP POLICY IF EXISTS "Users insert own bookmarks" ON public.user_bookmarks;
DROP POLICY IF EXISTS "Users read own bookmarks" ON public.user_bookmarks;
DROP POLICY IF EXISTS "Users update own bookmarks" ON public.user_bookmarks;

ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own bookmarks"
  ON public.user_bookmarks FOR ALL
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR LOWER(user_email) = LOWER((SELECT auth.jwt()->>'email'))
    OR (SELECT public.is_admin())
  )
  WITH CHECK (
    user_id = (SELECT auth.uid())
    OR LOWER(user_email) = LOWER((SELECT auth.jwt()->>'email'))
    OR (SELECT public.is_admin())
  );


-- 4.4 USER QUESTION PROGRESS
DROP POLICY IF EXISTS "Users can manage own question progress" ON public.user_question_progress;
DROP POLICY IF EXISTS "Users manage own question progress" ON public.user_question_progress;

ALTER TABLE public.user_question_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own question progress"
  ON public.user_question_progress FOR ALL
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR LOWER(user_email) = LOWER((SELECT auth.jwt()->>'email'))
    OR (SELECT public.is_admin())
  )
  WITH CHECK (
    user_id = (SELECT auth.uid())
    OR LOWER(user_email) = LOWER((SELECT auth.jwt()->>'email'))
    OR (SELECT public.is_admin())
  );


-- 4.5 USER TECHNICAL SUBMISSIONS
DROP POLICY IF EXISTS "Users insert own submissions" ON public.user_technical_submissions;
DROP POLICY IF EXISTS "Users read own submissions" ON public.user_technical_submissions;
DROP POLICY IF EXISTS "Super admins manage submissions" ON public.user_technical_submissions;

ALTER TABLE public.user_technical_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own submissions"
  ON public.user_technical_submissions FOR SELECT
  USING (
    LOWER(user_email) = LOWER((SELECT auth.jwt()->>'email'))
    OR (SELECT public.is_admin())
  );

CREATE POLICY "Users insert own submissions"
  ON public.user_technical_submissions FOR INSERT
  TO authenticated
  WITH CHECK (
    LOWER(user_email) = LOWER((SELECT auth.jwt()->>'email'))
    OR (SELECT public.is_admin())
  );

CREATE POLICY "Super admins manage submissions"
  ON public.user_technical_submissions FOR ALL
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));


-- 4.6 USER TECHNICAL, MCQ & INTERVIEW PROGRESS
DROP POLICY IF EXISTS "Users can manage own technical progress" ON public.user_technical_progress;
DROP POLICY IF EXISTS "Users manage own technical progress" ON public.user_technical_progress;
DROP POLICY IF EXISTS "Users can manage own mcq progress" ON public.user_mcq_progress;
DROP POLICY IF EXISTS "Users manage own mcq progress" ON public.user_mcq_progress;
DROP POLICY IF EXISTS "Users can manage own interview progress" ON public.user_interview_progress;
DROP POLICY IF EXISTS "Users manage own interview progress" ON public.user_interview_progress;

ALTER TABLE public.user_technical_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mcq_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interview_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own technical progress"
  ON public.user_technical_progress FOR ALL
  TO authenticated
  USING (
    LOWER(user_email) = LOWER((SELECT auth.jwt()->>'email'))
    OR (SELECT public.is_admin())
  )
  WITH CHECK (
    LOWER(user_email) = LOWER((SELECT auth.jwt()->>'email'))
    OR (SELECT public.is_admin())
  );

CREATE POLICY "Users manage own mcq progress"
  ON public.user_mcq_progress FOR ALL
  TO authenticated
  USING (
    LOWER(user_email) = LOWER((SELECT auth.jwt()->>'email'))
    OR (SELECT public.is_admin())
  )
  WITH CHECK (
    LOWER(user_email) = LOWER((SELECT auth.jwt()->>'email'))
    OR (SELECT public.is_admin())
  );

CREATE POLICY "Users manage own interview progress"
  ON public.user_interview_progress FOR ALL
  TO authenticated
  USING (
    LOWER(user_email) = LOWER((SELECT auth.jwt()->>'email'))
    OR (SELECT public.is_admin())
  )
  WITH CHECK (
    LOWER(user_email) = LOWER((SELECT auth.jwt()->>'email'))
    OR (SELECT public.is_admin())
  );
