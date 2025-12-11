
import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float, Stars as DreiStars } from '@react-three/drei';
import * as THREE from 'three';

// --- UTILS: Generate Soft Cloud Texture ---
// Creates a radial gradient texture on the fly to avoid external assets
const generateCloudTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255,255,255, 0.9)');
  gradient.addColorStop(0.2, 'rgba(255,255,255, 0.4)');
  gradient.addColorStop(0.5, 'rgba(255,255,255, 0.1)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

// --- COMPONENT: Nebula Clouds ---
const Nebula = ({ count = 30 }) => {
  const cloudTexture = useMemo(() => generateCloudTexture(), []);

  // Colors: Cyber Purple, Deep Blue, Magenta, touch of Orange
  const colors = ['#BC13FE', '#00F0FF', '#3b0764', '#FF0080'];

  const clouds = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      position: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20 - 15 // push a bit back
      ],
      scale: Math.random() * 8 + 6, // Big soft clouds
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.3 + 0.1, // very subtle
      speed: (Math.random() - 0.5) * 0.05
    }));
  }, [count]);

  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Slow drift of the entire nebula field
    groupRef.current.rotation.z = t * 0.02;
    groupRef.current.children.forEach((child, i) => {
      // Oscillate opacity or scale slightly for "living" breath
      const s = clouds[i].scale + Math.sin(t * 0.5 + i) * 0.5;
      child.scale.set(s, s, s);
    });
  });

  return (
    <group ref={groupRef}>
      {clouds.map((cloud, i) => (
        <sprite key={i} position={cloud.position}>
          <spriteMaterial
            map={cloudTexture}
            color={cloud.color}
            transparent
            opacity={cloud.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
};

// --- COMPONENT: Fast Moving Star Particles ---
const StarStream = ({ count = 3000 }) => {
  const points = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60; // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100; // z
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (!points.current) return;

    const positions = points.current.geometry.attributes.position.array;
    const speed = 15; // Speed of travel

    for (let i = 0; i < count; i++) {
      // Move towards camera (+z)
      positions[i * 3 + 2] += delta * speed;

      // Reset if passed camera
      if (positions[i * 3 + 2] > 20) {
        positions[i * 3 + 2] = -80;
        positions[i * 3] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        vertexColors={false}
        color="#ffffff"
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// --- COMPONENT: Floating Crystal Shards ---
const FloatingCrystals = ({ count = 30 }) => {
  const mesh = useRef();

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const items = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      position: [
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 40 - 10
      ],
      rotSpeed: [(Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, Math.random() * 0.5],
      scale: Math.random() * 0.8 + 0.2
    }));
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;

    items.forEach((item, i) => {
      const t = state.clock.getElapsedTime();

      // Rotate
      dummy.rotation.set(
        t * item.rotSpeed[0],
        t * item.rotSpeed[1],
        t * item.rotSpeed[2]
      );

      // Gentle float
      dummy.position.set(
        item.position[0] + Math.sin(t * 0.3 + i * 100) * 0.5,
        item.position[1] + Math.cos(t * 0.2 + i * 100) * 0.5,
        item.position[2]
      );

      dummy.scale.set(item.scale, item.scale, item.scale);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#00F0FF"
        roughness={0.1}
        metalness={0.9}
        emissive="#00F0FF"
        emissiveIntensity={0.2}
        transparent
        opacity={0.8}
      />
    </instancedMesh>
  );
};

// --- COMPONENT: Mouse Parallax & Camera Rig ---
const CameraRig = () => {
  const { mouse, camera } = useThree();

  useFrame((state, delta) => {
    // Smooth mouse follow parallax
    camera.position.x += (mouse.x * 2 - camera.position.x) * delta * 2;
    camera.position.y += (mouse.y * 2 - camera.position.y) * delta * 2;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// --- MAIN EXPORT ---
const CosmicUniverse = () => {
  return (
    <div className="fixed inset-0 z-0 bg-cyber-black overflow-hidden pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} gl={{ antialias: false, powerPreference: "high-performance" }}>
        <color attach="background" args={['#050510']} /> {/* Very Deep Dark Blue/Black */}
        <fog attach="fog" args={['#050510', 10, 80]} />

        {/* Lights */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#BC13FE" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#00F0FF" />

        {/* Elements */}
        <StarStream />
        <Nebula />
        <FloatingCrystals />

        {/* Background distant stars for depth */}
        <DreiStars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Interactions */}
        <CameraRig />
      </Canvas>

      {/* Vignette & Grain Overlay for Cinematic Feel */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_120%)] opacity-70"></div>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
    </div>
  );
};

export default CosmicUniverse;
