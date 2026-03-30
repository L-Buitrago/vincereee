-- 1. Remover a restrição de unicidade antiga que impedia ter mais de uma conversa com a mesma pessoa
ALTER TABLE public.direct_conversations DROP CONSTRAINT IF EXISTS unique_conversation;

-- 2. Adicionar a coluna category se não existir
ALTER TABLE public.direct_conversations ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'direct';

-- 3. Adicionar a nova restrição de unicidade (Usuário1 + Usuário2 + Categoria)
-- Isso permite separar as abas Geral e Suporte mesmo falando com o mesmo Admin.
ALTER TABLE public.direct_conversations 
ADD CONSTRAINT unique_conversation_category UNIQUE (user1_id, user2_id, category);
