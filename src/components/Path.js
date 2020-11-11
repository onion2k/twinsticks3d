import React from 'react'
import * as THREE from 'three'

export default function Road(props) {

  const boxGeometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
  const material = new THREE.MeshLambertMaterial( { color: 0x00ff00, flatShading: true } );

  const curvePoints = [
    { x: 30, y: 2, z: -25 },
    { x: 25, y: 2, z: 30 },
    { x: 0, y: 12, z: 35 },
    { x: -35, y: 2, z: 30 },
    { x: -30, y: 2, z: -30 },
  ]

  const curveVertices = curvePoints.map( function ( handlePos ) {

    const handle = new THREE.Mesh( boxGeometry, material );
    handle.position.copy( handlePos );
    return handle.position;

  } );

  const curve = new THREE.CatmullRomCurve3( curveVertices );
  curve.curveType = "centripetal";
  curve.closed = true;

  const extruded = new THREE.TubeGeometry( curve, 200, 0.4, 5, true );
  extruded.computeFlatVertexNormals()

  return <mesh geometry={extruded} material={material} />

  // return <lineLoop geometry={new THREE.BufferGeometry().setFromPoints( points )} material={new THREE.LineBasicMaterial( { color: 0xff0000 } )} scale={[20,5,20]} />;

}
