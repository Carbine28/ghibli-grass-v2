import { useGLTF } from '@react-three/drei'
import modelUrl from '/assets/misc/violetFlower.glb?url';
export function VioletFlower(props) {
  const { nodes, materials } = useGLTF(modelUrl)
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Area_Common_Prop_Flower_Blue_03_Vo.geometry}
        material={materials.RedWhiteYellowBlue_Flowers_KIkka_Flower07}
        rotation={[Math.PI / 2, 0, 0]}
        scale={1.5}
      />
    </group>
  )
}

useGLTF.preload(modelUrl)
