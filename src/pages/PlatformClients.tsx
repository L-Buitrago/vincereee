import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, MessageCircle, Eye, Trash2, Send, Plus, Upload, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, type Client } from "@/data/platformMockData";
import { toast } from "@/hooks/use-toast";
import PlatformHeader from "@/components/platform/PlatformHeader";

const statusConfig: Record<string, { label: string; cls: string; pulse?: boolean }> = {
  "Cliente Ativo": { label: "Ativo", cls: "text-sky-400 bg-sky-500/10" },
  "Lead": { label: "Lead", cls: "text-platform-orange bg-platform-orange/10 animate-pulse", pulse: true },
  "Negociação": { label: "Negociação", cls: "text-blue-400 bg-blue-400/10 animate-pulse", pulse: true },
  "Cancelado": { label: "Cancelado", cls: "text-[#888] bg-white/5" },
};

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  total_spent: number;
  last_order_date: string | null;
  due_date: string | null;
  created_at: string;
};

export default function PlatformClients() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const { orgId, isAdmin } = useOrganization();
  const queryClient = useQueryClient();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newStatus, setNewStatus] = useState("Lead");
  const [newDueDate, setNewDueDate] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const addClient = async () => {
    if (!newName || !newEmail) {
      toast({ title: "Preencha nome e email", variant: "destructive" });
      return;
    }
    setIsAdding(true);
    const { error } = await supabase.from('customers' as any).insert({
      name: newName,
      email: newEmail,
      phone: newPhone || null,
      status: newStatus,
      due_date: newDueDate || null,
      org_id: orgId || null,
    });
    setIsAdding(false);
    if (error) {
      toast({ title: "Erro ao adicionar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Cliente adicionado!", description: `${newName} foi cadastrado.` });
      setNewName(""); setNewEmail(""); setNewPhone(""); setNewStatus("Lead"); setNewDueDate("");
      setShowAddModal(false);
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-customers'] });
    }
  };

  const importCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) {
      toast({ title: "Arquivo vazio ou inválido", variant: "destructive" });
      return;
    }
    const rows = lines.slice(1).map(line => {
      const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      return {
        name: cols[0] || 'Sem nome',
        email: cols[1] || `import_${Date.now()}@temp.csv`,
        phone: cols[2] || null,
        status: cols[3] || 'Lead',
        due_date: cols[4] || null,
        org_id: orgId || null,
      };
    });
    const { error } = await supabase.from('customers' as any).insert(rows);
    if (error) {
      toast({ title: "Erro no import", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `✅ ${rows.length} clientes importados!` });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-customers'] });
    }
    e.target.value = '';
  };

  const { data: clients = [], isLoading, refetch } = useQuery({
    queryKey: ['customers', orgId, isAdmin],
    queryFn: async () => {
      let query = supabase
        .from('customers' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (!isAdmin && orgId) {
        query = query.eq('org_id', orgId);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      const customersData = data as any[] as Customer[];
      
      if (isAdmin) {
        const { data: viLeadsData, error: viError } = await supabase.from('vi_leads' as any).select('*');
        const viLeads = (viLeadsData as any[]) || [];
        
        if (!viError && viLeads) {
          const enriched = customersData.map(c => {
            const lead = viLeads.find((l: any) => l.email === c.email);
            return lead ? { ...c, needs: lead.needs } : c;
          });
          
          const existingEmails = new Set(enriched.map(c => c.email));
          const onlyLeads = viLeads
            .filter((l: any) => !existingEmails.has(l.email))
            .map((l: any) => ({
              id: l.id,
              name: l.name,
              email: l.email,
              phone: l.phone,
              status: 'Lead',
              total_spent: 0,
              created_at: l.created_at,
              needs: l.needs,
              originTable: 'vi_leads'
            }));
            
          return [...enriched, ...onlyLeads] as any[] as Customer[];
        }
      }
      return customersData;
    }
  });

  const updateStatus = async (client: Customer, newStatus: string) => {
    const { error } = await supabase
      .from('customers' as any)
      .update({ status: newStatus })
      .eq('id', client.id);

    if (error) {
      toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Status atualizado", description: `${client.name} agora é "${newStatus}"` });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-customers'] });
    }
  };

  const deleteClient = async (client: Customer) => {
    console.log("URGENT: Deleting client", client.name, "(Email:", client.email, ")");
    const confirmed = window.confirm(`Deseja realmente REMOVER PERMANENTEMENTE "${client.name}"?`);
    if (!confirmed) return;

    try {
      toast({ title: "Removendo...", description: "Limpando registros em todas as bases." });
      
      const primaryTable = (client as any).originTable || 'customers';
      const email = client.email;
      const id = client.id;

      // DELETE 1: By ID in the primary table
      const p1 = supabase.from(primaryTable as any).delete().eq('id', id);
      
      // DELETE 2: By Email in vi_leads
      const p2 = email ? supabase.from('vi_leads' as any).delete().eq('email', email) : Promise.resolve({ error: null });
      
      // DELETE 3: By Email in customers
      const p3 = email ? supabase.from('customers' as any).delete().eq('email', email) : Promise.resolve({ error: null });
      
      const [r1, r2, r3] = await Promise.all([p1, p2, p3]);
      
      console.log("Delete results:", { primary: r1, vi: r2, customers: r3 });

      // ALERTA DE DIAGNÓSTICO PARA O USUÁRIO
      const summary = `
        Resultado da Exclusão:
        - Tabela Principal: ${r1.error ? 'ERRO: ' + r1.error.message : 'OK (Status: ' + r1.status + ')'}
        - Tabela VI Leads: ${r2.error ? 'ERRO: ' + r2.error.message : 'OK'}
        - Tabela Clientes: ${r3.error ? 'ERRO: ' + r3.error.message : 'OK'}
      `;
      window.alert(summary);

      if (r1.error) throw r1.error;

      // Se nada foi deletado (count null ou 0 dependendo da config), pode ser RLS
      toast({ title: "✅ Registro removido", description: `${client.name} foi removido com sucesso.` });
      
      // FORCE UI UPDATE
      queryClient.removeQueries({ queryKey: ['customers'] });
      queryClient.removeQueries({ queryKey: ['dashboard-customers'] });
      
      await refetch();
      
      if (selected?.id === client.id) setSelected(null);
    } catch (error: any) {
      console.error("ERRO CRÍTICO NA EXCLUSÃO:", error);
      toast({ 
        title: "Erro na exclusão", 
        description: "Verifique se você aplicou as novas políticas de SQL no Supabase.", 
        variant: "destructive" 
      });
    }
  };

  const NeedsFormatter = ({ needsStr }: { needsStr: string }) => {
    if (!needsStr) return <span className="text-muted-foreground/40">Nenhum detalhe informado.</span>;
    const [expanded, setExpanded] = useState(false);
    const lines = needsStr.split('\n').filter(l => l.trim().length > 0);
    const lowerNeeds = needsStr.toLowerCase();
    const isDashboard = lowerNeeds.includes('dashboard') || lowerNeeds.includes('automação') || lowerNeeds.includes('plataforma');
    const isSite = lowerNeeds.includes('site') || lowerNeeds.includes('landing') || lowerNeeds.includes('loja') || lowerNeeds.includes('portfólio') || lowerNeeds.includes('ecommerce');
    const themeClass = isDashboard ? 'text-green-400' : (isSite ? 'text-sky-400' : 'text-amber-400');
    const themeBorder = isDashboard ? 'border-green-500/20' : (isSite ? 'border-sky-500/20' : 'border-amber-500/20');
    const borderLeftClass = isDashboard ? 'border-l-green-500/50' : (isSite ? 'border-l-sky-500/50' : 'border-l-amber-500/50');
    
    let projectDescriptionLines: string[] = [];
    const projectTagIndex = lines.findIndex(l => l.includes('[PROJETO]') || l.includes('[EXTRAS]'));
    if (projectTagIndex !== -1) {
      projectDescriptionLines = lines.slice(projectTagIndex + 1).map(l => l.trim());
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
                <span className="text-[10px] font-bold text-muted-foreground/50 uppercase min-w-[70px]">{cleanKey}:</span>
                <Badge variant="outline" className={`text-[10px] py-0 h-4 bg-background/50 border border-border ${themeClass} font-bold`}>
                  {cleanValue}
                </Badge>
              </div>
            );
          }
          return <span key={idx} className="text-[11px] text-muted-foreground/60">{line}</span>;
        })}
        {hasProjectDescription && (
          <div className="mt-1">
            <button onClick={() => setExpanded(!expanded)} className={`flex items-center gap-1.5 text-[10px] font-bold ${themeClass} hover:opacity-80 transition-opacity uppercase tracking-widest`}>
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {expanded ? "Ver Menos" : "Ver Descrição do Projeto"}
            </button>
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden" layout>
                  <div className={`mt-3 p-3 rounded-xl bg-background/50 border ${themeBorder} ${borderLeftClass} border-l-2`}>
                    <span className={`text-[10px] font-bold ${themeClass} uppercase block mb-1`}>Descrição do Projeto:</span>
                    <p className="text-[11px] text-muted-foreground/80 italic leading-relaxed whitespace-pre-wrap">{projectDescriptionLines.join('\n')}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  };

  const filtered = clients.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="flex flex-col h-full bg-background">
      <PlatformHeader title="Clientes & Leads" searchQuery={search} setSearchQuery={setSearch} />

      <div className="flex-1 p-8 space-y-6 overflow-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Clientes</h1>
            <p className="text-sm text-muted-foreground font-medium mt-1">{filtered.length} clientes encontrados</p>
          </div>
          <div className="flex gap-2">
            <label className="cursor-pointer">
              <input type="file" accept=".csv" className="hidden" onChange={importCSV} />
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all shadow-sm">
                <Upload className="w-4 h-4" /> Importar CSV
              </div>
            </label>
            <Button className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 rounded-xl shadow-lg shadow-sky-500/20 gap-2 transition-all active:scale-95" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4" /> Novo Cliente
            </Button>
          </div>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-card border border-border rounded-3xl p-8 w-full max-w-md shadow-2xl relative" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-foreground">Novo Cliente</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Nome *</label>
                  <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nome do cliente" className="bg-muted/50 border-border rounded-xl h-11" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Email *</label>
                  <Input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="email@cliente.com" className="bg-muted/50 border-border rounded-xl h-11" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Telefone</label>
                  <Input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="(11) 99999-9999" className="bg-muted/50 border-border rounded-xl h-11" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Status</label>
                    <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border text-foreground text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500/20">
                      <option value="Lead">Lead</option>
                      <option value="Negociação">Negociação</option>
                      <option value="Cliente Ativo">Ativo</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Vencimento</label>
                    <Input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} className="bg-muted/50 border-border rounded-xl h-11" />
                  </div>
                </div>
                <Button className="w-full h-12 mt-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all active:scale-95" onClick={addClient} disabled={isAdding}>
                  {isAdding ? "Salvando..." : "Salvar Cliente"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-2xl w-fit">
          {["todos", "Cliente Ativo", "Lead", "Negociação", "Cancelado"].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === s ? "bg-card text-sky-500 shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "todos" ? "Todos" : s}
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-xs text-muted-foreground font-bold px-6 py-5 uppercase tracking-widest">Cliente</th>
                  <th className="text-left text-xs text-muted-foreground font-bold px-6 py-5 uppercase tracking-widest">Email</th>
                  <th className="text-left text-xs text-muted-foreground font-bold px-6 py-5 uppercase tracking-widest">Produto</th>
                  <th className="text-left text-xs text-muted-foreground font-bold px-6 py-5 uppercase tracking-widest">Data</th>
                  <th className="text-left text-xs text-muted-foreground font-bold px-6 py-5 uppercase tracking-widest">Vencimento</th>
                  <th className="text-left text-xs text-muted-foreground font-bold px-6 py-5 uppercase tracking-widest">Valor</th>
                  <th className="text-left text-xs text-muted-foreground font-bold px-6 py-5 uppercase tracking-widest">Status</th>
                  <th className="text-left text-xs text-muted-foreground font-bold px-6 py-5 uppercase tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
                        <span className="font-bold text-sm tracking-widest uppercase">Carregando dados...</span>
                      </div>
                    </td>
                  </tr>
                ) : clients.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Nenhum cliente cadastrado.</td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Nenhum filtro corresponde.</td>
                  </tr>
                ) : (
                  paginated.map((c) => {
                    const sc = statusConfig[c.status || 'Cliente Ativo'] || statusConfig['Cliente Ativo'];
                    return (
                      <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:border-sky-500/20 group-hover:bg-sky-500/5 transition-all">
                              {c.name.substring(0,2).toUpperCase()}
                            </div>
                            <span className="text-foreground font-bold">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-muted-foreground/80 font-medium">{c.email}</td>
                        <td className="px-6 py-5">
                          <Badge variant="outline" className="bg-muted/50 border-border text-muted-foreground font-bold text-[10px] uppercase tracking-widest px-2 py-0.5">
                            {c.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-5 text-muted-foreground/60 text-xs font-bold">
                          {new Date(c.created_at).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="px-6 py-5">
                          {c.due_date ? (() => {
                            const isOverdue = new Date(c.due_date) < new Date() && c.status === 'Cliente Ativo';
                            return (
                              <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${isOverdue ? 'text-red-500' : 'text-muted-foreground/50'}`}>
                                {isOverdue && <AlertTriangle className="w-3.5 h-3.5" />}
                                {new Date(c.due_date).toLocaleDateString("pt-BR")}
                              </span>
                            );
                          })() : <span className="text-xs text-muted-foreground/20">—</span>}
                        </td>
                        <td className="px-6 py-5 text-foreground font-black tracking-tight">{formatCurrency(c.total_spent || 0)}</td>
                        <td className="px-6 py-5">
                          <select
                            value={c.status}
                            onChange={(e) => updateStatus(c, e.target.value)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border-0 cursor-pointer outline-none transition-all shadow-sm hover:shadow-md ${sc.cls}`}
                            style={{ WebkitAppearance: 'none', appearance: 'none' }}
                          >
                            <option value="Lead">Lead</option>
                            <option value="Negociação">Negociação</option>
                            <option value="Cliente Ativo">Ativo</option>
                            <option value="Cancelado">Cancelado</option>
                          </select>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setSelected(c)} className="p-2.5 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all shadow-sm active:scale-90" title="Ver detalhes">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (c.phone) {
                                  window.open(`https://wa.me/55${c.phone.replace(/\D/g, '')}`, '_blank');
                                } else {
                                  toast({ title: "Sem número", description: "Este cliente não possui telefone cadastrado.", variant: "destructive" });
                                }
                              }}
                              className="p-2.5 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all shadow-sm active:scale-90"
                              title="Enviar WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteClient(c)}
                              className="p-2.5 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all shadow-sm active:scale-90"
                              title="Remover cliente"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-2 p-6 border-t border-border bg-muted/5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Página {page} de {totalPages}</span>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all shadow-sm ${
                      page === i + 1 ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30" : "bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-end" onClick={() => setSelected(null)}>
          <motion.div initial={{ x: 400 }} animate={{ x: 0 }} transition={{ type: "spring", stiffness: 300, damping: 35 }} className="h-full w-full max-w-xl bg-card border-l border-border p-8 overflow-y-auto shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-foreground">Detalhes do Cliente</h2>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground border border-border/50"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-6 p-6 rounded-3xl bg-muted/30 border border-border shadow-inner">
                <div className="w-20 h-20 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-sky-500/30">
                  {selected.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-2xl font-black text-foreground tracking-tighter">{selected.name}</p>
                  <p className="text-sm font-medium text-muted-foreground">{selected.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-sky-500/10 text-sky-500 border-none font-black text-[10px] uppercase tracking-widest px-3">{selected.status}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-muted/20 border border-border">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Telefone</p>
                  <p className="text-sm font-bold text-foreground">{selected.phone || "—"}</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/20 border border-border">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Gasto Total</p>
                  <p className="text-sm font-black text-foreground">{formatCurrency(selected.total_spent || 0)}</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/20 border border-border">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Membro desde</p>
                  <p className="text-sm font-bold text-foreground">{new Date(selected.created_at).toLocaleDateString("pt-BR")}</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/20 border border-border">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Vencimento</p>
                  <p className="text-sm font-bold text-foreground">{selected.due_date ? new Date(selected.due_date).toLocaleDateString("pt-BR") : "—"}</p>
                </div>
              </div>

              {(selected as any).needs && (
                <div className="p-6 rounded-3xl bg-sky-500/[0.03] border border-sky-500/10 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-sky-500/30" />
                  <p className="text-[10px] text-sky-500 uppercase font-black mb-4 tracking-[0.2em]">Briefing do Projeto</p>
                  <NeedsFormatter needsStr={(selected as any).needs} />
                </div>
              )}

              <div className="pt-6 flex gap-3">
                <Button className="flex-1 h-14 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl shadow-xl shadow-sky-500/20 gap-3 transition-all active:scale-95" onClick={() => window.open(`https://wa.me/55${selected.phone?.replace(/\D/g, '')}`, '_blank')}>
                  <MessageCircle className="w-5 h-5" /> WhatsApp
                </Button>
                <Button variant="outline" className="flex-1 h-14 border-border rounded-2xl text-foreground font-bold hover:bg-muted bg-transparent gap-3 transition-all active:scale-95" onClick={() => window.open(`mailto:${selected.email}`, '_blank')}>
                  <Send className="w-5 h-5" /> Email
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
