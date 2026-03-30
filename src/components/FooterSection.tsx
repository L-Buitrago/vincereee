import { useState } from 'react';
import { SplitReveal } from '@/components/ui/SplitReveal';

const FooterSection = () => {
  const [email, setEmail] = useState('');

  return (
    <footer id="contact" className="bg-brand-dark pt-32 pb-12 px-6 md:px-12 lg:px-16 text-brand-light">
      <div className="max-w-[1800px] mx-auto flex flex-col gap-32">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16">
          
          {/* Huge Serif Header */}
          <div className="flex-1 w-full relative">
            <h2 className="text-[12vw] sm:text-[10vw] lg:text-[7vw] font-serif-display leading-[1.05] tracking-tight mb-12">
              <span className="block overflow-hidden pb-2">
                <SplitReveal text="Want to reach" />
              </span>
              <span className="block overflow-hidden pb-4">
                <span className="v-underline">
                  <SplitReveal text="big time?" delay={0.1} />
                </span>
              </span>
            </h2>
            
            {/* Direct Email link instead of form to match Vendredi */}
            <a href="mailto:hello@vinceresociety.com" className="group inline-flex items-center gap-4 mt-8 md:mt-12">
               <span className="text-3xl md:text-5xl lg:text-6xl tracking-tight text-brand-accent transition-colors">
                  hello@vinceresociety.com
               </span>
               <span className="bg-white text-black p-4 rounded-full group-hover:bg-brand-accent transition-colors duration-300">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M5 12h14"></path>
                   <path d="M12 5l7 7-7 7"></path>
                 </svg>
               </span>
            </a>
          </div>

          {/* Socials & Info right side */}
          <div className="flex-shrink-0 flex flex-col items-start lg:items-end gap-12 text-left lg:text-right pt-4">
            <div>
              <p className="text-brand-light/50 tracking-widest text-sm uppercase mb-6 font-medium">Headquarters</p>
              <address className="not-italic text-lg md:text-xl font-medium tracking-wide">
                123 Vincere Avenue<br />
                Business District<br />
                São Paulo - SP, Brasil
              </address>
            </div>
            
            <div className="flex flex-col items-start lg:items-end gap-4 relative">
              <p className="text-brand-light/50 tracking-widest text-sm uppercase mb-2 font-medium">Follow us</p>
              {['Linkedin', 'Instagram', 'Dribbble'].map((social) => (
                <a key={social} href="#" className="text-xl md:text-2xl font-medium hover:text-brand-accent transition-colors duration-300 flex items-center gap-2">
                  {social} <span className="text-sm opacity-50">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/10 text-sm font-medium">
          <div className="flex gap-8 uppercase tracking-widest text-xs opacity-70">
            <a href="#" className="hover:text-brand-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-accent transition-colors">Terms of Service</a>
          </div>
          <p className="uppercase tracking-widest text-xs opacity-70">
            © {new Date().getFullYear()} Vincere Society. Crafted for growth.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
