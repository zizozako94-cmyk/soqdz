-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Admin users table is protected" ON public.admin_users;

-- Create a restrictive policy that only allows admins to view admin_users
CREATE POLICY "Only admins can view admin users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));