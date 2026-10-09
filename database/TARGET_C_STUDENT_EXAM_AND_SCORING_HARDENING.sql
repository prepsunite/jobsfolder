-- ====================================================================
-- PrepUnite Target C Hardening: Student Exam Engine & Proctoring Security
-- Run this in your Supabase SQL Editor
-- ====================================================================

-- 1. Anti-Tamper Trigger: Protect exam attempt score columns from client forgery
CREATE OR REPLACE FUNCTION public.protect_exam_attempt_score_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- Service role, postgres superuser, and SECURITY DEFINER RPCs can update scores; regular client tokens cannot
  IF (auth.jwt() ->> 'role') != 'service_role' AND current_user != 'postgres' THEN
    IF (OLD.status IN ('SUBMITTED', 'GRADED', 'TIMED_OUT', 'TERMINATED_MALPRACTICE')) THEN
      RAISE EXCEPTION 'Finalized exam attempts are immutable.';
    END IF;
    -- Forbid candidate client from manually altering scoring columns directly
    NEW.total_score := OLD.total_score;
    NEW.percentage := OLD.percentage;
    NEW.passed := OLD.passed;
    NEW.max_possible_score := OLD.max_possible_score;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_attempt_scores ON public.student_exam_attempts;
CREATE TRIGGER trg_protect_attempt_scores
BEFORE UPDATE ON public.student_exam_attempts
FOR EACH ROW
EXECUTE FUNCTION public.protect_exam_attempt_score_columns();


-- 2. Multi-Tenant Shadow Sync Data Leakage Fix: Secure contact_messages RLS
-- Revoke the overly permissive "subject LIKE 'B2B_%'" rule that leaked student attempts to candidates
DROP POLICY IF EXISTS "Authorized select contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Public select B2B exam messages" ON public.contact_messages;

CREATE POLICY "Authorized select contact messages" ON public.contact_messages
  FOR SELECT USING (
    public.is_admin()
    OR (
      public.is_any_tpo() 
      AND email IN (SELECT email FROM public.college_students WHERE college_id = (auth.jwt()->>'college_id')::uuid)
    )
  );


-- 3. Secure Views for Question Banks: Prevent leakage of correct_answer during exams
CREATE OR REPLACE VIEW public.safe_topic_questions AS
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


-- 4. Server-Side Clock Timestamp RPC: Eliminates client laptop clock skew
CREATE OR REPLACE FUNCTION public.get_server_timestamp()
RETURNS TIMESTAMPTZ
LANGUAGE sql
STABLE
AS $$
  SELECT NOW();
$$;

GRANT EXECUTE ON FUNCTION public.get_server_timestamp() TO authenticated, anon;


-- 5. Comprehensive submit_exam_attempt_v2 RPC (Unified Grading Engine)
CREATE OR REPLACE FUNCTION public.submit_exam_attempt_v2(
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
SET search_path = public, pg_temp
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
    v_total_score NUMERIC := 0.00;
    v_max_possible_score NUMERIC := 0.00;
    v_percentage NUMERIC := 0.00;
    v_passed BOOLEAN := false;
    v_status TEXT;
    v_graded_responses JSONB := '{}'::jsonb;
    v_item_resp JSONB;
    v_marked_review BOOLEAN;
    v_time_spent INT;
    v_raw_correct TEXT;
    v_effective_tab_switches INT;
    
    -- Sectional metrics
    v_sec_q_count INT;
    v_sec_attempted INT;
    v_sec_correct INT;
    v_sec_incorrect INT;
    v_sec_score NUMERIC;
    v_sec_max NUMERIC;
    v_clamped_sec_score NUMERIC;
    
    -- Aggregated metrics
    v_total_questions INT := 0;
    v_total_attempted INT := 0;
    v_total_correct INT := 0;
    v_total_incorrect INT := 0;
    v_sections_summary JSONB := '[]'::jsonb;
    v_result_summary JSONB;
    
    -- Coding question evaluation variables
    v_test_cases_passed INT;
    v_total_test_cases INT;
    v_pass_ratio NUMERIC;
    v_coding_marks NUMERIC;
BEGIN
    -- 1. Anti-Tamper: Sanitize time spent
    IF p_time_spent_seconds IS NULL OR p_time_spent_seconds < 0 THEN
        p_time_spent_seconds := 0;
    END IF;

    -- 2. Fetch Attempt
    SELECT * INTO v_attempt 
    FROM public.student_exam_attempts 
    WHERE id::TEXT = p_attempt_id::TEXT;

    IF v_attempt IS NULL THEN
        RAISE EXCEPTION 'Attempt % not found.', p_attempt_id;
    END IF;

    -- 3. Caller Authorization Guard
    IF NOT (
        public.is_admin() OR
        public.is_tpo_for_college(v_attempt.college_id::TEXT) OR
        v_attempt.student_id::TEXT = COALESCE(auth.uid()::TEXT, '') OR
        v_attempt.student_id::TEXT = lower(COALESCE(auth.jwt()->>'email', '')) OR
        lower(COALESCE(v_attempt.student_email, '')) = lower(COALESCE(auth.jwt()->>'email', '')) OR
        (auth.jwt() ->> 'role') = 'service_role'
    ) THEN
        RAISE EXCEPTION 'Unauthorized: You do not own this exam attempt.';
    END IF;

    -- 4. Idempotency & Finality Guard
    IF v_attempt.status IN ('SUBMITTED', 'GRADED', 'TIMED_OUT', 'TERMINATED_MALPRACTICE') AND NOT public.is_admin() THEN
        -- Return existing result idempotently rather than failing
        RETURN jsonb_build_object(
            'id', v_attempt.id,
            'status', v_attempt.status,
            'total_score', v_attempt.total_score,
            'max_possible_score', v_attempt.max_possible_score,
            'percentage', v_attempt.percentage,
            'passed', v_attempt.passed,
            'already_finalized', true
        );
    END IF;

    -- 5. Fetch Exam
    SELECT * INTO v_exam 
    FROM public.mock_exams 
    WHERE id::TEXT = v_attempt.mock_exam_id::TEXT;

    IF v_exam IS NULL THEN
        RAISE EXCEPTION 'Associated mock exam not found.';
    END IF;

    -- 6. Schedule Window Guard (Allow 5 minutes grace period for network latency)
    IF v_exam.end_time IS NOT NULL AND NOW() > (v_exam.end_time + INTERVAL '5 minutes') AND NOT public.is_admin() THEN
        v_status := 'TIMED_OUT';
    END IF;

    -- 7. Anti-Tamper Proctoring Violations Calculation
    v_effective_tab_switches := GREATEST(
        COALESCE(p_tab_switch_count, 0),
        COALESCE(v_attempt.tab_switch_count, 0),
        jsonb_array_length(COALESCE(p_proctor_events, '[]'::jsonb))
    );

    IF v_status IS NULL THEN
        IF p_status_override = 'TERMINATED_MALPRACTICE' OR 
           (v_exam.enable_tab_switch_detection AND v_effective_tab_switches >= COALESCE(v_exam.max_tab_switches_allowed, 3)) THEN
            v_status := 'TERMINATED_MALPRACTICE';
        ELSIF p_status_override IS NOT NULL AND p_status_override != '' THEN
            v_status := p_status_override;
        ELSE
            v_status := 'SUBMITTED';
        END IF;
    END IF;

    -- 8. Section-by-Section Deterministic Grading
    FOR v_section IN 
        SELECT * FROM public.mock_exam_sections 
        WHERE mock_exam_id::TEXT = v_exam.id::TEXT
        ORDER BY section_order ASC
    LOOP
        v_marks_per_q := COALESCE(v_section.marks_per_correct, 1.00);
        v_neg_mark := COALESCE(v_section.negative_marking, 0.00);
        v_sec_q_count := 0;
        v_sec_attempted := 0;
        v_sec_correct := 0;
        v_sec_incorrect := 0;
        v_sec_score := 0.00;
        v_sec_max := 0.00;

        IF v_section.question_ids IS NOT NULL THEN
            FOREACH v_q_id IN ARRAY v_section.question_ids
            LOOP
                v_sec_max := v_sec_max + v_marks_per_q;
                v_max_possible_score := v_max_possible_score + v_marks_per_q;
                v_total_questions := v_total_questions + 1;
                v_sec_q_count := v_sec_q_count + 1;

                v_item_resp := p_responses -> v_q_id;
                v_marked_review := COALESCE(
                    (v_item_resp->>'marked_for_review')::BOOLEAN,
                    (v_item_resp->>'marked_review')::BOOLEAN,
                    false
                );
                v_time_spent := COALESCE(
                    (v_item_resp->>'time_spent_seconds')::INT,
                    (v_item_resp->>'time_spent_sec')::INT,
                    0
                );

                -- A. CODING ASSESSMENT EVALUATION
                IF v_section.section_type = 'CODING' OR v_section.category = 'coding' OR v_q_id LIKE 'lc-%' OR v_q_id LIKE 'custom-p150-%' THEN
                    IF v_item_resp IS NOT NULL AND (v_item_resp->>'code_solution') IS NOT NULL AND trim(v_item_resp->>'code_solution') != '' THEN
                        v_sec_attempted := v_sec_attempted + 1;
                        v_total_attempted := v_total_attempted + 1;
                        
                        v_test_cases_passed := COALESCE((v_item_resp->>'test_cases_passed')::INT, 0);
                        v_total_test_cases := GREATEST(1, COALESCE((v_item_resp->>'total_test_cases')::INT, 1));
                        v_pass_ratio := LEAST(1.00, GREATEST(0.00, v_test_cases_passed::NUMERIC / v_total_test_cases::NUMERIC));
                        v_coding_marks := ROUND(v_marks_per_q * v_pass_ratio, 2);
                        v_sec_score := v_sec_score + v_coding_marks;
                        
                        IF v_pass_ratio >= 0.80 THEN
                            v_sec_correct := v_sec_correct + 1;
                            v_total_correct := v_total_correct + 1;
                            v_is_correct := true;
                        ELSE
                            v_sec_incorrect := v_sec_incorrect + 1;
                            v_total_incorrect := v_total_incorrect + 1;
                            v_is_correct := false;
                        END IF;

                        v_graded_responses := v_graded_responses || jsonb_build_object(
                            v_q_id,
                            jsonb_build_object(
                                'code_solution', v_item_resp->>'code_solution',
                                'code_language', COALESCE(v_item_resp->>'code_language', 'python'),
                                'test_cases_passed', v_test_cases_passed,
                                'total_test_cases', v_total_test_cases,
                                'is_correct', v_is_correct,
                                'marks_earned', v_coding_marks,
                                'marked_review', v_marked_review,
                                'time_spent_sec', v_time_spent
                            )
                        );
                    END IF;
                -- B. MULTIPLE CHOICE QUESTION EVALUATION (Resolving both topic_questions and technical_mcqs)
                ELSE
                    -- Unified answer key query across aptitude and technical banks
                    v_raw_correct := NULL;
                    SELECT COALESCE(tq.correct_answer, tm.correct_option_index::TEXT)
                    INTO v_raw_correct
                    FROM (SELECT 1) _
                    LEFT JOIN public.topic_questions tq ON tq.id::TEXT = v_q_id
                    LEFT JOIN public.technical_mcqs tm ON tm.id::TEXT = v_q_id;

                    IF v_raw_correct IS NOT NULL THEN
                        IF v_raw_correct ~ '^\d+$' THEN
                            v_correct_ans := v_raw_correct::INT;
                        ELSIF upper(v_raw_correct) = 'A' THEN v_correct_ans := 0;
                        ELSIF upper(v_raw_correct) = 'B' THEN v_correct_ans := 1;
                        ELSIF upper(v_raw_correct) = 'C' THEN v_correct_ans := 2;
                        ELSIF upper(v_raw_correct) = 'D' THEN v_correct_ans := 3;
                        ELSE v_correct_ans := -1;
                        END IF;
                    ELSE
                        v_correct_ans := -1;
                    END IF;

                    IF v_item_resp IS NOT NULL 
                       AND (v_item_resp->>'selected_option') IS NOT NULL 
                       AND (v_item_resp->>'selected_option') != 'null' 
                       AND (v_item_resp->>'selected_option') ~ '^-?\d+$' THEN
                        
                        v_student_selected := (v_item_resp->>'selected_option')::INT;
                        v_sec_attempted := v_sec_attempted + 1;
                        v_total_attempted := v_total_attempted + 1;

                        IF v_correct_ans >= 0 AND v_student_selected = v_correct_ans THEN
                            v_is_correct := true;
                            v_sec_score := v_sec_score + v_marks_per_q;
                            v_sec_correct := v_sec_correct + 1;
                            v_total_correct := v_total_correct + 1;
                        ELSE
                            v_is_correct := false;
                            v_sec_score := v_sec_score - v_neg_mark;
                            v_sec_incorrect := v_sec_incorrect + 1;
                            v_total_incorrect := v_total_incorrect + 1;
                        END IF;

                        v_graded_responses := v_graded_responses || jsonb_build_object(
                            v_q_id,
                            jsonb_build_object(
                                'selected_option', v_student_selected,
                                'is_correct', v_is_correct,
                                'marked_review', v_marked_review,
                                'time_spent_sec', v_time_spent,
                                'correct_answer', v_correct_ans
                            )
                        );
                    END IF;
                END IF;
            END LOOP;
        END IF;

        -- Section Floor Clamping: A student cannot score negative marks in a section
        v_clamped_sec_score := GREATEST(0.00, v_sec_score);
        v_total_score := v_total_score + v_clamped_sec_score;

        v_sections_summary := v_sections_summary || jsonb_build_object(
            'section_id', v_section.id,
            'section_name', v_section.name,
            'total_questions', v_sec_q_count,
            'attempted', v_sec_attempted,
            'correct', v_sec_correct,
            'incorrect', v_sec_incorrect,
            'unattempted', GREATEST(0, v_sec_q_count - v_sec_attempted),
            'score', v_clamped_sec_score,
            'max_score', v_sec_max,
            'percentage', CASE WHEN v_sec_max > 0 THEN ROUND((v_clamped_sec_score / v_sec_max) * 100.0, 1) ELSE 0 END,
            'accuracy', CASE WHEN v_sec_attempted > 0 THEN ROUND((v_sec_correct::NUMERIC / v_sec_attempted::NUMERIC) * 100.0, 1) ELSE 0 END
        );
    END LOOP;

    -- 9. Final Aggregates & Tier Calculation
    IF v_max_possible_score > 0 THEN
        v_percentage := ROUND((v_total_score / v_max_possible_score) * 100.0, 2);
        v_passed := (v_status != 'TERMINATED_MALPRACTICE') AND (v_percentage >= COALESCE(v_exam.passing_percentage, 40.00));
    ELSE
        v_max_possible_score := 100.00;
        v_percentage := 0.00;
        v_passed := false;
    END IF;

    v_result_summary := jsonb_build_object(
        'total_score', v_total_score,
        'max_score', v_max_possible_score,
        'percentage', v_percentage,
        'passed', v_passed,
        'tier', CASE 
            WHEN v_status = 'TERMINATED_MALPRACTICE' THEN 'MALPRACTICE'
            WHEN v_percentage >= 70 THEN 'TIER_1'
            WHEN v_percentage >= 50 THEN 'TIER_2'
            ELSE 'TIER_3'
        END,
        'total_questions', v_total_questions,
        'total_attempted', v_total_attempted,
        'total_correct', v_total_correct,
        'total_incorrect', v_total_incorrect,
        'total_unattempted', GREATEST(0, v_total_questions - v_total_attempted),
        'time_spent_seconds', p_time_spent_seconds,
        'tab_switch_count', v_effective_tab_switches,
        'sections', v_sections_summary
    );

    -- 10. Atomic Commit to Database
    UPDATE public.student_exam_attempts
    SET 
        status = v_status,
        total_score = v_total_score,
        max_possible_score = v_max_possible_score,
        percentage = v_percentage,
        passed = v_passed,
        tab_switch_count = v_effective_tab_switches,
        proctor_events = p_proctor_events,
        time_spent_seconds = p_time_spent_seconds,
        responses = v_graded_responses || jsonb_build_object('__result_summary', v_result_summary),
        submitted_at = NOW(),
        updated_at = NOW()
    WHERE id::TEXT = p_attempt_id::TEXT;

    RETURN jsonb_build_object(
        'id', p_attempt_id,
        'status', v_status,
        'total_score', v_total_score,
        'max_possible_score', v_max_possible_score,
        'percentage', v_percentage,
        'passed', v_passed,
        'result_summary', v_result_summary
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_exam_attempt_v2(TEXT, JSONB, INT, JSONB, INT, TEXT) TO authenticated, anon, service_role;
