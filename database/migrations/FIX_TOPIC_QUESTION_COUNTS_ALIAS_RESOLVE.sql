-- ====================================================================
-- PREPUNITE FIX: UNIVERSAL & EXACT TOPIC QUESTION COUNTS (DEDUPLICATED)
-- File: FIX_TOPIC_QUESTION_COUNTS_ALIAS_RESOLVE.sql
-- Run this in Supabase SQL Editor (Ctrl + Enter / Run All)
-- ====================================================================
-- Fixes:
-- 1. Uses SELECT DISTINCT on question_id so multiple alias matches
--    NEVER multiply or inflate the question count (exact 1-to-1 count).
-- 2. Fully maps all 7 categories:
--    - Arithmetic Aptitude
--    - Verbal Reasoning
--    - Verbal Ability
--    - Logical Reasoning
--    - Data Interpretation
--    - Nonverbal Reasoning
--    - Technical Aptitude
-- 3. Safely handles COALESCE(is_deleted, false) = false so NULL is never dropped.
-- ====================================================================

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
    v_easy  INT := 0;
    v_medium INT := 0;
    v_hard  INT := 0;
    v_topic_counts JSONB := '{}'::JSONB;
BEGIN
    v_clean_slug := LOWER(TRIM(COALESCE(p_category_slug, '')));

    WITH
    -- 1. All canonical topic slugs registered for this category
    cat_topics AS (
        SELECT id, LOWER(TRIM(id)) AS norm_id
        FROM public.aptitude_topics
        WHERE LOWER(TRIM(category_slug)) = v_clean_slug
    ),

    -- 2. Explicit irregular alias dictionary
    alias_dict(variant, canonical) AS (VALUES
      -- ─── Arithmetic Aptitude ───
      ('numbers', 'numbers'),
      ('number system', 'numbers'),
      ('number_system', 'numbers'),
      ('num', 'numbers'),
      ('problems on numbers', 'problems-on-numbers'),
      ('problems_on_numbers', 'problems-on-numbers'),
      ('hcf and lcm', 'hcf-lcm'),
      ('hcf & lcm', 'hcf-lcm'),
      ('lcm and hcf', 'hcf-lcm'),
      ('lcm & hcf', 'hcf-lcm'),
      ('hcf_lcm', 'hcf-lcm'),
      ('problems on h.c.f and l.c.m', 'hcf-lcm'),
      ('problems on h.c.f. and l.c.m.', 'hcf-lcm'),
      ('problems on hcf and lcm', 'hcf-lcm'),
      ('decimal fractions', 'decimal-fraction'),
      ('decimals', 'decimal-fraction'),
      ('square root and cube root', 'square-cube-root'),
      ('square and cube root', 'square-cube-root'),
      ('surds and indices', 'surds-indices'),
      ('surds_and_indices', 'surds-indices'),
      ('surds-and-indices', 'surds-indices'),
      ('surds', 'surds-indices'),
      ('indices', 'surds-indices'),
      ('logarithms', 'logarithm'),
      ('logs', 'logarithm'),
      ('percentages', 'percentage'),
      ('percent', 'percentage'),
      ('profit and loss', 'profit-and-loss'),
      ('profit & loss', 'profit-and-loss'),
      ('profit loss', 'profit-and-loss'),
      ('ratio and proportion', 'ratio-and-proportion'),
      ('ratio & proportion', 'ratio-and-proportion'),
      ('ratios', 'ratio-and-proportion'),
      ('partnerships', 'partnership'),
      ('chain rule', 'chain-rule'),
      ('time and work', 'time-and-work'),
      ('work and time', 'time-and-work'),
      ('pipes and cistern', 'pipes-and-cistern'),
      ('pipes and cisterns', 'pipes-and-cistern'),
      ('pipes & cisterns', 'pipes-and-cistern'),
      ('pipes & cistern', 'pipes-and-cistern'),
      ('time and distance', 'time-and-distance'),
      ('speed time distance', 'time-and-distance'),
      ('problems on trains', 'problems-on-trains'),
      ('trains', 'problems-on-trains'),
      ('boats and streams', 'boats-and-streams'),
      ('alligation or mixture', 'alligation-or-mixture'),
      ('alligation and mixture', 'alligation-or-mixture'),
      ('alligation', 'alligation-or-mixture'),
      ('mixtures', 'alligation-or-mixture'),
      ('simple interest', 'simple-interest'),
      ('si', 'simple-interest'),
      ('compound interest', 'compound-interest'),
      ('ci', 'compound-interest'),
      ('stocks and shares', 'stocks-and-shares'),
      ('stocks', 'stocks-and-shares'),
      ('true discount', 'true-discount'),
      ('bankers discount', 'bankers-discount'),
      ('banker''s discount', 'bankers-discount'),
      ('geometry theorems', 'geometry-theorems'),
      ('geometry and polygons', 'geometry-theorems'),
      ('geometry & polygons', 'geometry-theorems'),
      ('geometry', 'geometry-theorems'),
      ('polygons', 'geometry-theorems'),
      ('height and distance', 'height-and-distance'),
      ('heights and distances', 'height-and-distance'),
      ('area and perimeter', 'area'),
      ('area & perimeter', 'area'),
      ('volume and surface area', 'volume-and-surface-area'),
      ('mensuration', 'volume-and-surface-area'),
      ('coordinate geometry', 'coordinate-geometry'),
      ('co-ordinate geometry', 'coordinate-geometry'),
      ('trigonometry and identities', 'trigonometry'),
      ('trigonometry & identities', 'trigonometry'),
      ('algebra and quadratic equations', 'algebra-quadratic-equations'),
      ('algebra & quadratic equations', 'algebra-quadratic-equations'),
      ('algebra', 'algebra-quadratic-equations'),
      ('quadratic equations', 'algebra-quadratic-equations'),
      ('progressions ap gp hp', 'progressions-ap-gp-hp'),
      ('progressions', 'progressions-ap-gp-hp'),
      ('ap gp hp', 'progressions-ap-gp-hp'),
      ('sequence and series', 'progressions-ap-gp-hp'),
      ('set theory and venn math', 'set-theory'),
      ('set theory & venn math', 'set-theory'),
      ('sets', 'set-theory'),
      ('races and games', 'races-and-games'),
      ('races', 'races-and-games'),
      ('permutation and combination', 'permutation-and-combination'),
      ('permutations and combinations', 'permutation-and-combination'),
      ('permutations', 'permutation-and-combination'),
      ('pnc', 'permutation-and-combination'),
      ('probabilities', 'probability'),
      ('averages', 'average'),
      ('problems on ages', 'problems-on-ages'),
      ('ages', 'problems-on-ages'),
      ('calendars', 'calendar'),
      ('clocks', 'clock'),
      ('odd man out and series', 'odd-man-out-and-series'),
      ('odd man out', 'odd-man-out-and-series'),
      ('series', 'odd-man-out-and-series'),

      -- ─── Data Interpretation ───
      ('table charts', 'table-charts'),
      ('tables', 'table-charts'),
      ('bar charts', 'bar-charts'),
      ('pie charts', 'pie-charts'),
      ('line charts', 'line-charts'),
      ('caselet di', 'caselet-di'),
      ('caselet', 'caselet-di'),
      ('radar web charts', 'radar-web-charts'),
      ('radar & spider web charts', 'radar-web-charts'),
      ('scatter plots', 'scatter-bubble-charts'),
      ('scatter-plots', 'scatter-bubble-charts'),
      ('scatter and bubble charts', 'scatter-bubble-charts'),
      ('scatter & bubble charts', 'scatter-bubble-charts'),
      ('missing di', 'missing-di'),
      ('missing data interpretation', 'missing-di'),

      -- ─── Logical Reasoning ───
      ('number series', 'number-series'),
      ('letter and symbol series', 'letter-and-symbol-series'),
      ('letter & symbol series', 'letter-and-symbol-series'),
      ('matching definitions', 'matching-definitions'),
      ('logical games', 'logical-games'),
      ('cryptarithmetic', 'cryptarithmetic'),
      ('crypt arithmetic', 'cryptarithmetic'),
      ('alphametics', 'cryptarithmetic'),
      ('machine input output', 'machine-input-output'),
      ('machine input-output', 'machine-input-output'),
      ('input output', 'machine-input-output'),
      ('statement and assumption', 'statement-and-assumption'),
      ('statement & assumption', 'statement-and-assumption'),
      ('statement and conclusion', 'statement-and-conclusion'),
      ('statement & conclusion', 'statement-and-conclusion'),
      ('cause and effect', 'cause-and-effect'),
      ('cause & effect', 'cause-and-effect'),
      ('essential part', 'essential-part'),
      ('artificial language', 'artificial-language'),
      ('making judgments', 'making-judgments'),
      ('logical problems', 'logical-problems'),
      ('analyzing arguments', 'analyzing-arguments'),
      ('course of action', 'course-of-action'),
      ('theme detection', 'theme-detection'),
      ('statement and argument', 'statement-and-argument'),
      ('statement & argument', 'statement-and-argument'),
      ('logical deduction', 'logical-deduction'),
      ('logical sequence of words', 'logical-sequence-of-words'),
      ('order and ranking', 'order-and-ranking'),
      ('order & ranking', 'order-and-ranking'),
      ('floor and scheduling puzzles', 'floor-scheduling-puzzles'),
      ('floor & scheduling puzzles', 'floor-scheduling-puzzles'),
      ('floor puzzles', 'floor-scheduling-puzzles'),
      ('games and tournaments', 'games-and-tournaments'),
      ('games & tournaments', 'games-and-tournaments'),
      ('truth tellers and liars', 'truth-tellers-liars'),
      ('truth tellers & liars', 'truth-tellers-liars'),
      ('eligibility test and decision making', 'eligibility-test'),
      ('eligibility test & decision making', 'eligibility-test'),
      ('eligibility test', 'eligibility-test'),
      ('mathematical and coded inequalities', 'inequalities'),
      ('mathematical & coded inequalities', 'inequalities'),
      ('coded inequalities', 'inequalities'),

      -- ─── Verbal Reasoning ───
      ('analogies', 'analogies'),
      ('analogy', 'analogies'),
      ('blood relations', 'blood-relations'),
      ('blood relation test', 'blood-relations'),
      ('blood relation', 'blood-relations'),
      ('dice, cube and cuboid', 'cubes-and-dice'),
      ('cubes and dice', 'cubes-and-dice'),
      ('cube and cuboid', 'cubes-and-dice'),
      ('dice', 'cubes-and-dice'),
      ('direction sense test', 'direction-sense'),
      ('direction sense', 'direction-sense'),
      ('directions', 'direction-sense'),
      ('seating arrangement', 'seating-arrangement'),
      ('seating arrangements', 'seating-arrangement'),
      ('arithmetic reasoning', 'arithmetic-reasoning'),
      ('assertion and reason', 'assertion-and-reason'),
      ('assertion & reason', 'assertion-and-reason'),
      ('character puzzles', 'character-puzzles'),
      ('character puzzle', 'character-puzzles'),
      ('classification', 'classification'),
      ('verbal classification', 'classification'),
      ('verbal-classification', 'classification'),
      ('data sufficiency', 'data-sufficiency'),
      ('venn diagrams', 'venn-diagrams'),
      ('venn diagram', 'venn-diagrams'),
      ('verification of truth', 'verification-of-truth'),
      ('statement and inferences', 'statement-and-inferences'),
      ('statement & inferences', 'statement-and-inferences'),
      ('series completion', 'series-completion'),
      ('syllogism', 'syllogisms'),
      ('syllogisms', 'syllogisms'),

      -- ─── Verbal Ability ───
      ('synonyms', 'synonyms'),
      ('synonym', 'synonyms'),
      ('antonyms', 'antonyms'),
      ('antonym', 'antonyms'),
      ('spellings', 'spellings'),
      ('spelling test', 'spellings'),
      ('one word substitutes', 'one-word-substitutes'),
      ('one word substitution', 'one-word-substitutes'),
      ('idioms and phrases', 'idioms-and-phrases'),
      ('idioms & phrases', 'idioms-and-phrases'),
      ('confusing words and homophones', 'confusing-words'),
      ('confusing words & homophones', 'confusing-words'),
      ('confusing words', 'confusing-words'),
      ('homophones', 'confusing-words'),
      ('spotting errors', 'spotting-errors'),
      ('error spotting', 'spotting-errors'),
      ('sentence correction', 'sentence-correction'),
      ('sentence improvement', 'sentence-improvement'),
      ('change of voice', 'change-of-voice'),
      ('active and passive voice', 'change-of-voice'),
      ('voice', 'change-of-voice'),
      ('change of speech', 'change-of-speech'),
      ('direct and indirect speech', 'change-of-speech'),
      ('speech', 'change-of-speech'),
      ('ordering of words', 'ordering-of-words'),
      ('word order', 'ordering-of-words'),
      ('ordering of sentences', 'ordering-of-sentences'),
      ('sentence ordering', 'ordering-of-sentences'),
      ('para jumbles', 'ordering-of-sentences'),
      ('sentence formation', 'sentence-formation'),
      ('paragraph formation', 'paragraph-formation'),
      ('completing statements', 'completing-statements'),
      ('selecting words', 'selecting-words'),
      ('double fillers and connectors', 'double-fillers'),
      ('double fillers & connectors', 'double-fillers'),
      ('double fillers', 'double-fillers'),
      ('fillers', 'double-fillers'),
      ('cloze test', 'cloze-test'),
      ('reading comprehension', 'reading-comprehension'),
      ('comprehension', 'reading-comprehension'),
      ('rc', 'reading-comprehension'),
      ('verbal analogies', 'verbal-analogies'),

      -- ─── Nonverbal Reasoning ───
      ('pattern completion', 'pattern-completion'),
      ('visual series & pattern completion', 'pattern-completion'),
      ('visual series and pattern completion', 'pattern-completion'),
      ('visual series', 'pattern-completion'),
      ('mirror & water images', 'mirror-images'),
      ('mirror and water images', 'mirror-images'),
      ('mirror images', 'mirror-images'),
      ('water images', 'mirror-images'),
      ('paper folding & cutting', 'paper-folding'),
      ('paper folding and cutting', 'paper-folding'),
      ('paper folding', 'paper-folding'),
      ('paper cutting', 'paper-folding'),
      ('figure matrix', 'figure-matrix'),
      ('rule detection', 'rule-detection'),
      ('dot situation test', 'dot-situation'),
      ('dot situation', 'dot-situation'),
      ('embedded images', 'embedded-images'),
      ('counting of figures', 'counting-of-figures'),
      ('counting figures', 'counting-of-figures'),
      ('figure counting', 'counting-of-figures'),
      ('grouping of identical figures', 'grouping-of-images'),
      ('grouping of images', 'grouping-of-images'),
      ('shape construction & reconstruction', 'shape-construction'),
      ('shape construction and reconstruction', 'shape-construction'),
      ('shape construction', 'shape-construction'),
      ('nonverbal analogy', 'nonverbal-analogy'),
      ('non-verbal analogy', 'nonverbal-analogy'),
      ('nonverbal classification', 'nonverbal-classification'),
      ('non-verbal classification', 'nonverbal-classification'),

      -- ─── Technical Aptitude ───
      ('pseudocode and variable tracing', 'pseudocode-tracing'),
      ('pseudocode & variable tracing', 'pseudocode-tracing'),
      ('pseudocode tracing', 'pseudocode-tracing'),
      ('bitwise operators and logic', 'bitwise-operators'),
      ('bitwise operators & logic', 'bitwise-operators'),
      ('bitwise logic', 'bitwise-operators'),
      ('recursion and function scope', 'recursion-functions'),
      ('recursion & function scope', 'recursion-functions'),
      ('attention to detail and visual checking', 'attention-to-detail'),
      ('attention to detail & visual checking', 'attention-to-detail'),
      ('code debugging and automata fix', 'code-debugging-logic'),
      ('code debugging & automata fix', 'code-debugging-logic'),
      ('general tech, os and cloud basics', 'cloud-networking-basics'),
      ('general tech, os & cloud basics', 'cloud-networking-basics'),
      ('cloud and networking basics', 'cloud-networking-basics'),
      ('cloud & networking basics', 'cloud-networking-basics')
    ),

    -- 3. Universal Self-Expanding Mapping
    all_mappings AS (
        SELECT norm_id AS variant, norm_id AS canonical FROM cat_topics
        UNION
        SELECT REPLACE(norm_id, '-', '_') AS variant, norm_id AS canonical FROM cat_topics
        UNION
        SELECT REPLACE(norm_id, '-', ' ') AS variant, norm_id AS canonical FROM cat_topics
        UNION
        SELECT REGEXP_REPLACE(norm_id, '[^a-z0-9]', '', 'g') AS variant, norm_id AS canonical FROM cat_topics
        UNION
        SELECT ad.variant, ad.canonical
        FROM alias_dict ad
        JOIN cat_topics ct ON ct.norm_id = ad.canonical
    ),

    -- 4. Match questions from topic_questions DEDUPLICATING by question id
    --    This guarantees every question is counted EXACTLY ONCE, even if
    --    it matches multiple aliases or formatting variations.
    matched_questions AS (
        SELECT DISTINCT
            am.canonical AS topic_id,
            tq.id AS question_id,
            UPPER(COALESCE(tq.difficulty, 'MEDIUM')) AS diff
        FROM all_mappings am
        JOIN public.topic_questions tq
          ON (
            LOWER(TRIM(tq.topic_id)) = am.variant
            OR REGEXP_REPLACE(LOWER(TRIM(tq.topic_id)), '[^a-z0-9]', '', 'g') = am.variant
          )
        WHERE COALESCE(tq.is_deleted, false) = false
    ),

    q_stats AS (
        SELECT
            topic_id,
            diff,
            COUNT(*)::INT AS cnt
        FROM matched_questions
        GROUP BY topic_id, diff
    ),

    topic_agg AS (
        SELECT topic_id, SUM(cnt)::INT AS total_in_topic
        FROM q_stats
        GROUP BY topic_id
    )
    SELECT
        COALESCE(SUM(cnt), 0)::INT,
        COALESCE(SUM(cnt) FILTER (WHERE diff = 'EASY'),   0)::INT,
        COALESCE(SUM(cnt) FILTER (WHERE diff = 'MEDIUM'), 0)::INT,
        COALESCE(SUM(cnt) FILTER (WHERE diff = 'HARD'),   0)::INT,
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
        'category_slug',    v_clean_slug,
        'total_questions',  COALESCE(v_total,        0),
        'easy_total',       COALESCE(v_easy,          0),
        'medium_total',     COALESCE(v_medium,        0),
        'hard_total',       COALESCE(v_hard,          0),
        'topic_counts',     COALESCE(v_topic_counts, '{}'::JSONB)
    );
END;
$$;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.get_aptitude_category_stats(TEXT)
  TO anon, authenticated, service_role;

-- Verification query: check ALL 7 categories with exact deduplicated question counts!
SELECT 'arithmetic-aptitude' AS cat, public.get_aptitude_category_stats('arithmetic-aptitude') AS result
UNION ALL
SELECT 'verbal-reasoning',   public.get_aptitude_category_stats('verbal-reasoning')
UNION ALL
SELECT 'verbal-ability',     public.get_aptitude_category_stats('verbal-ability')
UNION ALL
SELECT 'logical-reasoning',  public.get_aptitude_category_stats('logical-reasoning')
UNION ALL
SELECT 'data-interpretation',public.get_aptitude_category_stats('data-interpretation')
UNION ALL
SELECT 'nonverbal-reasoning',public.get_aptitude_category_stats('nonverbal-reasoning')
UNION ALL
SELECT 'technical-aptitude', public.get_aptitude_category_stats('technical-aptitude');
