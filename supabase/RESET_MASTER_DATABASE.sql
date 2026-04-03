-- ==============================================================================
-- VINCERE MASTER DATABASE RESET (CLEAN SLATE)
-- ==============================================================================
-- Este script RECOMENÇA o banco de dados do zero, eliminando todos os conflitos.
-- Execute no SQL Editor do Supabase Dashboard.
-- ==============================================================================

-- 0. Limpeza Geral (CUIDADO: APAGA TODOS OS DADOS DAS TABELAS ABAIXO)
DROP TABLE IF EXISTS public.direct_messages CASCADE;
DROP TABLE IF EXISTS public.direct_conversations CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.recoveries CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.checkouts CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.vi_leads CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.org_members CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
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
  checkout_id UUID,
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
CREATE POLICY "Org isolation select transactions" ON public.transactions FOR SELECT USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));
CREATE POLICY "Org isolation select checkouts" ON public.checkouts FOR SELECT USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));

-- VI Leads: Público pode inserir (Lead Capture)
CREATE POLICY "Allow public lead capture" ON public.vi_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin lead management" ON public.vi_leads FOR ALL USING (is_vincere_admin());

-- Notifications
CREATE POLICY "Users own notifications" ON public.notifications FOR ALL USING (user_email = COALESCE(auth.jwt() ->> 'email', auth.email()));

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
    'Nome: ' || NEW.name || ' | E-mail: ' || NEW.email, 
    'lead'
  FROM (SELECT unnest(ARRAY['assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com']) AS email) admins;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_vi_lead_created ON public.vi_leads;
CREATE TRIGGER on_vi_lead_created
    AFTER INSERT ON public.vi_leads
    FOR EACH ROW EXECUTE FUNCTION notify_admins_new_vi_lead();

-- ==============================================================================
-- FIM DO SCRIPT
-- ==============================================================================
