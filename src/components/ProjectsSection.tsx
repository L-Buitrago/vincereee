import ScrollReveal from './ScrollReveal';

const projects = [
  {
    title: 'Horizon Architects',
    category: 'Brand Identity',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    title: 'Minimal Living',
    category: 'Editorial Design',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    span: '',
  },
  {
    title: 'Nørd Studio',
    category: 'Web Design',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80',
    span: '',
  },
  {
    title: 'Form & Function',
    category: 'Art Direction',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80',
    span: 'md:col-span-2',
  },
  {
    title: 'Void Gallery',
    category: 'Brand Strategy',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    span: '',
  },
  {
    title: 'Terra Collective',
    category: 'Visual Identity',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80',
    span: '',
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="section-light py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-16">
            <h2 className="font-serif-display text-4xl md:text-6xl lg:text-7xl text-[hsl(var(--light-fg))]">
              Selected<br /><span className="italic">Works</span>
            </h2>
            <span className="hidden md:block text-sm text-[hsl(var(--light-fg))]/50 tracking-widest uppercase">
              2024 — Present
            </span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {projects.map((project, i) => (
            <ScrollReveal key={project.title} delay={i * 100} className={project.span}>
              <div className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer">
                <img
                  src={project.image}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-xs tracking-widest uppercase text-white/60 mb-1">{project.category}</p>
                  <h3 className="font-serif-display text-2xl text-white">{project.title}</h3>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
