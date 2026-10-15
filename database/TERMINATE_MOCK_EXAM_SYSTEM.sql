-- ====================================================================
-- DATABASE MIGRATION: TERMINATE MOCK EXAM & CASCADE PURGE SYSTEM
-- Enables TPOs and Admins to permanently terminate mock exams and
-- purge all associated student attempts, scores, and section data
-- so the institutional database and student dashboards do not get flooded.
-- ====================================================================

CREATE OR REPLACE FUNCTION public.terminate_mock_exam(
    p_exam_id TEXT,
    p_college_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_clean_exam_id TEXT;
    v_clean_college_id TEXT;
    v_exam RECORD;
    v_caller_email TEXT;
    v_caller_id UUID;
    v_is_authorized BOOLEAN := FALSE;
    v_deleted_attempts INT := 0;
    v_deleted_sections INT := 0;
    v_deleted_questions INT := 0;
BEGIN
    v_clean_exam_id := TRIM(COALESCE(p_exam_id, ''));
    v_clean_college_id := TRIM(COALESCE(p_college_id, ''));

    IF v_clean_exam_id = '' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Exam ID is required');
    END IF;

    -- Fetch the exam
    SELECT * INTO v_exam
    FROM public.mock_exams
    WHERE id::TEXT = v_clean_exam_id
    LIMIT 1;

    IF NOT FOUND THEN
        -- Even if mock_exams row is gone, perform idempotent cleanup of orphaned attempts/sections
        DELETE FROM public.student_exam_attempts WHERE mock_exam_id::TEXT = v_clean_exam_id;
        DELETE FROM public.mock_exam_sections WHERE mock_exam_id::TEXT = v_clean_exam_id;
        RETURN jsonb_build_object(
            'success', true,
            'message', 'Exam already removed or cleaned up from mock_exams table.',
            'exam_id', v_clean_exam_id
        );
    END IF;

    -- Check caller authorization
    v_caller_id := auth.uid();
    v_caller_email := LOWER(TRIM(COALESCE(auth.jwt()->>'email', '')));

    -- 1. Super Admin is always authorized
    IF public.is_admin() THEN
        v_is_authorized := TRUE;
    END IF;

    -- 2. TPO authorized for the exam's college or caller-supplied college
    IF NOT v_is_authorized THEN
        IF public.is_tpo_for_college(v_exam.college_id::TEXT) THEN
            v_is_authorized := TRUE;
        ELSIF v_clean_college_id <> '' AND public.is_tpo_for_college(v_clean_college_id) THEN
            v_is_authorized := TRUE;
        ELSIF v_exam.created_by IS NOT NULL AND v_caller_id IS NOT NULL AND v_exam.created_by = v_caller_id THEN
            v_is_authorized := TRUE;
        END IF;
    END IF;

    -- 3. Fallback: Check direct contact_email or tpo_authorizations
    IF NOT v_is_authorized AND v_caller_email <> '' THEN
        IF EXISTS (
            SELECT 1 FROM public.colleges
            WHERE (id::TEXT = v_exam.college_id::TEXT OR id::TEXT = v_clean_college_id)
              AND (
                LOWER(TRIM(COALESCE(contact_email, ''))) = v_caller_email
                OR LOWER(TRIM(COALESCE(metadata->>'tpo_email', ''))) = v_caller_email
              )
        ) OR EXISTS (
            SELECT 1 FROM public.tpo_authorizations
            WHERE (college_id::TEXT = v_exam.college_id::TEXT OR college_id::TEXT = v_clean_college_id)
              AND LOWER(TRIM(COALESCE(email, ''))) = v_caller_email
              AND status = 'ACTIVE'
        ) THEN
            v_is_authorized := TRUE;
        END IF;
    END IF;

    IF NOT v_is_authorized THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Unauthorized: You do not have permissions to terminate assessments for this college.'
        );
    END IF;

    -- Step 1: Delete all student exam attempts for this exam
    DELETE FROM public.student_exam_attempts
    WHERE mock_exam_id::TEXT = v_clean_exam_id;
    GET DIAGNOSTICS v_deleted_attempts = ROW_COUNT;

    -- Step 2: Delete all sections for this exam
    DELETE FROM public.mock_exam_sections
    WHERE mock_exam_id::TEXT = v_clean_exam_id;
    GET DIAGNOSTICS v_deleted_sections = ROW_COUNT;

    -- Step 3: Delete any custom questions in topic_questions with this exam_id
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'topic_questions' AND column_name = 'exam_id'
    ) THEN
        DELETE FROM public.topic_questions
        WHERE exam_id::TEXT = v_clean_exam_id;
        GET DIAGNOSTICS v_deleted_questions = ROW_COUNT;
    END IF;

    -- Step 4: Delete the mock exam itself
    DELETE FROM public.mock_exams
    WHERE id::TEXT = v_clean_exam_id;

    -- Step 5: Clean up any internal backup contact messages
    DELETE FROM public.contact_messages
    WHERE subject LIKE '%' || v_clean_exam_id || '%';

    RETURN jsonb_build_object(
        'success', true,
        'exam_id', v_clean_exam_id,
        'title', v_exam.title,
        'deleted_attempts', v_deleted_attempts,
        'deleted_sections', v_deleted_sections,
        'deleted_questions', v_deleted_questions,
        'message', 'Exam and all associated student attempts, answer sheets, and sections have been permanently terminated.'
    );
END;
$$;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.terminate_mock_exam(TEXT, TEXT) TO authenticated, anon, service_role;

-- Ensure RLS policy on DELETE allows TPO to delete from mock_exams and related tables
DO $$
BEGIN
  -- 1. mock_exams delete policy
  DROP POLICY IF EXISTS "TPO delete own mock exams" ON public.mock_exams;
  CREATE POLICY "TPO delete own mock exams" ON public.mock_exams
    FOR DELETE
    USING (
      public.is_admin()
      OR public.is_tpo_for_college(college_id::TEXT)
      OR created_by = auth.uid()
    );

  -- 2. mock_exam_sections delete policy
  DROP POLICY IF EXISTS "TPO delete sections" ON public.mock_exam_sections;
  CREATE POLICY "TPO delete sections" ON public.mock_exam_sections
    FOR DELETE
    USING (
      public.is_admin()
      OR EXISTS (
        SELECT 1 FROM public.mock_exams me
        WHERE me.id::TEXT = mock_exam_sections.mock_exam_id::TEXT
          AND (public.is_tpo_for_college(me.college_id::TEXT) OR me.created_by = auth.uid())
      )
    );

  -- 3. student_exam_attempts delete policy for TPO cleanup
  DROP POLICY IF EXISTS "TPO delete college exam attempts" ON public.student_exam_attempts;
  CREATE POLICY "TPO delete college exam attempts" ON public.student_exam_attempts
    FOR DELETE
    USING (
      public.is_admin()
      OR public.is_tpo_for_college(college_id::TEXT)
      OR EXISTS (
        SELECT 1 FROM public.mock_exams me
        WHERE me.id::TEXT = student_exam_attempts.mock_exam_id::TEXT
          AND (public.is_tpo_for_college(me.college_id::TEXT) OR me.created_by = auth.uid())
      )
    );
END $$;
