import { Canvas } from "@react-three/fiber"
import Experience from "./Experience"
import { CameraControls, KeyboardControls, Loader, OrbitControls, OrthographicCamera, PerspectiveCamera } from "@react-three/drei"
import { Perf } from 'r3f-perf';


const keyboardMap = [
  { name: "forward", keys: ['ArrowUp', 'KeyW']},
  { name: "backward", keys: ['ArrowDown', 'KeyS']},
  { name: "left", keys: ['ArrowLeft', 'KeyA']},
  { name: "right", keys: ['ArrowRight', 'KeyD']},
  { name: "run", keys: ['Shift']},
]

function App() {
  return (
    <KeyboardControls map={keyboardMap}>
      <Canvas>
        <Perf position='top-left'/>
        {/* <color attach={'background'} args={[0.89,1.00,0.80]}/> */}
        {/* <OrbitControls makeDefault/> */}
        
        {/* <OrthographicCamera 
          left={-22}
          right={15}
          top={10}
          bottom={-20}
        /> */}
        <Experience/>
      </Canvas>
      <Loader/>
    </KeyboardControls>
  )
}

export default App
