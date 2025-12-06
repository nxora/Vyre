"use client"

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Group } from 'three'

const techIcons = [
  { name: 'React', color: '#61dafb' },
  { name: 'TS', color: '#3178c6' },
  { name: 'Next.js', color: '#000000' },
  { name: 'Tailwind', color: '#38b2ac' },
  { name: 'Node', color: '#339933' },
]

 function RotatingOrb() {
  const groupRef = useRef<Group>(null)
  const [time, setTime] = useState(0)

  useFrame((state) => {
    setTime(state.clock.getElapsedTime())
  })

  return (
    <group ref={groupRef}>
      {techIcons.map((icon, i) => {
        const angle = (i / techIcons.length) * Math.PI * 2 + time * 0.5
        const radius = 1.5
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        return (
          <Text
            key={i}
            position={[x, 0, z]}
            fontSize={0.3}
            color={icon.color}
            anchorX="center"
            anchorY="middle"
            renderOrder={1}
          >
            {icon.name}
          </Text>
        )
      })}
    </group>
  )
}

 export default function Orb() {
  return (
    <Canvas className="w-32 h-32" camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={Math.PI} />
      <pointLight position={[10, 10, 10]} />

       <RotatingOrb />

      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  )
}