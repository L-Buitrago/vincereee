import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { 
  FileText, Wallet, Truck, Clock, Search, Bell, Folder, 
  MoreHorizontal, ArrowUpRight, CheckCircle2, TrendingUp,
  Calendar as CalendarIcon, PieChart as PieChartIcon, ChevronLeft, ArrowLeft
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const revenueData = [
  { name: "Jan", thisYear: 4000, lastYear: 2400 },
  { name: "Fev", thisYear: 12000, lastYear: 13980 },
  { name: "Mar", thisYear: 9000, lastYear: 9800 },
  { name: "Abr", thisYear: 15000, lastYear: 13908 },
  { name: "Mai", thisYear: 21000, lastYear: 14800 },
  { name: "Jun", thisYear: 18000, lastYear: 13800 },
  { name: "Jul", thisYear: 24000, lastYear: 14300 },
  { name: "Ago", thisYear: 20000, lastYear: 12400 },
  { name: "Set", thisYear: 28000, lastYear: 12400 },
  { name: "Out", thisYear: 32000, lastYear: 21400 },
  { name: "Nov", thisYear: 30000, lastYear: 23400 },
  { name: "Dez", thisYear: 38000, lastYear: 26400 },
];

const paymentMethods = [
  { name: "Cartão de Crédito", value: 65, color: "#0ea5e9" },
  { name: "Pix", value: 25, color: "#10B981" },
  { name: "Boleto", value: 7, color: "#F59E0B" },
  { name: "Outros", value: 3, color: "#31335A" },
];

const mockQuotes = [
  { id: '1', service: 'E-commerce Premium', status: 'approved', date: '2026-03-22' },
  { id: '2', service: 'App Mobile iOS', status: 'pending', date: '2026-03-21' },
  { id: '3', service: 'Sistema ERP Web', status: 'in_progress', date: '2026-03-20' },
  { id: '4', service: 'Consultoria IA', status: 'completed', date: '2026-03-19' },
  { id: '5', service: 'Landing Page', status: 'rejected', date: '2026-03-18' },
];

const mockProjects = [
  { id: '1', title: 'Plataforma Vincere', status: 'EM ANDAMENTO', date: '2026-03-29', progress: 45 },
  { id: '2', title: 'App Delivery Rápido', status: 'CONCLUÍDO', date: '2026-03-22', progress: 100 },
  { id: '3', title: 'Portal de Notícias', status: 'EM ANDAMENTO', date: '2026-04-05', progress: 45 },
];

const statusConfig: Record<string, { label: string; cls: string }> = {
  approved: { label: "Aprovado", cls: "bg-emerald-500/10 text-emerald-500" },
  pending: { label: "Pendente", cls: "bg-amber-500/10 text-amber-500" },
  in_progress: { label: "Em andamento", cls: "bg-blue-500/10 text-blue-500" },
  completed: { label: "Concluído", cls: "bg-emerald-500/10 text-emerald-500" },
  rejected: { label: "Rejeitado", cls: "bg-red-500/10 text-red-500" },
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111] px-4 py-2 rounded-xl shadow-2xl border border-white/5 relative">
        <p className="text-white font-bold text-sm">
          {formatCurrency(payload[0].value)}
        </p>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#111] rotate-45 border-r border-b border-white/5" />
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <Card className="overflow-hidden border border-slate-200/60 bg-white/40 backdrop-blur-sm relative group transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl hover:border-sky-500/20 rounded-3xl">
    <CardContent className="p-6 lg:p-7 relative z-10">
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500"
            style={{ backgroundColor: `${color}15`, color: color }}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">{title}</p>
          </div>
        </div>
        <div className="p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group/more">
          <MoreHorizontal className="w-4 h-4 text-slate-200 group-hover/more:text-sky-500 transition-colors" />
        </div>
      </div>
    </CardContent>
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
  </Card>
);

const DemoDashboard = () => {
  const periods = ["ONTEM", "HOJE", "SEMANA", "MÊS", "ANO", "TODOS"];
  const [activePeriod, setActivePeriod] = useState("TODOS");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const topRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const forceTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      topRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' });
    };

    // Immediate jump
    forceTop();

    // Aggressive re-jumps to fight any smooth scrolling libraries (Lenis/SmoothScroller)
    const frames = [0, 50, 100, 200, 500, 1000];
    const timers = frames.map(ms => setTimeout(forceTop, ms));

    return () => {
      timers.forEach(clearTimeout);
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  return (
    <div ref={topRef} className="flex flex-col min-h-screen bg-[#F8FAFC] text-[#1e293b] font-sans selection:bg-sky-500/10 overflow-x-hidden">
      
      {/* Full Width Top Header */}
      <header className="flex items-center justify-between p-4 px-10 bg-white/95 sticky top-0 z-50 backdrop-blur-2xl border-b border-slate-200/60 w-full shadow-sm transition-all h-[80px]">
        <div className="flex items-center gap-8">
           <Link to="/" className="flex items-center gap-2.5 px-6 py-2.5 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all font-bold text-xs shadow-2xl shadow-slate-900/10 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Voltar
          </Link>

          <div className="h-6 w-[1px] bg-slate-200" />

          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Analytics Demo <span className="text-sky-500">.</span>
          </h1>
        </div>

        <div className="flex items-center gap-8">
          <div className="relative hidden lg:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <Input
              className="bg-slate-50 border-slate-200/60 pl-12 w-64 lg:w-80 text-xs rounded-xl focus-visible:ring-sky-500/30 text-slate-900 placeholder:text-slate-400 h-10 transition-all focus:w-96 shadow-none"
              placeholder="Pesquisar na demo..."
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer relative shadow-sm group">
                 <Bell className="w-4.5 h-4.5 group-hover:rotate-12 transition-transform" />
                 <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-sky-500 border-2 border-white" />
              </button>
            </div>

            <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
              <div className="flex flex-col items-end">
                <span className="text-[13px] font-bold text-slate-900 leading-none">Vitor Vincere</span>
                <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-medium">vitor@vincere.tech</span>
                <Badge variant="outline" className="mt-2 h-5 text-[9px] uppercase tracking-[0.2em] font-black border-sky-500/20 bg-sky-500/5 text-sky-600 px-2.5 rounded-md">
                  ADMIN
                </Badge>
              </div>
              <Avatar className="w-11 h-11 rounded-2xl border-2 border-white shadow-xl shadow-sky-500/10 ring-1 ring-slate-100">
                <AvatarFallback className="bg-gradient-to-br from-sky-500/10 to-sky-500/5 text-sky-600 font-bold text-xs">VV</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full p-10 space-y-12 max-w-[1800px] mx-auto">
        
        <div className="flex items-center gap-2 mb-2 bg-slate-100/50 p-1 rounded-xl w-fit border border-slate-200/60">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  activePeriod === p ? "bg-sky-500 text-white shadow-md shadow-sky-500/20" : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
                }`}
              >
                {p}
              </button>
            ))}
            
            <div className="w-[1px] h-4 bg-slate-200 mx-1" />

            <Popover>
             <PopoverTrigger asChild>
               <button className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
                 <CalendarIcon className="w-3.5 h-3.5 text-sky-500" />
                 <span className="text-[10px] font-bold uppercase tracking-wider">Calendário</span>
               </button>
             </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border-slate-200 text-slate-900 rounded-2xl shadow-2xl z-50 overflow-hidden" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border-none"
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            <StatCard title="Vendas Totais" value="1.450" icon={FileText} color="#10B981" />
            <StatCard title="Receita Estimada" value="R$ 152.840" icon={Wallet} color="#3b82f6" />
            <StatCard title="Projetos Ativos" value="12" icon={Truck} color="#F59E0B" />
            <StatCard title="Taxa de Churn" value="2.4%" icon={Clock} color="#F43F5E" />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full">
           <Card className="xl:col-span-2 bg-white border-slate-200/60 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-8 pb-0 flex items-center justify-between">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900">Faturamento Mensal</h3>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <div className="w-4 h-4 rounded-full border-2 border-sky-500 flex items-center justify-center">
                         <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                       </div>
                       <span className="text-xs font-bold text-slate-500">Este Ano</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center">
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                       </div>
                       <span className="text-xs font-bold text-slate-400">Ano Anterior</span>
                    </div>
                  </div>
                </div>
                <MoreHorizontal className="w-5 h-5 text-slate-200 cursor-pointer hover:text-sky-500 transition-colors" />
              </div>
              <div className="h-[400px] w-full p-4 mt-8">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorThisYear" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-[0.03]" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "currentColor", fontSize: 11, fontWeight: "bold", opacity: 0.3 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "currentColor", fontSize: 10, fontWeight: "bold", opacity: 0.3 }} tickFormatter={(v) => `R$${v/1000}k`} />
                      <Tooltip content={<CustomTooltip />} cursor={false} />
                      <Area type="monotone" dataKey="thisYear" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorThisYear)" activeDot={false} />
                      <Area type="monotone" dataKey="lastYear" stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="6 6" fill="none" activeDot={false} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           <Card className="bg-white border-slate-200/60 rounded-3xl overflow-hidden p-8 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-xl font-bold text-slate-900">Meios de Pagamento</h3>
                <button className="bg-slate-50 px-4 py-1.5 rounded-lg text-[10px] font-bold text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-2 uppercase tracking-wider">
                  Ver Todos <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center py-6 relative">
                 <div className="relative w-56 h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={paymentMethods} innerRadius={75} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none" cornerRadius={10}>
                          {paymentMethods.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-extrabold text-slate-900">100%</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Total</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-6 mt-8">
                {paymentMethods.map((item) => (
                  <div key={item.name} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[10px] font-bold px-1">
                      <span className="text-slate-400 uppercase tracking-widest">{item.name}</span>
                      <span className="text-slate-900">{item.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden p-0.5">
                       <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.value}%` }} transition={{ duration: 1.5 }} className="h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.1)]" style={{ backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
           </Card>
        </section>

        {/* Wide Bottom Section */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-10 pb-16 w-full">
           <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-bold flex items-center gap-3 text-slate-900">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center"><FileText className="w-5 h-5 text-sky-600" /></div>
                  Orçamentos Recentes
                </h3>
                <button className="text-[10px] font-bold uppercase tracking-widest text-sky-500 hover:opacity-70 transition-opacity">Ver Tudo</button>
              </div>
              <Card className="bg-white border-slate-200/60 rounded-3xl overflow-hidden shadow-xl w-full">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100">
                          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Serviço</th>
                          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Status</th>
                          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {mockQuotes.map((q) => (
                          <tr key={q.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                            <td className="px-8 py-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-sm text-slate-900 group-hover:text-sky-600 transition-colors">{q.service}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{format(new Date(q.date), "dd/MM/yyyy")}</span>
                              </div>
                            </td>
                            <td className="px-8 py-4 text-center">
                              <Badge className={`${statusConfig[q.status]?.cls} border-none rounded-lg px-3 py-1 font-bold text-[9px] uppercase tracking-wider shadow-sm`}>
                                {statusConfig[q.status]?.label}
                              </Badge>
                            </td>
                            <td className="px-8 py-4 text-right">
                               <ArrowUpRight className="w-4 h-4 text-slate-200 group-hover:text-sky-500 transition-colors inline" />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
           </div>

           <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-bold flex items-center gap-3 text-slate-900">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Folder className="w-5 h-5 text-emerald-600" /></div>
                  Projetos Ativos
                </h3>
                <button className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Ver Todos</button>
              </div>
              <Card className="bg-white border-slate-200/60 rounded-3xl overflow-hidden shadow-xl w-full">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100">
                          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Projeto</th>
                          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Progresso</th>
                          <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {mockProjects.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/50 transition-all group">
                            <td className="px-8 py-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">{p.title}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Entrega: {format(new Date(p.date), "dd/MM/yyyy")}</span>
                              </div>
                            </td>
                            <td className="px-8 py-4">
                               <div className="w-32 mx-auto">
                                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                     <motion.div initial={{ width: 0 }} whileInView={{ width: `${p.progress}%` }} className={`h-full rounded-full ${p.status === 'CONCLUÍDO' ? 'bg-emerald-500' : 'bg-sky-500'}`} />
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-4 text-right">
                               <Badge className={`${p.status === 'CONCLUÍDO' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-sky-500/10 text-sky-600'} border-none rounded-lg px-3 py-1 font-bold text-[9px] uppercase tracking-wider shadow-sm`}>{p.status}</Badge>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
           </div>
        </section>

        {/* Final Wide CTA Removed per request */}
         <div className="flex flex-col items-center gap-2 py-10 pb-20">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.8em]">Demonstração Oficial Vincere Platform</p>
         </div>
      </main>
    </div>
  );
};

export default DemoDashboard;
