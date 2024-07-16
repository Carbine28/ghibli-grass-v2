
import * as THREE from 'three';
import { OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import OutlineTransition from './OutlineTransition';
import { useThree } from '@react-three/fiber';

export default function Camera() {
  const perspectiveCam = useRef<THREE.PerspectiveCamera>(null!);
  const orthoCam = useRef<THREE.OrthographicCamera>(null!);

  const { get, set } = useThree(({ get, set }) => ({ get, set }));

  useEffect(() => {
    const changeView = () => {
      if (get().camera.name === "2d") {
        set({ camera: perspectiveCam.current });
      } else {
        set({ camera: orthoCam.current });
        orthoCam.current.lookAt(0, 0, 0);
      }
    };
    changeView();

    window.addEventListener("keyup", changeView);
    return () => window.removeEventListener("keyup", changeView);
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
    />
  </>
  )
}
