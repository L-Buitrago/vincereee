import { motion, AnimatePresence } from "framer-motion";
import { Check, Bell, MessageSquare, CreditCard, TrendingUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const notifications = [
  {
    icon: <CreditCard className="w-5 h-5 text-white" />,
    text: "Fatura semanal gerada: R$ 4.320,00",
    thumb: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=80&h=80&fit=crop",
  },
  {
    icon: <MessageSquare className="w-5 h-5 text-white" />,
    text: "Cobrança via WhatsApp enviada com sucesso",
    thumb: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=80&h=80&fit=crop",
  },
  {
    icon: <Bell className="w-5 h-5 text-white" />,
    text: "3 inadimplências detectadas automaticamente",
    thumb: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=80&h=80&fit=crop",
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-white" />,
    text: "Taxa de conversão +47% : landing page → lead",
    thumb: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=80&h=80&fit=crop",
  },
];

const BigTimeReturns = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Observe when section is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Cycle through notifications
  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % notifications.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section ref={sectionRef} className="py-32 bg-background px-4 md:px-24">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Big Title */}
          <div>
            <motion.h2 
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.77, 0, 0.18, 1] }}
              className="text-5xl md:text-[5.5vw] font-serif italic leading-[0.95] tracking-tighter text-foreground"
            >
              Feito para <br />
              <span className="underline decoration-2 underline-offset-8">grandes retornos.</span>
            </motion.h2>
          </div>

          {/* Right Side - Dark KPI Card */}
          <motion.div 
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.77, 0, 0.18, 1] }}
            className="bg-secondary rounded-[32px] p-10 md:p-12 flex flex-col gap-8 min-h-[520px] relative overflow-hidden shadow-2xl"
          >
            {/* Subtitle */}
            <h3 className="text-white/80 text-center text-xl md:text-2xl font-medium leading-tight pt-4">
              Mais que designs bonitos, <br />
              <span className="text-white font-bold">resultados que importam.</span>
            </h3>

            {/* Stacking Glass Notifications */}
            <div className="flex-1 flex flex-col items-center justify-center relative min-h-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ y: 40, opacity: 0, scale: 0.92 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -30, opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white/[0.08] backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-2xl w-full max-w-sm"
                >
                  {/* Thumbnail image */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <img 
                      src={notifications[activeIndex].thumb}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-white/70 text-sm font-medium flex-1 leading-snug">
                    {notifications[activeIndex].text}
                  </span>
                  <div className="w-7 h-7 rounded-full border border-primary/30 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Ghost cards behind (stacking effect) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-4 w-[85%] max-w-sm h-12 bg-white/[0.04] backdrop-blur-sm rounded-xl border border-white/5 -z-10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-8 w-[75%] max-w-sm h-10 bg-white/[0.02] rounded-xl border border-white/[0.03] -z-20" />
            </div>

            {/* Avatars + count */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-700 border-2 border-secondary" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-700 border-2 border-secondary" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 border-2 border-secondary" />
              </div>
              <span className="text-white/30 text-xs">+12 clientes ativos</span>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <a 
                href="#cases" 
                className="px-8 py-4 border border-white/20 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all"
              >
                Case Studies
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BigTimeReturns;
