import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu as MenuIcon, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ShuffleText from "./ShuffleText";

interface ModernMenuProps {
  onNavigate?: (id: string) => void;
  onPageNavigate?: (href: string) => void;
}

const ModernMenu: React.FC<ModernMenuProps> = ({ onNavigate, onPageNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const menuLinks = [
    { label: "Home", href: "/" },
    { label: "Work", href: "/#cases" },
    { label: "Services", href: "/#servicos" },
    { label: "About", href: "/about" },
    { label: "Platform", href: "/plataforma/dashboard" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") || (href === "/" && window.location.pathname === "/")) {
      // Local or hashtag navigation
      const id = href === "/" ? "#home" : href.replace("/", "");
      e.preventDefault();
      setIsOpen(false);
      if (onNavigate) {
        onNavigate(id);
      } else {
        const element = document.querySelector(id);
        element?.scrollIntoView({ behavior: "smooth" });
      }
    } else if (!href.startsWith("http")) {
      // Route navigation (e.g. /about or /)
      e.preventDefault();
      setIsOpen(false);
      if (onPageNavigate) {
        onPageNavigate(href);
      } else {
        navigate(href);
      }
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[120] px-6 py-8 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto">
          <a href="#home" className="text-xl font-serif italic tracking-tighter text-foreground mix-blend-difference">
            Vincere
          </a>
        </div>

        <div className="flex gap-3 pointer-events-auto items-center">
          {/* Menu Button + Dropdown Container */}
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              className={`px-8 py-3.5 backdrop-blur-xl rounded-full font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all duration-500 min-w-[140px] justify-center border ${
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
            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-[calc(100%+0.5rem)] right-0 w-60 bg-black/70 backdrop-blur-3xl rounded-[24px] overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] z-[130] text-white border border-white/10"
                >
                  <nav className="p-6">
                    <ul className="space-y-1 mb-8">
                      {menuLinks.map((link, i) => (
                        <motion.li 
                          key={link.label}
                          initial={{ y: 12, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: i * 0.03 + 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <a 
                            href={link.href} 
                            onClick={(e) => handleLinkClick(e, link.href)}
                            className="text-lg font-medium tracking-tight hover:opacity-100 opacity-60 transition-all flex items-center justify-between group py-1.5"
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

                    <div className="pt-5 border-t border-white/5 flex flex-col gap-5">
                      <div className="flex gap-6">
                         <a href="https://instagram.com" target="_blank" className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1 group">
                           Instagram <span className="text-[7px] opacity-40 group-hover:opacity-100">↗</span>
                         </a>
                         <a href="mailto:hello@vincere.com" className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1 group">
                           Email <span className="text-[7px] opacity-40 group-hover:opacity-100">↗</span>
                         </a>
                      </div>

                      <button 
                        onClick={() => {
                           setIsOpen(false);
                           const footer = document.getElementById('contact');
                           footer?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full py-3.5 bg-[#60A5FA] text-secondary rounded-xl font-bold text-[9px] uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-xl"
                      >
                        Contact us
                      </button>
                    </div>
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button className="px-8 py-3.5 bg-black/5 backdrop-blur-md text-foreground border border-black/5 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-black/10 transition-all shadow-sm">
            Book a call
          </button>
        </div>
      </header>
    </>
  );
};

export default ModernMenu;
