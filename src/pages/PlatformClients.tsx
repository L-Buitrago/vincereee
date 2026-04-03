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

  const deleteClient = async (client: Customer) => {
    const confirmed = window.confirm(`Tem certeza que quer remover "${client.name}"?`);
    if (!confirmed) return;

    // Use originTable if it exists (from merged leads), otherwise default to 'customers'
    const table = (client as any).originTable || 'customers';
    
    try {
      // 1. Delete from target table
      const { error } = await supabase
        .from(table as any)
        .delete()
        .eq('id', client.id);

      if (error) throw error;

      // 2. If it's a customer record, also attempt to delete from vi_leads to prevent "resurrection"
      if (table === 'customers' && client.email) {
        await supabase
          .from('vi_leads' as any)
          .delete()
          .eq('email', client.email);
      }

      toast({ title: "✅ Registro removido", description: `${client.name} foi removido.` });
      
      // Invalidate all related queries to ensure UI sync
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-customers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-vi-leads'] });
      
      if (selected?.id === client.id) setSelected(null);
    } catch (error: any) {
      console.error("Erro ao remover:", error);
      toast({ title: "Erro ao remover", description: error.message, variant: "destructive" });
    }
  };

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

  const { data: clients = [], isLoading } = useQuery({
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
      
      // If admin, fetch vi_leads and merge into customers if they don't exist as customers yet
      if (isAdmin) {
        const { data: viLeadsData, error: viError } = await supabase.from('vi_leads' as any).select('*');
        const viLeads = (viLeadsData as any[]) || [];
        
        if (!viError && viLeads) {
          // Add 'needs' to existing customers matching by email
          const enriched = customersData.map(c => {
            const lead = viLeads.find((l: any) => l.email === c.email);
            return lead ? { ...c, needs: lead.needs } : c;
          });
          
          // Also add leads that aren't in customers table yet
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
              originTable: 'vi_leads' // Explicitly mark as a lead from vi_leads
            }));
            
          return [...enriched, ...onlyLeads] as any[] as Customer[];
        }
      }
      
      return customersData;
    }
  });

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

  const filtered = clients.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p className="text-sm text-[#888] mt-1">{filtered.length} clientes encontrados</p>
        </div>
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <input type="file" accept=".csv" className="hidden" onChange={importCSV} />
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm text-[#ccc] hover:bg-white/5 transition-colors">
              <Upload className="w-4 h-4" /> Importar CSV
            </div>
          </label>
          <Button
            className="bg-sky-500 hover:bg-sky-600 text-white font-semibold gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" /> Novo Cliente
          </Button>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Novo Cliente</h2>
              <button onClick={() => setShowAddModal(false)} className="text-[#888] hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#888] mb-1 block">Nome *</label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nome do cliente" className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <label className="text-xs text-[#888] mb-1 block">Email *</label>
                <Input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="email@cliente.com" className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <label className="text-xs text-[#888] mb-1 block">Telefone</label>
                <Input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="(11) 99999-9999" className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <label className="text-xs text-[#888] mb-1 block">Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm">
                  <option value="Lead">Lead</option>
                  <option value="Negociação">Negociação</option>
                  <option value="Cliente Ativo">Cliente Ativo</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#888] mb-1 block">Data de Vencimento</label>
                <Input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} className="bg-white/5 border-white/10 text-white" />
              </div>
              <Button
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold"
                onClick={addClient}
                disabled={isAdding}
              >
                {isAdding ? "Salvando..." : "Salvar Cliente"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-[#111] border-white/10 text-white placeholder:text-[#666] h-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          {["todos", "Cliente Ativo", "Lead", "Negociação", "Cancelado"].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                statusFilter === s ? "bg-sky-500/10 text-sky-400" : "text-[#888] hover:text-white hover:bg-white/5"
              }`}
            >
              {s === "todos" ? "Todos" : s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-[#111] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Cliente</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Email</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Produto</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Data</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Vencimento</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Valor</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Status</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-[#888]">Carregando clientes...</td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-[#888]">Nenhum cliente cadastrado no banco de dados.</td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-[#888]">Nenhum cliente encontrado com estes filtros.</td>
                </tr>
              ) : (
                paginated.map((c) => {
                  const sc = statusConfig[c.status || 'Cliente Ativo'] || statusConfig['Cliente Ativo'];
                  return (
                    <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-medium text-[#ccc]">
                            {c.name.substring(0,2).toUpperCase()}
                          </div>
                          <span className="text-white font-medium">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[#888]">{c.email}</td>
                      <td className="px-5 py-3.5 text-[#ccc]">{c.status}</td>
                      <td className="px-5 py-3.5 text-[#888] text-xs">
                        {new Date(c.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-5 py-3.5">
                        {c.due_date ? (() => {
                          const isOverdue = new Date(c.due_date) < new Date() && c.status === 'Cliente Ativo';
                          return (
                            <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-400 font-semibold' : 'text-[#888]'}`}>
                              {isOverdue && <AlertTriangle className="w-3 h-3" />}
                              {new Date(c.due_date).toLocaleDateString("pt-BR")}
                            </span>
                          );
                        })() : <span className="text-xs text-[#555]">—</span>}
                      </td>
                      <td className="px-5 py-3.5 text-white font-medium">{formatCurrency(c.total_spent || 0)}</td>
                      <td className="px-5 py-3.5">
                        <select
                          value={c.status}
                          onChange={(e) => updateStatus(c, e.target.value)}
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border-0 cursor-pointer outline-none ${sc.cls}`}
                          style={{ WebkitAppearance: 'none', appearance: 'none', paddingRight: '8px' }}
                        >
                          <option value="Lead">Lead</option>
                          <option value="Negociação">Negociação</option>
                          <option value="Cliente Ativo">Ativo</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setSelected(c)} className="p-1.5 rounded-lg hover:bg-white/5 text-[#888] hover:text-white transition-colors">
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
                            className="p-1.5 rounded-lg hover:bg-white/5 text-[#888] hover:text-white transition-colors"
                            title="Enviar WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteClient(c)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#888] hover:text-red-400 transition-colors"
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
          <div className="flex items-center justify-center gap-2 p-4 border-t border-white/5">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                  page === i + 1 ? "bg-sky-500/10 text-sky-400" : "text-[#888] hover:bg-white/5"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-end"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="h-full w-full max-w-md bg-[#111] border-l border-white/5 p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Detalhes do Cliente</h2>
              <button onClick={() => setSelected(null)} className="text-[#888] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 text-lg font-bold">
                  {selected.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">{selected.name}</p>
                  <p className="text-sm text-[#888]">{selected.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/5">
                  <p className="text-[10px] text-[#888] uppercase mb-1">Telefone</p>
                  <p className="text-sm text-white">{selected.phone || "—"}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <p className="text-[10px] text-[#888] uppercase mb-1">Gasto Total</p>
                  <p className="text-sm text-white font-medium">{formatCurrency(selected.total_spent || 0)}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <p className="text-[10px] text-[#888] uppercase mb-1">Status</p>
                  <p className="text-sm text-sky-400 font-medium">{selected.status}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <p className="text-[10px] text-[#888] uppercase mb-1">Desde</p>
                  <p className="text-sm text-white">{new Date(selected.created_at).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>

              {/* Added lead needs information */}
              {(selected as any).needs && (
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/10">
                  <p className="text-[10px] text-sky-400 uppercase font-bold mb-3 tracking-widest">Necessidades Identificadas (Vi)</p>
                  <NeedsFormatter needsStr={(selected as any).needs} />
                </div>
              )}

              <div className="pt-4 flex gap-2">
                <Button
                  className="flex-1 bg-sky-500 hover:bg-sky-600 text-white gap-2"
                  onClick={() => {
                    window.open(`https://wa.me/55${selected.phone?.replace(/\D/g, '')}`, '_blank');
                  }}
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-white/10 text-white hover:bg-white/5 bg-transparent gap-2"
                  onClick={() => {
                    window.open(`mailto:${selected.email}`, '_blank');
                  }}
                >
                  <Send className="w-4 h-4" /> Email
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
