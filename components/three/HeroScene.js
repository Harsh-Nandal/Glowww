'use client'

import { Canvas } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'

function GlassBlob() {
  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.1}>
      <mesh>
        <icosahedronGeometry args={[1.35, 4]} />
        <MeshDistortMaterial
          color="#0F6B44"
          distort={0.35}
          speed={1.4}
          roughness={0.15}
          metalness={0.25}
          transparent
          opacity={0.88}
        />
      </mesh>
    </Float>
  )
}

function GoldOrb({ position, scale = 1 }) {
  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1.8}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <MeshDistortMaterial color="#CBA135" distort={0.2} speed={2} roughness={0.2} metalness={0.5} />
      </mesh>
    </Float>
  )
}

function MintRing() {
  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh position={[-1.6, 1.1, -1.2]} rotation={[1.1, 0.4, 0]}>
        <torusGeometry args={[0.55, 0.05, 16, 64]} />
        <MeshDistortMaterial color="#B7F5D8" distort={0.15} speed={1.2} roughness={0.3} metalness={0.3} />
      </mesh>
    </Float>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 3, 4]} intensity={1.4} color="#FCE7A0" />
      <pointLight position={[-3, -2, 2]} intensity={0.9} color="#B7F5D8" />
      <GlassBlob />
      <GoldOrb position={[1.9, -1.1, -0.6]} />
      <GoldOrb position={[-1.7, -0.6, -1]} scale={0.6} />
      <MintRing />
    </Canvas>
  )
}
