-- ====================================================================
-- PREPUNITE FIX SCRIPT: APTITUDE DIRECTORY TOPIC QUESTION COUNTS & STATS
-- File: FIX_APTITUDE_QUESTION_COUNTS_AND_STATS.sql
-- Run this in your Supabase SQL Editor (Ctrl + Enter)
-- ====================================================================

-- 1. Create or replace the hardened atomic aggregation RPC
CREATE OR REPLACE FUNCTION public.get_aptitude_category_stats(p_category_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_clean_slug TEXT;
    v_total INT := 0;
    v_easy INT := 0;
    v_medium INT := 0;
    v_hard INT := 0;
    v_topic_counts JSONB := '{}'::JSONB;
BEGIN
    v_clean_slug := LOWER(TRIM(COALESCE(p_category_slug, '')));

    WITH cat_topics AS (
        SELECT id, LOWER(TRIM(id)) AS norm_id
        FROM public.aptitude_topics
        WHERE LOWER(TRIM(category_slug)) = v_clean_slug
    ),
    q_stats AS (
        SELECT 
            ct.id AS topic_id,
            UPPER(COALESCE(tq.difficulty, 'MEDIUM')) AS diff,
            COUNT(*)::INT as cnt
        FROM cat_topics ct
        JOIN public.topic_questions tq 
          ON (
            LOWER(TRIM(tq.topic_id)) = ct.norm_id
            OR (ct.norm_id = 'reading-comprehension' AND LOWER(TRIM(tq.topic_id)) = 'comprehension')
            OR (ct.norm_id = 'comprehension' AND LOWER(TRIM(tq.topic_id)) = 'reading-comprehension')
          )
        WHERE COALESCE(tq.is_deleted, false) = false
        GROUP BY ct.id, UPPER(COALESCE(tq.difficulty, 'MEDIUM'))
    ),
    topic_agg AS (
        SELECT topic_id, SUM(cnt)::INT as total_in_topic
        FROM q_stats
        GROUP BY topic_id
    )
    SELECT
        COALESCE(SUM(cnt), 0)::INT,
        COALESCE(SUM(cnt) FILTER (WHERE diff = 'EASY'), 0)::INT,
        COALESCE(SUM(cnt) FILTER (WHERE diff = 'MEDIUM'), 0)::INT,
        COALESCE(SUM(cnt) FILTER (WHERE diff = 'HARD'), 0)::INT,
        COALESCE(
            (SELECT jsonb_object_agg(topic_id, total_in_topic) FROM topic_agg),
            '{}'::JSONB
        )
    INTO
        v_total,
        v_easy,
        v_medium,
        v_hard,
        v_topic_counts
    FROM q_stats;

    RETURN jsonb_build_object(
        'category_slug', v_clean_slug,
        'total_questions', COALESCE(v_total, 0),
        'easy_total', COALESCE(v_easy, 0),
        'medium_total', COALESCE(v_medium, 0),
        'hard_total', COALESCE(v_hard, 0),
        'topic_counts', COALESCE(v_topic_counts, '{}'::JSONB)
    );
END;
$$;

-- 2. Grant permissions so clients can call it
GRANT EXECUTE ON FUNCTION public.get_aptitude_category_stats(TEXT) TO anon, authenticated, service_role;

-- 3. Verify immediately by testing verbal-ability
SELECT public.get_aptitude_category_stats('verbal-ability');
