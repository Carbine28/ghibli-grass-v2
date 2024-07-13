import { useRef } from "react";
import { GroundChunkManager } from "./ground/GroundChunkManager";
import ForwardedECharacterController from "./CharacterController/ECharacterController";

export default function PhysicsWorldManager() {
  const characterPositionRef = useRef(null);

  return (<group>
    <ForwardedECharacterController ref={characterPositionRef}/>
    <GroundChunkManager characterPositionRef={characterPositionRef}/>
  </group>
  )
}
