import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import modelUrl from '/assets/misc/redFlower.glb?url';

export function RedFlower(props) {
  const { nodes, materials } = useGLTF(modelUrl)
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Area_Common_Prop_Flower_Red_01_Vo.geometry}
        material={materials.RedWhiteYellowBlue_Flowers_KIkka_Flower07}
        position={[0,0,0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  )
}

useGLTF.preload(modelUrl);
