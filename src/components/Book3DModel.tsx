'use client';

import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useTexture, OrbitControls, Environment, Float, useProgress } from '@react-three/drei';
import * as THREE from 'three';

// This invisible component tracks the loading progress of the 3D assets
function LoaderTracker({ onLoaded }: { onLoaded: () => void }) {
  const { progress } = useProgress();
  
  useEffect(() => {
    if (progress === 100) {
      // Add a tiny 500ms delay to ensure the browser has painted the canvas smoothly
      const timer = setTimeout(() => onLoaded(), 500);
      return () => clearTimeout(timer);
    }
  }, [progress, onLoaded]);
  
  return null;
}

function Book() {
  const group = useRef<THREE.Group>(null);
  
  const textureFront = useTexture('/images/hayyan_mockup.jpeg');
  const textureBack = useTexture('/images/hayyab_mockup_back.jpeg');

  const coverMaterial = new THREE.MeshStandardMaterial({ 
    map: textureFront, 
    roughness: 0.15, 
    metalness: 0.2
  });
  
  const backMaterial = new THREE.MeshStandardMaterial({ 
    map: textureBack, 
    roughness: 0.15, 
    metalness: 0.2
  });
  
  const pagesMaterial = new THREE.MeshStandardMaterial({ 
    color: '#e8dcc4', 
    roughness: 0.9 
  });
  
  const spineMaterial = new THREE.MeshStandardMaterial({ 
    color: '#1a0f0a',
    roughness: 0.6 
  });

  const materials = [
    pagesMaterial, 
    spineMaterial, 
    pagesMaterial, 
    pagesMaterial, 
    coverMaterial, 
    backMaterial,  
  ];

  return (
    <group ref={group}>
      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh castShadow receiveShadow material={materials}>
          <boxGeometry args={[3, 4.2, 0.4]} />
        </mesh>
      </Float>
    </group>
  );
}

export default function Book3DModel({ onLoaded }: { onLoaded?: () => void }) {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing z-50">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        {onLoaded && <LoaderTracker onLoaded={onLoaded} />}
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={2.5} />
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