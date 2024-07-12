import * as THREE from 'three';
import { shaderMaterial } from "@react-three/drei";
import { extend, MaterialNode } from "@react-three/fiber";
import GrassVert from './Grass.vs';
import GrassFrag from './Grass.fs';

export const IGrassMaterial = shaderMaterial(
  {
    heightMap: new THREE.Texture(),
    heightScale: 0.0,
    uTime: 0.0,
  },
  GrassVert,
  GrassFrag
)

extend({ IGrassMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    iGrassMaterial: MaterialNode<IGrassMaterial, typeof IGrassMaterial>
  }
}