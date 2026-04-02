import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { BarChart3, Users, Clock, CheckCircle2, AlertCircle, Search, Wifi, ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";

// Animated counter hook using Framer Motion's animate function
const useCounter = (end: number, duration: number = 2000, inView: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    
    const controls = animate(0, end, {
      duration: duration / 1000,
      ease: [0.33, 1, 0.68, 1], // Custom ease-out
      onUpdate(value) {
        setCount(value);
      }
    });
    
    return () => controls.stop();
  }, [inView, end, duration]);

  return count;
};

const SaasDashboardReveal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.85, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.2], [8, 0]);

  // Animated counter values
  const totalRecebido = useCounter(5234, 2000, isInView);
  const novosLeads = useCounter(41, 1500, isInView);
  const percentGrowth = useCounter(14, 1800, isInView);

  return (
    <section ref={containerRef} className="py-32 bg-white relative overflow-hidden" id="plataforma">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-bold tracking-tight">Gestão Inteligente</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
              Sua empresa na palma <br /> da sua mão. <span className="text-primary">Literalmente.</span>
            </h2>
            
            <p className="text-lg text-muted-foreground font-medium max-w-lg">
              Nossa plataforma oferece um dashboard personalizado onde você visualiza as métricas reais do seu negócio. Saiba exatamente quem pagou, como está o seu <span className="text-primary">Churn</span> e a saúde financeira em tempo real.
            </p>

            <ul className="space-y-4">
              {[
                { icon: Users, text: "Controle total de alunos, pacientes ou clientes." },
                { icon: Clock, text: "Histórico de pagamentos e alertas automáticos." },
                { icon: CheckCircle2, text: "Integração direta com nossa recuperação via WhatsApp." }
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="flex items-center gap-3 text-foreground font-semibold"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  {item.text}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right Side: Dashboard Reveal */}
          <motion.div 
            ref={dashboardRef}
            style={{ scale, opacity }}
            className="relative perspective-1000"
          >
            <motion.div 
              style={{ rotateX }}
              className="relative z-10 bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden preserve-3d shadow-2xl transition-shadow duration-700"
              whileHover={{ boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.1), 0 32px 80px rgba(59, 130, 246, 0.08)" }}
            >
              {/* Header */}
              <div className="h-16 border-b border-gray-50 flex items-center justify-between px-6 bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs">V</div>
                  <span className="text-sm font-bold text-foreground tracking-tight">Vincere Dashboard</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 live-indicator" />
                    <span className="text-[9px] font-bold text-green-600 uppercase tracking-wider">Live</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 space-y-3 relative overflow-hidden">
                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Vendas de Hoje</span>
                    <div className="text-3xl font-black text-foreground">
                      R$ {Math.floor(totalRecebido).toLocaleString("pt-BR")}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold">
                      <ArrowUpRight className="w-3 h-3" />
                      +{Math.floor(percentGrowth)}% <span className="text-muted-foreground ml-1 font-medium">vs. ontem</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-white border border-gray-100 space-y-3 relative overflow-hidden text-gradient-container">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Novos Leads</span>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-3xl font-black text-foreground">{Math.floor(novosLeads)}</div>
                        <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold mt-1">
                          <TrendingUp className="w-3 h-3" />
                          +5% <span className="text-muted-foreground ml-1 font-medium">hoje</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Chart: Upward Trend */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Evolução Mensal</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Receita Real</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative h-48 w-full pt-4">
                    {/* Y-Axis Labels */}
                    <div className="absolute left-[-20px] top-4 bottom-8 flex flex-col justify-between text-[8px] font-bold text-muted-foreground/40">
                      <span>R$ 10k</span>
                      <span>R$ 5k</span>
                      <span>R$ 0</span>
                    </div>

                    <svg viewBox="0 0 280 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="upwardChartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity="0" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="2.5" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* Grid Lines */}
                      <line x1="0" y1="0" x2="280" y2="0" stroke="currentColor" strokeWidth="0.5" className="text-gray-100" />
                      <line x1="0" y1="50" x2="280" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-gray-100" />
                      <line x1="0" y1="100" x2="280" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-gray-100" />

                      {/* Upward Trend Line */}
                      <motion.path
                        d="M 0,90 C 20,95 40,85 60,88 C 90,75 120,80 150,60 C 180,45 220,15 280,5"
                        fill="none"
                        stroke="hsl(217 91% 60%)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glow)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                        transition={{ duration: 2.8, ease: "easeInOut" }}
                      />
                      {/* Upward Trend Area */}
                      <motion.path
                        d="M 0,90 C 20,95 40,85 60,88 C 90,75 120,80 150,60 C 180,45 220,15 280,5 L 280,100 L 0,100 Z"
                        fill="url(#upwardChartGrad)"
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={isInView ? { opacity: 1, scaleY: 1 } : {}}
                        style={{ originY: 1 }}
                        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                      />

                      {/* Data Point Tooltip (Visual) */}
                      {isInView && (
                        <motion.g
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 2.5, duration: 0.6, type: "spring", stiffness: 200 }}
                        >
                          <circle cx="280" cy="5" r="6" fill="hsl(217 91% 60%)" className="drop-shadow-md" />
                          <circle cx="280" cy="5" r="16" fill="hsl(217 91% 60%)" opacity="0.25">
                            <animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.25;0;0.25" dur="2s" repeatCount="indefinite" />
                          </circle>
                          <rect x="240" y="-25" width="40" height="18" rx="6" fill="black" />
                          <text x="260" y="-13" textAnchor="middle" fontSize="9" fill="white" fontWeight="900">+{Math.floor(percentGrowth)}%</text>
                        </motion.g>
                      )}
                    </svg>

                    {/* X-Axis Labels */}
                    <div className="flex justify-between mt-4 px-2 text-[8px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                      <span>Jan</span>
                      <span>Fev</span>
                      <span>Mar</span>
                      <span>Abr</span>
                      <span>Mai</span>
                      <span>Hoje</span>
                    </div>
                  </div>
                </div>

                {/* Users List */}
                <div className="space-y-4 pt-2 border-t border-gray-50">
                  <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Gestão de Leads</h4>
                  <div className="space-y-3">
                    {[
                      { name: "Mariana Silva", status: "Concluída",   time: "Há 12m", color: "text-green-600", bg: "bg-green-100/50", border: "border-green-100", value: "Plano Premium" },
                      { name: "Carlos Eduardo", status: "Em Negociação", time: "Há 45m", color: "text-amber-600", bg: "bg-amber-100/50", border: "border-amber-100", value: "Proposta Enviada" },
                      { name: "Ana Clara",     status: "Novo Lead",   time: "Há 2h",  color: "text-primary",   bg: "bg-primary/10",   border: "border-primary/20",  value: "Aguardando Contato" },
                    ].map((user, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
                        transition={{ delay: 1.5 + i * 0.25, type: "spring", stiffness: 100 }}
                        className="flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${user.bg} ${user.color} ring-1 ring-inset ${user.border}`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-foreground">{user.name}</div>
                            <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{user.time}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                           <div className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${user.bg} ${user.color} ${user.border} border`}>
                             {user.status}
                           </div>
                           <div className="text-[10px] font-bold text-muted-foreground">{user.value}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -left-6 md:-left-12 z-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default SaasDashboardReveal;
