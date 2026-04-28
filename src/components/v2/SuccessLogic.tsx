import { useRef, useState } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { Star } from "lucide-react";

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

const GradientAvatar = ({ name, isHighlight }: { name: string; isHighlight: boolean }) => {
  const colors = [["#3B82F6","#8B5CF6"],["#10B981","#3B82F6"],["#F59E0B","#EF4444"],["#8B5CF6","#EC4899"],["#06B6D4","#3B82F6"]];
  const ci = name.charCodeAt(0) % colors.length;
  const initials = name.split(" ").map(n => n[0]).join("");
  return (
    <div className="relative">
      <div className={`w-14 h-14 rounded-full p-[2px] ${isHighlight ? "gradient-border-animated" : ""}`}
        style={{ background: `linear-gradient(135deg, ${colors[ci][0]}, ${colors[ci][1]})` }}>
        <div className={`w-full h-full rounded-full flex items-center justify-center text-sm font-black ${isHighlight ? "bg-primary" : "bg-secondary"}`}>
          <span className="text-white">{initials}</span>
        </div>
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
    
    // Smooth auto-scroll that respects manual position
    let currentX = x.get();
    currentX -= SPEED;
    
    // Seamless wrap-around logic
    if (currentX <= -totalWidth) {
      currentX += totalWidth;
    } else if (currentX > 0) {
      currentX -= totalWidth;
    }
    
    x.set(currentX);
  });

  return (
    <section className="py-24 bg-secondary overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="container mx-auto px-4 md:px-24 mb-16">
        <div className="flex items-center gap-4 text-primary mb-6">
          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.4em]">[ Success Logic ]</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h2 className="text-4xl md:text-6xl font-serif italic text-white tracking-tighter">O que dizem os <br /> nossos parceiros.</h2>
        </div>
      </div>

      <div className="relative cursor-grab active:cursor-grabbing fade-mask-x"
        onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <motion.div 
          className="flex gap-6 pl-4 md:pl-24" 
          style={{ x }}
          drag="x" 
          dragElastic={0.05}
          dragMomentum={true}
          onDragStart={() => setIsDragging(true)} 
          onDragEnd={() => {
            setIsDragging(false);
            // Normalize position after drag for seamless continuation
            let finalX = x.get();
            while (finalX <= -totalWidth) finalX += totalWidth;
            while (finalX > 0) finalX -= totalWidth;
            x.set(finalX);
          }}>
          {[...testimonials, ...testimonials].map((t, i) => (
            <motion.div key={i} whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`min-w-[340px] md:min-w-[420px] rounded-[28px] flex flex-col justify-between shrink-0 relative overflow-hidden group transition-all duration-500 border border-transparent ${t.highlight ? "glass-light hover:bg-[#0ea5e9]/10 hover:border-[#0ea5e9]/30" : "glass-dark hover:bg-[#0ea5e9]/5 hover:border-[#0ea5e9]/20"}`}
              style={{ minHeight: 300 }}>
              <div className={`absolute top-4 right-6 text-8xl font-serif leading-none select-none pointer-events-none transition-colors group-hover:text-sky-500/10 ${t.highlight ? "text-white/[0.06]" : "text-white/[0.04]"}`}>❝</div>
              <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[0_0_40px_rgba(14,165,233,0.1)]" />
              <div className="relative z-10 p-8 pb-0 flex flex-col flex-1">
                <p className="text-base md:text-lg font-medium leading-relaxed text-white/70 flex-1">"{t.quote}"</p>
              </div>
              <div className="relative z-10 p-8 pt-6">
                <div className="flex items-center gap-4">
                  <GradientAvatar name={t.author} isHighlight={t.highlight} />
                  <div>
                    <p className="font-bold text-sm text-white">{t.author}</p>
                    <p className="text-xs uppercase tracking-widest text-white/30 mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
              {t.highlight && <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />}
            </motion.div>
          ))}
        </motion.div>
        <div className="flex justify-center mt-10 gap-2">
          {testimonials.map((_, i) => (<div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === 0 ? "w-8 bg-primary" : "w-4 bg-white/10"}`} />))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
};

export default SuccessLogic;
