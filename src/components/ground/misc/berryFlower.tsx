import { useGLTF } from '@react-three/drei'
import modelUrl from '/assets/misc/berryFlower.glb?url';

export function BerryFlower(props) {
  const { nodes, materials } = useGLTF(modelUrl)
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.DropingBerry_Vo.geometry}
        material={materials.DropingBerry_IceFireFlower0102_GlazedLily_Lotus}
        rotation={[1.043, -0.241, 0.02]}
        scale={1.25}
      />
    </group>
  )
}

useGLTF.preload(modelUrl)
