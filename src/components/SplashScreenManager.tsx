import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLoader } from "./v3/BrandLoader";

export type SplashType = "minimal" | "neural";

interface SplashScreenManagerProps {
  type: SplashType;
  onAnimationComplete: () => void;
  isLoading?: boolean;
}

const SplashScreenManager = ({ onAnimationComplete, isLoading = false }: SplashScreenManagerProps) => {
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoading) {
        setIsFinished(true);
        setTimeout(onAnimationComplete, 800);
      }
    }, 3200); // Slightly more time for full brand impact

    return () => clearTimeout(timer);
  }, [isLoading, onAnimationComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] bg-[#030303] flex items-center justify-center p-4 overflow-hidden"
        >
          {/* Subtle Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-grid-white/[0.05] pointer-events-none" />
          
          <div className="relative z-10 w-full flex items-center justify-center">
            <BrandLoader />
          </div>

          {/* Neural Pulse Scanning Line */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: [0, 0.4, 0], scaleY: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-full h-[100px] bg-gradient-to-b from-transparent via-blue-500/10 to-transparent pointer-events-none"
            style={{ top: "-10%" }}
          />

          {/* Progress bar (Precision Line) */}
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white/5 overflow-hidden">
             <motion.div 
               initial={{ scaleX: 0 }}
               animate={{ scaleX: 1 }}
               transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
               className="h-full bg-blue-500 origin-left shadow-[0_0_15px_rgba(59,130,246,0.6)]"
             />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreenManager;
