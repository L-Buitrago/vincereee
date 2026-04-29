import { useRef, useState } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { Star, Command, Hexagon, Triangle, Circle, Box, Sparkles, Activity, Globe } from "lucide-react";

const testimonials = [
  {
    quote: "O dashboard analítico que a Vincere entregou superou todas as expectativas. A fluidez dos dados e o design limpo transformaram nossa gestão diária.",
    author: "TechFlow Systems",
    role: "Inovação Digital",
    rating: 5,
    highlight: false,
  },
  {
    quote: "Nossa loja virtual de luxo ficou impecável. A velocidade de execução e a estética premium da Vincere são incomparáveis no mercado.",
    author: "LuxLife Boutique",
    role: "E-commerce de Luxo",
    rating: 5,
    highlight: false,
  },
  {
    quote: "O novo site institucional que vocês criaram nos posicionou como líderes. Design disruptivo e extremamente intuitivo.",
    author: "UrbanStyle Studio",
    role: "Moda & Lifestyle",
    rating: 5,
    highlight: true,
  },
  {
    quote: "A integração de IA no nosso dashboard foi um divisor de águas. Eficiência e beleza técnica que nunca vimos em outra agência.",
    author: "NextGen Agency",
    role: "Inteligência de Dados",
    rating: 5,
    highlight: false,
  },
  {
    quote: "Nossa plataforma de vendas escalou 3x mais rápido após o novo design da Vincere. Eles realmente entendem de conversão e luxo.",
    author: "DataSynth",
    role: "Plataforma SaaS",
    rating: 5,
    highlight: false,
  },
  {
    quote: "A velocidade de carregamento do nosso portal é surreal. O design minimalista elevou nossa marca a outro patamar de autoridade mundial.",
    author: "GlobalLog",
    role: "Logística Global",
    rating: 5,
    highlight: false,
  },
  {
    quote: "O dashboard de BI que a Vincere montou é uma obra de arte. Tomar decisões estratégicas agora é visual, rápido e muito prazeroso.",
    author: "FinTech Solutions",
    role: "Serviços Financeiros",
    rating: 5,
    highlight: true,
  },
  {
    quote: "Nossa taxa de conversão no mobile subiu 45% após o redesign. A Vincere não entrega apenas sites, entrega máquinas de vendas reais.",
    author: "PrimeAuto",
    role: "Marketplace Premium",
    rating: 5,
    highlight: false,
  },
  {
    quote: "Ter a inteligência da Vi integrada ao nosso ecossistema mudou o jogo. O atendimento automatizado agora tem o tom de voz da nossa marca.",
    author: "VogueSpace",
    role: "Editorial & Criatividade",
    rating: 5,
    highlight: false,
  },
  {
    quote: "Impressionante como captaram a essência da nossa marca de luxo. O site flui como uma revista digital de alta costura, impecável.",
    author: "Stellar Creative",
    role: "Branding & Design",
    rating: 5,
    highlight: true,
  },
  {
    quote: "O novo dashboard nos permitiu fechar contratos muito maiores. A clareza dos KPIs impressiona qualquer investidor que apresentamos.",
    author: "RetailFlow",
    role: "Gestão de Varejo",
    rating: 5,
    highlight: false,
  },
  {
    quote: "O suporte e a visão estratégica da Vincere são o que os diferencia. Eles pensam no negócio como um todo, não apenas no código.",
    author: "TechNova",
    role: "Consultoria em Tecnologia",
    rating: 5,
    highlight: false,
  },
];

const CARD_WIDTH = 420;
const GAP = 24;
const SPEED = 0.4;

// ─── Componente de Logos Animadas ───────────────────────────────────────────
const CustomLogos = [
  // Logo 1: Nexus Systems (EN)
  <div className="flex items-center gap-2 px-8 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 duration-500">
    <Command className="w-8 h-8 text-blue-500" />
    <span className="text-xl font-bold font-sans text-white tracking-tighter">Nexus Systems</span>
  </div>,
  // Logo 2: Lírios (PT)
  <div className="flex items-center gap-2 px-8 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 duration-500">
    <div className="w-8 h-8 flex items-center justify-center border-2 border-pink-400 rotate-45">
      <span className="text-pink-400 font-serif font-bold text-lg -rotate-45">L</span>
    </div>
    <span className="text-xl font-serif text-white tracking-widest uppercase">Lírios</span>
  </div>,
  // Logo 3: Aura Creative (EN)
  <div className="flex items-center gap-2 px-8 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 duration-500">
    <Hexagon className="w-8 h-8 text-emerald-400" />
    <span className="text-xl font-black font-mono text-white italic tracking-widest uppercase">AURA</span>
  </div>,
  // Logo 4: Fluxo Digital (PT)
  <div className="flex items-center gap-1 px-8 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 duration-500">
    <span className="text-2xl font-black font-sans text-white tracking-tighter uppercase">Fluxo</span>
    <span className="text-2xl font-light font-sans text-white/50 tracking-tighter italic">Digital</span>
  </div>,
  // Logo 5: Drogaria Marcellino (PT)
  <div className="flex items-center gap-2 px-8 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 duration-500">
    <Activity className="w-8 h-8 text-red-500" />
    <div className="flex flex-col -space-y-1">
      <span className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">Drogaria</span>
      <span className="text-xl font-bold font-sans text-white">Marcellino</span>
    </div>
  </div>,
  // Logo 6: Velocity Labs (EN)
  <div className="flex items-center gap-2 px-8 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 duration-500">
    <Globe className="w-8 h-8 text-sky-400" />
    <span className="text-xl font-bold font-sans text-white tracking-wide uppercase italic">Velocity Labs</span>
  </div>,
  // Logo 7: Finanças Digitais (PT)
  <div className="flex items-center gap-2 px-8 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 duration-500">
    <div className="flex -space-x-2">
      <Circle className="w-6 h-6 text-green-500 fill-green-500" />
      <Circle className="w-6 h-6 text-white mix-blend-difference" />
    </div>
    <span className="text-xl font-bold font-sans text-white">Finanças</span>
  </div>,
  // Logo 8: Stellar (EN)
  <div className="flex items-center gap-2 px-8 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 duration-500">
    <Sparkles className="w-8 h-8 text-yellow-400" />
    <span className="text-2xl font-serif italic text-white pr-2">Stellar</span>
  </div>,
];

const LogoMarquee = () => {
  const x = useMotionValue(0);
  // Velocidade diferente para o marquee de logos
  const MARQUEE_SPEED = 0.5;

  // Calculamos uma largura arbitrária ou usamos porcentagem, 
  // mas o framer-motion lida bem com flex e translateX.
  useAnimationFrame((t, dt) => {
    let currentX = x.get();
    currentX -= MARQUEE_SPEED;
    
    // Quando rolar metade do conteúdo duplicado, reseta
    // Assumimos que a largura total é longa o suficiente
    if (currentX <= -1500) {
      currentX += 1500;
    }
    
    x.set(currentX);
  });

  return (
    <div className="mt-24 pt-12 border-t border-white/5 relative overflow-hidden flex flex-col items-center">
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-8">Empresas que confiam na Vincere</div>
      
      <div className="relative w-full flex items-center fade-mask-x py-4">
        <motion.div 
          className="flex whitespace-nowrap items-center" 
          style={{ x }}
        >
          {[...CustomLogos, ...CustomLogos, ...CustomLogos, ...CustomLogos].map((logo, i) => (
            <div key={i} className="flex-shrink-0">
              {logo}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};


const SuccessLogic = () => {
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const totalWidth = testimonials.length * (CARD_WIDTH + GAP);

  useAnimationFrame((t, dt) => {
    if (isDragging) return;
    
    let currentX = x.get();
    currentX -= SPEED;
    
    if (currentX <= -totalWidth) {
      currentX += totalWidth;
    } else if (currentX > 0) {
      currentX -= totalWidth;
    }
    
    x.set(currentX);
  });

  return (
    <section className="py-16 bg-secondary overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-24 mb-12">
        <div className="flex items-center gap-4 text-primary mb-4">
          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.4em]">[ Success Logic ]</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h2 className="text-3xl md:text-5xl font-serif italic text-white tracking-tighter">O que dizem os <br /> nossos parceiros.</h2>
        </div>
      </div>

      <div className="relative cursor-grab active:cursor-grabbing fade-mask-x"
        onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <motion.div 
          className="flex gap-5 pl-4 md:pl-24" 
          style={{ x }}
          drag="x" 
          dragElastic={0.05}
          dragMomentum={true}
          onDragStart={() => setIsDragging(true)} 
          onDragEnd={() => {
            setIsDragging(false);
            let finalX = x.get();
            while (finalX <= -totalWidth) finalX += totalWidth;
            while (finalX > 0) finalX -= totalWidth;
            x.set(finalX);
          }}>
          {[...testimonials, ...testimonials].map((t, i) => (
            <motion.div key={i} whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`min-w-[280px] md:min-w-[340px] rounded-[24px] flex flex-col justify-between shrink-0 relative overflow-hidden group transition-all duration-500 border border-transparent ${t.highlight ? "glass-light hover:bg-[#0ea5e9]/10 hover:border-[#0ea5e9]/30" : "glass-dark hover:bg-[#0ea5e9]/5 hover:border-[#0ea5e9]/20"}`}
              style={{ minHeight: 220 }}>
              <div className={`absolute top-4 right-6 text-6xl font-serif leading-none select-none pointer-events-none transition-colors group-hover:text-sky-500/10 ${t.highlight ? "text-white/[0.06]" : "text-white/[0.04]"}`}>❝</div>
              <div className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[0_0_40px_rgba(14,165,233,0.1)]" />
              
              <div className="relative z-10 p-6 pb-0 flex flex-col flex-1">
                <p className="text-sm md:text-base font-medium leading-relaxed text-white/80 flex-1">"{t.quote}"</p>
              </div>
              
              <div className="relative z-10 p-6 pt-4">
                <div>
                  <p className="font-bold text-[13px] text-white">{t.author}</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mt-0.5">{t.role}</p>
                </div>
              </div>
              {t.highlight && <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Marquee de Logos */}
      <div className="mt-16">
        <LogoMarquee />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
};

export default SuccessLogic;
