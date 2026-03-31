import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer id="footer" className="relative bg-secondary text-white overflow-hidden">
      {/* Hero Video Background Repeat (Vendredi Style) */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover"
        >
          <source src="https://vendredi-society.com/wp-content/uploads/2024/01/Hero-Scan.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-secondary/80" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-24">
        {/* CTA Section */}
        <div className="mb-32 text-center">
           <h2 className="text-5xl md:text-[8vw] font-serif italic tracking-tighter mb-12 leading-[0.9]">
             Wanna start <br /> right now?
           </h2>
           <div className="flex flex-col md:flex-row justify-center gap-6">
              <button className="px-12 py-5 bg-primary text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-primary transition-all shadow-xl">
                Mail Us
              </button>
              <button className="px-12 py-5 bg-white text-secondary rounded-full font-bold text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl">
                Book a call
              </button>
           </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-24">
          <div className="max-w-md text-left">
            <h2 className="text-4xl font-serif italic mb-6 tracking-tighter">Vincere</h2>
            <p className="text-white/60 text-lg leading-relaxed">
              Elevando marcas através do design estratégico, tecnologia de ponta e inteligência artificial. Onde o luxo encontra a performance.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-6">Menu</p>
              <ul className="space-y-4">
                <li><a href="#home" className="text-sm font-bold hover:opacity-50 transition-all">Work</a></li>
                <li><a href="#about" className="text-sm font-bold hover:opacity-50 transition-all">Studio</a></li>
                <li><a href="#footer" className="text-sm font-bold hover:opacity-50 transition-all">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-6">Social</p>
              <ul className="space-y-4">
                <li><a target="_blank" href="https://instagram.com" className="text-sm font-bold hover:opacity-50 transition-all">Instagram</a></li>
                <li><a target="_blank" href="https://linkedin.com" className="text-sm font-bold hover:opacity-50 transition-all">LinkedIn</a></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-6">Newsletter</p>
              <div className="flex gap-4">
                <input 
                  type="email" 
                  placeholder="Seu e-mail" 
                  className="bg-transparent border-b border-white/20 py-2 focus:border-white outline-none text-sm w-full"
                />
                <button className="text-sm font-bold hover:opacity-50 transition-all uppercase">Join</button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">© 2024 Vincere. All rights reserved.</p>
          <div className="flex gap-8">
             <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white/40 transition-colors">Privacy Policy</a>
             <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white/40 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
