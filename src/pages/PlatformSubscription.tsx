import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { 
  Crown, CreditCard, CalendarDays, ArrowUpRight, 
  CheckCircle2, AlertCircle, XCircle, Loader2, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckoutModal } from "@/components/CheckoutModal";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 }
  }),
};

const planDetails: Record<string, { price: number; features: string[]; color: string }> = {
  starter: {
    price: 97,
    features: ["Até 100 vendas/mês", "1 checkout personalizado", "Entrega automática", "Dashboard básico", "Suporte por email"],
    color: "#3b82f6"
  },
  pro: {
    price: 197,
    features: ["Vendas ilimitadas", "Checkouts ilimitados", "WhatsApp recovery autom.", "Área de membros completa", "Integrações premium e Pix", "Suporte prioritário"],
    color: "#8b5cf6"
  },
  enterprise: {
    price: 497,
    features: ["Tudo do plano Pro", "Contas Multi-usuário", "Acesso API dedicada", "White-label total", "Suporte dedicado 24/7", "Onboarding personalizado", "SLA de uptime garantido"],
    color: "#f59e0b"
  },
};

const statusConfig: Record<string, { label: string; icon: any; cls: string }> = {
  active: { label: "Ativa", icon: CheckCircle2, cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  pending: { label: "Pendente", icon: AlertCircle, cls: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  cancelled: { label: "Cancelada", icon: XCircle, cls: "bg-red-500/10 text-red-500 border-red-500/20" },
  inactive: { label: "Inativa", icon: XCircle, cls: "bg-muted text-muted-foreground border-border" },
};

export default function PlatformSubscription() {
  const { user } = useAuth();
  const { org, orgId, isAdmin } = useOrganization();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);

  const currentPlan = (org as any)?.plan || "starter";
  const currentStatus = (org as any)?.status || "inactive";
  const planInfo = planDetails[currentPlan] || planDetails.starter;
  const statusInfo = statusConfig[currentStatus] || statusConfig.inactive;
  const StatusIcon = statusInfo.icon;

  // Fetch invoices/transactions for this org
  const { data: invoices = [], isLoading: invoicesLoading } = useQuery({
    queryKey: ['subscription-invoices', orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('org_id', orgId!)
        .order('date', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data as any[];
    }
  });

  const handleUpgrade = (planName: string) => {
    const plan = planDetails[planName.toLowerCase()];
    if (!plan) return;
    setSelectedPlan(planName);
    setSelectedPrice(plan.price);
    setIsCheckoutOpen(true);
  };

  // For admins without an org, show a simplified view
  if (isAdmin && !org) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[900px]">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Crown className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Minha Assinatura</h1>
            <p className="text-sm text-muted-foreground">Você é administrador da plataforma — acesso total.</p>
          </div>
        </div>
        <Card className="bg-card border-border rounded-2xl p-8 text-center">
          <Crown className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Acesso Administrativo</h2>
          <p className="text-muted-foreground text-sm">Como administrador, você tem acesso total a todas as funcionalidades da plataforma sem necessidade de assinatura.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[900px]">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Minha Assinatura</h1>
            <p className="text-sm text-muted-foreground">Gerencie seu plano, faturas e preferências de cobrança.</p>
          </div>
        </div>
      </motion.div>

      {/* Current Plan Card */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
        <Card className="bg-card border-border rounded-2xl overflow-hidden mb-8 shadow-lg">
          <CardContent className="p-0">
            {/* Plan Header with gradient */}
            <div 
              className="p-8 relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${planInfo.color}15, ${planInfo.color}05)` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-2xl font-bold text-foreground capitalize">Plano {currentPlan}</h2>
                    <Badge className={`${statusInfo.cls} border rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest gap-1.5`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {org ? `Empresa: ${(org as any).name}` : "Carregando informações..."}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-muted-foreground text-sm font-medium">R$</span>
                    <span className="text-4xl font-bold text-foreground">{planInfo.price}</span>
                    <span className="text-muted-foreground text-sm">/mês</span>
                  </div>
                </div>
              </div>
              {/* Decorative glow */}
              <div 
                className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[100px] opacity-20 pointer-events-none"
                style={{ backgroundColor: planInfo.color }}
              />
            </div>

            {/* Features list */}
            <div className="p-8 pt-6 border-t border-border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Recursos inclusos</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {planInfo.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: planInfo.color }} />
                    <span className="text-sm text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upgrade Options */}
      {currentPlan !== "enterprise" && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="mb-8">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Fazer Upgrade</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(planDetails)
              .filter(([key]) => {
                const order = { starter: 0, pro: 1, enterprise: 2 };
                return (order[key as keyof typeof order] || 0) > (order[currentPlan as keyof typeof order] || 0);
              })
              .map(([key, plan]) => (
                <Card 
                  key={key} 
                  className="bg-card border-border rounded-2xl p-6 hover:border-primary/30 transition-all cursor-pointer group"
                  onClick={() => handleUpgrade(key)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-foreground capitalize">{key}</h3>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-muted-foreground text-xs">R$</span>
                    <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground text-xs">/mês</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Fazer Upgrade
                  </Button>
                </Card>
              ))}
          </div>
        </motion.div>
      )}

      {/* Invoices / Transaction History */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Histórico de Faturas</p>
          <CalendarDays className="w-4 h-4 text-muted-foreground/30" />
        </div>
        <Card className="bg-card border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Descrição</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Valor</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Status</th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {invoicesLoading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-muted-foreground">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-muted-foreground/30" />
                      Carregando faturas...
                    </td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-muted-foreground">
                      <CreditCard className="w-8 h-8 mx-auto mb-3 text-muted-foreground/20" />
                      <p className="text-sm font-medium">Nenhuma fatura encontrada</p>
                      <p className="text-xs text-muted-foreground/50 mt-1">As faturas aparecerão aqui quando você realizar pagamentos.</p>
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv: any) => (
                    <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="text-foreground font-medium">{inv.product || inv.description || 'Assinatura Vincere'}</span>
                      </td>
                      <td className="px-5 py-3.5 text-foreground font-medium">
                        {formatCurrency(inv.amount || 0)}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase border-none ${
                          inv.status === 'aprovado' ? 'bg-emerald-500/10 text-emerald-500' :
                          inv.status === 'pendente' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {inv.status || 'Processando'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground text-xs">
                        {new Date(inv.date || inv.created_at).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        planName={selectedPlan}
        priceAmount={selectedPrice}
      />
    </div>
  );
}
