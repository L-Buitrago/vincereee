import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, MessageCircle, Bot, Zap, Check } from "lucide-react";
import ViExperienceSurvey from "./ViExperienceSurvey";

const FinalCTA = () => {
  const [showSurvey, setShowSurvey] = useState(false);

  return (
    <section className="py-32 bg-[#FAFAFA] relative overflow-hidden" id="contato">
      {/* Decorative Background Shapes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-primary/5 rounded-full blur-[180px] pointer-events-none" />
      
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className={`max-w-5xl mx-auto rounded-[3rem] bg-foreground text-background p-12 md:p-24 overflow-hidden relative shadow-[0_40px_100px_rgba(15,23,42,0.4)] transition-all duration-700 ${showSurvey ? 'md:p-16' : 'md:p-24'}`}>
          {/* Subtle noise and pattern inside the dark card */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10 mix-blend-overlay pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {!showSurvey ? (
              <motion.div 
                key="cta-initial"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center text-center space-y-8 relative z-10"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 flex items-center gap-2 mb-4"
                >
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">EXPERIÊNCIA ÚNICA VINCERE</span>
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-7xl font-black tracking-tighter leading-[1.05]"
                >
                  Esqueça as tabelas de preço. <br className="hidden md:block" />
                  <span className="text-primary italic">Descubra seu plano com a VI.</span>
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-lg md:text-xl text-gray-400 font-medium max-w-3xl"
                >
                  Nossa IA analisará suas necessidades em tempo real para criar uma <br className="hidden md:block" /> proposta totalmente personalizada para o seu negócio. Sinta-se único.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="pt-8"
                >
                  <button 
                    onClick={() => setShowSurvey(true)}
                    className="group relative px-12 py-6 bg-primary text-white rounded-full overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_20px_50px_rgba(59,130,246,0.5)] flex items-center gap-4"
                  >
                    <div className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out mix-blend-overlay"></div>
                    <span className="relative flex items-center gap-3 font-black text-lg tracking-wide uppercase">
                      Iniciar Experiência com a VI
                    </span>
                    <Bot className="w-6 h-6 relative z-10 p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors" />
                  </button>
                </motion.div>

                <div className="mt-16 flex flex-wrap justify-center gap-12 text-gray-500 font-bold uppercase tracking-widest text-[9px] opacity-60">
                   <div className="flex items-center gap-2">
                     <Zap className="w-3 h-3" />
                     <span>Resultado Instantâneo</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Check className="w-3 h-3" />
                     <span>100% Personalizado</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Sparkles className="w-3 h-3" />
                     <span>Foco em Conversão</span>
                   </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="survey-experience"
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full"
              >
                <ViExperienceSurvey onComplete={() => setShowSurvey(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
