import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const KojiHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    // Fade in the video first
    tl.to(".koji-video", {
      opacity: 1,
      duration: 2.5,
      ease: "power2.inOut"
    })
    // Then reveal the text lines
    .fromTo(".koji-text-line", {
      y: 100,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.15,
      ease: "power4.out"
    }, "-=1.5")
    // Finally reveal the subtitle/meta text
    .fromTo(".koji-meta", {
      opacity: 0,
      y: 20
    }, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.8");
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#0A0A0A]"
    >
      {/* 
        Vídeo 3D Abstract/Chrome 
        Usando um placeholder de alta qualidade (ondas abstratas) que dá o efeito 'manteiga'.
        Substitua por um arquivo .mp4 local caso tenha a animação exata pronta.
      */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="koji-video w-full h-full object-cover opacity-0 scale-105"
        >
          {/* A high quality abstract fluid/chrome video */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-flowing-chrome-fluid-238-large.mp4" type="video/mp4" />
        </video>
        {/* Grain Overlay para profundidade */}
        <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay"></div>
        {/* Gradiente escuro em baixo para garantir a leitura do texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      </div>

      <div className="container relative z-10 w-full h-full mx-auto px-6 md:px-12 lg:px-16 flex flex-col justify-end pb-24">
        
        {/* Meta info superior (acima do titulo) -> no estilo tech brutalist */}
        <div className="koji-meta mb-6 max-w-sm">
          <p className="text-white/60 text-sm font-medium tracking-wide leading-relaxed">
            Elevando marcas corporativas através de inteligência artificial profunda e design de alta performance.
          </p>
        </div>

        {/* Headline Curto e Bold Alinhado à Esquerda */}
        <div className="flex flex-col gap-2">
          <div className="overflow-hidden">
            <h1 className="koji-text-line text-5xl md:text-[7vw] lg:text-[8vw] font-sans font-black tracking-tighter text-white leading-[0.9] uppercase">
              Software
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1 className="koji-text-line text-5xl md:text-[7vw] lg:text-[8vw] font-sans font-black tracking-tighter text-white leading-[0.9] uppercase">
              Driven By
            </h1>
          </div>
          <div className="overflow-hidden flex items-baseline gap-4">
             <h1 className="koji-text-line text-5xl md:text-[7vw] lg:text-[8vw] font-sans font-black tracking-tighter text-primary leading-[0.9] uppercase">
               Intelligence.
             </h1>
          </div>
        </div>
        
        {/* Scroll indicator - canto inferior direito para balancear o layout */}
        <div className="koji-meta absolute bottom-12 right-6 md:right-12 lg:right-16 flex items-center gap-4 hidden lg:flex">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">Scroll to explore</span>
          <div className="w-16 h-[1px] bg-white/20 relative overflow-hidden">
            <motion.div 
              className="absolute inset-0 w-full h-full bg-white/60 origin-left"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default KojiHero;
