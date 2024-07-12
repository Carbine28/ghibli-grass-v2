import { Environment } from '@react-three/drei'
import cubeMap from '/assets/test.hdr?url'

export default function Skybox() {
  return (<group>
    <Environment files={cubeMap} background/>
  </group>
  )
}
