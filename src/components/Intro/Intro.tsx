import vs from './Intro.vs';
import fs from './Intro.fs';
import { Mesh, ShaderMaterial} from 'three';
import { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Html, OrthographicCamera, useTexture } from '@react-three/drei';
import { OrthographicCamera as OrthoThreeType} from 'three';
import './IntroShaderMaterial'
import { IntroShaderMaterial } from './IntroShaderMaterial';
import mask from '/assets/totoro/introMask2.png';

import cursorImg from '/assets/totoro/cursorImg.png';
import cursor2Img from '/assets/totoro/dustBunny.png';
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
  const [ mounted , setMounted ] = useState(true);
  // const [ transitioned, setTransitioned ] = useState(false);
  const [ cursorPosition, setCursorPosition ] = useState({x: (size.width / 2) - 64, y: (size.height/2) - 64})

  const { contextSafe } = useGSAP();
  const shaderRef = useRef<ShaderMaterial>(null!);
  const { toggleExperienceStarted } = useGlobalStore();
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if(!mounted) return;

      setCursorPosition({x:e.clientX, y:e.clientY});
    }
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mounted])

  // * Needed to 
  useEffect(() => {
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
  }, [])


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

  const handleOutlineFade = contextSafe(() => {
    if(shaderRef && shaderRef.current){
      gsap.to(shaderRef.current?.uniforms.scale, {value: 0.0, duration: 1.0, ease: 'power1.in'});
    }
  })

  const handleExperienceStart = () => {
    console.log('Starting Experience!');
    const pointerElement = document.querySelector('.pointer') as HTMLElement;
    if(pointerElement){
      pointerElement.classList.add('hidden');
      window.setTimeout(() => {
        pointerElement.style.visibility = 'hidden';
      }, 1000)
    }
    setTimeout(() => {
      toggleExperienceStarted();
      setMounted(false);
    }, 1200)

    // Play animation
    handleOutlineFade();
    // Play Sound effect
  }

  if(!mounted) return null;

  return (
    <OrthographicCamera
      ref={orthoCameraRef}
      left={ aspect.current / -1} right={ aspect.current / 1}
      top={aspect.current /  1} bottom={ aspect.current / -1}
      near={0}
      far={1}
      makeDefault
    >
    <Html fullscreen>
      <div className='pointer' style={{position: 'absolute', left: `${cursorPosition.x}px`, top: `${cursorPosition.y - 15}px`}}>
        <div className='pointerButtonContainer'><button className='pointerButton' onClick={handleExperienceStart}></button></div>
        <div className='imageContainer'>
          <img className='cursorEyesImg' src={cursor2Img}/>
          <img className='cursorTotoroImg' src={cursorImg}/>
        </div>
      </div>
    </Html>
    <mesh ref={planeRef} scale={[aspect.current, aspect.current , 1]}>
      <planeGeometry args={[2, 2]}/>
      <introShaderMaterial ref={shaderRef} key={IntroShaderMaterial.key} mask={maskTexture} transparent scale={maskScale}/>
    </mesh>
    </OrthographicCamera>
  );
}
