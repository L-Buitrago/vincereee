import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

// Word component that appears at a random time
const Word = ({ word, delay, style }: { word: string; delay: number; style: string }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ 
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`inline-block mr-[0.3em] ${style}`}
    >
      {word}
    </motion.span>
  );
};

const segments = [
  { text: "Criamos", style: "font-bold" },
  { text: "ecossistemas", style: "font-serif italic text-primary" },
  { text: "digitais", style: "font-bold" },
  { text: "movidos", style: "font-bold opacity-50" },
  { text: "por", style: "font-bold opacity-50" },
  { text: "inteligência.", style: "font-serif italic" },
];

// Generate fresh random delays
const generateDelays = () => {
  const indices = segments.map((_, i) => i);
  const shuffled = [...indices];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const delays: number[] = new Array(segments.length);
  shuffled.forEach((originalIndex, order) => {
    delays[originalIndex] = order * 0.18 + 0.1;
  });
  return delays;
};

const IntroText = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-100px" });
  const [animKey, setAnimKey] = useState(0);
  const [delays, setDelays] = useState(generateDelays);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const wasInView = useRef(false);

  useEffect(() => {
    if (isInView && !wasInView.current) {
      // Entered viewport — re-shuffle and trigger animation
      setDelays(generateDelays());
      setAnimKey(prev => prev + 1);
      setShouldAnimate(true);
    }
    if (!isInView && wasInView.current) {
      // Left viewport — reset so it replays next time
      setShouldAnimate(false);
    }
    wasInView.current = isInView;
  }, [isInView]);

  return (
    <section ref={containerRef} className="relative z-10 py-24 md:py-32 bg-background px-4 md:px-24">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Random word reveal */}
          <div className="lg:col-span-5">
            <h2 className="text-3xl md:text-[3.2vw] leading-[1.15] tracking-tight text-foreground min-h-[4em]">
              {shouldAnimate && segments.map((seg, i) => (
                <Word
                  key={`${animKey}-${i}`}
                  word={seg.text}
                  delay={delays[i]}
                  style={seg.style}
                />
              ))}
            </h2>

            {/* Subtle animated line under text */}
            {shouldAnimate && (
              <motion.div
                key={`line-${animKey}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-[1px] bg-gradient-to-r from-primary/40 via-primary/20 to-transparent mt-8 origin-left max-w-xs"
              />
            )}
          </div>

          {/* Right: Nossa Essência + Image */}
          <div className="lg:col-span-4 lg:col-start-7 flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col gap-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/5 border border-secondary/10 w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                  Nossa Essência
                </span>
              </div>

              <p className="text-base text-foreground/60 leading-relaxed font-medium">
                Nós entregamos marcas com{" "}
                <span className="text-foreground font-bold underline decoration-primary/30 decoration-2 underline-offset-4">
                  objetivos ambiciosos
                </span>{" "}
                através de estratégia e criatividade de alto impacto, unindo os melhores talentos do mercado.
              </p>
              <p className="text-sm text-foreground/40 leading-relaxed">
                Sem nunca comprometer a sanidade da equipe. Focado em performance real.
              </p>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative w-full aspect-[4/3] rounded-[32px] overflow-hidden bg-secondary flex items-center justify-center p-6 group shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <img
                src="https://vendredi-society.com/wp-content/uploads/2024/02/Hero-1.jpg"
                alt="3D Abstract Interaction"
                className="w-full h-full object-contain mix-blend-screen scale-125 group-hover:scale-150 transition-transform duration-[3s]"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-24 h-24 rounded-full bg-primary/10 blur-3xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default IntroText;
