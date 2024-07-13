import { useFrame } from "@react-three/fiber";
import { Ground } from "./Ground"
import * as THREE from 'three';
import { useEffect, useRef, useState } from "react";

type ChunkManagerProp = {
  characterPositionRef: any;
} & JSX.IntrinsicElements['group']

type ChunkIndicesProp = {
  xIndex: number;
  zIndex: number;
}

const RERENDERRANGE = 5;

export function GroundChunkManager(props: ChunkManagerProp) {
  const GRID_SIZE = 5; 
  const CHUNK_SIZE = 10; // Width and height of each chunk
  const { characterPositionRef } = props;
  const prevPosition = useRef({x: 0, z: 0})
  const [ chunkIndices, setChunkIndices ] = useState<ChunkIndicesProp[]>([]);

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

  useEffect(() => {
    const { x, z } = characterPositionRef.current.current.translation()
    const clampedPos = {x: Math.floor(x), z: Math.floor(z)}
    setChunkIndices(calculateChunkIndices(clampedPos.x, clampedPos.z));
    prevPosition.current = clampedPos;
  }, []);
    
  useFrame(() => {
    // * Checks if new chunks need to be rerendered
    if(characterPositionRef.current) {
      const { x, z } = characterPositionRef.current.current.translation()
      const clampedPos = {x: Math.ceil(x), z: Math.ceil(z)}
      // * Trigger a rerender once [RERENDERRANGE] has been reached
      if(Math.abs(clampedPos.x - prevPosition.current.x) >= RERENDERRANGE || Math.abs(clampedPos.z - prevPosition.current.z) >= RERENDERRANGE) {
        setChunkIndices(calculateChunkIndices(clampedPos.x, clampedPos.z));
        prevPosition.current = clampedPos;
      }
    }
  })

  return(<group>
    {chunkIndices.map(({ xIndex, zIndex }) => (
      <Ground
        key={`x${xIndex}-z${zIndex}`}
        chunkPos={{x: xIndex * CHUNK_SIZE, y: 0, z: zIndex * CHUNK_SIZE}}
        widthHeight={CHUNK_SIZE}
        widthHeightSegments={16}
        // isVisible={false}
      />
    ))}
  </group>)
}