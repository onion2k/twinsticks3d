/*
auto-generated by: https://github.com/pmndrs/gltfjsx
GOOGLE_processor_version: 294144208
*/
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei/useGLTF'

export default function Model(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/1397 Jet.gltf')
  return (
    <group ref={group} {...props}>
      <group position={[-0.46, 9.01, -12.99]}>
        <group position={[0.46, -9.01, 12.99]}>
          <mesh material={materials.Mat} geometry={nodes['node-0'].geometry} />
        </group>
      </group>
      <primitive object={nodes['']} />
      <primitive object={nodes.keyLightNode} />
    </group>
  )
}

useGLTF.preload('/1397 Jet.gltf')
