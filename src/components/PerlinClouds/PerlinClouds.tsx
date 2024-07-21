import { useTexture } from '@react-three/drei';
import './PerlinCloudsShaderMaterial';
import { PerlinCloudsShaderMaterial } from './PerlinCloudsShaderMaterial';
import noiseMap from '/assets/clouds/cloudPerlinNoise.jpg';
import edgeMap from '/assets/clouds/cloud_edge.jpg';

import { ShaderMaterial } from 'three';
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EVENTS } from '../../data/EVENTS';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { GLOBAL_CONFIG } from '../../data/GLOBAL_CONFIG';

export default function PerlinClouds() {
  const noiseTexture = useTexture(noiseMap);
  const edgeTexture = useTexture(edgeMap);
  noiseTexture.wrapS = THREE.RepeatWrapping;
  noiseTexture.wrapT = THREE.RepeatWrapping;
  const materialRef = useRef<ShaderMaterial>();
  const { contextSafe} = useGSAP();
  useEffect(() => {
    const changeCloudsToDay = contextSafe(() => {
      gsap.to(materialRef.current.uniforms.lightFactor, {value: 1.0, duration: GLOBAL_CONFIG.DAYNIGHTCONFIG.NIGHT_TO_DAY_TRANSITION, ease:'power1.in'}) 
    })

    const changeCloudsToNight = contextSafe(() => {
      gsap.to(materialRef.current.uniforms.lightFactor, { value: 0.2, duration: GLOBAL_CONFIG.DAYNIGHTCONFIG.DAY_TO_NIGHT_TRANSITION, ease:'power1.in' });
    })

    window.addEventListener(EVENTS.dayTime, changeCloudsToDay);
    window.addEventListener(EVENTS.nightTime, changeCloudsToNight);
    return () => {
      window.removeEventListener(EVENTS.nightTime, changeCloudsToDay);
      window.removeEventListener(EVENTS.nightTime, changeCloudsToNight);
    }
  }, [])

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
