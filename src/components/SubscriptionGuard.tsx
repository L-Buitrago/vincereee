import { useAuth } from "@/contexts/AuthContext";
import { useOrganization } from "@/hooks/useOrganization";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

/**
 * SubscriptionGuard — Blocks platform access unless the user
 * belongs to an active organization (via org_members), is an admin/creator, or in dev.
 */

const SubscriptionGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { isAdmin: isOrgAdmin, hasOrg, isLoading: isOrgLoading } = useOrganization();
  const { isAdmin: isRoleAdmin, loading: isRoleLoading } = useIsAdmin();

  const isDev = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1'
  );

  const masterAdmins = [
    'luisgu0703@gmail.com',
    'assasinghost910@gmail.com',
    'nathanwar03@gmail.com',
    'ryanfernandosilva12@gmail.com'
  ];
  const isMasterAdmin = !!user?.email && masterAdmins.includes(user.email.toLowerCase());

  // Master Admins (Creators) and Dev environment always pass immediately without waiting for DB queries
  if (isMasterAdmin || isDev) {
    return <>{children}</>;
  }

  if (isOrgLoading && isRoleLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-xs font-mono animate-pulse">Sincronizando com a Vincere...</p>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:text-foreground mt-4"
          onClick={() => window.location.reload()}
        >
          Demorando muito? Clique para recarregar
        </Button>
      </div>
    );
  }

  // Admins with org or role permissions
  if (isOrgAdmin || isRoleAdmin) {
    return <>{children}</>;
  }

  // User has an active organization
  if (hasOrg) {
    return <>{children}</>;
  }

  // Blocked — display Acesso Restrito screen for non-paying users
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
      <div className="max-w-md w-full text-center p-8 rounded-2xl bg-[#111] border border-white/10">
        <div className="w-16 h-16 rounded-full bg-platform-orange/10 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-platform-orange" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h2>
        <p className="text-[#888] mb-6">
          Você precisa ter uma assinatura ativa para acessar a plataforma Vincere.
          Escolha um plano abaixo para começar!
        </p>
        <div className="space-y-3">
          <Link to="/plataforma/pagamentos">
            <Button className="w-full bg-platform-green hover:bg-platform-green/90 text-black font-semibold">
              Ver Planos e Assinar
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-full border-white/10 text-white bg-transparent hover:bg-white/5 mt-2">
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionGuard;
