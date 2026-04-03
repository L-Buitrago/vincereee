import { useState, useEffect } from "react";
import { 
  FileText, Wallet, Truck, Clock, Search, Bell, Folder, 
  MoreHorizontal, ArrowUpRight, CheckCircle2, TrendingUp,
  Calendar as CalendarIcon, PieChart as PieChartIcon, ChevronRight
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

const StatCard = ({ title, value, icon: Icon, bgColor }: any) => (
  <Card className={`overflow-hidden border-none relative group transition-all duration-500 hover:translate-y-[-4px] ${bgColor} text-white shadow-lg rounded-2xl`}>
    <CardContent className="p-8 lg:p-10 relative z-10">
      <div className="flex items-start justify-between">
        <div className="space-y-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/20 transition-transform group-hover:scale-110 duration-500">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl lg:text-5xl font-bold tracking-tighter">{value}</h3>
            <p className="text-xs lg:text-sm font-semibold text-white/80 uppercase tracking-widest leading-none">{title}</p>
          </div>
        </div>
        <div className="p-1 rounded-md hover:bg-white/10 cursor-pointer">
          <MoreHorizontal className="w-5 h-5 text-white/60" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const DemoDashboard = () => {
  const periods = ["ONTEM", "HOJE", "SEMANA", "MÊS", "ANO", "TODOS"];
  const [activePeriod, setActivePeriod] = useState("TODOS");
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    // Force scroll to top on mount with a slight delay if needed
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-[#1e293b] font-sans selection:bg-sky-500/10 overflow-x-hidden">
      
      {/* Full Width Top Header */}
      <header className="flex items-center justify-between p-6 px-10 bg-white/80 sticky top-0 z-30 backdrop-blur-xl border-b border-slate-200 w-full shadow-sm">
        <div className="flex flex-col">
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
            Analytics Demo <span className="text-sky-500">.</span>
          </h1>
        </div>

        <div className="flex items-center gap-10">
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              className="bg-slate-100 border-transparent pl-12 w-64 lg:w-96 text-sm rounded-xl focus-visible:ring-sky-500 text-slate-900 placeholder:text-slate-400 h-12 shadow-sm"
              placeholder="Pesquisar..."
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer relative shadow-sm">
               <Bell className="w-5 h-5" />
               <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
            </button>

            <div className="flex items-center gap-5 pl-6 border-l border-slate-200 ml-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-slate-900 leading-none">Vitor Vincere</span>
                <span className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider">vitor@vincere.tech</span>
                <Badge variant="outline" className="mt-1.5 h-6 text-[10px] uppercase tracking-widest font-extrabold border-sky-500/30 bg-sky-500/10 text-sky-600 px-3">
                  PLANO PRO
                </Badge>
              </div>
              <Avatar className="w-12 h-12 rounded-xl border border-slate-200 shadow-lg">
                <AvatarFallback className="bg-sky-500/20 text-sky-600 font-bold text-sm">VV</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area (Full Width) */}
      <main className="w-full p-10 space-y-12 max-w-[1800px] mx-auto">
        
        {/* Full Width Filters */}
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              {periods.map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePeriod(p)}
                  className={`px-7 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    activePeriod === p ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              ))}
           </div>

           <Popover>
            <PopoverTrigger asChild>
              <button className="px-7 py-2.5 rounded-xl bg-white border border-slate-200 text-sky-600 flex items-center gap-3 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm">
                <CalendarIcon className="w-4 h-4" />
                Calendário
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

        {/* Giant KPI Cards Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            <StatCard title="Vendas Totais" value="1.450" icon={FileText} bgColor="bg-[#10B981]" />
            <StatCard title="Receita Estimada" value="R$ 152.840" icon={Wallet} bgColor="bg-sky-500" />
            <StatCard title="Projetos Ativos" value="12" icon={Truck} bgColor="bg-[#F59E0B]" />
            <StatCard title="Taxa de Churn" value="2.4%" icon={Clock} bgColor="bg-rose-500" />
        </section>

        {/* Giant Analytics Section */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-10 w-full">
           <Card className="xl:col-span-2 bg-white border-slate-200 rounded-[2rem] overflow-hidden shadow-xl">
              <div className="p-10 pb-0 flex items-center justify-between">
                <div className="space-y-5">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Faturamento Mensal</h3>
                  <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.3)]" />
                       <span className="text-xs uppercase font-extrabold text-slate-500 tracking-[0.2em]">Este Ano</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full bg-slate-200" />
                       <span className="text-xs uppercase font-extrabold text-slate-400 tracking-[0.2em]">Ano Anterior</span>
                    </div>
                  </div>
                </div>
                <MoreHorizontal className="w-6 h-6 text-slate-300 cursor-pointer hover:text-slate-500 transition-colors" />
              </div>
              <div className="h-[450px] w-full p-6 mt-10">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorThisYear" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#0000000a" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: "800" }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: "800" }} tickFormatter={(v) => `R$${v/1000}k`} />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-100 relative">
                                <p className="text-slate-900 font-black text-sm tracking-tight">
                                  {formatCurrency(Number(payload[0].value))}
                                </p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-widest">Faturamento</p>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white rotate-45 border-r border-b border-slate-100" />
                              </div>
                            );
                          }
                          return null;
                        }} 
                        cursor={false} 
                      />
                      <Area type="monotone" dataKey="thisYear" stroke="#0ea5e9" strokeWidth={5} fillOpacity={1} fill="url(#colorThisYear)" activeDot={false} />
                      <Area type="monotone" dataKey="lastYear" stroke="#cbd5e1" strokeWidth={3} strokeDasharray="10 10" fill="none" activeDot={false} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           <Card className="bg-white border-slate-200 rounded-[2rem] overflow-hidden p-10 flex flex-col shadow-xl">
              <div className="flex items-center justify-between mb-16">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Meios de Pagamento</h3>
                <button className="bg-slate-50 px-6 py-2 rounded-xl text-[10px] font-black text-sky-600 flex items-center gap-2 uppercase tracking-widest hover:bg-slate-100 transition-all shadow-sm">
                  Ver Todos <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center py-10 relative">
                 <div className="relative w-72 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={paymentMethods} innerRadius={90} outerRadius={125} paddingAngle={8} dataKey="value" stroke="none" cornerRadius={12}>
                          {paymentMethods.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-6xl font-black text-slate-900 tracking-tighter">100%</span>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] mt-3">Transações</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-7 mt-12">
                {paymentMethods.map((item) => (
                  <div key={item.name} className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between text-[11px] font-black px-1">
                      <span className="text-slate-500 uppercase tracking-[0.2em]">{item.name}</span>
                      <span className="text-slate-900">{item.value}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                       <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.value}%` }} transition={{ duration: 1.5 }} className="h-full rounded-full shadow-[0_0_10px_rgba(var(--primary),0.2)]" style={{ backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
           </Card>
        </section>

        {/* Wide Bottom Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-16 w-full">
           <div className="space-y-8">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-xl font-black flex items-center gap-3 text-slate-900 uppercase tracking-tighter">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center"><FileText className="w-5 h-5 text-sky-600" /></div>
                  Orçamentos Recentes
                </h3>
                <button className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-600 hover:opacity-70 transition-opacity">Ver Tudo</button>
              </div>
              <Card className="bg-white border-slate-200 rounded-[2rem] overflow-hidden p-4 shadow-xl w-full">
                <table className="w-full text-left">
                  <thead>
                      <tr className="border-b border-slate-100">
                        <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Serviço</th>
                        <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">Status</th>
                        <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">Preview</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                      {mockQuotes.map((q) => (
                        <tr key={q.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-base text-slate-900 group-hover:text-sky-600 transition-colors tracking-tight">{q.service}</span>
                              <span className="text-[11px] text-slate-400 font-bold uppercase mt-1.5 tracking-widest">{format(new Date(q.date), "dd/MM/yyyy")}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <Badge className={`${statusConfig[q.status]?.cls} border-none rounded-xl px-5 py-2 font-black text-[10px] uppercase tracking-widest shadow-sm`}>
                              {statusConfig[q.status]?.label}
                            </Badge>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <button className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-sky-500 group-hover:text-white text-slate-300 transition-all ml-auto flex items-center justify-center border border-slate-100 group-hover:border-transparent">
                                <ArrowUpRight className="w-5 h-5" />
                             </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </Card>
           </div>

           <div className="space-y-8">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-xl font-black flex items-center gap-3 text-slate-900 uppercase tracking-tighter">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Folder className="w-5 h-5 text-emerald-600" /></div>
                  Projetos Ativos
                </h3>
                <button className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-colors">Ver Todos</button>
              </div>
              <Card className="bg-white border-slate-200 rounded-[2rem] overflow-hidden p-4 shadow-xl w-full">
                <table className="w-full text-left">
                  <thead>
                      <tr className="border-b border-slate-100">
                        <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Projeto</th>
                        <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">Progresso</th>
                        <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">Status</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                      {mockProjects.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-all group">
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-base text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight">{p.title}</span>
                              <span className="text-[11px] text-slate-400 font-bold uppercase mt-1.5 tracking-widest">Entrega: {format(new Date(p.date), "dd/MM/yyyy")}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="w-40 mx-auto">
                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
                                   <motion.div initial={{ width: 0 }} whileInView={{ width: `${p.progress}%` }} className={`h-full rounded-full ${p.status === 'CONCLUÍDO' ? 'bg-emerald-500' : 'bg-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.4)]'}`} />
                                </div>
                                <div className="text-[10px] font-black text-slate-400 mt-2 text-center tracking-widest">{p.progress}% COMPLETO</div>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <Badge className={`${p.status === 'CONCLUÍDO' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-sky-500/10 text-sky-600'} border-none rounded-xl px-5 py-2 font-black text-[10px] uppercase tracking-widest shadow-sm`}>{p.status}</Badge>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
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
