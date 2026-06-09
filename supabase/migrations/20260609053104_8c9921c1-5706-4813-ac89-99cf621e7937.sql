
-- 1. course_files: restrict SELECT to authenticated
DROP POLICY IF EXISTS course_files_select_all ON public.course_files;
CREATE POLICY course_files_select_auth ON public.course_files FOR SELECT TO authenticated USING (true);

-- 2. storage: drop public read, allow authenticated read
DROP POLICY IF EXISTS public_read_buckets ON storage.objects;
CREATE POLICY auth_read_buckets ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id IN ('coaching-logos','course-covers','course-files'));

-- 3. user_roles: explicit admin-only write policies
DROP POLICY IF EXISTS user_roles_admin_insert ON public.user_roles;
DROP POLICY IF EXISTS user_roles_admin_update ON public.user_roles;
DROP POLICY IF EXISTS user_roles_admin_delete ON public.user_roles;
CREATE POLICY user_roles_admin_insert ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY user_roles_admin_update ON public.user_roles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY user_roles_admin_delete ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. has_role: revoke direct execute from public/anon/authenticated (RLS still uses it as SECURITY DEFINER)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
