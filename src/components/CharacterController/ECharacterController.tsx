import { useEffect, useRef } from "react";
import * as THREE from 'three'
import { useControls } from 'leva';
import Ecctrl, { EcctrlProps } from 'ecctrl';
import { BigTotoro } from "../totoro/BigTotoro";
import { KeyboardControls, PositionalAudio, useKeyboardControls } from "@react-three/drei";
import grassRunSfx from '/assets/audio/runGrassSfx.mp3';
import CharacterAudioController from "./CharacterAudioController";
import { EVENTS } from "../../data/EVENTS";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ['Shift']},
]

export function ECharacterController(props) {
  const posAudioRef = useRef<THREE.PositionalAudio>(null!);
  const ecctrlRef = useRef<EcctrlProps>(null!);
  // const { WALK_SPEED, RUN_SPEED } = useControls("Character Controls", {
  //   WALK_SPEED: { value: 1.7, min: 0.1, max: 4, step: 0.1},
  //   RUN_SPEED: { value: 3.3, min: 0.9, max: 5, step: 0.1}

  useEffect(() => {
    const handleTransitioning = () => {
      ecctrlRef.current.camCollision = false;
      window.setTimeout(() => {
        ecctrlRef.current.camCollision = true;
      }, 2000);
    }
    window.addEventListener(EVENTS.transitioning, handleTransitioning);
    return () => {
      window.removeEventListener(EVENTS.transitioning, handleTransitioning);
    }
  }, [])
  
  return (
  <group {...props} position={[0,0,0]}>
    {/* <PerspectiveCamera makeDefault/> */}
    <KeyboardControls map={keyboardMap}>
      <Ecctrl 
        ref={ecctrlRef}
        camInitDis={-2.5}
        camMaxDis={-3.5}
        capsuleHalfHeight={0.2}
        camCollision={false}
        autoBalance={false}
      >
        {/* <PerspectiveCamera ref={per} fov={75} near={0.1} far={1000} /> */}
        <PositionalAudio ref={posAudioRef} url={grassRunSfx}/>
        <CharacterAudioController positionalAudioRef={posAudioRef}/>
        <BigTotoro/>
      </Ecctrl>
    </KeyboardControls>
  </group>
  )
}
