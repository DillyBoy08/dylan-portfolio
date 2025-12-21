"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Torus, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// Portal Ring Component
function PortalRing({ radius, tubeRadius, rotation, speed, color }: any) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed;
      meshRef.current.rotation.y += speed * 0.5;
    }
  });

  return (
    <Torus ref={meshRef} args={[radius, tubeRadius, 16, 100]} rotation={rotation}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.7}
      />
    </Torus>
  );
}

// Particle Stream Component
function ParticleStream() {
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = 1000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const t = (i / particleCount) * Math.PI * 4;
      const radius = 0.5 + (i / particleCount) * 2;
      const angle = t * 3;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = (i / particleCount) * 10 - 5;
    }
    return pos;
  }, []);

  const colors = useMemo(() => {
    const col = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      // Purple to blue gradient
      col[i * 3] = 0.5 + t * 0.4; // R
      col[i * 3 + 1] = 0.3 + t * 0.5; // G
      col[i * 3 + 2] = 0.9 + t * 0.1; // B
    }
    return col;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.z = state.clock.elapsedTime * 0.3;

      // Animate particles through the tunnel
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 2] += 0.05;
        if (positions[i * 3 + 2] > 5) {
          positions[i * 3 + 2] = -5;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Energy Orbs orbiting the portal
function EnergyOrb({ position, color, speed }: any) {
  const orbRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.rotation.y = state.clock.elapsedTime * speed;
    }
  });

  return (
    <group ref={orbRef}>
      <Sphere args={[0.15, 16, 16]} position={position}>
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          distort={0.4}
          speed={2}
          roughness={0}
        />
      </Sphere>
    </group>
  );
}

// Main Portal Component
export default function Portal() {
  const portalCoreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (portalCoreRef.current) {
      portalCoreRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group>
      {/* Portal Core - Central Energy */}
      <mesh ref={portalCoreRef}>
        <torusGeometry args={[0.5, 0.2, 16, 100]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={1}
          metalness={1}
          roughness={0}
        />
      </mesh>

      {/* Central Glowing Sphere */}
      <Sphere args={[0.3, 32, 32]}>
        <MeshDistortMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={1.5}
          distort={0.3}
          speed={3}
          roughness={0}
        />
      </Sphere>

      {/* Multiple Portal Rings */}
      <PortalRing
        radius={1.5}
        tubeRadius={0.05}
        rotation={[Math.PI / 2, 0, 0]}
        speed={0.01}
        color="#8b5cf6"
      />
      <PortalRing
        radius={2}
        tubeRadius={0.04}
        rotation={[Math.PI / 3, Math.PI / 4, 0]}
        speed={0.015}
        color="#3b82f6"
      />
      <PortalRing
        radius={2.5}
        tubeRadius={0.03}
        rotation={[Math.PI / 4, Math.PI / 6, 0]}
        speed={0.008}
        color="#6366f1"
      />

      {/* Particle Streams flowing through portal */}
      <ParticleStream />

      {/* Second particle stream rotated */}
      <group rotation={[0, 0, Math.PI / 2]}>
        <ParticleStream />
      </group>

      {/* Energy Orbs */}
      <EnergyOrb position={[3, 0, 0]} color="#ec4899" speed={1} />
      <EnergyOrb position={[-3, 0, 0]} color="#3b82f6" speed={-1.2} />
      <EnergyOrb position={[0, 3, 0]} color="#8b5cf6" speed={0.8} />
      <EnergyOrb position={[0, -3, 0]} color="#6366f1" speed={-0.9} />

      {/* Outer Glow Ring */}
      <mesh>
        <torusGeometry args={[3, 0.02, 16, 100]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Light beams */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#8b5cf6" distance={10} />
      <pointLight position={[0, 0, 2]} intensity={1.5} color="#3b82f6" distance={8} />
    </group>
  );
}
