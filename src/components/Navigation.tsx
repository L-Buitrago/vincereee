import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { HoverButton } from '@/components/ui/HoverButton';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (href: string) => {
    setIsOpen(false);
    navigate(href);
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
        
        <div className="flex items-center gap-4 relative">
          <HoverButton 
            className="hidden md:inline-flex bg-background/80 backdrop-blur-md text-foreground border-transparent hover:border-transparent hover:bg-background/90"
            onClick={() => {
              setIsOpen(false);
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Start a project
          </HoverButton>
          
          <HoverButton 
            className={cn(
              "border-transparent min-w-[100px] bg-background/80 backdrop-blur-md hover:bg-background/90 text-foreground shadow-sm",
              isOpen ? "bg-background/90" : ""
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Close' : 'Menu'}
          </HoverButton>

          {/* EXACT DROPDOWN CARD FROM SCREENSHOT */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute top-[120%] right-0 w-[300px] bg-[#2a2c26]/90 backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl p-6 flex flex-col origin-top-right text-white"
              >
                {/* Main Links */}
                <div className="flex flex-col gap-4 mb-8">
                  {navLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => handleClick(link.href)}
                      className="text-2xl font-medium tracking-tight hover:translate-x-2 hover:text-primary transition-all duration-300 text-left"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/10 mb-4" />

                {/* Social Links */}
                <div className="flex gap-4 mb-4 text-xs font-medium text-white/80">
                  <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
                    Instagram <span>↗</span>
                  </a>
                  <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
                    LinkedIn <span>↗</span>
                  </a>
                  <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
                    X <span>↗</span>
                  </a>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/10 mb-6" />

                {/* Yellow Contact Button */}
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full bg-[#F0FF3D] hover:bg-[#dbe03a] text-black font-semibold rounded-xl py-4 transition-colors duration-300 text-sm tracking-wide"
                >
                  Contact us
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Background Overlay (Optional if you want clicking outside to close) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-sm pointer-events-auto"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
