import { motion, useInView, animate } from "framer-motion";
import { ArrowUpRight, Code2, MessageCircle, TrendingUp, Plus, CheckCheck } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useScroll, useTransform } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// ─── Animações SVG únicas por step ───────────────────────────────────────────

/** STEP 1: Lupa varrendo — diagnóstico */
const LupaAnim = ({ progress }: { progress: number }) => {
  const angle = progress * 60 - 30;
  const cx = 22 + progress * 20;
  const cy = 30 + Math.sin(progress * Math.PI * 2.5) * 12;
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      {/* Grade de scan */}
      {[20, 30, 40, 50, 60].map((y) => (
        <line key={y} x1="8" y1={y} x2="72" y2={y} stroke="#dbeafe" strokeWidth="0.8" />
      ))}
      {/* Linha de scan animada */}
      <line
        x1="8" y1={cy} x2="72" y2={cy}
        stroke="#3b82f6" strokeWidth="1"
        strokeOpacity={0.5}
      />
      {/* Corpo da lupa rotacionando */}
      <g transform={`rotate(${angle}, 35, 38)`}>
        <circle cx="32" cy="35" r="15" stroke="#ffffff" strokeWidth="2.8" />
        <line x1="43" y1="46" x2="57" y2="60" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
        {/* Reflexo interno */}
        <path d="M24 28 Q28 24 34 24" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      {/* Ponto de foco */}
      <circle cx={cx} cy={cy} r={3 * (1 - progress * 0.5)} fill="#60a5fa" fillOpacity={0.8} />
      {/* Mira cruzada */}
      <line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} stroke="#60a5fa" strokeWidth="1.5" strokeOpacity={progress * 1} />
      <line x1={cx} y1={cy - 6} x2={cx} y2={cy + 6} stroke="#60a5fa" strokeWidth="1.5" strokeOpacity={progress * 1} />
    </svg>
  );
};

/** STEP 2: Mapa com caminho traçado até X — planejamento */
const MapaAnim = ({ progress }: { progress: number }) => {
  const drawn = progress;
  const showX = progress > 0.78;
  const dotX = 15 + drawn * 50;
  const dotY = 60 - drawn * 40 + Math.sin(drawn * Math.PI * 3) * 10;
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      {/* Grid */}
      {[18, 32, 46, 60].map((y) => (
        <line key={`h${y}`} x1="8" y1={y} x2="72" y2={y} stroke="#dbeafe" strokeWidth="0.8" />
      ))}
      {[18, 32, 46, 60].map((x) => (
        <line key={`v${x}`} x1={x} y1="8" x2={x} y2="72" stroke="#dbeafe" strokeWidth="0.8" />
      ))}
      {/* Caminho sendo desenhado */}
      <path
        d="M15 62 C22 44 30 56 38 40 C46 24 54 36 65 18"
        stroke="#2563eb"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="110"
        strokeDashoffset={110 * (1 - drawn)}
      />
      {/* Ponto A */}
      <circle cx="15" cy="62" r="4" fill="#2563eb" />
      <text x="7" y="74" fontSize="7" fill="#1d4ed8" fontWeight="bold">A</text>
      {/* Destino X */}
      {showX && (
        <g>
          <circle cx="65" cy="18" r="6.5" fill="#2563eb" fillOpacity={(progress - 0.78) / 0.22} />
          <line x1="62" y1="15" x2="68" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="68" y1="15" x2="62" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
      {/* Ponto andando no caminho */}
      {progress > 0.05 && (
        <circle cx={dotX} cy={dotY} r="3.5" fill="#60a5fa" />
      )}
    </svg>
  );
};

/** STEP 3: Terminal digitando código — desenvolvimento */
const CodigoAnim = ({ progress }: { progress: number }) => {
  const lines = [
    { text: "const vincere = {", color: "#60a5fa" },
    { text: "  stack: 'modern',", color: "#94a3b8" },
    { text: "  speed: 'ultra',", color: "#94a3b8" },
    { text: "  quality: 100,", color: "#86efac" },
    { text: "}", color: "#60a5fa" },
  ];
  const totalChars = lines.reduce((s, l) => s + l.text.length, 0);
  const visible = Math.floor(progress * totalChars);
  let filled = 0;
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full" style={{ overflow: "hidden" }}>
      {/* Clip path to keep everything inside */}
      <defs>
        <clipPath id="terminal-clip">
          <rect x="4" y="6" width="72" height="68" rx="6" />
        </clipPath>
      </defs>
      <rect x="4" y="6" width="72" height="68" rx="6" fill="#0f172a" />
      <rect x="4" y="6" width="72" height="14" rx="6" fill="#1e293b" />
      <rect x="4" y="14" width="72" height="6" fill="#1e293b" />
      <circle cx="13" cy="13" r="2.5" fill="#ef4444" />
      <circle cx="21" cy="13" r="2.5" fill="#f59e0b" />
      <circle cx="29" cy="13" r="2.5" fill="#22c55e" />
      {/* All code text clipped inside terminal */}
      <g clipPath="url(#terminal-clip)">
        {lines.map((line, li) => {
          const start = filled;
          filled += line.text.length;
          const chars = Math.max(0, Math.min(line.text.length, visible - start));
          return (
            <text key={li} x="9" y={29 + li * 10} fontSize="7" fontFamily="monospace" fill={line.color}>
              {line.text.slice(0, chars)}
            </text>
          );
        })}
        {/* Cursor */}
        {progress < 1 && (
          <rect
            x={9 + (visible % 20) * 4.2}
            y={22 + Math.min(Math.floor(visible / 20), 4) * 10}
            width="2" height="7" fill="#60a5fa" fillOpacity={0.9}
          />
        )}
      </g>
    </svg>
  );
};

/** STEP 4: Agente de suporte — silhueta fiel ao ícone de referência */
const SuporteAnim = ({ progress }: { progress: number }) => {
  // Fase 1 (0 → 0.45): corpo + cabeça surgem (fade-in + sobe)
  // Fase 2 (0.38 → 0.72): headset + mic aparecem
  // Fase 3 (0.65 → 1.0): ondas de sinal pulsam do microfone
  const bodyP   = Math.min(1, progress / 0.45);
  const slideY  = (1 - bodyP) * 14;
  const headsetP = progress > 0.38 ? Math.min(1, (progress - 0.38) / 0.34) : 0;
  const waveP    = progress > 0.65 ? Math.min(1, (progress - 0.65) / 0.35) : 0;

  return (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">

      {/* ── Ondas de sinal — surgem do microfone ── */}
      {waveP > 0 && [0, 1, 2].map((i) => {
        const show = waveP > i * 0.28;
        if (!show) return null;
        const r = 5 + i * 6;
        const op = ((waveP - i * 0.28) / 0.72) * 0.85;
        return (
          <path
            key={i}
            d={`M ${77 + r * 0.5} ${56 - r * 0.5} A ${r} ${r} 0 0 1 ${77 + r * 0.5} ${56 + r * 0.5}`}
            stroke="#2563eb" strokeWidth="2" strokeLinecap="round"
            strokeOpacity={op} fill="none"
          />
        );
      })}

      {/* ── Corpo (ombros + pescoço) ── */}
      <g opacity={bodyP} transform={`translate(0, ${slideY})`}>

        {/* Ombros — arco largo estilo referência */}
        <path
          d="M 8 96 C 8 76 18 67 30 63 Q 50 57 70 63 C 82 67 92 76 92 96"
          fill="#dbeafe" stroke="#1d4ed8" strokeWidth="3" strokeLinejoin="round"
        />

        {/* Pescoço / colarinho */}
        <path
          d="M 42 55 C 42 60 44 64 50 65 C 56 64 58 60 58 55"
          fill="#dbeafe" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round"
        />

        {/* Cabeça — oval levemente alongada */}
        <ellipse
          cx="50" cy="36" rx="20" ry="19"
          fill="#dbeafe" stroke="#1d4ed8" strokeWidth="3"
        />

        {/* Linha de cabelo / topo da cabeça (leve diferenciação) */}
        <path
          d="M 30 30 C 30 14 70 14 70 30"
          fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="2"
        />
      </g>

      {/* ── Headset ── */}
      <g opacity={headsetP} transform={`translate(0, ${slideY})`}>

        {/* Arco superior do headset */}
        <path
          d="M 26 36 C 26 10 74 10 74 36"
          stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" fill="none"
        />

        {/* Concha esquerda (ear cup) */}
        <rect x="18" y="31" width="11" height="16" rx="5.5"
          fill="#2563eb" stroke="#1d4ed8" strokeWidth="2"
        />

        {/* Concha direita (ear cup) */}
        <rect x="71" y="31" width="11" height="16" rx="5.5"
          fill="#2563eb" stroke="#1d4ed8" strokeWidth="2"
        />

        {/* Braço do microfone — curva suave saindo da concha direita */}
        <path
          d="M 75 46 Q 79 54 76 60"
          stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" fill="none"
        />

        {/* Cápsula do microfone */}
        <ellipse cx="75" cy="63" rx="5" ry="4"
          fill="#2563eb" stroke="#1d4ed8" strokeWidth="2"
        />
      </g>

    </svg>
  );
};



// ─── Step Card individual ─────────────────────────────────────────────────────

const StepCard = ({
  id, title, desc, progress, isActive, children
}: {
  id: string; title: string; desc: string;
  progress: number; isActive: boolean; children: React.ReactNode;
}) => (
  <div className={`
    relative flex flex-row lg:flex-col items-center text-left lg:text-center gap-4 lg:gap-0
    rounded-[1.25rem] lg:rounded-[2rem] p-4 lg:p-10
    border transition-all duration-700
    ${isActive
      ? "bg-white/[0.04] backdrop-blur-md border-blue-500/40 shadow-[0_20px_60px_rgba(37,99,235,0.15)] lg:scale-[1.03]"
      : "bg-white/[0.02] border-white/5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] lg:scale-[0.96] opacity-100 lg:opacity-30"
    }
  `}>
    {/* Badge */}
    <div className="absolute top-3 right-3 lg:-top-4 lg:-right-3 w-7 h-7 lg:w-10 lg:h-10 rounded-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center text-white font-black text-[10px] lg:text-sm z-20">
      {id}
    </div>

    {/* Icon box animado */}
    <div className="w-16 h-16 shrink-0 lg:w-40 lg:h-40 lg:mb-6 rounded-[1rem] lg:rounded-[1.8rem] bg-gradient-to-br from-blue-900/20 via-slate-900/40 to-blue-900/20 border border-white/5 flex items-center justify-center shadow-inner p-1.5 lg:p-3 overflow-hidden">
      {children}
    </div>

    <div className="min-w-0 flex-1 lg:flex-none pr-8 lg:pr-0 lg:contents">
      <h4 className="text-[15px] lg:text-xl font-bold text-white mb-1 lg:mb-2 leading-snug">{title}</h4>
      <p className="text-white/50 text-[12px] lg:text-sm font-medium leading-relaxed lg:max-w-[210px]">
        {desc}
      </p>
    </div>

    {/* Barra ativa */}
    {isActive && (
      <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1.5 rounded-full bg-blue-600 transition-all duration-500" />
    )}
  </div>

);

const MobileStepCard = ({
  id, title, desc, index, children
}: {
  id: string; title: string; desc: string; index: number; children: React.ReactNode;
}) => (
  <motion.article
    initial={{ opacity: 0, y: 34 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.35 }}
    transition={{ duration: 0.55, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    className="relative grid grid-cols-[72px_1fr] sm:grid-cols-[92px_1fr] items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 overflow-hidden"
  >
    <div className="w-[72px] h-[72px] sm:w-[92px] sm:h-[92px] rounded-xl bg-blue-950/40 border border-white/10 p-2 overflow-hidden">
      {children}
    </div>
    <div className="min-w-0 pr-7">
      <span className="block text-primary text-[10px] font-black uppercase tracking-widest mb-1">Etapa {id}</span>
      <h4 className="text-base sm:text-lg font-bold text-white mb-1 leading-tight">{title}</h4>
      <p className="text-white/55 text-xs sm:text-sm font-medium leading-relaxed">{desc}</p>
    </div>
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
  </motion.article>
);

// ─── DeliveryDiagnostic (Scroll Pinned + SVG animados) ───────────────────────
const DeliveryDiagnostic = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [progresses, setProgresses] = useState([0, 0, 0, 0]);
  const [lineProgress, setLineProgress] = useState(0);

  const steps = [
    {
      id: "01", title: "Diagnóstico",
      desc: "Entendemos sua empresa, processos e desafios para identificar as melhores oportunidades.",
    },
    {
      id: "02", title: "Planejamento",
      desc: "Desenhamos a solução ideal com escopo, tecnologias e cronograma definidos.",
    },
    {
      id: "03", title: "Desenvolvimento",
      desc: "Construímos sua solução com as melhores práticas e tecnologias modernas.",
    },
    {
      id: "04", title: "Implementação e Suporte",
      desc: "Entregamos, treinamos e acompanhamos para garantir resultados contínuos.",
    },
  ];

  useGSAP(() => {
    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;

    if (isMobile) return;

    // Pinar a seção enquanto rola — cada step ocupa 500px de scroll
    ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top top",
      end: `+=${steps.length * 550}`,
      pin: true,
      pinSpacing: true,
      scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress;
        const active = Math.min(Math.floor(p * steps.length), steps.length - 1);
        setActiveStep(active);
        setLineProgress(Math.min(p * (steps.length / (steps.length - 1)), 1));
        setProgresses(
          steps.map((_, i) => {
            const start = i / steps.length;
            const end = (i + 1) / steps.length;
            return Math.max(0, Math.min(1, (p - start) / (end - start)));
          })
        );
      },
    });
  }, { scope: wrapperRef });


  const icons = [
    <LupaAnim key="lupa" progress={progresses[0]} />,
    <MapaAnim key="mapa" progress={progresses[1]} />,
    <CodigoAnim key="codigo" progress={progresses[2]} />,
    <SuporteAnim key="suporte" progress={progresses[3]} />,
  ];

  return (
    <div
      ref={wrapperRef}
      className="w-full lg:min-h-screen flex flex-col items-center justify-center py-20 lg:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-secondary"
      id="diagnostico"
    >
      {/* Header */}
      <div className="text-center mb-8 lg:mb-14 space-y-3 max-w-3xl">

        <div className="flex items-center justify-center gap-2 text-primary uppercase tracking-widest text-sm font-semibold">
          <Plus className="w-4 h-4" />
          Diagnóstico de Entrega
          <Plus className="w-4 h-4" />
        </div>
        <h3 className="text-[28px] md:text-5xl lg:text-6xl font-black text-white tracking-tight">
          O nosso processo de <span className="text-primary">entrega</span>
        </h3>
        <p className="text-white/60 text-sm lg:text-lg">
          <span className="lg:hidden">Cada etapa aparece no seu tempo, do diagnóstico à implementação.</span>
          <span className="hidden lg:inline">Role para explorar cada etapa — do diagnóstico à implementação.</span>
        </p>

      </div>

      {/* Cards */}
      <div className="relative w-full max-w-5xl">
        {/* Linha azul conectando (desktop) */}
        <div className="absolute top-[2.6rem] left-[12%] right-[12%] h-[2px] bg-white/10 hidden lg:block rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full origin-left"
            style={{ transform: `scaleX(${lineProgress})`, transition: "none" }}
          />
        </div>

        <div className="hidden lg:grid lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <StepCard
              key={step.id}
              {...step}
              progress={progresses[i]}
              isActive={activeStep >= i}
            >
              {icons[i]}
            </StepCard>
          ))}
        </div>
        <div className="grid lg:hidden grid-cols-1 gap-4">
          {steps.map((step, i) => (
            <MobileStepCard key={step.id} {...step} index={i}>
              {i === 0 && <LupaAnim progress={1} />}
              {i === 1 && <MapaAnim progress={1} />}
              {i === 2 && <CodigoAnim progress={1} />}
              {i === 3 && <SuporteAnim progress={1} />}
            </MobileStepCard>
          ))}
        </div>
      </div>

      {/* Scroll hint (apenas desktop, onde a seção é fixada) */}
      <div
        className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-blue-500 transition-opacity duration-500"
        style={{ opacity: activeStep < 3 ? 1 : 0 }}
      >

        <span className="text-[10px] font-semibold uppercase tracking-widest">
          {activeStep < 0 ? "Role para explorar" : `Etapa ${activeStep + 1} de ${steps.length}`}
        </span>
        <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
          <rect x="1" y="1" width="12" height="20" rx="6" stroke="currentColor" strokeWidth="1.5" />
          <rect x="5.5" y="5" width="3" height="5" rx="1.5" fill="currentColor">
            <animate attributeName="y" values="5;10;5" dur="1.5s" repeatCount="indefinite" />
          </rect>
        </svg>
      </div>
    </div>
  );
};

// ─── WhatsApp Phone Mockup ────────────────────────────────────────────────────
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
    if (!isActive) { setStep(0); return; }
    const timers: NodeJS.Timeout[] = [];
    messages.forEach((msg, i) => {
      const timer = setTimeout(() => setStep(i + 1), msg.delay * 1000);
      timers.push(timer);
    });
    return () => timers.forEach(clearTimeout);
  }, [isActive]);

  return (
    <div className="rounded-[22px] sm:rounded-[28px] lg:rounded-[34px] bg-[#111b21] border-[2.5px] sm:border-[3px] border-[#2a3942] shadow-2xl overflow-hidden flex flex-col w-full max-w-[260px] xs:max-w-[290px] sm:max-w-[320px] lg:max-w-none lg:w-[330px] h-[350px] xs:h-[390px] sm:h-[480px] lg:h-[540px]"
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
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-[12px] font-bold shrink-0">V</div>
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
              <div className={`max-w-[85%] rounded-lg px-3 py-2 relative ${isUser ? "bg-[#005c4b] text-white" : "bg-[#1f2c34] text-white/90"}`}>
                <p className={`text-[12px] leading-[1.4] ${(msg as { isLink?: boolean }).isLink ? "text-blue-400 underline" : ""}`}>{msg.text}</p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className="text-[9px] text-white/30">{msg.time}</span>
                  {isUser && <CheckCheck className="w-3 h-3 text-blue-400" />}
                </div>
              </div>
            </motion.div>
          );
        })}

        {step > 0 && step < messages.length && messages[step]?.from === "bot" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
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

// ─── 3D floating layers ───────────────────────────────────────────────────────
const Premium3DVisual = ({ isInView }: { isInView: boolean }) => {
  const layers = [
    { label: "Design", color: "bg-white", border: "border-gray-200", icon: "✦", iconColor: "text-primary", delay: 0, z: 0 },
    { label: "Backend", color: "bg-primary/5", border: "border-primary/20", icon: "</>", iconColor: "text-primary", delay: 0.15, z: 20 },
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
            style={{ top: i * 26, left: i * 10, transform: `translateZ(${l.z}px)`, zIndex: i }}
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

// ─── Results Showcase ─────────────────────────────────────────────────────────
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
        duration: 2, delay: i * 0.2, ease: "easeOut",
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
          <span className={`text-xl font-black tabular-nums ${r.color}`}>{vals[i]}{r.suffix}</span>
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

// ─── Animated Title ───────────────────────────────────────────────────────────
const AnimatedTitle = () => {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-80px" });
  const words = [
    { text: "A", em: false }, { text: "solução", em: false }, { text: "perfeita", em: true },
    { text: "para", em: false }, { text: "o", em: false }, { text: "seu", em: false },
    { text: "negócio", em: true }, { text: "com", em: false },
  ];
  return (
    <h2 ref={ref} className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground max-w-4xl">
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 24, filter: "blur(6px)" }}
          transition={{ duration: 0.55, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-block mr-[0.25em] ${w.em ? "text-primary" : ""}`}
        >
          {w.text}
        </motion.span>
      ))}
    </h2>
  );
};

// ─── BentoServices (main) ─────────────────────────────────────────────────────
const BentoServices = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  const isCard1InView = useInView(card1Ref, { once: false, margin: "-80px" });
  const isCard2InView = useInView(card2Ref, { once: false, margin: "-60px" });
  const isCard3InView = useInView(card3Ref, { once: false, margin: "-60px" });

  const [chatActive, setChatActive] = useState(false);
  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches
  );
  const wasInView = useRef(false);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  useEffect(() => {
    if (isCard1InView && !wasInView.current) setChatActive(true);
    if (!isCard1InView && wasInView.current) setChatActive(false);
    wasInView.current = isCard1InView;
  }, [isCard1InView]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <>
      {/* ── Seção de diagnóstico (scroll pinned) ── */}
      <DeliveryDiagnostic />

      {/* ── Seção de soluções ── */}
      <section
        ref={containerRef}
        className="py-20 lg:py-32 w-full bg-white relative overflow-hidden"
        id="solucoes"
      >
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col items-center justify-center text-center mb-10 lg:mb-24 space-y-4">
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
            style={isCompact ? undefined : { scale, opacity }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto"
          >
            {/* Card 1: WhatsApp */}
            <div ref={card1Ref} className="lg:col-span-7 group relative flex flex-col gap-4 lg:gap-0 overflow-hidden rounded-[2rem] bg-white border border-gray-100 p-4 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 min-h-0 lg:min-h-[720px]">
              <div className="absolute top-0 left-0 w-64 h-64 bg-green-400/10 rounded-full blur-[80px] group-hover:bg-green-400/20 transition-colors duration-500" />
              <div className="relative z-10 flex justify-between items-start lg:mb-6">
                <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-2xl bg-green-50 flex items-center justify-center border border-green-100">
                  <MessageCircle className="w-5 h-5 lg:w-7 lg:h-7 text-green-600" />
                </div>
                <ArrowUpRight className="w-5 h-5 lg:w-6 lg:h-6 text-gray-300 group-hover:text-foreground transition-colors group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" />
              </div>
              <div className="relative z-20 text-left lg:text-right lg:ml-auto lg:max-w-[46%] flex flex-col items-start lg:items-end">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1.5 sm:mb-3 tracking-tight leading-tight">
                  Recuperação via <span className="text-green-500">WhatsApp</span>
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm lg:text-base font-medium leading-relaxed">
                  Transforme carrinhos abandonados e mensalidades atrasadas em dinheiro limpo.
                </p>
              </div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 30 }}
                animate={isCard1InView ? (isCompact ? { opacity: 1, scale: 1, y: 0 } : { opacity: 1, scale: 1, y: [0, -8, 0] }) : {}}
                transition={{
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 0.8, type: "spring", stiffness: 100 },
                  opacity: { duration: 0.6 }
                }}
                className="relative lg:absolute lg:bottom-12 lg:left-[6%] z-10 flex justify-center w-full lg:w-auto mt-3 lg:mt-0 origin-top clear-both"
              >
                <WhatsAppMockup isActive={chatActive} />
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-full h-16 bg-green-600/10 rounded-full blur-[40px] opacity-40 group-hover:opacity-80 transition-opacity duration-700" />
              </motion.div>
            </div>



            <div className="lg:col-span-5 flex flex-col gap-6">
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
                  >Desenvolvimento Premium</motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={isCard2InView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.55 }}
                    className="text-muted-foreground text-base font-medium"
                  >Landing pages, sites e e-commerces ultra rápidos.</motion.p>
                </div>
              </div>

              {/* Card 3: Resultados */}
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
                  >Resultados Reais</motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={isCard3InView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-gray-400 text-base font-medium"
                  >Números que comprovam o impacto da Vincere nos nossos clientes.</motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default BentoServices;
