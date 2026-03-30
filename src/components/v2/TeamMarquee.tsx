import { motion } from "framer-motion";

const images = [
  "https://vendredi-society.com/wp-content/uploads/2024/02/team.webp",
  "https://vendredi-society.com/wp-content/uploads/2024/02/team_02.webp",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2070"
];

const TeamMarquee = () => {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 mb-16">
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-foreground/40 mb-4">[ Full Capacity ]</p>
        <h2 className="text-5xl md:text-8xl font-serif italic tracking-tighter">An epic team for <br /> <span className="font-sans not-italic font-extrabold">every vision.</span></h2>
      </div>

      <div className="flex whitespace-nowrap">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-8"
        >
          {[...images, ...images].map((src, i) => (
            <div key={i} className="w-[400px] h-[500px] rounded-[40px] overflow-hidden flex-shrink-0">
              <img src={src} alt="Team" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TeamMarquee;
