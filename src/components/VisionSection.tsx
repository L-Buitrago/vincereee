import { SplitReveal } from '@/components/ui/SplitReveal';

const VisionSection = () => {
  return (
    <section id="services" className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-background border-t border-border/20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 lg:gap-32">
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter leading-[0.9] text-foreground mb-8">
            <SplitReveal text="Beyond" />
            <br />
            <SplitReveal text="aesthetics," delay={0.1} />
            <br />
            <SplitReveal text="we build" delay={0.2} />
            <br />
            <SplitReveal text="growth." delay={0.3} />
          </h2>
          <div className="max-w-md text-lg text-foreground/70">
            <SplitReveal 
              text="Our process is engineered to create unfair advantages for our partners. We combine high-end design with strategic performance." 
              delay={0.4} 
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-12">
          {[
            { tag: '01', title: 'Brand Identity', desc: 'Crafting unforgettable visual systems and positioning that define your market space.' },
            { tag: '02', title: 'Digital Experience', desc: 'Designing lightning-fast, conversion-focused websites and applications.' },
            { tag: '03', title: 'Content & Motion', desc: 'Bringing your story to life through high-end 3D, motion graphics, and video.' },
          ].map((item, i) => (
            <div key={item.tag} className="border-t border-border/20 pt-8 group cursor-pointer">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-primary font-mono text-sm">{item.tag}</span>
                <h3 className="text-3xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">{item.title}</h3>
              </div>
              <p className="text-foreground/60 text-base leading-relaxed max-w-sm pl-10 transition-opacity duration-300 opacity-80 group-hover:opacity-100">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
