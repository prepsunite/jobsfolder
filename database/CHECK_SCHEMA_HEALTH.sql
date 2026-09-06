-- ====================================================================
-- PrepUnite: Database Schema & Migration Health Diagnostic Script
-- Run this in Supabase SQL Editor to check if all migrations were executed.
-- It returns a complete PASS / MISSING checklist.
-- ====================================================================

WITH 
-- 1. Table Checks
table_checks AS (
    SELECT 
        '1. TABLE' AS category,
        t.table_name AS item_name,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name = t.table_name
            ) THEN '✅ PASS (UP TO DATE)'
            ELSE '❌ MISSING'
        END AS status,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name = t.table_name
            ) THEN 'Table is live in PostgreSQL'
            ELSE 'Table does not exist. Run database/MIGRATE_ALL_FIXES.sql'
        END AS details
    FROM (VALUES 
        ('profiles'),
        ('colleges'),
        ('college_students'),
        ('college_batches'),
        ('tpo_authorizations'),
        ('mock_exams'),
        ('mock_exam_sections'),
        ('student_exam_attempts'),
        ('user_subscriptions'),
        ('user_bookmarks'),
        ('user_paper_purchases'),
        ('admin_audit_logs'),
        ('contact_messages'),
        ('paper_tab_nodes'),
        ('companies')
    ) AS t(table_name)
),

-- 2. Column Checks (including latest features like target_batches, validity, quotas)
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
            ) THEN '✅ PASS (UP TO DATE)'
            ELSE '❌ MISSING'
        END AS status,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'public' 
                  AND table_name = c.tbl 
                  AND column_name = c.col
            ) THEN 'Column exists and is accessible'
            ELSE 'Missing column. Run ALTER TABLE from database/MIGRATE_ALL_FIXES.sql'
        END AS details
    FROM (VALUES 
        ('profiles', 'college_id'),
        ('profiles', 'is_tpo_admin'),
        ('profiles', 'roll_number'),
        ('profiles', 'department'),
        ('profiles', 'batch_year'),
        ('colleges', 'max_licenses'),
        ('colleges', 'valid_until'),
        ('colleges', 'contract_status'),
        ('college_students', 'batch_id'),
        ('college_students', 'user_id'),
        ('college_students', 'status'),
        ('college_batches', 'passout_year'),
        ('college_batches', 'departments'),
        ('tpo_authorizations', 'user_id'),
        ('tpo_authorizations', 'max_licenses'),
        ('tpo_authorizations', 'status'),
        ('user_subscriptions', 'payment_id'),
        ('user_subscriptions', 'updated_at'),
        ('mock_exams', 'target_batches'),
        ('mock_exams', 'target_departments'),
        ('mock_exams', 'target_batch_year'),
        ('mock_exams', 'enable_tab_switch_detection'),
        ('mock_exams', 'max_tab_switches_allowed'),
        ('mock_exams', 'enable_fullscreen_lock'),
        ('mock_exam_sections', 'section_order'),
        ('mock_exam_sections', 'marks_per_correct'),
        ('student_exam_attempts', 'student_email'),
        ('student_exam_attempts', 'tab_switch_count'),
        ('student_exam_attempts', 'proctor_events'),
        ('student_exam_attempts', 'max_possible_score'),
        ('student_exam_attempts', 'percentage'),
        ('student_exam_attempts', 'passed'),
        ('paper_tab_nodes', 'is_free')
    ) AS c(tbl, col)
),

-- 3. Function & RPC Signature Version Checks
function_checks AS (
    SELECT 
        '3. RPC FUNCTION' AS category,
        f.func_name AS item_name,
        CASE 
            WHEN NOT EXISTS (
                SELECT 1 FROM pg_proc p
                JOIN pg_namespace n ON p.pronamespace = n.oid
                WHERE n.nspname = 'public' AND p.proname = f.func_name
            ) THEN '❌ MISSING'
            WHEN f.required_arg IS NOT NULL AND NOT EXISTS (
                SELECT 1 FROM pg_proc p
                JOIN pg_namespace n ON p.pronamespace = n.oid
                WHERE n.nspname = 'public' 
                  AND p.proname = f.func_name
                  AND pg_get_function_arguments(p.oid) ILIKE ('%' || f.required_arg || '%')
            ) THEN '⚠️ OUTDATED SIGNATURE'
            ELSE '✅ PASS (UP TO DATE)'
        END AS status,
        CASE 
            WHEN NOT EXISTS (
                SELECT 1 FROM pg_proc p
                JOIN pg_namespace n ON p.pronamespace = n.oid
                WHERE n.nspname = 'public' AND p.proname = f.func_name
            ) THEN 'RPC function missing. Run database/MIGRATE_ALL_FIXES.sql'
            WHEN f.required_arg IS NOT NULL AND NOT EXISTS (
                SELECT 1 FROM pg_proc p
                JOIN pg_namespace n ON p.pronamespace = n.oid
                WHERE n.nspname = 'public' 
                  AND p.proname = f.func_name
                  AND pg_get_function_arguments(p.oid) ILIKE ('%' || f.required_arg || '%')
            ) THEN 'Old version installed (missing parameter ' || f.required_arg || '). Run database/MIGRATE_ALL_FIXES.sql to update'
            ELSE 'Function is live and matches latest version signature'
        END AS details
    FROM (VALUES 
        ('is_admin', NULL),
        ('is_tpo_for_college', 'p_college_id'),
        ('is_any_tpo', NULL),
        ('provision_campus_student_subscription', 'p_college_id'),
        ('check_college_seat_cap', NULL),
        ('check_student_college_entitlement', 'p_email'),
        ('submit_and_grade_mock_attempt', 'p_responses'),
        ('check_user_paper_access', 'p_paper_id'),
        ('get_safe_mock_exam_questions', 'p_mock_exam_id'),
        ('get_mock_exam_attempt_solutions', 'p_attempt_id'),
        ('get_colleges_usage_summary', NULL)
    ) AS f(func_name, required_arg)
),

-- 4. RLS Policy Checks
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
            ) THEN '✅ PASS (UP TO DATE)'
            ELSE '❌ MISSING'
        END AS status,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM pg_policies 
                WHERE schemaname = 'public' 
                  AND tablename = pol.tbl 
                  AND policyname = pol.policy_name
            ) THEN 'Security policy is active'
            ELSE 'Missing policy. Run database/MIGRATE_ALL_FIXES.sql'
        END AS details
    FROM (VALUES 
        ('user_subscriptions', 'TPO coordinator manage college student subscriptions'),
        ('colleges', 'Super admin full colleges'),
        ('student_exam_attempts', 'Student select own attempts'),
        ('student_exam_attempts', 'Student insert own in_progress attempt'),
        ('student_exam_attempts', 'Student update in_progress attempt responses'),
        ('paper_tab_nodes', 'Secure select paper nodes'),
        ('contact_messages', 'Admin full access contact messages')
    ) AS pol(tbl, policy_name)
),

-- Combined Checks
all_checks AS (
    SELECT * FROM table_checks
    UNION ALL
    SELECT * FROM column_checks
    UNION ALL
    SELECT * FROM function_checks
    UNION ALL
    SELECT * FROM policy_checks
)

-- Final Output: All Issues (Missing/Outdated) First, Followed by Healthy Items
SELECT category, item_name, status, details 
FROM all_checks
ORDER BY 
    CASE 
        WHEN status LIKE '❌%' THEN 1 
        WHEN status LIKE '⚠️%' THEN 2 
        ELSE 3 
    END,
    category, 
    item_name;
