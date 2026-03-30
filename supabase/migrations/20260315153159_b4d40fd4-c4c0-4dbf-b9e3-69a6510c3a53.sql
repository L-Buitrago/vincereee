
-- =============================================
-- Harden support_conversations RLS
-- =============================================

-- Drop old permissive policies
DROP POLICY IF EXISTS "Allow all read" ON public.support_conversations;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.support_conversations;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.support_conversations;

-- Admins full access
CREATE POLICY "Admins full access to support_conversations"
  ON public.support_conversations FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Org members can read their own conversations
CREATE POLICY "Org members can read own conversations"
  ON public.support_conversations FOR SELECT
  TO authenticated
  USING (
    org_id IN (SELECT om.org_id FROM public.org_members om WHERE om.user_id = auth.uid())
  );

-- Org members can create conversations for their org
CREATE POLICY "Org members can insert own conversations"
  ON public.support_conversations FOR INSERT
  TO authenticated
  WITH CHECK (
    org_id IN (SELECT om.org_id FROM public.org_members om WHERE om.user_id = auth.uid())
  );

-- Org members can update their own conversations (e.g. last_message_at)
CREATE POLICY "Org members can update own conversations"
  ON public.support_conversations FOR UPDATE
  TO authenticated
  USING (
    org_id IN (SELECT om.org_id FROM public.org_members om WHERE om.user_id = auth.uid())
  );

-- =============================================
-- Harden support_messages RLS
-- =============================================

DROP POLICY IF EXISTS "Allow all read" ON public.support_messages;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.support_messages;

-- Admins full access
CREATE POLICY "Admins full access to support_messages"
  ON public.support_messages FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Org members can read messages from their conversations
CREATE POLICY "Org members can read own messages"
  ON public.support_messages FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT sc.id FROM public.support_conversations sc
      WHERE sc.org_id IN (SELECT om.org_id FROM public.org_members om WHERE om.user_id = auth.uid())
    )
  );

-- Org members can insert messages into their conversations
CREATE POLICY "Org members can insert own messages"
  ON public.support_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND conversation_id IN (
      SELECT sc.id FROM public.support_conversations sc
      WHERE sc.org_id IN (SELECT om.org_id FROM public.org_members om WHERE om.user_id = auth.uid())
    )
  );
