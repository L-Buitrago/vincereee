import { useState } from 'react';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Projects', href: '#projects' },
  { label: 'Vision', href: '#vision' },
  { label: 'Contact', href: '#footer' },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed top-6 right-6 z-[100] px-6 py-3 rounded-full text-sm font-medium tracking-wider uppercase transition-all duration-300',
          isOpen
            ? 'bg-primary text-primary-foreground'
            : 'bg-foreground/10 backdrop-blur-md text-foreground hover:bg-primary hover:text-primary-foreground'
        )}
      >
        {isOpen ? 'Close' : 'Menu'}
      </button>

      <div
        className={cn(
          'fixed inset-0 z-[90] flex items-center justify-center transition-all duration-500',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-2xl" />
        <nav className="relative z-10 flex flex-col items-center gap-8">
          {navLinks.map((link, i) => (
            <button
              key={link.label}
              onClick={() => handleClick(link.href)}
              className="font-serif-display text-5xl md:text-7xl lg:text-8xl text-foreground/60 hover:text-primary transition-colors duration-300"
              style={{
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.4s ease-out ${i * 0.08 + 0.15}s`,
              }}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Navigation;
