import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
      <div className="max-w-[1400px] mx-auto min-h-[60vh] flex flex-col lg:flex-row gap-16">
        
        {/* Left Sticky Header */}
        <div className="lg:w-[35%]">
           <div className="sticky top-40 flex flex-col items-start">
             <h2 className="text-5xl md:text-6xl lg:text-7xl font-sans font-medium tracking-tighter text-[#0e1711] leading-[1.1] mb-2">
               Made for<br />
               <span className="border-b-4 border-[#0e1711]">big-time returns.</span>
             </h2>
           </div>
        </div>

        {/* Right Cards */}
        <div className="lg:w-[65%] grid grid-cols-1 md:grid-cols-2 gap-6">
           
           {/* Lime Green Card */}
           <div className="bg-[#D9FF2E] rounded-[2rem] p-10 md:p-14 flex flex-col justify-between h-[600px] hover:-translate-y-2 transition-transform duration-500">
              <h3 className="text-3xl lg:text-4xl text-center md:text-left font-sans font-medium text-[#0e1711] mb-12">
                Enjoy clear workflows<br />and faster results.
              </h3>
              
              <div ref={pillsRef} className="flex flex-col gap-4 mx-auto w-full max-w-[280px]">
                 <div className="workflow-pill bg-[#0e1711] text-white rounded-xl px-6 py-4 flex justify-between items-center shadow-lg hover:scale-105 transition-transform">
                   <span className="font-medium text-sm">Your Project</span>
                 </div>
                 <div className="workflow-pill bg-[#0e1711] text-white rounded-xl px-6 py-4 flex justify-between items-center ml-8 shadow-lg hover:scale-105 transition-transform">
                   <span className="font-medium text-sm">Development</span>
                   <span>
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D9FF2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   </span>
                 </div>
                 <div className="workflow-pill bg-[#C4ED15] text-[#0e1711] rounded-xl px-6 py-4 flex justify-between items-center ml-16 shadow-lg hover:scale-105 transition-transform">
                   <span className="font-medium text-sm">Hand-Off</span>
                 </div>
              </div>

              <div className="mt-auto flex justify-center">
                 <button className="bg-[#0e1711] text-white px-8 py-3 rounded-xl hover:bg-black transition-colors font-medium text-sm">
                   Our approach
                 </button>
              </div>
           </div>

           {/* Grey Card */}
           <div className="bg-[#E9EDE7] rounded-[2rem] p-10 md:p-14 flex flex-col justify-between h-[600px] hover:-translate-y-2 transition-transform duration-500">
              <h3 className="text-3xl lg:text-4xl text-center md:text-left font-sans font-medium text-[#0e1711] mb-12">
                Best use of your money<br />with experts only.
              </h3>
              
              <div className="flex justify-center items-center h-full relative">
                 {/* Stack of Avatars */}
                 <div className="flex items-center -space-x-8">
                    <div className="w-24 h-24 rounded-full bg-purple-500 border-4 border-[#E9EDE7] overflow-hidden z-[4] shadow-md hover:scale-110 transition-transform origin-bottom">
                       <img src="https://i.pravatar.cc/150?img=47" alt="Talent" className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                    </div>
                    <div className="w-28 h-28 rounded-full bg-pink-500 border-4 border-[#E9EDE7] overflow-hidden z-[3] shadow-md hover:scale-110 transition-transform origin-bottom">
                       <img src="https://i.pravatar.cc/150?img=32" alt="Talent" className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                    </div>
                    <div className="w-32 h-32 rounded-full bg-gray-400 border-4 border-[#E9EDE7] overflow-hidden z-[2] shadow-md hover:scale-110 transition-transform origin-bottom">
                       <img src="https://i.pravatar.cc/150?img=11" alt="Talent" className="w-full h-full object-cover grayscale" />
                    </div>
                    <div className="w-32 h-32 rounded-full bg-[#A3B3A6] border-4 border-[#E9EDE7] z-[1] flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                       <span className="text-white font-medium text-xl">+26</span>
                    </div>
                 </div>
              </div>

              <div className="mt-auto flex justify-center">
                 <button className="bg-[#0e1711] text-white px-8 py-3 rounded-xl hover:bg-black transition-colors font-medium text-sm">
                   About us
                 </button>
              </div>
           </div>

        </div>
      </div>
    </section>
  );
};

export default VisionSection;
