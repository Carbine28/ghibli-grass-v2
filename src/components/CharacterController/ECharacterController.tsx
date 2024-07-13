import { forwardRef,useEffect,useImperativeHandle, useRef } from "react";
import * as THREE from 'three'
import { useControls } from 'leva';
import Ecctrl from 'ecctrl';
import { BigTotoro } from "../totoro/BigTotoro";
import { RapierRigidBody } from "@react-three/rapier";
import { PerspectiveCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useGlobalStore } from "../../store/GlobalStore";

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
  // })

  const { set } = useThree(({ get, set }) => ({ get, set }));
  const { experienceStarted} = useGlobalStore();

  useEffect(() => {
    if(experienceStarted) {
      set({camera: per.current })
    }
  }, [experienceStarted])

  
  return (
  <group ref={group} position={[0,0,0]}>
    {/* <PerspectiveCamera makeDefault/> */}
    <Ecctrl ref={rb}
      camInitDis={-2}
      capsuleHalfHeight={0.2}
    >
      <PerspectiveCamera ref={per}/>
      <BigTotoro/>
    </Ecctrl>
  </group>
  )
}

const ForwardedECharacterController = forwardRef(ECharacterController);

export default ForwardedECharacterController;