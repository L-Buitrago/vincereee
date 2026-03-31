import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reviews = [
  {
    title: "Design & Prototyping",
    content: "Transformamos ideias em interfaces tangíveis e luxuosas em tempo recorde.",
    kpi: "3x mais rápido",
    author: "Emmanuelle",
    role: "Founding Partner"
  },
  {
    title: "Development",
    content: "Código performático que sustenta experiências de alta fidelidade sem compromisso.",
    kpi: "99.9% Sem Erros",
    author: "Aurélien",
    role: "Tech Lead"
  },
  {
    title: "Hand-Off",
    content: "Entrega impecável com documentação completa para escala imediata.",
    kpi: "Escalabilidade Infinita",
    author: "Caroline",
    role: "Project Manager"
  }
];

const ReviewStack = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray(".review-card");
    
    // Pin the left heading
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: leftRef.current,
      pinSpacing: true,
    });

    // Animate cards stacking
    cards.forEach((card: any, i) => {
      if (i === 0) return;
      
      gsap.from(card, {
        yPercent: 100,
        opacity: 0,
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          end: "top 50%",
          scrub: true,
        }
      });
    });
  }, []);

  return (
    <section ref={containerRef} className="relative py-24 bg-[#0F172A] text-[#f2f2f2] min-h-[300vh]">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-24">
        {/* Left Floating Content */}
        <div ref={leftRef} className="flex-1 py-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#60A5FA] mb-6">[ Success Logic ]</p>
          <h2 className="text-5xl md:text-8xl font-serif italic leading-[0.9] tracking-tighter">
            Made for <br />
            <span className="font-sans not-italic font-extrabold text-[#60A5FA]">big-time returns.</span>
          </h2>
        </div>

        {/* Right Stacking Cards */}
        <div className="flex-1 flex flex-col gap-[30vh] pb-[50vh]">
          {reviews.map((review, index) => (
            <div 
              key={index} 
              className="review-card bg-[#f2f2f2] text-[#0F172A] rounded-[48px] p-12 min-h-[500px] flex flex-col justify-between shadow-2xl sticky top-24"
            >
               <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 mb-8 block">{review.title}</span>
                  <h3 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8">{review.content}</h3>
               </div>
               
               <div className="flex justify-between items-end border-t border-black/5 pt-8">
                  <div>
                    <p className="text-sm font-bold">{review.author}</p>
                    <p className="text-xs opacity-40 uppercase tracking-widest font-bold">{review.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-serif italic text-[#0F172A]">{review.kpi}</p>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewStack;
