import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const GreekHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Image join animation: Left moves right, Right moves left
  const leftX = useTransform(scrollYProgress, [0, 0.2], ["0%", "20%"]);
  const rightX = useTransform(scrollYProgress, [0, 0.2], ["0%", "-20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);

  return (
    <section ref={containerRef} className="relative h-[150vh] bg-background overflow-hidden">
      {/* The Joining Images Container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        {/* Left Half Image */}
        <motion.div 
          style={{ x: leftX, opacity, scale }}
          className="absolute left-0 w-1/2 h-full overflow-hidden z-20"
        >
          <div className="w-full h-full bg-[url('/greek-placeholder-left.png')] bg-cover bg-right" />
          <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply" />
        </motion.div>

        {/* Right Half Image */}
        <motion.div 
          style={{ x: rightX, opacity, scale }}
          className="absolute right-0 w-1/2 h-full overflow-hidden z-20"
        >
          <div className="w-full h-full bg-[url('/greek-placeholder-right.png')] bg-cover bg-left" />
          <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply" />
        </motion.div>

        {/* Central Logo Overlay */}
        <div className="relative z-30 flex flex-col items-center justify-center text-center w-full px-4 max-w-6xl">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8 px-6 py-2 border border-foreground/10 rounded-full bg-background/50 backdrop-blur-sm"
          >
            <span className="text-[0.7vw] font-bold tracking-[0.3em] uppercase text-foreground/50">
              SOLUÇÕES EM SOFTWARE & INTELIGÊNCIA ARTIFICIAL
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.83, 0, 0.17, 1], delay: 0.5 }}
            className="text-[5.5vw] font-bold tracking-[-0.03em] leading-[1.1] uppercase flex flex-col items-center justify-center w-full mix-blend-difference"
            style={{ fontFamily: "'Aeonik Pro Bold', 'Plus Jakarta Sans', sans-serif" }}
          >
            <span className="block">Tecnologia que acelera</span>
            <AnimatedWord word="resultados." />
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-[1.1vw] font-medium tracking-tight text-foreground/60 mt-8 max-w-[45vw] mx-auto leading-relaxed"
          >
            Desenvolvemos softwares inteligentes e automações com IA para <br className="hidden md:block" />
            empresas que querem crescer com eficiência.
          </motion.p>

        </div>
      </div>
      
      {/* Background Text Shadow */}
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -200]), opacity: useTransform(scrollYProgress, [0, 0.5], [0.05, 0]) }}
        className="absolute bottom-10 left-0 w-full text-center pointer-events-none z-10"
      >
        <span className="text-[25vw] font-black text-foreground uppercase opacity-20">Society</span>
      </motion.div>
    </section>
  );
};

const AnimatedWord = ({ word }: { word: string }) => {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className="relative block overflow-hidden whitespace-nowrap cursor-default"
    >
      <div className="flex">
        {word.split("").map((l, i) => (
          <motion.span
            key={i}
            variants={{
              initial: { y: 0 },
              hovered: { y: "-100%" },
            }}
            transition={{
              duration: 0.4,
              ease: [0.83, 0, 0.17, 1],
              delay: i * 0.03,
            }}
            className="inline-block"
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0 flex">
        {word.split("").map((l, i) => (
          <motion.span
            key={i}
            variants={{
              initial: { y: "100%" },
              hovered: { y: 0 },
            }}
            transition={{
              duration: 0.4,
              ease: [0.83, 0, 0.17, 1],
              delay: i * 0.03,
            }}
            className="inline-block text-primary"
          >
            {l}
          </motion.span>
        ))}
      </div>
    </motion.span>
  );
};

export default GreekHero;
