
-- =============================================
-- FIX: checkouts table - remove public access
-- =============================================
DROP POLICY IF EXISTS "Permitir inserção/edição total de checkouts" ON public.checkouts;
DROP POLICY IF EXISTS "Permitir leitura total de checkouts" ON public.checkouts;

CREATE POLICY "Admins full access to checkouts"
  ON public.checkouts FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated can read checkouts"
  ON public.checkouts FOR SELECT
  TO authenticated
  USING (true);

-- =============================================
-- FIX: clients table - remove public access
-- =============================================
DROP POLICY IF EXISTS "Permitir inserção/edição total de clientes" ON public.clients;
DROP POLICY IF EXISTS "Permitir leitura total de clientes" ON public.clients;

CREATE POLICY "Admins full access to clients"
  ON public.clients FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated can read clients"
  ON public.clients FOR SELECT
  TO authenticated
  USING (true);

-- =============================================
-- FIX: transactions table - remove public access
-- =============================================
DROP POLICY IF EXISTS "Permitir inserção/edição total de transacoes" ON public.transactions;
DROP POLICY IF EXISTS "Permitir leitura total de transacoes" ON public.transactions;

CREATE POLICY "Admins full access to transactions"
  ON public.transactions FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated can read transactions"
  ON public.transactions FOR SELECT
  TO authenticated
  USING (true);

-- =============================================
-- FIX: notifications table - remove public access
-- =============================================
DROP POLICY IF EXISTS "Allow all read" ON public.notifications;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.notifications;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.notifications;

CREATE POLICY "Users can read own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text);

CREATE POLICY "Admins can insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text);

-- Also allow the trigger function to insert (it runs as SECURITY DEFINER so this is fine)
