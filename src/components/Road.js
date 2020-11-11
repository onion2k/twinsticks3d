import React from 'react'
import * as THREE from 'three'


export default function Road(props) {

  const curveHandles = [];
  const boxGeometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
  const boxMaterial = new THREE.MeshBasicMaterial( 0x99ff99 );

  const curves = [
    [
      { x: 1, y: 2, z: - 1 },
      { x: 1, y: 2, z: 1 },
      { x: - 1, y: 2, z: 1 },
      { x: - 1, y: 2, z: - 1 },
    ],
  ].map( function ( curvePoints ) {

    const curveVertices = curvePoints.map( function ( handlePos ) {

      const handle = new THREE.Mesh( boxGeometry, boxMaterial );
      handle.position.copy( handlePos );
      // curveHandles.push( handle );
      return handle.position;

    } );

    const curve = new THREE.CatmullRomCurve3( curveVertices );
    curve.curveType = "centripetal";
    curve.closed = true;

    const points = curve.getPoints( 50 );

    const line = <lineLoop geometry={new THREE.BufferGeometry().setFromPoints( points )} material={new THREE.LineBasicMaterial( { color: 0xff0000 } )} scale={[20,5,20]} />

    return {
      curve,
      line
    };

  });

  return curves[0].line;

}
