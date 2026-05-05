import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Users, DollarSign, TrendingUp, Crown, Folder, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 }
  }),
};

type Org = {
  id: string;
  name: string;
  owner_email: string;
  plan: string;
  status: string;
  created_at: string;
};

export default function PlatformAdmin() {
  const { isAdmin } = useOrganization();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  if (!isAdmin) return <Navigate to="/plataforma/dashboard" replace />;

  const { data: orgs = [], isLoading: orgsLoading } = useQuery({
    queryKey: ['admin-orgs'],
    queryFn: async () => {
      console.log("Admin: Buscando organizações...");
      const { data, error } = await supabase
        .from('organizations' as any)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error("Erro ao buscar organizações:", error);
        throw error;
      }
      return data as any[] as Org[];
    }
  });

  const { data: allCustomers = [] } = useQuery({
    queryKey: ['admin-all-customers'],
    queryFn: async () => {
      console.log("Admin: Buscando clientes...");
      const { data, error } = await supabase
        .from('customers' as any)
        .select('*');
      if (error) {
        console.error("Erro ao buscar clientes:", error);
        throw error;
      }
      return data as any[];
    }
  });

  const { data: viLeads = [] } = useQuery({
    queryKey: ['admin-vi-leads'],
    queryFn: async () => {
      console.log("Admin: Buscando leads da Vi...");
      const { data, error } = await supabase.from('vi_leads' as any).select('*').order('created_at', { ascending: false });
      if (error) {
        console.error("Erro ao buscar leads:", error);
        throw error;
      }
      return data as any[];
    }
  });

  const totalRevenue = allCustomers.reduce((sum, c) => sum + (c.total_spent || 0), 0);
  const totalClients = allCustomers.length;
  const totalActive = allCustomers.filter(c => c.status === 'Cliente Ativo').length;
  const totalCustomersLeads = allCustomers.filter(c => c.status === 'Lead').length;
  const totalLeads = totalCustomersLeads + viLeads.length;
  
  const { data: adminProjects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['admin-all-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects' as any)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as any[];
    }
  });

  const projectsWithOrg = adminProjects.map(proj => {
    // Attempt to find the org from the user's ID if we had a mapping, 
    // but the projects table has user_id. We can find the org by matching 
    // the customer who has this user_id/email or just use the user_id's org.
    // However, simply matching the org from the customers table is easier.
    const projectOrg = allCustomers.find(c => c.user_id === proj.user_id || c.email === proj.user_id)?.org_id;
    const orgInfo = orgs.find(o => o.id === projectOrg);
    return {
      ...proj,
      orgName: orgInfo?.name || "Vincere"
    };
  });

  const orgStats = orgs.map(org => {
    const orgCustomers = allCustomers.filter(c => c.org_id === org.id);
    return {
      ...org,
      customerCount: orgCustomers.length,
      revenue: orgCustomers.reduce((sum, c) => sum + (c.total_spent || 0), 0),
      activeCount: orgCustomers.filter(c => c.status === 'Cliente Ativo').length,
    };
  });

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este lead?")) return;

    try {
      const { error } = await supabase
        .from('vi_leads' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({ title: "✅ Lead excluído", description: "O registro foi removido com sucesso." });
      
      // Force immediate invalidation of all related queries
      queryClient.invalidateQueries({ queryKey: ['admin-vi-leads'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    } catch (error: any) {
      console.error("Erro ao excluir lead:", error);
      toast({ title: "Erro ao excluir lead", description: error.message, variant: "destructive" });
    }
  };

  const NeedsFormatter = ({ needsStr }: { needsStr: string }) => {
    if (!needsStr) return <span className="text-[#666]">Nenhum detalhe informado.</span>;
    const [expanded, setExpanded] = useState(false);
    const lines = needsStr.split('\n').filter(l => l.trim().length > 0);
    
    // Determine project type for color coding
    const lowerNeeds = needsStr.toLowerCase();
    const isDashboard = lowerNeeds.includes('dashboard') || lowerNeeds.includes('automação') || lowerNeeds.includes('plataforma');
    const isSite = lowerNeeds.includes('site') || lowerNeeds.includes('landing') || lowerNeeds.includes('loja') || lowerNeeds.includes('portfólio') || lowerNeeds.includes('ecommerce');
    
    // Choose theme colors
    const themeClass = isDashboard ? 'text-green-400' : (isSite ? 'text-sky-400' : 'text-platform-orange');
    const themeBorder = isDashboard ? 'border-green-500/20' : (isSite ? 'border-sky-500/20' : 'border-platform-orange/20');
    const borderLeftClass = isDashboard ? 'border-l-green-500/50' : (isSite ? 'border-l-sky-500/50' : 'border-l-platform-orange/50');
    
    // Improved parsing for Project Description
    let projectDescriptionLines: string[] = [];
    const projectTagIndex = lines.findIndex(l => l.includes('[PROJETO]') || l.includes('[EXTRAS]'));
    
    if (projectTagIndex !== -1) {
      // Everything after the tag is part of the description
      projectDescriptionLines = lines.slice(projectTagIndex + 1).map(l => l.trim());
      // The line with the tag might also have content
      const tagLineContent = lines[projectTagIndex].replace(/\[PROJETO\]|\[EXTRAS\]/g, '').trim();
      if (tagLineContent) projectDescriptionLines.unshift(tagLineContent);
    }
    
    const displayLines = projectTagIndex !== -1 ? lines.slice(0, projectTagIndex) : lines;
    const hasProjectDescription = projectDescriptionLines.length > 0;

    return (
      <div className="flex flex-col gap-1.5 py-1">
        {displayLines.map((line, idx) => {
          const [key, ...valueParts] = line.split(':');
          const value = valueParts.join(':').trim();
          
          if (key && value && valueParts.length > 0) {
            const cleanKey = key.replace('_', ' ').trim();
            const cleanValue = value.replace('_', ' ').trim();
            
            return (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#666] uppercase min-w-[70px]">{cleanKey}:</span>
                <Badge variant="outline" className={`text-[10px] py-0 h-4 bg-white/[0.02] border border-white/10 ${themeClass} font-bold`}>
                  {cleanValue}
                </Badge>
              </div>
            );
          }

          return <span key={idx} className="text-[11px] text-[#888]">{line}</span>;
        })}

        {hasProjectDescription && (
          <div className="mt-1">
            <button 
              onClick={() => setExpanded(!expanded)}
              className={`flex items-center gap-1.5 text-[10px] font-bold ${themeClass} hover:opacity-80 transition-opacity uppercase tracking-widest`}
            >
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {expanded ? "Ver Menos" : "Ver Descrição do Projeto"}
            </button>
            
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="overflow-hidden"
                  layout
                >
                  <div className={`mt-3 p-3 rounded-xl bg-white/[0.03] border ${themeBorder} ${borderLeftClass} border-l-2`}>
                    <span className={`text-[10px] font-bold ${themeClass} uppercase block mb-1`}>Descrição do Projeto:</span>
                    <p className="text-[11px] text-[#aaa] italic leading-relaxed whitespace-pre-wrap">
                      {projectDescriptionLines.join('\n')}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
            <Crown className="w-5 h-5 text-sky-400" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Painel Admin</h1>
            <p className="text-sm text-[#888]">Visão geral de todas as empresas na plataforma Vincere.</p>
            <p className="text-[9px] text-muted-foreground/40 mt-1 uppercase tracking-tighter">Sessão: {user?.email}</p>
          </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ['admin-orgs'] });
                queryClient.invalidateQueries({ queryKey: ['admin-all-customers'] });
                queryClient.invalidateQueries({ queryKey: ['admin-vi-leads'] });
                queryClient.invalidateQueries({ queryKey: ['admin-all-projects'] });
                toast({ title: "Atualizando dados...", description: "Buscando informações mais recentes do banco." });
              }}
              className="gap-2 border-white/10 hover:bg-white/5"
            >
              <TrendingUp className="w-4 h-4" />
              Sincronizar Dados
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Organizações", value: orgs.length, icon: Building2, bgCls: "bg-sky-500/10", textCls: "text-sky-400" },
          { label: "Total de Clientes", value: totalClients, icon: Users, bgCls: "bg-sky-500/10", textCls: "text-sky-400" },
          { label: "Clientes Ativos", value: totalActive, icon: TrendingUp, bgCls: "bg-blue-400/10", textCls: "text-blue-400" },
          { label: "Receita Global", value: formatCurrency(totalRevenue), icon: DollarSign, bgCls: "bg-sky-500/10", textCls: "text-sky-400" },
        ].map((met, i) => (
          <motion.div
            key={met.label}
            initial="hidden" animate="visible" variants={fadeUp} custom={i}
            className="p-5 rounded-2xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#888] font-medium">{met.label}</span>
              <div className={`w-8 h-8 rounded-lg ${met.bgCls} flex items-center justify-center`}>
                <met.icon className={`w-4 h-4 ${met.textCls}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {typeof met.value === "number" ? met.value.toLocaleString("pt-BR") : met.value}
            </p>
            <p className="text-[10px] text-[#666] mt-1">dados em tempo real</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial="hidden" animate="visible" variants={fadeUp} custom={4}
        className="p-5 rounded-2xl bg-card border border-border mb-8 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold text-foreground">📥 {totalLeads} Leads capturados</p>
            <p className="text-xs text-[#888] mt-1">Leads coletados pela Vi e formulários de todas as empresas</p>
            {viLeads.length === 0 && (
              <p className="text-[10px] text-amber-500/60 mt-2 font-medium italic">
                ℹ️ Nenhum lead direto encontrado na tabela `vi_leads`. Verifique se há filtros ativos ou restrições de banco.
              </p>
            )}
          </div>
        </div>

        {viLeads.length > 0 && (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-white/5 bg-white/[0.01]">
                  <th className="px-6 py-4 text-[10px] font-bold text-[#666] uppercase tracking-widest">Nome / Empresa</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#666] uppercase tracking-widest">Contato</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#666] uppercase tracking-widest">Configuração do Lead</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#666] uppercase tracking-widest text-center">Data</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#666] uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {viLeads.map((l) => (
                  <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-sm tracking-tight">{l.name}</span>
                        {l.company && <span className="text-[10px] text-sky-400 font-medium uppercase tracking-wider">{l.company}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-[#888] text-xs">
                        <span>{l.email}</span>
                        <span>{l.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <NeedsFormatter needsStr={l.needs} />
                    </td>
                    <td className="px-6 py-4 text-center text-xs text-[#666]">
                      {new Date(l.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-xl border border-border hover:border-red-500/20"
                          onClick={() => handleDeleteLead(l.id)}
                          title="Excluir Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <motion.div
        initial="hidden" animate="visible" variants={fadeUp} custom={5}
        className="mb-8 rounded-2xl bg-card border border-border overflow-hidden shadow-2xl"
      >
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Folder className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="text-base font-bold text-foreground tracking-tight uppercase">Projetos Ativos (Global)</h3>
          </div>
          <Button variant="link" className="text-[10px] font-bold text-[#888] hover:text-white tracking-widest">
            GERENCIAR
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-white/5 bg-white/[0.01]">
                <th className="px-6 py-4 text-[10px] font-bold text-[#666] uppercase tracking-widest">Projeto / Empresa</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#666] uppercase tracking-widest text-center">Progresso</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#666] uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projectsLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-[#444] animate-pulse">Carregando projetos globais...</td>
                </tr>
              ) : projectsWithOrg.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-[#444] text-xs">
                    Nenhum projeto ativo em toda a plataforma.
                  </td>
                </tr>
              ) : (
                projectsWithOrg.map((proj) => {
                  const isDone = proj.status === 'CONCLUÍDO';
                  
                  // Dynamic progress calculation based on dates
                  let progress = 0;
                  if (isDone) {
                    progress = 100;
                  } else if (proj.start_date && proj.end_date) {
                    const start = new Date(proj.start_date).getTime();
                    const end = new Date(proj.end_date).getTime();
                    const now = new Date().getTime();
                    
                    if (now > start) {
                      const total = end - start;
                      const elapsed = now - start;
                      progress = Math.min(Math.floor((elapsed / total) * 100), 95);
                    } else {
                      progress = 5;
                    }
                  } else {
                    progress = proj.status === 'EM ANDAMENTO' ? 45 : 15;
                  }

                  const colorClass = isDone ? "bg-emerald-500" : "bg-sky-500";
                  const badgeClass = isDone ? "bg-emerald-500/10 text-emerald-500" : "bg-sky-500/10 text-sky-400";
                  
                  return (
                    <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-sm tracking-tight">{proj.title}</span>
                          <span className="text-[10px] text-sky-400 font-medium uppercase tracking-wider mt-0.5">
                            {proj.orgName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 min-w-[200px]">
                        <div className="flex flex-col gap-2 max-w-[240px] mx-auto">
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full rounded-full ${colorClass}`}
                            />
                          </div>
                          <div className="flex justify-between items-center px-0.5">
                            <span className="text-[8px] text-[#444] font-bold uppercase">Progresso</span>
                            <span className="text-[8px] text-[#666] font-mono">{progress}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Badge className={`rounded-full px-3 py-1 font-black text-[8px] border-none ${badgeClass}`}>
                          {proj.status.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial="hidden" animate="visible" variants={fadeUp} custom={6}
        className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm"
      >
        <div className="p-5 border-b border-white/5">
          <h3 className="text-base font-semibold text-white">Organizações Assinantes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Empresa</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Dono</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Plano</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Clientes</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Receita</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Status</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Criada em</th>
              </tr>
            </thead>
            <tbody>
              {orgsLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-[#888]">Carregando organizações...</td>
                </tr>
              ) : orgStats.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-[#888]">
                    Nenhuma organização criada ainda. Elas aparecerão automaticamente quando alguém assinar.
                  </td>
                </tr>
              ) : (
                orgStats.map((org, i) => (
                  <motion.tr
                    key={org.id}
                    initial="hidden" animate="visible" variants={fadeUp} custom={i}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-sky-400" />
                        </div>
                        <span className="text-white font-medium">{org.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#888]">{org.owner_email}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium text-sky-400 bg-sky-500/10 capitalize">
                        {org.plan}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-white font-medium">{org.customerCount}</td>
                    <td className="px-5 py-3.5 text-white font-medium">{formatCurrency(org.revenue)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        org.status === 'active'
                          ? 'text-sky-400 bg-sky-500/10'
                          : 'text-[#888] bg-white/5'
                      }`}>
                        {org.status === 'active' ? 'Ativa' : org.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#888] text-xs">
                      {new Date(org.created_at).toLocaleDateString("pt-BR")}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
