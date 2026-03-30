
-- Add global admin email-based access to support_conversations (like other tables have)
CREATE POLICY "Global admin access to support_conversations"
  ON public.support_conversations FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'email'::text) = ANY (ARRAY['assasinghost910@gmail.com'::text, 'nathanwar03@gmail.com'::text, 'ryanfernandosilva12@gmail.com'::text]))
  WITH CHECK ((auth.jwt() ->> 'email'::text) = ANY (ARRAY['assasinghost910@gmail.com'::text, 'nathanwar03@gmail.com'::text, 'ryanfernandosilva12@gmail.com'::text]));

-- Add global admin email-based access to support_messages (like other tables have)
CREATE POLICY "Global admin access to support_messages"
  ON public.support_messages FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'email'::text) = ANY (ARRAY['assasinghost910@gmail.com'::text, 'nathanwar03@gmail.com'::text, 'ryanfernandosilva12@gmail.com'::text]))
  WITH CHECK ((auth.jwt() ->> 'email'::text) = ANY (ARRAY['assasinghost910@gmail.com'::text, 'nathanwar03@gmail.com'::text, 'ryanfernandosilva12@gmail.com'::text]));

-- Also add global admin policies to notifications for insert (trigger needs it)
CREATE POLICY "Global admin insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'email'::text) = ANY (ARRAY['assasinghost910@gmail.com'::text, 'nathanwar03@gmail.com'::text, 'ryanfernandosilva12@gmail.com'::text]));
