import * as THREE from 'three'
import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame, LineSegments } from 'react-three-fiber'
import { useGLTF } from '@react-three/drei/useGLTF'
import tumult from 'tumult'
import "./SeaMaterial"

const dimX = 100;
const dimY = 100;

const noiseFunc = new tumult.Perlin2()
const noise = new Array(dimX * dimY).fill().map((_, i) => (1 + noiseFunc.octavate(1.25, Math.floor(i / dimX) / 20, Math.floor(i % dimY) / 20)) * 0.5)

function map(val, smin, smax, emin, emax) {
  const t =  (val-smin)/(smax-smin)
  return (emax-emin)*t + emin
}

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
        if (Math.floor(noise[x * dimY + z] * 9) > 5 && Math.floor(noise[x * dimY + z] * 9) < 7 && Math.random()>0.5) {
          const id = i++
          const col = noise[x * dimY + z] * 255
          tempTrees.position.set(
            (dimX/2 - x),
            map(col,0,255,-10,10),
            (dimY/2 - z)
          )
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


function Sea() {
  const ref = useRef()
  useFrame(({ camera, clock}) => {
    ref.current.material.time = clock.getElapsedTime()
  })

  return (
    <mesh ref={ref} rotation={[Math.PI * -0.5, 0, Math.PI ]}>
      <planeBufferGeometry attach="geometry" args={[dimX,dimY, 1, 1]} />
      <seaMaterial attach="material" color="blue" />
    </mesh>
  )
}

function VectorLandscape() {

  const geo = new THREE.PlaneGeometry(dimX,dimY, dimX,dimY+1)

  //assign vert data from the canvas
  for(let j=0; j<dimY; j++) {
    for (let i = 0; i < dimX; i++) {
      const n =  (j*(dimY)  +i)
      const nn = (j*(dimY+1)+i)
      const col = noise[i * dimY + j] * 255
      const v1 = geo.vertices[nn]
      v1.z = map(col,0,255,-10,10) //map from 0:255 to -10:10
      // if(v1.z > 2.5) v1.z *= 1.3 //exaggerate the peaks
      v1.x += map(Math.random(),0,1,-0.3,0.3) //jitter x
      v1.y += map(Math.random(),0,1,-0.3,0.3) //jitter y
    }
  }

  geo.faces.forEach(f=>{
    //get three verts for the face
    const a = geo.vertices[f.a]
    const b = geo.vertices[f.b]
    const c = geo.vertices[f.c]

    //if average is below water, set to 0
    //alt: color transparent to show the underwater landscape
    const avgz = (a.z+b.z+c.z)/3
    if(avgz < 0) {
        a.z = -0.1
        b.z = -0.1
        c.z = -0.1
    }

    //assign colors based on the highest point of the face
    const max = Math.max(a.z,Math.max(b.z,c.z))
    if(max <=0)   return f.color.set(0x1111ff)
    if(max <=1.5) return f.color.set(0xfcd046)
    if(max <=3.5) return f.color.set(0x00aa00)
    if(max <=5)   return f.color.set(0x007700)

    //otherwise, return white
    f.color.set('white')
  })

  geo.colorsNeedUpdate = true
  geo.verticesNeedUpdate = true
  //required for flat shading
  geo.computeFlatVertexNormals()

  var material = new THREE.MeshLambertMaterial( {
    vertexColors: THREE.VertexColors,
    flatShading: true,
  } );

  return (
    <mesh material={material} geometry={geo} rotation={[Math.PI * -0.5, 0, Math.PI ]} />
  )

  // var material = new THREE.MeshPhongMaterial( {
  //   vertexColors: THREE.VertexColors,
  //   flatShading: true,
  //   polygonOffset: true,
  //   polygonOffsetFactor: 1,
  //   polygonOffsetUnits: 1
  // } );

  // return (
  //   <>
  //     <mesh material={material} geometry={geo} rotation={[Math.PI * -0.5, 0, Math.PI ]} />
  //     <lineSegments rotation={[Math.PI * -0.5, 0, Math.PI ]}>
  //       <edgesGeometry attach="geometry" args={geo} />
  //       <lineBasicMaterial color="green" attach="material" />
  //     </lineSegments>
  //   </>
  // )

}

const CubeLandscape = () => {
  return (
    <group>
      <Forest />
      <Sea />
      <VectorLandscape />
    </group>
  )
}

export default CubeLandscape