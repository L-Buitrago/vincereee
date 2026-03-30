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
    
    // Animate brands list items sequentially
    const items = containerRef.current.querySelectorAll('.brand-item');
    gsap.fromTo(
      items,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.brands-container',
          start: 'top 80%',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section id="projects" ref={containerRef} className="bg-[#f0f2ef] pt-32 pb-40 px-6 md:px-12 lg:px-24">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Top Title area */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-16">
          <h2 className="text-[12vw] md:text-[8rem] font-serif-display leading-none tracking-tighter text-[#0e1711]">
            01
          </h2>
          <div className="md:w-1/2 md:pl-16 pt-4 md:pt-[2rem]">
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-sans tracking-tight leading-[1.05] text-[#0e1711]">
              Your own<br />top-dogs<br />team
            </h3>
          </div>
        </div>

        {/* Feature Component / Image Card */}
        <div className="flex flex-col md:flex-row gap-12 lg:gap-24 mb-32 items-start">
          
          <div className="w-full md:w-[60%] lg:w-[65%] rounded-3xl overflow-hidden aspect-[4/3] relative">
             {/* Red Background Silhouette Placeholder */}
             <div className="absolute inset-0 bg-gradient-to-tr from-[#A00000] to-[#FF2222]"></div>
             
             {/* Silhouettes mock - just styled divs for effect */}
             <div className="absolute bottom-0 left-[10%] w-[30%] h-[70%] bg-black/90 rounded-t-[40%] clip-path-silhouette-1 blur-[1px]"></div>
             <div className="absolute bottom-0 right-[20%] w-[40%] h-[90%] bg-black/90 rounded-t-[50%] clip-path-silhouette-2 blur-[1px]"></div>
             
             {/* Replace with actual video/image component later */}
             <img 
               src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80" 
               alt="Top dogs team"
               className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-50"
             />
          </div>

          <div className="w-full md:w-[40%] lg:w-[35%] flex flex-col items-start pt-4">
             <p className="text-[#0e1711]/70 font-medium text-lg lg:text-xl leading-relaxed tracking-tight mb-8">
               <strong className="text-[#0e1711]">Custom talents.</strong> The perfect gang of high-profile creatives to exceed your business objectives. Full focus. Full grit.
             </p>
             <button className="bg-[#0e1711] text-white px-8 py-3 rounded-xl hover:bg-black transition-colors font-medium text-sm">
               Our model
             </button>
          </div>
        </div>

        {/* Brands List */}
        <div className="brands-container bg-white p-12 md:p-24 rounded-3xl shadow-sm border border-black/5 flex flex-col md:flex-row min-h-[500px]">
           <div className="w-full md:w-1/3 bg-[#0e1711] rounded-l-2xl hidden md:block" />
           
           <div className="flex-1 md:pl-24 flex flex-col gap-4">
              {brands.map((brand, i) => (
                <div key={i} className="brand-item flex items-center flex-wrap gap-4 py-1">
                  <h4 className="text-4xl md:text-[3.5rem] lg:text-[4.5rem] text-[#0e1711] tracking-tighter font-bold whitespace-nowrap">
                    {brand.name}
                  </h4>
                  <div className="flex gap-2">
                    {brand.tags.map((tag, j) => (
                      <span 
                        key={j} 
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${tag.color} text-white font-bold text-xs md:text-sm flex items-center justify-center`}
                      >
                        {tag.lbl}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
           </div>
        </div>

      </div>
    </section>
  );
};

export default ProjectsSection;
