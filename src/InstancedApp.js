import React, { Suspense } from 'react'
import { Canvas } from 'react-three-fiber'
// import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from '@react-three/postprocessing'

import { OrbitControls } from '@react-three/drei/OrbitControls'
import { Stats } from '@react-three/drei/Stats'

import { GamepadProvider } from './components/Gamepad'
// import CubeLandscape from './components/CubeLandscape'
import VectorLandscape from './components/VectorLandscape'
import Player from './components/Player'

import './App.css'

const InstancedApp = () => (
  <Canvas
    gl={{ antialias: false, alpha: false }}
    camera={{ position: [0, 45, 45], near: 1, far: 500 }}
    onCreated={({ gl }) => gl.setClearColor('black')}>
    <ambientLight color={'#444444'} />
    <pointLight position={[50, 50, 50]} intensity={1.0} />
    <GamepadProvider>
      <Suspense fallback={null}>
        <Player />
      </Suspense>
    </GamepadProvider>
    <Suspense fallback={null}>
      <VectorLandscape />
    </Suspense>
    {/* <OrbitControls enableZoom={false} minPolarAngle={0.5} maxPolarAngle={1.2} /> */}
    <Stats />
    {/* <EffectComposer> */}
      {/* <DepthOfField focusDistance={0} focalLength={0.5} bokehScale={3} height={120} /> */}
      {/* <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} /> */}
      {/* <Noise opacity={0.02} /> */}
      {/* <Vignette eskil={false} offset={0.1} darkness={1.1} /> */}
    {/* </EffectComposer> */}
  </Canvas>
)


export default InstancedApp;
