import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type SplashType = "minimal";

interface SplashScreenManagerProps {
  type: SplashType;
  onAnimationComplete: () => void;
  isLoading?: boolean;
}

// ── ONLY SPLASH REMAINING: "Minimal" — White with serif type, line reveal ──
const MinimalSplash = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.8 }}
    className="flex flex-col items-center gap-12"
  >
    <div className="overflow-hidden">
      <motion.h1
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.77, 0, 0.18, 1] }}
        className="text-5xl md:text-8xl font-serif text-[#0F172A] tracking-tighter leading-none"
      >
        Vincere
      </motion.h1>
    </div>
    
    <div className="overflow-hidden">
      <motion.p
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.77, 0, 0.18, 1] }}
        className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#0F172A]/40"
      >
        [ Technology &middot; Dashboard &middot; Websites ]
      </motion.p>
    </div>

    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ delay: 0.6, duration: 1.5, ease: [0.77, 0, 0.18, 1] }}
      className="w-40 h-[1px] bg-[#0F172A]/20 origin-center"
    />
  </motion.div>
);

const SplashScreenManager = ({ onAnimationComplete, isLoading = false }: SplashScreenManagerProps) => {
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoading) {
        setIsFinished(true);
        setTimeout(onAnimationComplete, 800);
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, [isLoading, onAnimationComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[200] bg-[#f5f5f0] flex items-center justify-center p-4 overflow-hidden"
        >
          <div className="relative z-10">
            <MinimalSplash />
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/5 overflow-hidden">
             <motion.div 
               initial={{ scaleX: 0 }}
               animate={{ scaleX: 1 }}
               transition={{ duration: 2.8, ease: "easeInOut" }}
               className="h-full bg-[#0F172A] origin-left"
             />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreenManager;
