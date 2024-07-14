import { CapsuleCollider, RapierRigidBody, RigidBody} from "@react-three/rapier";
import { BigTotoro } from "./totoro/BigTotoro";
import { forwardRef, MutableRefObject, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from 'three'
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from 'leva';
import { CameraControls, OrbitControls, PerspectiveCamera, useKeyboardControls } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import { useGlobalStore } from "../store/GlobalStore";


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

function CharacterController(props, ref) {
  useImperativeHandle(ref, () => (
    ref = rb
  ))
  const { WALK_SPEED, RUN_SPEED } = useControls("Character Controls", {
    WALK_SPEED: { value: 1.7, min: 0.1, max: 4, step: 0.1},
    RUN_SPEED: { value: 3.3, min: 0.9, max: 5, step: 0.1}
  })
  const rb = useRef<RapierRigidBody>(null!);
  const container = useRef<THREE.Group>(null!);
  const character = useRef<THREE.Group>(null!);

  const [,get] = useKeyboardControls();
  const characterRotationTarget = useRef(0);

  const cameraTargetRef = useRef<THREE.Group>(null);
  const cameraTargetGroup = useRef<THREE.Group>(null);
  const lastMouseMove = useRef({x: 0, y: 0});
  const theta = useRef(0); // Azimuthal angle
  const phi = useRef(Math.PI / 4); // Polar angle
  const radius = 5;

  // const { set } = useThree(({ get, set }) => ({ get, set }));
  // const { experienceStarted} = useGlobalStore();

  // useEffect(() => {
  //   if(experienceStarted) {
  //     set({camera: })
  //   }
  // }, [experienceStarted])

  const isCameraPressed = useRef(false);
  useEffect(() => {
    const handleMouseDown = (e) => {
      isCameraPressed.current = true;
      lastMouseMove.current = {x: e.clientX, y: e.clientY}
    }

    const handleMouseUp= (e) => {
      isCameraPressed.current = false;
    }

    const handleMouseMove = (e) => {
      if(isCameraPressed.current && cameraTargetGroup && cameraTargetGroup.current){
        const deltaX = e.clientX - lastMouseMove.current.x;
        const deltaY = e.clientY - lastMouseMove.current.y;
        lastMouseMove.current = {x: e.clientX, y: e.clientY}
         // Update spherical coordinates based on delta
         theta.current -= deltaX * 0.002; // Yaw (horizontal rotation)
         phi.current -= deltaY * 0.002; // Pitch (vertical rotation)
 
         // Clamp phi to avoid flipping
         phi.current = Math.max(0.1, Math.min(Math.PI - 0.1, phi.current));

        // cameraTargetGroup.current.rotation.y -= deltaX * 0.002;
        // cameraTargetGroup.current.rotation.x -= deltaY * 0.002;
        // cameraTargetGroup.current.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraTargetGroup.current.rotation.x)); // Limit vertical rotation)
        // cameraTargetGroup.current.rotation.z = 0; // ! Lock the roll axis or face the consequences
      }
    }

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [])


  useFrame(({camera}) => {
    if(rb.current){
      const vel = rb.current.linvel();
      
      const movement = { x: 0, z: 0};
      if (get().forward) movement.z = 1;
      if (get().backward) movement.z = -1;
      if (get().leftward) movement.x = 1;
      if (get().rightward) movement.x = -1;
      
      const speed = get().run ? RUN_SPEED : WALK_SPEED;
      if(movement.x !== 0 || movement.z !== 0) {
        // * Calculate the direction the player should move in.
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

        if (moveDirection.length() > 0) {
          moveDirection.normalize();
        }
        vel.x = moveDirection.x * speed;
        vel.z = moveDirection.z * speed;

        characterRotationTarget.current = Math.atan2(moveDirection.x , moveDirection.z);
      } else {
        vel.x = 0;
        vel.z = 0;
      }
  
      rb.current.setLinvel(vel, true);
      const rbPosition = rb.current.translation();
     // Calculate the new camera position
      const x = rbPosition.x + radius * Math.sin(phi.current) * Math.sin(theta.current);
      const y = rbPosition.y + radius * Math.cos(phi.current);
      const z = rbPosition.z + radius * Math.sin(phi.current) * Math.cos(theta.current);
      camera.position.set(x,y,z);
      camera.lookAt(rbPosition.x, rbPosition.y, rbPosition.z)
      camera.updateProjectionMatrix();
      // const rbPosition = rb.current.translation()
      // // const tRB = new THREE.Vector3(rbPosition.x, rbPosition.y, rbPosition.z);
      // // console.log(camera.);
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
  <group position={[0,2,0]}>
    <OrbitControls/>
    <PerspectiveCamera makeDefault position={[0,0.68,4]} />
    <RigidBody restitution={0} linearDamping={0} angularDamping={0} lockRotations colliders={false} ref={rb}>
      <group ref={container}>
        <group ref={cameraTargetRef}>
          <group ref={cameraTargetGroup}>
          </group>
        </group>
        <group ref={character}>
          <BigTotoro/>  
        </group>
      </group>
      
      <CapsuleCollider args={[0.2, 0.25]}/>
    </RigidBody>
  </group>
  )
}

const ForwardedCharacterController = forwardRef(CharacterController);

export default ForwardedCharacterController;