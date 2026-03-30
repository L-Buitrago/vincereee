import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SplitReveal } from '@/components/ui/SplitReveal';

const reviews = [
  {
    quote: "Vincere Society completely transformed our digital presence. 10/10.",
    name: "Emmanuelle Paolasini",
    title: "Lead Brand Designer @ PrestaShop",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
  },
  {
    quote: "The attention to detail and high-end aesthetic is exactly what we needed.",
    name: "Marcus Aurelius",
    title: "Founder @ Stoic Labs",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
  },
  {
    quote: "Not just a pretty site. The metrics speak for themselves - conversions up 300%.",
    name: "Sarah Jenkins",
    title: "CMO @ Lumina",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop"
  },
  {
    quote: "They understood our vision before we even fully articulated it.",
    name: "David Chen",
    title: "CEO @ Nova Tech",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
  }
];

const ReviewsCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX - 40,
        y: e.clientY - 40,
        duration: 0.1,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (!containerRef.current) return;
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <section className="relative py-32 bg-brand-light border-t border-black/5 overflow-hidden cursor-none">
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 w-20 h-20 rounded-full bg-brand-accent text-brand-dark flex items-center justify-center font-bold tracking-widest text-xs uppercase pointer-events-none z-50 transition-transform duration-300 ${isHovering ? 'scale-100' : 'scale-0'}`}
      >
        <span className="block transform -rotate-12">Drag</span>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-16 mb-24">
        <h2 className="text-[10vw] md:text-[8vw] lg:text-[6vw] font-serif-display leading-none tracking-tight text-brand-dark">
          <SplitReveal text="Don't just take" delay={0.1} />
          <br />
          <span className="v-underline">
            <SplitReveal text="our word for it." delay={0.2} />
          </span>
        </h2>
      </div>

      <div 
        ref={containerRef}
        className="flex gap-8 px-6 md:px-12 lg:px-16 overflow-x-auto no-scrollbar pb-12 select-none hide-scrollbar"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => { setIsHovering(false); setIsDragging(false); }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
      >
        {reviews.map((review, i) => (
          <div 
            key={i} 
            className="flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[40vw] max-w-2xl bg-white border border-black/5 text-brand-dark p-8 md:p-12 lg:p-16 rounded-[2rem] flex flex-col justify-between min-h-[400px] lg:min-h-[500px]"
          >
            <div className="mb-8">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-brand-accent mb-8">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <h3 className="text-3xl md:text-4xl lg:text-[2.5rem] font-medium leading-[1.1] tracking-tight">
                "{review.quote}"
              </h3>
            </div>
            
            <div className="flex items-center gap-6 border-t border-black/10 pt-8 mt-12">
              <img src={review.image} alt={review.name} className="w-16 h-16 rounded-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500" draggable={false} />
              <div>
                <p className="font-semibold text-lg">{review.name}</p>
                <p className="text-brand-dark/60 text-sm tracking-wide mt-1">{review.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default ReviewsCarousel;
