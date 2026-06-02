
CREATE POLICY "public_read_buckets" ON storage.objects FOR SELECT
USING (bucket_id IN ('coaching-logos','course-covers','course-files'));

CREATE POLICY "admin_write_buckets" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id IN ('coaching-logos','course-covers','course-files') AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_update_buckets" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id IN ('coaching-logos','course-covers','course-files') AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_delete_buckets" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id IN ('coaching-logos','course-covers','course-files') AND public.has_role(auth.uid(), 'admin'));
