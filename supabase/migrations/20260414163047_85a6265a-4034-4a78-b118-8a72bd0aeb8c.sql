
-- Option Sets table
CREATE TABLE public.option_sets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Option Set Items table
CREATE TABLE public.option_set_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  option_set_id UUID NOT NULL REFERENCES public.option_sets(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add option_set_id to products
ALTER TABLE public.products ADD COLUMN option_set_id UUID REFERENCES public.option_sets(id) ON DELETE SET NULL;

-- RLS on option_sets
ALTER TABLE public.option_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view option sets" ON public.option_sets
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage option sets" ON public.option_sets
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS on option_set_items
ALTER TABLE public.option_set_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view option set items" ON public.option_set_items
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage option set items" ON public.option_set_items
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger for option_sets
CREATE TRIGGER update_option_sets_updated_at
  BEFORE UPDATE ON public.option_sets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
