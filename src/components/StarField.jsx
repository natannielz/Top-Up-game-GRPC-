
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

const StarParticles = ({ count = 2000 }) => {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize random positions and speeds for 'warp' effect potential or just drift
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 100; // Increased spread
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 50; // Depth
      const speed = Math.random() * 0.02;
      temp.push({ x, y, z, speed, initialZ: z });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;

    // Subtle rotation of the entire field
    mesh.current.rotation.x = state.clock.getElapsedTime() * 0.05;
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.03;

    particles.forEach((particle, i) => {
      // Here we could implement individual particle movement if not using InstancedMesh static logic,
      // but for <InstancedMesh> updating 2000 matrices every frame might be heavy without shader material.
      // So for high perf background, we stick to rotating the group or using the 'Stars' helper mostly.

      // Let's just update the dummy object to place them initially.
      // Actually, InstancedMesh needs setting manually loop.

      const { x, y, z } = particle;
      dummy.position.set(x, y, z);

      // Twinkle effect by scaling slightly?
      const s = Math.abs(Math.sin(state.clock.elapsedTime * particle.speed + i)) * 0.5 + 0.5;
      dummy.scale.set(s, s, s);

      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.05, 10, 10]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
    </instancedMesh>
  );
};

// Moving Fog / Nebula effect using simple planes or colors could be added here.

const StarField = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-cyber-black pointer-events-none">
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        {/* Pre-built efficient stars from Drei */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Custom particle layer for foreground depth */}
        <StarParticles count={500} />

        {/* Ambient colored light for 'Nebula' feel */}
        <ambientLight intensity={0.5} color="#0d0d1a" />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00F0FF" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#BC13FE" />
      </Canvas>

      {/* CSS Overlay for Vignette / Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cyber-black/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0B0C15_100%)] opacity-80" />
    </div>
  );
};

export default StarField;
