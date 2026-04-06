import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, FileText, Wallet, Truck, Clock, 
  Search, Bell, Folder, MoreHorizontal, ArrowUpRight,
  CheckCircle2, Users, DollarSign, PieChart as PieChartIcon,
  Calendar as CalendarIcon
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { format, subDays, startOfWeek, startOfMonth, startOfYear, isAfter, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import NotificationBell from "@/components/platform/NotificationBell";
import PlatformHeader from "@/components/platform/PlatformHeader";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4 }
  }),
};

const periods = ["Ontem", "Hoje", "Semana", "Mês", "Ano", "Todos"];

const statusConfig: Record<string, { label: string; cls: string }> = {
  "Cliente Ativo": { label: "Ativo", cls: "bg-emerald-500/10 text-emerald-500" },
  "Lead": { label: "Lead", cls: "bg-amber-500/10 text-amber-500" },
  "Negociação": { label: "Negociação", cls: "bg-blue-500/10 text-blue-500" },
  "Cancelado": { label: "Cancelado", cls: "bg-muted text-muted-foreground/40" },
};

type Customer = {
  id: string;
  name: string;
  email: string;
  status: string;
  total_spent: number;
  created_at: string;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover px-4 py-2 rounded-xl shadow-2xl border border-border relative">
        <p className="text-popover-foreground font-bold text-sm">
          {formatCurrency(payload[0].value)}
        </p>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-popover rotate-45 border-r border-b border-border" />
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, icon: Icon, bgColor }: any) => (
  <Card className={`overflow-hidden border-none relative group transition-all duration-500 hover:translate-y-[-4px] ${bgColor} text-white shadow-xl`}>
    <CardContent className="p-6 relative z-10">
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/20 transition-transform group-hover:scale-110 duration-500">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
            <p className="text-sm font-medium text-white/80">{title}</p>
          </div>
        </div>
        <div className="p-1 rounded-md hover:bg-white/10 cursor-pointer">
          <MoreHorizontal className="w-4 h-4 text-white/60" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function PlatformDashboard() {
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState("Todos");
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const { orgId, isAdmin, org } = useOrganization();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      setShowSuccess(true);
      toast({
        title: "🎉 Pagamento confirmado!",
        description: "Sua assinatura foi ativada com sucesso.",
      });
      searchParams.delete('session_id');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const { data: allCustomers = [], isLoading } = useQuery({
    queryKey: ['dashboard-customers', orgId, isAdmin],
    queryFn: async () => {
      let query = supabase.from('customer_intelligence_view' as any).select('*').order('created_at', { ascending: false });
      if (!isAdmin && orgId) query = query.eq('org_id', orgId);
      const { data, error } = await query;
      if (error) throw error;
      
      // If admin, fetch and merge vi_leads
      if (isAdmin) {
        const { data: viLeads, error: viError } = await supabase.from('vi_leads' as any).select('*');
        if (!viError && viLeads) {
          const mergedVi = viLeads.map((l: any) => ({
            id: l.id,
            name: l.name,
            email: l.email,
            phone: l.phone,
            status: 'Lead', // Vi leads are always Leads
            total_spent: 0,
            created_at: l.created_at,
            needs: l.needs
          }));
          return [...(data || []), ...mergedVi] as any[] as Customer[];
        }
      }
      
      return data as any[] as Customer[];
    }
  });
  
  const { data: transactions = [] } = useQuery({
    queryKey: ['dashboard-transactions', orgId, isAdmin],
    queryFn: async () => {
      let query = supabase.from('transactions').select('*');
      if (!isAdmin && orgId) query = query.eq('org_id', orgId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });
  
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['dashboard-projects', orgId, isAdmin, user?.id],
    queryFn: async () => {
      let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (!isAdmin && user?.id) query = query.eq('user_id', user.id);
      const { data, error } = await query;
      if (error) throw error;
      return data as any[];
    }
  });

  const customers = useMemo(() => {
    let filtered = allCustomers;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
      );
    }
    if (activePeriod !== "Todos") {
      const now = new Date();
      let limitDate = new Date(0);
      if (activePeriod === "Ontem") limitDate = startOfDay(subDays(now, 1));
      else if (activePeriod === "Hoje") limitDate = startOfDay(now);
      else if (activePeriod === "Semana") limitDate = startOfWeek(now, { weekStartsOn: 1 });
      else if (activePeriod === "Mês") limitDate = startOfMonth(now);
      else if (activePeriod === "Ano") limitDate = startOfYear(now);
      filtered = filtered.filter(c => isAfter(new Date(c.created_at), limitDate));
    }
    return filtered;
  }, [allCustomers, searchQuery, activePeriod]);

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    if (activePeriod !== "Todos") {
      const now = new Date();
      let limitDate = new Date(0);
      if (activePeriod === "Ontem") limitDate = startOfDay(subDays(now, 1));
      else if (activePeriod === "Hoje") limitDate = startOfDay(now);
      else if (activePeriod === "Semana") limitDate = startOfWeek(now, { weekStartsOn: 1 });
      else if (activePeriod === "Mês") limitDate = startOfMonth(now);
      else if (activePeriod === "Ano") limitDate = startOfYear(now);
      filtered = filtered.filter(t => isAfter(new Date(t.date), limitDate));
    }
    return filtered;
  }, [transactions, activePeriod]);

  const totalClientes = customers.filter(c => c.status === 'Cliente Ativo').length;
  
  // Update: Using transactions for real-time revenue instead of static customer fields
  const totalReceita = filteredTransactions
    .filter(t => t.status === 'aprovado' || !t.status) // Include approved or untracked status
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalProjetosAtivos = projects.filter(p => p.status === 'EM ANDAMENTO').length;
  
  // Churn calculation
  const totalCancelados = allCustomers.filter(c => c.status === 'Cancelado').length;
  const churnRate = allCustomers.length > 0 ? (totalCancelados / allCustomers.length) * 100 : 0;

  const totalTransactionsCount = filteredTransactions.length;
  const approvedTransactions = filteredTransactions.filter(t => t.status === 'aprovado').length;
  const approvalRate = totalTransactionsCount > 0 ? (approvedTransactions / totalTransactionsCount) * 100 : 0;

  const paymentMethods = useMemo(() => {
    if (filteredTransactions.length === 0) {
      return [];
    }

    const methods: Record<string, { count: number; approved: number }> = {};
    filteredTransactions.forEach(t => {
      const gateway = t.gateway || 'Outros';
      if (!methods[gateway]) methods[gateway] = { count: 0, approved: 0 };
      methods[gateway].count++;
      if (t.status === 'aprovado') methods[gateway].approved++;
    });
    const totalCount = filteredTransactions.length;
    return Object.entries(methods).map(([name, stats]) => ({
      name,
      value: Math.round((stats.count / totalCount) * 100),
      rate: (stats.approved / stats.count) * 100,
      color: name === 'Stripe' ? '#7C3AED' : name === 'Cartão' ? '#7C3AED' : name === 'Pix' ? '#10B981' : '#F59E0B'
    }));
  }, [filteredTransactions]);

  const chartData = useMemo(() => {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const byMonth: Record<string, number> = {};
    customers.forEach(c => {
      const month = months[new Date(c.created_at).getMonth()];
      byMonth[month] = (byMonth[month] || 0) + (c.total_spent || 0);
    });
    return months.map(name => ({ name, thisYear: byMonth[name] || 0, lastYear: (byMonth[name] || 0) * 0.7 }));
  }, [customers]);

  const hasThisYearData = useMemo(() => chartData.some(d => d.thisYear > 0), [chartData]);
  const hasLastYearData = useMemo(() => chartData.some(d => d.lastYear > 0), [chartData]);

  const recentCustomers = useMemo(() => customers.slice(0, 5), [customers]);
  const recentProjects = useMemo(() => projects.slice(0, 3), [projects]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-500">
      {showSuccess && (
        <div className="bg-emerald-500/20 py-2 px-4 text-center border-b border-emerald-500/30">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Assinatura Ativada com Sucesso!</p>
        </div>
      )}

      {/* Global Header */}
      <PlatformHeader 
        title="Dashboard" 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {/* Main Content Area */}
      <main className="flex-1 p-8 pt-4 space-y-8">
        
        <div className="flex items-center gap-2 mb-2 bg-muted/20 p-1 rounded-xl w-fit border border-border">
          {periods.map((p, i) => (
            <motion.button
              key={p}
              initial="hidden" animate="visible" variants={fadeUp} custom={i}
              onClick={() => setActivePeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                activePeriod === p ? "bg-sky-500 text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {p}
            </motion.button>
          ))}
          
          <div className="w-[1px] h-4 bg-border mx-1" />

          <Popover>
            <PopoverTrigger asChild>
              <button className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <CalendarIcon className="w-3.5 h-3.5 text-sky-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Calendário</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover border-border text-popover-foreground rounded-2xl shadow-2xl z-50 overflow-hidden" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border-none scale-90 origin-top"
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6}>
              <StatCard title="Vendas Totais" value={transactions.length} icon={FileText} bgColor="bg-[#10B981]" />
            </motion.div>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7}>
              <StatCard title="Receita Estimada" value={formatCurrency(totalReceita)} icon={Wallet} bgColor="bg-[#0EA5E9]" />
            </motion.div>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={8}>
              <StatCard title="Projetos Ativos" value={totalProjetosAtivos} icon={Truck} bgColor="bg-[#F59E0B]" />
            </motion.div>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={9}>
              <StatCard title="Taxa de Churn" value={`${churnRate.toFixed(1)}%`} icon={TrendingDown} bgColor="bg-[#F43F5E]" />
            </motion.div>
        </section>

        {/* Analytics Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={10} className="lg:col-span-2">
             <Card className="h-full bg-card border-border rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-8 pb-0 flex items-center justify-between">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-card-foreground">Faturamento Mensal</h3>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-sky-500 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">Este Ano</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-4 h-4 rounded-full border-2 border-slate-400 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">Ano Anterior</span>
                    </div>
                  </div>
                </div>
                <MoreHorizontal className="w-5 h-5 text-muted-foreground/30 cursor-pointer hover:text-sky-500 transition-colors" />
              </div>
              <div className="h-[400px] w-full p-4 mt-8">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorThisYear" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-[0.05]" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "currentColor", fontSize: 11, fontWeight: "bold", opacity: 0.4 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "currentColor", fontSize: 10, fontWeight: "bold", opacity: 0.4 }} tickFormatter={(v) => `R$${v/1000}k`} />
                      <Tooltip content={<CustomTooltip />} cursor={false} />
                      {hasThisYearData && (
                        <Area 
                          type="monotone" 
                          dataKey="thisYear" 
                          stroke="#3b82f6" 
                          strokeWidth={2} 
                          fillOpacity={1} 
                          fill="url(#colorThisYear)" 
                          activeDot={false} 
                        />
                      )}
                      {hasLastYearData && (
                        <Area 
                          type="monotone" 
                          dataKey="lastYear" 
                          stroke="#94a3b8" 
                          strokeWidth={1.5} 
                          strokeDasharray="4 4" 
                          fill="none" 
                          activeDot={false} 
                        />
                      )}
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
             </Card>
           </motion.div>

           <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={11}>
             <Card className="h-full bg-card border-border rounded-3xl overflow-hidden p-8 flex flex-col shadow-2xl">
               <div className="flex items-center justify-between mb-12">
                 <h3 className="text-xl font-bold text-card-foreground">Meios de Pagamento</h3>
                 <button className="bg-muted px-4 py-1.5 rounded-lg text-xs font-bold text-foreground hover:bg-muted/80 transition-colors flex items-center gap-2">
                   Ver Todos <ArrowUpRight className="w-3 h-3" />
                 </button>
               </div>
               
               <div className="flex-1 flex flex-col justify-center items-center py-6 relative">
                 {paymentMethods.length > 0 ? (
                   <div className="relative w-56 h-56">
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie data={paymentMethods} innerRadius={75} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none" cornerRadius={10}>
                           {paymentMethods.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                         </Pie>
                       </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-extrabold text-foreground">100%</span>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Total</span>
                     </div>
                   </div>
                 ) : (
                   <div className="flex flex-col items-center justify-center h-56 text-muted-foreground">
                     <PieChartIcon className="w-12 h-12 mb-2 opacity-20" />
                     <span className="text-sm font-medium">Sem transações</span>
                   </div>
                 )}
               </div>

               <div className="space-y-6 mt-8">
                 {paymentMethods.map((item) => (
                   <div key={item.name} className="flex flex-col gap-2">
                     <div className="flex items-center justify-between text-xs font-bold px-1">
                       <span className="text-muted-foreground">{item.name}</span>
                       <span className="text-foreground">{item.value}%</span>
                     </div>
                     <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden p-0.5">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} className="h-full rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]" style={{ backgroundColor: item.color }} />
                     </div>
                   </div>
                 ))}
               </div>
             </Card>
           </motion.div>
        </section>

        {/* Tables Section */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-8">
           <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={12} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                  <Users className="w-5 h-5 text-sky-500" />
                  Leads & Orçamentos
                </h3>
                <button 
                  onClick={() => navigate('/plataforma/clientes')}
                  className="text-[10px] font-bold uppercase tracking-widest text-sky-400"
                >
                  Ver Tudo
                </button>
              </div>
              <Card className="bg-card border-border rounded-3xl overflow-hidden p-0 shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border">
                          <th className="px-6 py-5 text-[10px] font-bold uppercase text-muted-foreground">Serviço</th>
                          <th className="px-6 py-5 text-[10px] font-bold uppercase text-muted-foreground/30">Status</th>
                          <th className="px-6 py-5 text-[10px] font-bold uppercase text-muted-foreground/30 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {recentCustomers.map((q) => (
                          <tr 
                            key={q.id} 
                            className="hover:bg-muted/30 transition-colors cursor-pointer"
                            onClick={() => navigate('/plataforma/clientes')}
                          >
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-sm text-foreground">{q.name}</span>
                                <span className="text-[10px] text-muted-foreground uppercase">{format(new Date(q.created_at), "dd/MM/yyyy")}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={`${statusConfig[q.status]?.cls || "bg-muted text-foreground"} border-none rounded-lg px-2.5 py-0.5 font-bold text-[9px] uppercase`}>
                                {statusConfig[q.status]?.label || q.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <ArrowUpRight className="w-4 h-4 text-muted-foreground/30 inline" />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
           </motion.div>

           <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={13} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                  <Folder className="w-5 h-5 text-[#10B981]" />
                  Projetos Ativos
                </h3>
                <button className="text-[10px] font-bold uppercase tracking-widest text-white/30">Ver Todos</button>
              </div>
              <Card className="bg-card border-border rounded-3xl overflow-hidden p-0 shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border">
                          <th className="px-6 py-5 text-[10px] font-bold uppercase text-muted-foreground/30">Projeto</th>
                          <th className="px-6 py-5 text-[10px] font-bold uppercase text-muted-foreground/30">Progresso</th>
                          <th className="px-6 py-5 text-[10px] font-bold uppercase text-muted-foreground/30">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {recentProjects.map((p) => (
                          <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-sm text-foreground">{p.title}</span>
                                <span className="text-[10px] text-muted-foreground uppercase">Entrega: {p.end_date ? format(new Date(p.end_date), "dd/MM/yyyy") : "---"}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: p.status === 'CONCLUÍDO' ? '100%' : '45%' }} className={`h-full rounded-full ${p.status === 'CONCLUÍDO' ? 'bg-[#10B981]' : 'bg-sky-500'}`} />
                              </div>
                            </td>
                            <td className="px-6 py-4">
                               <Badge className={`${p.status === 'CONCLUÍDO' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-sky-500/10 text-sky-500'} border-none rounded-lg px-2.5 py-0.5 font-bold text-[9px] uppercase`}>{p.status}</Badge>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
           </motion.div>
        </section>
      </main>
    </div>
  );
}
