import React, { useRef, useContext } from 'react'
import { useFrame } from 'react-three-fiber'
import { GamepadContext } from './Gamepad.js';
import { Camera } from './Camera.js'
import Jet from './Jet.js'
// import LightAircraft from './LightAircraft.js'

export default function Model(props) {
  const ref = useRef()
  const planeref = useRef()
  const camref = useRef()
  const [ gamepad, ] = useContext(GamepadContext)

  useFrame(({ clock, camera }) => {
    if (gamepad) {      
      if (gamepad.axes[0]) {
        planeref.current.rotation.z = gamepad.axes[0] * 0.5 // roll
        ref.current.rotation.y += gamepad.axes[0] * -0.02
      }

      if (gamepad.axes[2]) {
        camref.current.rotation.y += gamepad.axes[2] * 0.1
      }
      if (gamepad.axes[3]) {
        camref.current.rotation.z += gamepad.axes[3] * 0.1
      }

      ref.current.translateZ( 0.2 + (gamepad.buttons[7].value * 0.5) ) // thrust
    }

    camera.lookAt(ref.current.position)
  })

  return (
    <group ref={ref} {...props}>
      <group ref={camref} position={[0, 0, 0]}>
        <Camera position={[0, 45, -45]} near={1} far={500} />
      </group>
      <group ref={planeref} position={[0, 9.0, 0]}>
        <Jet />
      </group>
    </group>
  )
}
