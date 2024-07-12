import { GroundChunkManager } from "./components/ground/GroundChunkManager";
import { Lights } from "./components/Lights";
import Skybox from "./components/sky/Skybox";
import { BigTotoro } from "./components/totoro/BigTotoro";

export default function Experience() {
return (
    <>
      <Skybox/>
      <Lights/> 
      <BigTotoro/>  
      <GroundChunkManager/>
    </>
  );
}
