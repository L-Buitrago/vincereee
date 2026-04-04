import { useEffect, useRef, Suspense } from 'react';
import gsap from 'gsap';
import AmorphousBlob from './AmorphousBlob';

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
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-brand-dark"
    >
      <Suspense fallback={<div className="absolute inset-0 bg-[#161a15]" />}>
        <AmorphousBlob />
      </Suspense>

      <div className="relative z-10 text-center px-4 max-w-[1200px] w-full mt-20">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] font-display font-bold leading-[0.9] tracking-[-0.04em] text-[#e8e8e3] mix-blend-plus-lighter drop-shadow-2xl">
          Syncing <span className="font-serif italic font-normal text-primary">fast-moving</span><br className="hidden md:block" />
          brands with <span className="font-serif italic font-normal">fast-moving</span><br className="hidden md:block" />
          audiences.
        </h1>
      </div>
    </section>
  );
};

export default HeroSection;
