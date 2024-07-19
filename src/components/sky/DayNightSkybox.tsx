import { TransformControls, useEnvironment } from '@react-three/drei';
import * as THREE from 'three';
import dpx from '/assets/cubeMap/px.png?url';
import dnx from '/assets/cubeMap/nx.png?url';
import dpy from '/assets/cubeMap/py.png?url';
import dny from '/assets/cubeMap/ny.png?url'; 
import dpz from '/assets/cubeMap/pz.png?url';
import dnz from '/assets/cubeMap/nz.png?url';

import npx from '/assets/cubeMap/night/px.png?url';
import nnx from '/assets/cubeMap/night/nx.png?url';
import npy from '/assets/cubeMap/night/py.png?url';
import nny from '/assets/cubeMap/night/ny.png?url';
import npz from '/assets/cubeMap/night/pz.png?url';
import nnz from '/assets/cubeMap/night/nz.png?url';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useGlobalStore } from '../../store/GlobalStore';
import { EVENTS } from '../../data/EVENTS';
import { useControls } from 'leva';
import { getYRotationMatrix } from '../../utils/transformation/RotationUtils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function DayNightSkybox() {
  const { scene } = useThree();
  const {experienceStarted} = useGlobalStore();
  const dayCubeTexture = useEnvironment({
    files: [dpx,dnx, dpy,dny,  dpz,dnz]
  });
  const nightCubeTexture = useEnvironment({
    files: [npx,nnx, npy,nny, npz,nnz]
  });
  const shaderRef = useRef<THREE.WebGLProgramParametersWithUniforms>(null!);
  const { contextSafe } = useGSAP();

  // useControls('test', {
  //   Button: {
  //     value: false,
  //     onChange: (bool) =>{
  //       if(bool) {
  //         const event = new Event(EVENTS.nightTime);
  //         window.dispatchEvent(event);
  //       } else {
  //         const event = new Event(EVENTS.dayTime);
  //         window.dispatchEvent(event);
  //       }
  //     }
  //   },
  //   dayRotationY: {
  //     value: 0,
  //     min: -360,
  //     max: 360,
  //     step: 1,
  //     onChange: (deg) => {
  //       if(shaderRef.current){
  //         shaderRef.current.uniforms.rotationMatrix.value = getYRotationMatrix(deg);
  //       }
  //     }
  //   },
  //   blendFactor: {
  //     value: 0,
  //     min: 0,
  //     max: 1,
  //     step: 0.01,
  //     onChange: (bf) => {
  //       if(shaderRef.current){
  //         shaderRef.current.uniforms.blendFactor.value = bf;
  //       }
  //     }
  //   }
  // })

  useEffect(() => {
    const changeSkyboxToDay = contextSafe(() => {
      if(shaderRef.current){
        gsap.to(shaderRef.current.uniforms.blendFactor, {value: .0, duration: 2.0, ease:'power1.in' })
      }
    })
  
    const changeSkyboxToNight = contextSafe(() => {
      if(shaderRef.current){
        gsap.to(shaderRef.current.uniforms.blendFactor, {value: 1.0, duration: 2.0, ease:'power1.in' })
      }
    })
    window.addEventListener(EVENTS.dayTime, changeSkyboxToDay);
    window.addEventListener(EVENTS.nightTime, changeSkyboxToNight);
    return () => {
      window.removeEventListener(EVENTS.dayTime, changeSkyboxToDay);
      window.removeEventListener(EVENTS.nightTime, changeSkyboxToNight);
    }
  }, [contextSafe])

  const modifyMaterial = (shader: THREE.WebGLProgramParametersWithUniforms) => {
    const editVertexShader = (shader: THREE.WebGLProgramParametersWithUniforms) => {
      shader.vertexShader =`
        varying vec3 vWorldPosition;
        ${shader.vertexShader}
      `
  
      shader.vertexShader = shader.vertexShader.replace('#include <uv_vertex>',
        `#include <uv_vertex>
          vec4 modelPosition = modelMatrix * vec4(position, 1.0); 
          vWorldPosition = modelPosition.xyz;
        `
      )
    }
    const editFragmentShader = (shader: THREE.WebGLProgramParametersWithUniforms) =>{
      const dayTexture = { value: dayCubeTexture };
      const nightTexture = { value: nightCubeTexture};
      shader.uniforms.dayTexture = dayTexture;
      shader.uniforms.nightTexture = nightTexture;
      shader.uniforms.rotationMatrix = { value: new THREE.Matrix3() };
      shader.uniforms.blendFactor = { value: 0 };
      shader.fragmentShader = 
      `
        varying vec3 vWorldPosition;
        uniform samplerCube dayTexture;
        uniform samplerCube nightTexture;
        uniform mat3 rotationMatrix;
        uniform float blendFactor;
        ${shader.fragmentShader}
      `
      shader.fragmentShader = shader.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );',
        `
          vec3 rotatedPosition = rotationMatrix * vWorldPosition;
          vec4 dayColor = texture(dayTexture, rotatedPosition);
          vec4 nightColor = texture(nightTexture, rotatedPosition);
          vec4 blendedColor = mix(dayColor, nightColor, blendFactor);
          vec4 diffuseColor = vec4( blendedColor.xyz, opacity );
        `
      )
    }
    editVertexShader(shader);
    editFragmentShader(shader);
    shaderRef.current = shader;
  }

  useEffect(() => {
    if(experienceStarted){
      // Adds Fog // Should seperate into its own component? nahh too small rn
      const color = new THREE.Color('#84CA8F');  // white
      const near = 400;
      const far = 2000;
      scene.fog = new THREE.Fog(color, near, far);
    }
  }, [experienceStarted, scene])

  return (<group frustumCulled={false}>
    <mesh frustumCulled={false}>
      <sphereGeometry args={[1000, 32, 32]}/>
      <meshBasicMaterial onBeforeCompile={modifyMaterial} side={THREE.BackSide} fog={false} depthTest={false} depthWrite={false}
      />
    </mesh>
  </group>
  )
}

const testFunction = () => {
  console.log('hi');
}
