-- Harden RLS policies for vi_leads to prevent public data exposure
-- This change ensures that only authorized admins can read lead data.

-- 1. Redefinir política de SELECT para vi_leads (restringir a admins)
DROP POLICY IF EXISTS "Allow admins to read leads" ON public.vi_leads;
CREATE POLICY "Allow admins to read leads" ON public.vi_leads
    FOR SELECT
    USING (
      LOWER(COALESCE(auth.jwt() ->> 'email', auth.email())) IN (
        'assasinghost910@gmail.com', 
        'nathanwar03@gmail.com', 
        'ryanfernandosilva12@gmail.com'
      )
    );

-- 2. Garantir que políticas de INSERT permitam novos leads (geralmente público para formulários de contato)
-- Se o formulário for público, precisamos de uma política de INSERT que permita anon
-- Verificando se já existe uma política de INSERT
-- (Baseado nas migrações anteriores, assumimos que leads podem ser criados anonimamente ou via trigger)
-- Caso precise garantir:
-- DROP POLICY IF EXISTS "Allow public to insert leads" ON public.vi_leads;
-- CREATE POLICY "Allow public to insert leads" ON public.vi_leads FOR INSERT WITH CHECK (true);
