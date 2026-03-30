-- 1. Políticas para vi_leads
DROP POLICY IF EXISTS "Allow admins to delete leads" ON public.vi_leads;
CREATE POLICY "Allow admins to delete leads" ON public.vi_leads
    FOR DELETE
    USING (
      auth.email() IN ('assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com')
      OR
      (auth.jwt() ->> 'email') IN ('assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com')
    );

-- 2. Atualizar política de delete para customers (permitir acesso admin via anon/JWT)
DROP POLICY IF EXISTS "Global admin access to customers" ON public.customers;
CREATE POLICY "Global admin access to customers" ON public.customers 
FOR ALL TO public USING (
  (auth.jwt() ->> 'email') IN ('assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com')
  OR
  auth.email() IN ('assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com')
);

-- 3. Garantir SELECT público em vi_leads (o front filtra por admin)
DROP POLICY IF EXISTS "Allow admins to read leads" ON public.vi_leads;
CREATE POLICY "Allow admins to read leads" ON public.vi_leads
    FOR SELECT
    USING (true);
