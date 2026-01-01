-- Create store_settings table for footer/contact information
CREATE TABLE public.store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  about_us text NOT NULL DEFAULT 'نحن متجر إلكتروني جزائري متخصص في توفير أفضل الأدوات والمعدات بأسعار تنافسية مع خدمة توصيل لجميع الولايات.',
  phone text NOT NULL DEFAULT '+213 555 123 456',
  email text NOT NULL DEFAULT 'contact@store.dz',
  address text NOT NULL DEFAULT 'الجزائر العاصمة',
  working_hours_weekdays text NOT NULL DEFAULT 'السبت - الخميس: 9:00 - 18:00',
  working_hours_friday text NOT NULL DEFAULT 'الجمعة: عطلة',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Public can view store settings
CREATE POLICY "Store settings viewable by everyone"
ON public.store_settings
FOR SELECT
USING (true);

-- Only admins can update
CREATE POLICY "Only admins can update store settings"
ON public.store_settings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can insert
CREATE POLICY "Only admins can insert store settings"
ON public.store_settings
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete
CREATE POLICY "Only admins can delete store settings"
ON public.store_settings
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_store_settings_updated_at
BEFORE UPDATE ON public.store_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default row
INSERT INTO public.store_settings (id) VALUES (gen_random_uuid());