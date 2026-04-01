import { motion, AnimatePresence, useInView } from "framer-motion";
import { TrendingUp, Zap, BarChart3, Target } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Animated counter
const AnimCounter = ({ end, suffix = "", prefix = "", inView }: { end: number; suffix?: string; prefix?: string; inView: boolean }) => {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView || done) return;
    const duration = 2200;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * end));
      if (progress >= 1) {
        setDone(true);
        clearInterval(timer);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, done]);

  return <span>{prefix}{count.toLocaleString("pt-BR")}{suffix}</span>;
};

// SVG Progress Ring
const ProgressRing = ({ progress, size = 80, strokeWidth = 4, color = "hsl(217, 91%, 60%)", delay = 0, inView }: {
  progress: number; size?: number; strokeWidth?: number; color?: string; delay?: number; inView: boolean;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => {
      setOffset(circumference - (progress / 100) * circumference);
    }, delay);
    return () => clearTimeout(timer);
  }, [inView, progress, circumference, delay]);

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="currentColor" strokeWidth={strokeWidth}
        className="text-white/10"
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="progress-ring-circle"
      />
    </svg>
  );
};

const kpis = [
  {
    icon: <TrendingUp className="w-5 h-5" />,
    label: "Conversão",
    value: 47,
    suffix: "%",
    prefix: "+",
    desc: "Taxa de conversão landing → lead",
    ringProgress: 87,
    ringColor: "hsl(142, 71%, 45%)",
    gradient: "from-green-500/20 to-emerald-500/5",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    label: "Recuperados",
    value: 48,
    suffix: "K",
    prefix: "R$ ",
    desc: "Receita recuperada via WhatsApp",
    ringProgress: 94,
    ringColor: "hsl(217, 91%, 60%)",
    gradient: "from-blue-500/20 to-primary/5",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    label: "ROI Médio",
    value: 340,
    suffix: "%",
    prefix: "",
    desc: "Retorno sobre investimento médio",
    ringProgress: 78,
    ringColor: "hsl(280, 80%, 60%)",
    gradient: "from-purple-500/20 to-violet-500/5",
  },
];

const BigTimeReturns = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeKpi, setActiveKpi] = useState(0);

  // Cycle active KPI highlight
  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setActiveKpi(prev => (prev + 1) % kpis.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section ref={sectionRef} className="py-32 bg-background px-4 md:px-24 relative overflow-hidden">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-gradient-radial rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, hsl(217 91% 60% / 0.06) 0%, transparent 60%)" }}
        />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-gradient-radial rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, hsl(280 80% 60% / 0.05) 0%, transparent 60%)" }}
        />
      </div>

      <div className="container mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Big Title */}
          <div>
            <motion.h2 
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.77, 0, 0.18, 1] }}
              className="text-5xl md:text-[5.5vw] font-serif italic leading-[0.95] tracking-tighter text-foreground"
            >
              Feito para <br />
              <span className="relative">
                <span className="underline decoration-2 underline-offset-8 decoration-primary/40">grandes retornos.</span>
              </span>
            </motion.h2>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.77, 0, 0.18, 1] }}
              className="text-muted-foreground text-lg mt-8 max-w-md font-medium"
            >
              Resultados reais, mensuráveis e consistentes. Nossos clientes não apostam — eles investem com clareza.
            </motion.p>
          </div>

          {/* Right Side - KPI Cards */}
          <motion.div 
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.77, 0, 0.18, 1] }}
            className="bg-secondary rounded-[32px] p-8 md:p-10 flex flex-col gap-6 relative overflow-hidden shadow-2xl"
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-primary/[0.02] pointer-events-none" />

            {/* Subtitle */}
            <div className="relative z-10">
              <h3 className="text-white/60 text-center text-base font-medium leading-tight">
                Mais que designs bonitos,{" "}
                <span className="text-white font-bold">resultados que importam.</span>
              </h3>
            </div>

            {/* KPI Stack */}
            <div className="flex flex-col gap-3 relative z-10">
              {kpis.map((kpi, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative rounded-2xl p-5 transition-all duration-500 ${
                    activeKpi === i 
                      ? "glass-light scale-[1.02]" 
                      : "bg-white/[0.04] border border-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Progress Ring */}
                    <div className="relative shrink-0">
                      <ProgressRing 
                        progress={kpi.ringProgress} 
                        size={56} 
                        strokeWidth={3} 
                        color={kpi.ringColor}
                        delay={600 + i * 200}
                        inView={isInView}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-white/80">
                        {kpi.icon}
                      </div>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white">
                          <AnimCounter end={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} inView={isInView} />
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">{kpi.label}</span>
                      </div>
                      <p className="text-white/30 text-xs mt-0.5 truncate">{kpi.desc}</p>
                    </div>

                    {/* Micro indicator */}
                    <div className={`w-2 h-2 rounded-full shrink-0 transition-all duration-500 ${
                      activeKpi === i ? "bg-primary shadow-[0_0_8px_2px_hsl(217_91%_60%_/_0.5)]" : "bg-white/10"
                    }`} />
                  </div>

                  {/* Active glow */}
                  {activeKpi === i && (
                    <motion.div
                      layoutId="kpi-glow"
                      className="absolute inset-0 rounded-2xl border border-primary/20 pointer-events-none"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between relative z-10 pt-2">
              <div className="flex -space-x-2">
                {["from-green-400 to-green-700", "from-blue-400 to-blue-700", "from-purple-400 to-purple-700"].map((g, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 1.2 + i * 0.1, type: "spring", stiffness: 400 }}
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${g} border-2 border-secondary`}
                  />
                ))}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 1.5, type: "spring", stiffness: 400 }}
                  className="w-8 h-8 rounded-full bg-white/10 border-2 border-secondary flex items-center justify-center"
                >
                  <span className="text-[8px] text-white/50 font-bold">+12</span>
                </motion.div>
              </div>
              
              <a 
                href="#cases" 
                className="px-6 py-3 border border-white/20 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all group"
              >
                <span className="flex items-center gap-2">
                  Case Studies
                  <Target className="w-3 h-3 group-hover:rotate-45 transition-transform" />
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BigTimeReturns;
