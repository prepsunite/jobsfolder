-- ====================================================================
-- PrepUnite: Database Schema & Migration Health Diagnostic Script
-- Run this in Supabase SQL Editor to check if all migrations were executed.
-- It returns a complete PASS / MISSING checklist.
-- ====================================================================

WITH 
-- 1. Check Required Tables
table_checks AS (
    SELECT 
        'TABLE' AS category,
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
            ) THEN 'Table exists'
            ELSE 'Needs table creation from MIGRATE_ALL_FIXES.sql'
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
        ('admin_audit_logs')
    ) AS t(table_name)
),

-- 2. Check Critical Columns
column_checks AS (
    SELECT 
        'COLUMN' AS category,
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
            ) THEN 'Column exists'
            ELSE 'Needs ALTER TABLE from MIGRATE_ALL_FIXES.sql'
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
        ('college_students', 'user_id'),
        ('college_students', 'batch_id'),
        ('college_students', 'status'),
        ('tpo_authorizations', 'user_id'),
        ('tpo_authorizations', 'max_licenses'),
        ('user_subscriptions', 'updated_at'),
        ('user_subscriptions', 'payment_id'),
        ('student_exam_attempts', 'student_email'),
        ('student_exam_attempts', 'proctor_events'),
        ('student_exam_attempts', 'tab_switch_count')
    ) AS c(tbl, col)
),

-- 3. Check Critical RPC Functions
function_checks AS (
    SELECT 
        'FUNCTION / RPC' AS category,
        f.func_name AS item_name,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM pg_proc p
                JOIN pg_namespace n ON p.pronamespace = n.oid
                WHERE n.nspname = 'public' 
                  AND p.proname = f.func_name
            ) THEN '✅ PASS'
            ELSE '❌ MISSING'
        END AS status,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM pg_proc p
                JOIN pg_namespace n ON p.pronamespace = n.oid
                WHERE n.nspname = 'public' 
                  AND p.proname = f.func_name
            ) THEN 'RPC function is live in Postgres'
            ELSE 'Needs CREATE FUNCTION from MIGRATE_ALL_FIXES.sql'
        END AS details
    FROM (VALUES 
        ('is_admin'),
        ('is_tpo_for_college'),
        ('is_any_tpo'),
        ('provision_campus_student_subscription'),
        ('check_college_seat_cap'),
        ('check_student_college_entitlement'),
        ('submit_and_grade_mock_attempt'),
        ('check_user_paper_access')
    ) AS f(func_name)
),

-- 4. Check RLS Policies
policy_checks AS (
    SELECT 
        'RLS POLICY' AS category,
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
            ) THEN 'Policy active'
            ELSE 'Needs CREATE POLICY from MIGRATE_ALL_FIXES.sql'
        END AS details
    FROM (VALUES 
        ('user_subscriptions', 'TPO coordinator manage college student subscriptions'),
        ('colleges', 'Super admin full colleges'),
        ('student_exam_attempts', 'Super admin full attempts'),
        ('student_exam_attempts', 'Student manage own attempts'),
        ('student_exam_attempts', 'TPO view college attempts')
    ) AS pol(tbl, policy_name)
)

-- Unified Output: All Missing Items First, Followed by Passed Items
SELECT category, item_name, status, details 
FROM (
    SELECT * FROM table_checks
    UNION ALL
    SELECT * FROM column_checks
    UNION ALL
    SELECT * FROM function_checks
    UNION ALL
    SELECT * FROM policy_checks
) checks
ORDER BY 
    CASE WHEN status = '❌ MISSING' THEN 1 ELSE 2 END,
    category, 
    item_name;
