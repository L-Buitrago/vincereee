-- ==============================================================================
-- 1. FIX CRITICAL SECURITY DEFINER VIEW: customer_intelligence_view
-- Adding WITH (security_invoker = true) ensures the view respects caller RLS
-- ==============================================================================
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

GRANT SELECT ON public.customer_intelligence_view TO authenticated, anon;


-- ==============================================================================
-- 2. FIX AUTH RLS PERFORMANCE PLAN: Wrap auth.uid() & auth.jwt() with (SELECT ...)
-- ==============================================================================

-- PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);


-- CUSTOMERS
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

CREATE POLICY "Anyone can insert leads" ON public.customers
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins and org members can view customers" ON public.customers
  FOR SELECT
  USING (
    status = 'Lead'
    OR org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
    OR LOWER(COALESCE((SELECT auth.jwt()) ->> 'email', (SELECT auth.email()))) IN (
      'luisgu0703@gmail.com', 'assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com'
    )
  );

CREATE POLICY "Admins and org members can update customers" ON public.customers
  FOR UPDATE
  USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
    OR LOWER(COALESCE((SELECT auth.jwt()) ->> 'email', (SELECT auth.email()))) IN (
      'luisgu0703@gmail.com', 'assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com'
    )
  );

CREATE POLICY "Admins and org members can delete customers" ON public.customers
  FOR DELETE
  USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
    OR LOWER(COALESCE((SELECT auth.jwt()) ->> 'email', (SELECT auth.email()))) IN (
      'luisgu0703@gmail.com', 'assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com'
    )
  );


-- TRANSACTIONS
DROP POLICY IF EXISTS "Org members can view transactions" ON public.transactions;
DROP POLICY IF EXISTS "Org members can insert transactions" ON public.transactions;
DROP POLICY IF EXISTS "Org members can update transactions" ON public.transactions;
DROP POLICY IF EXISTS "Org members can delete transactions" ON public.transactions;

CREATE POLICY "Org members can view transactions" ON public.transactions
  FOR SELECT
  USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
    OR LOWER(COALESCE((SELECT auth.jwt()) ->> 'email', (SELECT auth.email()))) IN (
      'luisgu0703@gmail.com', 'assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com'
    )
  );

CREATE POLICY "Org members can insert transactions" ON public.transactions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Org members can update transactions" ON public.transactions
  FOR UPDATE
  USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
    OR LOWER(COALESCE((SELECT auth.jwt()) ->> 'email', (SELECT auth.email()))) IN (
      'luisgu0703@gmail.com', 'assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com'
    )
  );

CREATE POLICY "Org members can delete transactions" ON public.transactions
  FOR DELETE
  USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
    OR LOWER(COALESCE((SELECT auth.jwt()) ->> 'email', (SELECT auth.email()))) IN (
      'luisgu0703@gmail.com', 'assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com'
    )
  );


-- CHECKOUTS
DROP POLICY IF EXISTS "Org members can view checkouts" ON public.checkouts;
DROP POLICY IF EXISTS "Org members can manage checkouts" ON public.checkouts;
DROP POLICY IF EXISTS "Anyone can view checkouts" ON public.checkouts;

CREATE POLICY "Anyone can view checkouts" ON public.checkouts
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Org members can manage checkouts" ON public.checkouts
  FOR ALL
  USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
    OR LOWER(COALESCE((SELECT auth.jwt()) ->> 'email', (SELECT auth.email()))) IN (
      'luisgu0703@gmail.com', 'assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com'
    )
  );


-- NOTIFICATIONS
DROP POLICY IF EXISTS "Admins can view their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow anyone to insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can update their notifications" ON public.notifications;

CREATE POLICY "Allow anyone to insert notifications" ON public.notifications
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view their notifications" ON public.notifications
  FOR SELECT
  USING (
    LOWER(COALESCE((SELECT auth.jwt()) ->> 'email', (SELECT auth.email()))) = LOWER(user_email)
    OR
    LOWER(COALESCE((SELECT auth.jwt()) ->> 'email', (SELECT auth.email()))) IN (
      'luisgu0703@gmail.com', 'assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com'
    )
  );

CREATE POLICY "Admins can update their notifications" ON public.notifications
  FOR UPDATE
  USING (
    LOWER(COALESCE((SELECT auth.jwt()) ->> 'email', (SELECT auth.email()))) = LOWER(user_email)
    OR
    LOWER(COALESCE((SELECT auth.jwt()) ->> 'email', (SELECT auth.email()))) IN (
      'luisgu0703@gmail.com', 'assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com'
    )
  );


-- DIRECT CONVERSATIONS & DIRECT MESSAGES
DROP POLICY IF EXISTS "Users can view own conversations" ON public.direct_conversations;
DROP POLICY IF EXISTS "Users can insert conversations" ON public.direct_conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON public.direct_conversations;

CREATE POLICY "Users can view own conversations" ON public.direct_conversations
  FOR SELECT USING ((SELECT auth.uid()) = user1_id OR (SELECT auth.uid()) = user2_id);

CREATE POLICY "Users can insert conversations" ON public.direct_conversations
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user1_id OR (SELECT auth.uid()) = user2_id);

CREATE POLICY "Users can update own conversations" ON public.direct_conversations
  FOR UPDATE USING ((SELECT auth.uid()) = user1_id OR (SELECT auth.uid()) = user2_id);

DROP POLICY IF EXISTS "Users can view messages in own conversations" ON public.direct_messages;
DROP POLICY IF EXISTS "Users can insert messages in own conversations" ON public.direct_messages;
DROP POLICY IF EXISTS "Users can mark messages as read" ON public.direct_messages;

CREATE POLICY "Users can view messages in own conversations" ON public.direct_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.direct_conversations dc
      WHERE dc.id = conversation_id
      AND (dc.user1_id = (SELECT auth.uid()) OR dc.user2_id = (SELECT auth.uid()))
    )
  );

CREATE POLICY "Users can insert messages in own conversations" ON public.direct_messages
  FOR INSERT WITH CHECK (
    (SELECT auth.uid()) = sender_id
    AND EXISTS (
      SELECT 1 FROM public.direct_conversations dc
      WHERE dc.id = conversation_id
      AND (dc.user1_id = (SELECT auth.uid()) OR dc.user2_id = (SELECT auth.uid()))
    )
  );

CREATE POLICY "Users can mark messages as read" ON public.direct_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.direct_conversations dc
      WHERE dc.id = conversation_id
      AND (dc.user1_id = (SELECT auth.uid()) OR dc.user2_id = (SELECT auth.uid()))
    )
  );


-- PROJECTS
DROP POLICY IF EXISTS "Users can view projects" ON public.projects;
DROP POLICY IF EXISTS "Users can manage projects" ON public.projects;

CREATE POLICY "Users can view projects" ON public.projects
  FOR SELECT USING (
    (SELECT auth.uid()) = user_id
    OR LOWER(COALESCE((SELECT auth.jwt()) ->> 'email', (SELECT auth.email()))) IN (
      'luisgu0703@gmail.com', 'assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com'
    )
  );

CREATE POLICY "Users can manage projects" ON public.projects
  FOR ALL USING (
    (SELECT auth.uid()) = user_id
    OR LOWER(COALESCE((SELECT auth.jwt()) ->> 'email', (SELECT auth.email()))) IN (
      'luisgu0703@gmail.com', 'assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com'
    )
  );
