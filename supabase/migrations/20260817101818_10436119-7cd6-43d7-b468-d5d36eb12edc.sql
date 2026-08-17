-- roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- the very first signed-up user becomes admin (bootstrap for a single-owner site)
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created_bootstrap_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.bootstrap_first_admin();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- blog posts
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  cover_image text,
  read_time text NOT NULL DEFAULT '5 min read',
  body text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts are public" ON public.posts
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Admins can read all posts" ON public.posts
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can write posts" ON public.posts
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER posts_touch BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- editable pages (system pages + custom pages), content stored as ordered blocks
CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL UNIQUE,
  title text NOT NULL,
  kind text NOT NULL DEFAULT 'custom',
  status text NOT NULL DEFAULT 'draft',
  blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  show_in_nav boolean NOT NULL DEFAULT false,
  nav_label text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pages TO authenticated;
GRANT ALL ON public.pages TO service_role;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published pages are public" ON public.pages
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Admins can read all pages" ON public.pages
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can write pages" ON public.pages
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER pages_touch BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- per-page SEO overrides
CREATE TABLE public.seo_meta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL UNIQUE,
  title text,
  description text,
  keywords text,
  og_title text,
  og_description text,
  og_image text,
  canonical text,
  noindex boolean NOT NULL DEFAULT false,
  jsonld text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.seo_meta TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_meta TO authenticated;
GRANT ALL ON public.seo_meta TO service_role;
ALTER TABLE public.seo_meta ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SEO settings are public" ON public.seo_meta
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can write SEO settings" ON public.seo_meta
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER seo_touch BEFORE UPDATE ON public.seo_meta
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- seed the built-in pages so they show up in the admin page list
INSERT INTO public.pages (path, title, kind, status, sort_order) VALUES
  ('/', 'Home', 'system', 'published', 1),
  ('/about', 'About', 'system', 'published', 2),
  ('/services', 'Services', 'system', 'published', 3),
  ('/blog', 'Blog', 'system', 'published', 4),
  ('/contact', 'Contact', 'system', 'published', 5);

-- seed the existing blog articles so they are editable from the admin
INSERT INTO public.posts (slug, title, excerpt, category, read_time, status, published_at, body) VALUES
  ('ai-workflows-that-halve-content-time',
   'The AI workflow that cut my content production time in half',
   'Not prompts you copy from Twitter. A four-stage pipeline — research, brief, draft, human edit — with quality gates that keep the output publishable.',
   'AI & Automation', '7 min read', 'published', '2026-07-28T09:00:00Z',
   E'Most teams use AI as a faster typist. That''s why the output reads like everyone else''s. The gain isn''t in drafting — it''s in research, briefing and editing structure.\n\nMy pipeline has four stages. Research pulls SERP intent, competitor gaps and real customer objections. Briefing turns that into a structured outline with the angle decided by a human. Drafting is AI-assisted, section by section, against the brief. Editing is entirely human: claims verified, voice restored, examples added.\n\nThe measurable result across my own work is roughly a 50% reduction in production time with no drop in ranking performance — because the thinking still happens where it always did.'),
  ('ga4-mistakes-costing-you-money',
   'Five GA4 mistakes quietly wrecking your reporting',
   'Migrated GA4 properties are usually half-configured. Here''s what I find in almost every audit, and the order I fix it in.',
   'Analytics', '6 min read', 'published', '2026-07-14T09:00:00Z',
   E'Nearly every GA4 property I audit was migrated, not configured. The data flows, but the numbers don''t mean anything yet.\n\nThe usual suspects: multiple conversions marked as primary, form submissions counted on page load, no channel grouping fixes for paid social, internal traffic unfiltered, and Ads conversions imported twice.\n\nFix tracking before you touch bidding. Smart bidding optimised against a wrong conversion will confidently spend your budget in the wrong direction.'),
  ('seo-that-compounds',
   'Why SEO only pays off when you stop chasing keywords',
   'Ranking for a keyword is a tactic. Owning a topic — technically, editorially and commercially — is what actually compounds.',
   'SEO', '8 min read', 'published', '2026-06-30T09:00:00Z',
   E'A keyword list is not a strategy. It''s a shopping list without a recipe.\n\nThe B2B brand that doubled organic traffic in six months didn''t publish more. It fixed indexation, consolidated four thin pages into one strong one, and built support content around a single commercial topic.\n\nCompounding comes from depth plus internal linking plus technical health. Everything else is decoration.');