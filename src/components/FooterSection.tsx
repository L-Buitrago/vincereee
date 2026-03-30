import ScrollReveal from './ScrollReveal';

const FooterSection = () => {
  return (
    <footer id="footer" className="border-t border-border py-20 md:py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">Ready to start?</p>
            <h2 className="font-serif-display text-4xl md:text-6xl lg:text-7xl text-foreground mb-10">
              Let's build<br /><span className="italic">together</span>
            </h2>
            <a
              href="mailto:hello@studio.com"
              className="inline-block px-10 py-4 rounded-full bg-primary text-primary-foreground font-medium tracking-wide hover:scale-105 transition-transform duration-300 text-lg"
            >
              Get in Touch
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-border">
            <span className="font-serif-display text-lg text-foreground">Studio</span>
            <div className="flex gap-8">
              {['Twitter', 'Instagram', 'Dribbble', 'LinkedIn'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  {social}
                </a>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">© 2024 Studio. All rights reserved.</span>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
};

export default FooterSection;
