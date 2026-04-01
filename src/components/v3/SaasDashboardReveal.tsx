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
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.85, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.2], [8, 0]);

  // Counter values
  const totalRecebido = useCounter(48290, 2500, isInView && isLoaded);
  const churnRate = useCounter(2.4, 1800, isInView && isLoaded);
  const percentGrowth = useCounter(12, 2000, isInView && isLoaded);

  // Simulate loading
  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => setIsLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, [isInView]);

  return (
    <section ref={containerRef} className="py-32 bg-white relative overflow-hidden" id="plataforma">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
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
            
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
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
                  {isLoaded ? (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-bold text-foreground tracking-tight"
                    >
                      Vincere Dashboard
                    </motion.span>
                  ) : (
                    <div className="h-4 w-32 rounded-full skeleton-pulse" />
                  )}
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
                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Total Recebido</span>
                    {isLoaded ? (
                      <>
                        <div className="text-3xl font-black text-foreground">
                          R$ {Math.floor(totalRecebido).toLocaleString("pt-BR")}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold">
                          <ArrowUpRight className="w-3 h-3" />
                          +{percentGrowth}% <span className="text-muted-foreground ml-1 font-medium">este mês</span>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <div className="h-8 w-24 rounded-lg skeleton-pulse" />
                        <div className="h-3 w-32 rounded-full skeleton-pulse opacity-50" />
                      </div>
                    )}
                  </div>

                  <div className="p-5 rounded-3xl bg-white border border-gray-100 space-y-3 relative overflow-hidden text-gradient-container">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Taxa de Churn</span>
                    {isLoaded ? (
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-3xl font-black text-foreground">{churnRate.toFixed(1)}%</div>
                          <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold mt-1">
                            <TrendingDown className="w-3 h-3" />
                            -0.4% <span className="text-muted-foreground ml-1 font-medium">redução</span>
                          </div>
                        </div>
                        {/* Tiny Sparkline */}
                        <div className="h-10 w-20">
                          <svg viewBox="0 0 100 40" className="w-full h-full">
                            <motion.path
                              d="M 0,35 Q 10,32 20,38 T 40,25 T 60,30 T 80,15 T 100,5"
                              fill="none"
                              stroke="hsl(217 91% 60%)"
                              strokeWidth="3"
                              strokeLinecap="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 1.5, delay: 0.5 }}
                            />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="h-8 w-12 rounded-lg skeleton-pulse" />
                        <div className="h-3 w-16 rounded-full skeleton-pulse opacity-50" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Evolution Chart */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Evolução de Receita</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Real</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary/20" />
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Meta</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative h-24">
                    <svg viewBox="0 0 280 70" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        d="M 0,60 C 20,60 15,52 35,52 C 55,52 50,55 70,55 C 90,55 85,40 105,40 C 125,40 120,35 140,35 C 160,35 155,28 175,28 C 195,28 190,18 210,18 C 230,18 225,22 245,22 C 265,22 260,8 280,8"
                        fill="none"
                        stroke="hsl(217 91% 60%)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={isLoaded ? { pathLength: 1 } : {}}
                        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                      />
                      <motion.path
                        d="M 0,60 C 20,60 15,52 35,52 C 55,52 50,55 70,55 C 90,55 85,40 105,40 C 125,40 120,35 140,35 C 160,35 155,28 175,28 C 195,28 190,18 210,18 C 230,18 225,22 245,22 C 265,22 260,8 280,8 L 280,70 L 0,70 Z"
                        fill="url(#chartGrad)"
                        initial={{ opacity: 0 }}
                        animate={isLoaded ? { opacity: 1 } : {}}
                        transition={{ duration: 1, delay: 1 }}
                      />
                    </svg>
                  </div>
                </div>

                {/* Users List */}
                <div className="space-y-4">
                  <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Recuperações Recentes</h4>
                  <div className="space-y-2">
                    {[
                      { name: "Carlos Eduardo", time: "Há 2m", value: "R$ 149,90", color: "bg-green-500" },
                      { name: "Mariana Silva", time: "Há 15m", value: "R$ 497,00", color: "bg-green-500" }
                    ].map((user, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: 20 }}
                        animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 1.5 + i * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-primary shadow-sm">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-bold">{user.name}</div>
                            <div className="text-[9px] text-muted-foreground font-medium">{user.time} • WhatsApp</div>
                          </div>
                        </div>
                        <div className="text-xs font-black text-green-600">{user.value}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Decorative Floating Card: Taxa de Churn Evolution */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: 2, duration: 0.8 }}
              className="absolute -bottom-10 -right-6 md:-right-12 z-20 w-44 bg-white border border-gray-100 rounded-3xl shadow-2xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase text-primary tracking-widest">Taxa de Churn</span>
                <TrendingDown className="w-3.5 h-3.5 text-green-500" />
              </div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-black text-foreground leading-none">2.4%</div>
                <div className="text-[9px] font-bold text-green-500 pb-0.5">-0.8%</div>
              </div>
              <div className="h-8 w-full">
                <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                  <motion.path
                    d="M 0,35 Q 25,30 50,20 T 100,10"
                    fill="none"
                    stroke="hsl(217 91% 60%)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 2.2 }}
                  />
                  <motion.circle
                    cx="100" cy="10" r="4"
                    fill="hsl(217 91% 60%)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 4 }}
                  />
                </svg>
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
