-- ==============================================================================
-- VINCERE — CORREÇÕES DE ADMIN E NOTIFICAÇÕES
-- ==============================================================================
-- Cole este SQL no Supabase Dashboard → SQL Editor → Run
-- ==============================================================================

-- 1. CORRIGIR PERMISSÃO: Adicionar luisgu0703@gmail.com como admin no RLS
CREATE OR REPLACE FUNCTION public.is_vincere_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN LOWER(COALESCE(auth.jwt() ->> 'email', auth.email())) IN (
    'luisgu0703@gmail.com',
    'assasinghost910@gmail.com', 
    'nathanwar03@gmail.com', 
    'ryanfernandosilva12@gmail.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. CRIAR TABELA admin_users (usada pelo frontend para verificar admins)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Inserir os 4 admins (ignora se já existir)
INSERT INTO public.admin_users (email) VALUES
  ('luisgu0703@gmail.com'),
  ('assasinghost910@gmail.com'),
  ('nathanwar03@gmail.com'),
  ('ryanfernandosilva12@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Habilitar RLS e dar acesso
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin Total Access" ON public.admin_users;
CREATE POLICY "Admin Total Access" ON public.admin_users 
  FOR ALL TO authenticated 
  USING (is_vincere_admin()) 
  WITH CHECK (is_vincere_admin());

-- Permitir qualquer autenticado ler (para o hook verificar se é admin)
DROP POLICY IF EXISTS "Anyone can read admin_users" ON public.admin_users;
CREATE POLICY "Anyone can read admin_users" ON public.admin_users
  FOR SELECT TO authenticated
  USING (true);

-- 3. ATUALIZAR TRIGGER DE NOTIFICAÇÃO DE LEADS (incluir luisgu0703)
CREATE OR REPLACE FUNCTION notify_admins_new_vi_lead()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (user_email, title, body, type)
  SELECT 
    email, 
    'Novo Lead Capturado pela VI', 
    'Nome: ' || NEW.name || ' | E-mail: ' || NEW.email || ' | Empresa: ' || COALESCE(NEW.company, 'N/A'), 
    'lead'
  FROM (SELECT unnest(ARRAY[
    'luisgu0703@gmail.com', 
    'assasinghost910@gmail.com', 
    'nathanwar03@gmail.com', 
    'ryanfernandosilva12@gmail.com'
  ]) AS email) admins;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. ATUALIZAR TRIGGER DE NOTIFICAÇÃO DE ORÇAMENTOS (incluir luisgu0703)
CREATE OR REPLACE FUNCTION notify_admins_new_quote()
RETURNS TRIGGER AS $$
DECLARE
  client_name TEXT;
  client_email TEXT;
BEGIN
  SELECT COALESCE(full_name, 'Cliente') INTO client_name FROM public.profiles WHERE user_id = NEW.user_id LIMIT 1;
  SELECT email INTO client_email FROM auth.users WHERE id = NEW.user_id LIMIT 1;
  IF client_email IS NULL THEN client_email := 'Email não disponível'; END IF;

  INSERT INTO public.notifications (user_email, title, body, type)
  SELECT 
    admin_email,
    'Novo Projeto Personalizado Recebido! 🚀',
    'Nova solicitação de: ' || client_name || ' (' || client_email || '). Serviço: ' || NEW.service_type || '.',
    'quote'
  FROM (SELECT unnest(ARRAY[
    'luisgu0703@gmail.com', 
    'assasinghost910@gmail.com', 
    'nathanwar03@gmail.com', 
    'ryanfernandosilva12@gmail.com'
  ]) AS admin_email) admins;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- PRONTO! ✅ Agora seu email tem permissão total no banco de dados.
-- ==============================================================================
