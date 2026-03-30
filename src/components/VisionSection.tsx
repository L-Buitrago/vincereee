import ScrollReveal from './ScrollReveal';

const VisionSection = () => {
  return (
    <section id="vision" className="py-32 md:py-48 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <ScrollReveal>
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-8">Our Vision</p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <blockquote className="font-serif-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.15] font-normal italic text-foreground">
            "We believe design is not decoration — it's the bridge between ambition and perception."
          </blockquote>
        </ScrollReveal>

        <ScrollReveal delay={250}>
          <div className="mt-16 max-w-2xl mx-auto">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              We partner with forward-thinking brands to create visual systems that feel inevitable.
              From strategy to execution, every detail serves the bigger picture — no noise, only signal.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            {[
              { number: '01', title: 'Strategy', desc: 'Research-driven brand positioning that cuts through markets.' },
              { number: '02', title: 'Design', desc: 'Visual systems built for scale, recognition, and longevity.' },
              { number: '03', title: 'Motion', desc: 'Dynamic experiences that bring digital brands to life.' },
            ].map((item) => (
              <div key={item.number} className="border-t border-border pt-6">
                <span className="text-primary text-sm font-mono">{item.number}</span>
                <h3 className="font-serif-display text-2xl mt-3 mb-3 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default VisionSection;
