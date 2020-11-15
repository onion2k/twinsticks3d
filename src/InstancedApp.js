import React, { Suspense } from 'react'
import { Canvas, useThree } from 'react-three-fiber'
import { CubeTextureLoader } from "three";
// import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from '@react-three/postprocessing'

import { OrbitControls } from '@react-three/drei/OrbitControls'
import { Stats } from '@react-three/drei/Stats'

import { GamepadProvider } from './components/Gamepad'
// import CubeLandscape from './components/CubeLandscape'
import VectorLandscape from './components/VectorLandscape'
import Player from './components/Player'

import './App.css'

const SkyBox = () => {
  const { scene } = useThree();
  const loader = new CubeTextureLoader();

  const texture = loader.load([
    "/sky/yellowcloud_lf.jpg",
    "/sky/yellowcloud_rt.jpg",
    "/sky/yellowcloud_up.jpg",
    "/sky/yellowcloud_dn.jpg",
    "/sky/yellowcloud_ft.jpg",
    "/sky/yellowcloud_bk.jpg",
  ]);

  // Set the scene background property to the resulting texture.
  scene.background = texture;
  return null;
};

const InstancedApp = () => (
  <Canvas
    style={{height:600,width:800}}
    gl={{ antialias: false, alpha: false }}
  >
    {/* <ambientLight color={'#111111'} /> */}
    <pointLight position={[50, 50, 50]} intensity={0.25} />
    <directionalLight color={'#ffffff'} intensity={0.15} position={[0, 1, 1]} />
    {/* <fogExp2 attach="fog" args={['white', 0.004]} /> */}
    <GamepadProvider>
      <Suspense fallback={null}>
        <Player />
      </Suspense>
    </GamepadProvider>
    <Suspense fallback={null}>
      <VectorLandscape />
    </Suspense>
    <SkyBox />
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
