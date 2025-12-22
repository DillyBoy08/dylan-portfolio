"use client";

import { useRef, useState, useEffect, useCallback, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Text3D, Environment, Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface InteractiveSphereProps {
  color: string;
  logo?: string;
  modelPath?: string;
  modelScale?: number;
}

function Model({ modelPath, onPointerDown, scale = 1.5 }: { modelPath: string; onPointerDown: (e: any) => void; scale?: number }) {
  const { scene } = useGLTF(modelPath);

  return (
    <primitive
      object={scene}
      scale={scale}
      position={[0, 0, 0]}
      onPointerDown={onPointerDown}
    />
  );
}

function InteractiveSphere({ color, logo, modelPath, modelScale }: InteractiveSphereProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (groupRef.current && !isDragging) {
      // Auto-rotate slowly when not being dragged
      groupRef.current.rotation.y += 0.005;
    }
  });

  const handlePointerDown = (e: any) => {
    setIsDragging(true);
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = useCallback((e: any) => {
    if (isDragging) {
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      if (groupRef.current) {
        groupRef.current.rotation.y += deltaX * 0.01;
        groupRef.current.rotation.x += deltaY * 0.01;
      }

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    }
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  return (
    <group ref={groupRef}>
      {modelPath ? (
        // Render GLB model
        <>
          <Suspense fallback={null}>
            <Model modelPath={modelPath} onPointerDown={handlePointerDown} scale={modelScale} />
          </Suspense>
          {/* Glow effect around model */}
          <Sphere args={[1.2, 32, 32]}>
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.15}
              side={THREE.BackSide}
            />
          </Sphere>
        </>
      ) : (
        // Fallback to sphere with text for skills without models
        <>
          {/* Main sphere */}
          <Sphere args={[0.8, 64, 64]} onPointerDown={handlePointerDown}>
            <meshStandardMaterial
              color={color}
              metalness={0.8}
              roughness={0.2}
              emissive={color}
              emissiveIntensity={0.15}
              envMapIntensity={1.5}
            />
          </Sphere>

          {/* 3D Logo/Text on sphere */}
          {logo && (
            <Center position={[0, 0, 0.81]}>
              <Text3D
                font="/fonts/helvetiker_bold.typeface.json"
                size={0.25}
                height={0.1}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.01}
                bevelSegments={5}
              >
                {logo}
                <meshStandardMaterial
                  color="#ffffff"
                  metalness={0.9}
                  roughness={0.1}
                  emissive="#ffffff"
                  emissiveIntensity={0.3}
                />
              </Text3D>
            </Center>
          )}

          {/* Glow effect */}
          <Sphere args={[0.85, 32, 32]}>
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.1}
              side={THREE.BackSide}
            />
          </Sphere>
        </>
      )}
    </group>
  );
}

interface SkillIconProps {
  color: string;
  logo?: string;
  modelPath?: string;
  modelScale?: number;
}

export default function SkillIcon({ color, logo, modelPath, modelScale }: SkillIconProps) {
  // Only use Canvas for skills with 3D models to avoid WebGL context limit
  if (modelPath) {
    return (
      <div className="relative w-16 h-16 flex-shrink-0 cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[3, 3, 3]} intensity={1.5} />
          <pointLight position={[-2, -2, -2]} intensity={0.5} color="#4a9eff" />
          <spotLight
            position={[0, 3, 2]}
            angle={0.3}
            penumbra={1}
            intensity={1}
          />

          <Environment preset="city" />
          <InteractiveSphere color={color} logo={logo} modelPath={modelPath} modelScale={modelScale} />
        </Canvas>
      </div>
    );
  }

  // Simple CSS-based icon for skills without 3D models
  return (
    <div
      className="relative w-16 h-16 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg transition-transform hover:scale-110"
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        boxShadow: `0 4px 15px ${color}40, inset 0 0 20px ${color}20`
      }}
    >
      {logo}
    </div>
  );
}
