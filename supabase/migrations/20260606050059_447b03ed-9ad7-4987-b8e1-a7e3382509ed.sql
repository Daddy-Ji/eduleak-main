
-- PORTALS
CREATE TABLE public.portals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text,
  emoji text DEFAULT '📚',
  link_url text,
  whatsapp_url text,
  embed_in_app boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portals TO anon, authenticated;
GRANT ALL ON public.portals TO service_role;
ALTER TABLE public.portals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portals_select_all" ON public.portals FOR SELECT USING (true);
CREATE POLICY "portals_admin_all" ON public.portals FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- FEATURED INSTITUTES (separate from coachings, for the marquee)
CREATE TABLE public.featured_institutes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  link_url text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.featured_institutes TO anon, authenticated;
GRANT ALL ON public.featured_institutes TO service_role;
ALTER TABLE public.featured_institutes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fi_select_all" ON public.featured_institutes FOR SELECT USING (true);
CREATE POLICY "fi_admin_all" ON public.featured_institutes FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- WHY CHOOSE US cards
CREATE TABLE public.why_us (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon text DEFAULT '✨',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.why_us TO anon, authenticated;
GRANT ALL ON public.why_us TO service_role;
ALTER TABLE public.why_us ENABLE ROW LEVEL SECURITY;
CREATE POLICY "why_select_all" ON public.why_us FOR SELECT USING (true);
CREATE POLICY "why_admin_all" ON public.why_us FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- WHO IS THIS FOR cards
CREATE TABLE public.audience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon text DEFAULT '🎯',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audience TO anon, authenticated;
GRANT ALL ON public.audience TO service_role;
ALTER TABLE public.audience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audience_select_all" ON public.audience FOR SELECT USING (true);
CREATE POLICY "audience_admin_all" ON public.audience FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  link_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.notifications TO anon, authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif_select_active" ON public.notifications FOR SELECT USING (is_active = true);
CREATE POLICY "notif_admin_all" ON public.notifications FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Extend site_settings with editable copy for every section + feature flags
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS site_name text DEFAULT 'EduShare',
  ADD COLUMN IF NOT EXISTS tagline text,
  ADD COLUMN IF NOT EXISTS portals_title text DEFAULT 'Explore our Portals',
  ADD COLUMN IF NOT EXISTS portals_subtitle text DEFAULT 'Everything you need — categorised',
  ADD COLUMN IF NOT EXISTS institutes_title text DEFAULT 'Featured Institutions',
  ADD COLUMN IF NOT EXISTS institutes_subtitle text DEFAULT 'India''s top coaching platforms — all in one place',
  ADD COLUMN IF NOT EXISTS why_title text DEFAULT 'Why Choose Us?',
  ADD COLUMN IF NOT EXISTS why_subtitle text DEFAULT 'Everything you need — organised, free & effective',
  ADD COLUMN IF NOT EXISTS who_title text DEFAULT 'Who is this for?',
  ADD COLUMN IF NOT EXISTS who_subtitle text DEFAULT 'Designed for Indian competitive exam aspirants',
  ADD COLUMN IF NOT EXISTS cta_title text DEFAULT 'Ready to Start?',
  ADD COLUMN IF NOT EXISTS cta_subtitle text DEFAULT 'Join thousands of students who cracked their exams.',
  ADD COLUMN IF NOT EXISTS cta_button_text text DEFAULT 'Get Started',
  ADD COLUMN IF NOT EXISTS cta_button_url text DEFAULT '/courses',
  ADD COLUMN IF NOT EXISTS footer_text text,
  ADD COLUMN IF NOT EXISTS intro_animation_enabled boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS telegram_popup_enabled boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS telegram_popup_every_visit boolean DEFAULT true;
