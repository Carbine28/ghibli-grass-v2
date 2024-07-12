import * as THREE from 'three'
import { MutableRefObject, useLayoutEffect, useRef } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import heightMap from '/assets/grassMap.png';
import { IGrassMaterial } from './IGrassMaterial';
import { useFrame } from '@react-three/fiber';

const GRASS_COUNT = 20000;
const COLUMNS = 100;
const RADIUS = 10;

export function IGrass(props) {
  const heightTex = useTexture(heightMap);
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const { nodes } = useGLTF('/assets/grass/iGrass.glb')
  useLayoutEffect(() => {
    // generateGrid(meshRef)
    generateCircle(meshRef);
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [])

  useFrame((state) => {
    // console.log(materialRef.current.uniforms);
    const elapsedTime = state.clock.elapsedTime;
    materialRef.current.uniforms.uTime.value = elapsedTime;
  })
  
  return (
  <instancedMesh position={[0,-0.10,0]} ref={meshRef} args={[null, null, GRASS_COUNT]} geometry={nodes.grass.geometry}>
    <iGrassMaterial ref={materialRef} key={IGrassMaterial.key} heightMap={heightTex} heightScale={0.8}/>
    {/* <meshNormalMaterial/> */}
  </instancedMesh>
    // <group {...props} dispose={null}>
    //   <mesh
    //     castShadow
    //     receiveShadow
    //     geometry={nodes.grass.geometry}
    //     scale={[1, 1, 1]}
    //   />
    // </group>
  )
}

function generateGrid(iMesh: MutableRefObject<THREE.InstancedMesh>) {
  const dummy = new THREE.Object3D();
  const stepX = 0.2; // Distance between grass blades in the x direction
  const stepZ = 0.2; // Distance between grass blades in the y direction

  for(let i = 0; i < GRASS_COUNT; i++){
    const row = Math.floor(i / COLUMNS);
    const col = i % COLUMNS;
    dummy.position.set(col * stepX, 0, row * stepZ );
    // dummy.rotation.y = Math.random() * Math.PI; // Optional: add some random rotation
    // dummy.scale.setScalar(Math.random() * 0.5 + 0.5); // Optional: add some random scale
    dummy.updateMatrix();
    iMesh.current.setMatrixAt(i, dummy.matrix);
  }
}

function generateCircle(iMesh: MutableRefObject<THREE.InstancedMesh>) {
  const dummy = new THREE.Object3D();
  for( let i = 0; i < GRASS_COUNT; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.sqrt(Math.random())  * RADIUS;
    // * Convert polar coordinates to Cartesian coordinates
    const x = distance * Math.cos(angle);
    const z = distance * Math.sin(angle);

    dummy.position.set(x, 0, z);
    dummy.updateMatrix();
    iMesh.current.setMatrixAt(i, dummy.matrix);
  }
}

useGLTF.preload('/iGrass.glb')