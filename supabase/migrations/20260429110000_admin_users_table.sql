-- =============================================
-- CENTRALIZAR ADMINS EM TABELA DO BANCO
-- =============================================
-- Em vez de emails hardcoded no código, agora os admins
-- são gerenciados por uma tabela dedicada.

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Somente admins podem ver a tabela (bootstrapped com os emails conhecidos)
CREATE POLICY "Admins can read admin_users" ON public.admin_users
  FOR SELECT TO authenticated
  USING (
    LOWER(COALESCE(auth.jwt() ->> 'email', auth.email())) IN (
      SELECT LOWER(email) FROM public.admin_users
    )
  );

-- Inserir os admins iniciais (idempotente)
INSERT INTO public.admin_users (email) VALUES
  ('assasinghost910@gmail.com'),
  ('nathanwar03@gmail.com'),
  ('ryanfernandosilva12@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Criar uma função helper para verificar admin status via SQL
-- Isso pode ser usado em outras políticas RLS no futuro
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE LOWER(email) = LOWER(COALESCE(auth.jwt() ->> 'email', auth.email()))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
