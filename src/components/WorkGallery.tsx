import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const projects = [
  {
    category: "Gestão & CRM",
    title: "Plataforma Vincere",
    image: 'https://images.unsplash.com/photo-1635405074683-96d6921a2a68?w=800&q=80',
    video: 'https://player.vimeo.com/external/494252666.sd.mp4?s=7223078a1f8c1f0674bd3685f479d2b27cc3b5c6&profile_id=164&oauth2_token_id=57447761',
    tags: ['UX Design', 'Art Direction', 'Motion Design', 'Creative development'],
    dark: true,
  },
  {
    category: "Design Imersivo",
    title: "Sites & Landing Pages 3D",
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80',
    video: 'https://player.vimeo.com/external/554160533.sd.mp4?s=67ef379469e3edc4280b18fa65914c62243e88fa&profile_id=165&oauth2_token_id=57447761',
    tags: ['Motion Design', 'Branding', '3D & concepts', 'Product Design'],
    dark: false,
  }
];

const WorkGallery = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="work" className="py-24 px-6 md:px-12 lg:px-16 bg-[#F5F5F5]">
      <div className="max-w-[1700px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              viewport={{ once: true }}
              className="group relative aspect-[4/5] md:aspect-[1.1/1] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="absolute inset-0 bg-[#111] -z-10" />
              <img 
                src={project.image} 
                alt={project.title}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105",
                  hoveredIndex === idx ? "opacity-0" : "opacity-100"
                )}
              />
              
              <AnimatePresence>
                {hoveredIndex === idx && project.video && (
                  <motion.video
                    key={project.video}
                    src={project.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </AnimatePresence>
              
              {/* Overlay for better text readability if needed */}
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500" />

              {/* Top info */}
              <div className="absolute top-8 left-8 md:top-10 md:left-10 z-10">
                <span className="text-[10px] md:text-xs font-sans uppercase tracking-[0.2em] font-medium opacity-60 mb-1 block">
                  {project.category}
                </span>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-sans font-medium tracking-tight">
                  {project.title}
                </h3>
              </div>

              {/* Bottom Tags */}
              <div className="absolute bottom-8 left-8 right-8 flex flex-wrap gap-2 z-10 pointer-events-none">
                {project.tags.map((tag, tIdx) => (
                  <span 
                    key={tIdx}
                    className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] uppercase font-bold tracking-widest text-white/90"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* See more work button */}
        <div className="mt-16 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 px-1 py-1 pr-6 rounded-full bg-[#0e1711] text-white group transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-[#f0ff3d] flex items-center justify-center text-black">
               <ArrowRight size={20} className="transition-transform group-hover:translate-x-0.5" />
            </div>
            <span className="text-xs uppercase font-bold tracking-widest pl-2">
              See more work
            </span>
            <span className="text-[10px] text-white/40 font-medium ml-2">
              Loved working on those. Take a look.
            </span>
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default WorkGallery;
