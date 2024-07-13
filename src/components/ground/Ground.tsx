import * as THREE from 'three';
import './groundShaderMaterial';
import './grass/IGrassMaterial';
import { GroundShaderMaterial } from './groundShaderMaterial';
import { useTexture} from '@react-three/drei';
import heightMap from '/assets/grassMap.png';
import { useMemo, useRef } from 'react';
import { IGrass } from './grass/IGrass';
import { BGrass } from './grass/BGrass';
import { Perlin } from '../../utils/Noise/Perlin/static/Perlin';
import { RigidBody } from '@react-three/rapier';


const PERLIN_SCALE = 0.0;

type GroundProps = {
  widthHeight: number;
  widthHeightSegments: number;
  chunkPos: {x: number, y: number, z: number};
  isWireframe?: boolean;
  isVisible?: boolean;
  
} & JSX.IntrinsicElements['group']

export function Ground(props: GroundProps) {
  const texture = useTexture(heightMap);
  const groundGeoRef = useRef<THREE.PlaneGeometry>(null!);
  const {widthHeight, widthHeightSegments, isWireframe, chunkPos, isVisible } = props;
  const groundGeometry = useMemo(() => {
    const planeGeo = new THREE.PlaneGeometry(widthHeight, widthHeight, widthHeightSegments, widthHeightSegments);
    planeGeo.lookAt(new THREE.Vector3(0,1,0));
    const newPositions = planeGeo.getAttribute('position').array.slice();
    for(let i = 0; i < newPositions.length; i += 3)
    {
      const iX = i;
      const iZ = i + 1;
      const iY = i + 2;
      newPositions[iX] += chunkPos.x;
      newPositions[iY] += chunkPos.z;
      newPositions[iZ] += Perlin.noise(newPositions[iX] * PERLIN_SCALE, newPositions[iY] * PERLIN_SCALE);
      // newPositions[iY] += 0;
    }

    // console.log('props positon? : ', props.position);
    planeGeo.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));

    planeGeo.computeVertexNormals();
    planeGeo.computeBoundingSphere();
    groundGeoRef.current = planeGeo;
    return planeGeo;
  }, [props.position, widthHeight, widthHeightSegments]);

  
  return (
  <group visible={isVisible}>
    {/* <IGrass/> */}
    <RigidBody  type='fixed' colliders="trimesh">
      <mesh geometry={groundGeometry}>
        <groundShaderMaterial key={GroundShaderMaterial.key} colorMap={texture} wireframe={isWireframe}/>
      </mesh>
    </RigidBody>
    <BGrass customPositions={props.position} groundGeoRef={groundGeoRef}/>
  </group>
  )
}


