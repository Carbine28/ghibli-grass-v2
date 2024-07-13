import { Physics } from "@react-three/rapier";
import { GroundChunkManager } from "./components/ground/GroundChunkManager";
import { Lights } from "./components/Lights";
import Skybox from "./components/sky/Skybox";
import CharacterController from "./components/CharacterController";
import { CameraControls, PerspectiveCamera, PointerLockControls } from "@react-three/drei";
import { MathUtils } from "three";
import PhysicsWorldManager from "./components/PhysicsWorldManager";

export default function Experience() {
return (
    <>
      <Skybox/>
      <Lights/> 
      <Physics debug>
        <PhysicsWorldManager/>
      </Physics>
      <mesh position={[0, -10, 0]} rotation={[- Math.PI / 2, 0,0]}>
        <planeGeometry args={[1000,1000,1,1]}/>
        <meshBasicMaterial color={'#669933'}/>
      </mesh>
    </>
  );
}
