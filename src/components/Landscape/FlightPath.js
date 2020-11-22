import React, { useRef } from 'react'
import { useFrame } from "react-three-fiber";
import * as THREE from 'three'

function map(val, smin, smax, emin, emax) {
  const t =  (val-smin)/(smax-smin)
  return (emax-emin)*t + emin
}

const GateShader = {
  uniforms: {
    u_time: { type: "f", value: 0 },
  },
  vertexShader: `
    precision mediump float;
    varying vec2 vUv;
    void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
        gl_Position = projectionMatrix * mvPosition;
        vUv = uv;
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float u_time;

    void main() {
      vec2 uv = vUv;
      float cb = floor((uv.x+u_time)*40.) + floor(uv.y*4.);
      gl_FragColor = vec4(mod(cb, 2.0),mod(cb, 2.0),mod(cb, 2.0),1.);
    }
  `
};

const Gate = (props) => {
  const ref = useRef()

  useFrame(({ clock }) => {
    // ref.current.rotation.x = ref.current.rotation.y += 0.01;
    // const u_time = ref.current.material.uniforms.u_time.value;
    ref.current.material.uniforms.u_time.value = clock.oldTime * 0.0001;
  });

  return (
    <mesh ref={ref} {...props}>
      <torusGeometry attach="geometry" args={[16, 0.75, 16, 48]} />
      <shaderMaterial
        attach="material"
        args={[GateShader]}
      />
    </mesh>
  )
}

export default function FlightPath(props) {

  const { noise, dimX, dimY } = props

  const boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
  const boxGeometry2 = new THREE.BoxGeometry( 0.5, 20, 0.5 );
  const material = new THREE.MeshLambertMaterial( { color: 0x00ff00, flatShading: true } );
  const material2 = new THREE.MeshLambertMaterial( { color: 0xff0000, flatShading: true } );

  const curvePoints = [
    [
      { x: 40, z: -40 },
      { x: 40, z: 0 },
      { x: 40, z: 40 },
      { x: 0, z: 40 },
      { x: -40, z: 40 },
      { x: -40, z: 0 },
      { x: -40, z: -40 },
      { x: 0, z: -40 },
    ],
    [
      { x: 60, z: -60 },
      { x: 60, z: 0 },
      { x: 60, z: 60 },
      { x: 0, z: 60 },
      { x: -60, z: 60 },
      { x: -60, z: 0 },
      { x: -60, z: -60 },
      { x: 0, z: -60 },
    ]
  ]

  const curveGeoPoints = [[],[]]
  const nPoints = 200;

  const curves = curvePoints.map((curveLoop, i) => {
    const curvePosts = []

    const curveVertices = curveLoop.map( function ( handlePos, i ) {
  
      const a = noise[(dimX * 0.5 - handlePos.x) * dimY + (dimY * 0.5 - handlePos.z)] * 255;
  
      const col = 10 + map(a,0,255,-10,10) + 10
  
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

    // lerp the curve in to n points
    curveGeoPoints[i] = curve.getPoints(nPoints)

    const extruded = new THREE.TubeGeometry( curve, 100, 0.2, 5, true );
    extruded.computeFlatVertexNormals()
  
    return (
      <>
        {curvePosts.map(post=>post)}
        <mesh geometry={extruded} material={material} />
      </>
    )
  })

  const curveHelper = []

  const geometry = new THREE.Geometry();
  const helperGeometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
  const material3 = new THREE.MeshPhongMaterial( { color: 0xffff00, side: THREE.DoubleSide } );

  geometry.vertices.push(
    new THREE.Vector3( curveGeoPoints[0][0].x, curveGeoPoints[0][0].y, curveGeoPoints[0][0].z ),
    new THREE.Vector3( curveGeoPoints[1][0].x, curveGeoPoints[1][0].y, curveGeoPoints[1][0].z ),
  )

  for (let x = 0; x < nPoints+1; x=x+2) {

    geometry.vertices.push(
      new THREE.Vector3( curveGeoPoints[0][x].x, curveGeoPoints[0][x].y, curveGeoPoints[0][x].z ),
      new THREE.Vector3( curveGeoPoints[1][x].x, curveGeoPoints[1][x].y, curveGeoPoints[1][x].z ),
    );
    
    geometry.faces.push( new THREE.Face3( x, x+2, x+1 ) );
    geometry.faces.push( new THREE.Face3( x+1, x+2, x+3 ) );

    geometry.computeBoundingSphere();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

  }

  const gates = [
    <Gate position={[50, 18, -50]} rotation={[0,Math.PI * 0.25,0]} />,
    <Gate position={[50, 18, 0]} rotation={[0,Math.PI * 0,0] } />,
    <Gate position={[50, 18, 50]} rotation={[0,Math.PI * -0.25,0] } />,
    <Gate position={[0, 18, 50]} rotation={[0,Math.PI * -0.5,0] } />,
    <Gate position={[-50, 18, 50]} rotation={[0,Math.PI * -0.75,0] } />,
    <Gate position={[-50, 18, 0]} rotation={[0,Math.PI * -1.0,0] } />,
    <Gate position={[-50, 18, -50]} rotation={[0,Math.PI * -1.25,0] } />,
    <Gate position={[0, 18, -50]} rotation={[0,Math.PI * -1.5,0] } />,
  ]

  return (
    <>
      {curves}
      {gates.map(g=>g)}
      <mesh geometry={geometry} material={material3} />
    </>)

  // return curves

  // return <lineLoop geometry={new THREE.BufferGeometry().setFromPoints( points )} material={new THREE.LineBasicMaterial( { color: 0xff0000 } )} scale={[20,5,20]} />;

}
