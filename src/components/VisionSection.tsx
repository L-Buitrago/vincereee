import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const VisionSection = () => {
  const pillsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!pillsRef.current) return;
    const pills = pillsRef.current.querySelectorAll('.workflow-pill');
    
    gsap.fromTo(
      pills,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: pillsRef.current,
          start: 'top 80%',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section id="services" className="bg-white py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        
        {/* Top Fold: Header + KPI Card */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-8">
          {/* Left Sticky Header */}
          <div className="lg:w-[35%]">
            <div className="flex flex-col items-start pt-10">
              <h2 className="text-5xl md:text-6xl lg:text-8xl font-display font-bold tracking-tighter text-[#0e1711] leading-[1.05]">
                Made for<br />
                <span className="font-serif italic font-normal text-primary">big-time</span> returns.
              </h2>
            </div>
          </div>

          {/* Right: Large Dark KPI Card */}
          <div className="lg:w-[65%] bg-[#0e1711] rounded-[3rem] p-12 md:p-24 flex flex-col justify-center relative overflow-hidden h-[500px] md:h-[600px] lg:h-[700px]">
             <div className="relative z-10 max-w-[500px] mx-auto text-center">
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-[1.1] mb-24">
                  More than pretty designs, <span className="font-serif italic font-normal text-primary">KPI-driven</span> ones.
                </h3>
                
                {/* Floating KPI Stat Card */}
                <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-full max-w-[320px] bg-[#1a231d] border border-white/10 rounded-2xl p-6 flex items-center gap-4 shadow-2xl scale-110">
                   <div className="w-12 h-12 rounded-lg bg-[#deff3d]/10 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#deff3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   </div>
                   <div className="text-left">
                      <div className="text-[#deff3d] text-2xl font-bold tracking-tight">+2k users</div>
                      <div className="text-white/40 text-xs font-semibold uppercase tracking-widest">on the first week</div>
                   </div>
                   <div className="ml-auto">
                      <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center">
                         <div className="w-2 h-2 bg-[#deff3d] rounded-full" />
                      </div>
                   </div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                   <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl border border-white/10 transition-all duration-300 font-bold text-[10px] uppercase tracking-widest">
                     Case Studies
                   </button>
                </div>
             </div>
             
             {/* Background glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#deff3d]/5 blur-[120px] rounded-full" />
          </div>
        </div>

        {/* Bottom Fold: Detail Cards row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           
           {/* Lime Green Card */}
           <div className="bg-[#D9FF2E] rounded-[3rem] p-12 md:p-20 flex flex-col justify-between h-[600px] hover:-translate-y-2 transition-transform duration-500">
              <h3 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-[#0e1711] leading-[1.1]">
                Enjoy <span className="font-serif italic font-normal text-primary">clear workflows</span><br />and faster results.
              </h3>
              
              <div ref={pillsRef} className="flex flex-col gap-5 w-full max-w-[320px] py-12">
                 <div className="workflow-pill bg-[#0e1711] text-white rounded-2xl px-8 py-5 flex justify-between items-center shadow-lg transform rotate-[-1deg]">
                   <span className="font-bold text-xs uppercase tracking-widest">Your Project</span>
                 </div>
                 <div className="workflow-pill bg-[#0e1711] text-white rounded-2xl px-8 py-5 flex justify-between items-center translate-x-12 shadow-lg transform rotate-[1deg]">
                   <span className="font-bold text-xs uppercase tracking-widest">Development</span>
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D9FF2E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                 </div>
                 <div className="workflow-pill bg-[#cbe92a] text-[#0e1711] rounded-2xl px-8 py-5 flex justify-between items-center translate-x-24 shadow-lg transform rotate-[-0.5deg]">
                   <span className="font-bold text-xs uppercase tracking-widest">Hand-Off</span>
                 </div>
              </div>

              <button className="w-fit bg-[#0e1711] text-white px-10 py-4 rounded-full hover:bg-black transition-colors font-bold text-[10px] uppercase tracking-widest shadow-lg">
                Our approach
              </button>
           </div>

           {/* Grey Card */}
           <div className="bg-[#e0e4df] rounded-[3rem] p-12 md:p-20 flex flex-col justify-between h-[600px] hover:-translate-y-2 transition-transform duration-500">
              <h3 className="text-3xl md:text-5xl font-sans font-medium tracking-tight text-[#0e1711] leading-[1.1]">
                Best use of your money<br />with experts only.
              </h3>
              
              <div className="flex justify-center items-center h-full relative py-12">
                 {/* Stack of Avatars */}
                 <div className="flex items-center -space-x-10">
                    {[47, 32, 11].map((img, i) => (
                      <div key={i} className={cn(
                        "w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-[#e0e4df] overflow-hidden shadow-xl hover:scale-110 hover:-translate-y-4 transition-all duration-500 cursor-pointer",
                        i === 0 ? "z-30" : i === 1 ? "z-20 scale-95" : "z-10 scale-90"
                      )}>
                         <img src={`https://i.pravatar.cc/150?img=${img}`} alt="Talent" className={cn("w-full h-full object-cover", i === 2 && "grayscale")} />
                      </div>
                    ))}
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-[#0e1711] border-4 border-[#e0e4df] z-0 flex items-center justify-center shadow-xl hover:scale-110 transition-transform scale-85">
                       <span className="text-white font-bold text-2xl tracking-tighter">+26</span>
                    </div>
                 </div>
              </div>

              <button className="w-fit bg-[#0e1711] text-white px-10 py-4 rounded-full hover:bg-black transition-colors font-bold text-[10px] uppercase tracking-widest shadow-lg">
                About us
              </button>
           </div>

        </div>
      </div>
    </section>
  );
};

export default VisionSection;
