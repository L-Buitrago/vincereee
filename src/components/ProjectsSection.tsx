import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { name: 'Merchant Lab', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200' },
  { name: 'Otio Home', img: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1200' },
  { name: 'IKKS', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200' },
  { name: 'Radio France', img: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=1200' },
  { name: 'HackMarket', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200' },
];

const ProjectsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;

    const sections = gsap.utils.toArray('.project-card');
    
    // Horizontal scroll animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        end: () => "+=" + trackRef.current?.offsetWidth,
      }
    });

    tl.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
    });

    // Parallax effect on images within the cards
    sections.forEach((section: any) => {
      const img = section.querySelector('img');
      gsap.fromTo(img, 
        { scale: 1.2, xPercent: -10 },
        {
          scale: 1,
          xPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            containerAnimation: tl,
            start: "left right",
            end: "right left",
            scrub: true,
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section id="work" ref={containerRef} className="relative w-full h-screen bg-background overflow-hidden flex flex-col justify-center">
      <div className="absolute top-12 md:top-24 left-6 md:left-12 z-10 w-full pr-12">
        <div className="flex justify-between items-end w-full">
          <h2 className="text-4xl md:text-6xl font-serif-display font-medium text-foreground tracking-[-0.04em]">
            Selected Work
          </h2>
          <span className="text-sm font-medium tracking-wide text-foreground/50 mr-6 md:mr-12">
            01 / {projects.length < 10 ? `0${projects.length}` : projects.length}
          </span>
        </div>
      </div>

      {/* The scrolling track */}
      <div ref={trackRef} className="flex h-[60vh] md:h-[70vh] items-center gap-8 px-6 md:px-24 relative mt-16 md:mt-24 w-[fit-content]">
        {projects.map((project, idx) => (
          <div key={idx} className="project-card relative w-[85vw] md:w-[60vw] lg:w-[45vw] h-full shrink-0 flex flex-col rounded-[2rem] overflow-hidden group">
            <div className="w-full h-full relative overflow-hidden bg-muted">
              <img 
                src={project.img} 
                alt={project.name}
                className="w-full h-full object-cover transform scale-110"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
            </div>
            
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 mix-blend-difference text-white">
              <h3 className="text-3xl md:text-5xl font-serif-display font-medium tracking-tight">
                {project.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
