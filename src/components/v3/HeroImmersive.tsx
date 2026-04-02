import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, MessageSquareWarning, ArrowUpRight } from "lucide-react";
import gsap from "gsap";

const HeroImmersive = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle parallax and floating effects using GSAP
    let ctx = gsap.context(() => {
      gsap.to(".floating-shape", {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        rotation: "random(-10, 10)",
        duration: "random(4, 6)",
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.2,
      });

      // Mouse move parallax
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 20;
        const y = (clientY / window.innerHeight - 0.5) * 20;

        gsap.to(".parallax-bg", {
          x,
          y,
          duration: 1,
          ease: "power2.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[100vh] w-full bg-background flex items-center pt-24 pb-12 overflow-hidden selection:bg-primary/20"
    >
      {/* Background Decor (Light Mode Apple-esque Blur) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none parallax-bg">
        <div className="absolute top-1/4 -left-1/4 w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[120px] mix-blend-multiply floating-shape" />
        <div className="absolute bottom-1/4 -right-1/4 w-[60vw] h-[60vw] rounded-full bg-blue-400/5 blur-[150px] mix-blend-multiply floating-shape" />
        {/* Subtle grid pattern from index.css */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 mix-blend-overlay" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 mx-auto">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium tracking-tight">O futuro da sua receita</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            ref={textRef}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] text-foreground font-sans">
              Acelere a sua <br className="hidden md:block" />
              máquina de{" "}
              <motion.span 
                initial="initial"
                whileHover="hover"
                className="relative inline-flex cursor-default overflow-hidden pt-[0.1em] pb-[0.1em]"
              >
                <span className="relative flex whitespace-nowrap">
                  {"vendas.".split("").map((char, i) => (
                    <span key={i} className="relative inline-block">
                      <motion.span
                        variants={{
                          initial: { y: 0, opacity: 1 },
                          hover: { y: "-110%", opacity: 0 }
                        }}
                        transition={{ 
                          duration: 0.5, 
                          delay: i * 0.03, 
                          ease: [0.33, 1, 0.68, 1] 
                        }}
                        className="inline-block text-gradient relative z-10"
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                      <motion.span
                        variants={{
                          initial: { y: "110%", opacity: 0 },
                          hover: { y: 0, opacity: 1 }
                        }}
                        transition={{ 
                          duration: 0.5, 
                          delay: i * 0.03, 
                          ease: [0.33, 1, 0.68, 1] 
                        }}
                        className="absolute top-0 left-0 text-gradient-alt"
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    </span>
                  ))}
                </span>
              </motion.span>
            </h1>
            
            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium tracking-tight mt-6">
              Dashboard de métricas consolidado, criação de sites de alta conversão e recuperação inteligente via WhatsApp. <strong className="text-foreground">Tudo em um só lugar.</strong>
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-12 w-full justify-center"
          >
            {/* Buttons removed as requested */}
          </motion.div>

          {/* Value Props Micro-interactions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 md:mt-32 w-full max-w-4xl">
            {[
              {
                icon: BarChart3,
                title: "Dashboards",
                desc: "Controle de alunos & pacientes"
              },
              {
                icon: ArrowUpRight,
                title: "Criação de sites",
                desc: "Criamos sites, landing pages e lojas para seu negócio"
              },
              {
                icon: MessageSquareWarning,
                title: "Recuperação",
                desc: "+60% de conversão via Wpp"
              }
            ].map((prop, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -12,
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(37, 99, 235, 0.15)"
                }}
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  // Entrance transition
                  duration: 0.8,
                  delay: 0.4 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                  // Continuous floating animation
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.6
                  },
                  // Interaction transitions
                  scale: { duration: 0.25 },
                  boxShadow: { duration: 0.25 }
                } as any}
                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/60 border border-gray-100 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer group relative"
              >
                <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors duration-300">
                  <prop.icon className="w-7 h-7 text-primary stroke-[1.5]" />
                </div>
                <h3 className="font-bold text-foreground text-lg">{prop.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 font-medium leading-relaxed">{prop.desc}</p>
                <div className="absolute inset-0 rounded-2xl border-2 border-primary/0 group-hover:border-primary/10 transition-colors duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroImmersive;
