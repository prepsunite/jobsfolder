-- ====================================================================
-- PREPUNITE ENTERPRISE ANALYTICS AGGREGATION ENGINE
-- High-Performance Server-Side Analytics for NIRF / NAAC Criterion 5.2
-- ====================================================================

-- 1. High-Performance Composite Indexes for Sub-10ms Analytics
CREATE INDEX IF NOT EXISTS idx_student_exam_attempts_analytics 
ON public.student_exam_attempts (college_id, status, total_score DESC);

CREATE INDEX IF NOT EXISTS idx_student_exam_attempts_exam_status 
ON public.student_exam_attempts (mock_exam_id, status);

CREATE INDEX IF NOT EXISTS idx_student_exam_attempts_student_lookup 
ON public.student_exam_attempts (student_id, student_email);

CREATE INDEX IF NOT EXISTS idx_college_students_roster_lookup 
ON public.college_students (college_id, email, roll_number, department);

-- 2. Authoritative Server-Side Placement Analytics Function
-- Eliminates client-side JSON over-fetching (30MB+ -> <2KB)
-- Calculates canonical unique student standings, placement tiers, and department benchmarks
CREATE OR REPLACE FUNCTION public.get_college_placement_analytics(
    p_college_id TEXT,
    p_batch TEXT DEFAULT NULL,
    p_department TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_total_students INT := 0;
    v_unique_evaluated INT := 0;
    v_untested_count INT := 0;
    v_avg_score NUMERIC := 0.00;
    v_tier1_count INT := 0;
    v_tier2_count INT := 0;
    v_tier3_count INT := 0;
    v_malpractice_count INT := 0;
    v_total_attempts INT := 0;
    v_tier1_attempts INT := 0;
    v_tier2_attempts INT := 0;
    v_tier3_attempts INT := 0;
    v_departments_json JSONB := '[]'::jsonb;
    v_result JSONB;
BEGIN
    -- 1. Count enrolled roster students for this college (optionally filtered by batch and department)
    SELECT COUNT(*) INTO v_total_students
    FROM public.college_students cs
    WHERE cs.college_id::TEXT = p_college_id::TEXT
      AND (p_batch IS NULL OR p_batch = 'ALL' OR cs.batch_id::TEXT = p_batch OR cs.batch_year::TEXT = p_batch)
      AND (p_department IS NULL OR p_department = 'ALL' OR upper(cs.department) = upper(p_department));

    -- 2. Analyze completed, authoritative student attempts
    -- Groups by canonical student identity to prevent candidate double-counting
    WITH valid_college_exams AS (
        SELECT id FROM public.mock_exams 
        WHERE college_id::TEXT = p_college_id::TEXT 
          AND is_deleted = false
    ),
    valid_attempts AS (
        SELECT 
            a.id,
            a.mock_exam_id,
            a.student_id,
            COALESCE(NULLIF(trim(a.student_email), ''), cs.email, a.student_id) AS canonical_email,
            COALESCE(cs.department, 'GENERAL') AS department,
            cs.batch_id,
            cs.batch_year,
            a.percentage,
            a.total_score,
            a.status
        FROM public.student_exam_attempts a
        INNER JOIN valid_college_exams e ON e.id = a.mock_exam_id
        LEFT JOIN public.college_students cs ON (
            lower(cs.email) = lower(trim(COALESCE(a.student_email, a.student_id)))
            OR cs.id::TEXT = a.student_id::TEXT
            OR (cs.user_id IS NOT NULL AND cs.user_id::TEXT = a.student_id::TEXT)
        ) AND cs.college_id::TEXT = p_college_id::TEXT
        WHERE a.college_id::TEXT = p_college_id::TEXT
          AND a.status IN ('SUBMITTED', 'GRADED', 'TIMED_OUT', 'TERMINATED_MALPRACTICE')
          AND (p_batch IS NULL OR p_batch = 'ALL' OR cs.batch_id::TEXT = p_batch OR cs.batch_year::TEXT = p_batch)
          AND (p_department IS NULL OR p_department = 'ALL' OR upper(cs.department) = upper(p_department))
    ),
    attempt_tier_counts AS (
        SELECT
            COUNT(*) AS total_att,
            COUNT(*) FILTER (WHERE percentage >= 70.0 AND status <> 'TERMINATED_MALPRACTICE') AS t1_att,
            COUNT(*) FILTER (WHERE percentage >= 50.0 AND percentage < 70.0 AND status <> 'TERMINATED_MALPRACTICE') AS t2_att,
            COUNT(*) FILTER (WHERE percentage < 50.0 OR status = 'TERMINATED_MALPRACTICE') AS t3_att
        FROM valid_attempts
    ),
    student_aggregates AS (
        SELECT 
            canonical_email,
            upper(department) AS department,
            AVG(percentage) AS student_avg,
            BOOL_OR(status = 'TERMINATED_MALPRACTICE') AS has_malpractice,
            COUNT(*) AS attempts_count
        FROM valid_attempts
        GROUP BY canonical_email, upper(department)
    ),
    department_benchmarks AS (
        SELECT 
            d.dept_name,
            COUNT(cs.id) AS enrolled_candidates,
            COUNT(sa.canonical_email) AS evaluated_candidates,
            COALESCE(ROUND(AVG(sa.student_avg), 1), 0.0) AS avg_score
        FROM (
            SELECT DISTINCT upper(department) AS dept_name FROM public.college_students WHERE college_id::TEXT = p_college_id::TEXT
            UNION
            SELECT DISTINCT department FROM student_aggregates
        ) d
        LEFT JOIN public.college_students cs 
            ON upper(cs.department) = d.dept_name 
            AND cs.college_id::TEXT = p_college_id::TEXT
            AND (p_batch IS NULL OR p_batch = 'ALL' OR cs.batch_id::TEXT = p_batch OR cs.batch_year::TEXT = p_batch)
        LEFT JOIN student_aggregates sa 
            ON sa.department = d.dept_name
        GROUP BY d.dept_name
    )
    SELECT 
        COALESCE((SELECT total_att FROM attempt_tier_counts), 0),
        COALESCE((SELECT t1_att FROM attempt_tier_counts), 0),
        COALESCE((SELECT t2_att FROM attempt_tier_counts), 0),
        COALESCE((SELECT t3_att FROM attempt_tier_counts), 0),
        COUNT(*),
        COALESCE(ROUND(AVG(student_avg), 1), 0.0),
        COUNT(*) FILTER (WHERE NOT has_malpractice AND student_avg >= 70.0),
        COUNT(*) FILTER (WHERE NOT has_malpractice AND student_avg >= 50.0 AND student_avg < 70.0),
        COUNT(*) FILTER (WHERE NOT has_malpractice AND student_avg < 50.0),
        COUNT(*) FILTER (WHERE has_malpractice)
    INTO 
        v_total_attempts,
        v_tier1_attempts,
        v_tier2_attempts,
        v_tier3_attempts,
        v_unique_evaluated,
        v_avg_score,
        v_tier1_count,
        v_tier2_count,
        v_tier3_count,
        v_malpractice_count
    FROM student_aggregates;

    -- Untested count: enrolled minus evaluated
    v_untested_count := GREATEST(0, v_total_students - v_unique_evaluated);

    -- Format departments breakdown JSON
    SELECT jsonb_agg(
        jsonb_build_object(
            'department', dept_name,
            'studentCount', enrolled_candidates,
            'evaluatedCount', evaluated_candidates,
            'avgScore', avg_score
        )
    )
    INTO v_departments_json
    FROM (
        SELECT 
            d.dept_name,
            COUNT(cs.id) AS enrolled_candidates,
            COUNT(sa.canonical_email) AS evaluated_candidates,
            COALESCE(ROUND(AVG(sa.student_avg), 1), 0.0) AS avg_score
        FROM (
            SELECT DISTINCT upper(department) AS dept_name FROM public.college_students WHERE college_id::TEXT = p_college_id::TEXT
            UNION
            SELECT DISTINCT upper(department) FROM student_aggregates
        ) d
        LEFT JOIN public.college_students cs 
            ON upper(cs.department) = d.dept_name 
            AND cs.college_id::TEXT = p_college_id::TEXT
        LEFT JOIN student_aggregates sa 
            ON sa.department = d.dept_name
        GROUP BY d.dept_name
        ORDER BY d.dept_name ASC
    ) depts;

    v_result := jsonb_build_object(
        'success', true,
        'college_id', p_college_id,
        'totalStudents', v_total_students,
        'uniqueStudentsEvaluated', v_unique_evaluated,
        'untestedStudentsCount', v_untested_count,
        'totalAttempts', v_total_attempts,
        'avgCollegeScore', v_avg_score,
        'tierCounts', jsonb_build_object(
            'tier1', v_tier1_count,
            'tier2', v_tier2_count,
            'tier3', v_tier3_count,
            'malpractice', v_malpractice_count,
            'tier1Attempts', v_tier1_attempts,
            'tier2Attempts', v_tier2_attempts,
            'tier3Attempts', v_tier3_attempts
        ),
        'departments', COALESCE(v_departments_json, '[]'::jsonb)
    );

    RETURN v_result;
END;
$$;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.get_college_placement_analytics(TEXT, TEXT, TEXT) TO authenticated, service_role, anon;
