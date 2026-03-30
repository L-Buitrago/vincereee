import { SplitReveal } from '@/components/ui/SplitReveal';

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-[90vh] w-full pt-32 pb-12 px-6 md:px-12 lg:px-16 flex flex-col justify-center bg-background text-foreground">
      <div className="w-full h-full flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-stretch">
        
        {/* Left Typography Side */}
        <div className="flex-1 w-full flex flex-col justify-center lg:pt-20">
          <h1 className="text-[12vw] sm:text-[10vw] lg:text-[7vw] font-serif-display leading-[1.05] tracking-tight text-brand-dark mb-12">
            <span className="block overflow-hidden pb-2">
              <SplitReveal text="Made for" delay={0.2} />
            </span>
            <span className="block overflow-hidden pb-4">
              <span className="v-underline">
                <SplitReveal text="big-time returns." delay={0.4} />
              </span>
            </span>
          </h1>
          
          {/* Bottom left small text as seen in previous configs or mobile views */}
          <div className="max-w-[400px] mt-auto hidden lg:block text-sm md:text-base font-medium text-brand-dark/80 tracking-tight leading-relaxed">
             <SplitReveal 
               text="Vincere Society is a digital growth agency building performant brands that exist to stand out." 
               delay={0.8} 
             />
          </div>
        </div>

        {/* Right Video/KPI Block Side */}
        <div className="flex-1 w-full min-h-[500px] lg:min-h-full bg-brand-dark rounded-3xl overflow-hidden relative group flex items-center justify-center p-8">
           
           <div className="text-center z-10 text-brand-light">
             <h2 className="text-2xl lg:text-3xl font-serif-display font-medium tracking-tight mb-8">
               More than pretty designs,<br />KPI-driven ones.
             </h2>

             {/* Faux scrolling cases/KPI cards to mimic the screenshot */}
             <div className="flex flex-col gap-4 mx-auto max-w-[400px]">
                <div className="bg-[#051511] backdrop-blur-md rounded-2xl p-6 flex items-center border border-white/5 opacity-0 animate-[fadeInUp_1s_ease-out_1s_forwards]">
                   <span className="text-sm tracking-wide">ROAS : 5x Consistent returns</span>
                   <span className="ml-auto text-brand-accent">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   </span>
                </div>
                <div className="bg-[#051511] backdrop-blur-md rounded-2xl p-6 flex items-center border border-white/5 opacity-0 animate-[fadeInUp_1s_ease-out_1.2s_forwards]">
                   <span className="text-sm tracking-wide">DOOH : 3 million impressions</span>
                   <span className="ml-auto text-brand-accent">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   </span>
                </div>
             </div>

             <div className="mt-16 opacity-0 animate-[fadeInUp_1s_ease-out_1.5s_forwards]">
               <button className="px-6 py-2 rounded-full border border-white/20 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300">
                 Case Studies
               </button>
             </div>
           </div>
           
           {/* Pure CSS subtle animated background behind KPI cards */}
           <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#002921] to-[#01140f] opacity-80" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-accent rounded-full mix-blend-overlay filter blur-[150px] opacity-10 animate-pulse" />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
