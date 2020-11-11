import React from 'react'
import * as THREE from 'three'


export default function Road(props) {

  const curveHandles = [];
  const boxGeometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
  const boxMaterial = new THREE.MeshBasicMaterial( 0x99ff99 );

  const curvePoints = [
    { x: 20, y: 5, z: -15 },
    { x: 15, y: 10, z: 20 },
    { x: -25, y: 25, z: 20 },
    { x: -20, y: 10, z: -20 },
  ]

  const curveVertices = curvePoints.map( function ( handlePos ) {

    const handle = new THREE.Mesh( boxGeometry, boxMaterial );
    handle.position.copy( handlePos );
    return handle.position;

  } );

  const curve = new THREE.CatmullRomCurve3( curveVertices );
  curve.curveType = "centripetal";
  curve.closed = true;

  const material = new THREE.MeshLambertMaterial( { color: 0x00ff00, flatShading: true } );
  const extruded = new THREE.TubeGeometry( curve, 100, 2, 4, true );
  extruded.computeFlatVertexNormals()

  const mesh = <mesh geometry={extruded} material={material} />

  return mesh

    // return <lineLoop geometry={new THREE.BufferGeometry().setFromPoints( points )} material={new THREE.LineBasicMaterial( { color: 0xff0000 } )} scale={[20,5,20]} />;

}





// const shape = new THREE.Shape();
// shape.moveTo( 0,0 );
// shape.lineTo( 0, width );
// shape.lineTo( length, width );
// shape.lineTo( length, 0 );
// shape.lineTo( 0, 0 );

// const extrudeSettings = {
// 	steps: 2,
// 	depth: 16,
// 	bevelEnabled: true,
// 	bevelThickness: 1,
// 	bevelSize: 1,
// 	bevelOffset: 0,
// 	bevelSegments: 1
// };

// const geometry = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const mesh = new THREE.Mesh( geometry, material ) ;
// scene.add( mesh );