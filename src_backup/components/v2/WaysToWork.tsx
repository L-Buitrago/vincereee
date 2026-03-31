import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const WaysToWork = () => {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-24">
        {/* Big Serif Title */}
        <div className="mb-20 text-center">
          <h2 className="text-6xl md:text-[10vw] font-serif italic text-foreground/90 tracking-tighter leading-[0.9]">
            TWO WAYS <br /> TO WORK <br /> WITH US
          </h2>
        </div>

        {/* 3 Cards Grid (1 Large + 2 Small Stacked) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-12">
          {/* Card 1: Large (Left) - Aston Green */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-8 bg-secondary text-white rounded-[48px] p-12 min-h-[600px] flex flex-col justify-between group cursor-pointer relative overflow-hidden shadow-2xl"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
             <div className="relative z-10 flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">[ Custom Package ]</span>
                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                   <ArrowUpRight className="w-6 h-6" />
                </div>
             </div>
             
             <div className="relative z-10">
                <h3 className="text-5xl md:text-8xl font-serif italic tracking-tighter mb-8 leading-[0.8]">
                   Built to <br /> last long.
                </h3>
                <p className="text-white/60 max-w-lg text-lg leading-relaxed">
                   Estratégia, Design e Tecnologia de ponta. Transformamos visões ambiciosas em ecossistemas digitais de alto impacto que definem categorias.
                </p>
             </div>
          </motion.div>

          {/* Right Column (2 Small Stacked) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
             {/* Card 2: Gray / Custom Text */}
             <motion.div 
               initial={{ y: 50, opacity: 0 }}
               whileInView={{ y: 0, opacity: 1 }}
               viewport={{ once: true }}
               className="bg-muted text-secondary rounded-[48px] p-10 flex-1 flex flex-col justify-between group cursor-pointer border border-secondary/5 hover:shadow-xl transition-all"
             >
                <div className="flex justify-between items-start">
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">[ Fixed Price ]</span>
                   <div className="w-10 h-10 rounded-full border border-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                   </div>
                </div>
                <div>
                   <h3 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">One-time <br /> project.</h3>
                   <p className="text-secondary/40 text-sm">Escopo fechado e entrega rápida.</p>
                </div>
             </motion.div>

             {/* Card 3: Rolex Green */}
             <motion.div 
               initial={{ y: 50, opacity: 0 }}
               whileInView={{ y: 0, opacity: 1 }}
               viewport={{ once: true }}
               className="bg-primary text-white rounded-[48px] p-10 flex-1 flex flex-col justify-between group cursor-pointer shadow-xl hover:bg-primary/90 transition-all"
             >
                <div className="flex justify-between items-start">
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">[ Subscription ]</span>
                   <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all shadow-md">
                      <ArrowUpRight className="w-4 h-4" />
                   </div>
                </div>
                <div>
                   <h3 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">As-You-Go <br /> rhythm.</h3>
                   <p className="text-white/40 text-sm">Escalabilidade infinita por mensalidade fixa.</p>
                </div>
             </motion.div>
          </div>
        </div>

        {/* ── Bottom 2-Card Row (Luxury Style) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Green Card - Workflow */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-primary rounded-[32px] p-10 md:p-12 flex flex-col items-center justify-between min-h-[400px] text-center shadow-2xl"
          >
            <h3 className="text-xl md:text-2xl font-serif italic text-white leading-tight mt-4">
              Fluxos de trabalho claros <br /> e resultados mais rápidos.
            </h3>

            <div className="flex flex-col gap-3 my-8 w-full max-w-xs">
              <div className="bg-secondary text-white rounded-full px-6 py-3 text-sm font-bold text-left shadow-lg">
                Seu Projeto
              </div>
              <div className="bg-white/10 text-white rounded-full px-6 py-3 text-sm font-medium text-left border border-white/10">
                Hand-Off
              </div>
            </div>

            <a 
              href="#about"
              className="px-8 py-4 bg-white text-primary rounded-full font-bold text-xs uppercase tracking-widest hover:bg-secondary hover:text-white transition-all shadow-xl"
            >
              Nossa abordagem
            </a>
          </motion.div>

          {/* White Card - About */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[32px] p-10 md:p-12 flex flex-col items-center justify-between min-h-[400px] text-center border border-secondary/5 shadow-2xl"
          >
            <h3 className="text-xl md:text-2xl font-serif italic text-secondary leading-tight mt-4">
              Melhor uso do seu investimento <br /> com especialistas de verdade.
            </h3>

            {/* Leaf/feather icon placeholder */}
            <div className="my-8 flex items-center justify-center">
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="w-12 h-24 bg-secondary rounded-full relative overflow-hidden shadow-lg"
              >
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-6 bg-primary rounded-full shadow-inner" />
              </motion.div>
            </div>

            <a 
              href="#about"
              className="px-8 py-4 bg-secondary text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl"
            >
              Sobre nós
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WaysToWork;
