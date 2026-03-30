
-- =============================================
-- FIX DEFINITIVO: LEADS, DASHBOARD E LIXEIRA
-- =============================================

-- 1. PERMISSÕES PARA LEADS (CHAT VI)
-- Permite que qualquer um cadastre e veja leads (necessário para o chat)
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.customers;
CREATE POLICY "Anyone can insert leads" ON public.customers 
FOR INSERT TO public WITH CHECK (status = 'Lead');

DROP POLICY IF EXISTS "Anyone can view leads" ON public.customers;
CREATE POLICY "Anyone can view leads" ON public.customers 
FOR SELECT TO public USING (status = 'Lead');

DROP POLICY IF EXISTS "Anyone can update existing leads" ON public.customers;
CREATE POLICY "Anyone can update existing leads" ON public.customers 
FOR UPDATE TO public USING (status = 'Lead') WITH CHECK (status = 'Lead');

-- 2. ACESSO TOTAL PARA ADMINISTRADORES (DASHBOARD E LIXEIRA)
-- Libera SELECT, INSERT, UPDATE e DELETE para os e-mails de admin configurados no código.
-- Isso corrige a visualização no Dashboard e o botão de remover (lixeira).

DO $$ 
BEGIN
    -- Customers
    DROP POLICY IF EXISTS "Global admin access to customers" ON public.customers;
    CREATE POLICY "Global admin access to customers" ON public.customers 
    FOR ALL TO authenticated USING (
      (auth.jwt() ->> 'email') IN ('assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com')
    );

    -- Organizations
    DROP POLICY IF EXISTS "Global admin access to organizations" ON public.organizations;
    CREATE POLICY "Global admin access to organizations" ON public.organizations 
    FOR ALL TO authenticated USING (
      (auth.jwt() ->> 'email') IN ('assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com')
    );

    -- Contact Requests
    DROP POLICY IF EXISTS "Global admin access to contact_requests" ON public.contact_requests;
    CREATE POLICY "Global admin access to contact_requests" ON public.contact_requests 
    FOR ALL TO authenticated USING (
      (auth.jwt() ->> 'email') IN ('assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com')
    );

    -- Customer Notes
    DROP POLICY IF EXISTS "Global admin access to customer_notes" ON public.customer_notes;
    CREATE POLICY "Global admin access to customer_notes" ON public.customer_notes 
    FOR ALL TO authenticated USING (
      (auth.jwt() ->> 'email') IN ('assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com')
    );
END $$;

-- 3. PERMISSÕES PÚBLICAS PARA CONTACT_REQUESTS (CHAT VI)
DROP POLICY IF EXISTS "Anyone can insert contact requests" ON public.contact_requests;
CREATE POLICY "Anyone can insert contact requests" ON public.contact_requests 
FOR INSERT TO public WITH CHECK (true);
