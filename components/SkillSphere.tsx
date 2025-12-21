"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Text, Html } from "@react-three/drei";
import * as THREE from "three";

interface SkillSphereProps {
  position: [number, number, number];
  color: string;
  name: string;
  icon: string;
  speed: number;
  orbitRadius: number;
}

export default function SkillSphere({
  position,
  color,
  name,
  icon,
  speed,
  orbitRadius,
}: SkillSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      // Orbit around center
      groupRef.current.position.x = Math.cos(time * speed) * orbitRadius;
      groupRef.current.position.z = Math.sin(time * speed) * orbitRadius;
      groupRef.current.position.y = position[1] + Math.sin(time * speed * 0.5) * 0.5;
    }

    if (meshRef.current) {
      // Slow rotation
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Sphere ref={meshRef} args={[0.6, 32, 32]}>
        <meshStandardMaterial
          color={color}
          metalness={0.6}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </Sphere>

      {/* Icon/Logo on sphere */}
      <Html
        center
        distanceFactor={6}
        style={{
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="text-4xl filter drop-shadow-lg">{icon}</div>
          <div className="text-white font-bold text-sm bg-black/50 px-2 py-1 rounded backdrop-blur-sm whitespace-nowrap">
            {name}
          </div>
        </div>
      </Html>

      {/* Glow effect */}
      <Sphere args={[0.65, 32, 32]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
        />
      </Sphere>
    </group>
  );
}
