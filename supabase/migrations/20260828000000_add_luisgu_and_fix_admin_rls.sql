-- Add luisgu0703@gmail.com and all admins to admin_users and all RLS policies

-- 1. admin_users
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

INSERT INTO public.admin_users (email)
VALUES 
  ('luisgu0703@gmail.com'),
  ('assasinghost910@gmail.com'),
  ('nathanwar03@gmail.com'),
  ('ryanfernandosilva12@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- 2. vi_leads
DROP POLICY IF EXISTS "Allow admins to read leads" ON public.vi_leads;
DROP POLICY IF EXISTS "Allow admins to delete leads" ON public.vi_leads;
DROP POLICY IF EXISTS "Allow public to insert leads" ON public.vi_leads;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.vi_leads;

CREATE POLICY "Allow public to insert leads" ON public.vi_leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow admins to read leads" ON public.vi_leads
  FOR SELECT
  USING (
    LOWER(COALESCE(auth.jwt() ->> 'email', auth.email())) IN (
      'luisgu0703@gmail.com',
      'assasinghost910@gmail.com', 
      'nathanwar03@gmail.com', 
      'ryanfernandosilva12@gmail.com'
    )
  );

CREATE POLICY "Allow admins to delete leads" ON public.vi_leads
  FOR DELETE
  USING (
    LOWER(COALESCE(auth.jwt() ->> 'email', auth.email())) IN (
      'luisgu0703@gmail.com',
      'assasinghost910@gmail.com', 
      'nathanwar03@gmail.com', 
      'ryanfernandosilva12@gmail.com'
    )
  );

-- 3. contact_requests
DROP POLICY IF EXISTS "Allow admins to select contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Anyone can select contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Anyone can insert contact requests" ON public.contact_requests;

CREATE POLICY "Anyone can insert contact requests" ON public.contact_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can select contact requests" ON public.contact_requests
  FOR SELECT TO anon, authenticated
  USING (true);

-- 4. chat_messages
DROP POLICY IF EXISTS "Anyone can insert chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can select chat messages" ON public.chat_messages;

CREATE POLICY "Anyone can insert chat messages" ON public.chat_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can select chat messages" ON public.chat_messages
  FOR SELECT TO anon, authenticated
  USING (true);

-- 5. notifications
DROP POLICY IF EXISTS "Admins can view their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow anyone to insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can update their notifications" ON public.notifications;

CREATE POLICY "Allow anyone to insert notifications" ON public.notifications
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view their notifications" ON public.notifications
  FOR SELECT
  USING (
    LOWER(COALESCE(auth.jwt() ->> 'email', auth.email())) = LOWER(user_email)
    OR
    LOWER(COALESCE(auth.jwt() ->> 'email', auth.email())) IN (
      'luisgu0703@gmail.com',
      'assasinghost910@gmail.com', 
      'nathanwar03@gmail.com', 
      'ryanfernandosilva12@gmail.com'
    )
  );

CREATE POLICY "Admins can update their notifications" ON public.notifications
  FOR UPDATE
  USING (
    LOWER(COALESCE(auth.jwt() ->> 'email', auth.email())) = LOWER(user_email)
    OR
    LOWER(COALESCE(auth.jwt() ->> 'email', auth.email())) IN (
      'luisgu0703@gmail.com',
      'assasinghost910@gmail.com', 
      'nathanwar03@gmail.com', 
      'ryanfernandosilva12@gmail.com'
    )
  );
