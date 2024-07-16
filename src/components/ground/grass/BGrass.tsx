// * Buffer Grass
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import "./BGrassMaterial";
import { BGrassMaterial } from './BGrassMaterial';
import { useFrame, Vector3 } from '@react-three/fiber';
import { useControls } from 'leva';
import { useGrassLOD } from './hooks/useGrassLOD';

type BufferProps = {
  groundGeoRef: MutableRefObject<THREE.PlaneGeometry>
  customPositions: Vector3 | undefined
  chunkPos: {x: number, y: number, z: number}
}

type BufferGrassProps = BufferProps & JSX.IntrinsicElements['group'];

export function BGrass(props: BufferGrassProps){
  const { groundGeoRef, customPositions, chunkPos } = props;

  const offsetArr = useMemo(() => {
    const data = getAttributeData(groundGeoRef);
    const array = new Float32Array(data);
    return array;
  }, [groundGeoRef])

  const grassGeometry = useGrassLOD(chunkPos);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const bGeoRef = useRef<THREE.InstancedBufferGeometry>(null);

  const canRenderRef = useRef(false);


  useEffect(() => {
    if(groundGeoRef.current) {
      canRenderRef.current = true;
    }
  }, [groundGeoRef])

  useFrame((state) => {
    if(materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  })

  // ? Doesnt seem to cause any issues, turned off
  // if(!groundGeoRef) return null;

  return(<mesh position={customPositions} frustumCulled={false} visible={canRenderRef.current}>
      <instancedBufferGeometry  ref={bGeoRef} index={grassGeometry.current.index} 
        attributes-position={grassGeometry.current.attributes.position}
        attributes-uv={grassGeometry.current.attributes.uv}
      >
        <instancedBufferAttribute attach="attributes-offset" args={[offsetArr, 3]} />
      </instancedBufferGeometry>
      <bGrassMaterial ref={materialRef} key={BGrassMaterial.key}/>
    </mesh> 
  );
}

function getAttributeData(groundGeoRef: MutableRefObject<THREE.PlaneGeometry>): number[] {
  if(!groundGeoRef) return [];
  const offsets = [];
  const posArr = groundGeoRef.current.getAttribute('position').array;
  const instances = posArr.length;

  for(let i = 0; i < instances; i+=3){
    const iY = i + 1;
    const iZ = i + 2;
    offsets.push(posArr[i] + Math.random(), posArr[iY] , posArr[iZ] + Math.random())
  }
  return offsets;
}