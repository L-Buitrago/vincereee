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
  "Cliente Ativo": "text-sky-400 bg-sky-500/10",
  "Lead": "text-platform-orange bg-platform-orange/10",
  "Negociação": "text-blue-400 bg-blue-400/10",
  "Cancelado": "text-muted-foreground bg-muted",
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
          <h1 className="text-2xl font-bold text-foreground">Histórico de Pagamentos</h1>
          <p className="text-sm text-muted-foreground mt-1">{customers.length} pagamentos confirmados — {formatCurrency(totalRevenue)} total</p>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Cliente</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Email</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Valor Pago</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Status</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-muted-foreground/30" />
                    Carregando histórico...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                    Nenhum pagamento confirmado ainda. Os dados aparecerão quando clientes pagarem.
                  </td>
                </tr>
              ) : (
                customers.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial="hidden" animate="visible" variants={fadeUp} custom={i}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-medium text-muted-foreground">
                          {c.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-foreground font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{c.email}</td>
                    <td className="px-5 py-3.5 text-foreground font-medium">{formatCurrency(c.total_spent || 0)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status] || 'text-muted-foreground bg-muted'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">
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
