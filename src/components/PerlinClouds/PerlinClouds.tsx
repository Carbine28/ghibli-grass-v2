import { useTexture } from '@react-three/drei';
import './PerlinCloudsShaderMaterial';
import { PerlinCloudsShaderMaterial } from './PerlinCloudsShaderMaterial';
import noiseMap from '/assets/clouds/cloudPerlinNoise.jpg';
import edgeMap from '/assets/clouds/cloud_edge.jpg';

import { ShaderMaterial } from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function PerlinClouds() {
  const noiseTexture = useTexture(noiseMap);
  const edgeTexture = useTexture(edgeMap);
  noiseTexture.wrapS = THREE.RepeatWrapping;
  noiseTexture.wrapT = THREE.RepeatWrapping;
  const materialRef = useRef<ShaderMaterial>();

  // useFrame to update map;
  useFrame((state) => {
    if(materialRef.current){
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  })

  return (<group position={[0,300,0]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh >
        <planeGeometry args={[1500,1500]} />
        <perlinCloudsShaderMaterial key={PerlinCloudsShaderMaterial.key} ref={materialRef} 
        noiseMap={noiseTexture} edgeMap={edgeTexture} 
        transparent/>
      </mesh>
  </group>
  )
}
