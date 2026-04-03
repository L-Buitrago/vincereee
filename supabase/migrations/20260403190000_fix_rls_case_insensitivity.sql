-- 1. Redefinir políticas para vi_leads com suporte a case-insensitive
DROP POLICY IF EXISTS "Allow admins to delete leads" ON public.vi_leads;
CREATE POLICY "Allow admins to delete leads" ON public.vi_leads
    FOR DELETE
    USING (
      LOWER(COALESCE(auth.jwt() ->> 'email', auth.email())) IN (
        'assasinghost910@gmail.com', 
        'nathanwar03@gmail.com', 
        'ryanfernandosilva12@gmail.com'
      )
    );

-- 2. Atualizar política de delete para customers (case-insensitive)
DROP POLICY IF EXISTS "Global admin access to customers" ON public.customers;
CREATE POLICY "Global admin access to customers" ON public.customers 
    FOR ALL TO public 
    USING (
      LOWER(COALESCE(auth.jwt() ->> 'email', auth.email())) IN (
        'assasinghost910@gmail.com', 
        'nathanwar03@gmail.com', 
        'ryanfernandosilva12@gmail.com'
      )
    );

-- 3. Garantir SELECT em vi_leads (o front já filtra, mas a política precisa existir)
DROP POLICY IF EXISTS "Allow admins to read leads" ON public.vi_leads;
CREATE POLICY "Allow admins to read leads" ON public.vi_leads
    FOR SELECT
    USING (true);
