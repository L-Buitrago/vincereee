import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Eye, RefreshCw } from "lucide-react";
import { formatCurrency, type Transaction } from "@/data/platformMockData";

const statusColors: Record<string, string> = {
  aprovado: "text-violet-400 bg-violet-500/10",
  pendente: "text-platform-orange bg-platform-orange/10",
  recusado: "text-platform-red bg-platform-red/10",
  estornado: "text-[#888] bg-white/5",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function PlatformPayments() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'transactions' | 'recoveries'>('transactions');
  const perPage = 10;
  
  const { data: transactions = [], isLoading: loadingTx } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: memberData } = await supabase
        .from('org_members')
        .select('org_id')
        .eq('user_id', user.id)
        .single();

      const query = supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (memberData?.org_id) {
        query.eq('org_id', memberData.org_id);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return data.map(t => ({
        ...t,
        clientName: t.client_name
      })) as Transaction[];
    }
  });

  const { data: recoveries = [], isLoading: loadingRec } = useQuery({
    queryKey: ['recoveries'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: memberData } = await supabase
        .from('org_members')
        .select('org_id')
        .eq('user_id', user.id)
        .single();

      const query = supabase
        .from('recoveries')
        .select('*')
        .order('created_at', { ascending: false });

      if (memberData?.org_id) {
        query.eq('org_id', memberData.org_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: activeTab === 'recoveries'
  });

  const isLoading = activeTab === 'transactions' ? loadingTx : loadingRec;
  const data = activeTab === 'transactions' ? transactions : recoveries;
  const paginated = data.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(data.length / perPage);

  const totals = {
    aprovado: transactions.filter(t => t.status === "aprovado").reduce((s, t) => s + (t.amount || 0), 0),
    pendente: transactions.filter(t => t.status === "pendente").reduce((s, t) => s + (t.amount || 0), 0),
    estornado: transactions.filter(t => t.status === "estornado").reduce((s, t) => s + (t.amount || 0), 0),
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Centro de Cobrança</h1>
          <p className="text-sm text-[#888] mt-1">Gerencie suas transações e recuperações de vendas.</p>
        </div>
        
        <div className="flex bg-[#111] p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'transactions' ? 'bg-violet-500/10 text-violet-400' : 'text-[#888] hover:text-white'}`}
          >
            Transações
          </button>
          <button 
            onClick={() => setActiveTab('recoveries')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'recoveries' ? 'bg-violet-500/10 text-violet-400' : 'text-[#888] hover:text-white'}`}
          >
            Recuperações (AI)
          </button>
        </div>
      </div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-[#111] border border-white/5">
          <p className="text-xs text-[#888] mb-1">Total Aprovado</p>
          <p className="text-xl font-bold text-violet-400">{formatCurrency(totals.aprovado)}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#111] border border-white/5">
          <p className="text-xs text-[#888] mb-1">Total Pendente</p>
          <p className="text-xl font-bold text-platform-orange">{formatCurrency(totals.pendente)}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#111] border border-white/5">
          <p className="text-xs text-[#888] mb-1">Recuperações Ativas</p>
          <p className="text-xl font-bold text-blue-400">{recoveries.filter(r => r.status === 'contacted').length}</p>
        </div>
      </motion.div>

      <div className="rounded-2xl bg-[#111] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Cliente</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Valor</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Status</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Data</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-[#888]">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#444]" />
                    Carregando dados...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-[#888]">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                paginated.map((item: any) => (
                  <tr key={item.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{item.customer_name || item.clientName || 'Cliente'}</span>
                        <span className="text-xs text-[#666]">{item.customer_email || item.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-white font-medium">{formatCurrency(item.amount || item.amount || 0)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[item.status || ''] || 'text-[#888] bg-white/5'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#888] text-xs">
                      {new Date(item.created_at || item.date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-5 py-3.5">
                      <button className="p-1.5 rounded-lg hover:bg-white/5 text-[#888] hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-white/5">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                  page === i + 1 ? "bg-purple-500/10 text-violet-400" : "text-[#888] hover:bg-white/5"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
