import * as THREE from 'three'
import React, { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei/useGLTF'

function map(val, smin, smax, emin, emax) {
  const t =  (val-smin)/(smax-smin)
  return (emax-emin)*t + emin
}

const tempTrees = new THREE.Object3D()

const trees = [
  ["sequoia/SequoiaTree.gltf", "SequoiaTree_Mat", 0.1],
  ["beech/BeechTree.gltf", "BeechTree_mat", 0.3],
  ["brazilnut/BrazilNutTree.gltf", "BrazilNutTree_mat", 0.3],
  ["larch/LarchTree.gltf", "LarchTree_mat", 0.3],
  ["maple/MapleTree.gltf", "MapleTree_mat", 0.3],
  ["palm/FishtailPalmTree.gltf", "FishtailPalmTree_mat", 0.5],
  ["poplar/PoplarTree.gltf", "PoplarTree_Mat", 0.5],
  ["spruce/SpruceTree.gltf", "SpruceTree_mat", 0.4],
  ["willow/PollardWillowTree.gltf", "PollardWillowTree_mat", 0.4],
  ["pine/PUSHILIN_pine_tree.gltf", "None", 1.5],
  ["pine/tree02.gltf", "Mat", 0.01]
]

const Forest = ({ noise, dimX, dimY }) => {

    const tree = 10
    const basePath = 'models/tree/'
    const modelPath = trees[tree][0]
    const materialName = trees[tree][1]
    const scale = trees[tree][2]

    const { nodes, materials } = useGLTF(`${basePath}${modelPath}`, true)

    console.log(materials)

    const treeGeometry = nodes['node-0'].geometry;
    treeGeometry.scale(scale,scale,scale)

    // const treeGeometry = new THREE.ConeGeometry(1, 2, 4)
    // const material = new THREE.MeshLambertMaterial({ color: 0x88ff88, flatShading: true })

    const ref = useRef()

    useEffect(() => {
      let i = 0
      for (let x = 0; x < dimX; x++) {
        for (let z = 0; z < dimY; z++) {
          const col = noise[x * dimY + z] * 255
          if (col > 170 && col < 200 && Math.random()>0.8) {
            const id = i++
            tempTrees.position.set(
              (dimX/2 - x),
              map(col,0,255,-10,10),
              (dimY/2 - z)
            )
            tempTrees.rotation.y = Math.random() * (Math.PI * 2)
            tempTrees.updateMatrix()
            ref.current.setMatrixAt(id, tempTrees.matrix)
          }
        }
      }
      ref.current.instanceMatrix.needsUpdate = true
    }, [dimX, dimY, noise]);

    return (
      <instancedMesh ref={ref} args={[treeGeometry, materials[materialName], 2500]} />
    )
}

export default Forest;