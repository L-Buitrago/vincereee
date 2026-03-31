import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { motion } from "framer-motion";
import { Package, Users, DollarSign, Crown, Sparkles } from "lucide-react";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 }
  }),
};

const planDetails: Record<string, { icon: any; color: string; bgClass: string; textClass: string; features: string[] }> = {
  starter: {
    icon: Package,
    color: "violet",
    bgClass: "bg-violet-500/10",
    textClass: "text-violet-400",
    features: ["Até 100 clientes", "CRM Básico", "1 usuário", "Suporte por email"],
  },
  pro: {
    icon: Crown,
    color: "orange",
    bgClass: "bg-platform-orange/10",
    textClass: "text-platform-orange",
    features: ["Clientes ilimitados", "CRM Completo", "5 usuários", "Suporte prioritário", "Relatórios avançados"],
  },
  enterprise: {
    icon: Sparkles,
    color: "purple",
    bgClass: "bg-purple-500/10",
    textClass: "text-purple-400",
    features: ["Tudo do Pro", "Usuários ilimitados", "API dedicada", "White-label", "Suporte 24/7"],
  },
};

export default function PlatformProducts() {
  const { orgId, isAdmin, org } = useOrganization();

  const { data: stats } = useQuery({
    queryKey: ['org-stats', orgId, isAdmin],
    queryFn: async () => {
      let query = supabase
        .from('customers' as any)
        .select('*');

      if (!isAdmin && orgId) {
        query = query.eq('org_id', orgId);
      }

      const { data, error } = await query;
      if (error) throw error;
      const customers = data as any[];

      return {
        totalCustomers: customers.length,
        activeCustomers: customers.filter((c: any) => c.status === 'Cliente Ativo').length,
        totalRevenue: customers.reduce((sum: number, c: any) => sum + (c.total_spent || 0), 0),
        leads: customers.filter((c: any) => c.status === 'Lead').length,
      };
    }
  });

  const currentPlan = org?.plan || 'starter';
  const plan = planDetails[currentPlan] || planDetails.starter;
  const PlanIcon = plan.icon;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Meu Plano</h1>
        <p className="text-sm text-[#888] mt-1">Gerencie sua assinatura e veja o uso da sua conta.</p>
      </div>

      <motion.div
        initial="hidden" animate="visible" variants={fadeUp} custom={0}
        className="p-6 rounded-2xl bg-[#111] border border-white/5 mb-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-14 h-14 rounded-xl ${plan.bgClass} flex items-center justify-center`}>
            <PlanIcon className={`w-7 h-7 ${plan.textClass}`} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white capitalize">{isAdmin ? "Admin Vincere" : `Plano ${currentPlan}`}</h2>
            <p className="text-sm text-[#888]">
              {isAdmin ? "Acesso total a todas as organizações" : org?.status === 'active' ? "Assinatura ativa" : "Sem assinatura"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-white/5">
            <Users className="w-5 h-5 text-violet-400 mb-2" />
            <p className="text-2xl font-bold text-white">{stats?.totalCustomers || 0}</p>
            <p className="text-xs text-[#888]">Total de Clientes</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5">
            <Users className="w-5 h-5 text-platform-orange mb-2" />
            <p className="text-2xl font-bold text-white">{stats?.leads || 0}</p>
            <p className="text-xs text-[#888]">Leads Capturados</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5">
            <Users className="w-5 h-5 text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-white">{stats?.activeCustomers || 0}</p>
            <p className="text-xs text-[#888]">Clientes Ativos</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5">
            <DollarSign className="w-5 h-5 text-violet-400 mb-2" />
            <p className="text-2xl font-bold text-white">{formatCurrency(stats?.totalRevenue || 0)}</p>
            <p className="text-xs text-[#888]">Receita Total</p>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-white mb-3">Recursos do seu plano:</h3>
        <ul className="space-y-2">
          {plan.features.map((feat, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-[#ccc]">
              <div className={`w-1.5 h-1.5 rounded-full ${plan.bgClass}`} />
              {feat}
            </li>
          ))}
        </ul>
      </motion.div>

      {currentPlan !== 'enterprise' && (
        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={1}
          className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/10"
        >
          <h3 className="text-lg font-bold text-white mb-2">🚀 Quer mais recursos?</h3>
          <p className="text-sm text-[#888] mb-4">
            Faça upgrade do seu plano para desbloquear funcionalidades avançadas e suporte prioritário.
          </p>
          <a href="/plataforma/pagamentos">
            <button className="px-6 py-2.5 rounded-xl bg-platform-purple hover:bg-platform-purple/90 text-white font-semibold text-sm transition-colors">
              Ver planos disponíveis
            </button>
          </a>
        </motion.div>
      )}
    </div>
  );
}
