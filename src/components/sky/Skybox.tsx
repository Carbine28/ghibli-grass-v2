import { Environment } from '@react-three/drei'
import cubeMap from '/assets/test.hdr?url'
import { useGlobalStore } from '../../store/GlobalStore'

export default function Skybox() {
  const { experienceStarted } = useGlobalStore();
  return (<group visible={ experienceStarted }>
    {/* <Environment files={cubeMap} background backgroundIntensity={1.5} /> */}
  </group>
  )
}
