import { useFrame } from "@react-three/fiber";
import { useGlobalStore } from "../../store/GlobalStore";
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

const RERENDERRANGE = 2;

export function GroundChunkManager(props: ChunkManagerProp) {
  const { characterPositionRef } = props;
  const prevPosition = useRef({x: 0, z: 0})
  const GRID_SIZE = 5; // Adjust this according to your grid size
  const CHUNK_SIZE = 10; // Width and height of each chunk

  const [ chunkIndices, setChunkIndices ] = useState<ChunkIndicesProp[]>([]);

  useEffect(() => {
    const newChunkIndices = [];
    const characterPos = characterPositionRef.current.current.translation()
    const clampedPos = {x: Math.floor(characterPos.x), z: Math.floor(characterPos.z)}
    for (let xOffset = -Math.floor(GRID_SIZE / 2); xOffset <= Math.floor(GRID_SIZE / 2); xOffset++) {
      for (let zOffset = -Math.floor(GRID_SIZE / 2); zOffset <= Math.floor(GRID_SIZE / 2); zOffset++) {
        newChunkIndices.push({
          xIndex: Math.floor(clampedPos.x / CHUNK_SIZE) + xOffset,
          zIndex: Math.floor(clampedPos.z / CHUNK_SIZE) + zOffset
        });
      }
    }
    setChunkIndices(newChunkIndices);
    prevPosition.current = clampedPos;
  }, []);
    

  useFrame(() => {
    if(characterPositionRef.current) {
      const characterPos = characterPositionRef.current.current.translation()
      const clampedPos = {x: Math.ceil(characterPos.x), z: Math.ceil(characterPos.z)}
      // * Trigger a rerender once [RERENDERRANGE] has been reached
      if(Math.abs(clampedPos.x - prevPosition.current.x) >= RERENDERRANGE || Math.abs(clampedPos.z - prevPosition.current.z) >= RERENDERRANGE) {
        prevPosition.current = clampedPos;
        // console.log('triggerd rerender');
        const newChunkIndices = [];
        for (let xOffset = -Math.floor(GRID_SIZE / 2); xOffset <= Math.floor(GRID_SIZE / 2); xOffset++) {
          for (let zOffset = -Math.floor(GRID_SIZE / 2); zOffset <= Math.floor(GRID_SIZE / 2); zOffset++) {
            newChunkIndices.push({
              xIndex: Math.floor(clampedPos.x / CHUNK_SIZE) + xOffset,
              zIndex: Math.floor(clampedPos.z / CHUNK_SIZE) + zOffset
            });
          }
        }
        setChunkIndices(newChunkIndices);
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
      />
    ))}
  </group>)

  // return(<group>
  //   {/* <Ground widthHeight={10} widthHeightSegments={16} chunkPos={{x:0, y:0, z:0}} />
  //   <Ground widthHeight={10} widthHeightSegments={16} chunkPos={{x:10, y:0, z:0}} /> */}
  // {
  //   Array(GRID_SIZE).fill(0).map((_, rowIndex) => (
  //     Array(GRID_SIZE).fill(0).map((_, colIndex) => {
  //       const xOffset = (rowIndex - HALF_GRID_SIZE) * CHUNK_SIZE;
  //       const zOffset = (colIndex - HALF_GRID_SIZE) * CHUNK_SIZE;
  //       return (
  //         <Ground
  //           key={`r${rowIndex}-c${colIndex}`}
  //           chunkPos={{x: xOffset, y: 0, z: zOffset}}
  //           widthHeight={CHUNK_SIZE}
  //           widthHeightSegments={16}
  //         />
  //       );
  //     })
  //   ))
  // }
  // </group>)
}