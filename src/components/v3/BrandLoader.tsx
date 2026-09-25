import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const BrandLoader = () => {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setGlitchActive(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center relative select-none w-full max-w-2xl px-6">
      {/* Dynamic Ambient Glow Field */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 0.8, 0.4], scale: [0.6, 1.2, 1] }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute w-[450px] h-[300px] rounded-full pointer-events-none -z-10"
        style={{
          background: "radial-gradient(ellipse, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.02) 50%, transparent 75%)",
        }}
      />

      {/* Futuristic Precision Framing Corners */}
      <div className="relative p-6 sm:p-10 flex items-center justify-center">
        {/* Top-Left Corner */}
        <motion.div
          initial={{ opacity: 0, x: -10, y: -10 }}
          animate={{ opacity: [0, 0.6, 0.3], x: [-10, 0, 4], y: [-10, 0, 4] }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500/60 pointer-events-none"
        />
        {/* Top-Right Corner */}
        <motion.div
          initial={{ opacity: 0, x: 10, y: -10 }}
          animate={{ opacity: [0, 0.6, 0.3], x: [10, 0, -4], y: [-10, 0, 4] }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500/60 pointer-events-none"
        />
        {/* Bottom-Left Corner */}
        <motion.div
          initial={{ opacity: 0, x: -10, y: 10 }}
          animate={{ opacity: [0, 0.6, 0.3], x: [-10, 0, 4], y: [10, 0, -4] }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500/60 pointer-events-none"
        />
        {/* Bottom-Right Corner */}
        <motion.div
          initial={{ opacity: 0, x: 10, y: 10 }}
          animate={{ opacity: [0, 0.6, 0.3], x: [10, 0, -4], y: [10, 0, -4] }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500/60 pointer-events-none"
        />

        {/* Laser Sweep Beam that reveals the word */}
        <motion.div
          initial={{ left: "-10%", opacity: 0 }}
          animate={{ left: ["-10%", "110%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/2 -translate-y-1/2 w-8 h-20 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent pointer-events-none z-30 blur-sm"
        />
        <motion.div
          initial={{ left: "-10%", opacity: 0 }}
          animate={{ left: ["-10%", "110%"], opacity: [0, 1, 0.8, 0] }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/2 -translate-y-1/2 w-[2px] h-24 bg-blue-500 pointer-events-none z-30 shadow-[0_0_15px_#3B82F6]"
        />

        {/* Main Brand Wordmark: Bold, unified and powerful */}
        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
          animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden py-2 px-3"
        >
          {/* Main Solid Text */}
          <motion.h1
            initial={{ letterSpacing: "0.22em", scale: 0.96 }}
            animate={{ letterSpacing: "0.14em", scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-brand font-bold uppercase text-slate-900 select-none tracking-[0.14em] text-center"
            style={{
              WebkitTextStroke: "1.2px currentColor",
              textShadow: "0 0 40px rgba(59, 130, 246, 0.12)",
            }}
          >
            SOVTRE
          </motion.h1>

          {/* Quick Glass Shimmer Reflection */}
          <motion.div
            initial={{ x: "-150%" }}
            animate={{ x: "250%" }}
            transition={{ delay: 0.9, duration: 0.9, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-25 pointer-events-none z-20"
          />
        </motion.div>
      </div>

      {/* Tech Baseline / Precision Bar */}
      <div className="flex items-center gap-3 mt-4">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-12 sm:w-20 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-blue-500 origin-right"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3B82F6]"
        />
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-12 sm:w-20 h-[1.5px] bg-gradient-to-l from-transparent via-blue-500 to-blue-500 origin-left"
        />
      </div>
    </div>
  );
};
