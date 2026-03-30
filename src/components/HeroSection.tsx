import { SplitReveal } from '@/components/ui/SplitReveal';

const HeroSection = () => {
  return (
    <section id="hero" className="relative h-screen min-h-[700px] w-full flex flex-col justify-end pb-24 px-6 md:px-12 lg:px-24 overflow-hidden bg-background">
      {/* Background Video/Blob Placeholder */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-end gap-12">
        <div className="flex-1 max-w-4xl">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] text-foreground mix-blend-difference">
            <SplitReveal text="Driven" delay={0.2} />
            <br />
            <SplitReveal text="by big-time" delay={0.4} />
            <br />
            <SplitReveal text="returns." delay={0.6} />
          </h1>
        </div>
        
        <div className="flex-shrink-0 w-full lg:w-1/3 text-lg md:text-xl font-medium tracking-tight text-foreground/80 mix-blend-difference pb-4">
          <SplitReveal 
            text="Vincere Society is a digital growth agency building performant brands that exist to stand out." 
            delay={1.2} 
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
