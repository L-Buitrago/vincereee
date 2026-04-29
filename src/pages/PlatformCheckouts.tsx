import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { motion } from "framer-motion";
import { RefreshCw, Filter, ArrowUpDown, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 }
  }),
};

const statusColors: Record<string, string> = {
  aprovado: "bg-emerald-500/10 text-emerald-500",
  pendente: "bg-amber-500/10 text-amber-500",
  recusado: "bg-red-500/10 text-red-500",
  estornado: "bg-muted text-muted-foreground",
};

const gatewayColors: Record<string, string> = {
  asaas: "bg-sky-500/10 text-sky-400",
  stripe: "bg-purple-500/10 text-purple-400",
  pix: "bg-emerald-500/10 text-emerald-400",
  cartao: "bg-blue-500/10 text-blue-400",
};

type StatusFilter = "all" | "aprovado" | "pendente" | "recusado" | "estornado";

export default function PlatformCheckouts() {
  const { orgId, isAdmin } = useOrganization();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['checkout-transactions', orgId, isAdmin],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (!isAdmin && orgId) {
        query = query.eq('org_id', orgId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as any[];
    }
  });

  const filtered = statusFilter === "all" 
    ? transactions 
    : transactions.filter(t => t.status === statusFilter);

  const totals = {
    all: transactions.length,
    aprovado: transactions.filter(t => t.status === 'aprovado').length,
    pendente: transactions.filter(t => t.status === 'pendente').length,
    recusado: transactions.filter(t => t.status === 'recusado').length,
    totalApproved: transactions
      .filter(t => t.status === 'aprovado')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
  };

  const filters: { label: string; value: StatusFilter; count: number }[] = [
    { label: "Todas", value: "all", count: totals.all },
    { label: "Aprovadas", value: "aprovado", count: totals.aprovado },
    { label: "Pendentes", value: "pendente", count: totals.pendente },
    { label: "Recusadas", value: "recusado", count: totals.recusado },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transações</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totals.all} transações — {formatCurrency(totals.totalApproved)} aprovado
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-5 rounded-2xl bg-card border border-border">
          <p className="text-xs text-muted-foreground mb-1">Total Aprovado</p>
          <p className="text-xl font-bold text-emerald-400">{formatCurrency(totals.totalApproved)}</p>
        </div>
        <div className="p-5 rounded-2xl bg-card border border-border">
          <p className="text-xs text-muted-foreground mb-1">Transações Aprovadas</p>
          <p className="text-xl font-bold text-sky-400">{totals.aprovado}</p>
        </div>
        <div className="p-5 rounded-2xl bg-card border border-border">
          <p className="text-xs text-muted-foreground mb-1">Pendentes</p>
          <p className="text-xl font-bold text-amber-400">{totals.pendente}</p>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground/30" />
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
              statusFilter === f.value
                ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent"
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Cliente</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Produto</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Valor</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Gateway</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Status</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-muted-foreground/30" />
                    Carregando transações...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                    <CreditCard className="w-8 h-8 mx-auto mb-3 text-muted-foreground/20" />
                    <p className="text-sm font-medium">Nenhuma transação encontrada</p>
                    <p className="text-xs text-muted-foreground/50 mt-1">
                      {statusFilter !== "all" 
                        ? "Tente remover o filtro para ver todas as transações." 
                        : "As transações aparecerão aqui automaticamente quando seus clientes pagarem."
                      }
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    initial="hidden" animate="visible" variants={fadeUp} custom={i}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-medium text-muted-foreground">
                          {(t.client_name || 'C').substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-foreground font-medium">{t.client_name || 'Cliente'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">
                      {t.product || 'Serviço'}
                    </td>
                    <td className="px-5 py-3.5 text-foreground font-bold">
                      {formatCurrency(Number(t.amount) || 0)}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase border-none ${
                        gatewayColors[(t.gateway || '').toLowerCase()] || 'bg-muted text-muted-foreground'
                      }`}>
                        {t.gateway || 'N/A'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase border-none ${
                        statusColors[t.status] || 'bg-muted text-muted-foreground'
                      }`}>
                        {t.status || 'Processando'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">
                      {new Date(t.date || t.created_at).toLocaleDateString("pt-BR")}
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
