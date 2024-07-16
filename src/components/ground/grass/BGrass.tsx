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
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);
  const shaderRef = useRef<THREE.WebGLProgramParametersWithUniforms>(null!);
  const canRenderRef = useRef(false);


  useEffect(() => {
    if(groundGeoRef.current) {
      canRenderRef.current = true;
    }
  }, [groundGeoRef])

  useFrame((state) => {
    if(shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  })

  const modifyMaterial = (shader: THREE.WebGLProgramParametersWithUniforms) => {
    const uTime = { value: 0.0}
    shader.uniforms.uTime = uTime;
    editVertexShader(shader);
    editFragmentShader(shader);
    shaderRef.current = shader;
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
        frc = mvPosition.y / 0.8;
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
        vec4 diffuseColor = vec4( col.xyz, opacity );
      `
    )
  }



  return(<mesh position={customPositions} frustumCulled={false} visible={canRenderRef.current}>
      <instancedBufferGeometry index={grassGeometry.current.index} 
        attributes-position={grassGeometry.current.attributes.position}
        attributes-uv={grassGeometry.current.attributes.uv}
      >
        <instancedBufferAttribute attach="attributes-offset" args={[offsetArr, 3]} />
      </instancedBufferGeometry>
      {/* <bGrassMaterial ref={materialRef} key={BGrassMaterial.key}/> */}
      <meshStandardMaterial ref={materialRef} onBeforeCompile={modifyMaterial} color={'green'}/>
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