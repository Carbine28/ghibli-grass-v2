import { useEffect, useRef } from "react";
import StylizedCloud from "./StylizedCloud";
import * as THREE from 'three';
import { useFrame, useThree } from "@react-three/fiber";
import { useGlobalStore } from "../../store/GlobalStore";

const CLOUD_NUM = 8;

// TODO Calculate positions in UseMemo instead.
// TODO Alter clouds to have different sizes

export default function StylizedClouds() {
  const group = useRef<THREE.Group>(null!);
  const playerPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const player = useRef(null);
  const intervalID = useRef(0);
  const { experienceStarted, playerMeshRef } = useGlobalStore();

  const adjustCloudsLookDirection = () => {
    if(player.current){
      player.current.getWorldPosition(playerPosition.current)
      if(group.current){
        group.current.children.forEach((child) => {
          child.lookAt(playerPosition.current);
        })
      }
    }
  }

  useEffect(() => {
    if(playerMeshRef?.current){
      player.current = playerMeshRef.current;
    }
  }, [playerMeshRef])

  useEffect(() => {
    intervalID.current = setInterval(adjustCloudsLookDirection, 100);
    return () => {
      clearInterval(intervalID.current);
    }
  }, [])
  
  return (<group ref={group} visible={experienceStarted}>
    {
      Array(CLOUD_NUM).fill(0).map(() => {
        const randPos = generateRandomPosition3();
        return <StylizedCloud key={`${randPos.x}-${randPos.y}-${randPos.z}`} position={[randPos.x, randPos.y, randPos.z]}/>
      })
    }
    {/* <StylizedCloud position={[0,55,-50]}/> */}
  </group>
  )
}

function generateRandomPosition3(): THREE.Vector3 {
  const XZ_BOUNDS = 500;
  const Y_OFFSET = 250;
  const Y_BOUNDS = 30;
  const x = (Math.random() - 0.5) * 2 * XZ_BOUNDS;
  const z = (Math.random() - 0.5) * 2 * XZ_BOUNDS;
  const y = Y_BOUNDS * Math.random() + Y_OFFSET;
  
  return new THREE.Vector3(x, y, z);
}