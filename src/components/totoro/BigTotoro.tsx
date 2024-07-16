import { useGLTF, useTexture } from '@react-three/drei'
import './TotoroShaderMaterial';
import { TotoroShaderMaterial } from './TotoroShaderMaterial';
import totoro from '/assets/totoro/bigTotoro.glb?url';
import baseTexture from '/assets/totoro/totoroBase.png';

export function BigTotoro(props: JSX.IntrinsicElements['group']) {
  const { nodes } = useGLTF(totoro)
  const baseTex = useTexture(baseTexture);
  baseTex.flipY = false; // * Don't forget to flip textures
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        geometry={nodes.bigTotoro.geometry}
        // material={materials['default.001']}
        position={[0, -0.5, 0]}
        rotation={[-Math.PI, -Math.PI/2, -Math.PI]}
        scale={0.055}
      >
        <meshStandardMaterial map={baseTex}/>
        {/* <totoroShaderMaterial key={TotoroShaderMaterial.key}
          baseTex={baseTex}
        /> */}
      </mesh>
    </group>
  )
}

useGLTF.preload(totoro);