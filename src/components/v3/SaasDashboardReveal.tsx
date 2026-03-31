import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BarChart3, Users, Clock, CheckCircle2, AlertCircle, Search } from "lucide-react";

const SaasDashboardReveal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);

  return (
    <section ref={containerRef} className="py-32 bg-white relative overflow-hidden" id="plataforma">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-bold tracking-tight">Gestão Inteligente</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
              Sua empresa na palma <br /> da sua mão. <span className="text-primary">Literalmente.</span>
            </h2>
            
            <p className="text-lg text-muted-foreground font-medium max-w-lg">
              Nossa plataforma oferece um dashboard personalizado onde você visualiza as métricas reais do seu negócio. Saiba exatamente quem pagou, quem está inadimplente e como está sua saúde financeira em tempo real.
            </p>

            <ul className="space-y-4">
              {[
                { icon: Users, text: "Controle total de alunos, pacientes ou clientes." },
                { icon: Clock, text: "Histórico de pagamentos e alertas automáticos." },
                { icon: CheckCircle2, text: "Integração direta com nossa recuperação via WhatsApp." }
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="flex items-center gap-3 text-foreground font-semibold"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  {item.text}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            style={{ scale, opacity }}
            className="relative"
          >
            {/* The "Dashboard Mockup" */}
            <div className="relative z-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
              {/* Header */}
              <div className="h-16 border-b border-gray-50 flex items-center justify-between px-6 bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs">V</div>
                  <div className="h-4 w-32 bg-gray-200 rounded-full animate-pulse" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Total Recebido</span>
                    <div className="text-2xl font-black text-foreground">R$ 48.290</div>
                    <div className="text-[10px] text-green-500 font-bold">+12.5% este mês</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-destructive tracking-wider">Inadimplentes</span>
                    <div className="text-2xl font-black text-foreground">14</div>
                    <div className="text-[10px] text-destructive font-bold">Ação necessária</div>
                  </div>
                </div>

                {/* Table Simulation */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm">Alunos Recentes</h4>
                    <Search className="w-4 h-4 text-gray-300" />
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: "Carlos Eduardo", status: "Pago", color: "bg-green-500" },
                      { name: "Mariana Silva", status: "Atrasado", color: "bg-destructive" },
                      { name: "João Pedro", status: "Pago", color: "bg-green-500" }
                    ].map((user, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200" />
                          <span className="text-xs font-bold">{user.name}</span>
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-[9px] font-black text-white ${user.color}`}>
                          {user.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Floating Elements */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 z-20 w-32 h-32 bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 flex flex-col justify-center items-center text-center space-y-2"
            >
              <AlertCircle className="w-8 h-8 text-destructive animate-pulse" />
              <div className="text-[10px] font-black leading-tight">Alerta de Inadimplência</div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-10 -left-10 z-20 w-40 h-24 bg-foreground text-white rounded-3xl shadow-2xl p-4 flex flex-col justify-center space-y-1"
            >
              <div className="text-[10px] text-gray-400 font-bold uppercase">Meta Batida</div>
              <div className="text-xl font-black">94.2%</div>
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="w-[94%] h-full bg-primary" />
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default SaasDashboardReveal;
