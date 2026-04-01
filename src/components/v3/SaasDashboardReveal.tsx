import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { BarChart3, Users, Clock, CheckCircle2, AlertCircle, Search, Wifi } from "lucide-react";

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
      setCount(Math.floor(eased * end));
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
  const inadimplentes = useCounter(14, 1800, isInView && isLoaded);
  const percentGrowth = useCounter(12, 2000, isInView && isLoaded);

  // Simulate loading
  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => setIsLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, [isInView]);

  const barHeights = [35, 55, 45, 70, 60, 85, 75, 92];

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
              Nossa plataforma oferece um dashboard personalizado onde você visualiza as métricas reais do seu negócio. Saiba exatamente quem pagou, quem está inadimplente e como está sua saúde financeira em tempo real.
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

          <motion.div 
            ref={dashboardRef}
            style={{ scale, opacity }}
            className="relative perspective-1000"
          >
            {/* The "Dashboard Mockup" with glassmorphism */}
            <motion.div 
              style={{ rotateX }}
              className="relative z-10 bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden preserve-3d glow-card transition-shadow duration-700"
              whileHover={{ boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.15), 0 32px 80px rgba(59, 130, 246, 0.12), 0 0 120px rgba(59, 130, 246, 0.06)" }}
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
                  {/* Live indicator */}
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-2 relative overflow-hidden shimmer-line">
                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Total Recebido</span>
                    {isLoaded ? (
                      <>
                        <div className="text-2xl font-black text-foreground">
                          R$ {totalRecebido.toLocaleString("pt-BR")}
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="text-[10px] text-green-500 font-bold">+{percentGrowth}.5% este mês</div>
                        </div>
                        {/* Mini progress bar */}
                        <div className="w-full h-1 bg-primary/10 rounded-full overflow-hidden mt-1">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "72%" }}
                            transition={{ duration: 2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full bg-primary rounded-full"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-7 w-28 rounded-lg skeleton-pulse" />
                        <div className="h-3 w-20 rounded skeleton-pulse" />
                      </>
                    )}
                  </div>
                  <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-destructive tracking-wider">Taxa de Churn</span>
                    {isLoaded ? (
                      <>
                        <div className="text-2xl font-black text-foreground">{inadimplentes}%</div>
                        <div className="text-[10px] text-destructive font-bold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Atenção necessária
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-7 w-12 rounded-lg skeleton-pulse" />
                        <div className="h-3 w-24 rounded skeleton-pulse" />
                      </>
                    )}
                  </div>
                </div>

                {/* Mini Line Chart */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Evolução de Receita</h4>
                    <Wifi className="w-3.5 h-3.5 text-primary live-indicator" />
                  </div>
                  <div className="relative h-20">
                    <svg viewBox="0 0 280 70" className="w-full h-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity="0" />
                        </linearGradient>
                        <clipPath id="sweepClip">
                          <motion.rect 
                            x="0" y="0" width="280" height="70"
                            initial={{ width: 0 }}
                            animate={isLoaded ? { width: 280 } : {}}
                            transition={{ duration: 1.8, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
                          />
                        </clipPath>
                      </defs>
                      
                      {/* Grid lines inside SVG */}
                      <g stroke="rgba(0,0,0,0.04)" strokeWidth="1">
                        <line x1="0" y1="10" x2="280" y2="10" />
                        <line x1="0" y1="35" x2="280" y2="35" />
                        <line x1="0" y1="60" x2="280" y2="60" />
                      </g>

                      {/* Filled area with sweep clip-path */}
                      <path
                        d="M 0,60 C 20,60 15,52 35,52 C 55,52 50,55 70,55 C 90,55 85,40 105,40 C 125,40 120,35 140,35 C 160,35 155,28 175,28 C 195,28 190,18 210,18 C 230,18 225,22 245,22 C 265,22 260,8 280,8 L 280,70 L 0,70 Z"
                        fill="url(#chartGrad)"
                        clipPath="url(#sweepClip)"
                      />
                      {/* Smooth Line */}
                      <motion.path
                        d="M 0,60 C 20,60 15,52 35,52 C 55,52 50,55 70,55 C 90,55 85,40 105,40 C 125,40 120,35 140,35 C 160,35 155,28 175,28 C 195,28 190,18 210,18 C 230,18 225,22 245,22 C 265,22 260,8 280,8"
                        fill="none"
                        stroke="hsl(217 91% 60%)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={isLoaded ? { pathLength: 1 } : {}}
                        transition={{ duration: 1.8, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
                      />
                      {/* End dot */}
                      <motion.circle
                        cx="280" cy="8" r="4"
                        fill="hsl(217 91% 60%)"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 1.9, type: "spring", stiffness: 400, damping: 10 }}
                      />
                      <motion.circle
                        cx="280" cy="8" r="10"
                        fill="hsl(217 91% 60% / 0.25)"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 1.9, type: "spring", stiffness: 200, damping: 20 }}
                      />
                    </svg>
                  </div>
                </div>

                {/* Table Simulation */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm">Alunos Recentes</h4>
                    <Search className="w-4 h-4 text-gray-300" />
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: "Carlos Eduardo", status: "Pago", color: "bg-green-500" },
                      { name: "Mariana Silva", status: "Atrasado", color: "bg-destructive" },
                      { name: "João Pedro", status: "Pago", color: "bg-green-500" }
                    ].map((user, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: 20 }}
                        animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: isLoaded ? 0.8 + i * 0.15 : 0, duration: 0.5 }}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10" />
                          <span className="text-xs font-bold">{user.name}</span>
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-[9px] font-black text-white ${user.color}`}>
                          {user.status}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Overlay shimmer on load */}
              {!isLoaded && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.div>

            {/* Decorative Floating Elements */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 z-20 w-32 h-32 bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 flex flex-col justify-center items-center text-center space-y-2 gradient-border gradient-border-animated"
            >
              <AlertCircle className="w-8 h-8 text-destructive" />
              <div className="text-[10px] font-black leading-tight">Alerta de Inadimplência</div>
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-3xl border-2 border-destructive/20 animate-ping pointer-events-none" style={{ animationDuration: "2s" }} />
            </motion.div>

            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-10 -left-10 z-20 w-40 h-24 bg-foreground text-white rounded-3xl shadow-2xl p-4 flex flex-col justify-center space-y-1 pulse-glow"
            >
              <div className="text-[10px] text-gray-400 font-bold uppercase">Meta Batida</div>
              <div className="text-xl font-black">94.2%</div>
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "94%" } : {}}
                  transition={{ duration: 2, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full" 
                />
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default SaasDashboardReveal;
