import { useRef, useEffect } from "react";
import { useScroll, useSpring } from "framer-motion";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const useBustScene = (containerRef: React.RefObject<HTMLDivElement>, scrollProgress: any) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x3b82f6, 2); // Blue light for Vincere
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xffffff, 1);
    pointLight2.position.set(-5, 0, 5);
    scene.add(pointLight2);

    // Placeholder Bust (Box for now)
    // USER: Replace this 'bust-placeholder' logic with a GLTFLoader for your 'bust.glb'
    let model: THREE.Object3D;
    const loader = new GLTFLoader();
    
    // We try to load 'bust.glb' if it exists, otherwise use a placeholder
    loader.load("/bust.glb", 
      (gltf) => {
        model = gltf.scene;
        scene.add(model);
      },
      undefined,
      () => {
        // Fallback placeholder
        const geometry = new THREE.IcosahedronGeometry(1.2, 1);
        const material = new THREE.MeshStandardMaterial({ 
           color: 0xffffff, 
           wireframe: true,
           roughness: 0.1,
           metalness: 0.8
        });
        model = new THREE.Mesh(geometry, material);
        scene.add(model);
      }
    );

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (model) {
        const p = scrollProgress.get();
        model.rotation.y = p * Math.PI * 2;
        model.rotation.x = Math.sin(p * Math.PI) * 0.2;
        model.scale.setScalar(1 + p * 0.5);
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);
};

const BustExperience = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useBustScene(canvasRef, smoothProgress);

  return (
    <section ref={containerRef} className="relative h-[200vh] bg-background">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Typography (Monolith Style) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
           <h2 className="text-[30vw] font-black tracking-tighter text-foreground uppercase select-none">
             BEYOND
           </h2>
        </div>
        
        {/* 3D Canvas */}
        <div ref={canvasRef} className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing" />
        
        {/* Content Overlay */}
        <div className="relative z-30 text-center pointer-events-none translate-y-40">
           <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary mb-2">Art & Tech</p>
           <h3 className="text-4xl md:text-6xl font-serif italic tracking-tighter leading-none text-foreground max-w-xl">
             Ancient Wisdom <br/> Modern Execution
           </h3>
        </div>
      </div>
    </section>
  );
};

export default BustExperience;
