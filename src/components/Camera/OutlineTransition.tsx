import { useRef } from 'react';
import './IntroShaderMaterial'
import { IntroShaderMaterial } from './IntroShaderMaterial';
import { Mesh, ShaderMaterial} from 'three';
import mask from '/assets/totoro/introMask2.png';
import { useTexture } from '@react-three/drei';
import { gsap } from 'gsap/gsap-core';
import { useGSAP } from '@gsap/react';
import { useGlobalStore } from '../../store/GlobalStore';

export default function OutlineTransition() {
  const shaderRef = useRef<ShaderMaterial>(null!);
  const maskTexture = useTexture(mask);
  const { contextSafe } = useGSAP();

  const outlineFadeOut = contextSafe(() => {
    if(shaderRef.current){
      shaderRef.current.uniforms.scale.value = 1.0;
      gsap.to(shaderRef.current.uniforms.scale, {value: 0.0, duration: 1.0, ease: 'power1.in',
        onComplete: () => {console.log('fade out finished')}
      });
    }
  })

  const outlineFadeIn = contextSafe(() => {
    if(shaderRef.current){
      shaderRef.current.uniforms.scale.value = 0.0;
      gsap.to(shaderRef.current.uniforms.scale, {value: 1.0, duration: 1.0, ease: 'power1.in',
        onComplete: () => {console.log('fade in finished')}
      });
    }
  })

  return (<mesh>
    <planeGeometry args={[2, 2]}/>
    <introShaderMaterial ref={shaderRef} key={IntroShaderMaterial.key} mask={maskTexture} transparent />
  </mesh>
  )
}
