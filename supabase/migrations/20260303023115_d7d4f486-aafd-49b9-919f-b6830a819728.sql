
-- Fix chat_messages: restrict SELECT to own session only
DROP POLICY "Users can read own chat messages" ON public.chat_messages;
CREATE POLICY "Users can read own session chat messages" ON public.chat_messages
  FOR SELECT TO anon, authenticated USING (session_id = current_setting('request.headers')::json->>'x-session-id' OR (auth.uid() IS NOT NULL AND user_id = auth.uid()));

-- Actually, session_id header approach is fragile. Better: no public SELECT at all, only admins can read.
DROP POLICY "Users can read own session chat messages" ON public.chat_messages;

-- Contact requests: no public SELECT needed, only admins
-- (already only admin SELECT exists, so contact_requests is fine)
