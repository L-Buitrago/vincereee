import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, FileText, Loader2, Search, 
  Bell, Moon, Sun, Wallet, Truck, Clock, MoreHorizontal,
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
  AvatarImage,
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
  approved: "bg-premium-green/10 text-premium-green",
  rejected: "bg-red-500/10 text-red-500",
  in_progress: "bg-blue-500/10 text-blue-500",
  completed: "bg-premium-green/10 text-premium-green",
  paused: "bg-premium-text-muted text-premium-text-muted",
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
  { name: "Cartão de Crédito", value: 65, color: "#7C3AED" },
  { name: "Pix", value: 25, color: "#10B981" },
  { name: "Boleto", value: 7, color: "#F59E0B" },
  { name: "Outros", value: 3, color: "#31335A" },
];

const mockQuotes = [
  { id: '1', service_type: 'E-commerce Premium', status: 'approved', created_at: new Date().toISOString() },
  { id: '2', service_type: 'App Mobile iOS', status: 'pending', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', service_type: 'Sistema ERP Web', status: 'in_progress', created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: '4', service_type: 'Consultoria IA', status: 'completed', created_at: new Date(Date.now() - 259200000).toISOString() },
  { id: '5', service_type: 'Landing Page', status: 'rejected', created_at: new Date(Date.now() - 345600000).toISOString() },
];

const mockProjects = [
  { id: '1', title: 'Plataforma Vincere', status: 'in_progress', end_date: new Date(Date.now() + 604800000).toISOString() },
  { id: '2', title: 'App Delivery Rápido', status: 'completed', end_date: new Date().toISOString() },
  { id: '3', title: 'Portal de Notícias', status: 'in_progress', end_date: new Date(Date.now() + 1209600000).toISOString() },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-premium-purple px-4 py-2 rounded-2xl shadow-xl border border-white/20 relative">
        <p className="text-white font-bold text-sm whitespace-nowrap">
          R$ {payload[0].value.toLocaleString()} <span className="text-white/70 font-normal">mensal</span>
        </p>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-premium-purple rotate-45 border-r border-b border-white/20" />
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
            <p className="text-sm font-medium text-white/80">
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
  const [activePeriod, setActivePeriod] = useState("Todos");
  const periods = ["Ontem", "Hoje", "Semana", "Mês", "Ano", "Todos"];

  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white">
      {/* Alert Banner for Demo */}
      <div className="bg-premium-purple/20 border-b border-premium-purple/30 py-2 px-4 text-center">
        <p className="text-[10px] sm:text-xs font-bold text-premium-purple uppercase tracking-widest">
          Modo Visualização: Esta é uma demonstração com dados fictícios
        </p>
      </div>

      {/* Header Area */}
      <header className="flex items-center justify-between p-6 px-8 bg-transparent sticky top-0 z-30 backdrop-blur-sm border-b border-white/5">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight font-display text-white">Analytics Demo</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
            <Input
              className="bg-white/5 border-white/5 pl-10 w-64 text-sm rounded-xl focus-visible:ring-premium-purple text-white"
              placeholder="Pesquisar..."
              disabled
            />
          </div>

          <div className="flex items-center gap-3">
             <button className="p-2.5 bg-white/5 border border-white/5 rounded-xl relative hover:bg-white/10 transition-colors">
               <Bell className="w-4 h-4 text-[#888]" />
             </button>

             <div className="flex items-center gap-4 pl-3 border-l border-white/10 ml-3">

                <div className="flex flex-col items-end">
                   <span className="text-sm font-bold text-white leading-none">Vitor Vincere</span>
                   <span className="text-[10px] text-premium-text-muted mt-0.5">vitor@vincere.tech</span>
                   <Badge variant="outline" className="mt-1 h-5 text-[9px] uppercase tracking-widest font-bold border-violet-500/30 bg-violet-500/5 text-violet-400">
                     Plano Pro
                   </Badge>
                </div>
                <Avatar className="w-10 h-10 rounded-xl border border-white/10 shadow-xl">
                  <AvatarFallback className="bg-violet-500/20 text-violet-400 font-bold text-xs">
                    VV
                  </AvatarFallback>
                </Avatar>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-8 pt-4 space-y-8">
        
        <div className="flex items-center gap-2 mb-2 bg-white/5 p-1 rounded-xl w-fit border border-white/5">
          {periods.map((p, i) => (
            <motion.button
              key={p}
              initial="hidden" animate="visible" variants={fadeUp} custom={i}
              onClick={() => setActivePeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                activePeriod === p ? "bg-violet-500 text-white" : "text-white/30 hover:text-white/60 hover:bg-white/5"
              }`}
            >
              {p}
            </motion.button>
          ))}
          
          <div className="w-[1px] h-4 bg-white/10 mx-1" />

          <Popover>
            <PopoverTrigger asChild>
              <button className="px-3 py-1.5 rounded-lg text-white/40 hover:text-white transition-colors flex items-center gap-2">
                <CalendarIcon className="w-3.5 h-3.5 text-violet-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Calendário</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#0A0A0A] border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden" align="start">
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
            <StatCard 
               title="Vendas Totais" 
               value="1.450" 
               icon={FileText} 
               bgColor="bg-emerald-500" 
            />
            <StatCard 
               title="Receita Estimada" 
               value="R$ 152.840" 
               icon={Wallet} 
               bgColor="bg-sky-500"
            />
            <StatCard 
               title="Projetos Ativos" 
               value="12" 
               icon={Truck} 
               bgColor="bg-amber-500"
            />
            <StatCard 
               title="Taxa de Churn" 
               value="2.4%" 
               icon={Clock} 
               bgColor="bg-rose-500"
            />
        </section>

        {/* Analytics Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Main Revenue Chart */}
           <Card className="lg:col-span-2 bg-[#111] border-white/5 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-8 pb-0 flex items-center justify-between">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">Faturamento Mensal</h3>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-premium-purple flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-premium-purple" />
                      </div>
                      <span className="text-xs font-bold text-white">Este Ano</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-4 h-4 rounded-full border-2 border-slate-700 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                      </div>
                      <span className="text-xs font-bold text-white">Ano Anterior</span>
                    </div>
                  </div>
                </div>
                <div className="p-1 rounded-md hover:bg-white/5 cursor-pointer">
                  <MoreHorizontal className="w-5 h-5 text-premium-text-muted" />
                </div>
              </div>
              <div className="h-[400px] w-full p-4 mt-8 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorThisYear" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#682EC7" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#682EC7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                      
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "#74769A", fontSize: 11, fontWeight: "bold" }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "#74769A", fontSize: 10, fontWeight: "bold" }}
                        tickFormatter={(v) => `R$${v/1000}k`}
                      />
                      <Tooltip 
                        content={<CustomTooltip />}
                        cursor={false}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="thisYear" 
                        stroke="#682EC7" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorThisYear)" 
                        animationDuration={2000}
                        activeDot={false}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="lastYear" 
                        stroke="#4B4E6D" 
                        strokeWidth={4}
                        fill="none"
                        animationDuration={2000}
                        activeDot={false}
                      />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           {/* Metrics Breakdown */}
           <Card className="bg-[#111] border-white/5 rounded-3xl overflow-hidden p-8 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-xl font-bold text-white">Meios de Pagamento</h3>
                <button className="bg-[#252644] px-4 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-2 hover:bg-[#2e2f56] transition-colors">
                  Ver Todos <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center py-6 relative">
                <div className="relative w-56 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodsData}
                        innerRadius={75}
                        outerRadius={100}
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
                    <span className="text-4xl font-extrabold tracking-tighter text-white">100%</span>
                    <span className="text-xs text-premium-text-muted font-bold uppercase tracking-widest mt-1">Total</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 mt-8">
                {paymentMethodsData.map((item) => (
                  <div key={item.name} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-bold px-1">
                      <span className="text-[#9CA3AF]">{item.name}</span>
                      <span className="text-white">{item.value}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-[#1F203D] rounded-full overflow-hidden p-0.5">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${item.value}%` }}
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

        {/* List Areas */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-8">
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-premium-purple" />
                  Orçamentos Recentes
                </h3>
                <button className="text-[10px] font-bold uppercase tracking-widest text-premium-purple flex items-center gap-1 hover:opacity-80 transition-opacity">
                  Ver Tudo
                </button>
              </div>

              <Card className="bg-[#15162D] border-white/5 rounded-3xl overflow-hidden p-0 shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5">
                          <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-premium-text-muted">Serviço</th>
                          <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-premium-text-muted">Status</th>
                          <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-premium-text-muted">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {mockQuotes.map((q) => (
                          <tr key={q.id} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="capitalize font-bold text-sm tracking-tight text-white">{q.service_type}</span>
                                <span className="text-[10px] text-premium-text-muted uppercase">{new Date(q.created_at).toLocaleDateString("pt-BR")}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={`${statusColors[q.status] || "bg-white/5 text-white"} border-none rounded-lg px-2.5 py-0.5 font-bold text-[9px] uppercase tracking-wider`}>
                                {statusLabels[q.status] || q.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <button className="p-2 rounded-lg hover:bg-white/5 text-premium-text-muted hover:text-white transition-all">
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
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-premium-green" />
                  Projetos Ativos
                </h3>
                <button className="text-[10px] font-bold uppercase tracking-widest text-premium-text-muted flex items-center gap-1 hover:text-white transition-colors">
                  Ver Todos
                </button>
              </div>

              <Card className="bg-[#15162D] border-white/5 rounded-3xl overflow-hidden p-0 shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5">
                          <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-premium-text-muted">Projeto</th>
                          <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-premium-text-muted">Progresso</th>
                          <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-premium-text-muted">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {mockProjects.map((p) => (
                          <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-sm tracking-tight text-white">{p.title}</span>
                                <span className="text-[10px] text-premium-text-muted uppercase">Previsão: {new Date(p.end_date).toLocaleDateString("pt-BR")}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1.5 min-w-[100px]">
                                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: p.status === 'completed' ? '100%' : '45%' }}
                                      transition={{ duration: 1, ease: "easeInOut" }}
                                      className={`h-full rounded-full ${p.status === 'completed' ? 'bg-premium-green' : 'bg-premium-purple'}`} 
                                    />
                                 </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={`${statusColors[p.status] || "bg-white/5 text-white"} border-none rounded-lg px-2.5 py-0.5 font-bold text-[9px] uppercase tracking-wider`}>
                                {statusLabels[p.status] || p.status}
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

        {/* Action Bar for Demo */}
        <section className="flex items-center justify-center pt-8 border-t border-white/5">
          <Link to="/auth">
            <Button size="lg" className="bg-premium-purple hover:bg-premium-purple/90 h-14 px-12 font-bold rounded-2xl text-lg shadow-2xl shadow-premium-purple/20 transition-all duration-300 hover:scale-105 gap-3">
              Gostou? Comece sua Jornada Vincere Agora 
              <ArrowUpRight className="w-5 h-5" />
            </Button>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default DemoDashboard;
