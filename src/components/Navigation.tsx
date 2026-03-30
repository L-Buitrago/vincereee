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
          'fixed top-0 left-0 right-0 z-[100] px-6 py-8 flex items-center justify-between transition-all duration-300',
          isScrolled && !isOpen ? 'py-4 bg-white/5 backdrop-blur-sm' : 'bg-transparent'
        )}
      >
        <div className="flex items-center">
          <a href="/" className="text-xl font-bold tracking-tighter mix-blend-difference hover:opacity-80 transition-opacity">
            VINCERE SOCIETY
          </a>
        </div>
        
        <div className="flex items-center gap-2 relative">
          <button 
            className="px-8 py-3 rounded-full bg-[#3c3c32]/40 hover:bg-[#3c3c32]/60 text-white backdrop-blur-md border border-white/5 transition-all duration-300 font-medium text-xs uppercase tracking-wider"
          >
            Play Reel
          </button>

          <button 
            className={cn(
              "px-8 py-3 rounded-full transition-all duration-300 font-medium text-xs uppercase tracking-wider backdrop-blur-md border border-white/5",
              isOpen ? "bg-[#3c3c32]/80 text-white" : "bg-[#3c3c32]/40 text-white hover:bg-[#3c3c32]/60"
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Close' : 'Menu'}
          </button>

          <button 
            className="hidden md:inline-flex px-8 py-3 rounded-full bg-[#3c3c32]/40 hover:bg-[#3c3c32]/60 text-white backdrop-blur-md border border-white/5 transition-all duration-300 font-medium text-xs uppercase tracking-wider"
            onClick={() => {
              setIsOpen(false);
              document.querySelector('#footer')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Book a call
          </button>

          {/* EXACT DROPDOWN CARD FROM SCREENSHOT */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute top-[calc(100%+12px)] right-0 w-[240px] md:w-[280px] bg-[#2a2c26]/95 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-2xl p-6 md:p-8 flex flex-col origin-top-right text-white z-[110]"
              >
                {/* Main Links */}
                <div className="flex flex-col gap-5 mb-8">
                  {navLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => handleClick(link.href)}
                      className="group relative text-2xl md:text-3xl font-medium tracking-tight text-white/90 hover:text-white transition-colors text-left w-fit"
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F0FF3D] transition-all duration-300 group-hover:w-full opacity-70" />
                    </button>
                  ))}
                </div>

                <div className="w-full h-px bg-white/10 mb-6" />

                {/* Social Links Row */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8 text-[11px] font-medium tracking-wide uppercase text-white/60">
                  <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
                    Instagram <span className="opacity-40 tracking-normal">↗</span>
                  </a>
                  <a href="#" className="hover:text-white transition-colors flex items-center gap-1 border-l border-white/10 pl-4">
                    LinkedIn <span className="opacity-40 tracking-normal">↗</span>
                  </a>
                  <a href="#" className="hover:text-white transition-colors flex items-center gap-1 border-l border-white/10 pl-4">
                    X <span className="opacity-40 tracking-normal">↗</span>
                  </a>
                </div>

                <button 
                  onClick={() => {
                    setIsOpen(false);
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full bg-[#F0FF3D] hover:bg-white text-black font-bold rounded-xl py-4 transition-all duration-300 text-sm tracking-wide"
                >
                  Contact us
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Background Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-[2px] pointer-events-auto"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
