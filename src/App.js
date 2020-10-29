// import ReactDOM from 'react-dom'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import { OrbitControls } from '@react-three/drei/OrbitControls'

import './App.css'

const Box = (props) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef()

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(e) => setActive(!active)}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true)}}
      onPointerOut={(e) => { e.stopPropagation(); setHover(false)}}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

const BoxArray = () => {

  const bxs = []

  for (let x = 0; x < 100; x++) {
    bxs.push([
      (Math.floor(x / 10) - 4.5) * 1.5,
      ((x % 10) - 4.5) * 1.5,
      0
    ])
  }

  return bxs.map((box)=><Box position={box} />)

}

const App = () => 
  <Canvas camera={{ fov: 45, position: [0, 0, 20] }}>
    <ambientLight />
    <pointLight position={[10, 10, 10]} />
    <BoxArray />
    <OrbitControls enableZoom={false} />
  </Canvas>

export default App;
