import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const tl = gsap.timeline();
    tl.fromTo(
      containerRef.current.querySelector('h1'),
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  return (
    <section 
      id="hero" 
      ref={containerRef} 
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#7F8A71]"
    >
      {/* 3D abstract object placeholder / silhouette */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
         <div className="w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-black/60 rounded-[45%] mix-blend-overlay filter blur-[60px] animate-[spin_30s_linear_infinite]" />
         <div className="absolute w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] bg-[#9ba78a]/50 rounded-[40%] mix-blend-overlay filter blur-[40px] animate-[spin_20s_linear_reverse_infinite]" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-[900px]">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-sans font-medium leading-[1.05] tracking-tight text-white">
          Syncing fast-moving<br className="hidden md:block" />
          brands with fast-moving<br className="hidden md:block" />
          audiences.
        </h1>
      </div>
    </section>
  );
};

export default HeroSection;
