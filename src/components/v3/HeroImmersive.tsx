import { useEffect, useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BarChart3, Globe, MessageSquareWarning, Sparkles } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";

// --- 3D Background Component ---
const AbstractNeuralShape = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={[0, 0, -2]}>
        {/* An abstract, distorting icosahedron sphere representing "digital core/neural" */}
        <icosahedronGeometry args={[2.5, 30]} />
        <MeshDistortMaterial 
          color="#1e3a8a" // Deep blue
          emissive="#3b82f6" // Primary brand blue glow
          emissiveIntensity={0.8}
          wireframe={true}
          transparent
          opacity={0.15}
          distort={0.4}
          speed={1.5}
          roughness={0}
        />
      </mesh>
    </Float>
  );
};

const NeuralBackground3D = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#3b82f6" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#60a5fa" />
        
        {/* Subtle background stars/particles */}
        <Stars radius={10} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        {/* Main interactive element */}
        <AbstractNeuralShape />
      </Canvas>
    </div>
  );
};

// --- Main Hero Component ---
const HeroImmersive = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Typography staggered animation variants
  const wordAnimation = {
    hidden: { filter: "blur(12px)", opacity: 0, y: 20 },
    visible: (i: number) => ({
      filter: "blur(0px)",
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.12,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const titleWords = ["Acelere", "a", "sua", "máquina", "de", "vendas."];

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#050505] flex items-center pt-32 pb-16 overflow-hidden selection:bg-primary/30"
    >
      {/* 3D Canvas Background */}
      <NeuralBackground3D />

      {/* Radial Premium Glow Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 60%)"
        }}
      />

      <motion.div 
        style={{ y: contentY, opacity: contentOpacity }}
        className="container relative z-10 px-4 md:px-6 mx-auto flex flex-col items-center text-center"
      >
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-primary mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.1)]"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/80">O Futuro da sua Receita</span>
          </motion.div>

          {/* Majestic Typography */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 max-w-5xl">
            {titleWords.map((word, i) => (
              <motion.h1
                custom={i}
                initial="hidden"
                animate="visible"
                variants={wordAnimation}
                key={i}
                className={`text-6xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.95] ${
                  word === "vendas." 
                    ? "text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-blue-700 italic" 
                    : "text-white"
                }`}
              >
                {word}
              </motion.h1>
            ))}
          </div>
          
          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-2xl text-white/50 max-w-2xl mx-auto font-medium tracking-tight mt-10 leading-relaxed"
          >
            Dashboard inteligente, engenharia de alta conversão e recuperação agressiva via WhatsApp. <strong className="text-white/90">A tríade do faturamento.</strong>
          </motion.p>

          {/* Interactive CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex items-center justify-center pointer-events-auto z-20"
          >
            <button 
              onClick={() => navigate('/vi-experience')}
              className="group relative px-10 py-5 bg-white text-[#050505] rounded-full font-bold text-sm uppercase tracking-[0.2em] overflow-hidden transition-transform hover:scale-[1.02] active:scale-95 flex items-center gap-3"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              Começar Agora
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Glassmorphic Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-28 md:mt-32 w-full max-w-5xl pointer-events-auto z-20">
            {[
              {
                icon: BarChart3,
                title: "Inteligência de Dados",
                desc: "Controle de métricas, alunos e LTV em tempo real."
              },
              {
                icon: Globe,
                title: "Engenharia Web",
                desc: "Landing pages e plataformas de luxo que convertem."
              },
              {
                icon: MessageSquareWarning,
                title: "Recuperação Ativa",
                desc: "Automações de WhatsApp que dobram seu faturamento atrasado."
              }
            ].map((prop, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 1.2 + i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ 
                  y: -8,
                  borderColor: "rgba(59, 130, 246, 0.3)",
                  boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.15)"
                }}
                className="flex flex-col items-start p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-md transition-all duration-300 group text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/5 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors duration-500">
                  <prop.icon className="w-5 h-5 text-white/70 group-hover:text-primary transition-colors duration-500" />
                </div>
                <h3 className="font-bold text-white text-xl tracking-tight mb-2">{prop.title}</h3>
                <p className="text-sm text-white/40 font-medium leading-relaxed">{prop.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </motion.div>
    </section>
  );
};

export default HeroImmersive;
