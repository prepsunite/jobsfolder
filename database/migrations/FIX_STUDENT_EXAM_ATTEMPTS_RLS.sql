-- ====================================================================
-- PrepUnite: Quick Fix for student_exam_attempts RLS Policy
-- File: database/migrations/FIX_STUDENT_EXAM_ATTEMPTS_RLS.sql
-- ====================================================================

ALTER TABLE public.student_exam_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admin full attempts" ON public.student_exam_attempts;
CREATE POLICY "Super admin full attempts" ON public.student_exam_attempts FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Student manage own attempts" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Student select own attempts" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Student insert own in_progress attempt" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Student update in_progress attempt responses" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "Student submit own attempt" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "TPO view college attempts" ON public.student_exam_attempts;
DROP POLICY IF EXISTS "TPO manage college exam attempts" ON public.student_exam_attempts;

CREATE POLICY "Student select own attempts" ON public.student_exam_attempts 
  FOR SELECT
  USING (
    student_id::TEXT = auth.uid()::TEXT
    OR student_id::TEXT = lower(auth.jwt()->>'email')
    OR student_email = lower(auth.jwt()->>'email')
    OR public.is_admin()
    OR public.is_tpo_for_college(college_id::TEXT)
    OR EXISTS (
      SELECT 1 FROM public.mock_exams me
      WHERE me.id::TEXT = student_exam_attempts.mock_exam_id::TEXT
        AND public.is_tpo_for_college(me.college_id::TEXT)
    )
  );

CREATE POLICY "Student insert own in_progress attempt" ON public.student_exam_attempts 
  FOR INSERT
  WITH CHECK (
    status = 'IN_PROGRESS'
    AND (
      public.is_admin()
      OR student_id::TEXT = auth.uid()::TEXT
      OR student_id::TEXT = lower(auth.jwt()->>'email')
      OR student_email = lower(auth.jwt()->>'email')
      OR EXISTS (
        SELECT 1 FROM public.mock_exams me
        WHERE me.id::TEXT = student_exam_attempts.mock_exam_id::TEXT
      )
    )
  );

CREATE POLICY "Student update in_progress attempt responses" ON public.student_exam_attempts 
  FOR UPDATE
  USING (
    public.is_admin()
    OR public.is_tpo_for_college(college_id::TEXT)
    OR student_id::TEXT = auth.uid()::TEXT
    OR student_id::TEXT = lower(auth.jwt()->>'email')
    OR student_email = lower(auth.jwt()->>'email')
    OR EXISTS (
      SELECT 1 FROM public.mock_exams me
      WHERE me.id::TEXT = student_exam_attempts.mock_exam_id::TEXT
        AND public.is_tpo_for_college(me.college_id::TEXT)
    )
  );
