import { useState } from 'react';
import { SplitReveal } from '@/components/ui/SplitReveal';
import { HoverButton } from '@/components/ui/HoverButton';

const FooterSection = () => {
  const [email, setEmail] = useState('');

  return (
    <footer id="contact" className="bg-background border-t border-border pt-32 pb-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-32">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-16">
          <div className="flex-1 w-full relative">
            <h2 className="text-5xl md:text-7xl lg:text-[7.5rem] font-bold tracking-tighter leading-[0.85] text-foreground mb-12">
              <SplitReveal text="Got a project" />
              <br />
              <SplitReveal text="in mind?" delay={0.1} />
            </h2>
            
            <form 
              className="flex items-end border-b-2 border-foreground/30 pb-4 max-w-xl group focus-within:border-primary transition-colors duration-300"
              onSubmit={(e) => e.preventDefault()}
            >
              <input 
                type="email" 
                placeholder="Drop us your email & we'll reach out" 
                className="bg-transparent w-full text-lg md:text-xl text-foreground placeholder:text-foreground/40 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="text-primary hover:-translate-y-1 transition-transform ml-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </button>
            </form>
          </div>

          <div className="flex-shrink-0 flex flex-col items-start lg:items-end gap-12 text-left lg:text-right">
            <div>
              <p className="text-foreground/50 tracking-widest text-xs uppercase mb-4">Start a conversation</p>
              <HoverButton className="border-border text-foreground hover:border-primary text-xl px-10 py-6">
                hello@vinceresociety.com
              </HoverButton>
            </div>
            
            <div className="flex gap-4">
              {['Linkedin', 'Instagram', 'Dribbble'].map((social) => (
                <button key={social} className="group relative overflow-hidden rounded-full border border-border px-6 py-2 transition-colors duration-300 hover:bg-foreground hover:text-background hover:border-foreground">
                   <div className="relative overflow-hidden h-5 flex items-center justify-center">
                    <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                      {social}
                    </span>
                    <span className="absolute top-full block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                      {social}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-border/20 text-sm text-foreground/50 font-medium">
          <div className="flex gap-8 uppercase tracking-widest text-xs">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
          <p className="uppercase tracking-widest text-xs">
            © {new Date().getFullYear()} Vincere Society. Site by Vincere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
