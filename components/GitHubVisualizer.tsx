'use client'

import { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  useGLTF,
  OrbitControls,
  Text3D,
  Center,
  Float,
  MeshTransmissionMaterial,
  Environment,
  Sparkles,
  Text,
  PerspectiveCamera,
  Sphere
} from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'

const USERNAME = 'DillyBoy08'

interface GitHubStats {
  username: string
  name: string
  avatar: string
  bio: string
  followers: number
  following: number
  publicRepos: number
  totalStars: number
  totalForks: number
  createdAt: string
  languageBytes: { [key: string]: number }
  topRepos: Array<{
    name: string
    stars: number
    forks: number
    language: string
    description: string
    url: string
  }>
}

const LANGUAGE_COLORS: { [key: string]: string } = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Dart: '#00B4AB',
  Shell: '#89e051',
  Other: '#8e8e8e',
}

// Model Component - Properly loads GLB models
function TechModel({
  modelPath,
  position,
  scale = 1,
  rotationSpeed = 0.5,
  floatIntensity = 0.5
}: {
  modelPath: string
  position: [number, number, number]
  scale?: number
  rotationSpeed?: number
  floatIntensity?: number
}) {
  const gltf = useGLTF(modelPath)
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed * 0.01
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * floatIntensity
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={floatIntensity}>
      <group ref={meshRef} position={position}>
        <primitive object={gltf.scene.clone()} scale={scale} />
      </group>
    </Float>
  )
}

// Smooth orbiting path with model
function OrbitingModel({
  modelPath,
  radius,
  speed,
  yOffset = 0,
  scale = 1
}: {
  modelPath: string
  radius: number
  speed: number
  yOffset?: number
  scale?: number
}) {
  const gltf = useGLTF(modelPath)
  const groupRef = useRef<THREE.Group>(null)
  const offset = Math.random() * Math.PI * 2

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime * speed
      groupRef.current.position.x = Math.cos(time + offset) * radius
      groupRef.current.position.z = Math.sin(time + offset) * radius
      groupRef.current.position.y = yOffset + Math.sin(time * 2) * 0.3
      groupRef.current.rotation.y = time * 2
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene.clone()} scale={scale} />
    </group>
  )
}

// Smooth animated camera
function SmoothCamera() {
  const { camera } = useThree()

  useFrame((state) => {
    const time = state.clock.elapsedTime * 0.15
    camera.position.x = Math.sin(time) * 12
    camera.position.y = 8 + Math.sin(time * 0.8) * 2
    camera.position.z = Math.cos(time) * 12
    camera.lookAt(0, 0, 0)
  })

  return null
}

// Glowing data ribbons (smooth curves instead of geometric shapes)
function DataRibbon({
  color,
  offset = 0,
  radius = 5
}: {
  color: string
  offset?: number
  radius?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 + offset
    }
  })

  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 100; i++) {
      const angle = (i / 100) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle * 3) * 1.5
      const z = Math.sin(angle) * radius
      pts.push(new THREE.Vector3(x, y, z))
    }
    return pts
  }, [radius])

  const curve = new THREE.CatmullRomCurve3(points)
  const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.05, 8, true)

  return (
    <mesh ref={meshRef} geometry={tubeGeometry}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

// Smooth particle field forming GitHub stats
function StatsParticles({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 3 + Math.random() * 8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }
    return positions
  }, [count])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00d9ff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Glass morphism display sphere for stats
function GlassStatSphere({
  position,
  color,
  label,
  value
}: {
  position: [number, number, number]
  color: string
  label: string
  value: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group position={position}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.6, 64, 64]} />
          <MeshTransmissionMaterial
            backside
            samples={16}
            resolution={512}
            transmission={0.95}
            roughness={0.1}
            thickness={1.5}
            ior={1.5}
            chromaticAberration={0.5}
            anisotropy={1}
            distortion={0.3}
            distortionScale={0.5}
            temporalDistortion={0.2}
            color={color}
          />
        </mesh>

        {/* Glowing core */}
        <mesh scale={0.4}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2}
          />
        </mesh>

        {/* Floating label */}
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.25}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {label}
        </Text>

        <Text
          position={[0, 0.9, 0]}
          fontSize={0.35}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
          fontWeight={900}
        >
          {value.toLocaleString()}
        </Text>
      </group>
    </Float>
  )
}

// Central platform with rotating models
function CentralPlatform({ languages }: { languages: Array<{ language: string; color: string }> }) {
  const platformRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (platformRef.current) {
      platformRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group ref={platformRef}>
      {/* Smooth rotating disc */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[4, 4, 0.2, 64]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.1}
          emissive="#00d9ff"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Outer ring */}
      <mesh position={[0, -1.9, 0]}>
        <torusGeometry args={[4.5, 0.05, 32, 100]} />
        <meshStandardMaterial
          color="#00d9ff"
          emissive="#00d9ff"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Language color indicators on platform */}
      {languages.slice(0, 8).map((lang, i) => {
        const angle = (i / 8) * Math.PI * 2
        const x = Math.cos(angle) * 3.5
        const z = Math.sin(angle) * 3.5

        return (
          <mesh key={i} position={[x, -1.7, z]}>
            <cylinderGeometry args={[0.15, 0.15, 0.4, 32]} />
            <meshStandardMaterial
              color={lang.color}
              emissive={lang.color}
              emissiveIntensity={1.5}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// Main 3D Scene
function GitHubScene({ stats }: { stats: GitHubStats }) {
  const languageData = useMemo(() => {
    const total = Object.values(stats.languageBytes).reduce((a, b) => a + b, 0)
    return Object.entries(stats.languageBytes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([lang, bytes]) => ({
        language: lang,
        percentage: ((bytes / total) * 100).toFixed(1),
        color: LANGUAGE_COLORS[lang] || LANGUAGE_COLORS.Other,
      }))
  }, [stats.languageBytes])

  return (
    <>
      <SmoothCamera />

      {/* Environment for realistic reflections */}
      <Environment preset="night" />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 8, 0]} intensity={3} color="#00d9ff" />
      <pointLight position={[10, 5, 10]} intensity={2} color="#3b82f6" />
      <pointLight position={[-10, 5, -10]} intensity={2} color="#8b5cf6" />
      <spotLight
        position={[0, 15, 0]}
        angle={0.6}
        penumbra={0.5}
        intensity={2}
        castShadow
        color="#ffffff"
      />

      {/* Central platform */}
      <CentralPlatform languages={languageData} />

      {/* Orbiting tech logo models */}
      <Suspense fallback={null}>
        <OrbitingModel modelPath="/Logo/react_logo_circle.glb" radius={6} speed={0.3} scale={0.15} yOffset={0} />
        <OrbitingModel modelPath="/Logo/python.glb" radius={7} speed={-0.25} scale={2.5} yOffset={1} />
        <OrbitingModel modelPath="/Logo/css-3d.glb" radius={5.5} speed={0.35} scale={0.15} yOffset={-0.5} />
        <OrbitingModel modelPath="/Logo/visual_studio_logo.glb" radius={6.5} speed={-0.28} scale={0.4} yOffset={0.5} />
      </Suspense>

      {/* Smooth data ribbons */}
      <DataRibbon color="#00d9ff" offset={0} radius={8} />
      <DataRibbon color="#3b82f6" offset={Math.PI / 3} radius={7.5} />
      <DataRibbon color="#8b5cf6" offset={Math.PI / 1.5} radius={8.5} />

      {/* Glass morphism stat spheres */}
      <GlassStatSphere
        position={[-5, 3, -2]}
        color="#00d9ff"
        label="REPOS"
        value={stats.publicRepos}
      />
      <GlassStatSphere
        position={[5, 2, -3]}
        color="#fbbf24"
        label="STARS"
        value={stats.totalStars}
      />
      <GlassStatSphere
        position={[0, 4, 4]}
        color="#8b5cf6"
        label="FOLLOWERS"
        value={stats.followers}
      />

      {/* Particle field */}
      <StatsParticles count={1000} />

      {/* Ambient sparkles */}
      <Sparkles
        count={200}
        scale={20}
        size={2}
        speed={0.3}
        opacity={0.6}
        color="#00d9ff"
      />
    </>
  )
}

// Preload models
useGLTF.preload('/Logo/react_logo_circle.glb')
useGLTF.preload('/Logo/python.glb')
useGLTF.preload('/Logo/css-3d.glb')
useGLTF.preload('/Logo/visual_studio_logo.glb')

export default function GitHubVisualizer() {
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchGitHubData()
  }, [])

  const fetchGitHubData = async () => {
    setLoading(true)
    setError('')

    try {
      const userResponse = await fetch(`https://api.github.com/users/${USERNAME}`)
      if (!userResponse.ok) throw new Error('Failed to fetch user data')
      const userData = await userResponse.json()

      const reposResponse = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`)
      if (!reposResponse.ok) throw new Error('Failed to fetch repos')
      const reposData = await reposResponse.json()

      const languageBytes: { [key: string]: number } = {}
      let totalStars = 0
      let totalForks = 0

      for (const repo of reposData) {
        totalStars += repo.stargazers_count || 0
        totalForks += repo.forks_count || 0

        try {
          const langResponse = await fetch(repo.languages_url)
          if (langResponse.ok) {
            const langData = await langResponse.json()
            Object.entries(langData).forEach(([lang, bytes]) => {
              languageBytes[lang] = (languageBytes[lang] || 0) + (bytes as number)
            })
          }
        } catch (err) {
          // Silently skip language data if fetch fails
        }
      }

      const topRepos = reposData
        .filter((repo: any) => !repo.fork)
        .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6)
        .map((repo: any) => ({
          name: repo.name,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language || 'Unknown',
          description: repo.description || 'No description',
          url: repo.html_url,
        }))

      setStats({
        username: userData.login,
        name: userData.name || userData.login,
        avatar: userData.avatar_url,
        bio: userData.bio || 'No bio available',
        followers: userData.followers,
        following: userData.following,
        publicRepos: userData.public_repos,
        totalStars,
        totalForks,
        createdAt: userData.created_at,
        languageBytes,
        topRepos,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch GitHub data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-400 text-xl">Loading GitHub Universe...</p>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error || 'Failed to load data'}</p>
          <button
            onClick={fetchGitHubData}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const totalLanguageBytes = Object.values(stats.languageBytes).reduce((a, b) => a + b, 0)
  const topLanguages = Object.entries(stats.languageBytes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([lang, bytes]) => ({
      language: lang,
      percentage: ((bytes / totalLanguageBytes) * 100).toFixed(1),
      color: LANGUAGE_COLORS[lang] || LANGUAGE_COLORS.Other,
    }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Full Screen 3D Experience */}
      <div className="relative h-screen">
        <Canvas shadows camera={{ position: [10, 8, 10], fov: 50 }}>
          <color attach="background" args={['#0a0a15']} />

          <Suspense fallback={null}>
            <GitHubScene stats={stats} />
          </Suspense>
        </Canvas>

        {/* Overlay UI */}
        <div className="absolute top-0 left-0 right-0 p-8 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg pb-2">
              {stats.name}
            </h1>
            <p className="text-blue-300 text-xl">@{stats.username}</p>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 text-center text-blue-400 text-sm pointer-events-none">
          <p className="drop-shadow-lg">3D GitHub Profile Visualization • Smooth Cinematic Camera</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-8 backdrop-blur-sm"
            >
              <div className="text-5xl font-bold text-blue-400 mb-2">{stats.publicRepos}</div>
              <div className="text-gray-400">Repositories</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-8 backdrop-blur-sm"
            >
              <div className="text-5xl font-bold text-yellow-400 mb-2">{stats.totalStars}</div>
              <div className="text-gray-400">Total Stars</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8 backdrop-blur-sm"
            >
              <div className="text-5xl font-bold text-purple-400 mb-2">{stats.followers}</div>
              <div className="text-gray-400">Followers</div>
            </motion.div>
          </div>

          {/* Top Languages */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Language Distribution</h2>
            <div className="space-y-4">
              {topLanguages.map((lang, index) => (
                <motion.div
                  key={lang.language}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: lang.color }} />
                      <span className="text-white font-semibold text-lg">{lang.language}</span>
                    </div>
                    <span className="text-gray-400 font-mono">{lang.percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: lang.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${lang.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top Repositories */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-8">Top Repositories</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.topRepos.map((repo, index) => (
                <motion.a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 rounded-xl p-6 transition-all"
                >
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                    {repo.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{repo.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.Other }} />
                      <span>{repo.language}</span>
                    </div>
                    <span className="flex items-center gap-1">
                      ⭐ {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      🔱 {repo.forks}
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
