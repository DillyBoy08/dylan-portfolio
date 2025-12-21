"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sky, Cloud, Environment } from "@react-three/drei";
import * as THREE from "three";

interface Weather3DSceneProps {
  weatherCondition: string; // rain, snow, clear, clouds, etc.
  temperature: number;
  windSpeed: number;
}

// 3D Rain Particles
function RainParticles() {
  const rainRef = useRef<THREE.Points>(null);
  const particleCount = 1000;

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      velocities[i] = 0.1 + Math.random() * 0.1;
    }

    return { positions, velocities };
  }, []);

  useFrame(() => {
    if (!rainRef.current) return;

    const positions = rainRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 1] -= particles.velocities[i];

      // Reset particle when it hits the ground
      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = 20;
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      }
    }

    rainRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#4da6ff" transparent opacity={0.6} />
    </points>
  );
}

// 3D Snow Particles
function SnowParticles() {
  const snowRef = useRef<THREE.Points>(null);
  const particleCount = 500;

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      velocities[i] = 0.02 + Math.random() * 0.03;
    }

    return { positions, velocities };
  }, []);

  useFrame(({ clock }) => {
    if (!snowRef.current) return;

    const positions = snowRef.current.geometry.attributes.position.array as Float32Array;
    const time = clock.getElapsedTime();

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 1] -= particles.velocities[i];
      positions[i * 3] += Math.sin(time + i) * 0.01; // Drift sideways

      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = 20;
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      }
    }

    snowRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={snowRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#ffffff" transparent opacity={0.8} />
    </points>
  );
}

// Lightning Effect
function Lightning() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!lightRef.current) return;

    // Random lightning flashes
    if (Math.random() > 0.99) {
      lightRef.current.intensity = 20;
      setTimeout(() => {
        if (lightRef.current) lightRef.current.intensity = 0;
      }, 100);
    }
  });

  return <pointLight ref={lightRef} position={[0, 10, 0]} intensity={0} color="#a0c4ff" />;
}

// 3D Tree
function Tree({ position }: { position: [number, number, number] }) {
  const trunkRef = useRef<THREE.Mesh>(null);
  const leavesRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!trunkRef.current || !leavesRef.current) return;

    const sway = Math.sin(clock.getElapsedTime() * 2) * 0.05;
    trunkRef.current.rotation.z = sway;
    leavesRef.current.rotation.z = sway * 1.5;
  });

  return (
    <group position={position}>
      {/* Trunk */}
      <mesh ref={trunkRef} position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 1, 8]} />
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </mesh>

      {/* Leaves */}
      <mesh ref={leavesRef} position={[0, 1.3, 0]}>
        <coneGeometry args={[0.5, 1.2, 8]} />
        <meshStandardMaterial color="#228b22" roughness={0.7} />
      </mesh>
    </group>
  );
}

// 3D House
function House({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1, 0.8, 1]} />
        <meshStandardMaterial color="#d2691e" roughness={0.8} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 1, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.85, 0.6, 4]} />
        <meshStandardMaterial color="#8b4513" roughness={0.9} />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.2, 0.51]}>
        <boxGeometry args={[0.3, 0.5, 0.05]} />
        <meshStandardMaterial color="#4a2511" />
      </mesh>

      {/* Window */}
      <mesh position={[0.3, 0.5, 0.51]}>
        <boxGeometry args={[0.2, 0.2, 0.05]} />
        <meshStandardMaterial color="#87ceeb" emissive="#ffd700" emissiveIntensity={0.3} />
      </mesh>

      {/* Chimney */}
      <mesh position={[0.3, 1.3, 0.2]}>
        <boxGeometry args={[0.15, 0.4, 0.15]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
    </group>
  );
}

// Floating Island/Platform
function Island() {
  return (
    <group>
      {/* Main platform */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[3, 2.5, 0.6, 32]} />
        <meshStandardMaterial color="#8b7355" roughness={0.9} />
      </mesh>

      {/* Grass top */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[3.02, 3, 0.05, 32]} />
        <meshStandardMaterial color="#4a7c34" roughness={0.8} />
      </mesh>

      {/* Bottom rock */}
      <mesh position={[0, -0.6, 0]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial color="#6b5d4f" roughness={1} />
      </mesh>
    </group>
  );
}

// Main 3D Scene
function Scene({ weatherCondition, temperature, windSpeed }: Weather3DSceneProps) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(5, 4, 8);
  }, [camera]);

  // Determine weather effects
  const isRaining = weatherCondition.includes("rain") || weatherCondition.includes("drizzle");
  const isSnowing = weatherCondition.includes("snow");
  const isThunderstorm = weatherCondition.includes("thunder");
  const isCloudy = weatherCondition.includes("cloud");
  const isClear = weatherCondition.includes("clear");

  // Dynamic lighting based on weather
  const ambientIntensity = isThunderstorm ? 0.2 : isCloudy ? 0.5 : 0.7;
  const sunIntensity = isClear ? 1.5 : isThunderstorm ? 0.3 : 0.8;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={sunIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Sky */}
      {isClear && <Sky sunPosition={[100, 20, 100]} />}

      {/* Clouds */}
      {isCloudy && (
        <>
          <Cloud position={[-3, 5, -5]} speed={0.2} opacity={0.5} />
          <Cloud position={[3, 4, -3]} speed={0.3} opacity={0.4} />
          <Cloud position={[0, 6, -7]} speed={0.25} opacity={0.6} />
        </>
      )}

      {/* Weather Effects */}
      {isRaining && <RainParticles />}
      {isSnowing && <SnowParticles />}
      {isThunderstorm && <Lightning />}

      {/* Floating Island */}
      <Island />

      {/* House */}
      <House position={[0, 0, 0]} />

      {/* Trees */}
      <Tree position={[-1.5, 0, 1]} />
      <Tree position={[1.8, 0, 0.5]} />
      <Tree position={[-1, 0, -1.5]} />
      <Tree position={[1.5, 0, -1.8]} />

      {/* Ground fog for atmosphere */}
      {(isCloudy || isRaining) && (
        <fog attach="fog" args={["#cccccc", 5, 20]} />
      )}

      {/* Orbit Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={6}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// Main Component
export default function Weather3DScene({ weatherCondition, temperature, windSpeed }: Weather3DSceneProps) {
  return (
    <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/30">
      <Canvas
        shadows
        camera={{ position: [5, 4, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene
          weatherCondition={weatherCondition}
          temperature={temperature}
          windSpeed={windSpeed}
        />
      </Canvas>
    </div>
  );
}
