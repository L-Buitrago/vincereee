import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function AppSplashScreen() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // 1. Only show if running as an installed PWA (standalone)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;

    // 2. Only show on platform pages (where the PWA starts)
    const isPlatform = window.location.pathname.startsWith('/plataforma');

    if (!isStandalone || !isPlatform) {
      return;
    }

    setShouldShow(true);

    // Fade out after 2.2 seconds
    const timer = setTimeout(() => {
      setShouldShow(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#000000] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.15 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
            className="absolute w-[500px] h-[500px] bg-violet-600/30 rounded-full blur-[120px]"
          />

          <div className="relative">
            {/* Logo Container */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ 
                duration: 1, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="relative z-10"
            >
              {/* Silver V SVG */}
              <svg 
                width="120" 
                height="120" 
                viewBox="0 0 48 48" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-[0_0_30px_rgba(124,58,237,0.3)]"
              >
                <defs>
                  <linearGradient id="splash-silver-main" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#E8E8E8"/>
                    <stop offset="25%" stopColor="#F5F5F5"/>
                    <stop offset="50%" stopColor="#C0C0C0"/>
                    <stop offset="75%" stopColor="#D8D8D8"/>
                    <stop offset="100%" stopColor="#A0A0A0"/>
                  </linearGradient>
                  <linearGradient id="splash-silver-shine" x1="24" y1="6" x2="24" y2="42" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9"/>
                    <stop offset="40%" stopColor="#E0E0E0" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="#888888" stopOpacity="0.3"/>
                  </linearGradient>
                </defs>
                <path d="M8 10 L24 40 L40 10 L33 10 L24 30 L15 10 Z" fill="url(#splash-silver-main)"/>
                <path d="M12.5 12 L24 36 L35.5 12 L31 12 L24 27 L17 12 Z" fill="url(#splash-silver-shine)"/>
              </svg>
            </motion.div>

            {/* Shine Effect */}
            <motion.div
              initial={{ left: "-100%" }}
              animate={{ left: "200%" }}
              transition={{ 
                duration: 1.5, 
                delay: 0.5, 
                ease: "easeInOut" 
              }}
              className="absolute top-0 w-8 h-full bg-white/20 skew-x-[-25deg] blur-md z-20 pointer-events-none"
            />
          </div>

          {/* Loading Bar */}
          <div className="mt-12 w-48 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ 
                duration: 1.8, 
                ease: "easeInOut" 
              }}
              className="h-full bg-gradient-to-r from-violet-600 to-violet-400"
            />
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-4 text-[10px] text-white uppercase tracking-[0.3em] font-medium"
          >
            Vincere Tech
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
