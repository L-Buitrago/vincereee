import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const IntroText = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    // Split text into characters
    const text = textRef.current.innerText;
    textRef.current.innerHTML = '';
    
    // Create word wrapper to handle breaking properly
    const words = text.split(' ');
    
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'inline-block whitespace-nowrap';
      
      const chars = word.split('');
      chars.forEach((char) => {
        const charSpan = document.createElement('span');
        charSpan.className = 'inline-block intro-char opacity-0 translate-y-12 translate-x-4 rotate-[15deg]';
        charSpan.innerText = char;
        wordSpan.appendChild(charSpan);
      });

      textRef.current?.appendChild(wordSpan);
      
      // Add space after word
      if (wordIndex < words.length - 1) {
        const spaceSpan = document.createElement('span');
        spaceSpan.className = 'inline-block intro-char opacity-0';
        spaceSpan.innerHTML = '&nbsp;';
        textRef.current?.appendChild(spaceSpan);
      }
    });

    const chars = containerRef.current.querySelectorAll('.intro-char');

    gsap.to(chars, {
      opacity: 1,
      y: 0,
      x: 0,
      rotate: 0,
      duration: 1.2,
      stagger: 0.02,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
        end: 'bottom 40%',
        scrub: 1, // Smooth scrolling effect
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
      className="py-40 px-6 md:px-12 lg:px-24 bg-white flex flex-col items-center justify-center min-h-[70vh]"
    >
      <div className="max-w-[1400px] w-full flex flex-col justify-between h-full">
        <h2 
          ref={textRef} 
          className="text-4xl sm:text-5xl md:text-7xl lg:text-[6rem] font-serif-display leading-[1.1] tracking-tight text-[#2a2c26] text-left"
        >
          Being able to bring together the strategy and the creativity it takes to have that impact, by teaming up with some of the best talents out there.
        </h2>

        {/* Bottom text block seen in the screenshot */}
        <div className="mt-32 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#2a2c26]/60">
            [ DIGITAL DESIGN STUDIO ]
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <button className="px-6 py-2 rounded-full border border-[#2a2c26]/20 text-[#2a2c26] hover:bg-[#2a2c26] hover:text-white transition-colors text-sm font-medium tracking-wide">
              Our motto
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroText;
