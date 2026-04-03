import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Search, Bell, Wallet, Truck, Clock, MoreHorizontal,
  TrendingUp, ArrowUpRight, FolderOpen, Calendar as CalendarIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { motion } from "framer-motion";

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
  in_progress: "Em andamento",
  completed: "Concluído",
  paused: "Pausado",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  approved: "bg-emerald-500/10 text-emerald-500",
  rejected: "bg-red-500/10 text-red-500",
  in_progress: "bg-sky-500/10 text-sky-500",
  completed: "bg-emerald-500/10 text-emerald-500",
  paused: "bg-muted text-muted-foreground",
};

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

const paymentMethodsData = [
  { name: "Cartão de Crédito", value: 65, color: "#0ea5e9" }, // Vincere Blue
  { name: "Pix", value: 25, color: "#10B981" },
  { name: "Boleto", value: 7, color: "#F59E0B" },
  { name: "Outros", value: 3, color: "#31335A" },
];

const mockQuotes = [
  { id: '1', service_type: 'E-commerce Premium', status: 'approved', created_at: '2026-03-22' },
  { id: '2', service_type: 'App Mobile iOS', status: 'pending', created_at: '2026-03-21' },
  { id: '3', service_type: 'Sistema ERP Web', status: 'in_progress', created_at: '2026-03-20' },
  { id: '4', service_type: 'Consultoria IA', status: 'completed', created_at: '2026-03-19' },
  { id: '5', service_type: 'Landing Page', status: 'rejected', created_at: '2026-03-18' },
];

const mockProjects = [
  { id: '1', title: 'Plataforma Vincere', status: 'in_progress', end_date: '2026-03-29', progress: 45 },
  { id: '2', title: 'App Delivery Rápido', status: 'completed', end_date: '2026-03-22', progress: 100 },
  { id: '3', title: 'Portal de Notícias', status: 'in_progress', end_date: '2026-04-05', progress: 45 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-sky-500 px-4 py-2 rounded-2xl shadow-xl border border-white/20 relative">
        <p className="text-white font-bold text-sm whitespace-nowrap">
          R$ {payload[0].value.toLocaleString()} <span className="text-white/70 font-normal">mensal</span>
        </p>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-sky-500 rotate-45 border-r border-b border-white/20" />
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, icon: Icon, bgColor }: any) => (
  <Card className={`overflow-hidden border-none relative group transition-all duration-500 hover:translate-y-[-4px] ${bgColor} text-white shadow-xl rounded-[2rem]`}>
    <CardContent className="p-8 relative z-10">
      <div className="flex items-start justify-between">
        <div className="space-y-5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/20 transition-transform group-hover:scale-110 duration-500">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-4xl font-black tracking-tight mb-1">{value}</h3>
            <p className="text-xs font-bold text-white/80 uppercase tracking-widest leading-none">
              {title}
            </p>
          </div>
        </div>
        <div className="p-1 rounded-md hover:bg-white/10 cursor-pointer">
          <MoreHorizontal className="w-4 h-4 text-white/60" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const DemoDashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activePeriod, setActivePeriod] = useState("TODOS");
  const periods = ["ONTEM", "HOJE", "SEMANA", "MÊS", "ANO", "TODOS"];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans pb-20">
      {/* Platform Header */}
      <header className="flex items-center justify-between p-6 px-10 bg-transparent sticky top-0 z-30 backdrop-blur-md border-b border-white/5">
        <h1 className="text-2xl font-black tracking-tighter text-white">Analytics Demo</h1>

        <div className="flex items-center gap-8">
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              className="bg-white/5 border-white/10 pl-12 w-64 lg:w-80 h-12 text-sm rounded-2xl focus-visible:ring-sky-500 text-white placeholder:text-gray-500"
              placeholder="Pesquisar..."
            />
          </div>

          <div className="flex items-center gap-6">
             <button className="p-3 bg-white/5 border border-white/5 rounded-2xl relative hover:bg-white/10 transition-colors">
               <Bell className="w-5 h-5 text-gray-400" />
               <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 border-2 border-[#050505]" />
             </button>

             <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                <div className="flex flex-col items-end">
                   <span className="text-sm font-black text-white leading-none">Vitor Vincere</span>
                   <span className="text-[11px] text-gray-500 mt-1 font-medium tracking-tight">vitor@vincere.tech</span>
                   <Badge variant="outline" className="mt-1 h-5 text-[9px] uppercase tracking-widest font-black border-sky-500 bg-sky-500/10 text-sky-400">
                     PLANO PRO
                   </Badge>
                </div>
                <Avatar className="w-12 h-12 rounded-2xl border border-white/10 shadow-xl">
                  <AvatarFallback className="bg-sky-500 text-white font-black text-sm">
                    VV
                  </AvatarFallback>
                </Avatar>
             </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="max-w-7xl mx-auto w-full p-6 lg:p-10 space-y-10">
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-1 bg-[#111] p-1.5 rounded-2xl border border-white/5 w-fit overflow-x-auto scrollbar-hide">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activePeriod === p ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : "text-gray-500 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <button className="px-6 py-3 rounded-2xl bg-[#111] border border-white/5 text-sky-400 flex items-center gap-3 hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest">
                <CalendarIcon className="w-4 h-4" />
                Calendário
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#111] border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden" align="end">
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
        
        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
               title="Vendas Totais" 
               value="1.450" 
               icon={FileText} 
               bgColor="bg-[#10B981]" 
            />
            <StatCard 
               title="Receita Estimada" 
               value="R$ 152.840" 
               icon={Wallet} 
               bgColor="bg-[#0ea5e9]"
            />
            <StatCard 
               title="Projetos Ativos" 
               value="12" 
               icon={Truck} 
               bgColor="bg-[#F59E0B]"
            />
            <StatCard 
               title="Taxa de Churn" 
               value="2.4%" 
               icon={Clock} 
               bgColor="bg-[#F43F5E]"
            />
        </section>

        {/* Charts Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Area Chart: Faturamento */}
           <Card className="lg:col-span-2 bg-[#111] border-white/5 rounded-[2.5rem] overflow-hidden p-8 lg:p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <div className="space-y-4">
                  <h3 className="text-xl lg:text-2xl font-black tracking-tight text-white">Faturamento Mensal</h3>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                       <span className="text-[10px] uppercase font-black tracking-widest text-white/50">Este Ano</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
                       <span className="text-[10px] uppercase font-black tracking-widest text-white/50">Ano Anterior</span>
                    </div>
                  </div>
                </div>
                <div className="p-2 rounded-xl hover:bg-white/5 cursor-pointer text-gray-500">
                  <MoreHorizontal className="w-5 h-5" />
                </div>
              </div>
              <div className="h-[400px] w-full mt-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorThisYear" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff03" />
                      
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "#4B4E6D", fontSize: 10, fontWeight: "bold" }}
                        dy={15}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "#4B4E6D", fontSize: 10, fontWeight: "bold" }}
                        tickFormatter={(v) => `R$${v/1000}k`}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={false} />
                      <Area 
                        type="monotone" 
                        dataKey="thisYear" 
                        stroke="#0ea5e9" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorThisYear)" 
                        animationDuration={2000}
                        activeDot={{ r: 6, fill: "#0ea5e9", strokeWidth: 2, stroke: "#fff" }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="lastYear" 
                        stroke="#2D2D44" 
                        strokeWidth={4}
                        fill="none"
                        animationDuration={2000}
                        activeDot={false}
                      />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           {/* Donut Chart: Pagamentos */}
           <Card className="bg-[#111] border-white/5 rounded-[2.5rem] p-8 lg:p-10 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-xl lg:text-2xl font-black tracking-tight text-white leading-none">Meios de Pagamento</h3>
                <button className="bg-white/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-sky-400 group flex items-center gap-1.5 hover:bg-white/10 transition-all">
                  Ver Todos <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center py-6 relative">
                <div className="relative w-64 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodsData}
                        innerRadius={75}
                        outerRadius={105}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={10}
                      >
                        {paymentMethodsData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color} 
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black tracking-tighter text-white">100%</span>
                    <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-[0.3em] mt-1">Total</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 mt-10">
                {paymentMethodsData.map((item) => (
                  <div key={item.name} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest px-1">
                      <span className="text-gray-500">{item.name}</span>
                      <span className="text-white">{item.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                       <motion.div 
                         initial={{ width: 0 }}
                         whileInView={{ width: `${item.value}%` }}
                         viewport={{ once: true }}
                         transition={{ duration: 1.5, ease: "easeOut" }}
                         className="h-full rounded-full" 
                         style={{ backgroundColor: item.color }} 
                       />
                    </div>
                  </div>
                ))}
              </div>
           </Card>
        </section>

        {/* Bottom Lists Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
           <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-3 uppercase">
                  <FileText className="w-5 h-5 text-sky-500" />
                  Orçamentos Recentes
                </h3>
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500 hover:opacity-80 transition-opacity">
                  Ver Tudo
                </button>
              </div>

              <Card className="bg-[#111] border-white/5 rounded-[2.5rem] overflow-hidden p-6 lg:p-8 shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5">
                          <th className="pb-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">Serviço</th>
                          <th className="pb-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 text-center">Status</th>
                          <th className="pb-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/2">
                        {mockQuotes.map((q) => (
                          <tr key={q.id} className="group hover:bg-white/[0.01] transition-colors">
                            <td className="py-5">
                              <div className="flex flex-col">
                                <span className="font-bold text-sm tracking-tight text-white leading-tight">{q.service_type}</span>
                                <span className="text-[10px] text-gray-700 font-bold mt-0.5 tracking-tight uppercase">{format(new Date(q.created_at), "dd/MM/yyyy")}</span>
                              </div>
                            </td>
                            <td className="py-5 text-center">
                              <Badge className={`${statusColors[q.status]} border-none rounded-lg px-3 py-1 font-black text-[9px] uppercase tracking-wider`}>
                                {statusLabels[q.status]}
                              </Badge>
                            </td>
                            <td className="py-5 text-right">
                              <button className="p-2.5 rounded-xl hover:bg-white/5 text-gray-700 hover:text-white transition-all">
                                <ArrowUpRight className="w-4 h-4" />
                              </button>
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
                <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-3 uppercase">
                  <FolderOpen className="w-5 h-5 text-emerald-500" />
                  Projetos Ativos
                </h3>
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-white transition-colors">
                  Ver Todos
                </button>
              </div>

              <Card className="bg-[#111] border-white/5 rounded-[2.5rem] overflow-hidden p-6 lg:p-8 shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5">
                          <th className="pb-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">Projeto</th>
                          <th className="pb-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 text-center">Progresso</th>
                          <th className="pb-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/2">
                        {mockProjects.map((p) => (
                          <tr key={p.id} className="group hover:bg-white/[0.01] transition-colors">
                            <td className="py-5">
                              <div className="flex flex-col">
                                <span className="font-bold text-sm tracking-tight text-white leading-tight">{p.title}</span>
                                <span className="text-[10px] text-gray-700 font-bold mt-0.5 tracking-tight uppercase">Previsão: {format(new Date(p.end_date), "dd/MM/yyyy")}</span>
                              </div>
                            </td>
                            <td className="py-5">
                              <div className="flex flex-col gap-2 w-32 mx-auto">
                                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      whileInView={{ width: `${p.progress}%` }}
                                      viewport={{ once: true }}
                                      transition={{ duration: 1.5, ease: "easeOut" }}
                                      className={`h-full rounded-full ${p.status === 'completed' ? 'bg-emerald-500' : 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.3)]'}`} 
                                    />
                                 </div>
                              </div>
                            </td>
                            <td className="py-5 text-right">
                              <Badge className={`${statusColors[p.status]} border-none rounded-lg px-3 py-1 font-black text-[9px] uppercase tracking-wider`}>
                                {statusLabels[p.status]}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
           </div>
        </section>

        {/* Final CTA Bar */}
        <div className="pt-16 flex items-center justify-center">
          <Link to="/auth" className="w-full max-w-2xl px-4">
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full h-20 rounded-[2rem] bg-sky-500 text-white font-black text-lg lg:text-xl flex items-center justify-center gap-4 shadow-2xl shadow-sky-500/30 transition-shadow hover:shadow-sky-500/50"
            >
              Gostou? Comece sua Jornada Vincere Agora 
              <ArrowUpRight className="w-6 h-6" />
            </motion.button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default DemoDashboard;
