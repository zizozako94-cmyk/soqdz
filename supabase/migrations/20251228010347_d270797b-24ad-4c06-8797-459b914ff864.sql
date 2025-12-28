-- Site Settings table for brand identity, UI toggles, and general config
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Brand Identity
  primary_color text DEFAULT '#1e3a5f',
  secondary_color text DEFAULT '#d4a84b',
  accent_color text DEFAULT '#22c55e',
  font_family text DEFAULT 'Cairo',
  border_radius text DEFAULT 'rounded',
  -- UI Toggles
  sticky_order_bar boolean DEFAULT false,
  show_sales_popup boolean DEFAULT false,
  -- Pixels
  facebook_pixel text,
  tiktok_pixel text,
  snapchat_pixel text,
  -- WhatsApp Template
  whatsapp_template text DEFAULT 'مرحباً {customer_name}، شكراً لطلبك! المنتج: {product}، المبلغ الإجمالي: {total} دج. سيتم التواصل معك قريباً.',
  -- Hero Video
  hero_video_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Landing Content table for all editable text
CREATE TABLE public.landing_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Trust Badges/Features table
CREATE TABLE public.trust_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name text NOT NULL DEFAULT 'CheckCircle',
  title text NOT NULL,
  description text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  badge_type text DEFAULT 'guarantee',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- FAQ Items table
CREATE TABLE public.faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name text NOT NULL DEFAULT 'HelpCircle',
  title text NOT NULL,
  content text NOT NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Free Shipping Wilayas table
CREATE TABLE public.free_shipping_wilayas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wilaya_code text NOT NULL UNIQUE,
  wilaya_name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Sales Popups table for social proof
CREATE TABLE public.sales_popups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  wilaya text NOT NULL,
  product_name text NOT NULL,
  is_fake boolean DEFAULT true,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.free_shipping_wilayas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_popups ENABLE ROW LEVEL SECURITY;

-- Site Settings Policies
CREATE POLICY "Site settings viewable by everyone" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Only admins can update site settings" ON public.site_settings FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can insert site settings" ON public.site_settings FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete site settings" ON public.site_settings FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Landing Content Policies
CREATE POLICY "Landing content viewable by everyone" ON public.landing_content FOR SELECT USING (true);
CREATE POLICY "Only admins can update landing content" ON public.landing_content FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can insert landing content" ON public.landing_content FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete landing content" ON public.landing_content FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Trust Badges Policies
CREATE POLICY "Trust badges viewable by everyone" ON public.trust_badges FOR SELECT USING (true);
CREATE POLICY "Only admins can update trust badges" ON public.trust_badges FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can insert trust badges" ON public.trust_badges FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete trust badges" ON public.trust_badges FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- FAQ Items Policies
CREATE POLICY "FAQ items viewable by everyone" ON public.faq_items FOR SELECT USING (true);
CREATE POLICY "Only admins can update faq items" ON public.faq_items FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can insert faq items" ON public.faq_items FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete faq items" ON public.faq_items FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Free Shipping Wilayas Policies
CREATE POLICY "Free shipping wilayas viewable by everyone" ON public.free_shipping_wilayas FOR SELECT USING (true);
CREATE POLICY "Only admins can update free shipping" ON public.free_shipping_wilayas FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can insert free shipping" ON public.free_shipping_wilayas FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete free shipping" ON public.free_shipping_wilayas FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Sales Popups Policies
CREATE POLICY "Sales popups viewable by everyone" ON public.sales_popups FOR SELECT USING (true);
CREATE POLICY "Only admins can update sales popups" ON public.sales_popups FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can insert sales popups" ON public.sales_popups FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete sales popups" ON public.sales_popups FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_landing_content_updated_at BEFORE UPDATE ON public.landing_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_trust_badges_updated_at BEFORE UPDATE ON public.trust_badges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_faq_items_updated_at BEFORE UPDATE ON public.faq_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (id) VALUES (gen_random_uuid());

-- Insert default landing content
INSERT INTO public.landing_content (section_key, content) VALUES 
('hero', '{"urgency_text": "⚡ تبقى فقط {stock} قطعة!", "limited_badge": "🔥 عرض محدود", "cta_button": "🛒 اطلب الآن", "price_label": "السعر", "cod_label": "الدفع عند الاستلام"}'),
('order_form', '{"title": "📦 أكمل طلبك الآن", "subtitle": "املأ المعلومات التالية وسنتواصل معك لتأكيد الطلب", "submit_button": "✅ تأكيد الطلب", "security_note": "🔒 معلوماتك محمية ولن تُشارك مع أي طرف ثالث"}'),
('trust_section', '{"title": "معلومات مهمة"}'),
('footer', '{"about_title": "من نحن", "about_text": "نحن متجر إلكتروني جزائري متخصص في توفير أفضل الأدوات والمعدات بأسعار تنافسية مع خدمة توصيل لجميع الولايات.", "contact_title": "تواصل معنا", "phone": "+213 555 123 456", "email": "contact@store.dz", "address": "الجزائر العاصمة", "hours_title": "ساعات العمل", "hours_text": "السبت - الخميس: 9:00 - 18:00\nالجمعة: عطلة"}');

-- Insert default trust badges (guarantees)
INSERT INTO public.trust_badges (icon_name, title, badge_type, sort_order) VALUES
('CheckCircle', 'منتجات أصلية 100%', 'guarantee', 1),
('Shield', 'ضمان سنة كاملة', 'guarantee', 2),
('CreditCard', 'الدفع عند الاستلام', 'guarantee', 3),
('Truck', 'توصيل لكل الولايات', 'guarantee', 4);

-- Insert default FAQ items
INSERT INTO public.faq_items (icon_name, title, content, sort_order) VALUES
('RotateCcw', 'سياسة الاسترجاع', 'يمكنك استرجاع المنتج خلال 7 أيام من تاريخ الاستلام في حالة وجود أي عيب في التصنيع.', 1),
('Shield', 'الضمان', 'نقدم ضمان سنة كاملة على جميع منتجاتنا ضد عيوب التصنيع.', 2),
('Headphones', 'خدمة العملاء', 'فريق خدمة العملاء متاح للرد على استفساراتكم من السبت إلى الخميس.', 3),
('Truck', 'التوصيل', 'نوفر خدمة التوصيل لجميع ولايات الوطن. مدة التوصيل تتراوح بين 2-5 أيام عمل.', 4);