import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Instagram, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ModernMenu from "@/components/v2/ModernMenu";
import PageTransition from "@/components/v2/PageTransition";
import Footer from "@/components/Footer";

const About = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isOutgoing, setIsOutgoing] = useState(false);
  const [showVortex, setShowVortex] = useState(true);
  const [showFounders, setShowFounders] = useState(false);

  // Transition off on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
    
    // Vortex to Founders transition
    const vortexTimer = setTimeout(() => {
      setShowVortex(false);
      setShowFounders(true);
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(vortexTimer);
    };
  }, []);

  const handlePageNavigate = (href: string) => {
    setIsOutgoing(true);
    setTimeout(() => {
      navigate(href);
    }, 800);
  };

  const handleNavigate = (targetId: string) => {
    // If we're on about page and user clicks a hash link like #cases, 
    // we need to go to index page first
    setIsOutgoing(true);
    setTimeout(() => {
      navigate(`/${targetId}`);
    }, 800);
  };

  // Founders Data
  const founders = [
    {
      name: "Founder One",
      role: "Creative Director",
      image: "https://i.pravatar.cc/400?img=68",
    },
    {
      name: "Founder Two",
      role: "Tech Lead",
      image: "https://i.pravatar.cc/400?img=60",
    },
    {
      name: "Founder Three",
      role: "Strategy & Ops",
      image: "https://i.pravatar.cc/400?img=69",
    }
  ];

  // Helper for generating spiral particles
  const particles = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    delay: i * 0.05,
    angle: (i / 24) * Math.PI * 4, // 2 full circles
    distance: 400 + Math.random() * 200,
  }));

  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/20">
      <PageTransition trigger={isTransitioning || isOutgoing} />
      <ModernMenu onNavigate={handleNavigate} onPageNavigate={handlePageNavigate} />

      <main className="relative pt-32 pb-24 px-6">
        <div className="container mx-auto">
          {/* VORTEX ANIMATION */}
          <AnimatePresence>
            {showVortex && (
              <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[50]">
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ 
                      x: Math.cos(p.angle) * p.distance * 2, 
                      y: Math.sin(p.angle) * p.distance * 2,
                      scale: 0,
                      rotate: 0,
                      opacity: 0,
                    }}
                    animate={{ 
                      x: 0, 
                      y: 0, 
                      scale: [0, 1.2, 0.5, 0],
                      rotate: 720,
                      opacity: [0, 0.8, 0.4, 0],
                    }}
                    transition={{ 
                      duration: 2.5, 
                      delay: p.delay,
                      ease: "circOut",
                    }}
                    className="absolute w-32 h-44 bg-gray-200 border border-white/20 rounded-2xl overflow-hidden shadow-2xl"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-transparent" />
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  className="text-7xl md:text-[10vw] font-black tracking-tighter text-foreground uppercase italic text-center"
                >
                  VINCERE <br/> VISION
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* FOUNDERS SECTION */}
          <div className={`transition-opacity duration-1000 ${showFounders ? "opacity-100" : "opacity-0"}`}>
             <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24 space-y-4">
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary"
                  >
                    The Architects
                  </motion.span>
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl md:text-8xl font-black tracking-tighter"
                  >
                    Nossa <span className="text-primary italic">Liderança.</span>
                  </motion.h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                  {founders.map((founder, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                      className="group flex flex-col items-center text-center space-y-6"
                    >
                      <div className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shadow-xl border border-gray-100 italic">
                        <img 
                          src={founder.image} 
                          alt={founder.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                          <div className="flex justify-center gap-4 text-white">
                             <Instagram size={20} className="hover:text-primary cursor-pointer" />
                             <Twitter size={20} className="hover:text-primary cursor-pointer" />
                             <Linkedin size={20} className="hover:text-primary cursor-pointer" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-3xl font-black tracking-tight">{founder.name}</h3>
                        <p className="text-sm font-bold uppercase tracking-widest text-primary">{founder.role}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Manifesto Text */}
                <div className="mt-40 max-w-4xl mx-auto text-center space-y-12 pb-32">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05]">
                    Criamos ecossistemas que <br/> definem o <span className="italic relative">sucesso.</span>
                  </h2>
                  <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
                    A Vincere nasceu da necessidade de unir o design de agência, a tecnologia de SaaS e a estratégia de recuperação financeira em um único braço de execução. Não somos apenas desenvolvedores ou designers, somos seus parceiros de lucro.
                  </p>
                  
                  <div className="pt-8 flex justify-center">
                    <button 
                      onClick={() => handlePageNavigate("/")} 
                      className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors group"
                    >
                      <ArrowLeft className="group-hover:-translate-x-2 transition-transform" />
                      Back to Home
                    </button>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
