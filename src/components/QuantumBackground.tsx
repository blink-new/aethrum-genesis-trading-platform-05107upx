import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function QuantumSphere() {
  const sphereRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.005
      sphereRef.current.rotation.x += 0.002
    }
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime
    }
  })

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform float time;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vec3 color1 = vec3(0.0, 0.85, 1.0); // Quantum Blue
      vec3 color2 = vec3(0.55, 0.36, 0.96); // Neural Purple
      vec3 color3 = vec3(0.0, 1.0, 0.53); // Plasma Green
      
      float noise = sin(vPosition.x * 2.0 + time) * 
                   cos(vPosition.y * 2.0 + time * 0.7) * 
                   sin(vPosition.z * 2.0 + time * 0.5);
      
      vec3 finalColor = mix(color1, color2, noise * 0.5 + 0.5);
      finalColor = mix(finalColor, color3, sin(time * 0.3) * 0.2 + 0.1);
      
      float alpha = 0.05 + abs(noise) * 0.03;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `

  return (
    <Sphere ref={sphereRef} args={[2, 32, 32]} position={[0, 0, 0]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 }
        }}
        transparent
        side={THREE.DoubleSide}
      />
    </Sphere>
  )
}

function QuantumParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  const particleCount = 100
  const positions = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={particleCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#00D9FF"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

export function QuantumBackground() {
  return (
    <div className="fixed inset-0 w-full h-full">
      {/* CSS Gradient Background */}
      <div className="quantum-background" />
      
      {/* 3D Quantum Elements */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          zIndex: 1
        }}
      >
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        <QuantumSphere />
        <QuantumParticles />
      </Canvas>
      
      {/* Neural Grid Overlay */}
      <div className="absolute inset-0 neural-grid opacity-30" style={{ zIndex: 2 }} />
    </div>
  )
}