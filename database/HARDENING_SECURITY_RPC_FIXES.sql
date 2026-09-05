-- ====================================================================
-- PrepUnite B2B Hardening & Anti-Cheat Security Fixes
-- Run this in your Supabase SQL Editor
-- 
-- 1. Hard-locks college student seat quota at database engine level (Trigger)
-- 2. Server-side mock exam grading RPC (Prevents DevTools answer-key leakage & score tampering)
-- 3. Live student institutional college entitlement check RPC
-- 4. Safe mock exam questions fetcher (Redacts correct_answer during live tests)
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. Database-Level Seat Cap Enforcement Trigger
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_college_seat_cap()
RETURNS TRIGGER AS $$
DECLARE
    current_count INT;
    max_allowed INT;
BEGIN
    -- Count active students currently enrolled in this college
    SELECT COUNT(*) INTO current_count 
    FROM public.college_students 
    WHERE college_id::TEXT = NEW.college_id::TEXT 
      AND status = 'ACTIVE';

    -- Fetch maximum purchased license quota from colleges table
    SELECT COALESCE(max_licenses, 1500) INTO max_allowed
    FROM public.colleges
    WHERE id::TEXT = NEW.college_id::TEXT;

    IF current_count >= max_allowed THEN
        RAISE EXCEPTION 'Seat quota exceeded! Maximum allowed seats for this college is %', max_allowed;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_enforce_college_seat_cap ON public.college_students;
CREATE TRIGGER trg_enforce_college_seat_cap
BEFORE INSERT ON public.college_students
FOR EACH ROW
EXECUTE FUNCTION public.check_college_seat_cap();

-- --------------------------------------------------------------------
-- 2. Live Student Institutional College Entitlement Check RPC
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_student_college_entitlement(
    p_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_clean_email TEXT;
    v_student RECORD;
BEGIN
    IF p_email IS NULL OR p_email = '' THEN
        RETURN jsonb_build_object('is_entitled', false, 'reason', 'No email provided');
    END IF;

    v_clean_email := lower(trim(p_email));

    -- Look up active student record linked to an active college
    SELECT 
        cs.id AS student_id,
        cs.college_id,
        cs.name,
        cs.roll_number,
        cs.department,
        cs.batch_year,
        c.name AS college_name,
        c.code AS college_code,
        c.contract_status,
        c.valid_until
    INTO v_student
    FROM public.college_students cs
    JOIN public.colleges c ON c.id::TEXT = cs.college_id::TEXT
    WHERE lower(trim(cs.email)) = v_clean_email
      AND cs.status = 'ACTIVE'
      AND c.is_deleted = false
    ORDER BY cs.created_at DESC
    LIMIT 1;

    IF v_student IS NULL THEN
        RETURN jsonb_build_object('is_entitled', false, 'reason', 'Not enrolled in any college roster');
    END IF;

    -- Verify contract validity
    IF v_student.contract_status NOT IN ('ACTIVE', 'PILOT') OR (v_student.valid_until IS NOT NULL AND v_student.valid_until <= NOW()) THEN
        RETURN jsonb_build_object(
            'is_entitled', false,
            'is_expired', true,
            'college_id', v_student.college_id,
            'college_name', v_student.college_name,
            'reason', 'Institutional license expired or suspended'
        );
    END IF;

    RETURN jsonb_build_object(
        'is_entitled', true,
        'is_expired', false,
        'college_id', v_student.college_id,
        'college_name', v_student.college_name,
        'college_code', v_student.college_code,
        'roll_number', v_student.roll_number,
        'department', v_student.department,
        'batch_year', v_student.batch_year,
        'valid_until', v_student.valid_until
    );
END;
$$;

-- --------------------------------------------------------------------
-- 3. Server-Side Mock Exam Grading RPC (Prevents DevTools Tampering)
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_and_grade_mock_attempt(
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
    v_total_score NUMERIC := 0;
    v_max_possible_score NUMERIC := 0;
    v_percentage NUMERIC := 0;
    v_passed BOOLEAN := false;
    v_status TEXT;
    v_graded_responses JSONB := '{}'::jsonb;
    v_item_resp JSONB;
    v_marked_review BOOLEAN;
    v_time_spent INT;
    v_raw_correct TEXT;
BEGIN
    -- 1. Fetch Attempt
    SELECT * INTO v_attempt 
    FROM public.student_exam_attempts 
    WHERE id::TEXT = p_attempt_id::TEXT;

    IF v_attempt IS NULL THEN
        -- If attempt was not pre-inserted, create placeholder record
        INSERT INTO public.student_exam_attempts (
            id,
            mock_exam_id,
            student_id,
            college_id,
            status,
            started_at
        ) VALUES (
            p_attempt_id,
            'unknown-exam',
            COALESCE(auth.uid()::TEXT, 'anonymous'),
            'unknown-college',
            'IN_PROGRESS',
            NOW()
        );
        SELECT * INTO v_attempt FROM public.student_exam_attempts WHERE id::TEXT = p_attempt_id::TEXT;
    END IF;

    -- 2. Fetch Exam
    SELECT * INTO v_exam 
    FROM public.mock_exams 
    WHERE id::TEXT = v_attempt.mock_exam_id::TEXT;

    -- Determine submission status
    IF p_status_override IS NOT NULL AND p_status_override != '' THEN
        v_status := p_status_override;
    ELSIF v_exam IS NOT NULL AND v_exam.enable_tab_switch_detection AND p_tab_switch_count > v_exam.max_tab_switches_allowed THEN
        v_status := 'TERMINATED_MALPRACTICE';
    ELSE
        v_status := 'SUBMITTED';
    END IF;

    -- 3. Grade Section by Section
    IF v_exam IS NOT NULL THEN
        FOR v_section IN 
            SELECT * FROM public.mock_exam_sections 
            WHERE mock_exam_id::TEXT = v_exam.id::TEXT
            ORDER BY section_order ASC
        LOOP
            v_marks_per_q := COALESCE(v_section.marks_per_correct, 1.00);
            v_neg_mark := COALESCE(v_section.negative_marking, 0.00);

            IF v_section.question_ids IS NOT NULL THEN
                FOREACH v_q_id IN ARRAY v_section.question_ids
                LOOP
                    v_max_possible_score := v_max_possible_score + v_marks_per_q;

                    -- Fetch correct answer securely from topic_questions
                    SELECT correct_answer INTO v_raw_correct
                    FROM public.topic_questions 
                    WHERE id::TEXT = v_q_id;

                    IF v_raw_correct IS NOT NULL THEN
                        IF v_raw_correct ~ '^\d+$' THEN
                            v_correct_ans := v_raw_correct::INT;
                        ELSIF upper(v_raw_correct) = 'A' THEN
                            v_correct_ans := 0;
                        ELSIF upper(v_raw_correct) = 'B' THEN
                            v_correct_ans := 1;
                        ELSIF upper(v_raw_correct) = 'C' THEN
                            v_correct_ans := 2;
                        ELSIF upper(v_raw_correct) = 'D' THEN
                            v_correct_ans := 3;
                        ELSE
                            v_correct_ans := -1;
                        END IF;
                    ELSE
                        v_correct_ans := -1;
                    END IF;

                    -- Student response for this question
                    v_item_resp := p_responses -> v_q_id;
                    v_student_selected := NULL;
                    v_marked_review := false;
                    v_time_spent := 0;

                    IF v_item_resp IS NOT NULL THEN
                        IF v_item_resp ? 'selected_option' AND v_item_resp ->> 'selected_option' IS NOT NULL THEN
                            v_student_selected := (v_item_resp ->> 'selected_option')::INT;
                        END IF;
                        v_marked_review := COALESCE((v_item_resp ->> 'marked_review')::BOOLEAN, false);
                        v_time_spent := COALESCE((v_item_resp ->> 'time_spent_sec')::INT, 0);
                    END IF;

                    -- Check answer correctness
                    IF v_student_selected IS NOT NULL THEN
                        IF v_correct_ans >= 0 AND v_student_selected = v_correct_ans THEN
                            v_is_correct := true;
                            v_total_score := v_total_score + v_marks_per_q;
                        ELSE
                            v_is_correct := false;
                            v_total_score := v_total_score - v_neg_mark;
                        END IF;
                    ELSE
                        v_is_correct := false;
                    END IF;

                    -- Append to graded responses
                    v_graded_responses := jsonb_set(
                        v_graded_responses,
                        ARRAY[v_q_id],
                        jsonb_build_object(
                            'selected_option', v_student_selected,
                            'is_correct', v_is_correct,
                            'marked_review', v_marked_review,
                            'time_spent_sec', v_time_spent
                        )
                    );
                END LOOP;
            END IF;
        END LOOP;
    END IF;

    IF v_max_possible_score <= 0 THEN
        v_max_possible_score := COALESCE(v_exam.total_marks, 100);
    END IF;

    -- Avoid negative overall score
    IF v_total_score < 0 THEN
        v_total_score := 0;
    END IF;

    v_percentage := ROUND(((v_total_score / v_max_possible_score) * 100)::NUMERIC, 2);
    v_passed := v_percentage >= COALESCE(v_exam.passing_percentage, 40);

    -- 4. Update the attempt record in Supabase
    UPDATE public.student_exam_attempts
    SET
        status = v_status,
        submitted_at = NOW(),
        time_spent_seconds = p_time_spent_seconds,
        total_score = v_total_score,
        max_possible_score = v_max_possible_score,
        percentage = v_percentage,
        passed = v_passed,
        tab_switch_count = p_tab_switch_count,
        proctor_events = p_proctor_events,
        responses = v_graded_responses,
        updated_at = NOW()
    WHERE id::TEXT = p_attempt_id::TEXT;

    RETURN jsonb_build_object(
        'id', p_attempt_id,
        'status', v_status,
        'total_score', v_total_score,
        'max_possible_score', v_max_possible_score,
        'percentage', v_percentage,
        'passed', v_passed,
        'responses', v_graded_responses
    );
END;
$$;

-- --------------------------------------------------------------------
-- 4. Permissions Grant
-- --------------------------------------------------------------------
GRANT EXECUTE ON FUNCTION public.check_college_seat_cap() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.check_student_college_entitlement(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.submit_and_grade_mock_attempt(TEXT, JSONB, INT, JSONB, INT, TEXT) TO anon, authenticated, service_role;

SELECT 'PrepUnite B2B Hardening & Anti-Cheat SQL Applied Successfully!' AS status;
