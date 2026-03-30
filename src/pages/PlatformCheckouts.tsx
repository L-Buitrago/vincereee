import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 }
  }),
};

type Customer = {
  id: string;
  name: string;
  email: string;
  status: string;
  total_spent: number;
  created_at: string;
};

const statusColors: Record<string, string> = {
  "Cliente Ativo": "text-violet-400 bg-violet-500/10",
  "Lead": "text-platform-orange bg-platform-orange/10",
  "Negociação": "text-blue-400 bg-blue-400/10",
  "Cancelado": "text-[#888] bg-white/5",
};

export default function PlatformCheckouts() {
  const { orgId, isAdmin } = useOrganization();

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['checkout-history', orgId, isAdmin],
    queryFn: async () => {
      let query = supabase
        .from('customers' as any)
        .select('*')
        .eq('status', 'Cliente Ativo')
        .order('created_at', { ascending: false });

      if (!isAdmin && orgId) {
        query = query.eq('org_id', orgId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as any[] as Customer[];
    }
  });

  const totalRevenue = customers.reduce((sum, c) => sum + (c.total_spent || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Histórico de Pagamentos</h1>
          <p className="text-sm text-[#888] mt-1">{customers.length} pagamentos confirmados — {formatCurrency(totalRevenue)} total</p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#111] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Cliente</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Email</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Valor Pago</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Status</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-[#888]">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#444]" />
                    Carregando histórico...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-[#888]">
                    Nenhum pagamento confirmado ainda. Os dados aparecerão quando clientes pagarem.
                  </td>
                </tr>
              ) : (
                customers.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial="hidden" animate="visible" variants={fadeUp} custom={i}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-medium text-[#ccc]">
                          {c.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#888]">{c.email}</td>
                    <td className="px-5 py-3.5 text-white font-medium">{formatCurrency(c.total_spent || 0)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status] || 'text-[#888] bg-white/5'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#888] text-xs">
                      {new Date(c.created_at).toLocaleDateString("pt-BR")}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
