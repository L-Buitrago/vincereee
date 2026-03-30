import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Sparkles } from "lucide-react";

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const BentoCard = ({ children, className = "", delay = 0 }: BentoCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={`p-6 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors shadow-2xl relative overflow-hidden group ${className}`}
  >
    {/* Subtle Inner Glow */}
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
    
    <div className="relative z-10">{children}</div>
    
    {/* Hover Accent Glow */}
    <div className="absolute -inset-[100%] bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -translate-x-[100%] group-hover:translate-x-[100%] pointer-events-none" />
  </motion.div>
);

const BentoGrid = () => {
  return (
    <section id="servicos" className="py-32 container mx-auto px-4 bg-black">
      {/* Section Header */}
      <div className="mb-20 space-y-4">
        <h3 className="text-sm font-mono text-purple-500 uppercase tracking-[0.4em]">Soluções</h3>
        <h2 className="text-5xl md:text-7xl font-serif italic text-white">Nosso <span className="font-sans not-italic font-bold tracking-tighter">Manifesto</span></h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-auto">
        {/* Card 1: Wide & Tall (Vertical Video/Image) */}
        <BentoCard className="md:col-span-8 md:row-span-2 h-[600px] flex flex-col justify-between overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
          <div className="p-8 relative z-20 flex justify-between items-start">
             <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-white/50">Landing Pages Premium</span>
             <ArrowUpRight className="w-6 h-6 text-white/20 group-hover:text-white group-hover:rotate-45 transition-all duration-500" />
          </div>
          <div className="p-8 relative z-20 space-y-4">
            <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight">Sites que Vendem <br /> enquanto você dorme.</h3>
            <p className="text-white/40 max-w-md">Design exclusivo focado na psicologia de conversão. Não é apenas beleza, é resultado.</p>
          </div>
        </BentoCard>

        {/* Card 2: Small Square */}
        <BentoCard className="md:col-span-4 h-[290px] flex flex-col justify-end gap-4">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
          </div>
          <h4 className="text-xl font-bold text-white">Full Performance</h4>
          <p className="text-white/40 text-sm">Otimização máxima para carregamento instantâneo em qualquer conexão.</p>
        </BentoCard>

        {/* Card 3: Small Square */}
        <BentoCard className="md:col-span-4 h-[290px] flex flex-col justify-end gap-4" delay={0.1}>
          <div className="bg-purple-600/20 w-10 h-10 rounded-lg flex items-center justify-center text-purple-400">
             <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-xl font-bold text-white">UX/UI de Luxo</h4>
          <p className="text-white/40 text-sm">Interfaces que despertam desejo e confiança no seu público.</p>
        </BentoCard>

        {/* Card 4: Horizontal Banner */}
        <BentoCard className="md:col-span-12 h-[300px] flex items-center group" delay={0.2}>
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-12 px-8">
            <div className="space-y-4">
               <h3 className="text-3xl font-serif italic text-white">Pronto para elevar o nível?</h3>
               <p className="text-white/40">Vamos construir a próxima grande experiência digital da sua marca.</p>
            </div>
            <Button size="lg" className="rounded-full bg-white text-black hover:bg-white/90 px-12 h-14 font-bold text-lg transition-transform hover:scale-105 active:scale-95">
              Solicitar Proposta
            </Button>
          </div>
        </BentoCard>

        {/* Card 5: Medium Rectangle */}
        <BentoCard className="md:col-span-6 h-[400px] flex flex-col justify-end" delay={0.3}>
           <h4 className="text-2xl font-bold text-white mb-2">Automacão Inteligente</h4>
           <p className="text-white/40">Integramos seu site com as ferramentas que você já usa para ganhar escala.</p>
        </BentoCard>

        {/* Card 6: Medium Rectangle */}
        <BentoCard className="md:col-span-6 h-[400px] flex flex-col justify-end" delay={0.4}>
           <h4 className="text-2xl font-bold text-white mb-2">Ecossistemas SaaS</h4>
           <p className="text-white/40">Transformamos sua ideia de produto em uma plataforma robusta e escalável.</p>
        </BentoCard>
      </div>
    </section>
  );
};

export default BentoGrid;
