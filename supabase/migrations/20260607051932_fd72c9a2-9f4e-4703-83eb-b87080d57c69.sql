ALTER TABLE public.portals ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS site_logo_url text;