"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import ProjectCard from "./ProjectCard";

export default function Workspace() {
  const groupRef = useRef<THREE.Group>(null);
  const [isBooted, setIsBooted] = useState(false);

  // Boot up animation
  useFrame((state) => {
    if (!isBooted && state.clock.elapsedTime > 1) {
      setIsBooted(true);
    }
  });

  // Sample projects data
  const projects = [
    {
      title: "Project 1",
      description: "3D Web Experience",
      position: [-3, 1.5, -2] as [number, number, number],
      color: "#00f0ff",
    },
    {
      title: "Project 2",
      description: "Interactive Game",
      position: [0, 1.5, -2] as [number, number, number],
      color: "#b829ff",
    },
    {
      title: "Project 3",
      description: "Modern Website",
      position: [3, 1.5, -2] as [number, number, number],
      color: "#ff2e97",
    },
  ];

  return (
    <group ref={groupRef}>
      {/* Desk Platform */}
      <RoundedBox args={[12, 0.3, 6]} position={[0, -0.15, 0]} radius={0.1}>
        <meshStandardMaterial
          color="#111111"
          metalness={0.8}
          roughness={0.2}
          emissive="#00f0ff"
          emissiveIntensity={0.1}
        />
      </RoundedBox>

      {/* Center Holographic Display */}
      <group position={[0, 0.5, 0]}>
        <RoundedBox args={[0.1, 2, 3]} position={[0, 1, 0]} radius={0.05}>
          <meshStandardMaterial
            color="#000000"
            metalness={1}
            roughness={0.1}
            emissive="#00f0ff"
            emissiveIntensity={isBooted ? 0.5 : 0}
          />
        </RoundedBox>

        {/* Holographic Screen Content */}
        {isBooted && (
          <mesh position={[0.2, 1, 0]}>
            <planeGeometry args={[2.8, 1.8]} />
            <meshBasicMaterial
              color="#00f0ff"
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Welcome Text */}
        {isBooted && (
          <Text
            position={[0.3, 1.5, 0]}
            fontSize={0.2}
            color="#00f0ff"
            anchorX="center"
            anchorY="middle"
          >
            DYLAN
          </Text>
        )}

        {isBooted && (
          <Text
            position={[0.3, 1.2, 0]}
            fontSize={0.08}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            WEB DEVELOPER
          </Text>
        )}
      </group>

      {/* Floating Project Cards */}
      {isBooted &&
        projects.map((project, index) => (
          <ProjectCard key={index} {...project} delay={index * 0.2} />
        ))}

      {/* Floating Orb (Central Focus) */}
      <mesh position={[0, 2, 2]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <MeshDistortMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.5}
          distort={0.3}
          speed={2}
          roughness={0}
          metalness={1}
        />
      </mesh>

      {/* Grid Floor (Optional - cyberpunk aesthetic) */}
      <gridHelper args={[20, 20, "#00f0ff", "#111111"]} position={[0, -0.3, 0]} />
    </group>
  );
}
