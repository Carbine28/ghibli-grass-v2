import { Ground } from "./Ground"
import * as THREE from 'three';

const GRID_SIZE = 1;

export function GroundChunkManager() {

  return(<group>
    {/* <Ground widthHeight={10} widthHeightSegments={16} position={new THREE.Vector3(0, 0, 0)} /> */}
    {
    Array(GRID_SIZE).fill(0).map((_, rowIndex) => (
      Array(GRID_SIZE).fill(0).map((_, colIndex) => (
        <Ground key={`r${rowIndex}-c${colIndex}`}
          position={new THREE.Vector3(rowIndex * 5, 0, colIndex * 5)}
          widthHeight={10}
          widthHeightSegments={16}
        />
      ))
    ))
  }
  </group>)
}