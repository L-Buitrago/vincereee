import { useEffect, useState } from 'react';

const HeroSection = () => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="absolute top-8 left-8">
        <span className="font-serif-display text-xl tracking-tight text-foreground">Studio</span>
      </div>

      <div className="max-w-6xl text-center">
        <h1
          className="font-serif-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-medium leading-[0.95] tracking-tight text-foreground transition-all duration-1000 ease-out"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(60px)',
          }}
        >
          Syncing<br />
          <span className="italic">fast-moving</span><br />
          brands
        </h1>

        <p
          className="mt-8 text-base md:text-lg text-muted-foreground max-w-md mx-auto tracking-wide transition-all duration-1000 ease-out delay-300"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: '400ms',
          }}
        >
          Design & brand studio for companies that move at the speed of culture.
        </p>

        <div
          className="mt-12 transition-all duration-700 ease-out"
          style={{
            opacity: revealed ? 1 : 0,
            transitionDelay: '700ms',
          }}
        >
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-block px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium tracking-wide hover:scale-105 transition-transform duration-300"
          >
            View Work
          </a>
        </div>
      </div>

      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-700"
        style={{ opacity: revealed ? 1 : 0, transitionDelay: '1000ms' }}
      >
        <div className="w-px h-16 bg-foreground/20 mx-auto animate-pulse" />
      </div>
    </section>
  );
};

export default HeroSection;
