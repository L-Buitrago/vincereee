
-- 1. admin_users: replace self-referential SELECT policy with admin-only
DROP POLICY IF EXISTS "Admins can read admin_users" ON public.admin_users;
CREATE POLICY "Admins can read admin_users"
  ON public.admin_users FOR SELECT TO authenticated
  USING (public.is_vincere_admin());

-- 2. chat_messages: user-scoped policies
CREATE POLICY "Users read own chat messages"
  ON public.chat_messages FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Users insert own chat messages"
  ON public.chat_messages FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 3. organizations: org members can read their org
CREATE POLICY "Org members read own organization"
  ON public.organizations FOR SELECT TO authenticated
  USING (id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));

-- 4. products: authenticated users can read product catalog
CREATE POLICY "Authenticated read products"
  ON public.products FOR SELECT TO authenticated
  USING (true);

-- 5. recoveries: org isolation policies
CREATE POLICY "Org isolation select recoveries"
  ON public.recoveries FOR SELECT TO authenticated
  USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));
CREATE POLICY "Org isolation insert recoveries"
  ON public.recoveries FOR INSERT TO authenticated
  WITH CHECK (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));
CREATE POLICY "Org isolation update recoveries"
  ON public.recoveries FOR UPDATE TO authenticated
  USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));
CREATE POLICY "Org isolation delete recoveries"
  ON public.recoveries FOR DELETE TO authenticated
  USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));

-- 6. user_roles: users read own role
CREATE POLICY "Users read own role"
  ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- 7. vincere_verification_codes: allow user to delete own codes
CREATE POLICY "Users delete own codes"
  ON public.vincere_verification_codes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- 8. Lock search_path on all SECURITY DEFINER + helper functions
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
ALTER FUNCTION public.is_vincere_admin() SET search_path = public;
ALTER FUNCTION public.notify_admins_new_vi_lead() SET search_path = public;
ALTER FUNCTION public.handle_successful_payment() SET search_path = public;
ALTER FUNCTION public.check_overdue_payments() SET search_path = public;
ALTER FUNCTION public.notify_admins_new_quote() SET search_path = public;
ALTER FUNCTION public.has_role(app_role, uuid) SET search_path = public;
ALTER FUNCTION public.notify_on_direct_message() SET search_path = public;
ALTER FUNCTION public.is_admin() SET search_path = public;
ALTER FUNCTION public.delete_expired_verification_codes() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;

-- 9. Revoke EXECUTE from anon/authenticated on trigger and internal-only functions
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_admins_new_vi_lead() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_successful_payment() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_overdue_payments() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_admins_new_quote() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_on_direct_message() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_admins_on_new_message() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_expired_verification_codes() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Grants for newly accessible tables (PostgREST needs explicit grants)
GRANT SELECT, INSERT ON public.chat_messages TO authenticated;
GRANT SELECT ON public.organizations TO authenticated;
GRANT SELECT ON public.products TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recoveries TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT DELETE ON public.vincere_verification_codes TO authenticated;
