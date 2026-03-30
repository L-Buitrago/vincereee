import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";

const testimonials = [
    {
        quote: "O trabalho da Vincere não é apenas visual; é estratégico. Mudaram a forma como nossos clientes nos percebem.",
        author: "Rodrigo Santos",
        role: "CEO @TechFlow",
        avatar: "/placeholder.svg",
        highlight: false,
    },
    {
        quote: "A velocidade de execução aliada à qualidade de luxo é algo que nunca vi em outra agência.",
        author: "Mariana Costa",
        role: "Marketing Director @LuxLife",
        avatar: "/placeholder.svg",
        highlight: false,
    },
    {
        quote: "Transformaram nosso e-commerce em uma experiência de imersão completa. Resultados imediatos.",
        author: "André Luiz",
        role: "Product Owner @UrbanStyle",
        avatar: "/placeholder.svg",
        highlight: true,
    },
    {
        quote: "A inteligência artificial aplicada ao design trouxe uma eficiência sem precedentes para nossa operação.",
        author: "Juliana Lima",
        role: "COO @NextGen",
        avatar: "/placeholder.svg",
        highlight: false,
    },
    {
        quote: "A criatividade e expertise técnica trouxeram nossa visão à vida de uma forma excepcional.",
        author: "Carlos Mendes",
        role: "CTO @DataSynth",
        avatar: "/placeholder.svg",
        highlight: false,
    },
];

const CARD_WIDTH = 480;
const GAP = 32;
const SPEED = 0.5; // pixels per frame

const SuccessLogic = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const totalWidth = testimonials.length * (CARD_WIDTH + GAP);

    // Auto-scroll animation
    useAnimationFrame(() => {
        if (isDragging || isHovered) return;
        
        const current = x.get();
        const next = current - SPEED;
        
        // Reset when scrolled past half (seamless loop)
        if (Math.abs(next) >= totalWidth) {
            x.set(0);
        } else {
            x.set(next);
        }
    });

    return (
        <section className="py-24 bg-secondary overflow-hidden">
            {/* Header */}
            <div className="container mx-auto px-4 md:px-24 mb-16">
                <div className="flex items-center gap-4 text-primary mb-4">
                    <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em]">[ Success Logic ]</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-serif italic text-white tracking-tighter">
                    O que dizem os <br /> nossos parceiros.
                </h2>
            </div>

            {/* Draggable Testimonials Row */}
            <div 
                ref={containerRef}
                className="relative cursor-grab active:cursor-grabbing"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <motion.div
                    className="flex gap-8 pl-4 md:pl-24"
                    style={{ x }}
                    drag="x"
                    dragConstraints={{ left: -totalWidth, right: 0 }}
                    dragElastic={0.1}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => setIsDragging(false)}
                >
                    {/* Duplicate testimonials for seamless loop */}
                    {[...testimonials, ...testimonials].map((t, i) => (
                        <div 
                            key={i} 
                            className={`min-w-[350px] md:min-w-[480px] p-10 rounded-[32px] flex flex-col justify-between shrink-0 ${
                                t.highlight
                                    ? "bg-primary text-white"
                                    : "bg-white text-secondary shadow-lg border border-secondary/5"
                            }`}
                            style={{ minHeight: 280 }}
                        >
                            <p className={`text-lg md:text-xl font-medium leading-relaxed mb-8 ${
                                t.highlight ? "text-white/80" : "text-secondary/70"
                            }`}>
                                "{t.quote}"
                            </p>
                            <div className="flex items-center gap-4">
                                {/* Avatar placeholder — user will replace */}
                                <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${
                                    t.highlight ? "border-white/20" : "border-secondary/10"
                                }`}>
                                    <img 
                                        src={t.avatar} 
                                        alt={t.author}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className={`font-bold text-sm ${t.highlight ? "text-white" : "text-secondary"}`}>
                                        {t.author}
                                    </p>
                                    <p className={`text-xs uppercase tracking-widest ${
                                        t.highlight ? "text-white/50" : "text-secondary/40"
                                    }`}>
                                        {t.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Drag Indicator */}
                <div className="flex justify-center mt-12">
                    <div className="px-6 py-3 bg-primary text-white rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl">
                        <span>←</span>
                        <span>Drag</span>
                        <span>→</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SuccessLogic;
