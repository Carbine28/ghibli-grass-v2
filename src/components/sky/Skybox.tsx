import { useEnvironment } from '@react-three/drei'
import { useGlobalStore } from '../../store/GlobalStore'
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';
import px from '/assets/cubeMap/px.png?url';
import nx from '/assets/cubeMap/nx.png?url';
import py from '/assets/cubeMap/py.png?url';
import ny from '/assets/cubeMap/ny.png?url';
import pz from '/assets/cubeMap/pz.png?url';
import nz from '/assets/cubeMap/nz.png?url';

export default function Skybox() {
  const { experienceStarted } = useGlobalStore();
  const { scene } = useThree();

  const cubeTexture = useEnvironment({
    files: [
      px,
      nx,
      py,
      ny,
      pz,
      nz
    ]
  });
  
  useEffect(() => {
    if(experienceStarted){
      scene.background = cubeTexture;
      // scene.backgroundBlurriness = 0.15
      // Adds Fog // Should seperate into its own component? nahh too small rn
      const color = new THREE.Color('#84CA8F');  // white
      const near = 100;
      const far = 350;
      scene.fog = new THREE.Fog(color, near, far);
    }
  }, [experienceStarted, scene, cubeTexture])

  return (
    null
  )
}
