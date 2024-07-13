import * as THREE from 'three';
import { shaderMaterial } from "@react-three/drei";
import { extend, MaterialNode } from "@react-three/fiber";
import GrassVert from './BGrass.vs';
import GrassFrag from './BGrass.fs';

export const BGrassMaterial = shaderMaterial(
  {
    uTime: 0.0,
  },
  GrassVert,
  GrassFrag
)

extend({ BGrassMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    bGrassMaterial: MaterialNode<BGrassMaterial, typeof BGrassMaterial>
  }
}