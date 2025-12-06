"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { MeshDistortMaterial, Sphere } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"

function OrbMesh() {
  const mesh = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    mesh.current.rotation.y += delta * 0.2
    mesh.current.rotation.x += delta * 0.1
  })

  return (
    <Sphere args={[1.2, 64, 64]} ref={mesh}>
      <MeshDistortMaterial
        color="#7c3aed"
        emissive="#A9A9A9"
        distort={2.35}
        speed={3.9}
        roughness={7.2}
      />
    </Sphere>
  )
}

export default function Rotate() {
  return ( 
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 4] }}
        style={{ 
          background: 'transparent',
          pointerEvents: 'none'  
        }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbMesh />
      </Canvas>
    </div>
  )
}