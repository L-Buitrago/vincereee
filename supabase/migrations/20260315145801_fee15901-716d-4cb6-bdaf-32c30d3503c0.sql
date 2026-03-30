
-- =============================================
-- 1. CUSTOMERS: Replace public policies with org-scoped authenticated policies
-- =============================================
DROP POLICY IF EXISTS "Allow all delete" ON public.customers;
DROP POLICY IF EXISTS "Allow all insert" ON public.customers;
DROP POLICY IF EXISTS "Allow all read" ON public.customers;
DROP POLICY IF EXISTS "Allow all update" ON public.customers;

-- Admins can do everything
CREATE POLICY "Admins full access to customers"
  ON public.customers FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Org members can SELECT their own org's customers
CREATE POLICY "Org members can read own customers"
  ON public.customers FOR SELECT
  TO authenticated
  USING (
    org_id IN (SELECT om.org_id FROM public.org_members om WHERE om.user_id = auth.uid())
  );

-- Org members can INSERT customers into their own org
CREATE POLICY "Org members can insert own customers"
  ON public.customers FOR INSERT
  TO authenticated
  WITH CHECK (
    org_id IN (SELECT om.org_id FROM public.org_members om WHERE om.user_id = auth.uid())
  );

-- Org members can UPDATE their own org's customers
CREATE POLICY "Org members can update own customers"
  ON public.customers FOR UPDATE
  TO authenticated
  USING (
    org_id IN (SELECT om.org_id FROM public.org_members om WHERE om.user_id = auth.uid())
  );

-- Org members can DELETE their own org's customers
CREATE POLICY "Org members can delete own customers"
  ON public.customers FOR DELETE
  TO authenticated
  USING (
    org_id IN (SELECT om.org_id FROM public.org_members om WHERE om.user_id = auth.uid())
  );

-- =============================================
-- 2. ORGANIZATIONS: Restrict to authenticated org members/owners
-- =============================================
DROP POLICY IF EXISTS "Anyone can insert organizations" ON public.organizations;
DROP POLICY IF EXISTS "Anyone can read organizations" ON public.organizations;
DROP POLICY IF EXISTS "Anyone can update organizations" ON public.organizations;

-- Admins can do everything
CREATE POLICY "Admins full access to organizations"
  ON public.organizations FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Authenticated users can read their own org (via org_members)
CREATE POLICY "Members can read own organization"
  ON public.organizations FOR SELECT
  TO authenticated
  USING (
    id IN (SELECT om.org_id FROM public.org_members om WHERE om.user_id = auth.uid())
  );

-- Only the owner can update their organization
CREATE POLICY "Owner can update own organization"
  ON public.organizations FOR UPDATE
  TO authenticated
  USING (
    owner_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Authenticated users can create organizations (for signup flow)
CREATE POLICY "Authenticated users can create organizations"
  ON public.organizations FOR INSERT
  TO authenticated
  WITH CHECK (
    owner_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- =============================================
-- 3. PRODUCTS: Public read, admin-only write
-- =============================================
DROP POLICY IF EXISTS "Permitir inserção/edição total de produtos" ON public.products;
DROP POLICY IF EXISTS "Permitir leitura total de produtos" ON public.products;

-- Anyone can read products (public catalog)
CREATE POLICY "Public can read products"
  ON public.products FOR SELECT
  TO public
  USING (true);

-- Only admins can insert/update/delete products
CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
