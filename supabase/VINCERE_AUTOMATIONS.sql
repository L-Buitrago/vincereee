-- ==============================================================================
-- VINCERE CRM AUTOMATIONS
-- ==============================================================================
-- Este script automatiza o status dos clientes com base em pagamentos e datas.
-- ==============================================================================

-- 1. Automação de Pagamento: Marcar como "Ativo" ao receber transação aprovada
-- CORRIGIDO: A query anterior tinha um bug circular (comparava email = client_name).
-- Agora faz match direto por nome OU email, com escopo de org_id.
CREATE OR REPLACE FUNCTION public.handle_successful_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar o cliente correspondente:
  --   1. Match por nome OU email (client_name pode ser qualquer um)
  --   2. Escopo pela org_id da transação para multi-tenancy
  --   3. Incrementa total_spent e atualiza last_order_date
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_transaction_approved ON public.transactions;
CREATE TRIGGER on_transaction_approved
    AFTER INSERT ON public.transactions
    FOR EACH ROW
    WHEN (NEW.status = 'aprovado')
    EXECUTE FUNCTION public.handle_successful_payment();

-- 2. Automação de Vencimento: VIEW que calcula o status em tempo real
CREATE OR REPLACE VIEW public.customer_intelligence_view AS
SELECT 
  *,
  CASE 
    WHEN status = 'Cliente Ativo' AND due_date < NOW() THEN 'Pendente'
    WHEN status = 'Pendente' AND due_date > NOW() THEN 'Cliente Ativo'
    ELSE status
  END AS smart_status,
  (due_date < NOW() AND status = 'Cliente Ativo') AS is_overdue
FROM public.customers;

-- 3. Função para atualizar vencidos (chamada pelo Frontend ou pg_cron)
CREATE OR REPLACE FUNCTION public.check_overdue_payments()
RETURNS void AS $$
BEGIN
  -- Marca como Pendente quem venceu
  UPDATE public.customers
  SET status = 'Pendente', updated_at = NOW()
  WHERE status = 'Cliente Ativo' 
    AND due_date IS NOT NULL
    AND due_date < NOW();

  -- Reativa quem regularizou (due_date foi atualizada para o futuro)
  UPDATE public.customers
  SET status = 'Cliente Ativo', updated_at = NOW()
  WHERE status = 'Pendente'
    AND due_date IS NOT NULL
    AND due_date > NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. CRON: Verificar vencimentos automaticamente a cada hora
-- IMPORTANTE: Execute este bloco APENAS se pg_cron estiver habilitado no Supabase.
-- Para habilitar: Supabase Dashboard → Database → Extensions → pg_cron → Enable
-- Se pg_cron não estiver disponível, a função é chamada via frontend como fallback.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.unschedule('check-overdue-payments');
    PERFORM cron.schedule(
      'check-overdue-payments',
      '0 * * * *',  -- A cada hora
      'SELECT public.check_overdue_payments()'
    );
    RAISE NOTICE 'pg_cron: check_overdue_payments agendado a cada hora.';
  ELSE
    RAISE NOTICE 'pg_cron não habilitado. Use o fallback via frontend.';
  END IF;
END $$;

-- 5. Ajustar RLS para as automações
ALTER VIEW public.customer_intelligence_view OWNER TO postgres;
GRANT SELECT ON public.customer_intelligence_view TO authenticated;
GRANT SELECT ON public.customer_intelligence_view TO anon;

-- Política para permitir que o sistema veja a View
DROP POLICY IF EXISTS "Admins total access to view" ON public.customers;
-- (As políticas da tabela base já protegem a View)
