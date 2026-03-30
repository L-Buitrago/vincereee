-- Tabela de conversas diretas entre 2 usuários
CREATE TABLE IF NOT EXISTS public.direct_conversations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id uuid NOT NULL,
  user2_id uuid NOT NULL,
  last_message text,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_conversation UNIQUE (user1_id, user2_id)
);

-- Tabela de mensagens diretas
CREATE TABLE IF NOT EXISTS public.direct_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES public.direct_conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_dm_conversation ON public.direct_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_dm_created ON public.direct_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_dc_user1 ON public.direct_conversations(user1_id);
CREATE INDEX IF NOT EXISTS idx_dc_user2 ON public.direct_conversations(user2_id);

-- Habilitar RLS
ALTER TABLE public.direct_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

-- Policies: usuários só veem suas próprias conversas
CREATE POLICY "Users can view own conversations" ON public.direct_conversations
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can insert conversations" ON public.direct_conversations
  FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update own conversations" ON public.direct_conversations
  FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Policies para mensagens
CREATE POLICY "Users can view messages in own conversations" ON public.direct_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.direct_conversations dc
      WHERE dc.id = conversation_id
      AND (dc.user1_id = auth.uid() OR dc.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert messages in own conversations" ON public.direct_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.direct_conversations dc
      WHERE dc.id = conversation_id
      AND (dc.user1_id = auth.uid() OR dc.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can update read status" ON public.direct_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.direct_conversations dc
      WHERE dc.id = conversation_id
      AND (dc.user1_id = auth.uid() OR dc.user2_id = auth.uid())
    )
  );

-- Habilitar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_conversations;
