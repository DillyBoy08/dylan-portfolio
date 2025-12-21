"use client";

import { useRef, useState, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

interface ProjectCardProps {
  title: string;
  description: string;
  position: [number, number, number];
  color: string;
  delay?: number;
}

function ProjectCard({
  title,
  description,
  position,
  color,
  delay = 0,
}: ProjectCardProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [appeared, setAppeared] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Appearance animation
    if (!appeared && state.clock.elapsedTime > delay + 1) {
      setAppeared(true);
    }

    if (appeared) {
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + delay) * 0.1;

      // Rotate on hover
      if (hovered) {
        meshRef.current.rotation.y += 0.02;
      }
    }
  });

  return (
    <group ref={meshRef} position={position} scale={appeared ? 1 : 0}>
      <RoundedBox
        args={[1.5, 2, 0.05]}
        radius={0.05}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? color : "#000000"}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </RoundedBox>

      {/* Card Border Glow */}
      <RoundedBox args={[1.55, 2.05, 0.02]} radius={0.05} position={[0, 0, -0.03]}>
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </RoundedBox>

      {/* Title */}
      <Text
        position={[0, 0.5, 0.03]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.3}
      >
        {title}
      </Text>

      {/* Description */}
      <Text
        position={[0, 0.2, 0.03]}
        fontSize={0.08}
        color={color}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.3}
      >
        {description}
      </Text>

      {/* Hover indicator */}
      {hovered && (
        <Text
          position={[0, -0.6, 0.03]}
          fontSize={0.06}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          [ CLICK TO VIEW ]
        </Text>
      )}
    </group>
  );
}

export default memo(ProjectCard);
