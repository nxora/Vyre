"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Icosahedron } from "@react-three/drei"
import { useRef, useEffect, useState } from "react"
import * as THREE from "three"

function OrbMesh() {
  const mesh = useRef<THREE.Mesh>(null!)
  const { pointer } = useThree()
  const [primaryColor, setPrimaryColor] = useState("#000000")

   useEffect(() => {
    const root = getComputedStyle(document.documentElement)
    const color = root.getPropertyValue('--primary').trim() || '#000'
    setPrimaryColor(color)
  }, [])

   useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 1.5  
      mesh.current.rotation.x += delta * 0.8
    }
  })

   useEffect(() => {
    if (!mesh.current) return
    const x = pointer.x * 0.1
    const y = -pointer.y * 0.1
    mesh.current.position.x = x
    mesh.current.position.y = y
  }, [pointer])

  return (
    <Icosahedron ref={mesh} args={[0.8, 0]} scale={1.5}>
      <meshStandardMaterial 
        emissive={primaryColor}
        emissiveIntensity={0.2}    
        roughness={0.7}           
        metalness={1.7}            
      />
    </Icosahedron>
  )
}

export default function RotatingCube() {
  return (
    <div className="w-full h-64 relative">
      <Canvas
        className="absolute inset-0 bg-transparent"
        camera={{ position: [0, 0, 4] }}
        style={{ pointerEvents: 'auto' }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <OrbMesh />
      </Canvas>
    </div>
  )
}