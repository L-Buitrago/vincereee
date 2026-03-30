import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu as MenuIcon, ArrowUpRight } from "lucide-react";
import ShuffleText from "./ShuffleText";

interface ModernMenuProps {
  onNavigate?: (id: string) => void;
}

const ModernMenu: React.FC<ModernMenuProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const menuLinks = [
    { label: "Home", href: "#home" },
    { label: "Work", href: "#cases" },
    { label: "Services", href: "#servicos" },
    { label: "About", href: "#about" },
    { label: "Platform", href: "/plataforma/dashboard" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setIsOpen(false);
      if (onNavigate) {
        onNavigate(href);
      } else {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[120] px-6 py-8 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto">
          <a href="#home" className="text-xl font-serif italic tracking-tighter text-foreground mix-blend-difference">
            Vincere Society
          </a>
        </div>

        <div className="flex gap-4 pointer-events-auto items-center">
          {/* Menu Button + Dropdown Container */}
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              className={`px-6 py-3 backdrop-blur-xl rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all duration-500 min-w-[120px] justify-center border ${
                isOpen 
                  ? "bg-white/10 text-foreground border-black/10 shadow-sm" 
                  : "bg-black/5 text-foreground border-black/5 hover:bg-black/10 shadow-sm"
              }`}
            >
              <ShuffleText 
                text={isOpen ? "CLOSE" : "MENU"} 
                className="w-12 text-center" 
              />
              <div className="relative w-4 h-4 overflow-hidden">
                 <motion.div
                   animate={{ y: isOpen ? -16 : 0 }}
                   transition={{ duration: 0.4, ease: [0.77, 0, 0.18, 1] }}
                   className="flex flex-col"
                 >
                   <MenuIcon className="w-4 h-4 shrink-0" />
                   <X className="w-4 h-4 shrink-0" />
                 </motion.div>
              </div>
            </button>

            {/* Vendredi-Style Dropdown Box - Now correctly positioned under Menu button */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10, originX: 0.5, originY: 0 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.4, ease: [0.77, 0, 0.18, 1] }}
                  className="absolute top-full left-0 mt-4 w-64 bg-black/50 backdrop-blur-3xl rounded-[32px] overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] z-[130] text-white border border-white/10"
                >
                  <nav className="p-6">
                    <ul className="space-y-2 mb-6">
                      {menuLinks.map((link, i) => (
                        <motion.li 
                          key={link.label}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.05 + 0.1, duration: 0.4 }}
                        >
                          <a 
                            href={link.href} 
                            onClick={(e) => handleLinkClick(e, link.href)}
                            className="text-xl font-medium tracking-tight hover:opacity-100 opacity-50 transition-all flex items-center justify-between group py-1"
                          >
                            <span className="relative inline-block">
                              {link.label}
                              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
                            </span>
                            <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300 text-sm">
                               →
                            </span>
                          </a>
                        </motion.li>
                      ))}
                    </ul>

                    <div className="pt-6 border-t border-white/10 flex flex-col gap-6">
                      <div className="flex gap-4">
                         <a href="#" className="text-[9px] font-bold uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity flex items-center gap-1 group">
                           Instagram <span className="text-[8px]">↗</span>
                         </a>
                         <a href="#" className="text-[9px] font-bold uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity flex items-center gap-1 group">
                           LinkedIn <span className="text-[8px]">↗</span>
                         </a>
                         <a href="#" className="text-[9px] font-bold uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity flex items-center gap-1 group">
                           X <span className="text-[8px]">↗</span>
                         </a>
                      </div>

                      <button 
                        onClick={() => {
                           setIsOpen(false);
                           const footer = document.getElementById('footer');
                           footer?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full py-4 bg-[#60A5FA] text-secondary rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-lg"
                      >
                        Contact us
                      </button>
                    </div>
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button className="px-6 py-3 bg-black/5 backdrop-blur-md text-foreground border border-black/5 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-black/10 transition-all shadow-lg">
            Book a call
          </button>
        </div>
      </header>
    </>
  );
};

export default ModernMenu;
