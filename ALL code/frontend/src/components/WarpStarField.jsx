import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const WarpParticles = ({ count = 2000, speed = 2 }) => {
  const mesh = useRef();

  // Create particles with random positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 200;
      const z = -Math.random() * 500; // Start far away
      const size = Math.random() * 0.5 + 0.1;
      temp.push({ x, y, z, initialZ: z, size });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!mesh.current) return;

    // Move particles towards camera (positive Z)
    particles.forEach((particle, i) => {
      particle.z += speed * (delta * 60); // Speed adjustment

      // Reset if passed camera
      if (particle.z > 50) {
        particle.z = -500;
        particle.x = (Math.random() - 0.5) * 200;
        particle.y = (Math.random() - 0.5) * 200;
      }

      dummy.position.set(particle.x, particle.y, particle.z);

      // Scale based on distance (far = small, close = bigger)
      const scale = particle.size;
      dummy.scale.set(scale, scale, scale * 5); // Elongate on Z for "streak" effect

      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;

    // Slight rotation for dynamic feel
    mesh.current.rotation.z += 0.001;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <boxGeometry args={[0.2, 0.2, 10]} /> {/* Long box for streak */}
      <meshBasicMaterial color="#00F0FF" transparent opacity={0.6} />
    </instancedMesh>
  );
};

const BackgroundStars = () => {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 3000;

  const particles = useMemo(() => {
    const t = [];
    for (let i = 0; i < count; i++) {
      t.push({
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 600,
        z: (Math.random() - 0.5) * 600,
        size: Math.random() * 0.5
      })
    }
    return t;
  }, []);

  useFrame(() => {
    if (!mesh.current) return;
    particles.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.set(p.size, p.size, p.size);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    mesh.current.rotation.y += 0.0002;
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.2, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
    </instancedMesh>
  )
}


const WarpStarField = () => {
  return (
    <div className="fixed inset-0 z-0 bg-cyber-black overflow-hidden">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <fog attach="fog" args={['#0B0C15', 0, 200]} />
        <color attach="background" args={['#0B0C15']} />

        <ambientLight intensity={0.5} />
        <WarpParticles count={1000} speed={1.5} />
        <BackgroundStars />

        {/* Glows */}
        <pointLight position={[0, 0, -50]} intensity={2} color="#00F0FF" distance={100} />
      </Canvas>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-60 pointer-events-none" />
    </div>
  );
};

export default WarpStarField;
