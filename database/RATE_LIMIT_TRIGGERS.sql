-- ====================================================================
-- PrepUnite: Database-Side Rate Limiting Triggers
-- Enforces sliding 24-hour quota directly inside PostgreSQL engine
-- Prevents abuse even if client-side localStorage is cleared or bypassed
--
-- Security Hardened:
-- 1. SET search_path = public, pg_temp prevents path injection
-- 2. Exempts system backups (MOCK_EXAM_BLUEPRINT:%, B2B_%) and Super Admins
-- ====================================================================

-- 1. Function to enforce Question Reports rate limit (max 5 per 24 hours)
CREATE OR REPLACE FUNCTION public.enforce_question_reports_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    recent_count INTEGER;
BEGIN
    -- Super admins bypass question reporting rate limits
    IF public.is_admin() THEN
        RETURN NEW;
    END IF;

    IF NEW.reporter_email IS NOT NULL AND TRIM(NEW.reporter_email) <> '' THEN
        SELECT COUNT(*)
        INTO recent_count
        FROM public.question_reports
        WHERE LOWER(TRIM(reporter_email)) = LOWER(TRIM(NEW.reporter_email))
          AND created_at >= NOW() - INTERVAL '24 hours';

        IF recent_count >= 5 THEN
            RAISE EXCEPTION 'Daily report limit reached (5/5) for this email. Thank you for your feedback!';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- Attach trigger to question_reports table
DROP TRIGGER IF EXISTS trg_question_reports_rate_limit ON public.question_reports;
CREATE TRIGGER trg_question_reports_rate_limit
    BEFORE INSERT ON public.question_reports
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_question_reports_rate_limit();


-- 2. Function to enforce Contact Messages rate limit (max 3 per 24 hours)
CREATE OR REPLACE FUNCTION public.enforce_contact_messages_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    recent_count INTEGER;
BEGIN
    -- 🛡️ Bypass rate limits for system key-value backups (blueprints, practice exams) and Super Admins
    IF NEW.subject LIKE 'MOCK_EXAM_BLUEPRINT:%' 
       OR NEW.subject LIKE 'B2B_%' 
       OR public.is_admin() THEN
        RETURN NEW;
    END IF;

    IF NEW.email IS NOT NULL AND TRIM(NEW.email) <> '' THEN
        SELECT COUNT(*)
        INTO recent_count
        FROM public.contact_messages
        WHERE LOWER(TRIM(email)) = LOWER(TRIM(NEW.email))
          AND created_at >= NOW() - INTERVAL '24 hours'
          AND NOT (subject LIKE 'MOCK_EXAM_BLUEPRINT:%' OR subject LIKE 'B2B_%');

        IF recent_count >= 3 THEN
            RAISE EXCEPTION 'Daily inquiry limit reached (3/3) for this email. Please try again tomorrow.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- Attach trigger to contact_messages table
DROP TRIGGER IF EXISTS trg_contact_messages_rate_limit ON public.contact_messages;
CREATE TRIGGER trg_contact_messages_rate_limit
    BEFORE INSERT ON public.contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_contact_messages_rate_limit();
