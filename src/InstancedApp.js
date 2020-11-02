import * as THREE from 'three'
import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import tumult from 'tumult'
// import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from '@react-three/postprocessing'

import { OrbitControls } from '@react-three/drei/OrbitControls'

import './App.css'

const dimX = 200;
const dimY = 200;
const cubeCount = dimX * dimY;

const tempObject = new THREE.Object3D()
const tempColor = new THREE.Color()

const noiseFunc = new tumult.Perlin2()
const noise = new Array(cubeCount).fill().map((_, i) => (1 + noiseFunc.octavate(1.25, Math.floor(i / dimX) / 20, Math.floor(i % dimY) / 20)) * 0.5)

const colorPalette = ['#1111ff', '#1111ff', '#1111ff', '#1111ff', '#1111ff', '#fcd046', '#00aa00', '#007700', '#004400']
const colors = new Array(cubeCount).fill().map((_, i) => colorPalette[Math.floor(noise[i] * 9)])
const speeds = new Array(cubeCount).fill().map((_, i) => Math.floor(noise[i] * 9) < 5 ? 1 : 0)

function Boxes() {
  const colorArray = useMemo(() => Float32Array.from(new Array(cubeCount).fill().flatMap((_, i) => tempColor.set(colors[i]).toArray())), [])
  // const noiseArray = useMemo(() => Float32Array.from(new Array(cubeCount).fill().flatMap((_, i) => tempColor.set(colors[i]).toArray())), [])

  const ref = useRef()

  useFrame(state => {
    const time = state.clock.getElapsedTime()
    // ref.current.rotation.x = Math.sin(time / 4)
    // ref.current.rotation.y = Math.sin(time / 2)
    let i = 0
    for (let x = 0; x < dimX; x++) {
      for (let z = 0; z < dimY; z++) {
        const id = i++
        tempObject.position.set(dimX/2 - x, (-3 + (7 * noise[x * dimY + z])) * (1 - speeds[x * dimY + z]), dimY/2 - z)
        tempObject.position.y += ((Math.sin(x / 4 + time) + Math.sin(0 / 4 + time) + Math.sin(z / 4 + time)) * 0.5 + (noise[x + z * dimY])) * speeds[x * dimY + z]
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
      <boxBufferGeometry attach="geometry" args={[1.0, 2.0, 1.0]}>
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
    onCreated={({ gl }) => gl.setClearColor('black')}>
    <ambientLight color={'#444444'} />
    <pointLight position={[50, 50, 50]} intensity={1.0} />
    <Boxes />
    <OrbitControls />
    {/* <EffectComposer> */}
      {/* <DepthOfField focusDistance={0} focalLength={0.5} bokehScale={3} height={120} /> */}
      {/* <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} /> */}
      {/* <Noise opacity={0.02} /> */}
      {/* <Vignette eskil={false} offset={0.1} darkness={1.1} /> */}
    {/* </EffectComposer> */}
  </Canvas>
)


export default InstancedApp;
