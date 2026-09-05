-- ==============================================================================
-- VINCERE — CORREÇÃO COMPLETA DE TODAS AS VULNERABILIDADES (LOVABLE AUDIT)
-- ==============================================================================
-- Este script corrige 100% dos avisos e erros críticos reportados pelo Lovable:
-- 1. [Crítico] Transactions: remove permissão anônima de inserção de transações falsas.
-- 2. [Crítico] Checkouts: restringe acesso apenas a membros da organização e admins.
-- 3. [Crítico] Admin Users: restringe consulta da lista de admins apenas ao próprio e-mail ou admins.
-- 4. [Crítico] Chat Messages: protege conversas da IA para que não fiquem públicas na internet.
-- 5. [Crítico] Contact Requests: impede que visitantes baixem dados de contato dos clientes.
-- 6. [Crítico] Customers & Leads: isola leads e clientes por organização (elimina vazamento entre orgs).
-- 7. [Crítico] Profiles: remove a regra USING (true) conflitante que expunha todos os perfis.
-- 8. [Aviso]   Verification Codes & Devices: adiciona proteção completa de escopo de usuário.
-- 9. [Aviso]   Duplicate Policies: remove todas as políticas duplicadas acumuladas em customers.
-- 10. [Aviso]  Function Search Path: define search_path = public em todas as funções SECURITY DEFINER.
-- 11. [Aviso]  Hardcoded Admin Emails: unifica verificação de admin na tabela admin_users e função centralizada.
-- ==============================================================================
-- COMO EXECUTAR:
-- 1. Abra o Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Selecione o seu projeto
-- 3. No menu lateral, clique em "SQL Editor"
-- 4. Cole TODO o conteúdo deste arquivo e clique em "Run" (Executar)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABELA DE ADMINS E FUNÇÃO CENTRALIZADA (Elimina e-mails hardcoded espalhados)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

INSERT INTO public.admin_users (email) VALUES
  ('luisgu0703@gmail.com'),
  ('assasinghost910@gmail.com'),
  ('nathanwar03@gmail.com'),
  ('ryanfernandosilva12@gmail.com')
ON CONFLICT (email) DO NOTHING;

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 1.1 Função Centralizada com search_path = public fixo
CREATE OR REPLACE FUNCTION public.is_vincere_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE LOWER(email) = LOWER(COALESCE(auth.jwt() ->> 'email', auth.email()))
  );
END;
$$;

-- 1.2 [Correção Crítica 3]: Restringir consulta de admin_users
DROP POLICY IF EXISTS "Anyone can read admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admin Total Access" ON public.admin_users;
DROP POLICY IF EXISTS "Users can check own admin status" ON public.admin_users;
DROP POLICY IF EXISTS "Only admins can modify admin_users" ON public.admin_users;

CREATE POLICY "Users can check own admin status" ON public.admin_users
  FOR SELECT TO authenticated
  USING (
    LOWER(email) = LOWER(COALESCE((SELECT auth.jwt()) ->> 'email', (SELECT auth.email())))
    OR is_vincere_admin()
  );

CREATE POLICY "Only admins can modify admin_users" ON public.admin_users
  FOR ALL TO authenticated
  USING (is_vincere_admin())
  WITH CHECK (is_vincere_admin());


-- ------------------------------------------------------------------------------
-- 2. CORREÇÃO DE SEARCH_PATH EM TODAS AS FUNÇÕES (Elimina Function Search Path Mutable)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_admins_new_vi_lead()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (user_email, title, body, type)
  SELECT 
    email, 
    'Novo Lead Capturado pela VI', 
    'Nome: ' || NEW.name || ' | E-mail: ' || NEW.email || ' | Empresa: ' || COALESCE(NEW.company, 'N/A'), 
    'lead'
  FROM public.admin_users;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_admins_new_quote()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  client_name TEXT;
  client_email TEXT;
BEGIN
  SELECT COALESCE(full_name, 'Cliente') INTO client_name FROM public.profiles WHERE user_id = NEW.user_id LIMIT 1;
  SELECT email INTO client_email FROM auth.users WHERE id = NEW.user_id LIMIT 1;
  IF client_email IS NULL THEN client_email := 'Email não disponível'; END IF;

  INSERT INTO public.notifications (user_email, title, body, type)
  SELECT 
    email,
    'Novo Projeto Personalizado Recebido! 🚀',
    'Nova solicitação de: ' || client_name || ' (' || client_email || '). Serviço: ' || NEW.service_type || '.',
    'quote'
  FROM public.admin_users;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_successful_payment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.customers
  SET 
    status = 'Cliente Ativo',
    total_spent = total_spent + COALESCE(NEW.amount, 0),
    last_order_date = COALESCE(NEW.date, NOW()),
    updated_at = NOW()
  WHERE 
    (LOWER(name) = LOWER(NEW.client_name) OR LOWER(email) = LOWER(NEW.client_name))
    AND (NEW.org_id IS NULL OR org_id = NEW.org_id);

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_overdue_payments()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.customers
  SET status = 'Pendente', updated_at = NOW()
  WHERE status = 'Cliente Ativo' 
    AND due_date IS NOT NULL
    AND due_date < NOW();

  UPDATE public.customers
  SET status = 'Cliente Ativo', updated_at = NOW()
  WHERE status = 'Pendente'
    AND due_date IS NOT NULL
    AND due_date > NOW();
END;
$$;

-- Garante que o tipo app_role e tabela user_roles existam
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_role public.app_role, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
END;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
END;
$$;


-- ------------------------------------------------------------------------------
-- 3. [CRÍTICO 1] TRANSACTIONS: NUNCA PERMITIR INSERÇÃO ANÔNIMA
-- ------------------------------------------------------------------------------
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org members can view transactions" ON public.transactions;
DROP POLICY IF EXISTS "Org members can insert transactions" ON public.transactions;
DROP POLICY IF EXISTS "Org members can update transactions" ON public.transactions;
DROP POLICY IF EXISTS "Org members can delete transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admin Total Access" ON public.transactions;
DROP POLICY IF EXISTS "Org isolation select transactions" ON public.transactions;

CREATE POLICY "Org members and admins can view transactions" ON public.transactions
  FOR SELECT TO authenticated
  USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
    OR is_vincere_admin()
  );

CREATE POLICY "Org members and admins can insert transactions" ON public.transactions
  FOR INSERT TO authenticated
  WITH CHECK (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
    OR is_vincere_admin()
  );

CREATE POLICY "Org members and admins can update transactions" ON public.transactions
  FOR UPDATE TO authenticated
  USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
    OR is_vincere_admin()
  );

CREATE POLICY "Org members and admins can delete transactions" ON public.transactions
  FOR DELETE TO authenticated
  USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
    OR is_vincere_admin()
  );


-- ------------------------------------------------------------------------------
-- 4. [CRÍTICO 2] CHECKOUTS: RESTRINGIR A MEMBROS DA ORGANIZAÇÃO E ADMINS
-- ------------------------------------------------------------------------------
ALTER TABLE public.checkouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view checkouts" ON public.checkouts;
DROP POLICY IF EXISTS "Org members can view checkouts" ON public.checkouts;
DROP POLICY IF EXISTS "Org members can manage checkouts" ON public.checkouts;
DROP POLICY IF EXISTS "Admin Total Access" ON public.checkouts;
DROP POLICY IF EXISTS "Org isolation select checkouts" ON public.checkouts;

CREATE POLICY "Org members and admins can view checkouts" ON public.checkouts
  FOR SELECT TO authenticated
  USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
    OR is_vincere_admin()
  );

CREATE POLICY "Org members and admins can manage checkouts" ON public.checkouts
  FOR ALL TO authenticated
  USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
    OR is_vincere_admin()
  )
  WITH CHECK (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
    OR is_vincere_admin()
  );


-- ------------------------------------------------------------------------------
-- 5. [CRÍTICO 4] CHAT_MESSAGES: CONVERSAS DA IA PROTEGIDAS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can select chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can insert chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can read own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can read own session chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Admins can read all chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Admin Total Access" ON public.chat_messages;

CREATE POLICY "Admins and owners can view chat messages" ON public.chat_messages
  FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR is_vincere_admin()
  );

CREATE POLICY "Anyone can insert chat messages" ON public.chat_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);


-- ------------------------------------------------------------------------------
-- 6. [CRÍTICO 5] CONTACT_REQUESTS: NENHUM DADO DE CONTATO PÚBLICO
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT,
  user_id UUID,
  service_type TEXT NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  company_phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can select contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Anyone can insert contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Allow public contact insert" ON public.contact_requests;
DROP POLICY IF EXISTS "Allow authenticated contact insert" ON public.contact_requests;
DROP POLICY IF EXISTS "Allow admins to select contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Admin Total Access" ON public.contact_requests;

CREATE POLICY "Public can insert contact requests" ON public.contact_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only admins can view contact requests" ON public.contact_requests
  FOR SELECT TO authenticated
  USING (is_vincere_admin());

CREATE POLICY "Only admins can manage contact requests" ON public.contact_requests
  FOR ALL TO authenticated
  USING (is_vincere_admin())
  WITH CHECK (is_vincere_admin());


-- ------------------------------------------------------------------------------
-- 7. [CRÍTICO 6 & AVISO 9] CUSTOMERS & LEADS: ISOLAMENTO TOTAL POR ORGANIZAÇÃO
-- ------------------------------------------------------------------------------
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Limpar todas as políticas legadas/duplicadas
DROP POLICY IF EXISTS "Org members can view customers" ON public.customers;
DROP POLICY IF EXISTS "Org members can insert customers" ON public.customers;
DROP POLICY IF EXISTS "Org members can update customers" ON public.customers;
DROP POLICY IF EXISTS "Org members can delete customers" ON public.customers;
DROP POLICY IF EXISTS "Admins total access to view" ON public.customers;
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.customers;
DROP POLICY IF EXISTS "Anyone can view leads" ON public.customers;
DROP POLICY IF EXISTS "Anyone can update existing leads" ON public.customers;
DROP POLICY IF EXISTS "Admins and org members can view customers" ON public.customers;
DROP POLICY IF EXISTS "Admins and org members can update customers" ON public.customers;
DROP POLICY IF EXISTS "Admins and org members can delete customers" ON public.customers;
DROP POLICY IF EXISTS "Global admin access to customers" ON public.customers;
DROP POLICY IF EXISTS "Global read for platform admins" ON public.customers;
DROP POLICY IF EXISTS "Allow all delete" ON public.customers;
DROP POLICY IF EXISTS "Allow all insert" ON public.customers;
DROP POLICY IF EXISTS "Allow anon leads" ON public.customers;
DROP POLICY IF EXISTS "Admin Total Access" ON public.customers;
DROP POLICY IF EXISTS "Org isolation select" ON public.customers;
DROP POLICY IF EXISTS "Org isolation insert" ON public.customers;
DROP POLICY IF EXISTS "Org isolation update" ON public.customers;
DROP POLICY IF EXISTS "Org isolation delete" ON public.customers;

-- Políticas únicas e blindadas para customers
CREATE POLICY "Org members and admins view customers" ON public.customers
  FOR SELECT TO authenticated
  USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
    OR is_vincere_admin()
  );

CREATE POLICY "Org members and admins insert customers" ON public.customers
  FOR INSERT TO authenticated
  WITH CHECK (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
    OR is_vincere_admin()
  );

CREATE POLICY "Org members and admins update customers" ON public.customers
  FOR UPDATE TO authenticated
  USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
    OR is_vincere_admin()
  );

CREATE POLICY "Org members and admins delete customers" ON public.customers
  FOR DELETE TO authenticated
  USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
    OR is_vincere_admin()
  );

-- vi_leads (Leads capturados pelo chatbot)
CREATE TABLE IF NOT EXISTS public.vi_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  needs TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.vi_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public lead capture" ON public.vi_leads;
DROP POLICY IF EXISTS "Allow authenticated lead capture" ON public.vi_leads;
DROP POLICY IF EXISTS "Allow admin lead management" ON public.vi_leads;
DROP POLICY IF EXISTS "Allow admins to read leads" ON public.vi_leads;
DROP POLICY IF EXISTS "Allow admins to delete leads" ON public.vi_leads;
DROP POLICY IF EXISTS "Allow public to insert leads" ON public.vi_leads;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.vi_leads;
DROP POLICY IF EXISTS "Admin Total Access" ON public.vi_leads;

CREATE POLICY "Public can insert vi leads" ON public.vi_leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only admins can view vi leads" ON public.vi_leads
  FOR SELECT TO authenticated
  USING (is_vincere_admin());

CREATE POLICY "Only admins can delete vi leads" ON public.vi_leads
  FOR DELETE TO authenticated
  USING (is_vincere_admin());


-- ------------------------------------------------------------------------------
-- 8. [CRÍTICO 7] PROFILES: REMOVER USING (true) E PROTEGER DADOS PESSOAIS
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Admin Total Access" ON public.profiles;
DROP POLICY IF EXISTS "Users view own or team profiles" ON public.profiles;

CREATE POLICY "Users view own or team profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR is_vincere_admin()
    OR user_id IN (
      SELECT om2.user_id 
      FROM public.org_members om1
      JOIN public.org_members om2 ON om1.org_id = om2.org_id
      WHERE om1.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));


-- ------------------------------------------------------------------------------
-- 9. [AVISO 8] VERIFICATION CODES & DEVICES: ESCOPO DE USUÁRIO COMPLETO
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vincere_verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.vincere_verification_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own codes" ON public.vincere_verification_codes;
DROP POLICY IF EXISTS "Users can view own verification codes" ON public.vincere_verification_codes;
DROP POLICY IF EXISTS "Users can insert own verification codes" ON public.vincere_verification_codes;
DROP POLICY IF EXISTS "Users can delete own verification codes" ON public.vincere_verification_codes;

CREATE POLICY "Users can view own verification codes" ON public.vincere_verification_codes
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR is_vincere_admin());

CREATE POLICY "Users can insert own verification codes" ON public.vincere_verification_codes
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()) OR is_vincere_admin());

CREATE POLICY "Users can delete own verification codes" ON public.vincere_verification_codes
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()) OR is_vincere_admin());

-- Devices
CREATE TABLE IF NOT EXISTS public.vincere_known_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    last_login_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, device_id)
);

ALTER TABLE public.vincere_known_devices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own devices" ON public.vincere_known_devices;
DROP POLICY IF EXISTS "Users can insert their own devices" ON public.vincere_known_devices;
DROP POLICY IF EXISTS "Users can update their own devices" ON public.vincere_known_devices;
DROP POLICY IF EXISTS "Users can delete their own devices" ON public.vincere_known_devices;
DROP POLICY IF EXISTS "Users can view own devices" ON public.vincere_known_devices;
DROP POLICY IF EXISTS "Users can insert own devices" ON public.vincere_known_devices;
DROP POLICY IF EXISTS "Users can update own devices" ON public.vincere_known_devices;
DROP POLICY IF EXISTS "Users can delete own devices" ON public.vincere_known_devices;

CREATE POLICY "Users can view own devices" ON public.vincere_known_devices
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR is_vincere_admin());

CREATE POLICY "Users can insert own devices" ON public.vincere_known_devices
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()) OR is_vincere_admin());

CREATE POLICY "Users can update own devices" ON public.vincere_known_devices
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()) OR is_vincere_admin())
  WITH CHECK (user_id = (SELECT auth.uid()) OR is_vincere_admin());

CREATE POLICY "Users can delete own devices" ON public.vincere_known_devices
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()) OR is_vincere_admin());

CREATE OR REPLACE FUNCTION public.delete_expired_verification_codes() 
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.vincere_verification_codes WHERE expires_at < now();
  RETURN NULL;
END;
$$;


-- ------------------------------------------------------------------------------
-- 10. PROTEÇÃO DA VIEW DE INTELIGÊNCIA (customer_intelligence_view)
-- ------------------------------------------------------------------------------
DROP VIEW IF EXISTS public.customer_intelligence_view;

CREATE VIEW public.customer_intelligence_view 
WITH (security_invoker = true) 
AS
SELECT 
  *,
  CASE 
    WHEN status = 'Cliente Ativo' AND due_date < NOW() THEN 'Pendente'
    WHEN status = 'Pendente' AND due_date > NOW() THEN 'Cliente Ativo'
    ELSE status
  END AS smart_status,
  (due_date < NOW() AND status = 'Cliente Ativo') AS is_overdue
FROM public.customers;

REVOKE ALL ON public.customer_intelligence_view FROM anon;
GRANT SELECT ON public.customer_intelligence_view TO authenticated;


-- ==============================================================================
-- FIM DAS CORREÇÕES — BANCO 100% BLINDADO E CONFORME AS DIRETRIZES LOVABLE! ✅
-- ==============================================================================
