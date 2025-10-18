import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

interface ModelProps {
  mousePosition: THREE.Vector2;
}

function Model({ mousePosition }: ModelProps) {
  const { scene } = useGLTF('/3dlogo/l8_v2.gltf');
  const modelRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const target = new THREE.Vector3();
  const intersectionPoint = new THREE.Vector3();
  const planeNormal = new THREE.Vector3();
  const plane = new THREE.Plane();
  const raycaster = new THREE.Raycaster();
  const rotationSpeed = 0.05;

  useEffect(() => {
    if (!camera) return; // Ensure camera is defined

    // Update the target position based on mouse position
    const updateTarget = () => {
      planeNormal.set(0, 0, 1).normalize();
      plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
      raycaster.setFromCamera(mousePosition, camera);
      raycaster.ray.intersectPlane(plane, intersectionPoint);

      target.set(intersectionPoint.x, intersectionPoint.y, 2);
    };

    updateTarget();
  }, [camera, mousePosition, scene.position]); // Update whenever mousePosition changes

  useFrame(() => {
    if (modelRef.current) {
      const direction = target.clone().sub(modelRef.current.position).normalize();
      const desiredRotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
      modelRef.current.quaternion.slerp(desiredRotation, rotationSpeed);
    }
  });

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.position.set(0, 0, -20);
      // Scale down the model to make it smaller
      modelRef.current.scale.setScalar(0.7);
    }
  }, []);

  return <primitive ref={modelRef} object={scene} />;
}

export default Model;
