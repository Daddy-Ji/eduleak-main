ALTER TABLE public.portals ADD COLUMN IF NOT EXISTS logo_url text;

UPDATE public.site_settings
SET founders = REPLACE(founders::text, 'EduShare', 'EduLeak')::jsonb
WHERE founders::text LIKE '%EduShare%';

UPDATE public.site_settings SET site_name = 'EduLeak' WHERE site_name = 'EduShare' OR site_name IS NULL;