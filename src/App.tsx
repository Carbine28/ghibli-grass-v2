import { Canvas } from "@react-three/fiber"
import Experience from "./Experience"
import {Loader} from "@react-three/drei"
import { Perf } from 'r3f-perf';
import Intro from "./components/Intro/Intro";
import IntroControls from "./components/Intro/IntroControls";
import Credits from "./credits/Credits";
import { FrameLimiter } from "./FrameRateLimiter";
import { Suspense, useEffect, useState } from "react";
import * as THREE from 'three';
import { EcctrlJoystick } from "ecctrl";
import joystickVs from './components/joystick/Joystick.vs'
import joystickFs from './components/joystick/Joystick.fs'
import joystickTopVs from './components/joystick/JoystickTop.vs'
import joystickTopFs from './components/joystick/JoystickTop.fs'

const EcctrlJoystickControls = () => {
  const [isTouchScreen, setIsTouchScreen] = useState(false)
  useEffect(() => {
    // Check if using a touch control device, show/hide joystick
    if (('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0)) {
      setIsTouchScreen(true)
    } else {
      setIsTouchScreen(false)
    }
  }, [])
  return (
    <>
      {isTouchScreen && <EcctrlJoystick buttonNumber={1} 
      joystickBaseProps={{
        material: new THREE.ShaderMaterial({vertexShader: joystickVs, fragmentShader: joystickFs})
      }} 
      joystickHandleProps={{
        material: new THREE.ShaderMaterial({vertexShader: joystickTopVs, fragmentShader: joystickTopFs})
      }}
    />}
    </>
  )
}

function App() { 
  const [context, setContext] = useState<{
    gl: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.Camera;
    invalidate: () => void;
} | null>(null);

  return (<>
      <EcctrlJoystickControls/>
      <Loader/>
      <Suspense fallback={null}>
        <div style={{zIndex: '999999'}}>
          <Credits/>
          <IntroControls/>
        </div>
      </Suspense>
      <Canvas 
        onCreated={
         ({ gl, scene, camera, invalidate }) => setContext({ gl, scene, camera, invalidate })
        }
      >
        {/* <Perf position='top-left'/> */}
        <color attach={'background'} args={[0.89,1.00,0.80]}/>
        <Intro/>
        <Experience/>
      </Canvas>
      {context && (
        <FrameLimiter
          fps={60}
          gl={context.gl}
          scene={context.scene}
          camera={context.camera}
          invalidate={context.invalidate}
        />
      )}
      
  </>
  )
}

export default App
