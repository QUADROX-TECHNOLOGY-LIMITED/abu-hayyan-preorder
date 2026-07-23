'use client';

import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useTexture, OrbitControls, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

function Book() {
  const group = useRef<THREE.Group>(null);
  
  // Load the exact mockup asset you uploaded
  const texture = useTexture('/images/hayyan_mockup.jpeg');

  const coverMaterial = new THREE.MeshStandardMaterial({ 
    map: texture, 
    roughness: 0.2, 
    metalness: 0.1
  });
  
  const pagesMaterial = new THREE.MeshStandardMaterial({ 
    color: '#e8dcc4', 
    roughness: 0.9 
  });
  
  const spineMaterial = new THREE.MeshStandardMaterial({ 
    color: '#2b1c11', 
    roughness: 0.5 
  });

  const materials = [
    pagesMaterial, // Right side
    spineMaterial, // Left side
    pagesMaterial, // Top
    pagesMaterial, // Bottom
    coverMaterial, // Front Cover
    spineMaterial, // Back Cover
  ];

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh castShadow receiveShadow material={materials}>
          <boxGeometry args={[3, 4.2, 0.4]} />
        </mesh>
      </Float>
    </group>
  );
}

export default function Book3DModel() {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing z-50">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <Environment preset="city" />
        
        <Book />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}