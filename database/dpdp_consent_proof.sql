-- ============================================================
-- DPDP Act 2023 — Consent Proof Storage in Supabase
-- PrepUnite / Jobsfolder
-- August 2026
-- ============================================================
-- Adds consent tracking columns to the profiles table.
-- This is the legal proof of consent under DPDP Act 2023.
-- localStorage is secondary; Supabase record is the authoritative proof.
-- ============================================================

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS consent_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS consent_accepted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS consent_ip VARCHAR(45); -- optional, for future use

-- Index for quick compliance reporting
CREATE INDEX IF NOT EXISTS idx_profiles_consent ON public.profiles(consent_status);

-- Verification
SELECT id, email, consent_status, consent_accepted_at
FROM public.profiles
LIMIT 5;
