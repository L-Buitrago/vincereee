import { motion } from "framer-motion";
import { ArrowRight, Sparkles, MessageCircle } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="py-32 bg-[#FAFAFA] relative overflow-hidden" id="contato">
      {/* Decorative Background Shapes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-primary/5 rounded-full blur-[180px] pointer-events-none" />
      
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-foreground text-background p-12 md:p-24 overflow-hidden relative shadow-[0_40px_100px_rgba(15,23,42,0.4)]">
          {/* Subtle noise and pattern inside the dark card */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10 mix-blend-overlay pointer-events-none" />
          
          <div className="flex flex-col items-center text-center space-y-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(59,130,246,0.5)]"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-7xl font-black tracking-tighter leading-[1.05]"
            >
              Pronto para elevar o seu <br className="hidden md:block" />
              <span className="text-primary italic">faturamento?</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-2xl text-gray-400 font-medium max-w-2xl"
            >
              Comece hoje mesmo com a Vincere e descubra como a tecnologia e a estratégia de recuperação podem transformar seu negócio.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-6 mt-8"
            >
              <button className="group relative px-10 py-5 bg-primary text-white rounded-full overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_15px_40px_rgba(59,130,246,0.4)]">
                <div className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out mix-blend-overlay"></div>
                <span className="relative flex items-center gap-2 font-black text-lg tracking-wide uppercase">
                  Falar Conosco
                  <MessageCircle className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-16 flex flex-wrap justify-center gap-8 text-gray-500 font-bold uppercase tracking-widest text-[10px]"
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Recuperação 24/7
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Dashboards Personalizados
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Sites de Alta Performance
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
