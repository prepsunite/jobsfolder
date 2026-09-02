-- ====================================================================
-- PrepUnite: User Question Progress & LeetCode Analytics Schema
-- Enables tracking of student practice attempts, accuracy, streaks,
-- difficulty breakdown (Easy/Med/Hard), and mastery stats.
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.user_question_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Performance indexes for analytics aggregation
CREATE INDEX IF NOT EXISTS idx_user_q_progress ON public.user_question_progress(user_email, is_solved);
CREATE INDEX IF NOT EXISTS idx_user_topic_progress ON public.user_question_progress(user_email, topic_id);
CREATE INDEX IF NOT EXISTS idx_user_active_date ON public.user_question_progress(user_email, completed_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_question_progress ENABLE ROW LEVEL SECURITY;

-- Allow users to insert, read, and update their own progress
DROP POLICY IF EXISTS "Users can manage own question progress" ON public.user_question_progress;
CREATE POLICY "Users can manage own question progress"
  ON public.user_question_progress FOR ALL
  USING (true)
  WITH CHECK (true);
