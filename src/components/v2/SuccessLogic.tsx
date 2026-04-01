import { useRef, useState } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "O trabalho da Vincere não é apenas visual; é estratégico. Mudaram a forma como nossos clientes nos percebem.",
    author: "Rodrigo Santos",
    role: "CEO @TechFlow",
    rating: 5,
    highlight: false,
  },
  {
    quote: "A velocidade de execução aliada à qualidade de luxo é algo que nunca vi em outra agência.",
    author: "Mariana Costa",
    role: "Marketing Director @LuxLife",
    rating: 5,
    highlight: false,
  },
  {
    quote: "Transformaram nosso e-commerce em uma experiência de imersão completa. Resultados imediatos.",
    author: "André Luiz",
    role: "Product Owner @UrbanStyle",
    rating: 5,
    highlight: true,
  },
  {
    quote: "A inteligência artificial aplicada ao design trouxe uma eficiência sem precedentes para nossa operação.",
    author: "Juliana Lima",
    role: "COO @NextGen",
    rating: 5,
    highlight: false,
  },
  {
    quote: "A criatividade e expertise técnica trouxeram nossa visão à vida de uma forma excepcional.",
    author: "Carlos Mendes",
    role: "CTO @DataSynth",
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

  useAnimationFrame(() => {
    if (isDragging || isHovered) return;
    const current = x.get();
    const next = current - SPEED;
    if (Math.abs(next) >= totalWidth) { x.set(0); } else { x.set(next); }
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
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-3 pb-2">
            <div className="flex gap-0.5">{[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />))}</div>
            <span className="text-white/40 text-sm font-medium">5.0 de 5 estrelas</span>
          </motion.div>
        </div>
      </div>

      <div className="relative cursor-grab active:cursor-grabbing fade-mask-x"
        onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <motion.div className="flex gap-6 pl-4 md:pl-24" style={{ x }}
          drag="x" dragConstraints={{ left: -totalWidth, right: 0 }} dragElastic={0.1}
          onDragStart={() => setIsDragging(true)} onDragEnd={() => setIsDragging(false)}>
          {[...testimonials, ...testimonials].map((t, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`min-w-[340px] md:min-w-[420px] rounded-[28px] flex flex-col justify-between shrink-0 relative overflow-hidden group ${t.highlight ? "glass-light" : "glass-dark"}`}
              style={{ minHeight: 300 }}>
              <div className={`absolute top-4 right-6 text-8xl font-serif leading-none select-none pointer-events-none ${t.highlight ? "text-white/[0.06]" : "text-white/[0.04]"}`}>❝</div>
              <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: t.highlight ? "inset 0 0 0 1px rgba(59,130,246,0.3), 0 0 30px rgba(59,130,246,0.1)" : "inset 0 0 0 1px rgba(255,255,255,0.1), 0 0 30px rgba(255,255,255,0.03)" }} />
              <div className="relative z-10 p-8 pb-0 flex flex-col flex-1">
                <div className="flex gap-0.5 mb-5">{[...Array(t.rating)].map((_, si) => (<Star key={si} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />))}</div>
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
