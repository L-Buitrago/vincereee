
-- 1. Add org_id to existing tables for multi-tenancy
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS org_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.checkouts ADD COLUMN IF NOT EXISTS org_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE;

-- 2. Update recoveries table to ensure it has org_id (already added in previous migration but ensuring consistency)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='recoveries' AND column_name='org_id') THEN
    ALTER TABLE public.recoveries ADD COLUMN org_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 3. Enable RLS and add policies for isolation
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkouts ENABLE ROW LEVEL SECURITY;

-- Transactions Policies
DROP POLICY IF EXISTS "Admins full access to transactions" ON public.transactions;
DROP POLICY IF EXISTS "Authenticated can read transactions" ON public.transactions;

CREATE POLICY "Admins full access to transactions"
  ON public.transactions FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can only see transactions from their org"
  ON public.transactions FOR SELECT
  TO authenticated
  USING (org_id IN (SELECT om.org_id FROM public.org_members om WHERE om.user_id = auth.uid()));

-- Checkouts Policies
DROP POLICY IF EXISTS "Admins full access to checkouts" ON public.checkouts;
DROP POLICY IF EXISTS "Authenticated can read checkouts" ON public.checkouts;

CREATE POLICY "Admins full access to checkouts"
  ON public.checkouts FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can only see checkouts from their org"
  ON public.checkouts FOR SELECT
  TO authenticated
  USING (org_id IN (SELECT om.org_id FROM public.org_members om WHERE om.user_id = auth.uid()));
