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
    enabled: !!user && !isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('org_members' as any)
        .select('org_id, role, organizations(*)')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) {
        console.error("Org membership error:", error);
        return null;
      }
      return data as any;
    }
  });

  const orgId: string | null = membership?.org_id || null;
  const orgRole: string = membership?.role || 'member';
  const org: Organization | null = membership?.organizations || null;

  return {
    orgId,
    orgRole,
    org,
    isAdmin,
    isLoading,
    hasOrg: !!orgId || isAdmin,
  };
}
