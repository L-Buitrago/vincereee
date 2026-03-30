import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitReveal } from '@/components/ui/SplitReveal';

const projects = [
  {
    title: 'The Merchant Lab',
    category: 'E-commerce solutions',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80',
    offset: false,
    aspect: 'aspect-[4/5]'
  },
  {
    title: 'Otio Home',
    category: 'Internet of things',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    offset: true,
    aspect: 'aspect-[4/3] md:aspect-[3/4]'
  },
  {
    title: 'Nova Tech',
    category: 'Digital Product',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
    offset: false,
    aspect: 'aspect-square'
  },
  {
    title: 'Aura Skincare',
    category: 'Brand Identity',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&q=80',
    offset: true,
    aspect: 'aspect-[4/5]'
  },
];

const ProjectsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.project-card');

    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { y: 150, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section id="projects" className="bg-brand-light pt-24 pb-40 px-4 md:px-8">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-20 px-4">
          <h2 className="text-[10vw] md:text-[8vw] lg:text-[6vw] font-serif-display leading-none tracking-tight text-brand-dark">
            <SplitReveal text="Selected" />
            <br />
            <span className="v-underline">
              <SplitReveal text="Projects." delay={0.1} />
            </span>
          </h2>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-start">
          {projects.map((project, i) => (
            <div
              key={project.title}
              className={`project-card relative group cursor-pointer overflow-hidden rounded-[2rem] 
                          ${project.aspect} 
                          ${project.offset ? 'md:mt-[20%]' : ''}`}
            >
              {/* Image with zoom effect */}
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
                loading="lazy"
              />
              {/* Overlay gradient for readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-80" />
              
              {/* Text Top-Left Inside Card */}
              <div className="absolute top-0 left-0 p-8 md:p-12 text-white z-10 pointer-events-none">
                <p className="text-sm md:text-base font-medium text-white/70 tracking-wide mb-2">
                  {project.category}
                </p>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-24 flex justify-center">
            <button className="bg-brand-dark/90 text-white backdrop-blur-md px-8 py-5 rounded-full flex items-center gap-4 hover:bg-brand-dark transition-colors text-lg tracking-tight group">
                <div className="w-8 h-8 rounded-full bg-brand-accent text-brand-dark justify-center items-center flex font-bold group-hover:rotate-12 transition-transform">
                   v
                </div>
                <span>See more work</span>
                <span className="ml-4 opacity-50 transition-transform group-hover:translate-x-1">→</span>
            </button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
