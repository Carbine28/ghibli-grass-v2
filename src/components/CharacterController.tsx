import { CapsuleCollider, RapierRigidBody, RigidBody} from "@react-three/rapier";
import { BigTotoro } from "./totoro/BigTotoro";
import { MutableRefObject, useRef } from "react";
import * as THREE from 'three'
import { useFrame } from "@react-three/fiber";
import { useControls } from 'leva';
import { OrthographicCamera, PerspectiveCamera, useKeyboardControls } from "@react-three/drei";
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
  const cameraTarget = useRef<THREE.Group>(null!);
  const cameraPosition = useRef<THREE.Group>(null!);

  const cameraWorldPosition = useRef(new THREE.Vector3());
  const cameraLookAtWorldPosition = useRef(new THREE.Vector3());
  const cameraLookAt = useRef(new THREE.Vector3());

  const [,get] = useKeyboardControls();
  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);

  useFrame(({camera}) => {
    // handleMovement(rb, rotationTarget, characterRotationTarget, get, RUN_SPEED, WALK_SPEED, ROTATION_SPEED)
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
        vel.x = Math.sin(rotationTarget.current + characterRotationTarget.current) * speed;
        vel.z = Math.cos(rotationTarget.current + characterRotationTarget.current) * speed;
      }

      character.current.rotation.y = lerpAngle(
        character.current.rotation.y,
        characterRotationTarget.current,
        0.1
      )
  
      rb.current.setLinvel(vel, true);
    }
    

    // * CAMERA
    container.current.rotation.y = THREE.MathUtils.lerp(
      container.current.rotation.y,
      rotationTarget.current,
      0.1
    )
    cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.1);

    if(cameraTarget.current){
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
      
      camera.lookAt(cameraLookAt.current);
    }
  })

  return (
  <group position={[0,1,0]}>
    <RigidBody lockRotations colliders={false} ref={rb}>
      <group ref={container}>
        <group ref={cameraTarget} position-z={1}/>
        <group ref={cameraPosition} position-y={4} position-z={-4}/>
        <group ref={character}>
          <BigTotoro/>  
        </group>
      </group>
      <CapsuleCollider args={[0.10, 0.4]}/>
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