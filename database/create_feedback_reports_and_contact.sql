-- ====================================================================
-- PrepUnite: Question Reports & Contact Messages Schema Migration
-- Enables real-time student reporting, contact inquiries, and admin moderation
-- ====================================================================

-- 1. Question Reports Table
CREATE TABLE IF NOT EXISTS public.question_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id VARCHAR(255) NOT NULL,
    question_statement TEXT NOT NULL,
    company_slug VARCHAR(255),
    topic_id VARCHAR(150),
    issue_type VARCHAR(100) NOT NULL DEFAULT 'OTHER',
    details TEXT,
    reporter_email VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN', -- 'OPEN', 'RESOLVED', 'DISMISSED'
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Safely Add Columns if Table Exists
ALTER TABLE public.question_reports ADD COLUMN IF NOT EXISTS question_statement TEXT;
ALTER TABLE public.question_reports ADD COLUMN IF NOT EXISTS company_slug VARCHAR(255);
ALTER TABLE public.question_reports ADD COLUMN IF NOT EXISTS topic_id VARCHAR(150);
ALTER TABLE public.question_reports ADD COLUMN IF NOT EXISTS issue_type VARCHAR(100) DEFAULT 'OTHER';
ALTER TABLE public.question_reports ADD COLUMN IF NOT EXISTS details TEXT;
ALTER TABLE public.question_reports ADD COLUMN IF NOT EXISTS reporter_email VARCHAR(255);
ALTER TABLE public.question_reports ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'OPEN';
ALTER TABLE public.question_reports ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE public.question_reports ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.question_reports ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP WITH TIME ZONE;

-- 2. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL DEFAULT 'General Inquiry',
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW', -- 'NEW', 'IN_PROGRESS', 'RESOLVED'
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Safely Add Columns if Table Exists
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS subject VARCHAR(255) DEFAULT 'General Inquiry';
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'NEW';
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP WITH TIME ZONE;

-- 3. Indexes for fast lookup & filtering
CREATE INDEX IF NOT EXISTS idx_question_reports_status ON public.question_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_question_reports_qid ON public.question_reports(question_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.question_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for Question Reports
DROP POLICY IF EXISTS "Public insert question reports" ON public.question_reports;
CREATE POLICY "Public insert question reports"
  ON public.question_reports FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access question reports" ON public.question_reports;
CREATE POLICY "Admin full access question reports"
  ON public.question_reports FOR ALL
  USING (public.is_admin());

-- 6. RLS Policies for Contact Messages
DROP POLICY IF EXISTS "Public insert contact messages" ON public.contact_messages;
CREATE POLICY "Public insert contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access contact messages" ON public.contact_messages;
CREATE POLICY "Admin full access contact messages"
  ON public.contact_messages FOR ALL
  USING (public.is_admin());
