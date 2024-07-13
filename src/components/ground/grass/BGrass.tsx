// * Buffer Grass
import { useGLTF, useTexture} from '@react-three/drei';
import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import "./BGrassMaterial";
import { BGrassMaterial } from './BGrassMaterial';
import heightMap from '/assets/grassMap.png';
import { useFrame, useThree, Vector3 } from '@react-three/fiber';
import { useControls } from 'leva';
import { useGrassLOD } from './hooks/useGrassLOD';

type BufferProps = {
  groundGeoRef: MutableRefObject<THREE.PlaneGeometry>
  customPositions: Vector3 | undefined
  chunkPos: {x: number, y: number, z: number}
}

type BufferGrassProps = BufferProps & JSX.IntrinsicElements['group'];

type AttributeDataProp = {
  offsets: number[]
}

export function BGrass(props: BufferGrassProps){
  const { groundGeoRef, customPositions, chunkPos } = props;
  const grassGeometry = useGrassLOD(chunkPos);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const [ attributeData, setAttributeData] = useState<AttributeDataProp>({});
  const heightTexture = useTexture(heightMap);
  const bGeoRef = useRef<THREE.InstancedBufferGeometry>(null);
  const canRenderRef = useRef(false);

  useEffect(() => {
    if(groundGeoRef.current) {
      const data = getAttributeData(groundGeoRef);
      setAttributeData(data);
      canRenderRef.current = true;
    }
  }, [groundGeoRef])

  useFrame((state) => {
    if(materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  })

  useEffect(() => {
    return () => {
      bGeoRef.current?.dispose();
    }
  }, [])
  

  if(!groundGeoRef) return null;

  return(<mesh position={customPositions} frustumCulled={false} visible={canRenderRef.current}>
      <instancedBufferGeometry ref={bGeoRef} index={grassGeometry.current.index} 
        attributes-position={grassGeometry.current.attributes.position}
        attributes-uv={grassGeometry.current.attributes.uv}
      >
        <instancedBufferAttribute attach="attributes-offset" args={[new Float32Array(attributeData.offsets), 3]} />
      </instancedBufferGeometry>
      <bGrassMaterial ref={materialRef} key={BGrassMaterial.key} heightMap={heightTexture}/>
    </mesh> 
  );
}

function getAttributeData(groundGeoRef: MutableRefObject<THREE.PlaneGeometry>) {
  const offsets = [];

  const posArr = groundGeoRef.current.getAttribute('position').array;
  const instances = posArr.length;

  for(let i = 0; i < instances; i+=3){
    const iY = i + 1;
    const iZ = i + 2;
    offsets.push(posArr[i] + Math.random(), posArr[iY] , posArr[iZ] + Math.random())
  }
  return {
    offsets
  }
}