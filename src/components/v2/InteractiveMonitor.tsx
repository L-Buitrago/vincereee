import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, PlayCircle } from "lucide-react";

const InteractiveMonitor = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="monitor" className="py-32 bg-background px-4 md:px-24 overflow-hidden relative z-10">
      <div className="container mx-auto">
        <div className="relative group cursor-pointer" onClick={() => setIsExpanded(true)}>
           {/* 3D Monitor with Perspective */}
           <div className="relative flex justify-center items-center" style={{ perspective: "1200px" }}>
              <div 
                className="relative w-full max-w-5xl rounded-[12px] overflow-hidden bg-[#1a1a1a] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)] transition-transform duration-700 group-hover:scale-[1.02]"
                style={{ 
                  transform: "rotateY(-8deg) rotateX(4deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Monitor Bezel */}
                <div className="bg-black p-3 rounded-[12px]">
                   {/* Screen Content */}
                   <div className="relative aspect-[16/10] rounded-[4px] overflow-hidden bg-white">
                      <img 
                        src="https://vendredi-society.com/wp-content/uploads/2024/01/ppot_big-2048x1134.webp" 
                        alt="Press Play On Tape - Interface"
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Interaction Overlay */}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700 flex items-center justify-center">
                         <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-125 transition-transform duration-500">
                            <PlayCircle className="w-8 h-8 text-white" />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Webcam Dot */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-zinc-700" />
              </div>

              {/* Monitor Stand */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                 <div className="w-16 h-12 bg-gradient-to-b from-zinc-300 to-zinc-400 rounded-b-sm" style={{ transform: "rotateY(-8deg)" }} />
                 <div className="w-32 h-2 bg-zinc-400 rounded-full mt-0" />
              </div>
           </div>

           {/* "LET'S PLAY" Text Behind Monitor (Vendredi Style) */}
           <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between items-center px-4 md:px-12 pointer-events-none opacity-20" style={{ zIndex: -1 }}>
              <span className="text-[15vw] font-extrabold tracking-tighter text-foreground leading-none select-none">LET'S</span>
              <span className="text-[15vw] font-extrabold tracking-tighter text-foreground leading-none select-none">PLAY</span>
           </div>

           {/* Content Below Monitor */}
           <div className="mt-20 flex flex-col md:flex-row justify-between items-start gap-12">
              <div className="max-w-2xl">
                 <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/30 mb-4">[ Featured Project ]</p>
                 <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-foreground mb-6">
                    Music, sound and voice. <br />
                    <span className="italic font-serif font-light text-foreground/40">Secretly designed to unlock a little love.</span>
                 </h2>
                 <p className="text-xl text-foreground/60 leading-relaxed">
                    Nossa abordagem para a indústria musical combina minimalismo estético com potência tecnológica. O futuro do som é visual.
                 </p>
              </div>
              <div className="flex flex-col gap-4">
                 <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening modal
                    const contact = document.getElementById('footer');
                    if (contact) contact.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-3 bg-[#60A5FA] text-black rounded-full font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors relative z-20"
                >
                  Ver Projeto Completo
                </button>
              </div>
           </div>
        </div>
      </div>

      {/* Expanded Modal Experience */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#0F172A] p-8 flex items-center justify-center"
          >
             <button 
                onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                className="absolute top-12 right-12 text-white/40 hover:text-white transition-colors z-10"
             >
                <X className="w-12 h-12" />
             </button>

             <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <div className="flex flex-col gap-12">
                   <h3 className="text-6xl md:text-9xl font-serif italic text-[#60A5FA] leading-[0.8] tracking-tighter">
                      LET&apos;S <br /> <span className="not-italic font-sans font-extrabold text-white">PLAY.</span>
                   </h3>
                   <div className="flex flex-col gap-6 max-w-lg">
                      <p className="text-2xl text-white/80 leading-relaxed font-light">
                        Uma imersão completa em áudio 3D e interfaces generativas. 
                      </p>
                      <img 
                        src="https://vendredi-society.com/wp-content/uploads/2024/02/team.webp" 
                        className="w-full aspect-video object-cover rounded-[32px] opacity-40 grayscale"
                        alt="Process"
                      />
                   </div>
                </div>
                
                <div className="relative aspect-square rounded-full border border-white/5 flex items-center justify-center animate-spin-slow">
                   <div className="w-4/5 h-4/5 rounded-full border border-[#60A5FA]/20 flex items-center justify-center">
                      <div className="w-3/5 h-3/5 rounded-full bg-[#60A5FA] flex items-center justify-center">
                         <div className="w-1/4 h-1/4 bg-black rounded-full" />
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default InteractiveMonitor;
