import { useEnvironment } from '@react-three/drei'
import { useGlobalStore } from '../../store/GlobalStore'
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

export default function Skybox() {
  const { experienceStarted } = useGlobalStore();
  const { scene } = useThree();

  const cubeTexture = useEnvironment({
    files: [
      '/assets/cubeMap/px.png',
      '/assets/cubeMap/nx.png',
      '/assets/cubeMap/py.png',
      '/assets/cubeMap/ny.png',
      '/assets/cubeMap/pz.png',
      '/assets/cubeMap/nz.png',
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
