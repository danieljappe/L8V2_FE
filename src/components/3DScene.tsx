import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Model from './3DModel';

const Scene = () => {
  const [mousePosition, setMousePosition] = useState(new THREE.Vector2());
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition(new THREE.Vector2(mouseX, mouseY));
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 0], fov: 90 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 5]} intensity={1} />
      <Suspense fallback={null}>
        <Model mousePosition={mousePosition} />
      </Suspense>
    </Canvas>
  );
};

export default Scene;
