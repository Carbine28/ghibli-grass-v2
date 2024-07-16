import * as THREE from 'three';
import { useEffect, useRef } from "react";
import { useHelper } from "@react-three/drei";
import { DirectionalLight } from "three";
import { useControls } from 'leva';
import { useFrame } from '@react-three/fiber';

const SUNDISTANCE = 1;
const SUNPOSITION = {
  x: -237,
  y: 240,
  z: -141
}


export function Lights() {  
  const dayDirectionalLight = useRef<DirectionalLight>(null!);
  const {x, y, z} = useControls('Light Controls', {
    x: {value: 0, step: 1},
    y: {value: 0, step: 1},
    z: {value: 0, step: 1},
  })

  const cameraPos = useRef(new THREE.Vector3());
  const target = useRef<THREE.Group>(null!);
  const updateTarget = useRef<number>();

  
  const modifyTargetPosition = () => {
    if(target.current){
      dayDirectionalLight.current.target = target.current;
    }
  }
  // Update the shadow camera of directional light periodically, better than settings massive values for shadowcamera.
  useEffect(() => {
    updateTarget.current = window.setInterval(modifyTargetPosition, 1000 );
    // ? Player walks too far things my disappear. Might need to implement this
    // if(dayDirectionalLight.current) {
    //   dayDirectionalLight.current.shadow.camera.far
    // }
    return () => {
      window.clearInterval(updateTarget.current);
    }
  }, [])


  useFrame(({camera}) => {
    if(cameraPos.current) {
      camera.getWorldPosition(cameraPos.current)
      target.current.position.set(cameraPos.current.x, cameraPos.current.y,  cameraPos.current.z);
    }
  })
  
  // useHelper(dayDirectionalLight, THREE.DirectionalLightHelper, 1.0);
  return <group>
    <group visible={true} name="dayLights">
      <ambientLight intensity={1.2}/>
      <directionalLight castShadow ref={dayDirectionalLight} position={[SUNPOSITION.x * SUNDISTANCE, SUNPOSITION.y * SUNDISTANCE, SUNPOSITION.z * SUNDISTANCE]}
      intensity={2.2} />
      {/* /* <directionalLight castShadow ref={dayDirectionalLight} position={[x * SUNDISTANCE, y * SUNDISTANCE, z * SUNDISTANCE]}  */}
    </group>
    <group visible={false} name="nightLights">
      <ambientLight intensity={0.2}/>
    </group>
    <group ref={target} name='target'></group>
  </group>
}