import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei/useGLTF'
import { useFrame } from 'react-three-fiber'

export default function LightAircraft(props) {
  const group = useRef()
  const propRef = useRef()
  const { nodes, materials } = useGLTF('models/plane/small-airplane-v3.gltf')

  useFrame(()=>{
    propRef.current.rotation.z += 0.1
  })

  return (
    <group ref={group} {...props}>
      <group position={[-0.02, 0.5, 1.3]} rotation={[-Math.PI, 0, -Math.PI]}>
        <group position={[0.02, -0.5, -1.3]}>
          <mesh material={materials.White} geometry={nodes['buffer-0-mesh-0'].geometry} />
          <mesh material={materials.Red} geometry={nodes['buffer-0-mesh-0_1'].geometry} />
          <mesh material={materials.Gray} geometry={nodes['buffer-0-mesh-0_2'].geometry} />
          <mesh ref={propRef} material={materials.Black} geometry={nodes['buffer-0-mesh-0_3'].geometry} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('models/plane/small-airplane-v3.gltf')
