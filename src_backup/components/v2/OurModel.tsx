import { motion } from "framer-motion";

const slides = [
  {
    id: "01",
    title: "Your own\ntop-dogs\nteam",
    bold: "Custom talents.",
    description: "The perfect gang of high-profile creatives to exceed your business objectives. Full focus. Full grit.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&q=80",
  },
  {
    id: "02",
    title: "Big project?\nTeam scales",
    bold: "Scalable workforce.",
    description: "Your marketing needs getting more intense? Get extra designers, copywriters or developers ready to execute. Already up-to-date on the project, of course.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1000&fit=crop&q=80",
  },
];

const OurModel = () => {
  return (
    <section className="relative bg-background">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className="sticky top-0 min-h-screen bg-background rounded-t-[32px] overflow-hidden border-t border-black/5"
          style={{ zIndex: index + 1 }}
        >
          {/* Top Row: Number left, Title + Text right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 px-4 md:px-16 pt-12 pb-6">
            {/* Number */}
            <div>
              <span className="text-[12vw] md:text-[10vw] font-serif italic tracking-tighter text-secondary/10 leading-none block">
                {slide.id}
              </span>
            </div>

            {/* Title + Description */}
            <div className="flex flex-col gap-6 justify-center pt-4 md:pt-8">
              <h3 className="text-4xl md:text-[4vw] font-serif italic tracking-tighter text-foreground leading-[0.95] whitespace-pre-line">
                {slide.title}
              </h3>

              <p className="text-base text-foreground/50 leading-relaxed max-w-md">
                <span className="font-bold text-foreground">{slide.bold}</span>{" "}
                {slide.description}
              </p>

              <div>
                <a
                  href="#about"
                  className="inline-block px-8 py-4 bg-secondary text-secondary-foreground rounded-full font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-lg"
                >
                  Our model
                </a>
              </div>
            </div>
          </div>

          {/* Bottom: Large Photo (left-aligned, rounded) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 px-4 md:px-16">
            <div className="lg:col-span-7">
              <div className="w-full aspect-[4/3] rounded-[24px] overflow-hidden bg-muted shadow-2xl">
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Bottom padding */}
          <div className="h-24" />
        </div>
      ))}
      
      {/* Extra scroll space for the stacking effect to complete */}
      <div className="h-[50vh]" />
    </section>
  );
};

export default OurModel;
