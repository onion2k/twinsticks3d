import React, { Suspense } from 'react'
import { Canvas, useThree } from 'react-three-fiber'
import { CubeTextureLoader } from "three";
// import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import useStore from './gameState'

// import { OrbitControls } from '@react-three/drei/OrbitControls'
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
    "/sky/bluecloud_lf.jpg",
    "/sky/bluecloud_rt.jpg",
    "/sky/bluecloud_up.jpg",
    "/sky/bluecloud_dn.jpg",
    "/sky/bluecloud_ft.jpg",
    "/sky/bluecloud_bk.jpg",
  ]);

  // Set the scene background property to the resulting texture.
  scene.background = texture;
  return null;
};

const Alt = () => {

  const altitude = useStore(state => state.altitude)

  return (
    <div>Altitude:
      <div style={{ width: '300px', height: '10px', padding: '1px', backgroundColor: 'grey' }}>
        <div style={{ height: '8px', width: Math.floor(altitude * 10)+'px', backgroundColor: 'red' }}></div>
      </div>
    </div>)

}

const Thrust = () => {

  const thrust = useStore(state => state.thrust)

  return (
    <div>Thrust:
      <div style={{ width: '300px', height: '10px', padding: '1px', backgroundColor: 'grey' }}>
        <div style={{ height: '8px', width: Math.floor(thrust * 300)+'px', backgroundColor: 'green' }}></div>
      </div>
    </div>)

}

const InstancedApp = () => (
  <div className="wrapper">
    <div className="game">
      <Canvas
        style={{height:600,width:800}}
        gl={{ antialias: false, alpha: false }}
      >
        {/* <ambientLight color={'#111111'} /> */}
        <directionalLight color={'#ffffff'} intensity={0.5} position={[0, 1, 1]} />
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
    </div>
    <div className="hud">
      <Thrust />
      <Alt />
    </div>
  </div>
)

export default InstancedApp;
