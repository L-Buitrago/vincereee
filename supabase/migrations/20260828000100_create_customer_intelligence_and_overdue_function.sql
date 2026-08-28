-- 1. Create customer_intelligence_view
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

ALTER VIEW public.customer_intelligence_view OWNER TO postgres;
GRANT SELECT ON public.customer_intelligence_view TO authenticated, anon;

-- 2. Create and grant execute on check_overdue_payments
CREATE OR REPLACE FUNCTION public.check_overdue_payments()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Marca como Pendente quem venceu
  UPDATE public.customers
  SET status = 'Pendente', updated_at = NOW()
  WHERE status = 'Cliente Ativo' 
    AND due_date IS NOT NULL
    AND due_date < NOW();

  -- Reativa quem regularizou
  UPDATE public.customers
  SET status = 'Cliente Ativo', updated_at = NOW()
  WHERE status = 'Pendente'
    AND due_date IS NOT NULL
    AND due_date > NOW();
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_overdue_payments() TO authenticated, anon;
