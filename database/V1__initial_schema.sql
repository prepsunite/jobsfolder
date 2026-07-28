-- PrepUnite Database Schema
-- Version: 1.0.0 (MVP)
-- All tables use UUID primary keys

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- For full-text search trigram support

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE user_role AS ENUM (
    'GUEST',
    'USER',
    'VERIFIED_CONTRIBUTOR',
    'MODERATOR',
    'ADMIN',
    'SUPER_ADMIN'
);

CREATE TYPE experience_status AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);

CREATE TYPE report_status AS ENUM (
    'OPEN',
    'RESOLVED',
    'DISMISSED'
);

CREATE TYPE question_difficulty AS ENUM (
    'EASY',
    'MEDIUM',
    'HARD'
);

CREATE TYPE question_type AS ENUM (
    'CODING',
    'SQL',
    'APTITUDE',
    'MCQ',
    'PUZZLE',
    'TECHNICAL',
    'HR'
);

CREATE TYPE resource_category AS ENUM (
    'YOUTUBE',
    'NOTES',
    'PDF',
    'CHEAT_SHEET',
    'ARTICLE',
    'PLAYLIST',
    'DOCUMENTATION',
    'BOOK',
    'PRACTICE_WEBSITE'
);

CREATE TYPE notification_type AS ENUM (
    'COMPANY_UPDATE',
    'NEW_EXPERIENCE',
    'DEADLINE_REMINDER',
    'TRENDING_QUESTION',
    'SUBMISSION_APPROVED',
    'SUBMISSION_REJECTED',
    'SYSTEM_ANNOUNCEMENT'
);

CREATE TYPE hiring_round_type AS ENUM (
    'ONLINE_ASSESSMENT',
    'TECHNICAL_INTERVIEW',
    'HR_INTERVIEW',
    'CODING_ROUND',
    'SYSTEM_DESIGN',
    'MANAGERIAL',
    'GROUP_DISCUSSION',
    'OTHER'
);

-- ============================================
-- USERS
-- ============================================
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id        VARCHAR(255) NOT NULL UNIQUE,
    username        VARCHAR(100) UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    avatar_url      TEXT,
    bio             TEXT,
    college         VARCHAR(255),
    graduation_year INTEGER,
    role            user_role NOT NULL DEFAULT 'USER',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- COMPANIES
-- ============================================
CREATE TABLE companies (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL UNIQUE,
    logo_url        TEXT,
    website         TEXT,
    description     TEXT,
    industry        VARCHAR(100),
    company_size    VARCHAR(50),
    headquarters    VARCHAR(255),
    founded_year    INTEGER,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_companies_name ON companies USING gin(name gin_trgm_ops);
CREATE INDEX idx_companies_industry ON companies(industry);

-- ============================================
-- COMPANY ROLES
-- ============================================
CREATE TABLE company_roles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    salary_min      DECIMAL(12, 2),
    salary_max      DECIMAL(12, 2),
    salary_currency VARCHAR(10) DEFAULT 'INR',
    eligibility     TEXT,
    role_type       VARCHAR(50),          -- Full-time, Intern, Contract
    description     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_company_roles_company ON company_roles(company_id);

-- ============================================
-- HIRING PROCESS
-- ============================================
CREATE TABLE hiring_process (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    round_number    INTEGER NOT NULL,
    round_type      hiring_round_type NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    duration_minutes INTEGER,
    tips            TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(company_id, round_number)
);

CREATE INDEX idx_hiring_process_company ON hiring_process(company_id);

-- ============================================
-- OA QUESTIONS
-- ============================================
CREATE TABLE oa_questions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id      UUID REFERENCES companies(id) ON DELETE SET NULL,
    title           VARCHAR(500) NOT NULL,
    description     TEXT,
    difficulty      question_difficulty NOT NULL DEFAULT 'MEDIUM',
    question_type   question_type NOT NULL DEFAULT 'CODING',
    solution        TEXT,
    explanation     TEXT,
    frequency       INTEGER DEFAULT 0,          -- How often this appears
    year            INTEGER,                     -- Year it was asked
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_oa_questions_company ON oa_questions(company_id);
CREATE INDEX idx_oa_questions_difficulty ON oa_questions(difficulty);
CREATE INDEX idx_oa_questions_type ON oa_questions(question_type);
CREATE INDEX idx_oa_questions_title ON oa_questions USING gin(title gin_trgm_ops);

-- ============================================
-- QUESTION TAGS
-- ============================================
CREATE TABLE question_tags (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id     UUID NOT NULL REFERENCES oa_questions(id) ON DELETE CASCADE,
    tag             VARCHAR(100) NOT NULL,
    UNIQUE(question_id, tag)
);

CREATE INDEX idx_question_tags_question ON question_tags(question_id);
CREATE INDEX idx_question_tags_tag ON question_tags(tag);

-- ============================================
-- INTERVIEW EXPERIENCES
-- ============================================
CREATE TABLE interview_experiences (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    role            VARCHAR(255),
    college         VARCHAR(255),
    year            INTEGER,
    difficulty      question_difficulty,
    content         TEXT NOT NULL,
    tips            TEXT,
    resources_used  TEXT,
    status          experience_status NOT NULL DEFAULT 'PENDING',
    rejection_reason TEXT,
    is_anonymous    BOOLEAN NOT NULL DEFAULT FALSE,
    view_count      INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_experiences_user ON interview_experiences(user_id);
CREATE INDEX idx_experiences_company ON interview_experiences(company_id);
CREATE INDEX idx_experiences_status ON interview_experiences(status);
CREATE INDEX idx_experiences_content ON interview_experiences USING gin(content gin_trgm_ops);

-- ============================================
-- RESOURCES
-- ============================================
CREATE TABLE resources (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           VARCHAR(500) NOT NULL,
    url             TEXT NOT NULL,
    category        resource_category NOT NULL,
    description     TEXT,
    thumbnail_url   TEXT,
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    view_count      INTEGER NOT NULL DEFAULT 0,
    created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_title ON resources USING gin(title gin_trgm_ops);

-- ============================================
-- RESOURCE TAGS
-- ============================================
CREATE TABLE resource_tags (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id     UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    tag             VARCHAR(100) NOT NULL,
    UNIQUE(resource_id, tag)
);

CREATE INDEX idx_resource_tags_resource ON resource_tags(resource_id);
CREATE INDEX idx_resource_tags_tag ON resource_tags(tag);

-- ============================================
-- ROADMAPS
-- ============================================
CREATE TABLE roadmaps (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id      UUID REFERENCES companies(id) ON DELETE SET NULL,
    title           VARCHAR(500) NOT NULL,
    description     TEXT,
    is_published    BOOLEAN NOT NULL DEFAULT FALSE,
    created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_roadmaps_company ON roadmaps(company_id);

-- ============================================
-- ROADMAP STEPS
-- ============================================
CREATE TABLE roadmap_steps (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roadmap_id      UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
    step_order      INTEGER NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(roadmap_id, step_order)
);

CREATE INDEX idx_roadmap_steps_roadmap ON roadmap_steps(roadmap_id);

-- ============================================
-- ROADMAP STEP LINKS (links steps to questions/resources)
-- ============================================
CREATE TABLE roadmap_step_links (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    step_id         UUID NOT NULL REFERENCES roadmap_steps(id) ON DELETE CASCADE,
    linkable_type   VARCHAR(50) NOT NULL,       -- 'question', 'resource'
    linkable_id     UUID NOT NULL,
    display_order   INTEGER NOT NULL DEFAULT 0,
    UNIQUE(step_id, linkable_type, linkable_id)
);

CREATE INDEX idx_roadmap_step_links_step ON roadmap_step_links(step_id);

-- ============================================
-- BOOKMARKS (polymorphic)
-- ============================================
CREATE TABLE bookmarks (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bookmarkable_type VARCHAR(50) NOT NULL,      -- 'company', 'question', 'experience', 'resource', 'roadmap'
    bookmarkable_id UUID NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, bookmarkable_type, bookmarkable_id)
);

CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_target ON bookmarks(bookmarkable_type, bookmarkable_id);

-- ============================================
-- LIKES (polymorphic)
-- ============================================
CREATE TABLE likes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    likeable_type   VARCHAR(50) NOT NULL,        -- 'experience', 'question', 'resource'
    likeable_id     UUID NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, likeable_type, likeable_id)
);

CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_likes_target ON likes(likeable_type, likeable_id);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            notification_type NOT NULL,
    title           VARCHAR(255) NOT NULL,
    content         TEXT,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    action_url      TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);

-- ============================================
-- REPORTS
-- ============================================
CREATE TABLE reports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reportable_type VARCHAR(50) NOT NULL,         -- 'experience', 'question', 'resource', 'user'
    reportable_id   UUID NOT NULL,
    reason          TEXT NOT NULL,
    status          report_status NOT NULL DEFAULT 'OPEN',
    resolved_by     UUID REFERENCES users(id) ON DELETE SET NULL,
    resolution_note TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_reporter ON reports(reporter_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_target ON reports(reportable_type, reportable_id);

-- ============================================
-- AUDIT LOGS
-- ============================================
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    action          VARCHAR(100) NOT NULL,        -- 'CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT'
    entity_type     VARCHAR(100) NOT NULL,
    entity_id       UUID,
    details         JSONB,
    ip_address      VARCHAR(45),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- ============================================
-- FULL-TEXT SEARCH CONFIGURATION
-- ============================================

-- Weighted search vector for companies
ALTER TABLE companies ADD COLUMN search_vector tsvector;

CREATE OR REPLACE FUNCTION companies_search_vector_update() RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.industry, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_companies_search_vector
    BEFORE INSERT OR UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION companies_search_vector_update();

CREATE INDEX idx_companies_search ON companies USING gin(search_vector);

-- Weighted search vector for questions
ALTER TABLE oa_questions ADD COLUMN search_vector tsvector;

CREATE OR REPLACE FUNCTION questions_search_vector_update() RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_questions_search_vector
    BEFORE INSERT OR UPDATE ON oa_questions
    FOR EACH ROW EXECUTE FUNCTION questions_search_vector_update();

CREATE INDEX idx_questions_search ON oa_questions USING gin(search_vector);

-- Weighted search vector for resources
ALTER TABLE resources ADD COLUMN search_vector tsvector;

CREATE OR REPLACE FUNCTION resources_search_vector_update() RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_resources_search_vector
    BEFORE INSERT OR UPDATE ON resources
    FOR EACH ROW EXECUTE FUNCTION resources_search_vector_update();

CREATE INDEX idx_resources_search ON resources USING gin(search_vector);

-- Weighted search vector for experiences
ALTER TABLE interview_experiences ADD COLUMN search_vector tsvector;

CREATE OR REPLACE FUNCTION experiences_search_vector_update() RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.role, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.tips, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_experiences_search_vector
    BEFORE INSERT OR UPDATE ON interview_experiences
    FOR EACH ROW EXECUTE FUNCTION experiences_search_vector_update();

CREATE INDEX idx_experiences_search ON interview_experiences USING gin(search_vector);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_company_roles_updated_at BEFORE UPDATE ON company_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_hiring_process_updated_at BEFORE UPDATE ON hiring_process FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_oa_questions_updated_at BEFORE UPDATE ON oa_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_experiences_updated_at BEFORE UPDATE ON interview_experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_roadmaps_updated_at BEFORE UPDATE ON roadmaps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_roadmap_steps_updated_at BEFORE UPDATE ON roadmap_steps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
