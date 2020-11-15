import React from 'react'
import * as THREE from 'three'

function map(val, smin, smax, emin, emax) {
  const t =  (val-smin)/(smax-smin)
  return (emax-emin)*t + emin
}

export default function FlightPath(props) {

  const { noise, dimX, dimY } = props

  const boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
  const boxGeometry2 = new THREE.BoxGeometry( 0.5, 20, 0.5 );
  const material = new THREE.MeshLambertMaterial( { color: 0x00ff00, flatShading: true } );
  const material2 = new THREE.MeshLambertMaterial( { color: 0xff0000, flatShading: true } );

  const curvePoints = [
    { x: 50, z: -50 },
    { x: 50, z: 0 },
    { x: 50, z: 50 },
    { x: 0, z: 50 },
    { x: -50, z: 50 },
    { x: -50, z: 0 },
    { x: -50, z: -50 },
    { x: 0, z: -50 },
  ]

  const curvePosts = []

  const curveVertices = curvePoints.map( function ( handlePos, i ) {

    const a = noise[(dimX * 0.5 - handlePos.x) * dimY + (dimY * 0.5 - handlePos.z)] * 255;

    const col = 10 + map(a,0,255,-10,10)

    const point = new THREE.Vector3(handlePos.x, col, handlePos.z);
    const point2 = new THREE.Vector3(handlePos.x, 0 - (10 - col), handlePos.z);
    curvePosts.push(<mesh key={`node_${i}`} geometry={boxGeometry} material={material} position={point} />)
    curvePosts.push(<mesh key={`post_${i}`} geometry={boxGeometry2} material={material2} position={point2} />)

    return point

  } );

  const curve = new THREE.CatmullRomCurve3( curveVertices );
  curve.curveType = "centripetal";
  curve.tension = 0.4;
  curve.closed = true;

  const extruded = new THREE.TubeGeometry( curve, 200, 0.2, 5, true );
  extruded.computeFlatVertexNormals()

  return (
    <>
      {curvePosts.map(post=>post)}
      <mesh geometry={extruded} material={material} />
    </>
  )

  // return <lineLoop geometry={new THREE.BufferGeometry().setFromPoints( points )} material={new THREE.LineBasicMaterial( { color: 0xff0000 } )} scale={[20,5,20]} />;

}
