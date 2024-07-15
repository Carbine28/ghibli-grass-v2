import { Mesh, ShaderMaterial} from 'three';
import { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { OrthographicCamera, useTexture } from '@react-three/drei';
import { OrthographicCamera as OrthoThreeType} from 'three';
import './IntroShaderMaterial'
import { IntroShaderMaterial } from './IntroShaderMaterial';
import mask from '/assets/totoro/introMask2.png';
import { gsap } from 'gsap/gsap-core';
import { useGSAP } from '@gsap/react';
import { useGlobalStore } from '../../store/GlobalStore';
import { LinearFilter } from 'three';
export default function Intro() {
  const orthoCameraRef = useRef<OrthoThreeType | null>(null);
  const planeRef = useRef<Mesh>(null);
  const { size, scene } = useThree();
  const canvasAspect = useRef(size.width / size.height);
  const maskTexture = useTexture(mask);
  
  // ? Fixed image squish?
  const imageAspect = maskTexture.image ? maskTexture.image.width / maskTexture.image.height : 1.0;
  const aspect = imageAspect / canvasAspect.current;

  maskTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0;
  maskTexture.repeat.x = aspect > 1 ? 1 / aspect : 1;
 
  maskTexture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2;
  maskTexture.repeat.y = aspect > 1 ? 1 : aspect;

  maskTexture.minFilter = LinearFilter;
  maskTexture.magFilter = LinearFilter;

  const { contextSafe } = useGSAP();
  const shaderRef = useRef<ShaderMaterial>(null!);
  const { experienceStarted } = useGlobalStore();
  const [ unmount, setUnmount ] = useState(false);

  // * Resizing , affects orthographics camera
  useEffect(() => {
    canvasAspect.current = size.width / size.height;
    if(orthoCameraRef.current) {
      orthoCameraRef.current.left = canvasAspect.current / - 1;
      orthoCameraRef.current.right = canvasAspect.current / 1;
      orthoCameraRef.current.top = canvasAspect.current / 1;
      orthoCameraRef.current.bottom = canvasAspect.current / -1;
      orthoCameraRef.current.updateProjectionMatrix();
    }
    if(planeRef.current) {
      planeRef.current.scale.set(canvasAspect.current, canvasAspect.current, 1);
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



  if(unmount){
    if(orthoCameraRef) {
      if(orthoCameraRef.current){
        scene.remove(orthoCameraRef.current);
        orthoCameraRef.current = null;
      }
    }
    return null;
  }

  return (
    <OrthographicCamera
      ref={orthoCameraRef}
      left={ canvasAspect.current / -1} right={ canvasAspect.current / 1}
      top={canvasAspect.current /  1} bottom={ canvasAspect.current / -1}
      near={0}
      far={1}
      makeDefault
    >
    <mesh ref={planeRef} scale={[canvasAspect.current, canvasAspect.current , 1]}>
      <planeGeometry args={[2, 2]}/>
      <introShaderMaterial ref={shaderRef} key={IntroShaderMaterial.key} mask={maskTexture} transparent />
    </mesh>
    </OrthographicCamera>
  );
}
