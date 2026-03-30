
-- Drop all existing policies
DROP POLICY "Users can view own profile" ON public.profiles;
DROP POLICY "Users can update own profile" ON public.profiles;
DROP POLICY "Users can insert own profile" ON public.profiles;

DROP POLICY "Users can view own quotes" ON public.quotes;
DROP POLICY "Users can insert own quotes" ON public.quotes;
DROP POLICY "Users can update own quotes" ON public.quotes;
DROP POLICY "Users can delete own quotes" ON public.quotes;

DROP POLICY "Users can view own projects" ON public.projects;
DROP POLICY "Users can insert own projects" ON public.projects;
DROP POLICY "Users can update own projects" ON public.projects;
DROP POLICY "Users can delete own projects" ON public.projects;

-- Recreate with TO authenticated
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own quotes" ON public.quotes
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quotes" ON public.quotes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quotes" ON public.quotes
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own quotes" ON public.quotes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
