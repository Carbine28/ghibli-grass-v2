import * as THREE from 'three'
import { shaderMaterial } from "@react-three/drei";
import { extend, MaterialNode } from "@react-three/fiber";
import TotoroVertex from './Totoro.vs';
import TotoroFragment from './Totoro.fs';


export const TotoroShaderMaterial = shaderMaterial(
  {
    baseTex: new THREE.Texture(),
  },
  TotoroVertex,
  TotoroFragment,
)
  
extend({ TotoroShaderMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    totoroShaderMaterial: MaterialNode<TotoroShaderMaterial, typeof TotoroShaderMaterial>
  }
}