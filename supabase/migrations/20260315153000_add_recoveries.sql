
-- Create recoveries table
CREATE TABLE IF NOT EXISTS public.recoveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email text NOT NULL,
  customer_name text,
  customer_phone text,
  status text NOT NULL DEFAULT 'pending', -- pending, contacted, recovered, failed
  amount numeric(10,2),
  checkout_id text UNIQUE,
  last_ai_message text,
  org_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recoveries ENABLE ROW LEVEL SECURITY;

-- Admins full access
CREATE POLICY "Admins full access to recoveries"
  ON public.recoveries FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Org members can read their own recoveries
CREATE POLICY "Org members can read own recoveries"
  ON public.recoveries FOR SELECT
  TO authenticated
  USING (org_id IN (SELECT om.org_id FROM public.org_members om WHERE om.user_id = auth.uid()));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_recovery_updated
  BEFORE UPDATE ON public.recoveries
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
