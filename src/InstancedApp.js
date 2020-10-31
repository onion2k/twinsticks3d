import * as THREE from 'three'
import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import niceColors from 'nice-color-palettes'
// import Effects from './Effects'

import { OrbitControls } from '@react-three/drei/OrbitControls'

import './App.css'

const cubeCount = 150*150;

const tempObject = new THREE.Object3D()
const tempColor = new THREE.Color()
const colors = new Array(cubeCount).fill().map(() => niceColors[17][Math.floor(Math.random() * 5)])

function Boxes() {
  const colorArray = useMemo(() => Float32Array.from(new Array(cubeCount).fill().flatMap((_, i) => tempColor.set(colors[i]).toArray())), [])

  const ref = useRef()

  useFrame(state => {
    const time = state.clock.getElapsedTime()
    // ref.current.rotation.x = Math.sin(time / 4)
    // ref.current.rotation.y = Math.sin(time / 2)
    let i = 0
    for (let x = 0; x < 150; x++) {
      for (let z = 0; z < 150; z++) {
        const id = i++
        tempObject.position.set(25 - x, 0, 25 - z)
        tempObject.position.y = Math.sin(x / 4 + time) + Math.sin(0 / 4 + time) + Math.sin(z / 4 + time)
        // tempObject.rotation.y = Math.sin(x / 4 + time) + Math.sin(0 / 4 + time) + Math.sin(z / 4 + time)
        // tempObject.rotation.z = tempObject.rotation.y * 2
        tempObject.updateMatrix()
        ref.current.setMatrixAt(id, tempObject.matrix)
      }
    }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[null, null, cubeCount]}>
      <boxBufferGeometry attach="geometry" args={[0.9, 0.9, 0.9]}>
        <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colorArray, 3]} />
      </boxBufferGeometry>
      <meshPhongMaterial attach="material" vertexColors={THREE.VertexColors} />
    </instancedMesh>
  )
}

const InstancedApp = () => (
  <Canvas
    gl={{ antialias: false, alpha: false }}
    camera={{ position: [0, 15, 30], near: 1, far: 500 }}
    onCreated={({ gl }) => gl.setClearColor('lightpink')}>
    <ambientLight />
    <pointLight position={[150, 150, 150]} intensity={0.55} />
    <Boxes />
    <OrbitControls />
    {/* <Effects /> */}
  </Canvas>
)


export default InstancedApp;
