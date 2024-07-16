import * as THREE from 'three';
import { extend, MaterialNode } from "@react-three/fiber";
import { shaderMaterial } from '@react-three/drei';

import vs from './Intro.vs';
import fs from './Intro.fs';

export const IntroShaderMaterial = shaderMaterial(
  {
    mask: new THREE.Texture(),
    scale: 1.0,
  },
  vs,
  fs
)

extend({ IntroShaderMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    introShaderMaterial: MaterialNode<IntroShaderMaterial, typeof IntroShaderMaterial>
  }
}

