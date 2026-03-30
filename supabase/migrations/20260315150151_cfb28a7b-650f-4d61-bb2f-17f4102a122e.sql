
-- Fix org_members: remove public INSERT/UPDATE, add proper policies
DROP POLICY IF EXISTS "Anyone can insert org_members" ON public.org_members;
DROP POLICY IF EXISTS "Anyone can update org_members" ON public.org_members;
DROP POLICY IF EXISTS "Anyone can read org_members" ON public.org_members;

-- Admins full access
CREATE POLICY "Admins full access to org_members"
  ON public.org_members FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Users can read their own membership
CREATE POLICY "Users can read own membership"
  ON public.org_members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can only insert themselves
CREATE POLICY "Users can insert own membership"
  ON public.org_members FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Fix customer_notes: replace public policies with org-scoped
DROP POLICY IF EXISTS "Enable delete for all users" ON public.customer_notes;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.customer_notes;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.customer_notes;
DROP POLICY IF EXISTS "Enable update for all users" ON public.customer_notes;

-- Admins full access
CREATE POLICY "Admins full access to customer_notes"
  ON public.customer_notes FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Org members can manage notes in their org
CREATE POLICY "Org members can read own notes"
  ON public.customer_notes FOR SELECT
  TO authenticated
  USING (org_id IN (SELECT om.org_id FROM public.org_members om WHERE om.user_id = auth.uid()));

CREATE POLICY "Org members can insert own notes"
  ON public.customer_notes FOR INSERT
  TO authenticated
  WITH CHECK (org_id IN (SELECT om.org_id FROM public.org_members om WHERE om.user_id = auth.uid()));

CREATE POLICY "Org members can update own notes"
  ON public.customer_notes FOR UPDATE
  TO authenticated
  USING (org_id IN (SELECT om.org_id FROM public.org_members om WHERE om.user_id = auth.uid()));

CREATE POLICY "Org members can delete own notes"
  ON public.customer_notes FOR DELETE
  TO authenticated
  USING (org_id IN (SELECT om.org_id FROM public.org_members om WHERE om.user_id = auth.uid()));
