import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';

const Blob = () => {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock, pointer }) => {
    if (mesh.current) {
      // Rotate slowly over time
      mesh.current.rotation.x = clock.getElapsedTime() * 0.1;
      mesh.current.rotation.y = clock.getElapsedTime() * 0.15;
      
      // Slight movement based on pointer to simulate interactivity
      mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, pointer.x * 2, 0.05);
      mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, pointer.y * 2, 0.05);
    }
  });

  return (
    <Sphere ref={mesh} args={[2.5, 128, 128]} scale={1.2}>
      <MeshDistortMaterial
        color="#2a2e23"
        attach="material"
        distort={0.4} // Amount of distortion
        speed={1.5}   // Speed of distortion
        roughness={0.4}
        metalness={0.8}
        envMapIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0.2}
      />
    </Sphere>
  );
};

export default function AmorphousBlob() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-90">
      <Canvas camera={{ position: [0, 0, 8] }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#f5f5dc" />
        <spotLight position={[-10, 10, -5]} intensity={2} color="#f0ff3d" angle={0.5} penumbra={1} />
        
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 4, -0.3, 0]}>
            <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} color="#ffffff" />
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} color="#e8e8e3" />
            <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} color="#ccff00" />
          </group>
        </Environment>

        <Blob />
      </Canvas>
    </div>
  );
}
