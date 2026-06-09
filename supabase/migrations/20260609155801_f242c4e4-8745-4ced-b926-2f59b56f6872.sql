
CREATE TABLE public.test_series (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text,
  emoji text DEFAULT '📝',
  logo_url text,
  link_url text,
  whatsapp_url text,
  category text,
  embed_in_app boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.test_series TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.test_series TO authenticated;
GRANT ALL ON public.test_series TO service_role;

ALTER TABLE public.test_series ENABLE ROW LEVEL SECURITY;

CREATE POLICY "test_series_public_read" ON public.test_series
  FOR SELECT USING (is_active = true);

CREATE POLICY "test_series_admin_all" ON public.test_series
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
