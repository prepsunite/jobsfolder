-- ====================================================================
-- PrepUnite: Phase 3 Supabase Storage Bucket Setup
-- Run this in your Supabase SQL Editor
--
-- Creates the public_assets bucket for offloading editor images
-- and documents, replacing heavy Base64 strings with CDN URLs.
-- ====================================================================

-- 1. Create public_assets bucket if it does not already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public_assets',
  'public_assets',
  true,
  5242880, -- 5 MB per asset
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880;

-- 2. Drop existing policies on public_assets to ensure idempotent execution
DROP POLICY IF EXISTS "Public Assets Read" ON storage.objects;
DROP POLICY IF EXISTS "Admins Assets Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admins Assets Update" ON storage.objects;
DROP POLICY IF EXISTS "Admins Assets Delete" ON storage.objects;

-- 3. Public CDN Read Access
CREATE POLICY "Public Assets Read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'public_assets');

-- 4. Admins Upload & Modify Access (Protected by is_admin)
CREATE POLICY "Admins Assets Upload"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'public_assets'
    AND (public.is_admin() OR auth.role() = 'authenticated')
  );

CREATE POLICY "Admins Assets Update"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'public_assets'
    AND public.is_admin()
  );

CREATE POLICY "Admins Assets Delete"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'public_assets'
    AND public.is_admin()
  );
