import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useOrganization } from "@/hooks/useOrganization";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * SubscriptionGuard — Blocks platform access unless the user
 * belongs to an active organization (via org_members) or is an admin.
 */

const SubscriptionGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { isAdmin, hasOrg, isLoading } = useOrganization();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-platform-green" />
        <p className="text-[#444] text-xs font-mono animate-pulse">Sincronizando com a Vincere...</p>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-[#333] hover:text-white mt-4"
          onClick={() => window.location.reload()}
        >
          Demorando muito? Clique para recarregar
        </Button>
      </div>
    );
  }

  // Admins always pass
  if (isAdmin) return <>{children}</>;

  // User has an active organization
  if (hasOrg) return <>{children}</>;

  // Blocked — no org
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
          <a href="/plataforma/pagamentos">
            <Button className="w-full bg-platform-green hover:bg-platform-green/90 text-black font-semibold">
              Ver Planos e Assinar
            </Button>
          </a>
          <a href="/">
            <Button variant="outline" className="w-full border-white/10 text-white bg-transparent hover:bg-white/5 mt-2">
              Voltar ao Início
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionGuard;
