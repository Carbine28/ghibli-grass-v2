import * as THREE from 'three';
import { extend, MaterialNode } from "@react-three/fiber";
import { shaderMaterial } from '@react-three/drei';

import cloudVs from './PerlinClouds.vs';
import cloudFs from './PerlinClouds.fs';

export const PerlinCloudsShaderMaterial = shaderMaterial(
  {
    uTime: 0.0,
    noiseMap: new THREE.Texture(),
    edgeMap: new THREE.Texture(),
    normalMap: new THREE.Texture()
  },
  cloudVs,
  cloudFs
)

extend({ PerlinCloudsShaderMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    perlinCloudsShaderMaterial: MaterialNode<PerlinCloudsShaderMaterial, typeof PerlinCloudsShaderMaterial>
  }
}

