import vs from './Intro.vs';
import fs from './Intro.fs';
import { Mesh, ShaderMaterial} from 'three';
import { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { OrthographicCamera, useTexture } from '@react-three/drei';
import { OrthographicCamera as OrthoThreeType} from 'three';
import './IntroShaderMaterial'
import { IntroShaderMaterial } from './IntroShaderMaterial';
import mask from '/assets/totoro/introMask2.png';

import { useControls } from 'leva';
import './Intro.css'

import { gsap } from 'gsap/gsap-core';
import { useGSAP } from '@gsap/react';
import { useGlobalStore } from '../../store/GlobalStore';

export default function Intro() {
  const orthoCameraRef = useRef<OrthoThreeType>(null);
  const planeRef = useRef<Mesh>(null);
  const { size } = useThree();
  const aspect = useRef(size.width / size.height);
  const maskTexture = useTexture(mask);
  const { maskScale } = useControls('Intro Controls', {
    maskScale: {value: 1., min: 0.0, max: 1.0, step:0.01}
  })
  const { contextSafe } = useGSAP();
  const shaderRef = useRef<ShaderMaterial>(null!);
  const { experienceStarted } = useGlobalStore();
  const [ unmount, setUnmount ] = useState(false);

  useEffect(() => {
    aspect.current = size.width / size.height;
    if(orthoCameraRef.current) {
      orthoCameraRef.current.left = aspect.current / - 1;
      orthoCameraRef.current.right = aspect.current / 1;
      orthoCameraRef.current.top = aspect.current / 1;
      orthoCameraRef.current.bottom = aspect.current / -1;
      orthoCameraRef.current.updateProjectionMatrix();
    }
    if(planeRef.current) {
      planeRef.current.scale.set(aspect.current, aspect.current, 1);
    }
  }, [size]);

  const outlineFadeOut = contextSafe(() => {
    if(shaderRef && shaderRef.current){
      gsap.to(shaderRef.current?.uniforms.scale, {value: 0.0, duration: 1.0, ease: 'power1.in',
        onComplete: () => {setUnmount(true)}
      });
    }
  })

  useEffect(() => {
    if(experienceStarted){
      outlineFadeOut();
    }
  }, [experienceStarted])


  if(unmount) return null;

  return (
    <OrthographicCamera
      ref={orthoCameraRef}
      left={ aspect.current / -1} right={ aspect.current / 1}
      top={aspect.current /  1} bottom={ aspect.current / -1}
      near={0}
      far={1}
      makeDefault
    >
    <mesh ref={planeRef} scale={[aspect.current, aspect.current , 1]}>
      <planeGeometry args={[2, 2]}/>
      <introShaderMaterial ref={shaderRef} key={IntroShaderMaterial.key} mask={maskTexture} transparent scale={maskScale}/>
    </mesh>
    </OrthographicCamera>
  );
}
