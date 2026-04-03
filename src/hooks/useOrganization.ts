import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAILS = [
  "assasinghost910@gmail.com",
  "nathanwar03@gmail.com",
  "ryanfernandosilva12@gmail.com",
];

type Organization = {
  id: string;
  name: string;
  owner_email: string;
  plan: string;
  status: string;
  created_at: string;
};

export function useOrganization() {
  const { user } = useAuth();
  const isAdmin = ADMIN_EMAILS.includes(user?.email?.toLowerCase() || "");

  const { data: membership, isLoading } = useQuery({
    queryKey: ['org-membership', user?.id],
    enabled: !!user,
    queryFn: async () => {
      // 1. Check direct membership
      const { data: directMem, error: memError } = await supabase
        .from('org_members' as any)
        .select('org_id, role, organizations(*)')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (!memError && directMem) return directMem;

      // 2. If no membership but user is admin/owner, try fetching org by owner_email
      if (user?.email) {
        const { data: ownedOrg, error: orgError } = await supabase
          .from('organizations' as any)
          .select('*')
          .eq('owner_email', user.email)
          .maybeSingle();

        if (!orgError && ownedOrg) {
          return {
            org_id: ownedOrg.id,
            role: 'owner',
            organizations: ownedOrg
          } as any;
        }
      }

      return null;
    }
  });

  const orgId: string | null = (membership as any)?.org_id || null;
  const orgRole: string = (membership as any)?.role || (isAdmin ? 'owner' : 'member');
  const org: Organization | null = (membership as any)?.organizations || null;

  return {
    orgId,
    orgRole,
    org,
    isAdmin,
    isLoading,
    hasOrg: !!orgId || isAdmin,
  };
}
