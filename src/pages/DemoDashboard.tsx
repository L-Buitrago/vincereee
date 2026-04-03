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
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-[#e5e5e5] font-sans selection:bg-sky-500/30 overflow-x-hidden">
      
      {/* Full Width Top Header */}
      <header className="flex items-center justify-between p-6 px-10 bg-transparent sticky top-0 z-30 backdrop-blur-md border-b border-white/5 w-full">
        <div className="flex flex-col">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
            Analytics Demo <span className="text-sky-500">.</span>
          </h1>
        </div>

        <div className="flex items-center gap-10">
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="bg-white/5 border-white/10 pl-12 w-64 lg:w-96 text-sm rounded-xl focus-visible:ring-sky-500 text-white placeholder:text-gray-500 h-12"
              placeholder="Pesquisar..."
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition-colors cursor-pointer relative">
               <Bell className="w-5 h-5 text-gray-400" />
               <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-500 border-2 border-[#050505]" />
            </button>

            <div className="flex items-center gap-5 pl-6 border-l border-white/10 ml-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-white leading-none">Vitor Vincere</span>
                <span className="text-[11px] text-gray-500 mt-1">vitor@vincere.tech</span>
                <Badge variant="outline" className="mt-1.5 h-6 text-[10px] uppercase tracking-widest font-bold border-sky-500/30 bg-sky-500/10 text-sky-400 px-3">
                  PLANO PRO
                </Badge>
              </div>
              <Avatar className="w-12 h-12 rounded-xl border border-white/10 shadow-xl">
                <AvatarFallback className="bg-sky-500/20 text-sky-400 font-bold text-sm">VV</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area (Full Width) */}
      <main className="w-full p-10 space-y-12">
        
        {/* Full Width Filters */}
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
              {periods.map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePeriod(p)}
                  className={`px-7 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    activePeriod === p ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : "text-gray-500 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {p}
                </button>
              ))}
           </div>

           <Popover>
            <PopoverTrigger asChild>
              <button className="px-7 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sky-400 flex items-center gap-3 hover:bg-white/10 transition-all font-bold text-[10px] uppercase tracking-widest">
                <CalendarIcon className="w-4 h-4" />
                Calendário
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#0a0a0a] border-white/10 text-white rounded-2xl shadow-2xl z-50 overflow-hidden" align="end">
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
            <StatCard title="Receita Estimada" value="R$ 152.840" icon={Wallet} bgColor="bg-[#0EA5E9]" />
            <StatCard title="Projetos Ativos" value="12" icon={Truck} bgColor="bg-[#F59E0B]" />
            <StatCard title="Taxa de Churn" value="2.4%" icon={Clock} bgColor="bg-[#F43F5E]" />
        </section>

        {/* Giant Analytics Section */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-10 w-full">
           <Card className="xl:col-span-2 bg-[#0a0a0a] border-white/5 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-10 pb-0 flex items-center justify-between">
                <div className="space-y-5">
                  <h3 className="text-2xl font-bold text-white tracking-tight">Faturamento Mensal</h3>
                  <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.4)]" />
                       <span className="text-xs uppercase font-bold text-gray-500 tracking-[0.2em]">Este Ano</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full bg-gray-800" />
                       <span className="text-xs uppercase font-bold text-gray-500 tracking-[0.2em]">Ano Anterior</span>
                    </div>
                  </div>
                </div>
                <MoreHorizontal className="w-6 h-6 text-gray-800 cursor-pointer" />
              </div>
              <div className="h-[450px] w-full p-6 mt-10">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorThisYear" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff03" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#444", fontSize: 11, fontWeight: "bold" }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#444", fontSize: 10, fontWeight: "bold" }} tickFormatter={(v) => `R$${v/1000}k`} />
                      <Tooltip content={<CustomTooltip />} cursor={false} />
                      <Area type="monotone" dataKey="thisYear" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorThisYear)" activeDot={false} />
                      <Area type="monotone" dataKey="lastYear" stroke="#222" strokeWidth={2} fill="none" activeDot={false} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           <Card className="bg-[#0a0a0a] border-white/5 rounded-3xl overflow-hidden p-10 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between mb-16">
                <h3 className="text-2xl font-bold text-white tracking-tight">Meios de Pagamento</h3>
                <button className="bg-white/5 px-6 py-2 rounded-xl text-[10px] font-bold text-sky-400 flex items-center gap-2 uppercase tracking-widest hover:bg-white/10 transition-all">
                  Ver Todos <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center py-10 relative">
                 <div className="relative w-64 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={paymentMethods} innerRadius={85} outerRadius={115} paddingAngle={8} dataKey="value" stroke="none" cornerRadius={10}>
                          {paymentMethods.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-extrabold text-white tracking-tighter">100%</span>
                      <span className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.4em] mt-2">Total</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-8 mt-12">
                {paymentMethods.map((item) => (
                  <div key={item.name} className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between text-[11px] font-bold px-1">
                      <span className="text-gray-600 uppercase tracking-[0.2em]">{item.name}</span>
                      <span className="text-white font-black">{item.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                       <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.value}%` }} transition={{ duration: 1.5 }} className="h-full rounded-full shadow-[0_0_8px_rgba(14,165,233,0.3)]" style={{ backgroundColor: item.color }} />
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
                <h3 className="text-xl font-bold flex items-center gap-3 text-white uppercase tracking-tight">
                  <FileText className="w-6 h-6 text-sky-500" />
                  Orçamentos Recentes
                </h3>
                <button className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-500">Ver Tudo</button>
              </div>
              <Card className="bg-[#0a0a0a] border-white/5 rounded-3xl overflow-hidden p-4 shadow-2xl w-full">
                <table className="w-full text-left">
                  <thead>
                      <tr className="border-b border-white/5">
                        <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-700 text-center lg:text-left">Serviço</th>
                        <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-700 text-center">Status</th>
                        <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-700 text-right">Ações</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-white/2">
                      {mockQuotes.map((q) => (
                        <tr key={q.id} className="hover:bg-white/[0.01] transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-base text-white group-hover:text-sky-400 transition-colors tracking-tight">{q.service}</span>
                              <span className="text-[11px] text-gray-600 uppercase mt-1 tracking-widest">{format(new Date(q.date), "dd/MM/yyyy")}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <Badge className={`${statusConfig[q.status]?.cls} border-none rounded-xl px-4 py-1.5 font-bold text-[10px] uppercase tracking-widest`}>
                              {statusConfig[q.status]?.label}
                            </Badge>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-700 group-hover:text-white transition-all ml-auto">
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
                <h3 className="text-xl font-bold flex items-center gap-3 text-white uppercase tracking-tight">
                  <Folder className="w-6 h-6 text-emerald-500" />
                  Projetos Ativos
                </h3>
                <button className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-700 hover:text-white transition-colors">Ver Todos</button>
              </div>
              <Card className="bg-[#0a0a0a] border-white/5 rounded-3xl overflow-hidden p-4 shadow-2xl w-full">
                <table className="w-full text-left">
                  <thead>
                      <tr className="border-b border-white/5">
                        <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-700">Projeto</th>
                        <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-700 text-center">Progresso</th>
                        <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-700 text-right">Status</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-white/2">
                      {mockProjects.map((p) => (
                        <tr key={p.id} className="hover:bg-white/[0.01] transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors tracking-tight">{p.title}</span>
                              <span className="text-[11px] text-gray-600 uppercase mt-1">Previsão: {format(new Date(p.date), "dd/MM/yyyy")}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="w-32 mx-auto">
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                                   <motion.div initial={{ width: 0 }} whileInView={{ width: `${p.progress}%` }} className={`h-full rounded-full ${p.status === 'CONCLUÍDO' ? 'bg-emerald-500' : 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.3)]'}`} />
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <Badge className={`${p.status === 'CONCLUÍDO' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-sky-500/10 text-sky-500'} border-none rounded-xl px-4 py-1.5 font-bold text-[10px] uppercase tracking-widest`}>{p.status}</Badge>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </Card>
           </div>
        </section>

        {/* Final Wide CTA */}
        <div className="flex flex-col items-center gap-10 py-10 pb-20">
           <Link to="/auth" className="w-full max-w-2xl group relative overflow-hidden rounded-[2rem] h-24 flex items-center justify-center bg-sky-500 shadow-2xl shadow-sky-500/40">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-full text-white font-black text-xl lg:text-2xl flex items-center justify-center gap-4 transition-transform z-10"
              >
                 COMECE SUA JORNADA VINCERE AGORA
                 <ArrowUpRight className="w-7 h-7" />
              </motion.button>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:animate-shimmer" />
           </Link>
           <p className="text-[10px] font-bold text-gray-800 uppercase tracking-[0.5em]">Demonstração Oficial Vincere Platform</p>
        </div>
      </main>
    </div>
  );
};

export default DemoDashboard;
