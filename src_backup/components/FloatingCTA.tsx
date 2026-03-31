import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { HoverButton } from '@/components/ui/HoverButton';

const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA only after scrolling past Hero section and not at the very bottom
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      
      const pastHero = scrolled > winHeight * 0.8;
      const notAtBottom = scrolled + winHeight < docHeight - 200;
      
      setIsVisible(pastHero && notAtBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      )}
    >
      <HoverButton 
        className="bg-primary text-primary-foreground border-primary hover:bg-background hover:text-primary backdrop-blur-md shadow-2xl py-3 px-8 text-sm font-bold tracking-wider uppercase"
        onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
      >
        Think we have a match?
      </HoverButton>
    </div>
  );
};

export default FloatingCTA;
