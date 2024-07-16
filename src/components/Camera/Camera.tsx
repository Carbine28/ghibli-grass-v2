
import * as THREE from 'three';
import { OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import OutlineTransition from './OutlineTransition';
import { useThree } from '@react-three/fiber';
import { EVENTS } from '../../data/EVENTS';

export default function Camera() {
  const perspectiveCam = useRef<THREE.PerspectiveCamera>(null!);
  const orthoCam = useRef<THREE.OrthographicCamera>(null!);

  const { get, set } = useThree(({ get, set }) => ({ get, set }));

  useEffect(() => {
    const changeToPerspective = () => {
      if (get().camera.name === "2d") {
        set({ camera: perspectiveCam.current });
        console.log('change to pers')
      }
    }
    const changeToOrtho = () => {
      if (get().camera.name != '2d') {
        set({ camera: orthoCam.current });
      }
    }
    changeToOrtho();
    
    window.addEventListener(EVENTS.perspective, changeToPerspective);
    window.addEventListener(EVENTS.orthographic, changeToOrtho);
    return () => {
      window.removeEventListener(EVENTS.perspective, changeToPerspective);
      window.removeEventListener(EVENTS.orthographic, changeToOrtho);
    };
  }, [get, set]);

  return (<>
    <PerspectiveCamera
      name='3d'
      ref={perspectiveCam}
      position={[0,0,0]}
      fov={75}
      near = {0.1}
      far = {2000}
    />
    <OrthographicCamera
      name='2d'
      ref={orthoCam}
      position={[0,0,0]}
    />
    <group name='screenTransitions'>
      <OutlineTransition position={[0,0, 0]}/>
    </group>
  </>
  )
}
