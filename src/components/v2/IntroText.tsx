import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef, useMemo } from "react";

interface CharProps {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

const Char = ({ char, index, total, progress }: CharProps) => {
  // Strictly sequential reveal based on character index
  // Each character pops in exactly after the previous one
  const baseStart = (index / total) * 0.45; // Narrower spread for faster completion
  const start = baseStart;
  const end = start + 0.08; // Snappier individual reveal

  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [20, 0]); // Reduced movement for faster perception
  const scale = useTransform(progress, [start, end], [0.95, 1]); // Subtle scale-in for premium feel
  const blur = useTransform(progress, [start, end], ["8px", "0px"]); // Lighter blur for clarity

  return (
    <motion.span 
      style={{ opacity, y, scale, filter: blur }}
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

  // Debug log to ensure scroll is working (can be removed later)
  /* React.useEffect(() => {
    return scrollYProgress.onChange(v => console.log("Intro scroll:", v));
  }, [scrollYProgress]); */

  const segments = [
    { text: "Estar ", style: "italic font-serif" },
    { text: "visível ", style: "italic font-serif" },
    { text: "não é mais o suficiente. ", style: "font-sans font-extrabold" },
    { text: "Tudo ", style: "italic font-serif" },
    { text: "é ", style: "italic font-serif" },
    { text: "sobre ", style: "italic font-serif" },
    { text: "conquistar ", style: "italic font-serif" },
    { text: "a atenção. ", style: "font-sans font-extrabold text-foreground/40" },
    { text: "E ", style: "italic font-serif" },
    { text: "então ", style: "italic font-serif" },
    { text: "avançarmos ", style: "italic font-serif" },
    { text: "juntos. ", style: "italic font-serif" },
    { text: "Sincronizados.", style: "font-sans font-extrabold" },
  ];

  // Process segments into words with characters, keeping a global index
  const processedWords = useMemo(() => {
    let globalCharIndex = 0;
    const allCharsCount = segments.reduce((sum, s) => sum + s.text.length, 0);

    return segments.flatMap((segment) => {
      // Split segment into words but keep spaces
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
          totalChars: allCharsCount
        };
      });
    });
  }, []);

  return (
    <section ref={containerRef} className="relative z-10 pt-32 pb-64 bg-background px-4 md:px-24">
      <div className="container mx-auto relative">
        <h2 className="relative text-4xl md:text-[5vw] leading-[1.1] tracking-tighter text-foreground max-w-6xl">
          {processedWords.map((word, wIdx) => (
            <span key={wIdx} className={`inline-block ${word.style}`}>
              {word.chars.map((c) => (
                <Char 
                  key={c.index}
                  char={c.char}
                  index={c.index}
                  total={word.totalChars}
                  progress={scrollYProgress}
                />
              ))}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
};
export default IntroText;
