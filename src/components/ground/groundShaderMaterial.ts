import * as THREE from 'three';
import { extend, MaterialNode } from "@react-three/fiber";
import { shaderMaterial } from '@react-three/drei';

import groundVertexShader from './ground.vs';
import groundFragmentShader from './ground.fs';

export const GroundShaderMaterial = shaderMaterial(
  {
    colorMap: new THREE.Texture(),
  },
  groundVertexShader,
  groundFragmentShader
)

extend({ GroundShaderMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    groundShaderMaterial: MaterialNode<GroundShaderMaterial, typeof GroundShaderMaterial>
  }
}

