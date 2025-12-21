"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Particles() {
  const particlesRef = useRef<THREE.Points>(null);

  // Generate particle positions
  const particles = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const neonColors = [
      new THREE.Color("#00f0ff"),
      new THREE.Color("#b829ff"),
      new THREE.Color("#ff2e97"),
    ];

    for (let i = 0; i < count; i++) {
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
  }, []);

  // Animate particles
  useFrame((state) => {
    if (!particlesRef.current) return;

    // Gentle floating movement
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;

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
