import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const IntroText = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    // Improved reveal script that handles nested spans
    const originalHTML = textRef.current.innerHTML;
    textRef.current.innerHTML = '';
    
    // We'll use a slightly different approach: reveal words instead of characters
    // to preserve the complex styling (spans with colors/fonts)
    const container = document.createElement('div');
    container.innerHTML = originalHTML;
    
    const elements = Array.from(container.childNodes);
    elements.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = (node.textContent || '').split(' ');
        words.forEach((word, i) => {
          if (word.trim() === '') return;
          const span = document.createElement('span');
          span.className = 'inline-block intro-word opacity-0 translate-y-4 mr-[0.25em]';
          span.innerText = word;
          textRef.current?.appendChild(span);
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const span = document.createElement('span');
        span.className = `inline-block intro-word opacity-0 translate-y-4 mr-[0.25em] ${el.className}`;
        span.innerText = el.innerText;
        textRef.current?.appendChild(span);
      }
    });

    const words = containerRef.current.querySelectorAll('.intro-word');
    gsap.to(words, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.05,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section 
      id="intro" 
      ref={containerRef} 
      className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-white min-h-[90vh] flex flex-col justify-center"
    >
      <div className="max-w-[1700px] mx-auto w-full">
        {/* Main Heading Fold 2 */}
        <div className="max-w-[1200px] mb-24 md:mb-40">
          <h2 
            ref={textRef} 
            className="text-[9vw] md:text-[6vw] font-display font-bold leading-[1.05] tracking-tight text-[#0e1711]"
          >
            Being visible is just no longer enough. It’s all about <span className="font-serif italic font-normal text-primary">leveraging attention</span>. And then moving forward together. <span className="font-serif italic font-normal">Synced.</span>
          </h2>
        </div>

        {/* Bottom Detail Row (Screenshot 1 Layout) */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8 relative w-full">
          
          {/* Left: Studio Label */}
          <div className="w-full md:w-1/4 text-[10px] md:text-[11px] font-sans uppercase tracking-[0.2em] text-[#0e1711]/40 pt-2">
            [ DIGITAL DESIGN STUDIO ]
          </div>
          
          {/* Middle: Motto Button & Desc Block */}
          <div className="w-full md:w-2/4 flex flex-col items-start gap-10">
              <button className="px-6 py-2 rounded-full bg-[#E9EDE7] text-[#0e1711] text-[10px] uppercase font-bold tracking-widest border border-black/5 hover:bg-[#d5d9d4] transition-colors w-fit">
                Our motto
              </button>
              
              <div className="max-w-[480px] text-xl md:text-2xl font-sans tracking-tight leading-[1.4] text-[#0e1711]">
                 <p className="mb-8">
                   <strong className="font-semibold">We deliver brands with high objectives</strong> the strategy and the creativity it takes to have that impact, by teaming up with some of the best talents out there.
                 </p>
                 <p className="text-[#0e1711]/40 text-lg md:text-xl font-medium">
                   Without ever compromising on keeping your teams happy and sane.
                 </p>
              </div>
          </div>

          {/* Right: Abstract Image Card */}
          <div className="w-full md:w-1/4 flex justify-end">
             <div className="w-full max-w-[320px] aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-[#0e1711] relative group shadow-xl transition-transform hover:scale-[1.02] duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" 
                  alt="Vision" 
                  className="w-full h-full object-cover opacity-90"
                />
                {/* 3D-ish glow effect placeholder */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#D9FF2E] rounded-full blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity" />
             </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default IntroText;
