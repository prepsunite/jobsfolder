-- ============================================================================
-- ANSWER SHEET RETENTION & HEAVY PAYLOAD PRUNING
-- Keeps student_exam_attempts rows and __result_summary (scorecards) FOREVER.
-- Prunes heavy per-question responses & proctor_events after:
--   * 30 days for SELF / INDIVIDUAL personal Blueprint practice exams
--   * 90 days for institutional Campus Drives & Public exams
-- ============================================================================

-- 1. Partial index for fast identification of pruning candidates
CREATE INDEX IF NOT EXISTS idx_student_exam_attempts_prune_eligible
  ON public.student_exam_attempts (submitted_at)
  WHERE status IN ('SUBMITTED', 'GRADED', 'TIMED_OUT', 'TERMINATED_MALPRACTICE');

-- 2. Idempotent pruning function (safe to run daily via pg_cron or manually)
CREATE OR REPLACE FUNCTION public.prune_old_exam_answer_sheets(
  p_self_days integer DEFAULT 30,
  p_campus_days integer DEFAULT 90
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pruned_count integer := 0;
BEGIN
  WITH target_attempts AS (
    SELECT
      a.id,
      CASE
        WHEN upper(coalesce(a.college_id, '')) IN ('SELF', 'INDIVIDUAL')
          OR upper(coalesce(m.college_id, '')) IN ('SELF', 'INDIVIDUAL')
        THEN p_self_days
        ELSE p_campus_days
      END AS retention_days
    FROM public.student_exam_attempts a
    LEFT JOIN public.mock_exams m ON m.id = a.mock_exam_id
    WHERE a.status IN ('SUBMITTED', 'GRADED', 'TIMED_OUT', 'TERMINATED_MALPRACTICE')
      AND coalesce((a.responses->>'__answer_sheet_pruned')::boolean, false) = false
      AND coalesce(a.submitted_at, a.updated_at, a.created_at) < (
        now() - make_interval(
          days => CASE
            WHEN upper(coalesce(a.college_id, '')) IN ('SELF', 'INDIVIDUAL')
              OR upper(coalesce(m.college_id, '')) IN ('SELF', 'INDIVIDUAL')
            THEN p_self_days
            ELSE p_campus_days
          END
        )
      )
  )
  UPDATE public.student_exam_attempts a
  SET
    responses = jsonb_strip_nulls(
      jsonb_build_object(
        '__answer_sheet_pruned', true,
        '__pruned_at', to_jsonb(now()),
        '__retention_days', to_jsonb(t.retention_days),
        '__result_summary', coalesce(a.responses->'__result_summary', 'null'::jsonb)
      )
    ),
    proctor_events = '[]'::jsonb
  FROM target_attempts t
  WHERE a.id = t.id;

  GET DIAGNOSTICS v_pruned_count = ROW_COUNT;
  RETURN v_pruned_count;
END;
$$;

-- 3. Schedule daily automated cleanup at 03:15 UTC if pg_cron is enabled
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.unschedule('prune_old_exam_answer_sheets_daily')
    WHERE EXISTS (
      SELECT 1 FROM cron.job WHERE jobname = 'prune_old_exam_answer_sheets_daily'
    );

    PERFORM cron.schedule(
      'prune_old_exam_answer_sheets_daily',
      '15 3 * * *',
      $cron$SELECT public.prune_old_exam_answer_sheets(30, 90);$cron$
    );
  END IF;
END;
$$;
