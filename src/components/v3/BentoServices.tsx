import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, BarChart, Code2, LineChart, MessageCircle, Phone, Plus, TrendingUp, Users } from "lucide-react";
import { useRef } from "react";

const BentoServices = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section 
      ref={containerRef}
      className="py-32 w-full bg-[#FAFAFA] relative overflow-hidden" 
      id="solucoes"
    >
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        
        <div className="flex flex-col items-center justify-center text-center mb-16 md:mb-24 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-primary uppercase tracking-widest text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            Nossas Soluções
            <Plus className="w-4 h-4" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground max-w-4xl"
          >
            A tríade perfeita <br className="hidden md:block"/> para o seu negócio.
          </motion.h2>
        </div>

        <motion.div 
          style={{ scale, opacity }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto"
        >
          {/* Card 1: WhatsApp Recovery (Large Left) */}
          <div className="md:col-span-7 group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-white border border-gray-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 min-h-[480px]">
            {/* Background Blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/10 rounded-full blur-[80px] group-hover:bg-green-400/20 transition-colors duration-500" />
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center border border-green-100">
                <MessageCircle className="w-7 h-7 text-green-600" />
              </div>
              <ArrowUpRight className="w-6 h-6 text-gray-300 group-hover:text-foreground transition-colors group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" />
            </div>

            <div className="relative z-10 mt-auto pt-32">
              <h3 className="text-3xl font-bold text-foreground mb-3 tracking-tight">Recuperação de Inadimplência via WhatsApp</h3>
              <p className="text-muted-foreground text-lg max-w-md font-medium leading-relaxed">
                Transforme carrinhos abandonados e mensalidades atrasadas em dinheiro limpo na sua conta. Disparos inteligentes com alta taxa de conversão.
              </p>
            </div>

            {/* Floating Mockup */}
            <div className="absolute top-8 right-[-10%] md:right-8 w-64 rounded-2xl bg-white border border-gray-100 shadow-xl p-4 rotate-6 group-hover:rotate-3 transition-transform duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold">Mensalidade Atrasada</div>
                  <div className="text-[10px] text-gray-400">Há 5 minutos</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 font-medium">
                "Olá! Seu boleto da escola venceu ontem. Podemos regerar para hoje sem juros?"
              </div>
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Card 2: Web Agency (Top Right) */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-white border border-gray-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 flex-1 min-h-[250px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-colors duration-500" />
              
              <div className="relative z-10 flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
              </div>

              <div className="relative z-10 mt-auto pt-12">
                <h3 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Desenvolvimento Premium</h3>
                <p className="text-muted-foreground text-base font-medium">
                  Landing pages, sites e e-commerces ultra rápidos (como este).
                </p>
              </div>
            </div>

            {/* Card 3: Dashboard SaaS (Bottom Right) */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-foreground text-white border border-gray-800 p-8 shadow-2xl hover:shadow-[0_20px_60px_rgba(15,23,42,0.4)] transition-all duration-500 flex-1 min-h-[250px]">
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-colors duration-500" />
              
              <div className="relative z-10 flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md">
                  <BarChart className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-6 h-6 text-gray-500 group-hover:text-primary transition-colors group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" />
              </div>

              <div className="relative z-10 mt-auto pt-12">
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Métricas & Dashboard</h3>
                <p className="text-gray-400 text-base font-medium">
                  Controle total de alunos ou pacientes em uma plataforma exclusiva.
                </p>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default BentoServices;
