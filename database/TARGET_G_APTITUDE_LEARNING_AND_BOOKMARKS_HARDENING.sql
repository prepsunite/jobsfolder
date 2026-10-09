-- ====================================================================
-- PREPUNITE DATABASE HARDENING: TARGET G
-- Student Learning Journey, Aptitude Engine, Dynamic Question Bank Traversal,
-- Bookmarking Infrastructure & Mastery Analytics Control Plane
-- ====================================================================

-- --------------------------------------------------------------------
-- STEP 1: Deploy & Harden public.user_question_progress Table
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.user_question_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    question_id VARCHAR(255) NOT NULL,
    topic_id VARCHAR(150),
    category_slug VARCHAR(100),
    difficulty VARCHAR(20) DEFAULT 'MEDIUM',
    selected_option VARCHAR(10),
    correct_option VARCHAR(10),
    wrong_attempts INT DEFAULT 0,
    is_solved BOOLEAN NOT NULL DEFAULT FALSE,
    is_revealed BOOLEAN NOT NULL DEFAULT FALSE,
    first_try_correct BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_user_question UNIQUE (user_email, question_id)
);

-- Ensure user_id column exists if table was pre-created
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'user_question_progress' 
          AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.user_question_progress 
        ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Auto-link user_id trigger
CREATE OR REPLACE FUNCTION public.fn_link_user_progress_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.user_id IS NULL THEN
        NEW.user_id := auth.uid();
        IF NEW.user_id IS NULL AND NEW.user_email IS NOT NULL THEN
            SELECT id INTO NEW.user_id FROM auth.users WHERE email = NEW.user_email LIMIT 1;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_link_user_progress_id ON public.user_question_progress;
CREATE TRIGGER trg_link_user_progress_id
    BEFORE INSERT OR UPDATE ON public.user_question_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_link_user_progress_id();

-- High-performance lookup & analytics indexes
CREATE INDEX IF NOT EXISTS idx_uqp_user_solved ON public.user_question_progress(user_email, is_solved);
CREATE INDEX IF NOT EXISTS idx_uqp_user_topic ON public.user_question_progress(user_email, topic_id);
CREATE INDEX IF NOT EXISTS idx_uqp_user_active_date ON public.user_question_progress(user_email, completed_at);
CREATE INDEX IF NOT EXISTS idx_uqp_user_cat ON public.user_question_progress(user_email, category_slug);
CREATE INDEX IF NOT EXISTS idx_uqp_user_id ON public.user_question_progress(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_question_progress ENABLE ROW LEVEL SECURITY;

-- Drop obsolete or wide-open policies
DROP POLICY IF EXISTS "Users can manage own question progress" ON public.user_question_progress;
DROP POLICY IF EXISTS "Users read own question progress" ON public.user_question_progress;
DROP POLICY IF EXISTS "Users insert own question progress" ON public.user_question_progress;
DROP POLICY IF EXISTS "Users update own question progress" ON public.user_question_progress;
DROP POLICY IF EXISTS "Users delete own question progress" ON public.user_question_progress;

-- Strict Row-Level Security Policies
CREATE POLICY "Users read own question progress"
    ON public.user_question_progress FOR SELECT
    USING (
        user_email = COALESCE(auth.jwt()->>'email', (SELECT email FROM public.profiles WHERE id = auth.uid()))
        OR user_id = auth.uid()
        OR public.is_admin()
    );

CREATE POLICY "Users insert own question progress"
    ON public.user_question_progress FOR INSERT
    WITH CHECK (
        user_email = COALESCE(auth.jwt()->>'email', (SELECT email FROM public.profiles WHERE id = auth.uid()))
        OR user_id = auth.uid()
        OR public.is_admin()
    );

CREATE POLICY "Users update own question progress"
    ON public.user_question_progress FOR UPDATE
    USING (
        user_email = COALESCE(auth.jwt()->>'email', (SELECT email FROM public.profiles WHERE id = auth.uid()))
        OR user_id = auth.uid()
        OR public.is_admin()
    )
    WITH CHECK (
        user_email = COALESCE(auth.jwt()->>'email', (SELECT email FROM public.profiles WHERE id = auth.uid()))
        OR user_id = auth.uid()
        OR public.is_admin()
    );

CREATE POLICY "Users delete own question progress"
    ON public.user_question_progress FOR DELETE
    USING (
        user_email = COALESCE(auth.jwt()->>'email', (SELECT email FROM public.profiles WHERE id = auth.uid()))
        OR user_id = auth.uid()
        OR public.is_admin()
    );


-- --------------------------------------------------------------------
-- STEP 2: Harden public.user_bookmarks Table & RLS
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.user_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    item_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_user_item_bookmark UNIQUE (user_email, item_type, item_id)
);

-- Auto-link user_id trigger for bookmarks
CREATE OR REPLACE FUNCTION public.fn_link_user_bookmark_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.user_id IS NULL THEN
        NEW.user_id := auth.uid();
        IF NEW.user_id IS NULL AND NEW.user_email IS NOT NULL THEN
            SELECT id INTO NEW.user_id FROM auth.users WHERE email = NEW.user_email LIMIT 1;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_link_user_bookmark_id ON public.user_bookmarks;
CREATE TRIGGER trg_link_user_bookmark_id
    BEFORE INSERT OR UPDATE ON public.user_bookmarks
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_link_user_bookmark_id();

-- Performance indexes for bookmarks
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_lookup ON public.user_bookmarks(user_email, item_type);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_id ON public.user_bookmarks(user_id);

-- Enable RLS
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own bookmarks" ON public.user_bookmarks;
DROP POLICY IF EXISTS "Users insert own bookmarks" ON public.user_bookmarks;
DROP POLICY IF EXISTS "Users delete own bookmarks" ON public.user_bookmarks;
DROP POLICY IF EXISTS "Users update own bookmarks" ON public.user_bookmarks;

CREATE POLICY "Users read own bookmarks"
    ON public.user_bookmarks FOR SELECT
    USING (
        user_email = COALESCE(auth.jwt()->>'email', (SELECT email FROM public.profiles WHERE id = auth.uid()))
        OR user_id = auth.uid()
        OR public.is_admin()
    );

CREATE POLICY "Users insert own bookmarks"
    ON public.user_bookmarks FOR INSERT
    WITH CHECK (
        user_email = COALESCE(auth.jwt()->>'email', (SELECT email FROM public.profiles WHERE id = auth.uid()))
        OR user_id = auth.uid()
        OR public.is_admin()
    );

CREATE POLICY "Users update own bookmarks"
    ON public.user_bookmarks FOR UPDATE
    USING (
        user_email = COALESCE(auth.jwt()->>'email', (SELECT email FROM public.profiles WHERE id = auth.uid()))
        OR user_id = auth.uid()
        OR public.is_admin()
    )
    WITH CHECK (
        user_email = COALESCE(auth.jwt()->>'email', (SELECT email FROM public.profiles WHERE id = auth.uid()))
        OR user_id = auth.uid()
        OR public.is_admin()
    );

CREATE POLICY "Users delete own bookmarks"
    ON public.user_bookmarks FOR DELETE
    USING (
        user_email = COALESCE(auth.jwt()->>'email', (SELECT email FROM public.profiles WHERE id = auth.uid()))
        OR user_id = auth.uid()
        OR public.is_admin()
    );


-- --------------------------------------------------------------------
-- STEP 3: Atomic Server-Side Aggregation RPC for Aptitude Directory
-- Eliminates 10,000-row overfetch & localStorage quota exhaustion
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_aptitude_category_stats(p_category_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_total INT := 0;
    v_easy INT := 0;
    v_medium INT := 0;
    v_hard INT := 0;
    v_topic_counts JSONB := '{}'::JSONB;
BEGIN
    WITH cat_topics AS (
        SELECT id
        FROM public.aptitude_topics
        WHERE category_slug = p_category_slug
    ),
    q_stats AS (
        SELECT 
            tq.topic_id,
            UPPER(COALESCE(tq.difficulty, 'MEDIUM')) AS diff,
            COUNT(*)::INT as cnt
        FROM public.topic_questions tq
        JOIN cat_topics ct ON ct.id = tq.topic_id
        WHERE tq.is_deleted = FALSE
        GROUP BY tq.topic_id, UPPER(COALESCE(tq.difficulty, 'MEDIUM'))
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
        'category_slug', p_category_slug,
        'total_questions', COALESCE(v_total, 0),
        'easy_total', COALESCE(v_easy, 0),
        'medium_total', COALESCE(v_medium, 0),
        'hard_total', COALESCE(v_hard, 0),
        'topic_counts', COALESCE(v_topic_counts, '{}'::JSONB)
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_aptitude_category_stats(TEXT) TO anon, authenticated;


-- --------------------------------------------------------------------
-- STEP 4: DPDP Compliance Right-to-Erasure Routine for Learning Data
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.erase_user_learning_and_bookmark_data(
    p_user_id UUID DEFAULT NULL,
    p_user_email TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_progress_deleted INT := 0;
    v_bookmarks_deleted INT := 0;
BEGIN
    IF p_user_id IS NULL AND (p_user_email IS NULL OR p_user_email = '') THEN
        RAISE EXCEPTION 'Must provide either p_user_id or p_user_email for data erasure.';
    END IF;

    -- Erase learning progress
    DELETE FROM public.user_question_progress
    WHERE (p_user_id IS NOT NULL AND user_id = p_user_id)
       OR (p_user_email IS NOT NULL AND user_email = LOWER(TRIM(p_user_email)));
    GET DIAGNOSTICS v_progress_deleted = ROW_COUNT;

    -- Erase bookmarks
    DELETE FROM public.user_bookmarks
    WHERE (p_user_id IS NOT NULL AND user_id = p_user_id)
       OR (p_user_email IS NOT NULL AND user_email = LOWER(TRIM(p_user_email)));
    GET DIAGNOSTICS v_bookmarks_deleted = ROW_COUNT;

    RETURN jsonb_build_object(
        'success', true,
        'progress_records_purged', v_progress_deleted,
        'bookmarks_purged', v_bookmarks_deleted
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.erase_user_learning_and_bookmark_data(UUID, TEXT) TO authenticated;
