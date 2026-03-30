import { SplitReveal } from '@/components/ui/SplitReveal';

const VisionSection = () => {
  return (
    <section id="services" className="py-32 px-4 md:px-8 bg-brand-light">
      <div className="max-w-[1800px] mx-auto">
        
        {/* Head */}
        <div className="flex flex-col items-center justify-center text-center mb-32">
          <h2 className="text-[10vw] md:text-[8vw] lg:text-[7vw] font-serif-display leading-[1.05] tracking-tight text-brand-dark">
            <span className="block overflow-hidden pb-2">
              <SplitReveal text="An epic team for" delay={0.1} />
            </span>
            <span className="block overflow-hidden pb-4">
              <span className="v-underline">
                 <SplitReveal text="every vision" delay={0.2} />
              </span>
            </span>
          </h2>
        </div>

        {/* The Cards Stack */}
        <div className="flex flex-col gap-8">
          {[
            { tag: '01', title: 'Brand Identity', desc: 'Crafting unforgettable visual systems and narrative positioning that define your space in the market. The perfect gang for high-profile creatives.' },
            { tag: '02', title: 'Digital Experience', desc: 'Designing lightning-fast, ultra-premium websites and applications engineered for high conversion rates. We focus on the details that matter.' },
            { tag: '03', title: 'Content & Motion', desc: 'Bringing your story to life through high-end 3D, motion graphics, and cinematic video. Creating the immersive scrolling experiences for tomorrow.' },
          ].map((item, i) => (
            <div key={item.tag} className="bg-[#EAEAEA] rounded-[2.5rem] p-8 md:p-16 lg:p-24 flex flex-col md:flex-row gap-12 md:gap-24 relative overflow-hidden group">
               
               {/* Massive left number */}
               <div className="flex-shrink-0 md:w-1/3">
                 <h3 className="text-[20vw] md:text-[15vw] leading-none font-medium tracking-tighter text-brand-dark opacity-90 transition-transform duration-700 group-hover:scale-95 group-hover:opacity-100">
                   {item.tag}
                 </h3>
               </div>
               
               {/* Right Content */}
               <div className="flex-1 flex flex-col justify-start">
                  <h4 className="text-4xl md:text-5xl lg:text-[4.5rem] leading-[1.1] tracking-tight text-brand-dark mb-8 md:mb-16">
                    {item.title}
                  </h4>
                  
                  <div className="mt-auto max-w-sm flex flex-col items-start gap-8">
                    <p className="text-base md:text-lg text-brand-dark/70 font-medium leading-relaxed">
                       {item.desc}
                    </p>
                    <button className="bg-brand-dark text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-black transition-colors">
                       Our model
                    </button>
                  </div>
               </div>
               
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default VisionSection;
