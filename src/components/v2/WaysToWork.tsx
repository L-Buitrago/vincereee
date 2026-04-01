import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

// Magnetic card component
const MagneticCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const WaysToWork = () => {
  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, hsl(217 91% 60% / 0.06), transparent 70%)" }} />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, hsl(280 80% 60% / 0.05), transparent 70%)" }} />
      </div>

      <div className="container mx-auto px-4 md:px-24 relative">
        {/* Big Serif Title with scroll reveal */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.77, 0, 0.18, 1] }}
          className="mb-20 text-center"
        >
          <h2 className="text-6xl md:text-[10vw] font-serif italic text-foreground/90 tracking-tighter leading-[0.9]">
            TWO WAYS <br /> TO WORK <br /> WITH US
          </h2>
        </motion.div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-12 perspective-1000">
          {/* Card 1: Large (Left) */}
          <MagneticCard className="lg:col-span-8">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-secondary text-white rounded-[48px] p-12 min-h-[600px] flex flex-col justify-between group cursor-pointer relative overflow-hidden shadow-2xl shimmer-line gradient-border gradient-border-animated"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
              {/* Geometric pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "32px 32px"
              }} />
              
              <div className="relative z-10 flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">[ Custom Package ]</span>
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 45 }}
                  className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all shadow-lg"
                >
                  <ArrowUpRight className="w-6 h-6" />
                </motion.div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-5xl md:text-8xl font-serif italic tracking-tighter mb-8 leading-[0.8]">
                  Built to <br /> last long.
                </h3>
                <p className="text-white/60 max-w-lg text-lg leading-relaxed">
                  Estratégia, Design e Tecnologia de ponta. Transformamos visões ambiciosas em ecossistemas digitais de alto impacto que definem categorias.
                </p>
              </div>

              {/* Glow on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
          </MagneticCard>

          {/* Right Column */}
          <div className="lg:col-span-4 flex flex-col gap-6 perspective-1000">
            {/* Card 2 */}
            <MagneticCard className="flex-1">
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="bg-muted text-secondary rounded-[48px] p-10 h-full flex flex-col justify-between group cursor-pointer border border-secondary/5 hover:shadow-xl transition-all relative overflow-hidden gradient-border"
              >
                {/* Geometric pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: "linear-gradient(45deg, currentColor 25%, transparent 25%), linear-gradient(-45deg, currentColor 25%, transparent 25%)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px"
                }} />

                <div className="relative z-10 flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">[ Fixed Price ]</span>
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 45 }}
                    className="w-10 h-10 rounded-full border border-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">One-time <br />project.</h3>
                  <p className="text-secondary/40 text-sm">Escopo fechado e entrega rápida.</p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            </MagneticCard>

            {/* Card 3 */}
            <MagneticCard className="flex-1">
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="bg-primary text-white rounded-[48px] p-10 h-full flex flex-col justify-between group cursor-pointer shadow-xl hover:shadow-[0_20px_60px_-12px_rgba(59,130,246,0.4)] transition-all relative overflow-hidden gradient-border gradient-border-animated"
              >
                <div className="absolute inset-0 opacity-[0.06]" style={{
                  backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "24px 24px"
                }} />

                <div className="relative z-10 flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">[ Subscription ]</span>
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 45 }}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all shadow-md"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">As-You-Go <br />rhythm.</h3>
                  <p className="text-white/40 text-sm">Escalabilidade infinita por mensalidade fixa.</p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            </MagneticCard>
          </div>
        </div>

        {/* Bottom 2-Card Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 perspective-1000">
          <MagneticCard>
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-primary rounded-[32px] p-10 md:p-12 flex flex-col items-center justify-between min-h-[400px] text-center shadow-2xl relative overflow-hidden group gradient-border gradient-border-animated"
            >
              <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "28px 28px"
              }} />

              <h3 className="text-xl md:text-2xl font-serif italic text-white leading-tight mt-4 relative z-10">
                Fluxos de trabalho claros <br /> e resultados mais rápidos.
              </h3>

              <div className="flex flex-col gap-3 my-8 w-full max-w-xs relative z-10">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-secondary text-white rounded-full px-6 py-3 text-sm font-bold text-left shadow-lg"
                >
                  Seu Projeto
                </motion.div>
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/10 text-white rounded-full px-6 py-3 text-sm font-medium text-left border border-white/10 shimmer-line"
                >
                  Hand-Off
                </motion.div>
              </div>

              <a href="#about" className="px-8 py-4 bg-white text-primary rounded-full font-bold text-xs uppercase tracking-widest hover:bg-secondary hover:text-white transition-all shadow-xl relative z-10 group/btn">
                <span className="flex items-center gap-2">
                  Nossa abordagem
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:rotate-45 transition-transform" />
                </span>
              </a>

              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
          </MagneticCard>

          <MagneticCard>
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-[32px] p-10 md:p-12 flex flex-col items-center justify-between min-h-[400px] text-center border border-secondary/5 shadow-2xl relative overflow-hidden group glow-card-hover transition-shadow duration-500"
            >
              <h3 className="text-xl md:text-2xl font-serif italic text-secondary leading-tight mt-4 relative z-10">
                Melhor uso do seu investimento <br /> com especialistas de verdade.
              </h3>

              <div className="my-8 flex items-center justify-center relative z-10">
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="w-12 h-24 bg-secondary rounded-full relative overflow-hidden shadow-lg"
                >
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-6 bg-primary rounded-full shadow-inner" />
                  {/* Shimmer effect */}
                  <motion.div
                    animate={{ y: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                    className="absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-white/20 to-transparent"
                  />
                </motion.div>
              </div>

              <a href="#about" className="px-8 py-4 bg-secondary text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl relative z-10 group/btn">
                <span className="flex items-center gap-2">
                  Sobre nós
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:rotate-45 transition-transform" />
                </span>
              </a>
            </motion.div>
          </MagneticCard>
        </div>
      </div>
    </section>
  );
};

export default WaysToWork;
