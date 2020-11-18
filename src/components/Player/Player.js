import React, { useRef, useContext } from 'react'
import * as THREE from 'three'
import { useFrame } from 'react-three-fiber'
import { GamepadContext } from '../Gamepad.js';
import { Camera } from './Camera.js'
import Jet from './Jet.js'

import useStore from '../../gameState'

export default function Model(props) {

  const updateTelemetry = useStore( state => state.updateTelemetry )

  const ref = useRef()
  const planeref = useRef()
  const camref = useRef()
  const upAxis = new THREE.Vector3(0,1,0)
  const wingAxis = new THREE.Vector3(1,0,0)

  const [ gamepad, ] = useContext(GamepadContext)

  useFrame(({ clock, camera }) => {

    if (gamepad) {

      if (gamepad.axes[0]) {
        planeref.current.rotation.z = gamepad.axes[0] * 0.5 // roll
        ref.current.rotateOnWorldAxis(upAxis, THREE.MathUtils.degToRad((gamepad.axes[0] * -1)))
      }

      if (gamepad.axes[1]) {
        ref.current.rotateOnAxis(wingAxis, THREE.MathUtils.degToRad(gamepad.axes[1]))
      } 
      // else {
      //   if (ref.current.rotation.x < -0.05 || ref.current.rotation.x > 0.05) {
      //     console.log(ref.current.rotation.x)
      //     ref.current.rotateOnAxis(wingAxis, -0.01 * Math.sign(ref.current.rotation.x))
      //   } else {
      //     ref.current.rotation.x = 0
      //   }
      // }

      if (gamepad.axes[2]) {
        camref.current.rotation.y += gamepad.axes[2] * 0.1
      }
      if (gamepad.axes[3]) {
        camref.current.rotation.z += gamepad.axes[3] * 0.1
      }

      ref.current.translateZ( gamepad.buttons[7].value * 0.5 ) // thrust

      // Update world data
      const planePos = new THREE.Vector3()
      planeref.current.getWorldPosition(planePos);

      const playerRot = new THREE.Quaternion()
      ref.current.getWorldQuaternion(playerRot);

      updateTelemetry({
        altitude: planePos.y,
        longitude: planePos.x,
        latitude: planePos.z,
        yaw: playerRot.y,
        pitch: playerRot.x,
        thrust: gamepad.buttons[7].value
      })

    }

    camera.lookAt(ref.current.position)

  })

  return (
    <group ref={ref} position={[0, 11, 0]}>
      <group ref={camref} position={[0, 0, 0]}>
        <Camera position={[0, 20, -45]} near={1} far={1000} />
      </group>
      <group ref={planeref} position={[0, 0, 0]}>
        <Jet />
      </group>
    </group>
  )
}
