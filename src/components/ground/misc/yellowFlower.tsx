import { useGLTF } from '@react-three/drei'
import modelUrl from '/assets/misc/yellowFlower.glb?url';
export function YellowFlower(props) {
  const { nodes, materials } = useGLTF(modelUrl)
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Property_Ani_Flower_QingxinBase_02_Vo.geometry}
        material={materials.QingxinBase}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  )
}

useGLTF.preload(modelUrl)