import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { BarChart3, Users, Clock, CheckCircle2, AlertCircle, Search, Wifi, ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";

// Animated counter hook
const useCounter = (end: number, duration: number = 2000, inView: boolean = false) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!inView || hasStarted) return;
    setHasStarted(true);
    
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end * 10) / 10);
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration, hasStarted]);

  return count;
};

const SaasDashboardReveal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(dashboardRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.85, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.2], [8, 0]);

  // Static counter values for demonstration
  const totalRecebido = 5420;
  const novosLeads = 42;
  const percentGrowth = 12;

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
                      +{percentGrowth}% <span className="text-muted-foreground ml-1 font-medium">vs. ontem</span>
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

                {/* Users List */}
                <div className="space-y-4">
                  <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Gestão de Leads</h4>
                  <div className="space-y-3">
                    {[
                      { name: "Mariana Silva", status: "Concluída", time: "Há 12m", color: "text-green-600", bg: "bg-green-100/50", border: "border-green-100", value: "Plano Premium" },
                      { name: "Carlos Eduardo", status: "Em Negociação", time: "Há 45m", color: "text-amber-600", bg: "bg-amber-100/50", border: "border-amber-100", value: "Proposta Enviada" },
                      { name: "Ana Clara", status: "Novo Lead", time: "Há 2h", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", value: "Aguardando Contato" },
                    ].map((user, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.5 + i * 0.15 }}
                        className="flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${user.bg} ${user.color}`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-foreground">{user.name}</div>
                            <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{user.time} • Origem: Instagram</div>
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
