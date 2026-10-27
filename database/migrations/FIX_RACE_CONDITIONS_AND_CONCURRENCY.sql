-- ====================================================================
-- PREPUNITE / MOCKFOLDER: RACE CONDITIONS & CONCURRENCY HARDENING
-- File: database/migrations/FIX_RACE_CONDITIONS_AND_CONCURRENCY.sql
-- Safe, Idempotent Script for Supabase SQL Editor
-- ====================================================================

-- ── 1. Partial Unique Index: Prevent Duplicate Concurrent Exam Starts ──
-- Ensures a student cannot have more than ONE active (IN_PROGRESS) attempt
-- on the same mock exam across different tabs or simultaneous clicks.
CREATE UNIQUE INDEX IF NOT EXISTS uq_active_student_exam_attempt 
ON public.student_exam_attempts (mock_exam_id, student_id) 
WHERE status = 'IN_PROGRESS';

-- ── 2. Unified Exam Submission RPC with Pessimistic Locking (FOR UPDATE) ──
-- Prevents double-submit races, timer auto-submit vs manual click collisions,
-- and concurrent grading runs on the same attempt record.
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
    v_assigned_subset JSONB;
BEGIN
    -- 1. Anti-Tamper: Sanitize time spent
    IF p_time_spent_seconds IS NULL OR p_time_spent_seconds < 0 THEN
        p_time_spent_seconds := 0;
    END IF;

    -- 2. Fetch Attempt with Pessimistic Row Lock (ELIMINATES SUBMIT CONCURRENCY RACE)
    SELECT * INTO v_attempt 
    FROM public.student_exam_attempts 
    WHERE id::TEXT = p_attempt_id::TEXT
    FOR UPDATE;

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
    -- If attempt was already finalized by a concurrent request, return existing result immediately
    IF v_attempt.status IN ('SUBMITTED', 'GRADED', 'TIMED_OUT', 'TERMINATED_MALPRACTICE') AND NOT public.is_admin() THEN
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
    v_assigned_subset := p_responses -> '__assigned_question_ids';

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
                -- Dynamic Question Pooling Guard: If candidate was served an assigned subset, skip unassigned pooled questions
                IF v_assigned_subset IS NOT NULL AND jsonb_typeof(v_assigned_subset) = 'array' AND jsonb_array_length(v_assigned_subset) > 0 THEN
                    IF NOT (v_assigned_subset ? v_q_id) THEN
                        CONTINUE;
                    END IF;
                END IF;

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
                -- B. MULTIPLE CHOICE QUESTION EVALUATION
                ELSE
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

        -- Section Floor Clamping
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

-- ── 3. Payment Fulfillment RPC with Pessimistic Row Locking ──
-- Ensures consecutive pass purchases stack additively without clobbering duration.
CREATE OR REPLACE FUNCTION public.fulfill_payment_order(
  p_order_id TEXT,
  p_payment_id TEXT,
  p_user_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_order RECORD;
  v_normalized_email TEXT;
  v_days INTEGER := 30;
  v_plan_name TEXT := 'PrepUnite Pro (5 Mock Exams/mo)';
  v_existing_expiry TIMESTAMPTZ;
  v_new_expiry TIMESTAMPTZ;
BEGIN
  v_normalized_email := LOWER(TRIM(p_user_email));

  IF p_order_id IS NULL OR p_payment_id IS NULL OR v_normalized_email IS NULL THEN
    RAISE EXCEPTION 'Order ID, Payment ID, and User Email are required for fulfillment.';
  END IF;

  -- 1. Find and lock the pre-order record from ledger
  SELECT * INTO v_order
  FROM public.payment_orders
  WHERE order_id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order record % not found in server pre-order ledger.', p_order_id;
  END IF;

  -- Validate order ownership
  IF LOWER(TRIM(v_order.user_email)) != v_normalized_email THEN
    RAISE EXCEPTION 'Order ownership mismatch: Order % does not belong to %.', p_order_id, v_normalized_email;
  END IF;

  -- Idempotency check: if order is already PAID with the same payment_id, return success
  IF v_order.status = 'PAID' AND v_order.payment_id = p_payment_id THEN
    RETURN jsonb_build_object(
      'success', true,
      'already_fulfilled', true,
      'item_type', v_order.item_type,
      'order_id', p_order_id,
      'payment_id', p_payment_id
    );
  END IF;

  -- Mark ledger row as PAID
  UPDATE public.payment_orders
  SET status = 'PAID',
      payment_id = p_payment_id,
      updated_at = NOW()
  WHERE id = v_order.id;

  -- Upsert immutable transaction record
  INSERT INTO public.transactions (
    user_email,
    payment_id,
    order_id,
    amount,
    currency,
    status,
    item_type,
    exam_id,
    created_at
  ) VALUES (
    v_normalized_email,
    p_payment_id,
    p_order_id,
    v_order.amount_inr,
    COALESCE(v_order.currency, 'INR'),
    'SUCCESS',
    v_order.item_type,
    v_order.exam_id,
    NOW()
  )
  ON CONFLICT (payment_id) DO UPDATE SET
    status = 'SUCCESS',
    order_id = EXCLUDED.order_id,
    amount = EXCLUDED.amount,
    item_type = EXCLUDED.item_type;

  -- 2. Entitlement fulfillment based strictly on ledger's v_order.item_type
  IF v_order.item_type IN ('SINGLE_PAPER', 'SINGLE') THEN
    IF v_order.exam_id IS NULL THEN
      RAISE EXCEPTION 'Exam ID is required for single company paper purchases.';
    END IF;

    -- Atomic extension with Pessimistic Row Lock (FOR UPDATE)
    SELECT expires_at INTO v_existing_expiry
    FROM public.user_paper_purchases
    WHERE user_email = v_normalized_email AND exam_id = v_order.exam_id
    ORDER BY expires_at DESC
    LIMIT 1
    FOR UPDATE;

    IF v_existing_expiry IS NOT NULL AND v_existing_expiry > NOW() THEN
      v_new_expiry := v_existing_expiry + INTERVAL '30 days';
    ELSE
      v_new_expiry := NOW() + INTERVAL '30 days';
    END IF;

    INSERT INTO public.user_paper_purchases (
      user_email,
      exam_id,
      payment_id,
      amount_paid,
      expires_at,
      created_at
    ) VALUES (
      v_normalized_email,
      v_order.exam_id,
      p_payment_id,
      v_order.amount_inr,
      v_new_expiry,
      NOW()
    )
    ON CONFLICT (payment_id) DO UPDATE SET
      expires_at = EXCLUDED.expires_at,
      amount_paid = EXCLUDED.amount_paid;

  ELSE
    -- Subscription plans duration resolution
    IF v_order.item_type LIKE 'ULTRA%' THEN
      IF v_order.item_type LIKE '%6M%' THEN
        v_days := 180;
        v_plan_name := 'PrepUnite Ultra 6-Month Pass (Unlimited)';
      ELSIF v_order.item_type LIKE '%1Y%' OR v_order.item_type LIKE '%YEARLY%' THEN
        v_days := 365;
        v_plan_name := 'PrepUnite Ultra 1-Year Pass (Unlimited)';
      ELSE
        v_days := 30;
        v_plan_name := 'PrepUnite Ultra (Unlimited)';
      END IF;
    ELSIF v_order.item_type LIKE 'PRO%' THEN
      IF v_order.item_type LIKE '%6M%' THEN
        v_days := 180;
        v_plan_name := 'PrepUnite Pro 6-Month Pass (5 Mock Exams/mo)';
      ELSIF v_order.item_type LIKE '%1Y%' OR v_order.item_type LIKE '%YEARLY%' THEN
        v_days := 365;
        v_plan_name := 'PrepUnite Pro 1-Year Pass (5 Mock Exams/mo)';
      ELSE
        v_days := 30;
        v_plan_name := 'PrepUnite Pro (5 Mock Exams/mo)';
      END IF;
    ELSIF v_order.item_type IN ('PLUS', 'PLUS_MONTHLY', 'MONTHLY', 'MONTHLY_PASS') THEN
      v_days := 30;
      v_plan_name := 'PrepUnite Pro (5 Mock Exams/mo)';
    ELSIF v_order.item_type = 'QUARTERLY' THEN
      v_days := 90;
      v_plan_name := 'PrepUnite Pro Quarterly Pass';
    ELSIF v_order.item_type = 'YEARLY' THEN
      v_days := 365;
      v_plan_name := 'PrepUnite Ultra 1-Year Pass (Unlimited)';
    ELSE
      v_days := 30;
      v_plan_name := 'PrepUnite Pro (5 Mock Exams/mo)';
    END IF;

    -- Atomic extension with Pessimistic Row Lock (FOR UPDATE)
    SELECT expires_at INTO v_existing_expiry
    FROM public.user_subscriptions
    WHERE user_email = v_normalized_email
      AND status = 'ACTIVE'
      AND expires_at > NOW()
    ORDER BY expires_at DESC
    LIMIT 1
    FOR UPDATE;

    IF v_existing_expiry IS NOT NULL AND v_existing_expiry > NOW() THEN
      v_new_expiry := v_existing_expiry + (v_days || ' days')::INTERVAL;
    ELSE
      v_new_expiry := NOW() + (v_days || ' days')::INTERVAL;
    END IF;

    INSERT INTO public.user_subscriptions (
      user_email,
      plan_name,
      payment_id,
      status,
      expires_at,
      created_at,
      updated_at
    ) VALUES (
      v_normalized_email,
      v_plan_name,
      p_payment_id,
      'ACTIVE',
      v_new_expiry,
      NOW(),
      NOW()
    )
    ON CONFLICT (payment_id) DO UPDATE SET
      plan_name = EXCLUDED.plan_name,
      status = 'ACTIVE',
      expires_at = EXCLUDED.expires_at,
      updated_at = NOW();
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'item_type', v_order.item_type,
    'plan_name', v_plan_name,
    'order_id', p_order_id,
    'payment_id', p_payment_id,
    'expires_at', v_new_expiry
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.fulfill_payment_order(TEXT, TEXT, TEXT) TO authenticated, anon, service_role;
