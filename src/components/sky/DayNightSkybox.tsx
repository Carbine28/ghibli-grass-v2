import { useEnvironment } from '@react-three/drei';
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

export default function DayNightSkybox() {
  const { scene } = useThree();
  const {experienceStarted} = useGlobalStore();
  const dayCubeTexture = useEnvironment({
    files: [
      dpx,dnx,
      dpy,dny,
      dpz,dnz
    ]
  });

  const nightCubeTexture = useEnvironment({
    files: [
      npx,nnx,
      npy,nny,
      npz,nnz
    ]
  });

  nightCubeTexture.minFilter = THREE.LinearFilter;
  nightCubeTexture.magFilter = THREE.LinearFilter;

  const modifyMaterial = (shader: THREE.WebGLProgramParametersWithUniforms) => {
    editVertexShader(shader);
    editFragmentShader(shader);
  }

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
    const dayTexture = { value: nightCubeTexture };
    shader.uniforms.dayTexture = dayTexture;
    shader.fragmentShader = 
    `
      varying vec3 vWorldPosition;
      uniform samplerCube dayTexture;
      ${shader.fragmentShader}
    `

    shader.fragmentShader = shader.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );',
      `
        vec4 dayColor = texture(dayTexture, vWorldPosition);
        vec4 diffuseColor = vec4( dayColor.xyz, opacity );
      `
    )
  }

  useEffect(() => {
    if(experienceStarted){
      // Adds Fog // Should seperate into its own component? nahh too small rn
      const color = new THREE.Color('#84CA8F');  // white
      const near = 400;
      const far = 2000;
      scene.fog = new THREE.Fog(color, near, far);
    }
  }, [experienceStarted])

  return (<group frustumCulled={false}>
    <mesh frustumCulled={false}>
      <sphereGeometry args={[1000, 32, 32]}/>
      <meshBasicMaterial onBeforeCompile={modifyMaterial} side={THREE.BackSide} fog={false} depthTest={false} depthWrite={false}
      />
    </mesh>
  </group>
  )
}


