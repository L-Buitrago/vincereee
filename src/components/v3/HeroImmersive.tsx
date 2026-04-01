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
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] text-foreground">
              Acelere a sua <br className="hidden md:block" />
              <span className="relative inline-block text-gradient pb-2">
                máquina de vendas.
                <div className="absolute bottom-0 left-0 w-full h-[0.15em] bg-primary/20 -z-10 -rotate-1 origin-left"></div>
              </span>
            </h1>
            
            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium tracking-tight mt-6">
              Recuperação inteligente via WhatsApp, agência de alta conversão e dashboard de métricas consolidado. <strong className="text-foreground">Tudo em um só lugar.</strong>
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
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 md:mt-32 w-full max-w-4xl"
          >
            {[
              {
                icon: MessageSquareWarning,
                title: "Recuperação",
                desc: "+60% de conversão via Wpp"
              },
              {
                icon: BarChart3,
                title: "Dashboards",
                desc: "Controle de alunos & pacientes"
              },
              {
                icon: ArrowUpRight,
                title: "E-commerce",
                desc: "Lojas focadas em lucro"
              }
            ].map((prop, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/50 border border-gray-100 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform duration-300">
                <prop.icon className="w-8 h-8 text-primary mb-3 stroke-[1.5]" />
                <h3 className="font-bold text-foreground">{prop.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{prop.desc}</p>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroImmersive;
