import * as THREE from 'three'
import React from 'react'

function map(val, smin, smax, emin, emax) {
  const t =  (val-smin)/(smax-smin)
  return (emax-emin)*t + emin
}

const VectorLandscapeHelper = ({ noise, dimX, dimY }) => {
  const helperGeometry = new THREE.SphereGeometry( 0.2, 16, 16 );
  const helperMaterial = new THREE.MeshLambertMaterial( { color: 0xffff00 } );
  const helpers = new Array()
  const div = 5
  for(let j=0; j< Math.floor(dimY/div); j++) {
    for (let i = 0; i < Math.floor(dimX/div); i++) {
      const n =  ((i * div) * dimY + (j * div))
      const col = noise[n] * 255
      const point = new THREE.Vector3(dimX * 0.5 - i * div, 0.2 + map(col,0,255,-10,10), dimY * 0.5 - j * div);
      helpers[n] = (<mesh geometry={helperGeometry} material={helperMaterial} position={point} />)
    }
  }

  return helpers.map(post=>post)

}

export default VectorLandscapeHelper;