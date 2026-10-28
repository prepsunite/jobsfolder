-- ====================================================================
-- PrepUnite Security Patch: Fix Privilege Escalation on public.profiles
-- Target: Prevent authenticated users from modifying role or is_tpo_admin
-- Date: 2026-10-28
-- ====================================================================

-- 1. Create a defensive trigger to block privilege escalation at the row level
CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Super Admins are permitted to perform administrative updates
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  -- Block any non-admin attempt to elevate or alter their role
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Unauthorized: Non-admin users cannot alter their role (attempted % -> %)', OLD.role, NEW.role;
  END IF;

  -- Block any non-admin attempt to grant themselves TPO admin privileges
  IF NEW.is_tpo_admin IS DISTINCT FROM OLD.is_tpo_admin THEN
    RAISE EXCEPTION 'Unauthorized: Non-admin users cannot alter is_tpo_admin status';
  END IF;

  -- Block non-admin attempt to transfer to another college once assigned
  IF NEW.college_id IS DISTINCT FROM OLD.college_id AND OLD.college_id IS NOT NULL THEN
    RAISE EXCEPTION 'Unauthorized: Non-admin users cannot transfer their assigned college';
  END IF;

  RETURN NEW;
END;
$$;

-- 2. Attach the trigger to public.profiles
DROP TRIGGER IF EXISTS trg_prevent_profile_privilege_escalation ON public.profiles;

CREATE TRIGGER trg_prevent_profile_privilege_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_profile_privilege_escalation();

-- 3. Replace the overly permissive RLS policy with explicit column-safe check
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.uid()) = id
    OR (SELECT public.is_admin())
  )
  WITH CHECK (
    public.is_admin()
    OR (
      (SELECT auth.uid()) = id
      AND (
        role IS NOT DISTINCT FROM (SELECT p.role FROM public.profiles p WHERE p.id = (SELECT auth.uid()))
      )
      AND (
        is_tpo_admin IS NOT DISTINCT FROM (SELECT p.is_tpo_admin FROM public.profiles p WHERE p.id = (SELECT auth.uid()))
      )
    )
  );
