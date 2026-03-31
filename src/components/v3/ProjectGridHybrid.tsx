import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const projects = [
  {
    id: "01",
    title: "The Merchant Lab",
    category: "E-commerce Solutions",
    thumb: "https://vendredi-society.com/wp-content/uploads/2026/03/ps-day-thumbnail.webp",
    video: "https://download-video-ak.vimeocdn.com/v3-1/playback/908723147/f65b5b00-3b53e910",
    color: "#dfe6e5",
    mockup: "/images/merchant_mockup.png"
  },
  {
    id: "02",
    title: "Otio Home",
    category: "Internet of Things",
    thumb: "https://vendredi-society.com/wp-content/uploads/2023/12/otio_small.webp",
    video: "https://download-video-ak.vimeocdn.com/v3-1/playback/908723147/f65b5b00-3b53e910",
    color: "#f2f2f2",
    mockup: "/images/otio_mockup.png"
  },
  {
    id: "03",
    title: "PS Essentials",
    category: "Brand Content",
    thumb: "https://vendredi-society.com/wp-content/uploads/2023/12/PS_Essentials_Vertical_Small.webp",
    video: "https://download-video-ak.vimeocdn.com/v3-1/playback/908723147/f65b5b00-3b53e910",
    color: "#f8f8f8",
    mockup: "/images/ps_mockup.png"
  },
  {
    id: "04",
    title: "IKKS",
    category: "Fashion Tech",
    thumb: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200",
    video: "https://download-video-ak.vimeocdn.com/v3-1/playback/908723147/f65b5b00-3b53e910",
    color: "#dfe6e5",
  },
  {
    id: "05",
    title: "Radio France",
    category: "Digital Media",
    thumb: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=1200",
    video: "https://download-video-ak.vimeocdn.com/v3-1/playback/908723147/f65b5b00-3b53e910",
    color: "#f2f2f2",
  }
];

const ProjectGridHybrid = () => {
  return (
    <section className="py-24 bg-white px-4 md:px-12 lg:px-24" id="portfolio">
      <div className="container mx-auto">
        <div className="mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-2 block">Portfólio Selecionado</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">Trabalhos que <span className="text-primary italic">fazem história.</span></h2>
        </div>

        {/* Row 1: Merchant + Otio Home (2 column grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ProjectGridCard project={projects[0]} />
          <ProjectGridCard project={projects[1]} />
        </div>

        {/* Row 2: PS Essentials (Full Width Large Card) */}
        <div className="w-full mb-6">
          <ProjectGridCard project={projects[2]} isExtraLarge />
        </div>

        {/* Row 3: IKKS + Radio France (Vertical stack with parallax) */}
        <div className="flex flex-col gap-12 md:gap-24">
          <ProjectGridCard project={projects[3]} isScrollable index={0} />
          <ProjectGridCard project={projects[4]} isScrollable index={1} />
        </div>
      </div>
    </section>
  );
};

const ProjectGridCard = ({ project, isExtraLarge = false, isScrollable = false, index = 0 }: { project: any, isExtraLarge?: boolean, isScrollable?: boolean, index?: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Dramatic Parallax effect for the entire card
  const yTranslate = useTransform(
    scrollYProgress, 
    [0, 1], 
    isScrollable ? (index === 0 ? [150, -150] : [250, -250]) : [0, 0]
  );

  // Parallax for the image inside (the "window" effect)
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.play();
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isHovered]);

  return (
    <motion.div
      ref={cardRef}
      style={{ y: yTranslate }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-[2rem] md:rounded-[3rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-shadow duration-700 bg-gray-100 ${
        isExtraLarge ? "h-[500px] md:h-[700px] w-full" : "h-[450px] md:h-[600px]"
      }`}
    >
      {/* Background Media */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <motion.img 
          src={project.thumb} 
          alt={project.title}
          style={{ y: imageY, scale: 1.2 }}
          animate={{ scale: isHovered ? 1.3 : 1.2, opacity: isHovered ? 0.4 : 1 }}
          transition={{ duration: 0.8 }}
          className="w-full h-full object-cover"
        />
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
      </div>

      {/* Floating Mockups on Hover */}
      <div className="absolute inset-0 pointer-events-none z-10 hidden md:block">
        <AnimatePresence>
          {isHovered && project.mockup && (
            <>
              {/* Primary Mockup (Center-Right) */}
              <motion.div
                initial={{ opacity: 0, x: 100, y: 50, scale: 0.8, rotate: 10 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  y: 0, 
                  scale: 1, 
                  rotate: -5,
                  transition: { type: "spring", damping: 20, stiffness: 100, delay: 0.1 }
                }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                className="absolute top-1/4 right-[10%] w-3/4 aspect-video rounded-xl shadow-2xl overflow-hidden border border-white/20 bg-white"
              >
                <img src={project.mockup} alt="Mockup" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
              </motion.div>

              {/* Secondary Mockup (Bottom-Left) */}
              <motion.div
                initial={{ opacity: 0, x: -100, y: 100, scale: 0.5, rotate: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  y: 0, 
                  scale: 0.7, 
                  rotate: 5,
                  transition: { type: "spring", damping: 15, stiffness: 80, delay: 0.3 }
                }}
                exit={{ opacity: 0, y: 100, scale: 0.5 }}
                className="absolute bottom-1/4 left-[5%] w-1/2 aspect-video rounded-xl shadow-2xl overflow-hidden border border-white/20 bg-white"
              >
                <img src={project.mockup} alt="Mockup 2" className="w-full h-full object-cover grayscale" />
                <div className="absolute inset-0 bg-primary/10" />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Overlay Info */}
      <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block text-white/60">
            {project.category}
          </span>
          <h3 className="text-2xl md:text-5xl font-black tracking-tighter text-white">
            {project.title}
          </h3>
        </div>
        
        <div className="mt-8 flex justify-between items-center">
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white bg-white/10 backdrop-blur-md">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>
      
      {/* Name Label */}
      <div className="absolute top-8 left-8 px-6 py-3 bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-sm opacity-100 group-hover:opacity-0 transition-opacity duration-300 z-20">
          <p className="text-[10px] font-black uppercase tracking-widest text-foreground">{project.title}</p>
      </div>
    </motion.div>
  );
};

export default ProjectGridHybrid;
