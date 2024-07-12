import { Canvas } from "@react-three/fiber"
import Experience from "./Experience"
import { CameraControls, Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Perf } from 'r3f-perf';
function App() {
  return (
    <Canvas>
      <Perf/>
      {/* <color attach={'background'} args={[0.89,1.00,0.80]}/> */}
      {/* <OrbitControls makeDefault/> */}
      {/* <Environment preset="city" background/> */}
      <CameraControls/>
      <PerspectiveCamera  fov={20} position={[0, 10, 10]}/>
      <Experience/>
    </Canvas>
  )
}

export default App
