import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLoader } from "./v3/BrandLoader";

export type SplashType = "minimal" | "neural";

interface SplashScreenManagerProps {
  type?: SplashType;
  onAnimationComplete: () => void;
  isLoading?: boolean;
}

const SplashScreenManager = ({ onAnimationComplete, isLoading = false }: SplashScreenManagerProps) => {
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoading) {
        setIsFinished(true);
        setTimeout(onAnimationComplete, 700);
      }
    }, 2400);

    return () => clearTimeout(timer);
  }, [isLoading, onAnimationComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] bg-[#FBFCFE] flex items-center justify-center p-4 overflow-hidden"
        >
          {/* Subtle Clean Ambient Background Grid */}
          <div className="absolute inset-0 opacity-[0.03] bg-grid-slate-900/[0.04] pointer-events-none" />
          
          <div className="relative z-10 w-full flex items-center justify-center">
            <BrandLoader />
          </div>

          {/* Minimalist Progress Line at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-slate-100 overflow-hidden">
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2.3, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-blue-500 origin-left shadow-[0_0_12px_rgba(59,130,246,0.3)]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreenManager;
