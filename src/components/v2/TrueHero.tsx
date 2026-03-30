import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const TrueHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section ref={containerRef} className="relative h-screen bg-background">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* Video Background — user will replace with custom Vincere video */}
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        
        <div className="container relative z-10 mx-auto px-4 flex flex-col items-center justify-center text-center">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             className="relative flex items-center justify-center"
           >
              {/* Pulsing Circular Button */}
              <button className="group relative w-40 h-40 md:w-56 md:h-56 rounded-full border border-foreground/10 flex items-center justify-center bg-background/5 backdrop-blur-sm hover:bg-foreground hover:text-background transition-all duration-700">
                 <div className="absolute inset-0 rounded-full border border-foreground/20 scale-110 group-hover:scale-125 transition-transform duration-1000 animate-pulse" />
                 <span className="text-xs font-bold uppercase tracking-[0.3em] z-10">Play <br/> Experience</span>
              </button>
           </motion.div>

           <div className="absolute bottom-24 left-12 right-12 flex justify-between items-end">
              <div className="text-left">
                 <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-foreground/40 mb-2">[ Vincere Society ]</p>
                 <div className="h-[1px] w-20 bg-foreground/20" />
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                 <span className="text-[10px] uppercase tracking-widest text-foreground/30 font-bold">Scroll to explore</span>
                 <div className="w-[1px] h-12 bg-foreground/10" />
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default TrueHero;
