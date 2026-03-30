import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const V2Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.from(".reveal-text", {
      y: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: "power4.out"
    }).from(".reveal-video", {
      opacity: 0,
      scale: 1.1,
      duration: 2,
      ease: "power2.out"
    }, "-=0.8");
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden bg-background"
    >
      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
        {/* Subtle Category */}
        <div className="overflow-hidden mb-6">
          <p className="reveal-text text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-foreground/40">
            [ Digital Design Studio ]
          </p>
        </div>

        {/* The "Literal" Hero Heading */}
        <div className="overflow-hidden mb-8">
          <h1 className="reveal-text text-6xl md:text-[9vw] font-serif italic text-foreground leading-[0.9] tracking-tighter">
            Vincere <br />
            <span className="font-sans not-italic font-extrabold text-foreground ml-[2vw]">Society</span>
          </h1>
        </div>

        {/* Background Video element - extracted from Vendredi */}
        <div className="reveal-video absolute inset-0 z-0 pointer-events-none opacity-40">
           <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-full object-cover"
           >
              <source src="https://download-video-ak.vimeocdn.com/v3-1/playback/9f8e32f7-a2bf-4b57-9a4b-0de21890145d/f65b5b00-3b53e910" type="video/mp4" />
           </video>
        </div>

        {/* Scroll down indicator like Vendredi */}
        <motion.div 
           initial={{ y: 0 }}
           animate={{ y: 20 }}
           transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
           className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
           <div className="w-[1px] h-20 bg-foreground/10" />
           <span className="text-[10px] uppercase tracking-widest text-foreground/30 font-bold">Scroll</span>
        </motion.div>
      </div>
    </section>
  );
};

export default V2Hero;
