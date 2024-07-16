import { useFrame, useThree } from "@react-three/fiber";
import { Ground } from "./Ground"
import * as THREE from 'three';
import { useEffect, useRef, useState } from "react";
import { useGlobalStore } from "../../store/GlobalStore";

type ChunkIndicesProp = {
  xIndex: number;
  zIndex: number;
}

const RERENDERRANGE = 5;
const CULLCHECKINTERVAL = 400; // Interval to cull in milliseconds

export function GroundChunkManager() {
  const GRID_SIZE = 5; 
  const CHUNK_SIZE = 10; // Width and height of each chunk
  const prevPosition = useRef({x: 0, z: 0})
  const [ chunkIndices, setChunkIndices ] = useState<ChunkIndicesProp[]>([]);
  const groupCullRefs = useRef<THREE.Group[] | null[]>([]);
  const intervalRef = useRef(0);
  const calculateChunkIndices = (x:number, z: number) => {
    const indices = [];
    for (let xOffset = -Math.floor(GRID_SIZE / 2); xOffset <= Math.floor(GRID_SIZE / 2); xOffset++) {
      for (let zOffset = -Math.floor(GRID_SIZE / 2); zOffset <= Math.floor(GRID_SIZE / 2); zOffset++) {
        indices.push({
          xIndex: Math.floor(x / CHUNK_SIZE) + xOffset,
          zIndex: Math.floor(z / CHUNK_SIZE) + zOffset
        });
      }
    }
    return indices;
  }
  const { camera } = useThree();
  const { experienceStarted, playerMeshRef } = useGlobalStore();
  const targetPos = useRef(new THREE.Vector3());

  const performBoxCullCheck = () => {
    if(!groupCullRefs) return;
    const frustrum = new THREE.Frustum();
    const cameraViewProjectionMatrix = new THREE.Matrix4()
    cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    frustrum.setFromProjectionMatrix(cameraViewProjectionMatrix)
    groupCullRefs.current.forEach(group => {
      // ! Accessing child using magic index... 
      if(group) {
        const cullBox = group.children[1];
        const isVisible = frustrum.intersectsObject(cullBox);
        group.visible = isVisible;
      }
    })
  }

  useEffect(() => {
    if(playerMeshRef){
      const {x, z} = playerMeshRef.current.getWorldPosition(targetPos.current);
      const clampedPos = {x: Math.floor(x), z: Math.floor(z)}
      setChunkIndices(calculateChunkIndices(clampedPos.x, clampedPos.z));
      prevPosition.current = clampedPos;

      // set an Interval to cull here
      intervalRef.current = window.setInterval(performBoxCullCheck, CULLCHECKINTERVAL)
      return () => {
        if(intervalRef)
          window.clearInterval(intervalRef.current)
      }
    }
  }, [playerMeshRef]);
    
  useFrame(() => {
    // * Checks if new chunks need to be rerendered
    if(playerMeshRef) {
      const {x, z} = playerMeshRef.current.getWorldPosition(targetPos.current);
      const clampedPos = {x: Math.ceil(x), z: Math.ceil(z)}
      // * Trigger a rerender once [RERENDERRANGE] has been reached
      if(Math.abs(clampedPos.x - prevPosition.current.x) >= RERENDERRANGE || Math.abs(clampedPos.z - prevPosition.current.z) >= RERENDERRANGE) {
        setChunkIndices(calculateChunkIndices(clampedPos.x, clampedPos.z));
        prevPosition.current = clampedPos;
      }
    }
  })

  return(<group visible={experienceStarted}>
    {chunkIndices.map(({ xIndex, zIndex }, i) => (
      <group key={`x${xIndex}-z${zIndex}`} ref={el => groupCullRefs.current[i] = el}>
        <Ground 
          chunkPos={{x: xIndex * CHUNK_SIZE, y: 0, z: zIndex * CHUNK_SIZE}}
          widthHeight={CHUNK_SIZE}
          widthHeightSegments={64}
        />
        <mesh name={`boundingBox`} position={[xIndex * CHUNK_SIZE, 0, zIndex * CHUNK_SIZE]} visible={false} >
          <boxGeometry args={[CHUNK_SIZE, CHUNK_SIZE, CHUNK_SIZE]}/>
          <meshNormalMaterial />
        </mesh>
      </group>
    ))}
  </group>)
}