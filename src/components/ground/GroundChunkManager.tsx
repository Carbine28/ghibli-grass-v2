import { Ground } from "./Ground"
import * as THREE from 'three';

export function GroundChunkManager() {

  return(<group>
      <Ground widthHeight={10} widthHeightSegments={32} position={new THREE.Vector3(0, 0, 0)} />
  </group>)
}