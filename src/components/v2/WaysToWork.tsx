import { motion, useMotionValue, useSpring, useTransform, useInView, animate } from "framer-motion";
import { ArrowUpRight, CreditCard, Smartphone, QrCode } from "lucide-react";
import { useRef, useState, useEffect } from "react";

// ─── Magnetic Card (3D tilt on hover) ──────────────────────────────────────────
const MagneticCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── CARD 1: VI Robot Animation ────────────────────────────────────────────────
const VIRobotAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  return (
    <div ref={ref} className="relative w-full h-full flex items-center justify-center py-8">
      {/* Orbiting particles */}
      <div className="absolute inset-0 flex items-center justify-center scale-125 md:scale-150 pointer-events-none">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            animate={isInView ? {
              rotate: 360,
            } : {}}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
            className="absolute"
            style={{
              width: 120 + i * 30,
              height: 120 + i * 30,
            }}
          >
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 4 + (i % 3) * 2,
                height: 4 + (i % 3) * 2,
                top: 0,
                left: "50%",
                background: i % 2 === 0 ? "#3b82f6" : "#60a5fa",
                boxShadow: `0 0 ${8 + i * 2}px ${i % 2 === 0 ? "#3b82f6" : "#60a5fa"}`,
              }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2 + i * 0.5, repeat: Infinity }}
            />
          </motion.div>
        ))}
      </div>

      {/* Robot SVG */}
      <motion.svg
        viewBox="0 0 120 140"
        fill="none"
        className="w-full max-w-[200px] md:max-w-[240px] drop-shadow-[0_20px_50px_rgba(59,130,246,0.3)] relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      >
        {/* Antenna */}
        <motion.line
          x1="60" y1="8" x2="60" y2="24"
          stroke="#60a5fa" strokeWidth="3" strokeLinecap="round"
        />
        <motion.circle
          cx="60" cy="6" r="4"
          fill="#3b82f6"
          animate={isInView ? { r: [4, 6, 4], opacity: [0.7, 1, 0.7] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Head */}
        <rect x="28" y="24" width="64" height="50" rx="16" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        
        {/* Face plate */}
        <rect x="34" y="30" width="52" height="38" rx="12" fill="#0f172a" />
        
        {/* Eyes */}
        <motion.circle
          cx="48" cy="48" r="7"
          fill="#3b82f6"
          animate={isInView ? {
            fill: ["#3b82f6", "#60a5fa", "#3b82f6"],
            r: [7, 8, 7],
          } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="72" cy="48" r="7"
          fill="#3b82f6"
          animate={isInView ? {
            fill: ["#3b82f6", "#60a5fa", "#3b82f6"],
            r: [7, 8, 7],
          } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
        />
        
        {/* Eye glow */}
        <circle cx="48" cy="48" r="3" fill="#93c5fd" opacity="0.8" />
        <circle cx="72" cy="48" r="3" fill="#93c5fd" opacity="0.8" />
        
        {/* Mouth — LED strip */}
        <motion.rect
          x="44" y="58" width="32" height="4" rx="2"
          fill="#3b82f6"
          animate={isInView ? { opacity: [0.4, 1, 0.4], width: [24, 32, 24] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Neck */}
        <rect x="50" y="74" width="20" height="8" rx="3" fill="#1e293b" />
        
        {/* Body */}
        <rect x="24" y="82" width="72" height="42" rx="14" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        
        {/* Chest light */}
        <motion.circle
          cx="60" cy="100"
          r="8"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          animate={isInView ? { 
            r: [6, 10, 6],
            opacity: [0.3, 0.8, 0.3],
            strokeWidth: [2, 3, 2],
          } : {}}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="60" cy="100" r="4"
          fill="#3b82f6"
          animate={isInView ? { opacity: [0.5, 1, 0.5] } : {}}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        
        {/* VI text on chest */}
        <text x="60" y="104" textAnchor="middle" fontSize="10" fontWeight="900" fill="white" letterSpacing="2">VI</text>
        
        {/* Arms */}
        <rect x="10" y="86" width="14" height="30" rx="7" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
        <rect x="96" y="86" width="14" height="30" rx="7" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
      </motion.svg>

      {/* Glow effect under robot */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-primary/20 rounded-full blur-xl" />
    </div>
  );
};

// ─── CARD 2: Timeline Animation ────────────────────────────────────────────────
const TimelineAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  const steps = [
    { label: "Briefing", icon: "📋", delay: 0 },
    { label: "Desenvolvimento", icon: "⚡", delay: 0.6 },
    { label: "Entrega", icon: "🚀", delay: 1.2 },
  ];

  return (
    <div ref={ref} className="flex flex-col gap-0 mt-4 w-full max-w-[200px]">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3 relative">
          {/* Vertical line */}
          {i < steps.length - 1 && (
            <motion.div
              className="absolute left-[15px] top-[32px] w-[2px] bg-current origin-top"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={isInView ? { scaleY: 1, opacity: 0.2 } : {}}
              transition={{ duration: 0.6, delay: step.delay + 0.3 }}
              style={{ height: 28 }}
            />
          )}
          
          {/* Circle + Check */}
          <motion.div
            className="w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 relative z-10"
            initial={{ scale: 0, borderColor: "rgba(255,255,255,0.1)" }}
            animate={isInView ? {
              scale: 1,
              borderColor: "rgba(255,255,255,0.4)",
              backgroundColor: "rgba(255,255,255,0.05)",
            } : {}}
            transition={{ duration: 0.5, delay: step.delay, type: "spring", stiffness: 200 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: step.delay + 0.4, type: "spring", stiffness: 300 }}
              className="text-sm"
            >
              {step.icon}
            </motion.span>
          </motion.div>

          {/* Label */}
          <motion.div
            className="pt-1 pb-5"
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: step.delay + 0.2 }}
          >
            <span className="text-sm font-bold">{step.label}</span>
            <motion.div
              className="flex items-center gap-1 mt-1"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: step.delay + 0.6 }}
            >
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-green-400">
                <motion.path
                  d="M3 8.5 L6.5 12 L13 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 0.4, delay: step.delay + 0.7 }}
                />
              </svg>
              <span className="text-[10px] text-green-400 font-semibold uppercase tracking-wider">Concluído</span>
            </motion.div>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

// ─── CARD 3: Floating Credit Card Animation ────────────────────────────────────
const CreditCardAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  return (
    <div ref={ref} className="relative flex flex-col items-center gap-4 my-2">
      {/* Floating Card */}
      <motion.div
        className="relative w-52 h-32 rounded-2xl overflow-hidden shadow-2xl"
        initial={{ opacity: 0, y: 20, rotateY: -15 }}
        animate={isInView ? {
          opacity: 1,
          y: [0, -6, 0],
          rotateY: [-5, 5, -5],
        } : {}}
        transition={{
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.6 },
        } as any}
        style={{ transformStyle: "preserve-3d", perspective: 800 }}
      >
        {/* Card background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e293b]" />
        
        {/* Holographic shimmer */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(105deg, transparent 30%, rgba(59,130,246,0.15) 45%, rgba(147,197,253,0.1) 50%, rgba(59,130,246,0.15) 55%, transparent 70%)",
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
        />
        
        {/* Chip */}
        <div className="absolute top-5 left-5">
          <div className="w-9 h-7 rounded-[4px] bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 opacity-80" />
        </div>
        
        {/* Contactless icon */}
        <div className="absolute top-5 left-16">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8.5 16.5a5 5 0 0 1 0-9" strokeLinecap="round" />
            <path d="M12 18.5a8 8 0 0 1 0-13" strokeLinecap="round" />
          </svg>
        </div>
        
        {/* Card number */}
        <div className="absolute bottom-12 left-5 flex gap-2.5 text-white/50 text-[10px] font-mono tracking-widest">
          <span>••••</span><span>••••</span><span>••••</span><span className="text-white/70">4521</span>
        </div>
        
        {/* Card holder */}
        <div className="absolute bottom-4 left-5">
          <span className="text-[8px] text-white/30 uppercase tracking-widest block">Titular</span>
          <span className="text-[10px] text-white/60 font-bold tracking-wider">VINCERE TECH</span>
        </div>
        
        {/* Brand logo */}
        <div className="absolute bottom-4 right-5 flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-red-500/80" />
          <div className="w-6 h-6 rounded-full bg-yellow-500/60" />
        </div>
      </motion.div>

      {/* Payment method icons */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
          <CreditCard className="w-3.5 h-3.5 text-white/60" />
          <span className="text-[10px] font-bold text-white/60">Cartão</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
          <QrCode className="w-3.5 h-3.5 text-white/60" />
          <span className="text-[10px] font-bold text-white/60">Pix</span>
        </div>
      </motion.div>
    </div>
  );
};

// ─── CARD 4: Rotating Sphere Animation ─────────────────────────────────────────
const RotatingSphereAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  // Generate points on a sphere using fibonacci distribution
  const numPoints = 24;
  const points = Array.from({ length: numPoints }, (_, i) => {
    const phi = Math.acos(1 - 2 * (i + 0.5) / numPoints);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    return {
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.sin(phi) * Math.sin(theta),
      z: Math.cos(phi),
    };
  });

  // Generate connections (edges) between nearby points
  const connections: [number, number][] = [];
  for (let i = 0; i < numPoints; i++) {
    for (let j = i + 1; j < numPoints; j++) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const dz = points[i].z - points[j].z;
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
      if (dist < 0.95) connections.push([i, j]);
    }
  }

  const R = 70; // sphere radius in SVG units
  const CX = 100, CY = 100; // center

  return (
    <div ref={ref} className="relative w-full flex items-center justify-center my-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, type: "spring", stiffness: 80 }}
        className="relative w-40 h-40"
      >
        {/* CSS spinning wrapper */}
        <div className="w-full h-full animate-[spin_12s_linear_infinite]">
          <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
            {/* Wireframe rings */}
            {[0, 45, 90, 135].map((angle) => (
              <ellipse
                key={angle}
                cx={CX} cy={CY}
                rx={R} ry={R * Math.abs(Math.cos(angle * Math.PI / 180)) * 0.4 + 8}
                stroke="white"
                strokeWidth="1"
                strokeOpacity="0.25"
                transform={`rotate(${angle} ${CX} ${CY})`}
              />
            ))}

            {/* Connections between points */}
            {connections.map(([a, b], i) => {
              const ax = CX + points[a].x * R;
              const ay = CY + points[a].y * R;
              const bx = CX + points[b].x * R;
              const by = CY + points[b].y * R;
              const frontness = (points[a].z + points[b].z) / 2;
              return (
                <line
                  key={`c${i}`}
                  x1={ax} y1={ay} x2={bx} y2={by}
                  stroke="white"
                  strokeWidth="1.5"
                  strokeOpacity={0.15 + Math.max(0, frontness) * 0.4}
                />
              );
            })}

            {/* Points on the sphere */}
            {points.map((p, i) => {
              const px = CX + p.x * R;
              const py = CY + p.y * R;
              const size = 2 + Math.max(0, p.z) * 3;
              const opacity = 0.5 + Math.max(0, p.z) * 0.5;
              return (
                <circle
                  key={`p${i}`}
                  cx={px} cy={py}
                  r={size}
                  fill={i % 3 === 0 ? "#ffffff" : i % 3 === 1 ? "#facc15" : "#22d3ee"}
                  opacity={opacity}
                  style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.8))" }}
                />
              );
            })}
          </svg>
        </div>

        {/* Glow behind sphere */}
        <div className="absolute inset-0 rounded-full bg-white/20 blur-2xl scale-[0.85]" />
      </motion.div>
    </div>
  );
};

// ─── CARD 5: Mini Dashboard Animation ──────────────────────────────────────────
const MiniDashboardAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) { setCount(0); return; }
    const controls = animate(0, 96, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView]);

  const bars = [
    { height: 30, delay: 0 },
    { height: 55, delay: 0.1 },
    { height: 40, delay: 0.2 },
    { height: 70, delay: 0.3 },
    { height: 85, delay: 0.4 },
    { height: 60, delay: 0.5 },
    { height: 95, delay: 0.6 },
  ];

  return (
    <div ref={ref} className="flex flex-col items-center gap-4 my-4 relative z-10">
      {/* Counter */}
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-black text-secondary tabular-nums">{count}</span>
        <span className="text-lg font-bold text-primary">%</span>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-secondary/40">
        Taxa de satisfação
      </span>

      {/* Bar chart */}
      <div className="flex items-end gap-1.5 h-20">
        {bars.map((bar, i) => (
          <motion.div
            key={i}
            className="w-4 rounded-t-md bg-gradient-to-t from-primary to-primary/40"
            initial={{ height: 0 }}
            animate={isInView ? { height: bar.height } : { height: 0 }}
            transition={{ duration: 0.8, delay: bar.delay, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </div>

      {/* Line under chart */}
      <motion.div
        className="w-full h-[1px] bg-secondary/10"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.8 }}
      />
    </div>
  );
};


// ─── Shared Helper: Rolling Text Component (Same as Hero "vendas") ────────────
const RollingText = ({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) => {
  return (
    <motion.span 
      initial="initial"
      whileHover="hover"
      whileInView="reveal"
      viewport={{ once: true }}
      className={`relative inline-flex cursor-default overflow-hidden ${className}`}
    >
      <span className="relative flex whitespace-nowrap">
        {text.split("").map((char, i) => (
          <span key={i} className="relative inline-block">
            <motion.span
              variants={{
                initial: { y: 0, opacity: 1 },
                hover: { y: "-110%", opacity: 0 },
                reveal: { y: 0, opacity: 1 }
              }}
              initial={{ y: "100%", opacity: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: delay + i * 0.03, 
                ease: [0.33, 1, 0.68, 1] 
              }}
              className="inline-block text-gradient relative z-10"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
            <motion.span
              variants={{
                initial: { y: "110%", opacity: 0 },
                hover: { y: 0, opacity: 1 }
              }}
              transition={{ 
                duration: 0.5, 
                delay: i * 0.03, 
                ease: [0.33, 1, 0.68, 1] 
              }}
              className="absolute top-0 left-0 text-gradient-alt"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </span>
        ))}
      </span>
    </motion.span>
  );
};


// ═════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════════
const WaysToWork = () => {
  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, hsl(217 91% 60% / 0.06), transparent 70%)" }} />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, hsl(280 80% 60% / 0.05), transparent 70%)" }} />
      </div>

      <div className="container mx-auto px-4 md:px-24 relative">
        {/* Large Static Title */}
        <div className="mb-20 text-center">
          <div className="flex flex-col items-center">
            <motion.span 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 0.4, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="block italic font-serif text-2xl md:text-[2vw] lowercase mb-6 font-light tracking-normal"
            >
              por que
            </motion.span>
            
            <h2 className="font-extrabold tracking-tight leading-[0.9] text-foreground font-sans uppercase">
              <motion.span 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="block text-5xl md:text-7xl lg:text-8xl mb-2"
              >
                a Vincere é
              </motion.span>
              
              <motion.span 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                className="block text-6xl md:text-8xl lg:text-[10vw] text-gradient-alt bg-clip-text"
              >
                Diferente
              </motion.span>
            </h2>
          </div>
        </div>

        {/* ── Top Row: 3 Cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6 perspective-1000">

          {/* ────── CARD 1: VI — Inteligência Artificial (LARGE) ────── */}
          <MagneticCard className="lg:col-span-8 h-full">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-secondary text-white rounded-[48px] p-10 md:p-14 h-full flex flex-col group cursor-pointer relative overflow-hidden shadow-2xl shimmer-line gradient-border gradient-border-animated"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
              {/* Dot pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "32px 32px"
              }} />

              {/* Top Bar */}
              <div className="relative z-10 flex justify-between items-start mb-auto">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">[ Inteligência Artificial ]</span>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 45 }}
                  className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all shadow-lg"
                >
                  <ArrowUpRight className="w-6 h-6" />
                </motion.div>
              </div>

              {/* Content Grid */}
              <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center my-auto pt-6">
                <div>
                  <h3 className="text-6xl md:text-[5rem] lg:text-[6rem] font-serif italic tracking-tighter mb-6 leading-[0.85]">
                    Conheça <br /> a VI.
                  </h3>
                  <p className="text-white/60 max-w-sm text-lg leading-relaxed">
                    Sua assistente de IA que entende seu negócio, analisa suas necessidades e cria propostas sob medida em segundos.
                  </p>
                </div>
                <div className="flex justify-center lg:justify-end xl:pr-8">
                  <div className="w-full max-w-[280px]">
                    <VIRobotAnimation />
                  </div>
                </div>
              </div>

              {/* Glow on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
          </MagneticCard>

          {/* Right Column */}
          <div className="lg:col-span-4 flex flex-col gap-6 perspective-1000">

            {/* ────── CARD 2: Prazo de Entrega ────── */}
            <MagneticCard className="flex-1">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="bg-muted text-secondary rounded-[48px] p-10 h-full flex flex-col justify-between group cursor-pointer border border-secondary/5 hover:shadow-xl transition-all relative overflow-hidden gradient-border"
              >
                {/* Geometric pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: "linear-gradient(45deg, currentColor 25%, transparent 25%), linear-gradient(-45deg, currentColor 25%, transparent 25%)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px"
                }} />

                <div className="relative z-10 flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">[ Prazo & Entrega ]</span>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 45 }}
                    className="w-10 h-10 rounded-full border border-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-4xl font-extrabold tracking-tight mb-2 leading-tight">Entrega <br />ágil.</h3>
                  <p className="text-secondary/40 text-sm mb-2">Prazos claros e cronograma definido desde o primeiro dia.</p>
                  <TimelineAnimation />
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            </MagneticCard>

            {/* ────── CARD 3: Pagamento Flexível ────── */}
            <MagneticCard className="flex-1">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="bg-primary text-white rounded-[48px] p-10 h-full flex flex-col justify-between group cursor-pointer shadow-xl hover:shadow-[0_20px_60px_-12px_rgba(59,130,246,0.4)] transition-all relative overflow-hidden gradient-border gradient-border-animated"
              >
                <div className="absolute inset-0 opacity-[0.06]" style={{
                  backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "24px 24px"
                }} />

                <div className="relative z-10 flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">[ Pagamento ]</span>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 45 }}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all shadow-md"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-4xl font-extrabold tracking-tight mb-2 leading-tight">Pagamento <br />flexível.</h3>
                  <p className="text-white/50 text-sm">Pix, cartão de crédito. Cancele quando quiser.</p>
                  <CreditCardAnimation />
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            </MagneticCard>
          </div>
        </div>

        {/* ── Bottom Row: 2 Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 perspective-1000">

          {/* ────── CARD 4: Tecnologia Avançada ────── */}
          <MagneticCard>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-primary rounded-[32px] p-10 md:p-12 flex flex-col items-center justify-between min-h-[400px] text-center shadow-2xl relative overflow-hidden group gradient-border gradient-border-animated"
            >
              <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "28px 28px"
              }} />

              <div className="relative z-10 w-full flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">[ Tecnologia ]</span>
              </div>

              <h3 className="text-xl md:text-2xl font-serif italic text-white leading-tight mt-4 relative z-10">
                Stack moderna e <br /> tecnologia de ponta.
              </h3>

              <RotatingSphereAnimation />

              <a href="#about" className="px-8 py-4 bg-white text-primary rounded-full font-bold text-xs uppercase tracking-widest hover:bg-secondary hover:text-white transition-all shadow-xl relative z-10 group/btn">
                <span className="flex items-center gap-2">
                  Nossa stack
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:rotate-45 transition-transform" />
                </span>
              </a>

              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
          </MagneticCard>

          {/* ────── CARD 5: Resultados Transparentes ────── */}
          <MagneticCard>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-[32px] p-10 md:p-12 flex flex-col items-center justify-between min-h-[400px] text-center border border-secondary/5 shadow-2xl relative overflow-hidden group glow-card-hover transition-shadow duration-500"
            >
              <div className="relative z-10 w-full flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary/30">[ Transparência ]</span>
              </div>

              <h3 className="text-xl md:text-2xl font-serif italic text-secondary leading-tight mt-4 relative z-10">
                Resultados na sua mão. <br /> Acompanhe cada métrica.
              </h3>

              <MiniDashboardAnimation />

              <a href="#plataforma" className="px-8 py-4 bg-secondary text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl relative z-10 group/btn">
                <span className="flex items-center gap-2">
                  Ver plataforma
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:rotate-45 transition-transform" />
                </span>
              </a>
            </motion.div>
          </MagneticCard>
        </div>
      </div>
    </section>
  );
};

export default WaysToWork;
