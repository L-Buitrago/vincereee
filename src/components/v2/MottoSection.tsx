import { motion } from "framer-motion";

const MottoSection = () => {
  return (
    <section className="pt-12 pb-32 bg-background px-4 md:px-24">
      <div className="container mx-auto">
        {/* Top Tag */}
        <div className="mb-12">
           <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-foreground/30">[ Digital Design Studio ]</span>
        </div>

        {/* 3-Column Layout: Tag | Text | Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
           {/* Center Column — Motto + Description */}
           <div className="lg:col-span-5 lg:col-start-5 flex flex-col gap-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/5 border border-secondary/10 w-fit">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Nossa Essência</span>
              </div>
              
              <p className="text-lg text-foreground/60 leading-relaxed font-medium">
                 Nós entregamos marcas com <span className="text-foreground font-bold underline decoration-primary/30 decoration-2 underline-offset-4">objetivos ambiciosos</span> através de estratégia e criatividade de alto impacto, unindo os melhores talentos do mercado.
              </p>
              <p className="text-sm text-foreground/40 leading-relaxed">
                 Sem nunca comprometer a sanidade da equipe. Focado em performance real.
              </p>
           </div>

           {/* Right Column — Glowing 3D Object */}
           <div className="lg:col-span-3">
              <motion.div 
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative w-full aspect-square rounded-[40px] overflow-hidden bg-secondary flex items-center justify-center p-8 group shadow-2xl"
              >
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                 <img 
                   src="https://vendredi-society.com/wp-content/uploads/2024/02/Hero-1.jpg" 
                   alt="3D Abstract Interaction"
                   className="w-full h-full object-contain mix-blend-screen scale-125 group-hover:scale-150 transition-transform duration-[3s]" 
                 />
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-24 h-24 rounded-full bg-primary/10 blur-3xl" />
                 </div>
              </motion.div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default MottoSection;
