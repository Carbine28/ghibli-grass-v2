import * as THREE from 'three';
import { useRef } from 'react';
// Shaders
import './SCloudShaderMaterial';
import { SCloudShaderMaterial } from './SCloudShaderMaterial';
// Textures //
import { useTexture } from '@react-three/drei';
import cloudColour from '/assets/stylizedClouds/cloud_toon.png?url';
import cloudNormal from '/assets/stylizedClouds/cloud_normals.png?url';
import cloudEdge from '/assets/stylizedClouds/cloud_edge.png?url';
import gradient from '/assets/stylizedClouds/CombinedImage.png?url';
import noise from '/assets/stylizedClouds/noise.jpg?url';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';

const CLOUD_SIZE = 125;

export default function StylizedCloud(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null!);
  const material = useRef<THREE.ShaderMaterial>(null!);
  const diffuseTex = useTexture(cloudColour);
  const normalTex = useTexture(cloudNormal);
  const edgeMaskTex = useTexture(cloudEdge);
  const gradientTex = useTexture(gradient);
  const noiseTex = useTexture(noise);
  diffuseTex.wrapS = THREE.RepeatWrapping;
  diffuseTex.wrapT = THREE.RepeatWrapping;
  normalTex.wrapS = THREE.RepeatWrapping;
  normalTex.wrapT = THREE.RepeatWrapping;
  edgeMaskTex.wrapS = THREE.RepeatWrapping;
  edgeMaskTex.wrapT = THREE.RepeatWrapping;
  gradientTex.wrapS = THREE.RepeatWrapping;
  gradientTex.wrapT = THREE.RepeatWrapping;
  noiseTex.wrapS = THREE.RepeatWrapping;
  noiseTex.wrapT = THREE.RepeatWrapping;

  useControls("Cloud Params", {
    cloudColor: {value: '#ffffff', onChange: (val) => {
      const color = new THREE.Color(val);
      material.current.uniforms.uCloudColor.value = color;
    }},
    rimColor: {value: '#CED6E5', onChange: (val) => {
      const color = new THREE.Color(val);
      material.current.uniforms.uRimColor.value = color;
    }},
    rimPower: {value: 1.62, min: 0.0, max: 5.0, onChange: (val) => {
      material.current.uniforms.uRimPower.value = val;
    }},
    shadowMin: {value: .84, min: 0.0, max: 1.0, onChange: (val) => {
      material.current.uniforms.uShadowMin.value = val;
    }},
    shadowMax: {value: 1, min: 0.0, max: 1.0, onChange: (val) => {
      material.current.uniforms.uShadowMax.value = val;
    }},
    lightIntensity: {value: 1.72, min: 0.01, max: 5.0, onChange: (val) => {
      material.current.uniforms.uLightIntensity.value = val;
    }},
    gradientOffset: {value: 0.477, min: 0.01, max: 5.0, onChange: (val) => {
      material.current.uniforms.uGradientOffset.value = val;
    }},
    gradientMultiplier: {value: 1.53, min: 0.01, max: 5.0, onChange: (val) => {
      material.current.uniforms.uGradientMultiplier.value = val;
    }},
    noiseGradientOffset: {value: 0.61, min: 0.01, max: 5.0, onChange: (val) => {
      material.current.uniforms.uNoiseGradientOffset.value = val;
    }},
    noiseSpeed: {value: {
      x: 0.15,
      y: 0
    }, onChange: (val) => {
      material.current.uniforms.uNoiseSpeed.value = val;
    }},

  })

  useFrame((state) => {
    if(material.current){
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  })

  return (<group {...props} ref={group}>
    <mesh>
      <planeGeometry args={[CLOUD_SIZE,CLOUD_SIZE]}/>
      <sCloudShaderMaterial key={SCloudShaderMaterial.key} ref={material}
        uCloudColorTex={diffuseTex} uCloudNormalTex={normalTex}
        uEdgeMaskTex={edgeMaskTex} uGradientMaskTex={gradientTex}
        uNoiseTex={noiseTex}
        transparent depthWrite={false}
      />
    </mesh>
  </group>
  )
}
