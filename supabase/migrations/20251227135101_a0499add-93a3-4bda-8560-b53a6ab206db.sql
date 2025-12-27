-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 9200,
  description TEXT,
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  stock_count INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create delivery_settings table
CREATE TABLE public.delivery_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  office_price NUMERIC NOT NULL DEFAULT 500,
  home_price NUMERIC NOT NULL DEFAULT 700,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  wilaya TEXT NOT NULL,
  commune TEXT NOT NULL,
  delivery_type TEXT NOT NULL CHECK (delivery_type IN ('office', 'home')),
  product_id UUID REFERENCES public.products(id),
  product_price NUMERIC NOT NULL,
  delivery_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_users table for admin authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for products
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Public read access for delivery settings
CREATE POLICY "Delivery settings are viewable by everyone" 
ON public.delivery_settings 
FOR SELECT 
USING (true);

-- Public can create orders
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated users can view/manage orders
CREATE POLICY "Authenticated users can view orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update orders" 
ON public.orders 
FOR UPDATE 
TO authenticated
USING (true);

-- Authenticated users can manage products
CREATE POLICY "Authenticated users can update products" 
ON public.products 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert products" 
ON public.products 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Authenticated users can manage delivery settings
CREATE POLICY "Authenticated users can update delivery settings" 
ON public.delivery_settings 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert delivery settings" 
ON public.delivery_settings 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Insert default product
INSERT INTO public.products (name, price, description, features, stock_count)
VALUES (
  'حفارة HONESTPRO 800 واط',
  9200,
  'حفارة احترافية بقوة 800 واط موديل YAE2259 - جودة عالية وأداء ممتاز',
  ARRAY['قوة 800 واط', 'موديل YAE2259', 'ضمان سنة كاملة', 'صناعة متينة', 'سهولة الاستخدام'],
  50
);

-- Insert default delivery settings
INSERT INTO public.delivery_settings (office_price, home_price)
VALUES (500, 700);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_delivery_settings_updated_at
BEFORE UPDATE ON public.delivery_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();