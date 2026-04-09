-- ==============================================================================
-- VINCERE MASTER DATABASE RESET (CLEAN SLATE)
-- ==============================================================================
-- Este script RECOMENÇA o banco de dados do zero, eliminando todos os conflitos.
-- Execute no SQL Editor do Supabase Dashboard.
-- ==============================================================================

-- 0. Limpeza Geral (CUIDADO: APAGA TODOS OS DADOS DAS TABELAS ABAIXO)
DROP TABLE IF EXISTS public.support_messages CASCADE;
DROP TABLE IF EXISTS public.support_conversations CASCADE;
DROP TABLE IF EXISTS public.direct_messages CASCADE;
DROP TABLE IF EXISTS public.direct_conversations CASCADE;
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.customer_notes CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.recoveries CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.checkouts CASCADE;
DROP TABLE IF EXISTS public.contact_requests CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.vi_leads CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.quotes CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.org_members CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;

-- 1. Tipos e Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 2. Perfis (Profiles) - Sincronizado com Auth
CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 3. Organizações (Organizations)
CREATE TABLE public.organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  plan TEXT DEFAULT 'free',
  status TEXT DEFAULT 'active',
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 4. Membros da Organização (Org Members)
CREATE TABLE public.org_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (org_id, user_id)
);

-- 5. CRM: Clientes (Customers)
CREATE TABLE public.customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'Lead',
  total_spent DECIMAL(12,2) DEFAULT 0,
  due_date TIMESTAMP WITH TIME ZONE,
  last_order_date TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (email, org_id)
);

-- 6. CRM: Leads VI (Leads Automáticos)
CREATE TABLE public.vi_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  needs TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 7. Produtos (Products)
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(12,2),
  type TEXT,
  image TEXT,
  total_sales INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 8. Financeiro: Transações (Transactions)
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  product TEXT,
  amount DECIMAL(12,2),
  status TEXT,
  gateway TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 9. Checkout & KPIs
CREATE TABLE public.checkouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  product TEXT,
  status TEXT,
  amount DECIMAL(12,2),
  conversion DECIMAL(5,2),
  total_sales INTEGER DEFAULT 0,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 10. Recuperação de Carrinhos (Recoveries)
CREATE TABLE public.recoveries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  customer_name TEXT,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  amount DECIMAL(12,2),
  status TEXT DEFAULT 'pending',
  last_ai_message TEXT,
  checkout_id UUID UNIQUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 11. Notificações
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 12. Mensagens Diretas (Chat Interno)
CREATE TABLE public.direct_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE public.direct_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.direct_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 13. Contact Requests (Chatbot Vi Lead Capture)
CREATE TABLE public.contact_requests (
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

-- 14. Orçamentos (Quotes)
CREATE TABLE public.quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 15. Projetos (Projects)
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quote_id UUID REFERENCES public.quotes(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'PENDENTE' NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 16. User Roles (Papéis dos Usuários)
CREATE TABLE public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL
);

-- 17. Chat Messages (Histórico de Chat com IA)
CREATE TABLE public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 18. Notas do Cliente (Customer Notes)
CREATE TABLE public.customer_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 19. Suporte: Conversas
CREATE TABLE public.support_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  org_name TEXT NOT NULL,
  status TEXT DEFAULT 'open' NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 20. Suporte: Mensagens
CREATE TABLE public.support_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.support_conversations(id) ON DELETE CASCADE,
  sender_id UUID,
  sender_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 21. Clientes Legado (tabela 'clients' usada em types.ts)
CREATE TABLE public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar TEXT,
  product TEXT,
  amount DECIMAL(12,2),
  status TEXT,
  purchase_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==============================================================================
-- SEGURANÇA (RLS) - UNIFICADA E ROBUSTA
-- ==============================================================================

-- Função Auxiliar para Checar Admin pelo E-mail
CREATE OR REPLACE FUNCTION public.is_vincere_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN LOWER(COALESCE(auth.jwt() ->> 'email', auth.email())) IN (
    'assasinghost910@gmail.com', 
    'nathanwar03@gmail.com', 
    'ryanfernandosilva12@gmail.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ativar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vi_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recoveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- POLÍTICAS UNIVERSAIS (ADMINS) - ACESSO TOTAL
-- ------------------------------------------------------------------------------
DO $$ 
DECLARE 
  t text;
BEGIN
  FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Admin Total Access" ON public.%I', t);
    EXECUTE format('CREATE POLICY "Admin Total Access" ON public.%I FOR ALL TO authenticated USING (is_vincere_admin()) WITH CHECK (is_vincere_admin())', t);
  END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- POLÍTICAS ESPECÍFICAS (USUÁRIOS COMUNS)
-- ------------------------------------------------------------------------------

-- Profiles: Cada um cuida do seu
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Customers/Transactions/Checkouts (Isolamento por Org)
CREATE POLICY "Org isolation select" ON public.customers FOR SELECT USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));
CREATE POLICY "Org isolation insert" ON public.customers FOR INSERT WITH CHECK (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));
CREATE POLICY "Org isolation update" ON public.customers FOR UPDATE USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));
CREATE POLICY "Org isolation delete" ON public.customers FOR DELETE USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));
CREATE POLICY "Org isolation select transactions" ON public.transactions FOR SELECT USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));
CREATE POLICY "Org isolation select checkouts" ON public.checkouts FOR SELECT USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));

-- VI Leads: Público pode inserir (Lead Capture) — anon e authenticated
CREATE POLICY "Allow public lead capture" ON public.vi_leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated lead capture" ON public.vi_leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow admin lead management" ON public.vi_leads FOR ALL USING (is_vincere_admin());

-- Contact Requests: Público pode inserir, admins podem ver tudo
CREATE POLICY "Allow public contact insert" ON public.contact_requests FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated contact insert" ON public.contact_requests FOR INSERT TO authenticated WITH CHECK (true);

-- Notifications: Cada um vê as suas
CREATE POLICY "Users own notifications" ON public.notifications FOR ALL USING (user_email = COALESCE(auth.jwt() ->> 'email', auth.email()));

-- Direct Messages: Participantes da conversa
CREATE POLICY "Conversation participants" ON public.direct_conversations FOR ALL USING (
  auth.uid() = user1_id OR auth.uid() = user2_id
);
CREATE POLICY "Message participants" ON public.direct_messages FOR ALL USING (
  conversation_id IN (SELECT id FROM public.direct_conversations WHERE user1_id = auth.uid() OR user2_id = auth.uid())
);

-- Projects & Quotes: Usuário vê os seus
CREATE POLICY "Users own projects" ON public.projects FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users own quotes" ON public.quotes FOR ALL USING (user_id = auth.uid());

-- Customer Notes: Isolamento por Org
CREATE POLICY "Org isolation notes" ON public.customer_notes FOR ALL USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));

-- Support: Org members podem ver suas conversas
CREATE POLICY "Org support conversations" ON public.support_conversations FOR ALL USING (
  org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid())
);
CREATE POLICY "Org support messages" ON public.support_messages FOR ALL USING (
  conversation_id IN (
    SELECT id FROM public.support_conversations 
    WHERE org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid())
  )
);

-- ==============================================================================
-- GATILHOS (TRIGGERS)
-- ==============================================================================

-- Sincronizar Perfis Automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Notificar Admins sobre novos Leads
CREATE OR REPLACE FUNCTION notify_admins_new_vi_lead()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (user_email, title, body, type)
  SELECT 
    email, 
    'Novo Lead Capturado pela VI', 
    'Nome: ' || NEW.name || ' | E-mail: ' || NEW.email || ' | Empresa: ' || COALESCE(NEW.company, 'N/A'), 
    'lead'
  FROM (SELECT unnest(ARRAY['assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com']) AS email) admins;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_vi_lead_created ON public.vi_leads;
CREATE TRIGGER on_vi_lead_created
    AFTER INSERT ON public.vi_leads
    FOR EACH ROW EXECUTE FUNCTION notify_admins_new_vi_lead();

-- Notificar Admins sobre novos Orçamentos (Quotes)
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
  FROM (SELECT unnest(ARRAY['assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com']) AS admin_email) admins;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_quote_created ON public.quotes;
CREATE TRIGGER on_quote_created
    AFTER INSERT ON public.quotes
    FOR EACH ROW EXECUTE FUNCTION notify_admins_new_quote();

-- ==============================================================================
-- FUNÇÃO has_role (usada pelo frontend)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.has_role(_role public.app_role, _user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- FIM DO SCRIPT
-- ==============================================================================
