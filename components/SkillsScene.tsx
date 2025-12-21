"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import SkillSphere from "./SkillSphere";

const skills = [
  {
    name: "JavaScript",
    icon: "🟨",
    color: "#F7DF1E",
    position: [2, 0, 0] as [number, number, number],
    speed: 0.3,
    orbitRadius: 3,
  },
  {
    name: "TypeScript",
    icon: "🔷",
    color: "#3178C6",
    position: [-2, 0.5, 0] as [number, number, number],
    speed: 0.25,
    orbitRadius: 3.5,
  },
  {
    name: "React",
    icon: "⚛️",
    color: "#61DAFB",
    position: [0, 1, 2] as [number, number, number],
    speed: 0.35,
    orbitRadius: 3,
  },
  {
    name: "Next.js",
    icon: "▲",
    color: "#000000",
    position: [0, -0.5, -2] as [number, number, number],
    speed: 0.28,
    orbitRadius: 3.2,
  },
  {
    name: "Three.js",
    icon: "🎮",
    color: "#049EF4",
    position: [1.5, 0, 1.5] as [number, number, number],
    speed: 0.32,
    orbitRadius: 2.8,
  },
  {
    name: "Python",
    icon: "🐍",
    color: "#3776AB",
    position: [-1.5, 0, -1.5] as [number, number, number],
    speed: 0.27,
    orbitRadius: 3.3,
  },
  {
    name: "Node.js",
    icon: "🟢",
    color: "#339933",
    position: [2.5, 0.5, 1] as [number, number, number],
    speed: 0.33,
    orbitRadius: 2.5,
  },
  {
    name: "Tailwind",
    icon: "💨",
    color: "#06B6D4",
    position: [-2.5, -0.5, 1] as [number, number, number],
    speed: 0.29,
    orbitRadius: 2.7,
  },
];

export default function SkillsScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
      <spotLight
        position={[0, 5, 5]}
        angle={0.5}
        penumbra={1}
        intensity={1}
        color="#06b6d4"
      />

      {/* Background Stars */}
      <Stars radius={100} depth={50} count={2000} factor={3} saturation={0} fade speed={0.5} />

      {/* Skill Spheres */}
      {skills.map((skill, index) => (
        <SkillSphere key={index} {...skill} />
      ))}

      {/* Central glow */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Camera Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={5}
        maxDistance={15}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
