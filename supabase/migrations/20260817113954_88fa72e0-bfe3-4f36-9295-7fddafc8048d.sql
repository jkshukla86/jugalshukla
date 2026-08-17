-- 1. SEO metadata: no longer world-readable
DROP POLICY IF EXISTS "SEO settings are public" ON public.seo_meta;
REVOKE SELECT ON public.seo_meta FROM anon;
CREATE POLICY "Admins can read SEO settings"
  ON public.seo_meta FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
GRANT ALL ON public.seo_meta TO service_role;

-- 2. Site-wide injected code: no longer world-readable
DROP POLICY IF EXISTS "Site settings are public" ON public.site_settings;
REVOKE SELECT ON public.site_settings FROM anon;
CREATE POLICY "Admins can read site settings"
  ON public.site_settings FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
GRANT ALL ON public.site_settings TO service_role;

-- 3. Trigger-only SECURITY DEFINER functions must not be callable via the API
REVOKE ALL ON FUNCTION public.bootstrap_first_admin() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

-- 4. Media bucket: explicit admin-only access control on storage objects
CREATE POLICY "Admins can read media files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can upload media files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update media files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete media files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));