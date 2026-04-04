import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, MessageCircle, Bot, Zap, Check } from "lucide-react";
import ViExperienceSurvey from "./ViExperienceSurvey";

const FinalCTA = () => {
  const [showSurvey, setShowSurvey] = useState(false);

  return (
    <section id="falar-conosco" className="relative py-60 min-h-[90vh] flex items-center bg-white overflow-hidden text-[#0f172a]">
      {/* Background Video (Azul com branco) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        >
          <source src="/185365-875417518_medium.mp4" type="video/mp4" />
        </video>
        {/* Subtle radial gradient overlay to keep it soft and clean */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-white/80" />
      </div>
      
      <div className="container px-4 md:px-6 mx-auto relative z-10 w-full">
        <AnimatePresence mode="wait">
          {!showSurvey ? (
            <motion.div 
              key="cta-initial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.98, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center space-y-10"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="px-5 py-2 rounded-full bg-sky-100/50 border border-sky-200 flex items-center gap-2 mb-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">EXPERIÊNCIA ÚNICA VINCERE</span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.95] text-[#0f172a]"
              >
                Esqueça as tabelas de preço. <br className="hidden md:block" />
                <span className="text-primary italic">Descubra seu plano com a VI.</span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-xl md:text-2xl text-gray-500 font-medium max-w-4xl leading-relaxed"
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
                  className="group relative px-16 py-8 bg-primary text-white rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_25px_60px_rgba(59,130,246,0.25)] flex items-center gap-6"
                >
                  <div className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out mix-blend-overlay"></div>
                  <span className="relative flex items-center gap-3 font-black text-xl tracking-tight uppercase">
                    Iniciar Experiência com a VI
                  </span>
                  <Bot className="w-7 h-7 relative z-10 p-1.5 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors" />
                </button>
              </motion.div>

              <div className="mt-24 flex flex-wrap justify-center gap-16 text-gray-400 font-black uppercase tracking-[0.2em] text-[11px]">
                 <div className="flex items-center gap-3">
                   <Zap className="w-4 h-4 text-sky-400" />
                   <span>Resultado Instantâneo</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <Check className="w-4 h-4 text-sky-400" />
                   <span>100% Personalizado</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <Sparkles className="w-4 h-4 text-sky-400" />
                   <span>Foco em Conversão</span>
                 </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="survey-experience"
              initial={{ opacity: 0, scale: 0.98, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10 w-full max-w-6xl mx-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <button 
                  onClick={() => setShowSurvey(false)}
                  className="text-sm font-bold text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" /> Voltar para o início
                </button>
                <div className="flex items-center gap-3 text-primary font-bold text-sm tracking-widest uppercase">
                  <Bot className="w-5 h-5" /> VI Experience Survey
                </div>
              </div>
              <ViExperienceSurvey onComplete={() => setShowSurvey(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FinalCTA;
