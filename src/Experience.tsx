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
    </>
  );
}
