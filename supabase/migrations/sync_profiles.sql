-- SQL para sincronizar usuários do Auth para a tabela Profiles pública
-- Execute este script no SQL Editor do seu Supabase Dashboard

-- 1. Inserir usuários que estão no Auth mas não no Profiles
INSERT INTO public.profiles (user_id, full_name, avatar_url, created_at)
SELECT 
  id, 
  raw_user_meta_data->>'full_name', 
  raw_user_meta_data->>'avatar_url',
  created_at
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.profiles);

-- 2. (Opcional) Criar a função de gatilho para futuros usuários
-- Isso garante que novos cadastros criem automaticamente um perfil público
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

-- 3. (Opcional) Ativar o gatilho
-- Se já existir um gatilho chamado "on_auth_user_created", remova-o primeiro
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
