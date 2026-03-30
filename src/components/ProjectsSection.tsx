import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const brands = [
  { name: 'Alinea', tags: [{ lbl: 'CO', color: 'bg-[#FF3333]' }, { lbl: 'RS', color: 'bg-[#33FF55]' }, { lbl: 'VO', color: 'bg-[#1A1A1A]' }] },
  { name: 'IKKS', tags: [{ lbl: 'RS', color: 'bg-[#33FF55]' }, { lbl: 'VO', color: 'bg-[#1A1A1A]' }] },
  { name: 'Disque', tags: [{ lbl: 'P', color: 'bg-[#33AAFF]' }, { lbl: 'RS', color: 'bg-[#33FF55]' }] },
  { name: 'Homiris', tags: [{ lbl: 'M', color: 'bg-[#FFCC33]' }, { lbl: 'RS', color: 'bg-[#33FF55]' }, { lbl: 'VO', color: 'bg-[#1A1A1A]' }] },
  { name: 'HackMarket', tags: [{ lbl: 'M', color: 'bg-[#FFCC33]' }, { lbl: 'RS', color: 'bg-[#33FF55]' }] },
  { name: 'Radio France', tags: [{ lbl: 'CO', color: 'bg-[#FF3333]' }, { lbl: 'M', color: 'bg-[#FFCC33]' }, { lbl: 'RS', color: 'bg-[#33FF55]' }, { lbl: 'VO', color: 'bg-[#1A1A1A]' }] },
  { name: 'Samaritaine', tags: [{ lbl: 'CO', color: 'bg-[#FF3333]' }] },
];

const ProjectsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Fade in text elements
    const elements = containerRef.current.querySelectorAll('.animate-on-scroll');
    gsap.fromTo(
      elements,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section id="team" ref={containerRef} className="bg-[#f0f2ef] pt-32 pb-48 px-6 md:px-12 lg:px-24">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-40 animate-on-scroll">
           <h2 className="text-5xl md:text-7xl font-sans tracking-tight leading-[1.05] text-[#0e1711]">
             An epic team for<br />
             <span className="v-underline">every vision</span>
           </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-12 lg:gap-x-24">
          
          {/* Left: 01 and Red Card */}
          <div className="md:col-span-7 flex flex-col gap-12">
             <div className="animate-on-scroll">
                <span className="text-[14vw] md:text-[10rem] lg:text-[12rem] font-serif-display leading-none tracking-tighter text-[#0e1711]/90">
                  01
                </span>
             </div>
             
             {/* Large Red Image Card */}
             <div className="w-full aspect-[16/9] md:aspect-[4/3] rounded-[3rem] overflow-hidden relative shadow-2xl animate-on-scroll">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF3B30] to-[#8E0000]" />
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80" 
                  alt="Team collaboration"
                  className="w-full h-full object-cover mix-blend-multiply opacity-60"
                />
                
                {/* Silhouette effect placeholder */}
                <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
             </div>
          </div>

          {/* Right: Text and Button */}
          <div className="md:col-span-5 flex flex-col justify-start pt-8 md:pt-[15rem]">
             <div className="max-w-[400px] animate-on-scroll">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-sans font-medium tracking-tight leading-[1.1] text-[#0e1711] mb-12">
                  Your own<br />top-dogs<br />team
                </h3>
                
                <p className="text-lg md:text-xl text-[#0e1711]/70 font-medium leading-[1.5] mb-10">
                  <strong className="text-[#0e1711]">Custom talents.</strong> The perfect gang of high-profile creatives to exceed your business objectives. Full focus. Full grit.
                </p>
                
                <button className="bg-[#0e1711] text-white px-10 py-3.5 rounded-full hover:bg-black transition-all duration-300 font-bold text-xs uppercase tracking-widest shadow-lg">
                  Our model
                </button>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProjectsSection;
