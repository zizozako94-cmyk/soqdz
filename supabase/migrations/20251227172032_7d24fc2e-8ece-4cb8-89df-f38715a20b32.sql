-- Add whatsapp_number column to delivery_settings table
ALTER TABLE public.delivery_settings 
ADD COLUMN IF NOT EXISTS whatsapp_number text DEFAULT '+213555123456';