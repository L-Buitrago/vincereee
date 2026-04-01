import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowUpRight, BarChart, Code2, MessageCircle, TrendingUp, Plus, Check, CheckCheck } from "lucide-react";
import { useRef, useState, useEffect } from "react";

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
    // Reveal messages one by one
    const timers: NodeJS.Timeout[] = [];
    messages.forEach((msg, i) => {
      const timer = setTimeout(() => setStep(i + 1), msg.delay * 1000);
      timers.push(timer);
    });
    return () => timers.forEach(clearTimeout);
  }, [isActive]);

  return (
    <div className="w-[220px] md:w-[240px] rounded-[28px] bg-[#111b21] border-[3px] border-[#2a3942] shadow-2xl overflow-hidden flex flex-col"
      style={{ height: 380 }}
    >
      {/* Phone Status Bar */}
      <div className="flex items-center justify-between px-4 pt-2 pb-1 text-white/60">
        <span className="text-[9px] font-semibold">14:02</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-1.5 border border-white/40 rounded-sm relative">
            <div className="absolute inset-0.5 bg-green-400 rounded-[1px]" style={{ width: "70%" }} />
          </div>
        </div>
      </div>

      {/* WhatsApp Header */}
      <div className="flex items-center gap-2.5 px-3 py-2 bg-[#1f2c34] border-b border-white/5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
          V
        </div>
        <div className="min-w-0">
          <div className="text-white text-[11px] font-semibold truncate">Vincere • Cobrança</div>
          <div className="text-green-400 text-[9px]">online</div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden px-2.5 py-3 space-y-1.5 bg-[#0b141a] relative"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
      >
        {messages.map((msg, i) => {
          if (i >= step) return null;
          const isUser = msg.from === "user";
          return (
            <motion.div
              key={`${i}`}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] rounded-lg px-2.5 py-1.5 relative ${
                isUser 
                  ? "bg-[#005c4b] text-white" 
                  : "bg-[#1f2c34] text-white/90"
              }`}>
                <p className={`text-[10px] leading-[1.4] ${(msg as any).isLink ? "text-blue-400 underline" : ""}`}>
                  {msg.text}
                </p>
                <div className="flex items-center justify-end gap-0.5 mt-0.5">
                  <span className="text-[7px] text-white/30">{msg.time}</span>
                  {isUser && <CheckCheck className="w-2.5 h-2.5 text-blue-400" />}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Typing indicator */}
        {step > 0 && step < messages.length && messages[step]?.from === "bot" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-[#1f2c34] rounded-lg px-3 py-2 flex gap-1">
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-white/40" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-2 px-2.5 py-2 bg-[#1f2c34] border-t border-white/5">
        <div className="flex-1 bg-[#2a3942] rounded-full px-3 py-1.5">
          <span className="text-[9px] text-white/30">Mensagem</span>
        </div>
        <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

const BentoServices = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const isCard1InView = useInView(card1Ref, { once: false, margin: "-80px" });
  const [chatActive, setChatActive] = useState(false);
  const wasInView = useRef(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  // Re-trigger chat animation on viewport enter/leave
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
        
        <div className="flex flex-col items-center justify-center text-center mb-16 md:mb-24 space-y-4">
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
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground max-w-4xl"
          >
            A tríade perfeita <br className="hidden md:block"/> para o seu negócio.
          </motion.h2>
        </div>

        <motion.div 
          style={{ scale, opacity }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto"
        >
          {/* Card 1: WhatsApp Recovery (Large Left) */}
          <div ref={card1Ref} className="md:col-span-7 group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-white border border-gray-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 min-h-[580px]">
            {/* Background Blob */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-green-400/10 rounded-full blur-[80px] group-hover:bg-green-400/20 transition-colors duration-500" />
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="ml-auto flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center border border-green-100">
                  <MessageCircle className="w-7 h-7 text-green-600" />
                </div>
                <ArrowUpRight className="w-6 h-6 text-gray-300 group-hover:text-foreground transition-colors group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" />
              </div>
            </div>

            <div className="relative z-10 mt-auto pt-24 md:ml-auto md:text-right md:max-w-[55%] flex flex-col items-end">
              <h3 className="text-3xl font-bold text-foreground mb-3 tracking-tight">Recuperação via WhatsApp</h3>
              <p className="text-muted-foreground text-lg md:ml-auto font-medium leading-relaxed">
                Transforme carrinhos abandonados e mensalidades atrasadas em dinheiro limpo. Disparos com alta taxa de conversão.
              </p>
            </div>

            {/* Phone Mockup with WhatsApp Chat */}
            <div className="absolute bottom-[-10px] md:bottom-2 left-4 md:left-12 z-20 -rotate-3 group-hover:rotate-0 transition-transform duration-700 scale-[1.05] md:scale-[1.12] origin-bottom-left">
              <WhatsAppMockup isActive={chatActive} />
              {/* Shadow/glow underneath */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-full h-12 bg-green-500/20 rounded-full blur-2xl" />
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Card 2: Web Agency (Top Right) */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-white border border-gray-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 flex-1 min-h-[250px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-colors duration-500" />
              
              <div className="relative z-10 flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
              </div>

              <div className="relative z-10 mt-auto pt-12">
                <h3 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Desenvolvimento Premium</h3>
                <p className="text-muted-foreground text-base font-medium">
                  Landing pages, sites e e-commerces ultra rápidos (como este).
                </p>
              </div>
            </div>

            {/* Card 3: Dashboard SaaS (Bottom Right) */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-foreground text-white border border-gray-800 p-8 shadow-2xl hover:shadow-[0_20px_60px_rgba(15,23,42,0.4)] transition-all duration-500 flex-1 min-h-[250px]">
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-colors duration-500" />
              
              <div className="relative z-10 flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md">
                  <BarChart className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-6 h-6 text-gray-500 group-hover:text-primary transition-colors group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" />
              </div>

              <div className="relative z-10 mt-auto pt-12">
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Métricas & Dashboard</h3>
                <p className="text-gray-400 text-base font-medium">
                  Controle total de alunos ou pacientes em uma plataforma exclusiva.
                </p>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default BentoServices;
