-- ============================================
-- SECURITY HARDENING MIGRATION
-- ============================================

-- 1. Add Server-Side Validation for Orders via CHECK Constraints
-- This ensures validation at database level, preventing API bypass attacks

-- Validate customer name length (3-100 characters)
ALTER TABLE public.orders 
ADD CONSTRAINT orders_customer_name_length 
  CHECK (length(customer_name) BETWEEN 3 AND 100);

-- Validate phone format (Algerian mobile: starts with 05, 06, or 07, followed by 8 digits)
ALTER TABLE public.orders 
ADD CONSTRAINT orders_phone_format 
  CHECK (phone ~ '^0[567][0-9]{8}$');

-- Validate wilaya not empty
ALTER TABLE public.orders 
ADD CONSTRAINT orders_wilaya_not_empty 
  CHECK (length(trim(wilaya)) > 0);

-- Validate commune not empty
ALTER TABLE public.orders 
ADD CONSTRAINT orders_commune_not_empty 
  CHECK (length(trim(commune)) > 0);

-- Validate delivery type is valid enum
ALTER TABLE public.orders 
ADD CONSTRAINT orders_delivery_type_valid 
  CHECK (delivery_type IN ('office', 'home'));

-- Validate status is valid enum
ALTER TABLE public.orders 
ADD CONSTRAINT orders_status_valid 
  CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'));

-- Validate prices are positive
ALTER TABLE public.orders 
ADD CONSTRAINT orders_prices_positive 
  CHECK (product_price >= 0 AND delivery_price >= 0 AND total_price >= 0);

-- 2. Restrict Admin Account Modifications to Admin Role Only
-- Add policies for INSERT, UPDATE, and DELETE on admin_users table

CREATE POLICY "Only admins can insert admin users"
ON public.admin_users
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update admin users"
ON public.admin_users
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete admin users"
ON public.admin_users
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 3. Restrict Delivery Settings Delete to Admin Only
CREATE POLICY "Only admins can delete delivery settings"
ON public.delivery_settings
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 4. Restrict Products Delete to Admin Only
CREATE POLICY "Only admins can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 5. Restrict Orders Delete to Admin Only
CREATE POLICY "Only admins can delete orders"
ON public.orders
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));