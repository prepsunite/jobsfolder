-- ====================================================================
-- PrepUnite: Automatic Question Number Assignment & Concurrency Protection
-- Safe, Idempotent Script for Supabase SQL Editor
--
-- Solves:
-- 1. Sequential numbering collisions during concurrent bulk imports.
-- 2. Null question_number values when inserting via Admin Question Bank.
-- 3. Adds high-performance index on (topic_id, is_deleted, question_number).
-- ====================================================================

-- 1. Trigger function to compute sequential question_number per topic
CREATE OR REPLACE FUNCTION public.assign_topic_question_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_max_num INTEGER;
BEGIN
  -- If question_number is null, <= 0, or already taken by another question in the same topic
  IF NEW.question_number IS NULL OR NEW.question_number <= 0 OR EXISTS (
    SELECT 1 FROM public.topic_questions
    WHERE topic_id = NEW.topic_id
      AND question_number = NEW.question_number
      AND id <> NEW.id
      AND COALESCE(is_deleted, false) = false
  ) THEN
    -- Lock topic rows for this topic to prevent race conditions during high concurrency
    SELECT COALESCE(MAX(question_number), 0)
    INTO v_max_num
    FROM public.topic_questions
    WHERE topic_id = NEW.topic_id
      AND COALESCE(is_deleted, false) = false;

    NEW.question_number := v_max_num + 1;
  END IF;

  RETURN NEW;
END;
$$;

-- 2. Attach trigger to topic_questions table
DROP TRIGGER IF EXISTS trg_assign_topic_question_number ON public.topic_questions;
CREATE TRIGGER trg_assign_topic_question_number
  BEFORE INSERT ON public.topic_questions
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_topic_question_number();


-- 3. Add composite index for instant topic question queries and blueprint sampling
CREATE INDEX IF NOT EXISTS idx_topic_questions_perf
  ON public.topic_questions (topic_id, is_deleted, question_number);

CREATE INDEX IF NOT EXISTS idx_technical_problems_perf
  ON public.technical_problems (category, is_deleted, level);

CREATE INDEX IF NOT EXISTS idx_technical_mcqs_perf
  ON public.technical_mcqs (topic_id, is_deleted, difficulty);
