import { useGLTF } from '@react-three/drei'
import modelUrl from '/assets/misc/yellowBerryFlower.glb?url';

export function YellowBerryFlower(props) {
  const { nodes, materials } = useGLTF(modelUrl)
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Item_Plant_Raspberry02_Vo005.geometry}
        material={materials.Plant_Raspberry}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  )
}

useGLTF.preload(modelUrl)
