import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef, useMemo } from "react";

interface CharProps {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

const Char = ({ char, index, total, progress }: CharProps) => {
  const baseStart = (index / total) * 0.45;
  const start = baseStart;
  const end = start + 0.08;

  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [30, 0]);
  const scale = useTransform(progress, [start, end], [0.9, 1]);
  const blur = useTransform(progress, [start, end], ["10px", "0px"]);
  
  // Glow that appears and fades
  const glowOpacity = useTransform(progress, [start, end, end + 0.05], [0, 1, 0]);
  const color = useTransform(
    progress,
    [start, end, end + 0.04],
    ["hsl(217 91% 60%)", "hsl(217 91% 60%)", "currentColor"]
  );

  return (
    <motion.span 
      style={{ 
        opacity, 
        y, 
        scale, 
        filter: blur,
        color,
        textShadow: useTransform(
          glowOpacity,
          [0, 1],
          ["0 0 0px transparent", "0 0 40px hsl(217 91% 60% / 0.6), 0 0 80px hsl(217 91% 60% / 0.3)"]
        ),
      }}
      className="inline-block"
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
};

const IntroText = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "end 40%"]
  });

  // Progress bar height
  const progressHeight = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);
  const progressOpacity = useTransform(scrollYProgress, [0, 0.05, 0.5, 0.55], [0, 1, 1, 0]);
  
  // Background radial glow
  const bgGlowOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5], [0, 0.6, 0]);
  const bgGlowScale = useTransform(scrollYProgress, [0, 0.3], [0.5, 1.2]);

  const segments = [
    { text: "NA ", style: "font-sans-black" },
    { text: "VINCERE, ", style: "font-serif italic" },
    { text: "NÃO APENAS CRIAMOS ", style: "font-sans-black opacity-40 text-sm md:text-[2vw]" },
    { text: "IDENTIDADES. ", style: "font-serif italic intro-italic-word" },
    { text: "DESENVOLVEMOS ", style: "font-sans-black" },
    { text: "ECOSSISTEMAS ", style: "font-serif italic intro-italic-word" },
    { text: "DIGITAIS ", style: "font-sans-black" },
    { text: "MOVIDOS POR ", style: "font-sans-black opacity-40 text-sm md:text-[2vw]" },
    { text: "INTELIGÊNCIA. ", style: "font-serif italic text-primary intro-italic-word" },
    { text: "PARA QUEM ", style: "font-sans-black opacity-40 text-sm md:text-[2vw]" },
    { text: "NÃO ACEITA O ", style: "font-sans-black" },
    { text: "COMUM. ", style: "font-serif italic uppercase intro-italic-word" },
    { text: "SINCRONIZADOS.", style: "font-sans-black" },
  ];

  const processedWords = useMemo(() => {
    let globalCharIndex = 0;
    const allCharsCount = segments.reduce((sum, s) => sum + s.text.length, 0);

    return segments.flatMap((segment) => {
      const words = segment.text.split(/(\s+)/).filter(Boolean);
      
      return words.map((word) => {
        const chars = word.split("").map((char) => ({
          char,
          index: globalCharIndex++,
        }));
        
        return {
          originalWord: word,
          style: segment.style,
          chars,
          totalChars: allCharsCount,
          isItalic: segment.style.includes("intro-italic-word"),
        };
      });
    });
  }, []);

  return (
    <section ref={containerRef} className="relative z-10 pt-32 pb-64 bg-background px-4 md:px-24">
      {/* Background Radial Glow */}
      <motion.div 
        style={{ opacity: bgGlowOpacity, scale: bgGlowScale }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full pointer-events-none"
      >
        <div className="w-full h-full rounded-full bg-gradient-radial from-primary/8 via-primary/3 to-transparent blur-3xl" 
          style={{ background: "radial-gradient(circle, hsl(217 91% 60% / 0.08) 0%, hsl(217 91% 60% / 0.02) 50%, transparent 70%)" }}
        />
      </motion.div>

      <div className="container mx-auto relative">
        {/* Vertical Progress Line */}
        <motion.div 
          style={{ opacity: progressOpacity }}
          className="absolute -left-4 md:-left-12 top-0 bottom-0 w-[2px] bg-primary/10 rounded-full overflow-hidden"
        >
          <motion.div 
            style={{ height: progressHeight }}
            className="w-full bg-gradient-to-b from-primary via-primary to-primary/30 rounded-full relative"
          >
            {/* Glowing dot at the bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_12px_4px_hsl(217_91%_60%_/_0.5)]" />
          </motion.div>
        </motion.div>

        <h2 className="relative text-4xl md:text-[5vw] leading-[1.1] tracking-tighter text-foreground max-w-6xl">
          {processedWords.map((word, wIdx) => (
            <span key={wIdx} className={`inline-block ${word.style} relative`}>
              {word.chars.map((c) => (
                <Char 
                  key={c.index}
                  char={c.char}
                  index={c.index}
                  total={word.totalChars}
                  progress={scrollYProgress}
                />
              ))}
              {/* Animated underline for italic words */}
              {word.isItalic && word.originalWord.trim().length > 1 && (
                <motion.span
                  style={{
                    scaleX: useTransform(
                      scrollYProgress,
                      [(word.chars[0].index / word.totalChars) * 0.45 + 0.06, (word.chars[0].index / word.totalChars) * 0.45 + 0.12],
                      [0, 1]
                    ),
                  }}
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-primary/60 to-transparent origin-left"
                />
              )}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
};
export default IntroText;
