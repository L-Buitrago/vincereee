import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FooterSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current) return;
    
    // Parallax effect for the bottom image border radius
    gsap.fromTo(
      imageRef.current,
      { borderTopLeftRadius: '200px', borderTopRightRadius: '200px' },
      {
        borderTopLeftRadius: '0px',
        borderTopRightRadius: '0px',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <footer id="contact" ref={containerRef} className="bg-white pt-24 min-h-screen flex flex-col justify-between overflow-hidden">
      
      {/* Top Contact Row */}
      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 lg:px-24 mb-16 md:mb-32 flex flex-col md:flex-row border-t border-black/10">
        
        {/* Wanna start right now? */}
        <div className="w-full md:w-1/2 py-12 md:py-16 md:pr-16 border-b md:border-b-0 md:border-r border-black/10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans tracking-tight leading-[1.05] text-[#0e1711] mb-2">
            Wanna start<br />
            <span className="border-b-4 border-[#0e1711]">right now?</span>
          </h2>
        </div>
        
        {/* Mail Us & Book a Call */}
        <div className="w-full md:w-1/2 flex flex-col md:flex-row">
           <div className="w-full md:w-1/2 p-12 md:p-16 border-b md:border-b-0 border-r border-black/10 flex flex-col justify-between min-h-[250px] group cursor-pointer hover:bg-neutral-50 transition-colors">
              <div>
                 <h3 className="text-xl font-medium tracking-tight text-[#0e1711] mb-4">Mail us</h3>
                 <p className="text-[#0e1711]/50 text-xs font-medium tracking-wide">Tell us about your vision to get started.</p>
              </div>
              <div className="mt-8 flex items-center gap-2">
                 <span className="text-sm font-semibold tracking-wide text-[#0e1711]">hello@vinceresociety.com</span>
                 <span className="w-5 h-5 bg-[#D9FF2E] flex items-center justify-center rounded-full transition-transform group-hover:translate-x-1">
                   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                 </span>
              </div>
           </div>

           <div className="w-full md:w-1/2 p-12 md:p-16 border-b md:border-b-0 border-black/10 flex flex-col justify-between min-h-[250px] group cursor-pointer hover:bg-neutral-50 transition-colors">
              <div>
                 <h3 className="text-xl font-medium tracking-tight text-[#0e1711] mb-4">Book a call</h3>
                 <p className="text-[#0e1711]/50 text-xs font-medium tracking-wide">Let's discuss your needs and KPI's in detail. Speak soon!</p>
              </div>
              <div className="mt-8 flex items-center gap-2">
                 <span className="text-sm font-semibold tracking-wide text-[#0e1711]">Book a call</span>
                 <span className="w-5 h-5 bg-[#D9FF2E] flex items-center justify-center rounded-full transition-transform group-hover:translate-x-1">
                   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                 </span>
              </div>
           </div>
        </div>

      </div>

      {/* Massive bottom image */}
      <div 
        ref={imageRef}
        className="w-full h-[60vh] md:h-[75vh] bg-[#7F8A71] relative overflow-hidden"
      >
         {/* Placeholder for the large nature/texture image */}
         <img 
           src="https://images.unsplash.com/photo-1506744031586-db72a1f8c14c?w=1920&q=80" 
           alt="Landscape texture" 
           className="w-full h-full object-cover opacity-80 mix-blend-multiply"
         />
         
         <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col md:flex-row justify-between items-center text-white/50 text-xs tracking-widest uppercase pb-6 z-10 font-medium">
            <div className="flex gap-4">
              <span>Instagram ↗</span>
              <span>LinkedIn ↗</span>
              <span>X ↗</span>
            </div>
            <div className="mt-4 md:mt-0">
              VINCERE SOCIETY © {new Date().getFullYear()}
            </div>
         </div>
      </div>
    </footer>
  );
};

export default FooterSection;
