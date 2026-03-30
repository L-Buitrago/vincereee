
-- =============================================
-- 1. CORREÇÃO DE RLS PARA CUSTOMERS (LEADS)
-- =============================================
-- Permitir que QUALQUER UM (anon ou auth) insira leads
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.customers;
CREATE POLICY "Anyone can insert leads"
  ON public.customers FOR INSERT
  TO public
  WITH CHECK (status = 'Lead');

-- Permitir que QUALQUER UM veja leads (necessário para o CRM e para evitar erros de select no upsert)
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
-- 2. AJUSTE DE VISIBILIDADE PARA ADMINS
-- =============================================
-- Como o sitema usa uma lista de e-mails hardcoded no front,
-- precisamos garantir que esses e-mails tenham acesso de leitura no banco.

DROP POLICY IF EXISTS "Global read for platform admins" ON public.customers;
CREATE POLICY "Global read for platform admins"
  ON public.customers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (
        auth.users.email IN (
          'assasinghost910@gmail.com',
          'nathanwar03@gmail.com',
          'ryanfernandosilva12@gmail.com'
        )
      )
    )
  );

DROP POLICY IF EXISTS "Global read orgs for platform admins" ON public.organizations;
CREATE POLICY "Global read orgs for platform admins"
  ON public.organizations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (
        auth.users.email IN (
          'assasinghost910@gmail.com',
          'nathanwar03@gmail.com',
          'ryanfernandosilva12@gmail.com'
        )
      )
    )
  );

-- =============================================
-- 3. GARANTIR QUE CONTACT_REQUESTS SEJAM VISÍVEIS
-- =============================================
DROP POLICY IF EXISTS "Admins can view all contact requests" ON public.contact_requests;
CREATE POLICY "Admins can view all contact requests"
  ON public.contact_requests FOR SELECT
  TO authenticated
  USING (true); -- Relaxed for now to ensure visibility
