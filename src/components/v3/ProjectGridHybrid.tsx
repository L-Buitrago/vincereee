import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const projects = [
  {
    id: "01",
    title: "Nossos Projetos",
    category: "Portfólio Selecionado",
    thumb: "/images/portfolio-1.jpg",
    slides: [
      "/images/portfolio-1.jpg",
      "/images/portfolio-2.jpg",
      "/images/portfolio-3.jpg",
      "/images/portfolio-4.jpg",
      "/images/portfolio-5.jpg",
      "/images/portfolio-6.jpg",
      "/images/portfolio-7.jpg"
    ],
    color: "#dfe6e5",
  }
];

const ProjectGridHybrid = () => {
  return (
    <section className="py-24 bg-white overflow-hidden" id="portfolio">
      <div className="container mx-auto px-4 md:px-12 lg:px-24 mb-16">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-2 block">Portfólio Selecionado</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">Trabalhos que <span className="text-primary italic">fazem história.</span></h2>
        </div>
      </div>

      {/* Single Full-Width Card - Stretched horizontally */}
      <div className="px-4 md:px-6 lg:px-8 max-w-[1800px] mx-auto">
        <ProjectGridCard project={projects[0]} isExtraLarge={true} />
      </div>
    </section>
  );
};

const ProjectGridCard = ({ project, isExtraLarge = false, isScrollable = false, index = 0 }: { project: any, isExtraLarge?: boolean, isScrollable?: boolean, index?: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Carousel Logic
  useEffect(() => {
    if (!project.slides) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % project.slides.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [project.slides]);

  // Dramatic Parallax effect for the entire card
  const yTranslate = useTransform(
    scrollYProgress, 
    [0, 1], 
    isScrollable ? (index === 0 ? [150, -150] : [250, -250]) : [0, 0]
  );

  // Parallax for the image inside (the "window" effect)
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  useEffect(() => {
    if (isHovered && videoRef.current && !project.slides) {
      videoRef.current.play();
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isHovered, project.slides]);

  return (
    <motion.div
      ref={cardRef}
      style={{ y: yTranslate }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-[2rem] md:rounded-[3rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-shadow duration-700 ${
        isExtraLarge ? "h-[600px] md:h-[850px] w-full" : "h-[450px] md:h-[600px]"
      }`}
    >
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          {project.slides ? (
            <motion.img
              key={currentSlide}
              src={project.slides[currentSlide]}
              alt={`${project.title} slide ${currentSlide + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.8, 
                ease: "easeInOut"
              }}
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          ) : (
            <motion.img 
              src={project.thumb} 
              alt={project.title}
              style={{ y: imageY, scale: 1.2 }}
              animate={{ scale: isHovered ? 1.3 : 1.2, opacity: isHovered ? (project.video ? 0.4 : 1) : 1 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full object-cover object-top"
            />
          )}
        </AnimatePresence>

        {!project.slides && project.video && (
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
        )}
      </div>

      {/* Info Overlay (Visible on Hover) */}
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
    </motion.div>
  );
};

export default ProjectGridHybrid;
