import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SplitRevealProps {
  text: string;
  className?: string;
  delay?: number;
  triggerOnScroll?: boolean;
}

export const SplitReveal = ({ text, className, delay = 0, triggerOnScroll = true }: SplitRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chars = containerRef.current.querySelectorAll('.char');
    
    // Set initial state
    gsap.set(chars, { y: '100%' });

    const animConfig = {
      y: '0%',
      ease: 'power4.out',
      duration: 1.2,
      stagger: 0.02,
      delay: delay
    };

    if (triggerOnScroll) {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 85%',
        animation: gsap.to(chars, animConfig)
      });
    } else {
      gsap.to(chars, animConfig);
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === containerRef.current) t.kill();
      });
    };
  }, [delay, text, triggerOnScroll]);

  // Handle words with spaces
  const words = text.split(' ');

  return (
    <div ref={containerRef} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block whitespace-nowrap mr-[0.25em]">
          {word.split('').map((char, j) => (
            <span key={j} className="inline-block overflow-hidden pb-1" style={{ verticalAlign: 'bottom' }}>
              <span className="char inline-block">{char}</span>
            </span>
          ))}
        </span>
      ))}
    </div>
  );
};
