import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { HoverButton } from '@/components/ui/HoverButton';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const navLinks = [
  { label: 'Portfólio', href: '/work' },
  { label: 'Especialidade', href: '/expertise' },
  { label: 'Agência', href: '/agency' },
  { label: 'Contato', href: '/contact' },
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
          <a href="/" className="text-xl font-serif-display font-bold tracking-tighter mix-blend-difference hover:opacity-80 transition-opacity text-white">
            VINCERE
          </a>
        </div>
        
        <div className="flex items-center gap-2 relative">
          <button 
            className={cn(
              "px-6 py-2.5 rounded-full transition-all duration-300 font-medium text-xs tracking-wider glass-panel",
              isOpen ? "bg-white/20 text-white" : "text-white hover:bg-white/10"
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Fechar' : 'Menu'}
          </button>

          <button 
            className="hidden md:inline-flex px-6 py-2.5 rounded-full text-white transition-all duration-300 font-medium text-xs tracking-wider glass-panel hover:bg-white/10"
            onClick={() => {
              setIsOpen(false);
              document.querySelector('#footer')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Agendar chamada
          </button>

          {/* EXACT DROPDOWN CARD FROM SCREENSHOT */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute top-[calc(100%+8px)] right-0 w-[240px] md:w-[280px] glass-panel shadow-2xl rounded-2xl p-6 md:p-8 flex flex-col origin-top-right text-white z-[110]"
              >
                {/* Main Links */}
                <div className="flex flex-col gap-4 mb-8">
                  {navLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => handleClick(link.href)}
                      className="group relative text-2xl md:text-3xl font-serif-display font-medium tracking-tight text-white/90 hover:text-white transition-colors text-left w-fit"
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full opacity-50" />
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
                  className="w-full bg-white text-black font-medium rounded-xl py-3.5 transition-all duration-300 text-sm tracking-wide hover:bg-white/90"
                >
                  Contato
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
            className="fixed inset-0 z-[90] bg-black/5 backdrop-blur-[4px] pointer-events-auto"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
