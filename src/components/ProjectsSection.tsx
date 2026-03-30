import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitReveal } from '@/components/ui/SplitReveal';

const projects = [
  {
    title: 'The Modern Artisan',
    category: 'BRAND IDENTITY / WEB DESIGN',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    offset: false,
  },
  {
    title: 'Aura Skincare',
    category: 'E-COMMERCE / ART DIRECTION',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
    offset: true,
  },
  {
    title: 'Nova Tech',
    category: 'DIGITAL PRODUCT / UX',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    offset: false,
  },
  {
    title: 'Lumina Spaces',
    category: 'BRANDING / DEVELOPMENT',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    offset: true,
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
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
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
    <section id="projects" className="section-light py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none text-light-fg">
            <SplitReveal text="Selected" />
            <br />
            <SplitReveal text="Projects." delay={0.1} />
          </h2>
          <div className="max-w-xs text-lg text-light-fg/70">
            <SplitReveal text="Here are some of the brands we've helped scale through design." delay={0.2} />
          </div>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-12 md:gap-y-24">
          {projects.map((project, i) => (
            <div
              key={project.title}
              className={`project-card group cursor-pointer ${project.offset ? 'md:mt-32' : ''}`}
            >
              <div className="overflow-hidden rounded-xl aspect-[4/5] md:aspect-square lg:aspect-[4/3] mb-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-bold tracking-widest text-light-fg/50">{project.category}</p>
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-light-fg transition-colors group-hover:text-primary">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
