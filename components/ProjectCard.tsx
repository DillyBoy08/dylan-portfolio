"use client";

import { useRef, useState, memo, useCallback, useEffect } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

interface ProjectCardProps {
  title: string;
  description: string;
  position: [number, number, number];
  color: string;
  delay?: number;
  onClick?: () => void;
}

function ProjectCard({
  title,
  description,
  position,
  color,
  delay = 0,
  onClick,
}: ProjectCardProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [appeared, setAppeared] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isActive, setIsActive] = useState(false); // For touch tap state
  // Use ref to prevent repeated state updates in animation loop
  const appearedRef = useRef(false);

  // Detect touch device on mount
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      );
    };
    checkTouchDevice();
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Appearance animation - only triggers state update once
    if (!appearedRef.current && state.clock.elapsedTime > delay + 1) {
      appearedRef.current = true;
      setAppeared(true);
    }

    if (appearedRef.current) {
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + delay) * 0.1;

      // Rotate on hover or active (touch) state
      if (hovered || isActive) {
        meshRef.current.rotation.y += 0.02;
      }
    }
  });

  // Memoize event handlers to prevent unnecessary re-renders
  const handlePointerOver = useCallback(() => {
    if (!isTouchDevice) setHovered(true);
  }, [isTouchDevice]);

  const handlePointerOut = useCallback(() => {
    if (!isTouchDevice) setHovered(false);
  }, [isTouchDevice]);

  // Handle click/tap for both desktop and mobile
  const handleClick = useCallback((event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();

    if (isTouchDevice) {
      // Toggle active state on touch devices
      setIsActive(prev => !prev);
    }

    onClick?.();
  }, [isTouchDevice, onClick]);

  // Combined active state for visual feedback
  const isInteracting = hovered || isActive;

  return (
    <group ref={meshRef} position={position} scale={appeared ? 1 : 0}>
      <RoundedBox
        args={[1.5, 2, 0.05]}
        radius={0.05}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={isInteracting ? color : "#000000"}
          emissive={color}
          emissiveIntensity={isInteracting ? 0.8 : 0.3}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </RoundedBox>

      {/* Card Border Glow */}
      <RoundedBox args={[1.55, 2.05, 0.02]} radius={0.05} position={[0, 0, -0.03]}>
        <meshBasicMaterial color={color} transparent opacity={isInteracting ? 0.5 : 0.3} />
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

      {/* Interaction indicator - shows on hover (desktop) or when active (touch) */}
      {isInteracting && (
        <Text
          position={[0, -0.6, 0.03]}
          fontSize={0.06}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {isTouchDevice ? "[ TAP AGAIN TO VIEW ]" : "[ CLICK TO VIEW ]"}
        </Text>
      )}
    </group>
  );
}

export default memo(ProjectCard);
