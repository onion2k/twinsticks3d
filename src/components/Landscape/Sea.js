import React, { useRef } from 'react'
// import { useFrame } from 'react-three-fiber'
// import "./SeaMaterial"

export default function Sea({ dimX, dimY }) {
  const ref = useRef()

  // useFrame(({ camera, clock}) => {
  //   ref.current.material.time = clock.getElapsedTime()
  // })

  return (
    <mesh ref={ref} rotation={[Math.PI * -0.5, 0, Math.PI ]}>
      <planeBufferGeometry attach="geometry" args={[dimX, dimY, 1, 1]} />
      {/* <seaMaterial attach="material" color="blue" /> */}
      <meshPhongMaterial attach="material" color="#8888ff" />
    </mesh>
  )
}
