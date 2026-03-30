import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { HoverButton } from '@/components/ui/HoverButton';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Work', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#vision' },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-[100] px-6 py-5 flex items-center justify-between transition-colors duration-300',
          isScrolled && !isOpen ? 'bg-background/80 backdrop-blur-md' : 'bg-transparent'
        )}
      >
        <div className="flex items-center">
          <a href="/" className="text-xl font-bold tracking-tighter mix-blend-difference hover:opacity-80 transition-opacity">
            VINCERE SOCIETY
          </a>
        </div>
        
        <div className="flex items-center gap-4">
          <HoverButton 
            className="hidden md:inline-flex bg-background text-foreground border-border hover:border-primary"
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start a project
          </HoverButton>
          
          <HoverButton 
            className={cn(
              "border-border min-w-[100px]",
              isOpen ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:border-primary"
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Close' : 'Menu'}
          </HoverButton>
        </div>
      </header>

      <div
        className={cn(
          'fixed inset-0 z-[90] flex items-center justify-center bg-background text-foreground transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]',
          isOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
        )}
      >
        <nav className="relative z-10 flex flex-col items-center gap-6">
          {navLinks.map((link, i) => (
            <div key={link.label} className="clip-text-container overflow-hidden">
              <button
                onClick={() => handleClick(link.href)}
                className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter hover:text-primary transition-colors duration-300 block pb-2"
                style={{
                  transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
                  transition: `transform 0.8s cubic-bezier(0.76,0,0.24,1) ${i * 0.1 + 0.3}s`,
                }}
              >
                {link.label}
              </button>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Navigation;
