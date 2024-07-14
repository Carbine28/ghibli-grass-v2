import { forwardRef,useEffect,useImperativeHandle, useRef } from "react";
import * as THREE from 'three'
import { useControls } from 'leva';
import Ecctrl from 'ecctrl';
import { BigTotoro } from "../totoro/BigTotoro";
import { RapierRigidBody } from "@react-three/rapier";
import { KeyboardControls, PerspectiveCamera, PositionalAudio, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useGlobalStore } from "../../store/GlobalStore";
import grassRunSfx from '/assets/audio/runGrassSfx.mp3';
import CharacterAudioController from "./CharacterAudioController";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  // { name: "jump", keys: ["Space"] },
  { name: "run", keys: ['Shift']},
]

function ECharacterController(props, ref) {
  const group = useRef<THREE.Group>(null);
  useImperativeHandle(ref, () => (
    ref = rb
  ))
  const rb = useRef<RapierRigidBody>(null);
  const per = useRef<THREE.PerspectiveCamera>(null!);
  // const { WALK_SPEED, RUN_SPEED } = useControls("Character Controls", {
  //   WALK_SPEED: { value: 1.7, min: 0.1, max: 4, step: 0.1},
  //   RUN_SPEED: { value: 3.3, min: 0.9, max: 5, step: 0.1}



  const posAudioRef = useRef<THREE.PositionalAudio>(null!);

  const { set } = useThree(({ get, set }) => ({ get, set }));
  const { experienceStarted} = useGlobalStore();

  // useEffect(() => {
  //   if(experienceStarted) {
  //     posAudioRef.current.play();
  //   }
  // }, [experienceStarted])

  
  return (
  <group ref={group} position={[0,0,0]}>
    {/* <PerspectiveCamera makeDefault/> */}
    <KeyboardControls map={keyboardMap}>
      <Ecctrl ref={rb}
        camInitDis={-2.5}
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

const ForwardedECharacterController = forwardRef(ECharacterController);

export default ForwardedECharacterController;