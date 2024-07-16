import * as THREE from 'three';
import './groundShaderMaterial';
import './grass/IGrassMaterial';
import { GroundShaderMaterial } from './groundShaderMaterial';
import { useEffect, useMemo, useRef } from 'react';
import { BGrass } from './grass/BGrass';
import { Perlin } from '../../utils/Noise/Perlin/static/Perlin';
import { RigidBody } from '@react-three/rapier';
import MiscGenerator from './misc/MiscGenerator';

const PERLIN_SCALE = 0.15;

type GroundProps = {
  widthHeight: number;
  widthHeightSegments: number;
  chunkPos: {x: number, y: number, z: number};
  isWireframe?: boolean;
} & JSX.IntrinsicElements['group']

export function Ground(props: GroundProps) {
  const groundGeoRef = useRef<THREE.PlaneGeometry>(null!);
  const {widthHeight, widthHeightSegments, isWireframe, chunkPos } = props;
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


  useEffect(() => {
    return () => {
      groundGeometry.dispose();
    }
  }, [])
  
  return (
  <group {...props}>
    <RigidBody type='fixed' colliders="trimesh">
      <mesh receiveShadow geometry={groundGeometry}>
        {/* <groundShaderMaterial key={GroundShaderMaterial.key} wireframe={isWireframe}/> */}
        <meshStandardMaterial color={'#669933'}/>
      </mesh>
    </RigidBody>
    <BGrass key={`${chunkPos}`} customPositions={props.position} groundGeoRef={groundGeoRef} chunkPos={chunkPos}/>
    {/* <MiscGenerator groundGeoRef={groundGeoRef}/> */}
  </group>
  )
}


