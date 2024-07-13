import vs from './Intro.vs';
import fs from './Intro.fs';
import { Mesh} from 'three';
import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { OrthographicCamera as OrthoThreeType} from 'three';

export default function Intro() {
  const orthoCameraRef = useRef<OrthoThreeType>(null);
  const planeRef = useRef<Mesh>(null);
  const { size } = useThree();
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

  return (<>
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
        <shaderMaterial 
          vertexShader={vs}
          fragmentShader={fs}
        />
      </mesh>

    </OrthographicCamera>

  </>
  );
}
