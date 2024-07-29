import * as THREE from 'three';
import { extend, MaterialNode } from "@react-three/fiber";
import { shaderMaterial } from '@react-three/drei';
import cloudVs from './SCloud.vs';
import cloudFs from './SCloud.fs';

export const SCloudShaderMaterial = shaderMaterial(
  {
    uCloudColorTex: new THREE.Texture(),
    uCloudNormalTex: new THREE.Texture(),
    uEdgeMaskTex: new THREE.Texture(),
    uGradientMaskTex: new THREE.Texture(),
    uNoiseTex: new THREE.Texture(),
    uCloudColor: new THREE.Color('#ffffff'),
    uShadowMin: 0.32,
    uShadowMax: 1,
    uLightIntensity: 1.57,
    uRimPower: 1.62,
    uRimColor: new THREE.Color('#CED6E5'),
    uGradientOffset: 0.477,
    uGradientMultiplier: 2.53,
    uNoiseGradientOffset: 0,
    uNoiseSpeed: new THREE.Vector2(0.15, 0.),
    uTime: 0.0
  },
  cloudVs,
  cloudFs
)

extend({ SCloudShaderMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    sCloudShaderMaterial: MaterialNode<SCloudShaderMaterial, typeof SCloudShaderMaterial>
  }
}

