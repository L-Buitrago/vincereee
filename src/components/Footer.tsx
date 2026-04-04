import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import VincereLogo from "./VincereLogo";
import { MessageCircle, Mail, Instagram, Linkedin, ArrowUpRight } from "lucide-react";

const Footer = () => {
  return (
    <footer id="footer" className="relative bg-secondary text-white overflow-hidden">
      {/* Hero Video Background Repeat (Premium Subtle Look) */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover"
        >
          <source src="/185365-875417518_medium.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-secondary/80" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
        {/* CTA Section */}
        <div className="mb-24 md:mb-40 text-center">
           <motion.h2 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="text-5xl md:text-[8vw] font-serif italic tracking-tighter mb-16 leading-[0.9] text-white"
           >
             Pronto para <br /> começar agora?
           </motion.h2>
           <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <a 
                href="mailto:contato@vincere.tech" 
                className="w-full sm:w-auto px-12 py-5 bg-primary text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-primary transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 duration-300"
              >
                <Mail className="w-5 h-5" />
                Diga um Olá
              </a>
              <a 
                href="https://wa.me/5500000000000" // Placeholder for now
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-12 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-24">
          <div className="md:col-span-12 lg:col-span-5 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <VincereLogo className="w-8 h-8 group-hover:scale-110 transition-transform duration-500" />
              <span className="text-3xl font-serif italic tracking-tighter">Vincere</span>
            </Link>
            <p className="text-white/50 text-xl font-medium leading-relaxed max-w-md">
              Elevando marcas através do design estratégico, tecnologia de ponta e inteligência artificial. Onde o luxo encontra a performance.
            </p>
          </div>
          
          <div className="md:col-span-4 lg:col-span-2 space-y-8">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-4">Menu</p>
            <ul className="space-y-5">
              <li><Link to="/" className="text-sm font-bold text-white/70 hover:text-white transition-all flex items-center gap-2 group">Início <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" /></Link></li>
              <li><Link to="/about" className="text-sm font-bold text-white/70 hover:text-white transition-all flex items-center gap-2 group">A Vincere <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" /></Link></li>
              <li><a href="/#servicos" className="text-sm font-bold text-white/70 hover:text-white transition-all flex items-center gap-2 group">Serviços <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" /></a></li>
              <li><Link to="/auth" className="text-sm font-bold text-white/70 hover:text-white transition-all flex items-center gap-2 group">Plataforma <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" /></Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 lg:col-span-2 space-y-8">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-4">Social</p>
            <ul className="space-y-5">
              <li><a target="_blank" href="https://instagram.com" className="text-sm font-bold text-white/70 hover:text-white transition-all flex items-center gap-2 group"><Instagram className="w-4 h-4" /> Instagram</a></li>
              <li><a target="_blank" href="https://linkedin.com" className="text-sm font-bold text-white/70 hover:text-white transition-all flex items-center gap-2 group"><Linkedin className="w-4 h-4" /> LinkedIn</a></li>
            </ul>
          </div>

          <div className="md:col-span-4 lg:col-span-3 space-y-8">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-4">Novidades</p>
            <div className="space-y-4">
              <p className="text-xs text-white/40 leading-relaxed font-medium">Receba os últimos projetos e insights no seu e-mail.</p>
              <div className="flex gap-4">
                <input 
                  type="email" 
                  placeholder="Seu e-mail" 
                  className="bg-transparent border-b border-white/10 py-3 focus:border-primary outline-none text-sm w-full transition-colors group-placeholder:text-white/20"
                />
                <button className="text-xs font-black hover:text-primary transition-all uppercase tracking-widest pt-2">Assinar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-8">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20">© 2026 Vincere. Todos os direitos reservados.</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
             <Link to="/privacidade" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors">Política de Privacidade</Link>
             <Link to="/termos" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors">Termos de Uso</Link>
             <Link to="/devolucoes" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors">Reembolso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
