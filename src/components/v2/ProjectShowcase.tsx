import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    id: "01",
    title: "The Merchant Lab",
    category: "E-commerce Solutions",
    thumb: "https://vendredi-society.com/wp-content/uploads/2026/03/ps-day-thumbnail.webp",
    video: "https://download-video-ak.vimeocdn.com/v3-1/playback/908723147/f65b5b00-3b53e910",
    color: "#dfe6e5",
    size: "normal",
    tags: ["UX Design", "Art Direction", "Motion Design", "Creative Development"],
  },
  {
    id: "02",
    title: "Otio Home",
    category: "Internet of Things",
    thumb: "https://vendredi-society.com/wp-content/uploads/2023/12/otio_small.webp",
    video: "https://download-video-ak.vimeocdn.com/v3-1/playback/908723147/f65b5b00-3b53e910",
    color: "#f2f2f2",
    size: "normal",
    tags: ["Motion Design", "Branding", "3D & concepts", "Product Design"],
  },
  {
    id: "03",
    title: "PS Essentials",
    category: "Brand Content",
    thumb: "https://vendredi-society.com/wp-content/uploads/2026/03/ps-day-thumbnail.webp",
    video: "https://download-video-ak.vimeocdn.com/v3-1/playback/908723147/f65b5b00-3b53e910",
    color: "#f8f8f8",
    size: "large",
    tags: ["Brand Content", "Motion Design", "Campaign", "Art Direction"],
  }
];

const ProjectShowcase = () => {
  return (
    <section id="cases" className="py-32 bg-background px-4 md:px-12">
      <div className="container mx-auto">
        {/* Top 2 Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {projects.slice(0, 2).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        
        {/* Bottom Large Item */}
        <div className="w-full">
           <ProjectCard project={projects[2]} />
        </div>

        {/* See More Button (Vendredi Style) */}
        <div className="mt-16 flex justify-center">
           <button className="group flex items-center gap-4 bg-secondary/5 hover:bg-secondary px-8 py-4 rounded-full border border-secondary/10 transition-all duration-500 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center -ml-4 group-hover:scale-110 transition-transform">
                 <div className="w-4 h-4 bg-white rounded-sm" />
              </div>
              <div className="text-left">
                 <p className="text-[10px] font-bold uppercase tracking-widest group-hover:text-background transition-colors">See more work</p>
                 <p className="text-[10px] opacity-40 group-hover:text-background/40 transition-colors">Loved working on these. Take a look.</p>
              </div>
              <ArrowUpRight className="w-4 h-4 group-hover:text-background transition-colors ml-4" />
           </button>
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project }: { project: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.play();
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isHovered]);

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.77, 0, 0.18, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        // Find contact section and scroll
        const contact = document.getElementById('footer');
        if (contact) {
          contact.scrollIntoView({ behavior: 'smooth' });
        }
      }}
      className="group relative rounded-[48px] overflow-hidden cursor-pointer shadow-xl"
      style={{ backgroundColor: project.color }}
    >
      <div className={`${project.size === "large" ? "aspect-[16/9]" : "aspect-[1/1]"} relative overflow-hidden`}>
        {/* Static Image */}
        <motion.img 
          src={project.thumb} 
          alt={project.title}
          animate={{ scale: isHovered ? 1.05 : 1, opacity: isHovered ? 0.3 : 1 }}
          transition={{ duration: 0.8 }}
          className="w-full h-full object-cover"
        />
        
        {/* Hover Video */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${isHovered ? "opacity-100" : "opacity-0"}`}>
           <video 
              ref={videoRef}
              muted 
              loop 
              playsInline 
              className="w-full h-full object-cover"
           >
              <source src={project.video} type="video/mp4" />
           </video>
        </div>

        {/* Overlay Info */}
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between">
          {/* Top: Title */}
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ${project.color === "#0F172A" ? "text-white/40" : "text-black/40"}`}>
              {project.category}
            </span>
            <h3 className={`text-3xl md:text-5xl font-extrabold tracking-tighter ${project.color === "#0F172A" ? "text-white" : "text-black"}`}>
              {project.title}
            </h3>
          </div>
          
          {/* Bottom: Tags + Arrow */}
          <div className="flex justify-between items-end">
            {/* Pill Tags */}
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag: string) => (
                <span 
                  key={tag}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border transition-all duration-300 ${
                    project.color === "#0F172A" 
                      ? "bg-white/10 border-white/20 text-white/70 group-hover:bg-white/20" 
                      : "bg-black/5 border-black/10 text-black/60 group-hover:bg-black/10"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Arrow Button */}
            <div className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all flex-shrink-0 ml-4 ${
              project.color === "#0F172A" 
                ? "border-white/20 text-white" 
                : "border-black/10 text-black"
            } group-hover:bg-primary group-hover:text-white group-hover:border-transparent opacity-0 group-hover:opacity-100`}>
               <ArrowUpRight className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectShowcase;
