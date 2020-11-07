import React, { useRef, useEffect } from 'react'
import { useThree, useFrame } from 'react-three-fiber'

export function Camera(props) {
  const ref = useRef()
  const { setDefaultCamera } = useThree()
  // Make the camera known to the system
  useEffect(() => void setDefaultCamera(ref.current), [setDefaultCamera])
  // Update it every frame
  useFrame(() => ref.current.updateMatrixWorld())
  return <perspectiveCamera ref={ref} {...props} />
}
