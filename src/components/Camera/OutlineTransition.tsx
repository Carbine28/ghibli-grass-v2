import { useEffect, useRef } from 'react';
import './IntroShaderMaterial'
import { IntroShaderMaterial } from './IntroShaderMaterial';
import { Mesh, ShaderMaterial, Vector3, DoubleSide} from 'three';
import mask from '/assets/totoro/introMask2.png';
import { useTexture } from '@react-three/drei';
import { gsap } from 'gsap/gsap-core';
import { useGSAP } from '@gsap/react';
import { useGlobalStore } from '../../store/GlobalStore';
import { useFrame, useThree } from '@react-three/fiber';
import { EVENTS } from '../../data/EVENTS';

const TARGET_FACTOR = 2.5;

export default function OutlineTransition(props: JSX.IntrinsicElements['mesh']) {
  const meshRef = useRef<Mesh>(null!);
  const shaderRef = useRef<ShaderMaterial>(null!);
  const targetPosition = useRef(new Vector3());
  const targetDirection = useRef(new Vector3());
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

  useEffect(() => {
    if(meshRef.current) {
      meshRef.current.scale.set(window.innerWidth,window.innerHeight,1);
    }
    const handleResize = (e) => {
      meshRef.current.scale.set(window.innerWidth,window.innerHeight,1);
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener(EVENTS.outlineTransitionOut, outlineFadeOut);
    window.addEventListener(EVENTS.outlineTransitionIn, outlineFadeIn);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener(EVENTS.outlineTransitionOut, outlineFadeOut);
      window.removeEventListener(EVENTS.outlineTransitionIn, outlineFadeIn);
    }
  }, [])

  useFrame((state) => {
    state.camera.getWorldPosition(targetPosition.current)
    state.camera.getWorldDirection(targetDirection.current);
    meshRef.current.position.set(
      targetPosition.current.x + (targetDirection.current.x * TARGET_FACTOR),
      targetPosition.current.y + (targetDirection.current.y * TARGET_FACTOR),
      targetPosition.current.z + (targetDirection.current.z * TARGET_FACTOR),
    )
    meshRef.current.lookAt(targetPosition.current);
  })

  return (<mesh ref={meshRef} {...props}>
    <planeGeometry args={[1, 1]}/>
    <introShaderMaterial ref={shaderRef} key={IntroShaderMaterial.key} mask={maskTexture} transparent side={DoubleSide} depthTest={false} depthWrite={false} />
  </mesh>
  )
}
