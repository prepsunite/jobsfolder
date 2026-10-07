-- ====================================================================
-- PrepUnite: Master Migration & Database Health Diagnostic Inspector
-- Target: Supabase SQL Editor
--
-- PURPOSE:
-- Verifies whether all database migrations, tables, columns, RLS security
-- policies, rate-limiting triggers, performance indexes, and DPDP compliance
-- procedures have been executed and are live in your Supabase database.
--
-- HOW TO USE:
-- 1. Copy and paste this entire script into your Supabase SQL Editor.
-- 2. Click "Run" (or Ctrl + Enter).
-- 3. Any missing items (❌ MISSING / ⚠️ INSECURE) will sort to the TOP
--    with the EXACT .sql file you need to run to fix them.
-- ====================================================================

WITH 
-- --------------------------------------------------------------------
-- 1. Table Existence Checks
-- --------------------------------------------------------------------
table_checks AS (
    SELECT 
        '1. TABLE' AS category,
        t.table_name AS item_name,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name = t.table_name
            ) THEN '✅ PASS'
            ELSE '❌ MISSING'
        END AS status,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name = t.table_name
            ) THEN 'Table is active and accessible'
            ELSE 'Missing table. Run: ' || t.migration_file
        END AS details,
        t.migration_file AS fix_file
    FROM (VALUES 
        -- Core & Auth
        ('profiles', 'database/MIGRATE_ALL_FIXES.sql'),
        ('colleges', 'database/MIGRATE_ALL_FIXES.sql'),
        ('college_students', 'database/MIGRATE_ALL_FIXES.sql'),
        ('college_batches', 'database/MIGRATE_ALL_FIXES.sql'),
        ('tpo_authorizations', 'database/MIGRATE_ALL_FIXES.sql'),
        ('admin_audit_logs', 'database/MIGRATE_ALL_FIXES.sql'),
        ('user_subscriptions', 'database/MIGRATE_ALL_FIXES.sql'),
        ('user_bookmarks', 'database/MIGRATE_ALL_FIXES.sql'),
        ('user_paper_purchases', 'database/MIGRATE_ALL_FIXES.sql'),
        -- Assessment & Exams
        ('mock_exams', 'database/MIGRATE_ALL_FIXES.sql'),
        ('mock_exam_sections', 'database/MIGRATE_ALL_FIXES.sql'),
        ('student_exam_attempts', 'database/MIGRATE_ALL_FIXES.sql'),
        -- Technical & Interview Modules
        ('technical_topics', 'database/create_technical_and_interview_tables.sql'),
        ('technical_problems', 'database/create_technical_and_interview_tables.sql'),
        ('technical_mcqs', 'database/create_technical_and_interview_tables.sql'),
        ('interview_topics', 'database/create_technical_and_interview_tables.sql'),
        ('interview_questions', 'database/create_technical_and_interview_tables.sql'),
        ('experiences', 'database/MIGRATE_ALL_FIXES.sql'),
        -- Aptitude & Company Hub
        ('aptitude_topics', 'database/create_aptitude_topics.sql'),
        ('topic_questions', 'database/MIGRATE_ALL_FIXES.sql'),
        ('companies', 'database/MIGRATE_ALL_FIXES.sql'),
        ('paper_tab_nodes', 'database/FIX_PAPER_TAB_NODES.sql'),
        -- Feedback & Communication
        ('question_reports', 'database/create_feedback_reports_and_contact.sql'),
        ('contact_messages', 'database/create_feedback_reports_and_contact.sql')
    ) AS t(table_name, migration_file)
),

-- --------------------------------------------------------------------
-- 2. Critical Column Checks (Verifies incremental migration patches)
-- --------------------------------------------------------------------
column_checks AS (
    SELECT 
        '2. COLUMN' AS category,
        c.tbl || '.' || c.col AS item_name,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'public' 
                  AND table_name = c.tbl 
                  AND column_name = c.col
            ) THEN '✅ PASS'
            ELSE '❌ MISSING'
        END AS status,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'public' 
                  AND table_name = c.tbl 
                  AND column_name = c.col
            ) THEN 'Column exists with proper schema mapping'
            ELSE 'Missing column. Run: ' || c.migration_file
        END AS details,
        c.migration_file AS fix_file
    FROM (VALUES 
        -- Profiles DPDP & TPO
        ('profiles', 'college_id', 'database/MIGRATE_ALL_FIXES.sql'),
        ('profiles', 'is_tpo_admin', 'database/MIGRATE_ALL_FIXES.sql'),
        ('profiles', 'roll_number', 'database/MIGRATE_ALL_FIXES.sql'),
        ('profiles', 'consent_status', 'database/dpdp_consent_proof.sql'),
        ('profiles', 'consent_accepted_at', 'database/dpdp_consent_proof.sql'),
        -- Colleges
        ('colleges', 'max_licenses', 'database/MIGRATE_ALL_FIXES.sql'),
        ('colleges', 'valid_until', 'database/MIGRATE_ALL_FIXES.sql'),
        ('colleges', 'contract_status', 'database/MIGRATE_ALL_FIXES.sql'),
        -- Students & Batches
        ('college_students', 'batch_id', 'database/MIGRATE_ALL_FIXES.sql'),
        ('college_students', 'user_id', 'database/MIGRATE_ALL_FIXES.sql'),
        ('college_students', 'roll_number', 'database/MIGRATE_ALL_FIXES.sql'),
        ('college_batches', 'passout_year', 'database/MIGRATE_ALL_FIXES.sql'),
        ('college_batches', 'departments', 'database/MIGRATE_ALL_FIXES.sql'),
        -- Mock Exams Targeting & Anti-Cheat
        ('mock_exams', 'target_batches', 'database/MIGRATE_ALL_FIXES.sql'),
        ('mock_exams', 'target_departments', 'database/MIGRATE_ALL_FIXES.sql'),
        ('mock_exams', 'enable_tab_switch_detection', 'database/MIGRATE_ALL_FIXES.sql'),
        ('mock_exams', 'max_tab_switches_allowed', 'database/MIGRATE_ALL_FIXES.sql'),
        ('mock_exams', 'enable_fullscreen_lock', 'database/MIGRATE_ALL_FIXES.sql'),
        -- Exam Attempts Telemetry
        ('student_exam_attempts', 'student_id', 'database/MIGRATE_ALL_FIXES.sql'),
        ('student_exam_attempts', 'tab_switch_count', 'database/MIGRATE_ALL_FIXES.sql'),
        ('student_exam_attempts', 'proctor_events', 'database/MIGRATE_ALL_FIXES.sql'),
        ('student_exam_attempts', 'passed', 'database/MIGRATE_ALL_FIXES.sql'),
        ('student_exam_attempts', 'responses', 'database/MIGRATE_ALL_FIXES.sql'),
        -- Company & Paper Visibility
        ('companies', 'is_hidden', 'database/ADD_COMPANY_IS_HIDDEN.sql'),
        ('paper_tab_nodes', 'is_free', 'database/FIX_PAPER_TAB_NODES.sql'),
        -- Feedback & Rate Limiting Fields
        ('question_reports', 'reporter_email', 'database/create_feedback_reports_and_contact.sql'),
        ('contact_messages', 'subject', 'database/create_feedback_reports_and_contact.sql')
    ) AS c(tbl, col, migration_file)
),

-- --------------------------------------------------------------------
-- 3. Row Level Security (RLS) Status (Checks if RLS is strictly ENABLED)
-- --------------------------------------------------------------------
rls_status_checks AS (
    SELECT 
        '3. RLS SECURITY' AS category,
        r.table_name AS item_name,
        CASE 
            WHEN NOT EXISTS (
                SELECT 1 FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name = r.table_name
            ) THEN '❌ TABLE MISSING'
            WHEN EXISTS (
                SELECT 1 FROM pg_tables 
                WHERE schemaname = 'public' 
                  AND tablename = r.table_name 
                  AND rowsecurity = true
            ) THEN '✅ PASS (RLS ENABLED)'
            ELSE '⚠️ INSECURE (RLS DISABLED)'
        END AS status,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM pg_tables 
                WHERE schemaname = 'public' 
                  AND tablename = r.table_name 
                  AND rowsecurity = true
            ) THEN 'Row Level Security is active'
            ELSE 'Table is exposed to unauthorized modifications! Run: ' || r.migration_file
        END AS details,
        r.migration_file AS fix_file
    FROM (VALUES 
        ('technical_problems', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('technical_mcqs', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('technical_topics', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('interview_topics', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('interview_questions', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('topic_questions', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('mock_exams', 'database/MIGRATE_ALL_FIXES.sql'),
        ('student_exam_attempts', 'database/MIGRATE_ALL_FIXES.sql'),
        ('colleges', 'database/MIGRATE_ALL_FIXES.sql'),
        ('college_students', 'database/MIGRATE_ALL_FIXES.sql'),
        ('tpo_authorizations', 'database/MIGRATE_ALL_FIXES.sql'),
        ('profiles', 'database/MIGRATE_ALL_FIXES.sql'),
        ('user_subscriptions', 'database/MIGRATE_ALL_FIXES.sql')
    ) AS r(table_name, migration_file)
),

-- --------------------------------------------------------------------
-- 4. Key Security Policies (RLS Policies on mutations & reads)
-- --------------------------------------------------------------------
policy_checks AS (
    SELECT 
        '4. RLS POLICY' AS category,
        pol.tbl || ': ' || pol.policy_name AS item_name,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM pg_policies 
                WHERE schemaname = 'public' 
                  AND tablename = pol.tbl 
                  AND policyname = pol.policy_name
            ) THEN '✅ PASS'
            ELSE '❌ MISSING'
        END AS status,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM pg_policies 
                WHERE schemaname = 'public' 
                  AND tablename = pol.tbl 
                  AND policyname = pol.policy_name
            ) THEN 'Policy is enforced by PostgreSQL engine'
            ELSE 'Missing security policy. Run: ' || pol.migration_file
        END AS details,
        pol.migration_file AS fix_file
    FROM (VALUES 
        ('technical_problems', 'Public read technical_problems', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('technical_problems', 'Admins insert technical_problems', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('technical_mcqs', 'Public read technical_mcqs', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('technical_mcqs', 'Admins insert technical_mcqs', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('technical_topics', 'Public read technical_topics', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('interview_topics', 'Public read interview_topics', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('interview_questions', 'Public read interview_questions', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('topic_questions', 'Public read topic_questions', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('topic_questions', 'Admins insert topic_questions', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('student_exam_attempts', 'Student select own attempts', 'database/MIGRATE_ALL_FIXES.sql'),
        ('contact_messages', 'Admin full access contact messages', 'database/MIGRATE_ALL_FIXES.sql')
    ) AS pol(tbl, policy_name, migration_file)
),

-- --------------------------------------------------------------------
-- 5. Triggers (Anti-Abuse, Rate-Limiting & Auto-Numbering)
-- --------------------------------------------------------------------
trigger_checks AS (
    SELECT 
        '5. TRIGGER' AS category,
        trg.tbl || ' -> ' || trg.trigger_name AS item_name,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM information_schema.triggers 
                WHERE trigger_schema = 'public' 
                  AND event_object_table = trg.tbl 
                  AND trigger_name = trg.trigger_name
            ) THEN '✅ PASS'
            ELSE '❌ MISSING'
        END AS status,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM information_schema.triggers 
                WHERE trigger_schema = 'public' 
                  AND event_object_table = trg.tbl 
                  AND trigger_name = trg.trigger_name
            ) THEN 'Trigger is active on table events'
            ELSE 'Missing trigger. Run: ' || trg.migration_file
        END AS details,
        trg.migration_file AS fix_file
    FROM (VALUES 
        ('question_reports', 'trg_question_reports_rate_limit', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('contact_messages', 'trg_contact_messages_rate_limit', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('topic_questions', 'trg_assign_topic_question_number', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql')
    ) AS trg(tbl, trigger_name, migration_file)
),

-- --------------------------------------------------------------------
-- 6. Functions & Stored Procedures
-- --------------------------------------------------------------------
function_checks AS (
    SELECT 
        '6. FUNCTION' AS category,
        f.func_name || '()' AS item_name,
        CASE 
            WHEN NOT EXISTS (
                SELECT 1 FROM pg_proc p
                JOIN pg_namespace n ON p.pronamespace = n.oid
                WHERE n.nspname = 'public' AND p.proname = f.func_name
            ) THEN '❌ MISSING'
            ELSE '✅ PASS'
        END AS status,
        CASE 
            WHEN NOT EXISTS (
                SELECT 1 FROM pg_proc p
                JOIN pg_namespace n ON p.pronamespace = n.oid
                WHERE n.nspname = 'public' AND p.proname = f.func_name
            ) THEN 'Function does not exist. Run: ' || f.migration_file
            ELSE 'Function is compiled and executable'
        END AS details,
        f.migration_file AS fix_file
    FROM (VALUES 
        ('is_admin', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('enforce_question_reports_rate_limit', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('enforce_contact_messages_rate_limit', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('assign_topic_question_number', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('dpdp_delete_user_data', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('is_tpo_for_college', 'database/FIX_TPO_STUDENT_DELETION_AND_ROLES.sql'),
        ('is_any_tpo', 'database/MIGRATE_ALL_FIXES.sql'),
        ('remove_college_student', 'database/FIX_TPO_STUDENT_DELETION_AND_ROLES.sql'),
        ('assign_college_tpo', 'database/FIX_TPO_STUDENT_DELETION_AND_ROLES.sql'),
        ('revoke_college_tpo', 'database/FIX_TPO_STUDENT_DELETION_AND_ROLES.sql'),
        ('check_student_college_entitlement', 'database/MIGRATE_ALL_FIXES.sql'),
        ('get_colleges_usage_summary', 'database/MIGRATE_ALL_FIXES.sql')
    ) AS f(func_name, migration_file)
),

-- --------------------------------------------------------------------
-- 7. High-Performance Composite Indexes
-- --------------------------------------------------------------------
index_checks AS (
    SELECT 
        '7. INDEX' AS category,
        idx.tbl || '.' || idx.index_name AS item_name,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM pg_indexes 
                WHERE schemaname = 'public' 
                  AND tablename = idx.tbl 
                  AND indexname = idx.index_name
            ) THEN '✅ PASS'
            ELSE '❌ MISSING'
        END AS status,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM pg_indexes 
                WHERE schemaname = 'public' 
                  AND tablename = idx.tbl 
                  AND indexname = idx.index_name
            ) THEN 'Performance index is active'
            ELSE 'Missing index. Run: ' || idx.migration_file
        END AS details,
        idx.migration_file AS fix_file
    FROM (VALUES 
        ('topic_questions', 'idx_topic_questions_perf', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('technical_problems', 'idx_technical_problems_perf', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('technical_mcqs', 'idx_technical_mcqs_perf', 'database/DEPLOY_SUPER_ADMIN_SECURITY_PATCHES.sql'),
        ('companies', 'idx_companies_is_hidden', 'database/ADD_COMPANY_IS_HIDDEN.sql'),
        ('profiles', 'idx_profiles_consent', 'database/dpdp_consent_proof.sql'),
        ('question_reports', 'idx_question_reports_status', 'database/create_feedback_reports_and_contact.sql'),
        ('contact_messages', 'idx_contact_messages_status', 'database/create_feedback_reports_and_contact.sql')
    ) AS idx(tbl, index_name, migration_file)
),

-- --------------------------------------------------------------------
-- Consolidated Union of All Verifications
-- --------------------------------------------------------------------
all_checks AS (
    SELECT * FROM table_checks
    UNION ALL
    SELECT * FROM column_checks
    UNION ALL
    SELECT * FROM rls_status_checks
    UNION ALL
    SELECT * FROM policy_checks
    UNION ALL
    SELECT * FROM trigger_checks
    UNION ALL
    SELECT * FROM function_checks
    UNION ALL
    SELECT * FROM index_checks
)

-- --------------------------------------------------------------------
-- Final Output:
-- 1. All FAILING/MISSING/INSECURE items appear FIRST so you see blockers immediately.
-- 2. Followed by passing items grouped cleanly by category.
-- --------------------------------------------------------------------
SELECT 
    category,
    item_name,
    status,
    details,
    CASE 
        WHEN status LIKE '✅%' THEN 'None (Healthy)'
        ELSE fix_file 
    END AS action_required_run_file
FROM all_checks
ORDER BY 
    CASE 
        WHEN status LIKE '❌%' THEN 1 
        WHEN status LIKE '⚠️%' THEN 2 
        ELSE 3 
    END,
    category, 
    item_name;
