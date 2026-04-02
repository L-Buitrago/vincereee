import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import { ArrowUpRight, BarChart, Code2, MessageCircle, TrendingUp, Plus, Check, CheckCheck, Search, Map, Headphones } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);
// Delivery Diagnostic Component with GSAP Scroll Animations
const DeliveryDiagnostic = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      id: "01",
      title: "Diagnóstico",
      desc: "Entendemos sua empresa, processos e desafios para identificar as melhores oportunidades.",
      icon: Search,
      badge: "bg-blue-600"
    },
    {
      id: "02",
      title: "Planejamento",
      desc: "Desenhamos a solução ideal com escopo, tecnologias e cronograma definidos.",
      icon: Map,
      badge: "bg-blue-600"
    },
    {
      id: "03",
      title: "Desenvolvimento",
      desc: "Construímos sua solução com as melhores práticas e tecnologias modernas.",
      icon: Code2,
      badge: "bg-blue-600"
    },
    {
      id: "04",
      title: "Implementação e Suporte",
      desc: "Entregamos, treinamos e acompanhamos para garantir resultados contínuos.",
      icon: Headphones,
      badge: "bg-blue-600"
    }
  ];

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 40%",
        scrub: 1, // Torna o efeito 100% amarrado ao scroll da página
      }
    });

    tl.fromTo(".diag-title", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "none" }
    );

    // Linha azul preenchendo da esquerda pra direita
    tl.fromTo(".diag-line",
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 4, ease: "none" }
    );

    // Os quadrados sobem e aparecem
    tl.fromTo(".diag-box",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, stagger: 1, ease: "power1.out" },
      "-=3.5" // inicia enquanto a linha ainda está sendo desenhada
    );

    // As bolinhas azuis com números aparecem
    tl.fromTo(".diag-badge",
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, stagger: 1, ease: "back.out(2)" },
      "-=3.5"
    );

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full mx-auto mb-32 relative pt-2 pb-16 px-4 md:px-0 z-20">
      <div className="diag-title text-center mb-24 space-y-4">
        <h3 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">O nosso processo de <span className="text-primary">entrega</span></h3>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Do entendimento inicial à implantação final, desenhamos cada etapa orientando para o sucesso do seu negócio.</p>
      </div>
      
      <div className="relative flex flex-col md:flex-row justify-between items-start pt-4">
        {/* Connecting Line (desktop) */}
        <div className="absolute top-[3.5rem] left-[12%] right-[12%] h-[2px] bg-gray-200 hidden md:block rounded-full">
          <div className="diag-line w-full h-full bg-blue-600 origin-left rounded-full" />
        </div>

        {/* Connecting Line (mobile) */}
        <div className="absolute top-0 bottom-0 left-[2.25rem] w-[2px] bg-gray-200 md:hidden rounded-full">
          <div className="diag-line w-full h-full bg-blue-600 origin-top rounded-full" />
        </div>

        {steps.map((step, index) => (
          <div key={step.id} className="diag-box flex md:flex-col flex-row items-center md:items-center text-left md:text-center relative z-10 w-full md:flex-1 gap-6 md:gap-0 mb-12 md:mb-0 group">
             {/* Icon Box */}
            <div className="relative mb-6 md:mb-8 shrink-0">
              <div className="w-16 h-16 md:w-28 md:h-28 rounded-2xl md:rounded-[1.8rem] bg-white border border-gray-200 flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(37,99,235,0.15)] transition-all duration-500 relative z-10">
                <step.icon className="w-8 h-8 md:w-12 md:h-12 text-blue-600/80 group-hover:text-blue-600 transition-colors duration-500" />
              </div>
              
              {/* Badge */}
              <div className={`diag-badge absolute -top-2 -right-2 md:-top-4 md:-right-4 w-7 h-7 md:w-10 md:h-10 rounded-full ${step.badge} shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center text-white font-black text-[10px] md:text-sm z-20`}>
                {step.id}
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 md:px-4">
              <h4 className="text-lg md:text-xl font-bold text-foreground mb-1 md:mb-3">{step.title}</h4>
              <p className="text-muted-foreground text-[13px] md:text-sm font-medium leading-relaxed md:max-w-[240px] md:mx-auto">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// WhatsApp Phone Mockup with animated chat
const WhatsAppMockup = ({ isActive }: { isActive: boolean }) => {
  const [step, setStep] = useState(0);

  const messages = [
    { from: "bot", text: "Olá Maria! 👋 Aqui é da Academia Pulse.", delay: 0.3, time: "14:02" },
    { from: "bot", text: "Notamos que sua mensalidade de R$ 149,90 venceu há 3 dias. Podemos gerar um novo boleto sem juros pra você? 😊", delay: 1.0, time: "14:02" },
    { from: "user", text: "Oi! Sim, por favor! Pode mandar 🙏", delay: 2.2, time: "14:03" },
    { from: "bot", text: "Pronto! Aqui está seu link de pagamento atualizado sem juros:", delay: 3.2, time: "14:03" },
    { from: "bot", text: "🔗 pay.vincere.com/pulse/maria-s", delay: 3.8, time: "14:03", isLink: true },
    { from: "user", text: "Pago! ✅", delay: 5.0, time: "14:05" },
    { from: "bot", text: "Confirmado! Pagamento recebido. Obrigado Maria! 💚", delay: 5.8, time: "14:05" },
  ];

  useEffect(() => {
    if (!isActive) {
      setStep(0);
      return;
    }
    const timers: NodeJS.Timeout[] = [];
    messages.forEach((msg, i) => {
      const timer = setTimeout(() => setStep(i + 1), msg.delay * 1000);
      timers.push(timer);
    });
    return () => timers.forEach(clearTimeout);
  }, [isActive]);

  return (
    <div className="rounded-[34px] bg-[#111b21] border-[3px] border-[#2a3942] shadow-2xl overflow-hidden flex flex-col"
      style={{ width: 330, height: 540 }}
    >
      <div className="flex items-center justify-between px-4 pt-2 pb-1.5 text-white/60">
        <span className="text-[10px] font-semibold">14:02</span>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-1.5 border border-white/40 rounded-sm relative">
            <div className="absolute inset-0.5 bg-green-400 rounded-[1px]" style={{ width: "70%" }} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#1f2c34] border-b border-white/5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-[12px] font-bold shrink-0">
          V
        </div>
        <div className="min-w-0">
          <div className="text-white text-[13px] font-semibold truncate">Vincere • Cobrança</div>
          <div className="text-green-400 text-[11px]">online</div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-2.5 py-2.5 space-y-1.5 bg-[#0b141a] relative"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
      >
        {messages.map((msg, i) => {
          if (i >= step) return null;
          const isUser = msg.from === "user";
          return (
            <motion.div
              key={`${i}`}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] rounded-lg px-3 py-2 relative ${
                isUser 
                  ? "bg-[#005c4b] text-white" 
                  : "bg-[#1f2c34] text-white/90"
              }`}>
                <p className={`text-[12px] leading-[1.4] ${(msg as any).isLink ? "text-blue-400 underline" : ""}`}>
                  {msg.text}
                </p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className="text-[9px] text-white/30">{msg.time}</span>
                  {isUser && <CheckCheck className="w-3 h-3 text-blue-400" />}
                </div>
              </div>
            </motion.div>
          );
        })}

        {step > 0 && step < messages.length && messages[step]?.from === "bot" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-[#1f2c34] rounded-lg px-2.5 py-1.5 flex gap-1">
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-1 h-1 rounded-full bg-white/40" />
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1 h-1 rounded-full bg-white/40" />
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-1 h-1 rounded-full bg-white/40" />
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#1f2c34] border-t border-white/5">
        <div className="flex-1 bg-[#2a3942] rounded-full px-3.5 py-2">
          <span className="text-[11px] text-white/30">Mensagem</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// 3D floating layers visual for Desenvolvimento Premium card
const Premium3DVisual = ({ isInView }: { isInView: boolean }) => {
  const layers = [
    { label: "Design", color: "bg-white", border: "border-gray-200", icon: "✦", iconColor: "text-primary", delay: 0, z: 0 },
    { label: "Backend", color: "bg-primary/5", border: "border-primary/20", icon: "</>" , iconColor: "text-primary", delay: 0.15, z: 20 },
    { label: "Performance", color: "bg-green-50", border: "border-green-200", icon: "⚡", iconColor: "text-green-500", delay: 0.3, z: 40 },
  ];

  return (
    <div className="relative h-28 flex items-center justify-center" style={{ perspective: 600 }}>
      <motion.div
        animate={isInView ? { rotateY: [0, 6, -6, 0], rotateX: [0, 4, -4, 0] } : {}}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full"
      >
        {layers.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: l.delay }}
            className={`absolute w-[85%] rounded-xl border ${l.color} ${l.border} px-3 py-2 flex items-center gap-2.5 shadow-md`}
            style={{
              top: i * 26,
              left: i * 10,
              transform: `translateZ(${l.z}px)`,
              zIndex: i,
            }}
          >
            <span className={`text-sm font-bold ${l.iconColor}`}>{l.icon}</span>
            <span className="text-[11px] font-semibold text-foreground/80">{l.label}</span>
            <motion.div
              animate={{ scaleX: [0, 1] }}
              transition={{ duration: 0.8, delay: l.delay + 0.3 }}
              className="ml-auto h-1 w-10 rounded-full bg-gray-200 overflow-hidden origin-left"
            >
              <motion.div
                animate={{ x: ["-100%", "0%"] }}
                transition={{ duration: 0.8, delay: l.delay + 0.3 }}
                className={`h-full w-full ${l.iconColor.replace("text", "bg").replace("/500", "/400")} rounded-full`}
              />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// Results showcase for the third card
const ResultsShowcase = ({ isInView }: { isInView: boolean }) => {
  const results = [
    { value: 50, suffix: "+", label: "Projetos entregues", color: "text-blue-400", up: true },
    { value: 30, suffix: "+", label: "Clientes ativos", color: "text-green-400", up: true },
    { value: 96, suffix: "%", label: "Satisfação garantida", color: "text-primary", up: true },
  ];

  const [vals, setVals] = useState(results.map(() => 0));

  useEffect(() => {
    if (!isInView) return;
    const controls = results.map((r, i) =>
      animate(0, r.value, {
        duration: 2,
        delay: i * 0.2,
        ease: "easeOut",
        onUpdate: v => setVals(prev => { const c = [...prev]; c[i] = Math.round(v * 10) / 10; return c; }),
      })
    );
    return () => controls.forEach(c => c.stop());
  }, [isInView]);

  return (
    <div className="space-y-2 mt-2">
      {results.map((r, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -12 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.45, delay: i * 0.12 }}
          className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5"
        >
          <span className={`text-xl font-black tabular-nums ${r.color}`}>
            {vals[i]}{r.suffix}
          </span>
          <span className="text-[10px] text-gray-400 font-medium leading-tight">{r.label}</span>
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: i * 0.12 + 0.4 }}
            className="ml-auto text-green-400 text-xs"
          >↑</motion.span>
        </motion.div>
      ))}
    </div>
  );
};

// Animated title with word-by-word reveal
const AnimatedTitle = () => {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-80px" });

  const words = [
    { text: "A", em: false },
    { text: "solução", em: false },
    { text: "perfeita", em: true },
    { text: "para", em: false },
    { text: "o", em: false },
    { text: "seu", em: false },
    { text: "negócio", em: true },
    { text: "com", em: false },
  ];

  return (
    <h2
      ref={ref}
      className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground max-w-4xl"
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 24, filter: "blur(6px)" }}
          transition={{
            duration: 0.55,
            delay: i * 0.09,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`inline-block mr-[0.25em] ${w.em ? "text-primary" : ""}`}
        >
          {w.text}
        </motion.span>
      ))}
    </h2>
  );
};

const BentoServices = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  const isCard1InView = useInView(card1Ref, { once: false, margin: "-80px" });
  const isCard2InView = useInView(card2Ref, { once: true, margin: "-60px" });
  const isCard3InView = useInView(card3Ref, { once: true, margin: "-60px" });

  const [chatActive, setChatActive] = useState(false);
  const wasInView = useRef(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  useEffect(() => {
    if (isCard1InView && !wasInView.current) {
      setChatActive(true);
    }
    if (!isCard1InView && wasInView.current) {
      setChatActive(false);
    }
    wasInView.current = isCard1InView;
  }, [isCard1InView]);

  return (
    <section 
      ref={containerRef}
      className="py-32 w-full bg-[#FAFAFA] relative overflow-hidden" 
      id="solucoes"
    >
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        
        <DeliveryDiagnostic />

        <div className="flex flex-col items-center justify-center text-center mt-8 mb-16 md:mb-24 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-primary uppercase tracking-widest text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            Nossas Soluções
            <Plus className="w-4 h-4" />
          </motion.div>
          <AnimatedTitle />
        </div>

        <motion.div 
          style={{ scale, opacity }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto"
        >
          {/* Card 1: WhatsApp Recovery (Large Left) */}
          <div ref={card1Ref} className="md:col-span-7 group relative flex flex-col overflow-hidden rounded-[2rem] bg-white border border-gray-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 min-h-[720px]">
            <div className="absolute top-0 left-0 w-64 h-64 bg-green-400/10 rounded-full blur-[80px] group-hover:bg-green-400/20 transition-colors duration-500" />
            
            {/* Top row: icon + arrow */}
            <div className="relative z-10 flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center border border-green-100">
                <MessageCircle className="w-7 h-7 text-green-600" />
              </div>
              <ArrowUpRight className="w-6 h-6 text-gray-300 group-hover:text-foreground transition-colors group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" />
            </div>

            {/* Text — positioned top-right, always visible */}
            <div className="relative z-30 md:ml-auto md:text-right md:max-w-[46%] flex flex-col items-end">
              <h3 className="text-3xl font-bold text-foreground mb-3 tracking-tight leading-tight">
                Recuperação via{" "}
                <span className="text-green-500">WhatsApp</span>
              </h3>
              <p className="text-muted-foreground text-sm md:text-base md:ml-auto font-medium leading-relaxed">
                Transforme carrinhos abandonados e mensalidades atrasadas em dinheiro limpo. Disparos com alta taxa de conversão.
              </p>
            </div>

            {/* Phone mockup — properly sized, anchored bottom-left, NOT covering text */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={isCard1InView ? { 
                opacity: 1, 
                scale: 1,
                y: [0, -8, 0] 
              } : {}}
              transition={{ 
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 0.8, type: "spring", stiffness: 100 },
                opacity: { duration: 0.6 }
              } as any}
              className="absolute bottom-14 left-[4%] md:bottom-12 md:left-[6%] z-20"
            >
              <WhatsAppMockup isActive={chatActive} />
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-full h-16 bg-green-600/20 rounded-full blur-[40px] opacity-40 group-hover:opacity-80 transition-opacity duration-700" />
            </motion.div>
          </div>

          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Card 2: Desenvolvimento Premium */}
            <div ref={card2Ref} className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-white border border-gray-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 flex-1 min-h-[250px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-colors duration-500" />
              
              <div className="relative z-10 flex justify-between items-start">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={isCard2InView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10"
                >
                  <Code2 className="w-6 h-6 text-primary" />
                </motion.div>
              </div>

              {/* 3D floating layers visual */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={isCard2InView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="relative z-10 mt-4"
              >
                <Premium3DVisual isInView={isCard2InView} />
              </motion.div>

              <div className="relative z-10 mt-auto pt-6">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={isCard2InView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-2xl font-bold text-foreground mb-2 tracking-tight"
                >
                  Desenvolvimento Premium
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={isCard2InView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.55 }}
                  className="text-muted-foreground text-base font-medium"
                >
                  Landing pages, sites e e-commerces ultra rápidos.
                </motion.p>
              </div>
            </div>

            {/* Card 3: Resultados Comprovados */}
            <div ref={card3Ref} className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-foreground text-white border border-gray-800 p-8 shadow-2xl hover:shadow-[0_20px_60px_rgba(15,23,42,0.4)] transition-all duration-500 flex-1 min-h-[250px]">
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-colors duration-500" />
              
              <div className="relative z-10 flex justify-between items-start">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={isCard3InView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md"
                >
                  <TrendingUp className="w-6 h-6 text-white" />
                </motion.div>
                <ArrowUpRight className="w-6 h-6 text-gray-500 group-hover:text-primary transition-colors group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" />
              </div>

              {/* Results showcase */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={isCard3InView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative z-10"
              >
                <ResultsShowcase isInView={isCard3InView} />
              </motion.div>

              <div className="relative z-10 mt-auto pt-4">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={isCard3InView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  className="text-2xl font-bold text-white mb-2 tracking-tight"
                >
                  Resultados Reais
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={isCard3InView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-gray-400 text-base font-medium"
                >
                  Números que comprovam o impacto da Vincere nos nossos clientes.
                </motion.p>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default BentoServices;
