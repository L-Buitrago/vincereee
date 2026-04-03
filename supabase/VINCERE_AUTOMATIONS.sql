-- ==============================================================================
-- VINCERE CRM AUTOMATIONS
-- ==============================================================================
-- Este script automatiza o status dos clientes com base em pagamentos e datas.
-- ==============================================================================

-- 1. Automação de Pagamento: Marcar como "Ativo" ao receber transação aprovada
CREATE OR REPLACE FUNCTION public.handle_successful_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. Atualizar o status do cliente para 'Cliente Ativo'
  -- 2. Incrementar o total_spent do cliente
  UPDATE public.customers
  SET 
    status = 'Cliente Ativo',
    total_spent = total_spent + NEW.amount,
    last_order_date = NEW.date
  WHERE email = (
    -- Tenta achar por e-mail na tabela de clientes
    SELECT email FROM public.customers WHERE email = NEW.client_name OR name = NEW.client_name LIMIT 1
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_transaction_approved ON public.transactions;
CREATE TRIGGER on_transaction_approved
    AFTER INSERT ON public.transactions
    FOR EACH ROW
    WHEN (NEW.status = 'aprovado')
    EXECUTE FUNCTION public.handle_successful_payment();

-- 2. Automação de Vencimento: Função para marcar como 'Pendente' se atrasar
-- Nota: Como o Supabase não tem cron ativo por padrão em todas as instâncias,
-- criaremos uma VIEW que calcula o status em tempo real para o Dashboard.

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

-- 3. Função para "Forçar" atualização de vencidos (pode ser chamada pelo Frontend)
CREATE OR REPLACE FUNCTION public.check_overdue_payments()
RETURNS void AS $$
BEGIN
  UPDATE public.customers
  SET status = 'Pendente'
  WHERE status = 'Cliente Ativo' 
    AND due_date < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Ajustar RLS para as automações
ALTER VIEW public.customer_intelligence_view OWNER TO postgres;
GRANT SELECT ON public.customer_intelligence_view TO authenticated;
GRANT SELECT ON public.customer_intelligence_view TO anon;

-- Política para permitir que o sistema veja a View
DROP POLICY IF EXISTS "Admins total access to view" ON public.customers;
-- (As políticas da tabela base já protegem a View)
