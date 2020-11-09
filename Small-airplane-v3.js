/*
auto-generated by: https://github.com/pmndrs/gltfjsx
GOOGLE_processor_version: 294144208
*/
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei/useGLTF'

export default function Model(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/small-airplane-v3.gltf')
  return (
    <group ref={group} {...props}>
      <group position={[-0.02, 0.5, 1.3]} rotation={[-Math.PI, 0, -Math.PI]}>
        <group position={[0.02, -0.5, -1.3]}>
          <mesh material={materials.White} geometry={nodes['buffer-0-mesh-0_0'].geometry} />
          <mesh material={materials.Red} geometry={nodes['buffer-0-mesh-0_1_1'].geometry} />
          <mesh material={materials.Gray} geometry={nodes['buffer-0-mesh-0_2_2'].geometry} />
          <mesh material={materials.Black} geometry={nodes['buffer-0-mesh-0_3_3'].geometry} />
        </group>
      </group>
      <primitive object={nodes['']} />
      <primitive object={nodes.keyLightNode} />
    </group>
  )
}

useGLTF.preload('/small-airplane-v3.gltf')