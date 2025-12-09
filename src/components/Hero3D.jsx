import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShape = ({ position, color, speed }) => {
  const mesh = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    mesh.current.rotation.x = time * speed * 0.2;
    mesh.current.rotation.y = time * speed * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={mesh} position={position}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          wireframe
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
};

const HeroScene = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <FloatingShape position={[-4, 2, -5]} color="#00F0FF" speed={0.5} />
      <FloatingShape position={[4, -2, -3]} color="#BC13FE" speed={0.7} />
      <FloatingShape position={[0, 4, -8]} color="#FFD700" speed={0.3} />

      <fog attach="fog" args={['#121212', 5, 20]} />
    </>
  );
};

const Hero3D = () => {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1>LEVEL UP <span className="highlight">INSTANTLY</span></h1>
        <p>Premium Top-Up Service for Professional Gamers</p>
        <button className="cta-button">EXPLORE DEALS</button>
      </div>

      <div className="canvas-wrapper">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <HeroScene />
        </Canvas>
      </div>
    </div>
  );
};

export default Hero3D;
