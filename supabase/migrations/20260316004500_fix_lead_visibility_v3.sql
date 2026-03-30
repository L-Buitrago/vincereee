
-- =============================================
-- 1. CORREÇÃO DEFINITIVA DE RLS PARA CUSTOMERS (LEADS)
-- =============================================
-- Permitir que QUALQUER UM (anon ou auth) insira leads
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.customers;
CREATE POLICY "Anyone can insert leads"
  ON public.customers FOR INSERT
  TO public
  WITH CHECK (status = 'Lead');

-- Permitir que QUALQUER UM veja leads (necessário para o upsert checar duplicatas)
DROP POLICY IF EXISTS "Anyone can view leads" ON public.customers;
CREATE POLICY "Anyone can view leads"
  ON public.customers FOR SELECT
  TO public
  USING (status = 'Lead');

-- Permitir que QUALQUER UM atualize leads (upsert pelo email)
DROP POLICY IF EXISTS "Anyone can update existing leads" ON public.customers;
CREATE POLICY "Anyone can update existing leads"
  ON public.customers FOR UPDATE
  TO public
  USING (status = 'Lead')
  WITH CHECK (status = 'Lead');

-- =============================================
-- 2. AJUSTE DE VISIBILIDADE PARA ADMINS (USANDO JWT EMAIL)
-- =============================================
-- O uso de SELECT FROM auth.users em RLS é desencorajado e muitas vezes bloqueado.
-- A forma correta é usar auth.jwt().

DROP POLICY IF EXISTS "Global read for platform admins" ON public.customers;
CREATE POLICY "Global read for platform admins"
  ON public.customers FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'email') IN (
      'assasinghost910@gmail.com',
      'nathanwar03@gmail.com',
      'ryanfernandosilva12@gmail.com'
    )
  );

DROP POLICY IF EXISTS "Global read orgs for platform admins" ON public.organizations;
CREATE POLICY "Global read orgs for platform admins"
  ON public.organizations FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'email') IN (
      'assasinghost910@gmail.com',
      'nathanwar03@gmail.com',
      'ryanfernandosilva12@gmail.com'
    )
  );

-- =============================================
-- 3. GARANTIR QUE CONTACT_REQUESTS SEJAM VISÍVEIS
-- =============================================
DROP POLICY IF EXISTS "Global read contact_requests for admins" ON public.contact_requests;
CREATE POLICY "Global read contact_requests for admins"
  ON public.contact_requests FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'email') IN (
      'assasinghost910@gmail.com',
      'nathanwar03@gmail.com',
      'ryanfernandosilva12@gmail.com'
    )
  );

DROP POLICY IF EXISTS "Anyone can insert contact requests" ON public.contact_requests;
CREATE POLICY "Anyone can insert contact requests"
  ON public.contact_requests FOR INSERT
  TO public
  WITH CHECK (true);
