import * as THREE from 'three'
import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from 'react-three-fiber'
import { useGLTF } from '@react-three/drei/useGLTF'
import tumult from 'tumult'

const dimX = 50;
const dimY = 500;
const cubeCount = dimX * dimY;

const tempObject = new THREE.Object3D()
const tempColor = new THREE.Color()

const noiseFunc = new tumult.Perlin2()
const noise = new Array(cubeCount).fill().map((_, i) => (1 + noiseFunc.octavate(1.25, Math.floor(i / dimX) / 200, Math.floor(i % dimY) / 20)) * 0.5)

const colorPalette = ['#1111ff', '#1111ff', '#1111ff', '#1111ff', '#1111ff', '#fcd046', '#00aa00', '#007700', '#004400']
const colors = new Array(cubeCount).fill().map((_, i) => colorPalette[Math.floor(noise[i] * 9)])
const speeds = new Array(cubeCount).fill().map((_, i) => Math.floor(noise[i] * 9) < 5 ? 1 : 0)

const tempTrees = new THREE.Object3D()

function Forest() {
  const { nodes, materials } = useGLTF('models/tree/tree01.gltf', true)

  const treeGeometry = nodes['node-0'].geometry;
  treeGeometry.scale(0.005,0.005,0.005 )

  const ref = useRef()

  useEffect(() => {
    let i = 0
    for (let x = 0; x < dimX; x++) {
      for (let z = 0; z < dimY; z++) {
        if (Math.floor(noise[x * dimY + z] * 9) > 5 && Math.random()>0.5) {
          const id = i++
          tempTrees.position.set((dimX/2 - x), Math.floor(noise[x * dimY + z] * 4.25), (dimY/2 - z))
          tempTrees.rotation.y = Math.random() * (Math.PI * 2)
          tempTrees.updateMatrix()
          ref.current.setMatrixAt(id, tempTrees.matrix)

        }
      }
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, []);

  return (
    <instancedMesh ref={ref} args={[treeGeometry, materials['Mat'], 500]} />
  )
}

function Boxes() {
  const colorArray = useMemo(() => Float32Array.from(new Array(cubeCount).fill().flatMap((_, i) => tempColor.set(colors[i]).toArray())), [])
  const ref = useRef()

  useFrame(state => {
    const time = state.clock.getElapsedTime()
    let i = 0
    for (let x = 0; x < dimX; x++) {
      for (let z = 0; z < dimY; z++) {
        const id = i++
        tempObject.position.set(dimX/2 - x, (-3 + (7 * noise[x * dimY + z])) * (1 - speeds[x * dimY + z]), dimY/2 - z)
        tempObject.position.y += ((Math.sin(x / 4 + time) + Math.sin(0 / 4 + time) + Math.sin(z / 4 + time)) * 0.25) * speeds[x * dimY + z]
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

const CubeLandscape = () => {
  return (
    <>
      <Forest />
      <Boxes />
    </>
  )
}

export default CubeLandscape