"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import Portal from "./Portal";

// Performance constants
const STAR_COUNTS = {
  DESKTOP: 1500,
  MOBILE: 500,
  REDUCED_MOTION: 300,
} as const;

// Loading fallback for Suspense
function SceneLoader() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="#8b5cf6" wireframe />
    </mesh>
  );
}

export default function Scene() {
  const [starCount, setStarCount] = useState<number>(STAR_COUNTS.DESKTOP);

  // Detect device capabilities on mount
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion) {
      setStarCount(STAR_COUNTS.REDUCED_MOTION);
    } else if (isMobile) {
      setStarCount(STAR_COUNTS.MOBILE);
    } else {
      setStarCount(STAR_COUNTS.DESKTOP);
    }
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="bg-black"
      dpr={[1, 2]} // Limit pixel ratio for performance
    >
      {/* Lighting - reduced from 4 lights to 3 for performance */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#3b82f6" />

      {/* Background Stars - reduced count from 3000 */}
      <Stars radius={100} depth={50} count={starCount} factor={4} saturation={0} fade speed={1} />

      {/* Portal/Wormhole with Suspense for lazy loading */}
      <Suspense fallback={<SceneLoader />}>
        <Portal />
      </Suspense>

      {/* Camera Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
