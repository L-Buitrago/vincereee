import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

/* ── Custom Feather Shader (Literal Black Stem + Premium Fibers) ── */
const FeatherMaterialShader = {
  uniforms: {
    uMap: { value: null },
    uMatcap: { value: null },
    uAlphaMap: { value: null },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
      vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform sampler2D uMap;
    uniform sampler2D uMatcap;
    uniform sampler2D uAlphaMap;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec4 texColor = texture2D(uMap, vUv);
      float alpha = texture2D(uAlphaMap, vUv).r;

      // Normals handling for premium flips
      vec3 normal = vNormal;
      if (!gl_FrontFacing) normal *= -1.0;

      // Matcap for subtle highlights
      vec3 viewDir = normalize(vViewPosition);
      vec3 x = normalize(vec3(viewDir.z, 0.0, -viewDir.x));
      vec3 y = cross(viewDir, x);
      vec2 matcapUv = vec2(dot(x, normal), dot(y, normal)) * 0.495 + 0.5;
      vec3 matcapColor = texture2D(uMatcap, matcapUv).rgb;

      // STEM DETECTION (The central raquis)
      float isStem = smoothstep(0.4, 0.5, texColor.g); 
      
      // Barb Color: Realistic grey-black fibers
      vec3 barbColor = (texColor.rgb + vec3(0.08)) * 1.5;
      
      // STEM COLOR: Literal 100% Black (as requested)
      // We use ONLY a sharp matcap highlight to define it
      vec3 stemColor = vec3(0.0) + matcapColor * 1.5;
      
      // Final Combine
      // Force barbs to be dark too
      vec3 finalColor = mix(barbColor * 0.7, stemColor, isStem);
      
      if (alpha < 0.1) discard;
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};

/* ── Raw Three.js feather renderer ── */
const useFeatherScene = (
  containerRef: React.RefObject<HTMLDivElement>,
  scrollProgress: any
) => {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 1, 100);
    camera.position.set(0, 0, 8); 

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // SHADOWS
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Light for shadows
    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(3, 7, 3);
    light.castShadow = true;
    
    // EXPANDED SHADOW CAMERA (to avoid cut-off / fiapo)
    light.shadow.camera.left = -20;
    light.shadow.camera.right = 20;
    light.shadow.camera.top = 20;
    light.shadow.camera.bottom = -20;
    light.shadow.bias = -0.0001; // Prevent shadow acne/rings
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light);
    
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    // Ground "Shadow Catcher" (LARGE)
    const shadowCatcher = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.ShadowMaterial({ opacity: 0.2 })
    );
    shadowCatcher.rotation.x = -Math.PI / 2;
    shadowCatcher.position.y = -3.2;
    shadowCatcher.receiveShadow = true;
    scene.add(shadowCatcher);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const texLoader = new THREE.TextureLoader();
    const matcapBlack = texLoader.load("/matcapblack.png");
    const featherBase = texLoader.load("/feather-base.png");
    const featherAlpha = texLoader.load("/feather-alpha.jpg");
    featherBase.flipY = false;
    featherAlpha.flipY = false;

    let feather: THREE.Object3D | null = null;
    gltfLoader.load("/feather-full-animated.glb", (gltf) => {
      feather = gltf.scene;
      feather.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = new THREE.ShaderMaterial({
            uniforms: {
              uMap: { value: featherBase },
              uMatcap: { value: matcapBlack },
              uAlphaMap: { value: featherAlpha },
            },
            vertexShader: FeatherMaterialShader.vertexShader,
            fragmentShader: FeatherMaterialShader.fragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
          });
        }
      });
      feather.scale.set(1.15, 1.85, 1.15);
      scene.add(feather);
    });

    let animId = 0;
    let time = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.012;

      if (feather) {
        const p = scrollProgress.get();

        // ENTRANCE: Perfectly centered at p=0
        feather.position.y = THREE.MathUtils.lerp(1.2, -3.1, p);
        feather.position.x = THREE.MathUtils.lerp(-1.8, 0, p) + 
                             Math.sin(p * Math.PI) * 0.8 + 
                             Math.cos(time * 0.4) * 0.1;

        // Rotation: Improved wind-driven feel
        feather.rotation.z = -0.6 + p * Math.PI * 1.1 + Math.sin(time * 0.3) * 0.05;
        feather.rotation.y = p * Math.PI * 2.2 + time * 0.15;
        feather.rotation.x = p * Math.PI * 0.8 + Math.cos(time * 0.3) * 0.05;

        // Shadow opacity grows as it lands
        shadowCatcher.material.opacity = THREE.MathUtils.lerp(0.08, 0.25, p);
      }

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      dracoLoader.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);
};

/* ── Content Block ── */
const ContentBlock = ({ title, subtitle, description, index, scrollProgress }: any) => {
  const sectionStep = 0.22;
  const start = 0.2 + index * sectionStep; // Start phrases earlier together with feather
  const opacity = useTransform(scrollProgress, [start, start + 0.1, start + 0.22], [0, 1, 0]);
  const y = useTransform(scrollProgress, [start, start + 0.1], [40, 0]);

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 flex items-center px-12 md:px-32 pointer-events-none">
      <div className="max-w-md">
        <h3 className="text-3xl md:text-[3.5vw] font-serif italic text-foreground mb-4 leading-tight whitespace-pre-line">{title}</h3>
        <p className="text-foreground/60 text-lg"><span className="text-foreground font-bold">{subtitle}</span> {description}</p>
      </div>
    </motion.div>
  );
};

/* ── Main Section ── */
const FeatherSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 30 }); 

  useFeatherScene(canvasRef, smooth);

  const data = [
    { title: "Talentas que\ndefinem o futuro", subtitle: "Curadoria extrema.", description: "Selecionamos apenas o topo da pirâmide criativa para seu projeto." },
    { title: "Escalabilidade\nsem fricção", subtitle: "Agilidade real.", description: "Aumente seu time conforme a necessidade, sem burocracia ou perda de tempo." },
    { title: "Resultados que\ndesafiam a gravidade", subtitle: "Foco total.", description: "Alta fidelidade na execução para levar sua marca ao próximo nível." },
  ];

  return (
    <section ref={containerRef} className="relative bg-background overflow-visible" style={{ height: "1000vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div ref={canvasRef} className="absolute inset-0 z-10" />
        <div className="absolute inset-0 z-20">
          {data.map((item, i) => (
            <ContentBlock key={i} {...item} index={i} scrollProgress={smooth} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatherSection;
