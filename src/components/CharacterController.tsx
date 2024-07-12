import { CapsuleCollider, RapierRigidBody, RigidBody} from "@react-three/rapier";
import { BigTotoro } from "./totoro/BigTotoro";
import { MutableRefObject, useEffect, useRef } from "react";
import * as THREE from 'three'
import { useFrame } from "@react-three/fiber";
import { useControls } from 'leva';
import { CameraControls, PerspectiveCamera, useKeyboardControls } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";


const normalizeAngle = (angle: number) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

const lerpAngle = (start: number, end: number, t: number) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += 2 * Math.PI;
    } else {
      end += 2 * Math.PI;
    }
  }

  return normalizeAngle(start + (end - start) * t);
};

export default function CharacterController() {
  const { WALK_SPEED, RUN_SPEED } = useControls("Character Controls", {
    WALK_SPEED: { value: 1.7, min: 0.1, max: 4, step: 0.1},
    RUN_SPEED: { value: 3.3, min: 0.9, max: 5, step: 0.1}
  })
  const rb = useRef<RapierRigidBody>(null!);
  const container = useRef<THREE.Group>(null!);
  const character = useRef<THREE.Group>(null!);

  const [,get] = useKeyboardControls();
  const characterRotationTarget = useRef(0);

  const cameraControlsRef = useRef<CameraControls>(null);

  const isCameraPressed = useRef(false);

  // useEffect(() => {
  //   if(cameraControlsRef.current) {
  //     console.log(cameraControlsRef.current.distance)
  //   }
  // }, [cameraControlsRef])

  useEffect(() => {
    const handleMouseDown = (e) => {
      isCameraPressed.current = true;
    }

    const handleMouseUp= (e) => {
      isCameraPressed.current = false;
    }

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [])

  useFrame(({camera}) => {
    if(rb.current){
      const vel = rb.current.linvel();
      
      const movement = {
        x: 0,
        z: 0
      };
  
      if (get().forward) movement.z = 1;
      if (get().backward) movement.z = -1;
      if (get().left) movement.x = 1;
      if (get().right) movement.x = -1;
      
      const speed = get().run ? RUN_SPEED : WALK_SPEED;
  
      if(movement.x !== 0 || movement.z !== 0) {
        // characterRotationTarget.current = Math.atan2(movement.x, movement.z)
        // * Calculate the direction the player should move in.
        // const cameraFowardDirection = new THREE.Vector3(rbPosition.x - camera.position.x, 0, rbPosition.z - camera.position.z);
        // cameraFowardDirection.normalize();
        const cameraForward = new THREE.Vector3();
        camera.getWorldDirection(cameraForward);
        cameraForward.y = 0;
        cameraForward.normalize();

        const cameraRight = new THREE.Vector3();
        cameraRight.crossVectors(new THREE.Vector3(0,1,0), cameraForward);
        cameraRight.normalize();

        const moveDirection = new THREE.Vector3();
        moveDirection.addScaledVector(cameraForward, movement.z);
        moveDirection.addScaledVector(cameraRight, movement.x);
        moveDirection.normalize();

        vel.x = moveDirection.x * speed;
        vel.z = moveDirection.z * speed;

        characterRotationTarget.current = Math.atan2(moveDirection.x , moveDirection.z);
        
      }
  
      rb.current.setLinvel(vel, true);
      const rbPosition = rb.current.translation()
      cameraControlsRef.current?.setTarget(rbPosition.x, rbPosition.y + 0.5, rbPosition.z, true);
    } 

    // Rotates Character model
    if(character.current){
      character.current.rotation.y = lerpAngle(
        character.current.rotation.y,
        characterRotationTarget.current,
        0.1
      )
    }
  })

  return (
  <group position={[0,1,0]}>
    <CameraControls ref={cameraControlsRef} 
      dollySpeed={0} 
      minDistance={2} maxDistance={6} infinityDolly={false}
      minPolarAngle={40 * THREE.MathUtils.DEG2RAD} maxPolarAngle={80 * THREE.MathUtils.DEG2RAD}
      polarRotateSpeed={0}
      azimuthRotateSpeed={0.5}
      boundaryEnclosesCamera={true}
    />
    <RigidBody lockRotations colliders={false} ref={rb}>
      <group ref={container}>
        <group ref={character}>
          <BigTotoro/>  
        </group>
      </group>
      <PerspectiveCamera makeDefault position={[0,2,-3]} />
      <CapsuleCollider args={[0.2, 0.25]}/>
    </RigidBody>
  </group>
  )
}
