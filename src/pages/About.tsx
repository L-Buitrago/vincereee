import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Instagram, Twitter, Linkedin, Zap, Target, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModernMenu from "@/components/v2/ModernMenu";
import PageTransition from "@/components/v2/PageTransition";
import Footer from "@/components/Footer";

const About = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isOutgoing, setIsOutgoing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Transition off on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handlePageNavigate = (href: string) => {
    setIsOutgoing(true);
    setTimeout(() => {
      navigate(href);
    }, 800);
  };

  const handleNavigate = (targetId: string) => {
    setIsOutgoing(true);
    setTimeout(() => {
      navigate(`/${targetId}`);
    }, 800);
  };

  // VORTEX PARTICLES (24 unique avatars)
  const particles = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    delay: i * 0.05,
    angle: (i / 12) * Math.PI, // Distribute in 2 circles
    radius: 400 + (i % 3) * 120, // Increased radius for better visibility
    imgId: 10 + i,
  }));

  // FOUNDERS DATA (3 founders)
  const founders = [
    {
      name: "Raffael Velluti",
      role: "Creative Director",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
      color: "#ff3b30", // Saturated Red
    },
    {
      name: "Eva Dussourd",
      role: "Tech Lead",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800",
      color: "#1d1d1f", // Dark/Black
    },
    {
      name: "Marc Antoine",
      role: "Strategy & Growth",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800",
      color: "#ff3b30", // Saturated Red
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-white relative overflow-x-hidden selection:bg-primary/20 font-sans">
      <PageTransition trigger={isTransitioning || isOutgoing} />
      <ModernMenu onNavigate={handleNavigate} onPageNavigate={handlePageNavigate} />

      <main className="relative">
        
        {/* SECTION 1: THE VORTEX (Intro) */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-white">
          {/* Vortex Particles */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ 
                   x: Math.cos(p.angle) * p.radius * 3, 
                   y: Math.sin(p.angle) * p.radius * 3,
                   scale: 0,
                   opacity: 0,
                }}
                animate={{ 
                  x: Math.cos(p.angle) * p.radius, 
                  y: Math.sin(p.angle) * p.radius, 
                  scale: 1,
                  opacity: 1,
                }}
                transition={{ 
                  duration: 2.5, 
                  delay: p.delay,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute left-1/2 top-1/2 -ml-12 -mt-12 w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-xl grayscale hover:grayscale-0 transition-all duration-500"
              >
                <img 
                  src={`https://i.pravatar.cc/150?u=${p.imgId}`} 
                  alt="Talent" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>

          {/* Central Text */}
          <div className="relative z-20 text-center">
             <motion.h1 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1.5, delay: 1 }}
               className="text-5xl md:text-[6vw] font-black tracking-tighter leading-tight text-foreground"
             >
               Unlimited <br/> creatives<span className="text-primary italic">.</span>
             </motion.h1>
             <motion.p
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.4 }}
               transition={{ delay: 2 }}
               className="mt-8 text-sm font-bold uppercase tracking-[0.5em] text-foreground"
             >
               Vincere Vision & Strategy
             </motion.p>
          </div>
        </section>

        {/* SECTION 2: FOUNDERS (The Panels) */}
        <section className="relative w-full">
           <div className="grid grid-cols-1 md:grid-cols-3 min-h-screen">
             {founders.map((founder, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1, delay: i * 0.2 }}
                 className="relative group overflow-hidden flex flex-col justify-end p-12 h-screen md:h-auto"
                 style={{ backgroundColor: founder.color }}
               >
                 {/* Portrait Image */}
                 <div className="absolute inset-0 w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-700">
                    <img 
                      src={founder.image} 
                      alt={founder.name} 
                      className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 origin-bottom scale-105 group-hover:scale-100"
                    />
                 </div>

                 {/* Text Overlay (Bottom Left) */}
                 <div className="relative z-10 space-y-2 pointer-events-none">
                    <motion.p 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2 + 0.5 }}
                      className="text-white font-black text-3xl md:text-5xl tracking-tighter leading-none"
                    >
                      {founder.name}
                    </motion.p>
                    <motion.p 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 0.5, x: 0 }}
                      transition={{ delay: i * 0.2 + 0.6 }}
                      className="text-white font-bold text-xs uppercase tracking-[0.3em]"
                    >
                      {founder.role}
                    </motion.p>
                 </div>

                 {/* Social Corner (Top Right) */}
                 <div className="absolute top-12 right-12 flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-90 group-hover:scale-100">
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-foreground transition-all cursor-pointer">
                       <Instagram size={16} />
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-foreground transition-all cursor-pointer">
                       <Linkedin size={16} />
                    </div>
                 </div>
               </motion.div>
             ))}
           </div>
        </section>

        {/* SECTION 3: DARK VALUES (The Green Grid) */}
        <section className="bg-[#022c22] py-40 px-6 text-white overflow-hidden">
           <div className="container mx-auto">
              <div className="mb-24 space-y-4">
                 <h2 className="text-5xl md:text-[8vw] font-black tracking-tighter leading-[0.95] mb-8">
                   Also, we <br/> challenge fluff.
                 </h2>
                 <p className="max-w-2xl text-lg text-emerald-100/40 font-medium leading-relaxed">
                   Brands can't afford to lose time on anything beyond useful. That's our motto — efficiency over noise.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { 
                     title: "Foco em ROI Real", 
                     desc: "Não fazemos arte pela arte. Cada pixel é projetado para converter e recuperar faturamento.",
                     icon: <Target className="w-8 h-8 text-emerald-400" />
                   },
                   { 
                     title: "Velocidade Executiva", 
                     desc: "Processos enxutos, sem reuniões inúteis. Entrega de software e design em tempo recorde.",
                     icon: <Zap className="w-8 h-8 text-emerald-400" />
                   },
                   { 
                     title: "Ecossistema SaaS", 
                     desc: "Nossa tecnologia escala com seu crescimento, sem gaps de infraestrutura.",
                     icon: <Rocket className="w-8 h-8 text-emerald-400" />
                   }
                 ].map((card, i) => (
                   <motion.div
                     key={i}
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.8, delay: i * 0.1 }}
                     className="bg-[#043d30]/50 border border-white/5 rounded-[2.5rem] p-12 transition-all hover:bg-white/5 group"
                   >
                     <div className="mb-12 group-hover:scale-110 transition-transform origin-left">{card.icon}</div>
                     <h3 className="text-3xl font-bold mb-4 tracking-tight">{card.title}</h3>
                     <p className="text-emerald-100/40 font-medium leading-relaxed">{card.desc}</p>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* FOOTER CTA */}
        <section className="py-40 bg-white text-center">
           <div className="container mx-auto space-y-12">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-foreground max-w-5xl mx-auto italic">
                 Vamos elevar sua marca ao próximo <span className="text-primary">extremo.</span>
              </h2>
              
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                 <button className="px-12 py-5 bg-foreground text-background rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                   Join the club
                 </button>
                 <button 
                  onClick={() => handlePageNavigate("/")}
                  className="px-12 py-5 bg-white border border-gray-100 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2"
                 >
                   <ArrowLeft className="w-4 h-4" /> Back to Home
                 </button>
              </div>
           </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default About;
