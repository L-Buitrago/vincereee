import { motion } from "framer-motion";
import { 
  LayoutDashboard, CreditCard, Package, ShoppingCart, Store, 
  TrendingUp, GitBranch, Settings, ShoppingBag, ArrowUpRight, 
  Search, Bell, User, CheckCircle2, Clock, MoreHorizontal, 
  Rocket, MessageSquare, Sun, Moon, HelpCircle, LogOut, Crown
} from "lucide-react";

const DashboardMockup = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 120, damping: 20 }
    }
  };

  return (
    <div className="w-full h-full bg-[#050505] text-white rounded-[2rem] overflow-hidden flex shadow-2xl border border-white/5 font-sans">
      {/* Sidebar Mockup (Dark Mode) */}
      <div className="w-20 md:w-60 bg-[#000000] border-r border-white/5 flex flex-col pt-8 pb-6 px-3 shrink-0">
        <div className="px-4 mb-10 overflow-hidden flex items-center gap-3">
          <span className="text-xl font-black tracking-tight text-white hidden md:block">Vincere</span>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-hide px-1">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: CreditCard, label: "Pagamentos" },
            { icon: Package, label: "Produtos" },
            { icon: ShoppingCart, label: "Checkouts" },
            { icon: Store, label: "Clientes" },
            { icon: MessageSquare, label: "Mensagens" },
          ].map((item, i) => (
            <div 
              key={i}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                item.active 
                  ? "bg-sky-600/20 text-sky-400 font-bold border border-sky-400/20" 
                  : "text-gray-500 hover:text-white"
              }`}
            >
              <item.icon className={`w-[18px] h-[18px] ${item.active ? "text-sky-400" : ""}`} />
              <span className="text-sm hidden md:block">{item.label}</span>
            </div>
          ))}

          {/* Grouped section */}
          <div className="pt-4 space-y-1.5">
            {[
              { icon: TrendingUp, label: "Upsell" },
              { icon: GitBranch, label: "Funis" },
              { icon: Crown, label: "Painel Admin", color: "text-lime-400" },
            ].map((item, i) => (
               <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-white transition-all">
                  <item.icon className={`w-[18px] h-[18px] ${item.color || ""}`} />
                  <span className="text-sm hidden md:block">{item.label}</span>
               </div>
            ))}
          </div>
        </nav>

        <div className="pt-6 border-t border-white/5 space-y-1 px-1">
          {[
            { icon: Settings, label: "Configurações" },
            { icon: ShoppingBag, label: "Minhas Compras" },
            { icon: HelpCircle, label: "Ajuda" },
            { icon: LogOut, label: "Sair", color: "text-red-500/80" },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-white transition-all ${item.color || ""}`}>
               <item.icon className="w-4 h-4 shrink-0" />
               <span className="hidden md:block whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content (Dark Mode) */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#050505]">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            Dashboard<span className="text-sky-500">.</span>
          </h2>

          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <div className="w-64 h-10 rounded-xl bg-white/5 border border-white/10 pl-10 flex items-center text-xs text-gray-500">
                Pesquisar...
              </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400"><Moon className="w-4 h-4" /></div>
               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400"><Bell className="w-4 h-4" /></div>
               <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold">Admin Developer</p>
                    <p className="text-[10px] text-gray-500">vinceresuporte@gmail.com</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-xs font-bold text-white">AD</div>
               </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            {/* Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {["ONTEM", "HOJE", "SEMANA", "MÊS", "ANO", "TODOS"].map((t, i) => (
                <div key={i} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${t === "TODOS" ? "bg-sky-500 text-white" : "bg-white/5 text-gray-500 hover:bg-white/10"}`}>
                  {t}
                </div>
              ))}
            </div>

            {/* Colored KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Vendas Totais", val: "0", bg: "bg-[#10B981]", icon: CheckCircle2 },
                { title: "Receita Estimada", val: "R$ 0,00", bg: "bg-[#0EA5E9]", icon: ShoppingBag },
                { title: "Projetos Ativos", val: "0", bg: "bg-[#F59E0B]", icon: Package },
                { title: "Taxa de Churn", val: "0.0%", bg: "bg-[#F43F5E]", icon: TrendingUp },
              ].map((card, i) => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                  className={`${card.bg} rounded-3xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}
                >
                   <div className="flex justify-between items-start mb-4 relative z-10">
                     <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                       <card.icon className="w-5 h-5 text-white" />
                     </div>
                     <MoreHorizontal className="w-5 h-5 text-white/50" />
                   </div>
                   <div className="relative z-10">
                     <p className="text-4xl font-black mb-1">{card.val}</p>
                     <p className="text-xs font-bold text-white/80">{card.title}</p>
                   </div>
                   {/* Abstract backgrounds */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-colors" />
                </motion.div>
              ))}
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <motion.div variants={itemVariants} className="lg:col-span-2 bg-[#111111] rounded-[2.5rem] p-8 border border-white/5">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-lg font-bold">Faturamento Mensal</h3>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                         <div className="w-2 h-2 rounded-full bg-sky-500" /> Este Ano
                       </div>
                       <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                         <div className="w-2 h-2 rounded-full bg-gray-700" /> Ano Anterior
                       </div>
                    </div>
                  </div>
                  <div className="h-64 w-full flex flex-col justify-end">
                     <div className="flex-1 flex items-end gap-1 px-4 relative">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between opacity-5 pointer-events-none">
                           {[1, 2, 3, 4].map(l => <div key={l} className="w-full h-px bg-white" />)}
                        </div>
                        {/* Baseline */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
                        
                        {/* Empty chart state text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                           <p className="text-[10px] font-bold text-gray-800 uppercase tracking-[0.3em]">Nenhum dado cadastrado</p>
                        </div>
                     </div>
                     <div className="flex justify-between mt-6 px-1 text-[9px] font-bold text-gray-700 uppercase tracking-widest">
                       {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map(m => <span key={m}>{m}</span>)}
                     </div>
                  </div>
               </motion.div>

               <motion.div variants={itemVariants} className="bg-[#111111] rounded-[2.5rem] p-8 border border-white/5 flex flex-col">
                   <div className="flex items-center justify-between mb-8">
                     <h3 className="text-lg font-bold">Meios de Pagamento</h3>
                     <div className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-bold text-gray-500 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                       Ver Todos <ArrowUpRight className="w-3 h-3" />
                     </div>
                   </div>
                   <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                      <ShoppingCart className="w-12 h-12 mb-4 text-gray-700" />
                      <p className="text-sm font-bold text-gray-700">Sem transações</p>
                   </div>
               </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMockup;
