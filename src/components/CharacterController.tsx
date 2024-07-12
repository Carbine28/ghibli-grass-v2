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
  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED } = useControls("Character Controls", {
    WALK_SPEED: { value: 0.8, min: 0.1, max: 4, step: 0.1},
    RUN_SPEED: { value: 1.2, min: 0.9, max: 5, step: 0.1},
    ROTATION_SPEED: {
      value: degToRad(0.5),
      min: degToRad(0.1),
      max: degToRad(5),
      step: degToRad(0.1),
    }
  })
  const rb = useRef<RapierRigidBody>(null!);
  const container = useRef<THREE.Group>(null!);
  const character = useRef<THREE.Group>(null!);

  const [,get] = useKeyboardControls();
  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);

  const cameraControlsRef = useRef<CameraControls>(null);

  const isCameraPressed = useRef(false);

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

    // handleMovement(rb, rotationTarget, characterRotationTarget, get, RUN_SPEED, WALK_SPEED, ROTATION_SPEED)
    if(rb.current){
      const vel = rb.current.linvel();
      
      const movement = {
        x: 0,
        z: 0
      };
  
      if (get().forward) movement.z = 1;
      if (get().backward) movement.z = -1;
      if (get().left) movement.x = -1;
      if (get().right) movement.x = 1;
      
      const speed = get().run ? RUN_SPEED : WALK_SPEED;
      
      const rbPosition = rb.current.translation()

  
      if(movement.x !== 0 || movement.z !== 0) {
        // characterRotationTarget.current = Math.atan2(movement.x, movement.z)
        // * Calculate the direction the player should move in.
        const cameraFowardDirection = new THREE.Vector3(rbPosition.x - camera.position.x, rbPosition.y - camera.position.y, rbPosition.z - camera.position.z);
        cameraFowardDirection.normalize();
        // characterRotationTarget.current = Math.atan2(moveDirection.x , moveDirection.z);

        // vel.x = Math.sin(rotationTarget.current + characterRotationTarget.current) * speed;
        // vel.z = Math.cos(rotationTarget.current + characterRotationTarget.current) * speed;
        vel.x = cameraFowardDirection.x * speed;
        vel.z = cameraFowardDirection.z * speed;

        characterRotationTarget.current = Math.atan2(cameraFowardDirection.x, cameraFowardDirection.z);
      }

      // Rotates Character model
      character.current.rotation.y = lerpAngle(
        character.current.rotation.y,
        characterRotationTarget.current,
        0.1
      )
  
      rb.current.setLinvel(vel, true);
      cameraControlsRef.current?.setTarget(rbPosition.x, rbPosition.y, rbPosition.z, true);
    } 
    

    // // * CAMERA
    // container.current.rotation.y = lerpAngle(
    //   container.current.rotation.y,
    //   rotationTarget.current,
    //   0.1
    // )

    // // cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
    // // camera.position.lerp(cameraWorldPosition.current, 0.1);

    // if(cameraTarget.current){
    //   cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
    //   cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
    // }
  })

  return (
  <group position={[0,1,0]}>
    <CameraControls ref={cameraControlsRef} dollySpeed={0} minZoom={0} maxZoom={0} minDistance={2.5} maxDistance={5} minPolarAngle={1} maxPolarAngle={1.}/>
    <RigidBody lockRotations colliders={false} ref={rb}>
      <group ref={container}>
        <group ref={character}>
          <BigTotoro/>  
        </group>
      </group>
      <PerspectiveCamera makeDefault position={[0,2,-3]} />
      <CapsuleCollider args={[0.01, 0.25]}/>
    </RigidBody>
  </group>
  )
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleMovement(rb: MutableRefObject<RapierRigidBody>, rotationTarget: MutableRefObject<number>, characterRotationTarget: MutableRefObject<number>, get: any,
  RUN_SPEED: number, WALK_SPEED: number, ROTATION_SPEED: number, 
) {
  if(rb.current){
    const vel = rb.current.linvel();

    const movement = {
      x: 0,
      z: 0
    };

    if(get().forward) {
      movement.z = 1;
    } 
    if(get().backward) {
      movement.z = -1;
    }
    

    const speed = get().run ? RUN_SPEED : WALK_SPEED;

    if(get().left) {
      movement.x = 1;
    }
    if(get().right) {
      movement.x = -1;
    }

    if(movement.x !== 0) {
      rotationTarget.current += ROTATION_SPEED * movement.x;
    }


    if(movement.x !== 0 || movement.z !== 0) {
      characterRotationTarget.current = Math.atan2(movement.x, movement.z)
      vel.x = Math.sin(rotationTarget.current) * speed;
      vel.z = Math.cos(rotationTarget.current) * speed;
    }

    rb.current.setLinvel(vel, true);
  }
}