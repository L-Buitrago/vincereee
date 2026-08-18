import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu as MenuIcon, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ShuffleText from "./ShuffleText";
import { useAuth } from "@/contexts/AuthContext";

interface ModernMenuProps {
  onNavigate?: (id: string) => void;
  onPageNavigate?: (href: string) => void;
}

const ModernMenu: React.FC<ModernMenuProps> = ({ onNavigate, onPageNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const menuLinks = [
    { label: "Início", href: "/" },
    { label: "Portfólio", href: "/#cases" },
    { label: "Serviços", href: "/#servicos" },
    { label: "Sobre", href: "/about" },
    { label: "Plataforma", href: "/plataforma/dashboard" },
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
      <header className="fixed top-0 left-0 w-full z-[120] px-3 py-3 lg:px-6 lg:py-8 flex justify-between items-center gap-2 pointer-events-none">
        <div className="pointer-events-auto shrink-0 min-w-0">
          <a href="#home" className="block text-base sm:text-lg lg:text-3xl font-serif italic tracking-tighter text-foreground whitespace-nowrap">
            VincereAT
          </a>
        </div>

        <div className="flex gap-1.5 lg:gap-3 pointer-events-auto items-center shrink-0">
          {/* Menu Button + Dropdown Container */}
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              className={`h-10 px-2.5 sm:px-3.5 lg:h-auto lg:px-8 lg:py-3.5 backdrop-blur-xl rounded-full font-bold text-[8px] lg:text-[10px] uppercase tracking-[0.12em] lg:tracking-[0.2em] flex items-center gap-1.5 lg:gap-3 transition-all duration-500 min-w-0 lg:min-w-[140px] justify-center border ${
                isOpen 
                  ? "bg-white/10 text-foreground border-black/10 shadow-sm" 
                  : "bg-black/5 text-foreground border-black/5 hover:bg-black/10 shadow-sm"
              }`}
            >
              <ShuffleText 
                text={isOpen ? "FECHAR" : "MENU"} 
                className="w-9 lg:w-12 text-center" 
              />
              <div className="relative w-3.5 h-3.5 lg:w-4 lg:h-4 overflow-hidden">
                 <motion.div
                   animate={{ y: isOpen ? -16 : 0 }}
                   transition={{ duration: 0.4, ease: [0.77, 0, 0.18, 1] }}
                   className="flex flex-col"
                 >
                   <MenuIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" />
                   <X className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" />
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
                  className="absolute top-[calc(100%+0.5rem)] right-0 w-[calc(100vw-24px)] max-w-[260px] bg-white/90 backdrop-blur-3xl rounded-[24px] overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] z-[130] text-foreground border border-black/5"
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
                              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-foreground transition-all duration-300 group-hover:w-full" />
                            </span>
                            <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300 text-sm">
                              →
                            </span>
                          </a>
                        </motion.li>
                      ))}
                      {user && (
                        <motion.li 
                          initial={{ y: 12, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: menuLinks.length * 0.03 + 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <button 
                            onClick={async () => {
                              await signOut();
                              setIsOpen(false);
                              navigate("/");
                            }}
                            className="w-full text-left text-lg font-medium tracking-tight hover:opacity-100 opacity-60 transition-all flex items-center justify-between group py-1.5 text-red-500"
                          >
                            <span className="relative inline-block">
                              Sair da conta atual
                              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-red-500 transition-all duration-300 group-hover:w-full" />
                            </span>
                            <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300 text-sm">
                              →
                            </span>
                          </button>
                        </motion.li>
                      )}
                    </ul>

                    <div className="pt-5 border-t border-black/5 flex flex-col gap-5">
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
                        Contato
                      </button>
                    </div>
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            onClick={() => {
              if (onPageNavigate) {
                onPageNavigate("/plataforma/dashboard");
              } else {
                navigate("/plataforma/dashboard");
              }
            }}
            className="h-10 px-2.5 sm:px-3.5 lg:h-auto lg:px-8 lg:py-3.5 bg-black/5 backdrop-blur-md text-foreground border border-black/5 rounded-full font-bold text-[8px] lg:text-[10px] uppercase tracking-[0.12em] lg:tracking-[0.2em] transition-all hover:bg-primary hover:text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:border-primary active:scale-95 whitespace-nowrap"
          >
            Plataforma
          </button>
        </div>
      </header>
    </>
  );
};

export default ModernMenu;
