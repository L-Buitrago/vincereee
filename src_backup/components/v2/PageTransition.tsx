import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

interface PageTransitionProps {
  trigger: boolean;
  onComplete?: () => void;
}

const PageTransition: React.FC<PageTransitionProps> = ({ trigger, onComplete }) => {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {trigger && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.77, 0, 0.18, 1] }}
          className="fixed inset-0 z-[200] bg-[#0F172A] flex items-center justify-center"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-white text-2xl font-serif italic tracking-tighter"
          >
            Vincere
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageTransition;
