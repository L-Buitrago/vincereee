import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const KojiHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Sophisticated reveal of the navigation pill
    tl.fromTo(".koji-pill", {
      y: -20,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power4.out",
      delay: 0.5
    })
    // Bold headline 'reveal-up' - pure typographic impact
    .fromTo(".koji-headline-line", {
      y: 100,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.1,
      ease: "power4.out"
    }, "-=0.5");
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#F8F9F5]"
    >
      {/* Texture Layer - Subtle grain for premium paper feel */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-noise"></div>

      {/* PILL NAVIGATION - Minimalist & Clean */}
      <div className="absolute top-8 left-0 w-full flex justify-center z-[140] pointer-events-none">
        <div className="koji-pill pointer-events-auto flex items-center gap-4 bg-black/[0.03] backdrop-blur-sm px-6 py-2.5 rounded-full border border-black/5">
           <span className="text-[14px] font-bold tracking-tighter text-black lowercase">vincere</span>
           <div className="h-3 w-[1px] bg-black/10" />
           <div className="flex gap-6">
             <button className="text-[10px] font-bold text-black/40 hover:text-black transition-colors uppercase tracking-[0.2em]">Projects</button>
             <button className="text-[10px] font-bold text-black/40 hover:text-black transition-colors uppercase tracking-[0.2em]">About Us</button>
             <button className="text-[10px] font-bold text-black/40 hover:text-black transition-colors uppercase tracking-[0.2em]">Contact</button>
           </div>
        </div>
      </div>

      {/* TYPOGRAPHIC HEADLINE - Center of the experience */}
      <div className="container relative z-10 w-full h-full mx-auto px-6 md:px-12 lg:px-20 flex flex-col justify-center">
        <div className="max-w-max space-y-0 text-center md:text-left">
           <div className="overflow-hidden">
             <h1 className="koji-headline-line text-6xl md:text-[8.5vw] font-sans font-black tracking-tighter text-black leading-[0.8] uppercase">
                Software
             </h1>
           </div>
           <div className="overflow-hidden">
             <h1 className="koji-headline-line text-6xl md:text-[8.5vw] font-sans font-black tracking-tighter text-black leading-[0.8] uppercase">
                Driven By
             </h1>
           </div>
           <div className="overflow-hidden flex flex-col md:flex-row items-center md:items-baseline gap-4 md:gap-8 justify-center md:justify-start">
             <div className="hidden md:block w-4 h-4 md:w-8 md:h-8 bg-primary rounded-full koji-headline-line" />
             <h1 className="koji-headline-line text-6xl md:text-[8.5vw] font-sans font-black tracking-tighter text-black leading-[0.8] uppercase">
                Intelligence
             </h1>
           </div>
        </div>
      </div>

      {/* Subtle Metadata for context */}
      <div className="absolute bottom-12 left-12 flex flex-col gap-2 opacity-30 koji-headline-line">
         <span className="text-[10px] font-black tracking-[0.3em] text-black">VINCERE STUDIO</span>
         <span className="text-[10px] font-medium tracking-[0.3em] text-black">CRAFTING DIGITAL ELITES</span>
      </div>

      {/* Secondary Meta Info */}
      <div className="absolute bottom-12 right-12 opacity-30 text-right koji-headline-line">
         <span className="text-[10px] font-medium tracking-[0.3em] text-black italic">EST. 2024</span>
      </div>
    </section>
  );
};

export default KojiHero;
