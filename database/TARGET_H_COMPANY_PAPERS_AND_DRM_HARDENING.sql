-- ====================================================================
-- PREPUNITE PRODUCTION DATABASE MIGRATION SCRIPT
-- TARGET H: COMPANY PLACEMENT HUB, DOCUMENT EXPLORER & DRM MONETIZATION
-- FILE: TARGET_H_COMPANY_PAPERS_AND_DRM_HARDENING.sql
-- ====================================================================

BEGIN;

-- --------------------------------------------------------------------
-- 1. HARDEN PUBLIC.EXAMS & PAPER_TABS INTEGRITY
-- --------------------------------------------------------------------

-- Ensure paper_tabs column exists on public.exams
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'exams' 
      AND column_name = 'paper_tabs'
  ) THEN
    ALTER TABLE public.exams ADD COLUMN paper_tabs JSONB DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'exams' 
      AND column_name = 'is_public_exam'
  ) THEN
    ALTER TABLE public.exams ADD COLUMN is_public_exam BOOLEAN DEFAULT FALSE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'exams' 
      AND column_name = 'price'
  ) THEN
    ALTER TABLE public.exams ADD COLUMN price NUMERIC DEFAULT 99;
  END IF;
END $$;

-- Enable RLS on exams
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

-- Ensure public can read non-deleted exams metadata
DROP POLICY IF EXISTS "Public read exams" ON public.exams;
DROP POLICY IF EXISTS "Admins insert exams" ON public.exams;
DROP POLICY IF EXISTS "Admins update exams" ON public.exams;
DROP POLICY IF EXISTS "Admins delete exams" ON public.exams;

CREATE POLICY "Public read exams"
  ON public.exams FOR SELECT
  USING (COALESCE(is_deleted, false) = false);

CREATE POLICY "Admins insert exams"
  ON public.exams FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins update exams"
  ON public.exams FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins delete exams"
  ON public.exams FOR DELETE
  USING (public.is_admin());

-- Column-level privilege restriction:
-- Revoke direct SELECT on paper_tabs from anon and authenticated roles.
-- This forces all clients to use get_secure_exams_by_company or get_secure_exam_by_id RPCs,
-- which execute under SECURITY DEFINER and scrub unpurchased content via redact_paper_nodes().
REVOKE SELECT (paper_tabs) ON public.exams FROM anon, authenticated;

-- --------------------------------------------------------------------
-- 2. HARDEN PUBLIC.PAPER_TAB_NODES TABLE & RLS
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.paper_tab_nodes (
    id TEXT PRIMARY KEY,
    exam_id TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    emoji VARCHAR(20) DEFAULT '📄',
    content TEXT DEFAULT '',
    parent_id TEXT,
    sort_order INT DEFAULT 0,
    is_free BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for lightning-fast tree traversal
CREATE INDEX IF NOT EXISTS idx_paper_tab_nodes_lookup 
    ON public.paper_tab_nodes(exam_id, is_deleted, sort_order);

CREATE INDEX IF NOT EXISTS idx_paper_tab_nodes_parent 
    ON public.paper_tab_nodes(parent_id);

ALTER TABLE public.paper_tab_nodes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public select paper nodes" ON public.paper_tab_nodes;
DROP POLICY IF EXISTS "Allow select" ON public.paper_tab_nodes;
DROP POLICY IF EXISTS "Allow public read access to paper_tab_nodes" ON public.paper_tab_nodes;
DROP POLICY IF EXISTS "Admin write paper nodes" ON public.paper_tab_nodes;
DROP POLICY IF EXISTS "Secure select paper nodes" ON public.paper_tab_nodes;

CREATE POLICY "Admin write paper nodes"
    ON public.paper_tab_nodes FOR ALL
    USING (public.is_admin());

CREATE POLICY "Secure select paper nodes"
    ON public.paper_tab_nodes FOR SELECT
    USING (
        is_deleted = false AND (
            is_free = true 
            OR public.is_admin() 
            OR (
                auth.jwt() ->> 'email' IS NOT NULL 
                AND public.check_user_paper_access(LOWER(auth.jwt() ->> 'email'), exam_id::TEXT)
            )
        )
    );

-- --------------------------------------------------------------------
-- 3. HARDEN PUBLIC.USER_PAPER_PURCHASES TABLE & RLS
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.user_paper_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    exam_id VARCHAR(100) NOT NULL,
    order_id VARCHAR(255),
    payment_id VARCHAR(255),
    amount_paid NUMERIC(10, 2) DEFAULT 0.00,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_user_exam_purchase UNIQUE (user_email, exam_id)
);

CREATE INDEX IF NOT EXISTS idx_user_paper_purchases_lookup 
    ON public.user_paper_purchases(user_email, exam_id, expires_at);

ALTER TABLE public.user_paper_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own paper purchases" ON public.user_paper_purchases;
DROP POLICY IF EXISTS "Admins manage paper purchases" ON public.user_paper_purchases;

CREATE POLICY "Users read own paper purchases"
    ON public.user_paper_purchases FOR SELECT
    USING (
        LOWER(TRIM(user_email)) = LOWER(TRIM(auth.jwt() ->> 'email'))
        OR auth.uid() = user_id
        OR public.is_admin()
    );

CREATE POLICY "Admins manage paper purchases"
    ON public.user_paper_purchases FOR ALL
    USING (public.is_admin());

-- --------------------------------------------------------------------
-- 4. RECURSIVE NODE CONTENT REDACTION FUNCTION (DRM KERNEL)
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.redact_paper_nodes(
  p_nodes JSONB,
  p_has_access BOOLEAN,
  p_is_public BOOLEAN DEFAULT FALSE
) RETURNS JSONB AS $$
DECLARE
  v_node JSONB;
  v_result JSONB := '[]'::jsonb;
  v_children JSONB;
  v_is_free BOOLEAN;
BEGIN
  IF p_nodes IS NULL OR jsonb_array_length(p_nodes) = 0 THEN
    RETURN '[]'::jsonb;
  END IF;

  -- If user has paid pass, institutional entitlement, or exam is 100% public, return unredacted content
  IF p_has_access OR p_is_public THEN
    RETURN p_nodes;
  END IF;

  -- Redact each node recursively
  FOR v_node IN SELECT * FROM jsonb_array_elements(p_nodes) LOOP
    v_is_free := COALESCE((v_node->>'isFree')::boolean, (v_node->>'is_free')::boolean, false);
    
    -- Recursively redact child subtabs
    IF v_node ? 'children' AND jsonb_array_length(v_node->'children') > 0 THEN
      v_children := public.redact_paper_nodes(v_node->'children', p_has_access, p_is_public);
      v_node := jsonb_set(v_node, '{children}', v_children);
    END IF;

    -- If node is not free, strip out proprietary content completely
    IF NOT v_is_free THEN
      v_node := jsonb_set(v_node, '{content}', 'null'::jsonb);
    END IF;

    v_result := v_result || jsonb_build_array(v_node);
  END LOOP;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- --------------------------------------------------------------------
-- 5. SECURE COMPANY EXAMS RETRIEVAL RPC (SERVER-SIDE REDACTION)
-- --------------------------------------------------------------------

DROP FUNCTION IF EXISTS public.get_secure_exams_by_company(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.get_secure_exams_by_company(TEXT);

CREATE OR REPLACE FUNCTION public.get_secure_exams_by_company(
  p_company_slug TEXT,
  p_user_email TEXT DEFAULT NULL
) RETURNS TABLE (
  id TEXT,
  company_id UUID,
  company_slug VARCHAR,
  name VARCHAR,
  badge VARCHAR,
  content TEXT,
  old_papers TEXT,
  price NUMERIC,
  paper_tabs JSONB,
  google_doc_embed_url TEXT,
  google_doc_edit_url TEXT,
  upvotes INT,
  is_public_exam BOOLEAN,
  has_user_access BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_is_admin BOOLEAN := FALSE;
  v_effective_email TEXT := NULL;
  v_jwt_email TEXT;
BEGIN
  v_is_admin := public.is_admin();

  v_jwt_email := auth.jwt() ->> 'email';
  IF v_jwt_email IS NOT NULL AND v_jwt_email != '' THEN
    v_effective_email := LOWER(TRIM(v_jwt_email));
  ELSIF v_is_admin AND p_user_email IS NOT NULL THEN
    v_effective_email := LOWER(TRIM(p_user_email));
  END IF;

  RETURN QUERY
  SELECT 
    e.id::TEXT,
    e.company_id,
    e.company_slug,
    e.name,
    e.badge,
    e.content,
    e.old_papers,
    e.price,
    public.redact_paper_nodes(
      e.paper_tabs, 
      v_is_admin OR (v_effective_email IS NOT NULL AND public.check_user_paper_access(v_effective_email, e.id::TEXT)),
      COALESCE(e.is_public_exam, false)
    ) AS paper_tabs,
    e.google_doc_embed_url,
    e.google_doc_edit_url,
    e.upvotes,
    COALESCE(e.is_public_exam, false) AS is_public_exam,
    (v_is_admin OR COALESCE(e.is_public_exam, false) OR (v_effective_email IS NOT NULL AND public.check_user_paper_access(v_effective_email, e.id::TEXT))) AS has_user_access,
    e.created_at,
    e.updated_at
  FROM public.exams e
  WHERE e.company_slug = p_company_slug
    AND e.is_deleted = false
  ORDER BY e.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_secure_exams_by_company(TEXT, TEXT) TO anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- 6. SECURE SINGLE EXAM RETRIEVAL RPC (NEW: DIRECT DEEP-LINK VIEWER)
-- --------------------------------------------------------------------

DROP FUNCTION IF EXISTS public.get_secure_exam_by_id(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.get_secure_exam_by_id(TEXT);

CREATE OR REPLACE FUNCTION public.get_secure_exam_by_id(
  p_exam_id TEXT,
  p_user_email TEXT DEFAULT NULL
) RETURNS TABLE (
  id TEXT,
  company_id UUID,
  company_slug VARCHAR,
  name VARCHAR,
  badge VARCHAR,
  content TEXT,
  old_papers TEXT,
  price NUMERIC,
  paper_tabs JSONB,
  google_doc_embed_url TEXT,
  google_doc_edit_url TEXT,
  upvotes INT,
  is_public_exam BOOLEAN,
  has_user_access BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_is_admin BOOLEAN := FALSE;
  v_effective_email TEXT := NULL;
  v_jwt_email TEXT;
BEGIN
  v_is_admin := public.is_admin();

  v_jwt_email := auth.jwt() ->> 'email';
  IF v_jwt_email IS NOT NULL AND v_jwt_email != '' THEN
    v_effective_email := LOWER(TRIM(v_jwt_email));
  ELSIF v_is_admin AND p_user_email IS NOT NULL THEN
    v_effective_email := LOWER(TRIM(p_user_email));
  END IF;

  RETURN QUERY
  SELECT 
    e.id::TEXT,
    e.company_id,
    e.company_slug,
    e.name,
    e.badge,
    e.content,
    e.old_papers,
    e.price,
    public.redact_paper_nodes(
      e.paper_tabs, 
      v_is_admin OR (v_effective_email IS NOT NULL AND public.check_user_paper_access(v_effective_email, e.id::TEXT)),
      COALESCE(e.is_public_exam, false)
    ) AS paper_tabs,
    e.google_doc_embed_url,
    e.google_doc_edit_url,
    e.upvotes,
    COALESCE(e.is_public_exam, false) AS is_public_exam,
    (v_is_admin OR COALESCE(e.is_public_exam, false) OR (v_effective_email IS NOT NULL AND public.check_user_paper_access(v_effective_email, e.id::TEXT))) AS has_user_access,
    e.created_at,
    e.updated_at
  FROM public.exams e
  WHERE e.id::TEXT = p_exam_id
    AND e.is_deleted = false
  LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_secure_exam_by_id(TEXT, TEXT) TO anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- 7. ATOMIC EXAM PAPER TABS & RELATIONAL NODES SYNCHRONIZER RPC
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.save_exam_paper_tabs(
  p_exam_id TEXT,
  p_tabs JSONB
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_node JSONB;
  v_child JSONB;
  v_idx INT := 0;
  v_child_idx INT := 0;
  v_active_node_ids TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- Strict administrator authorization verification
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access Denied: Only authenticated administrators can modify exam paper tabs.';
  END IF;

  -- 1. Update the master JSONB column on public.exams
  UPDATE public.exams
  SET paper_tabs = p_tabs,
      updated_at = NOW()
  WHERE id::TEXT = p_exam_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Exam with ID % not found.', p_exam_id;
  END IF;

  -- 2. Traverse tree and synchronize rows into public.paper_tab_nodes
  IF p_tabs IS NOT NULL AND jsonb_array_length(p_tabs) > 0 THEN
    FOR v_node IN SELECT * FROM jsonb_array_elements(p_tabs) LOOP
      v_idx := v_idx + 1;
      v_active_node_ids := array_append(v_active_node_ids, v_node->>'id');

      INSERT INTO public.paper_tab_nodes (
        id, exam_id, title, emoji, content, parent_id, sort_order, is_free, is_deleted, updated_at
      ) VALUES (
        v_node->>'id',
        p_exam_id,
        COALESCE(v_node->>'title', 'Untitled Section'),
        COALESCE(v_node->>'emoji', '📄'),
        COALESCE(v_node->>'content', ''),
        NULL,
        v_idx,
        COALESCE((v_node->>'isFree')::boolean, (v_node->>'is_free')::boolean, false),
        FALSE,
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        emoji = EXCLUDED.emoji,
        content = EXCLUDED.content,
        parent_id = EXCLUDED.parent_id,
        sort_order = EXCLUDED.sort_order,
        is_free = EXCLUDED.is_free,
        is_deleted = FALSE,
        updated_at = NOW();

      -- Synchronize nested children
      IF v_node ? 'children' AND jsonb_array_length(v_node->'children') > 0 THEN
        v_child_idx := 0;
        FOR v_child IN SELECT * FROM jsonb_array_elements(v_node->'children') LOOP
          v_child_idx := v_child_idx + 1;
          v_active_node_ids := array_append(v_active_node_ids, v_child->>'id');

          INSERT INTO public.paper_tab_nodes (
            id, exam_id, title, emoji, content, parent_id, sort_order, is_free, is_deleted, updated_at
          ) VALUES (
            v_child->>'id',
            p_exam_id,
            COALESCE(v_child->>'title', 'Untitled Subtab'),
            COALESCE(v_child->>'emoji', '📄'),
            COALESCE(v_child->>'content', ''),
            v_node->>'id',
            v_child_idx,
            COALESCE((v_child->>'isFree')::boolean, (v_child->>'is_free')::boolean, false),
            FALSE,
            NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            emoji = EXCLUDED.emoji,
            content = EXCLUDED.content,
            parent_id = EXCLUDED.parent_id,
            sort_order = EXCLUDED.sort_order,
            is_free = EXCLUDED.is_free,
            is_deleted = FALSE,
            updated_at = NOW();
        END LOOP;
      END IF;
    END LOOP;

    -- Soft-delete any nodes that were deleted from the tree
    UPDATE public.paper_tab_nodes
    SET is_deleted = TRUE,
        updated_at = NOW()
    WHERE exam_id = p_exam_id
      AND NOT (id = ANY(v_active_node_ids));
  ELSE
    -- If tabs is empty, soft-delete all nodes for this exam
    UPDATE public.paper_tab_nodes
    SET is_deleted = TRUE,
        updated_at = NOW()
    WHERE exam_id = p_exam_id;
  END IF;

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.save_exam_paper_tabs(TEXT, JSONB) TO authenticated, service_role;

-- --------------------------------------------------------------------
-- 8. DPDP USER PAPER PURCHASE ERASURE INTEGRATION
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.erase_user_paper_purchases(
    p_user_id UUID,
    p_user_email TEXT
)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_affected INT := 0;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Administrative privileges required for DPDP right-to-erasure.';
    END IF;

    DELETE FROM public.user_paper_purchases
    WHERE (p_user_id IS NOT NULL AND user_id = p_user_id)
       OR (p_user_email IS NOT NULL AND LOWER(TRIM(user_email)) = LOWER(TRIM(p_user_email)));
    GET DIAGNOSTICS v_affected = ROW_COUNT;

    RETURN v_affected;
END;
$$;

COMMIT;
