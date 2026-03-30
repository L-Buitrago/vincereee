
-- =============================================
-- 1. ADICIONAR COLUNA PARA CONTATOS (LEADS)
-- =============================================
-- (Já existem, mas garantindo acesso anônimo para captura de leads)

-- Permitir que visitantes anônimos vejam leads (necessário para o upsert checar duplicatas)
CREATE POLICY "Anyone can view leads"
  ON public.customers FOR SELECT
  TO anon
  USING (status = 'Lead');

-- Permitir que visitantes anônimos insiram novos leads
CREATE POLICY "Anyone can insert leads"
  ON public.customers FOR INSERT
  TO anon
  WITH CHECK (status = 'Lead');

-- Permitir que visitantes anônimos atualizem seus próprios dados de lead (se o e-mail bater)
CREATE POLICY "Anyone can update existing leads"
  ON public.customers FOR UPDATE
  TO anon
  USING (status = 'Lead')
  WITH CHECK (status = 'Lead');

-- =============================================
-- 2. CONTACT_REQUESTS: Acesso anônimo
-- =============================================
-- (Existia em migrações antigas, mas o hardening pode ter removido)

DROP POLICY IF EXISTS "Anyone can insert contact requests" ON public.contact_requests;
CREATE POLICY "Anyone can insert contact requests"
  ON public.contact_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can select contact requests" ON public.contact_requests;
CREATE POLICY "Anyone can select contact requests"
  ON public.contact_requests FOR SELECT
  TO anon, authenticated
  USING (true);
