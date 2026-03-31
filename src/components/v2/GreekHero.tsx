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
        <div className="relative z-30 flex flex-col items-center justify-center text-center w-full px-4">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.83, 0, 0.17, 1], delay: 0.5 }}
            className="text-[10vw] font-bold tracking-[-0.05em] leading-tight uppercase flex items-center justify-center w-full mix-blend-difference"
            style={{ fontFamily: "'Aeonik Pro Bold', 'Plus Jakarta Sans', sans-serif" }}
          >
            Tecnologia que <br /> acelera resultados.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-[1.2vw] font-medium uppercase tracking-[0.4em] text-foreground/60 mt-4 max-w-[60%] mx-auto"
          >
            Desenvolvemos softwares inteligentes com IA para empresas que querem crescer com eficiência.
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

export default GreekHero;
