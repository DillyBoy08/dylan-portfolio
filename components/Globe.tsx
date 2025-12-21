"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html } from "@react-three/drei";
import * as THREE from "three";

function GlobeMarker({ position }: { position: [number, number, number] }) {
  const markerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (markerRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      markerRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      {/* Pulsing marker */}
      <mesh ref={markerRef}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Marker pin */}
      <mesh position={[0, 0.08, 0]}>
        <coneGeometry args={[0.03, 0.1, 8]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>

      {/* Label */}
      <Html distanceFactor={3} position={[0, 0.15, 0]}>
        <div className="bg-black/80 text-white px-3 py-1 rounded-full text-xs whitespace-nowrap pointer-events-none">
          South Africa
        </div>
      </Html>
    </group>
  );
}

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);

  // Convert latitude/longitude to 3D coordinates
  // South Africa is approximately at -30° lat, 25° lon
  const latLonToVector3 = (lat: number, lon: number, radius: number): [number, number, number] => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return [x, y, z];
  };

  const southAfricaPosition = latLonToVector3(-30, 25, 1.02);

  // Slow auto-rotation
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  // Create custom shader material for continents
  const createEarthMaterial = () => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        // Simple noise function
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
          // Ocean color
          vec3 oceanColor = vec3(0.1, 0.3, 0.6);
          // Land color
          vec3 landColor = vec3(0.2, 0.6, 0.3);
          // Desert color
          vec3 desertColor = vec3(0.8, 0.7, 0.4);

          // Create continents using noise
          float pattern = noise(vUv * 5.0);
          float continents = step(0.4, pattern);

          // Africa-like pattern around the marker area
          float africa = smoothstep(0.3, 0.7, noise(vUv * 3.0 + vec2(0.5, 0.3)));

          // Mix colors
          vec3 color = mix(oceanColor, landColor, continents);
          color = mix(color, desertColor, africa * continents * 0.5);

          // Add atmospheric rim light
          float rim = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
          rim = pow(rim, 3.0);
          color += vec3(0.3, 0.5, 1.0) * rim * 0.5;

          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
  };

  return (
    <group>
      {/* Earth sphere */}
      <Sphere ref={earthRef} args={[1, 64, 64]}>
        <meshStandardMaterial
          color="#1a5490"
          roughness={0.7}
          metalness={0.2}
        />
      </Sphere>

      {/* Landmasses overlay */}
      <Sphere args={[1.001, 64, 64]}>
        <meshStandardMaterial
          color="#2d8659"
          transparent
          opacity={0.8}
          roughness={0.9}
          polygonOffset
          polygonOffsetFactor={-1}
        >
          <primitive attach="map" object={createContinentTexture()} />
        </meshStandardMaterial>
      </Sphere>

      {/* Atmosphere glow */}
      <Sphere args={[1.1, 64, 64]}>
        <meshBasicMaterial
          color="#88ccff"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* South Africa marker */}
      <GlobeMarker position={southAfricaPosition} />
    </group>
  );
}

// Create a simple procedural continent texture
function createContinentTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Ocean
  ctx.fillStyle = '#1a5490';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw simplified continents
  ctx.fillStyle = '#2d8659';

  // Africa (simplified)
  ctx.beginPath();
  ctx.ellipse(280, 140, 60, 80, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Add some variation
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 30 + 10;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function Globe() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-5, -3, -5]} intensity={0.3} color="#4a90e2" />

        {/* Stars background */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={1000}
              array={new Float32Array(
                Array.from({ length: 3000 }, () => (Math.random() - 0.5) * 20)
              )}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial size={0.02} color="#ffffff" transparent opacity={0.6} />
        </points>

        {/* Earth */}
        <Earth />

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={2}
          maxDistance={5}
          autoRotate={false}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
