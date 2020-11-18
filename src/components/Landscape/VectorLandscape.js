import * as THREE from 'three'
import React from 'react'
import tumult from 'tumult'
import FlightPath from './FlightPath'
import Forest from './Forest'
import Sea from './Sea'
// import VectorLandscapeHelper from './VectorLandscapeHelper'

const dimX = 350;
const dimY = 350;

const octave = 1.1;
const scale = 50;

const noiseFunc = new tumult.Perlin2()
const noise = new Array(dimX * dimY).fill().map(
  (_, i) => 0.5 + noiseFunc.octavate(octave, Math.floor(i / dimX) / scale, Math.floor(i % dimY) / scale)
)

function map(val, smin, smax, emin, emax) {
  const t =  (val-smin)/(smax-smin)
  return (emax-emin)*t + emin
}

function Landscape() {

  const geo = new THREE.PlaneGeometry(dimX, dimY, dimX, dimY+1)

  //assign vert data from the canvas
  for(let j=0; j<dimY; j++) {
    for (let i = 0; i < dimX; i++) {
      const nn = (j*(dimY+1)+i)
      const v1 = geo.vertices[nn]
      const col = noise[i * dimY + j] * 255
      v1.x += map(Math.random(),0,1,-0.1,0.1) //jitter x
      v1.y += map(Math.random(),0,1,-0.1,0.1) //jitter y
      v1.z  = map(col,0,255,-10,10) //map from 0:255 to -10:10
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
  geo.computeFlatVertexNormals()

  var material = new THREE.MeshLambertMaterial( {
    vertexColors: THREE.VertexColors,
    flatShading: true,
    fog: true
  } );

  return (
    <mesh material={material} geometry={geo} rotation={[Math.PI * 0.5, Math.PI, 0 ]} />
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

const VectorLandscape = () => {
  return (
    <group>
      <Forest noise={noise} dimX={dimX} dimY={dimY} />
      <FlightPath noise={noise} dimX={dimX} dimY={dimY} />
      <Sea dimX dimY />
      {/* <VectorLandscapeHelper noise={noise} dimX={dimX} dimY={dimY} /> */}
      <Landscape />
    </group>
  )
}

export default VectorLandscape
