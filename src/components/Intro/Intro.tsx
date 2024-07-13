import vs from './Intro.vs';
import fs from './Intro.fs';
import { Mesh} from 'three';
import { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Html, OrthographicCamera, useTexture } from '@react-three/drei';
import { OrthographicCamera as OrthoThreeType} from 'three';
import './IntroShaderMaterial'
import { IntroShaderMaterial } from './IntroShaderMaterial';
import mask from '/assets/totoro/mask.png';
import { useControls } from 'leva';

export default function Intro() {
  const orthoCameraRef = useRef<OrthoThreeType>(null);
  const planeRef = useRef<Mesh>(null);
  const { size } = useThree();
  const maskTexture = useTexture(mask);
  const { maskScale } = useControls('Intro Controls', {
    maskScale: {value: 1., min: 0.0, max: 1.0, step:0.1}
  })
  const groupRef = useRef(false);
  const [ isGroupVisible , setIsGroupVisible ] = useState(false);

  useEffect(() => {
    const aspect = size.width / size.height;
    if(orthoCameraRef.current) {
      orthoCameraRef.current.left = aspect / - 1;
      orthoCameraRef.current.right = aspect / 1;
      orthoCameraRef.current.top = aspect / 1;
      orthoCameraRef.current.bottom = aspect / -1;
      orthoCameraRef.current.updateProjectionMatrix();
    }
    if(planeRef.current) {
      planeRef.current.scale.set(aspect, aspect, 1);
    }
  }, [size]);

  const handleExperienceStart = () => {
    console.log('Starting Experience!');
    // Hide button
    // Set global state half way through or something.
    // Play animation
  }

  return (<group visible={isGroupVisible}>
    <OrthographicCamera
      ref={orthoCameraRef}
      left={-1} right={1}
      top={1} bottom={-1}
      near={0}
      far={1}
      makeDefault
    >
      <mesh ref={planeRef}>
        <planeGeometry args={[2, 2]}/>
        <introShaderMaterial key={IntroShaderMaterial.key} mask={maskTexture} transparent scale={maskScale}/>
      </mesh>
      <Html center >
        <button onClick={handleExperienceStart}>Start Experience</button>
      </Html>
    </OrthographicCamera>

  </group>
  );
}
