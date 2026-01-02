-- Create wilaya delivery prices table
CREATE TABLE public.wilaya_delivery_prices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wilaya_code text NOT NULL UNIQUE,
  wilaya_name text NOT NULL,
  home_price numeric NOT NULL DEFAULT 0,
  office_price numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wilaya_delivery_prices ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Wilaya prices viewable by everyone" ON public.wilaya_delivery_prices FOR SELECT USING (true);
CREATE POLICY "Only admins can update wilaya prices" ON public.wilaya_delivery_prices FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can insert wilaya prices" ON public.wilaya_delivery_prices FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete wilaya prices" ON public.wilaya_delivery_prices FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert all wilaya prices
INSERT INTO public.wilaya_delivery_prices (wilaya_code, wilaya_name, home_price, office_price) VALUES
('01', 'أدرار', 1100, 550),
('02', 'الشلف', 650, 350),
('03', 'الأغواط', 800, 350),
('04', 'أم البواقي', 650, 350),
('05', 'باتنة', 650, 350),
('06', 'بجاية', 600, 350),
('07', 'بسكرة', 700, 350),
('08', 'بشار', 900, 500),
('09', 'البليدة', 450, 450),
('10', 'البويرة', 600, 350),
('11', 'تمنراست', 1500, 700),
('12', 'تبسة', 700, 350),
('13', 'تلمسان', 650, 350),
('14', 'تيارت', 700, 350),
('15', 'تيزي وزو', 600, 350),
('16', 'الجزائر', 300, 300),
('17', 'الجلفة', 800, 450),
('18', 'جيجل', 650, 350),
('19', 'سطيف', 650, 350),
('20', 'سعيدة', 700, 350),
('21', 'سكيكدة', 650, 350),
('22', 'سيدي بلعباس', 650, 350),
('23', 'عنابة', 650, 350),
('24', 'قالمة', 700, 350),
('25', 'قسنطينة', 650, 350),
('26', 'المدية', 600, 350),
('27', 'مستغانم', 650, 350),
('28', 'المسيلة', 700, 350),
('29', 'معسكر', 650, 350),
('30', 'ورقلة', 900, 450),
('31', 'وهران', 600, 350),
('32', 'البيض', 1000, 800),
('33', 'إليزي', 1500, 1500),
('34', 'برج بوعريريج', 650, 350),
('35', 'بومرداس', 400, 400),
('36', 'الطارف', 700, 350),
('37', 'تندوف', 1300, 1300),
('38', 'تيسمسيلت', 650, 350),
('39', 'الوادي', 900, 500),
('40', 'خنشلة', 700, 350),
('41', 'سوق أهراس', 750, 400),
('42', 'تيبازة', 400, 300),
('43', 'ميلة', 700, 400),
('44', 'عين الدفلى', 650, 350),
('45', 'النعامة', 900, 450),
('46', 'عين تموشنت', 650, 400),
('47', 'غرداية', 800, 450),
('48', 'غليزان', 750, 400),
('49', 'تيميمون', 1200, 750),
('51', 'أولاد جلال', 850, 550),
('52', 'بني عباس', 1000, 1000),
('53', 'عين صالح', 1600, 900),
('55', 'تقرت', 850, 450),
('57', 'المغير', 950, 500),
('58', 'المنيعة', 950, 550);