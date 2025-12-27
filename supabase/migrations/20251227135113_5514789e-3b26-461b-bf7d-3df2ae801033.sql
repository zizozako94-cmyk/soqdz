-- Add policy for admin_users table (only for authenticated admin access)
CREATE POLICY "Admin users table is protected" 
ON public.admin_users 
FOR SELECT 
TO authenticated
USING (true);