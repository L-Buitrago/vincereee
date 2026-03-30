
-- 1. Fix contact_requests: replace permissive "true" SELECT with admin-only
DROP POLICY IF EXISTS "Admins can view all contact requests" ON public.contact_requests;
CREATE POLICY "Admins can view all contact requests"
  ON public.contact_requests FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Fix org_members: restrict self-join to only orgs where user is the owner
DROP POLICY IF EXISTS "Users can insert own membership" ON public.org_members;
CREATE POLICY "Users can insert own membership"
  ON public.org_members FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND org_id IN (
      SELECT id FROM public.organizations WHERE owner_email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )::text
    )
  );

-- 3. Fix customers: remove public read/update policies for leads
DROP POLICY IF EXISTS "Anyone can view leads" ON public.customers;
DROP POLICY IF EXISTS "Anyone can update existing leads" ON public.customers;

-- Keep insert-only for public lead capture (ChatWidget needs this)
-- Already exists: "Anyone can insert leads" with status='Lead' check
