// * Buffer Grass
import { useGLTF, useTexture} from '@react-three/drei';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import "./BGrassMaterial";
import { BGrassMaterial } from './BGrassMaterial';
import heightMap from '/assets/grassMap.png';
import { useFrame } from '@react-three/fiber';

type BufferProps = {
  groundGeoRef: MutableRefObject<THREE.PlaneGeometry>
}

type BufferGrassProps = BufferProps & JSX.IntrinsicElements['group'];

type AttributeDataProp = {
  offsets: number[]
}

export function BGrass(props: BufferGrassProps) {
  const { groundGeoRef } = props;
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const [ attributeData, setAttributeData] = useState<AttributeDataProp>({});
  const { nodes } = useGLTF('/assets/grass/iGrass.glb');
  const heightTexture = useTexture(heightMap);
  const [ canRender, setCanRender ] = useState(false);

  useEffect(() => {
    if(groundGeoRef.current) {
      const data = getAttributeData(groundGeoRef);
      setAttributeData(data);
      setCanRender(true);
    }
  }, [groundGeoRef])

  useFrame((state) => {
    if(materialRef.current) {
      const elapsedTime = state.clock.elapsedTime;
      materialRef.current.uniforms.uTime.value = elapsedTime;
    }
  })

  return(canRender ? <mesh>
    <instancedBufferGeometry index={nodes.grass.geometry.index} 
      attributes-position={nodes.grass.geometry.attributes.position}
      attributes-uv={nodes.grass.geometry.attributes.uv}
    >
      <instancedBufferAttribute attach="attributes-offset" args={[new Float32Array(attributeData.offsets), 3]} />
    </instancedBufferGeometry>
    <bGrassMaterial ref={materialRef} key={BGrassMaterial.key} heightMap={heightTexture}/>
  </mesh> : null);
}


function getAttributeData(groundGeoRef: MutableRefObject<THREE.PlaneGeometry>) {
  const offsets = [];

  const posArr = groundGeoRef.current.getAttribute('position').array;
  const instances = posArr.length;

  for(let i = 0; i < instances; i+=3){
    const iY = i + 1;
    const iZ = i + 2;
    offsets.push(posArr[i], posArr[iY] , posArr[iZ])
    // Generate half grass aswell?
  }
  return {
    offsets
  }
}