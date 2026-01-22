"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Performance constants
const PARTICLE_COUNTS = {
  DESKTOP: 300,
  MOBILE: 100,
  REDUCED_MOTION: 50,
} as const;

export default function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const frameCountRef = useRef(0);

  // Detect device capabilities and preferences
  const [particleCount, setParticleCount] = useState<number>(PARTICLE_COUNTS.DESKTOP);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion) {
      setParticleCount(PARTICLE_COUNTS.REDUCED_MOTION);
    } else if (isMobile) {
      setParticleCount(PARTICLE_COUNTS.MOBILE);
    } else {
      setParticleCount(PARTICLE_COUNTS.DESKTOP);
    }
  }, []);

  // Generate particle positions
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const neonColors = [
      new THREE.Color("#00f0ff"),
      new THREE.Color("#b829ff"),
      new THREE.Color("#ff2e97"),
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Random positions around the workspace
      positions[i3] = (Math.random() - 0.5) * 15;
      positions[i3 + 1] = Math.random() * 8 - 2;
      positions[i3 + 2] = (Math.random() - 0.5) * 15;

      // Random neon colors
      const color = neonColors[Math.floor(Math.random() * neonColors.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    return { positions, colors };
  }, [particleCount]);

  // Animate particles - throttled to update every 2nd frame for performance
  useFrame((state) => {
    if (!particlesRef.current) return;

    // Increment frame counter
    frameCountRef.current++;

    // Gentle floating movement (runs every frame - cheap operation)
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;

    // Throttle expensive position updates to every 2nd frame
    if (frameCountRef.current % 2 !== 0) return;

    const positions = particlesRef.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < positions.length; i += 3) {
      // Vertical floating
      positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001;

      // Reset if particle goes too high or low
      if (positions[i + 1] > 8) positions[i + 1] = -2;
      if (positions[i + 1] < -2) positions[i + 1] = 8;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
