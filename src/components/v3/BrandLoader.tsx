import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const BrandLoader = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20); // Faster counter for punchy feel

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const letterVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  };

  const words = "VINCEREAT".split("");

  return (
    <div className="flex flex-col items-center justify-center space-y-12 relative">
      {/* Neural Background Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-x-[-150%] inset-y-[-150%] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
        }}
      />

      {/* Main Logo Text Reveal */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center space-x-1"
      >
        {words.map((char, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            className="text-6xl md:text-8xl font-sans font-extrabold tracking-tighter text-slate-900 select-none relative"
            style={{
              textShadow: "0 0 40px rgba(59, 130, 246, 0.1)",
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>

      {/* Tagline / Context Reveal */}
      <div className="overflow-hidden">
        <motion.p
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs md:text-sm font-medium uppercase tracking-[0.6em] text-blue-400/60 font-sans"
        >
          [ Construindo o Futuro da Conversão ]
        </motion.p>
      </div>

      {/* Precision Counter (Space Grotesk) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
        className="absolute bottom-[-160px] flex flex-col items-center gap-3 w-40"
      >
        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-slate-400 font-sans mb-1">
          Conectando
        </span>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-light tracking-tighter text-slate-900 font-sans tabular-nums">
            {counter.toString().padStart(2, "0")}
          </span>
          <span className="text-sm font-bold text-blue-600 font-sans leading-none">%</span>
        </div>
      </motion.div>
    </div>
  );
};
