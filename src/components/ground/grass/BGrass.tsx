// * Buffer Grass
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import "./BGrassMaterial";
import { BGrassMaterial } from './BGrassMaterial';
import { useFrame, Vector3 } from '@react-three/fiber';
import { useControls } from 'leva';
import { useGrassLOD } from './hooks/useGrassLOD';
import { EVENTS } from '../../../data/EVENTS';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useGlobalStore } from '../../../store/GlobalStore';
import { GLOBAL_CONFIG } from '../../../data/GLOBAL_CONFIG';

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
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);
  const shaderRef = useRef<THREE.WebGLProgramParametersWithUniforms>(null!);
  const canRenderRef = useRef(false);
  const { contextSafe } = useGSAP()
  const { time } = useGlobalStore();

  useEffect(() => {
    const changeGrassToDay = contextSafe(() => {
      if(materialRef.current){
        gsap.to(materialRef.current.uniforms.diffuseMultiplier, { value: 1.0, duration: GLOBAL_CONFIG.DAYNIGHTCONFIG.NIGHT_TO_DAY_TRANSITION});
      }
    })

    const changeGrassToNight = contextSafe(() => {
      // ? Can change brightness too
      if(materialRef.current){
        gsap.to(materialRef.current.uniforms.diffuseMultiplier, { value: 0.35, duration: GLOBAL_CONFIG.DAYNIGHTCONFIG.DAY_TO_NIGHT_TRANSITION });
      }
    })

    if(time === "day"){
      materialRef.current.uniforms.diffuseMultiplier.value = 1.0;
    } else {
      materialRef.current.uniforms.diffuseMultiplier.value = 0.35;
    }

    window.addEventListener(EVENTS.dayTime, changeGrassToDay);
    window.addEventListener(EVENTS.nightTime, changeGrassToNight);
    return () => {
      window.removeEventListener(EVENTS.dayTime, changeGrassToDay);
      window.removeEventListener(EVENTS.nightTime, changeGrassToNight);
    }
  }, [])


  useEffect(() => {
    if(groundGeoRef.current) {
      canRenderRef.current = true;
    }
  }, [groundGeoRef])

  useFrame((state) => {
    // if(shaderRef.current) {
    //   shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    // }
    if(materialRef.current){
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  })

  const modifyMaterial = (shader: THREE.WebGLProgramParametersWithUniforms) => {
    const uTime = { value: 0.0}
    shader.uniforms.uTime = uTime;
    editVertexShader(shader);
    editFragmentShader(shader);
    shaderRef.current = shader;
    // ? Adding shadows to instances https://discourse.threejs.org/t/meshdepthmaterial-instancedbuffergeometry/4736/2
    // meshRef.current.customDepthMaterial = new THREE.MeshDepthMaterial(); // 
  }


  const editVertexShader = (shader: THREE.WebGLProgramParametersWithUniforms) => {
    
    shader.vertexShader =`
      varying vec2 vuv;
      varying float frc;
      uniform float uTime;
      attribute vec3 offset;
      ${shader.vertexShader}
    `

    shader.vertexShader = shader.vertexShader.replace('#include <clipping_planes_vertex>',
      `#include <clipping_planes_vertex>
        mvPosition = modelMatrix * vec4(position + offset, 1.0);
        frc = mvPosition.y / 0.8;
        
        // Wind
        float dispPower = 1.0 - cos((1.0 - uv.y) * 3.1416 / 2.0);
        dispPower *= 0.5;
        float displacement = sin( mvPosition.z + uTime * 5.0 ) * ( 0.1 * dispPower );
        mvPosition.z += displacement;
      `
    )

    shader.vertexShader = shader.vertexShader.replace('#include <fog_vertex>',
      `#include <fog_vertex>
        vec4 modelViewPosition = modelMatrix * viewMatrix * mvPosition;
        gl_Position = projectionMatrix * modelViewPosition;
        vuv = uv;
      `
    )
  }
  
  const editFragmentShader = (shader: THREE.WebGLProgramParametersWithUniforms) =>{
    shader.fragmentShader = 
    `
      varying vec2 vuv;
      varying float frc;
      ${shader.fragmentShader}
    `

    shader.fragmentShader = shader.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );',
      `
        vec4 tipColor = vec4(143.0/255.0, 172.0/255.0, 103.0/255.0, 1.0);
        vec4 baseColor = vec4(61.0/255.0, 114.0/255.0, 73.0/255.0, 1.0);
        vec4 col = mix(baseColor, tipColor, frc);
        vec4 diffuseColor = vec4( diffuse, opacity );
        diffuseColor *= col * 1.5;
      `
    )

    shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>',
      `#include <opaque_fragment>
        gl_FragColor = diffuseColor;
      `
    )
  }


  return(<mesh ref={meshRef} position={customPositions} frustumCulled={false} visible={canRenderRef.current}>
      <instancedBufferGeometry index={grassGeometry.current.index} 
        attributes-position={grassGeometry.current.attributes.position}
        attributes-uv={grassGeometry.current.attributes.uv}
      >
        <instancedBufferAttribute attach="attributes-offset" args={[offsetArr, 3]} />
      </instancedBufferGeometry>
      <bGrassMaterial ref={materialRef} key={BGrassMaterial.key}/>
      {/* <meshStandardMaterial key={groundGeoRef.current.uuid} ref={materialRef} onBeforeCompile={modifyMaterial}
        color={'#9bc970'}
       /> */}
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