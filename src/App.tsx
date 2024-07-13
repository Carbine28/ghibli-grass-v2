import { Canvas } from "@react-three/fiber"
import Experience from "./Experience"
import { KeyboardControls, Loader } from "@react-three/drei"
import { Perf } from 'r3f-perf';
import Intro from "./components/Intro/Intro";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ['Shift']},
]

function App() {
  return (
    <KeyboardControls map={keyboardMap}>
      <Canvas>
        <Perf position='top-left'/>
        {/* <color attach={'background'} args={[0.89,1.00,0.80]}/> */}
        <Intro/>
        <Experience/>
      </Canvas>
      <Loader/>
    </KeyboardControls>
  )
}

export default App
