import { useEffect, useRef } from 'react'
import { useGLTF, useAnimations, useTexture, useKeyboardControls } from '@react-three/drei'
import { useGlobalStore } from '../../store/GlobalStore'
import { Group } from 'three'
import baseTexture from '/assets/totoro/totoroBase.png';
import totoro from '/assets/totoro/bigTotoro2.glb?url';
import { useFrame } from '@react-three/fiber';
import { useJoystickControls } from 'ecctrl';
export function RiggedTotoro(props) {
  const group = useRef<Group>(null!);
  const { nodes, materials, animations } = useGLTF(totoro)
  const baseTex = useTexture(baseTexture);
  baseTex.flipY = false;
  const { actions } = useAnimations(animations, group)

  const { setPlayerMeshRef } = useGlobalStore();

  useEffect(() => {
    setPlayerMeshRef(group);
    console.log(actions);
  }, [])

  const [,get] = useKeyboardControls();
  const jsControls = useJoystickControls();

  useFrame(() => {
    const movement = { x: 0, z: 0};
    const { joystickDis } = jsControls.getJoystickValues()
    // console.log(joystickDis)
    if (get().forward) movement.z = 1;
    if (get().backward) movement.z = -1;
    if (get().leftward) movement.x = 1;
    if (get().rightward) movement.x = -1;
    if(movement.x !== 0 || movement.z !== 0 || joystickDis) {
      actions?.Run.play();
    } else {
      actions?.Run.stop();
    }
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene" position={[0,-0.5,0]}>
        <group name="Armature">
          <skinnedMesh
            name="bigTotoro001"
            geometry={nodes.bigTotoro001.geometry}
            // material={materials['default.001']}
            skeleton={nodes.bigTotoro001.skeleton}
          >
            <meshStandardMaterial map={baseTex}/>
          </skinnedMesh>
          <primitive object={nodes.Spine} />
          <primitive object={nodes.Spine001} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload(totoro)