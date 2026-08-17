CREATE TABLE public.nav_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label text NOT NULL,
  url text NOT NULL DEFAULT '/',
  parent_id uuid REFERENCES public.nav_items(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.nav_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nav_items TO authenticated;
GRANT ALL ON public.nav_items TO service_role;

ALTER TABLE public.nav_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Menu is public" ON public.nav_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can write menu" ON public.nav_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER nav_items_touch BEFORE UPDATE ON public.nav_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX nav_items_parent_sort_idx ON public.nav_items (parent_id, sort_order);