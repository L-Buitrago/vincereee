import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Fallback list in case DB query fails (e.g., table not yet created)
const FALLBACK_ADMIN_EMAILS = [
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
  
  // Safety timeout: force loading to stop after 5 seconds no matter what
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimedOut(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch admin emails from the database
  const { data: adminEmails = FALLBACK_ADMIN_EMAILS } = useQuery({
    queryKey: ['admin-emails'],
    staleTime: 5 * 60 * 1000,
    retry: false,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('admin_users' as any)
          .select('email');
        
        if (error || !data || data.length === 0) return FALLBACK_ADMIN_EMAILS;
        return (data as any[]).map((d: any) => d.email.toLowerCase());
      } catch (err) {
        console.warn("Using fallback admin emails due to error:", err);
        return FALLBACK_ADMIN_EMAILS;
      }
    }
  });

  const isAdmin = adminEmails.includes(user?.email?.toLowerCase() || "");

  const { data: membership, isLoading } = useQuery({
    queryKey: ['org-membership', user?.id],
    enabled: !!user,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      try {
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
            const organization = ownedOrg as any;
            return {
              org_id: organization.id,
              role: 'owner',
              organizations: organization
            } as any;
          }
        }
      } catch (err) {
        console.error("Membership query failed:", err);
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
    isLoading: isLoading && !timedOut,
    hasOrg: !!orgId || isAdmin,
  };
}
