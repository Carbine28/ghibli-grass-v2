import { Physics } from "@react-three/rapier";
import { Lights } from "./components/sky/Lights";
import PhysicsWorldManager from "./components/PhysicsWorldManager";
import { SoundManager } from "./components/SoundManager";
import { useGlobalStore } from "./store/GlobalStore";
import PerlinClouds from "./components/PerlinClouds/PerlinClouds";
import DayNightSkybox from "./components/sky/DayNightSkybox";
import TimeCycleManager from "./components/TimeCycleManager";
import StylizedClouds from "./components/StylizedClouds/StylizedClouds";

export default function Experience() {
  const { experienceStarted } = useGlobalStore();
  return (
    <>
      <DayNightSkybox/>
      {/* <PerlinClouds/> */}
      <StylizedClouds/>
      <Lights/> 
      <SoundManager/>
      <TimeCycleManager/>
      <Physics paused={!experienceStarted}>
        <PhysicsWorldManager/>
      </Physics>
      <mesh position={[0, -10, 0]} rotation={[- Math.PI / 2, 0,0]}>
        <planeGeometry args={[1000,1000,1,1]}/>
        <meshStandardMaterial color={'#669933'}/>
      </mesh>
    </>
  );
}
