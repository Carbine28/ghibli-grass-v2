import { useGLTF } from '@react-three/drei'
import modelUrl from '/assets/misc/greenFlower.glb?url';
export function GreenFlower(props) {
  const { nodes, materials } = useGLTF(modelUrl)
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cecilia_Vo.geometry}
        material={materials.Callas_Cecilia_Fuchsia_Mint_Snapdragon_Whiteballet_WindmillDais}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  )
}

useGLTF.preload(modelUrl)