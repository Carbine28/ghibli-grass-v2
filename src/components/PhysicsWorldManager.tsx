import { useRef } from "react";
import ForwardedCharacterController from "./CharacterController";
import { GroundChunkManager } from "./ground/GroundChunkManager";

export default function PhysicsWorldManager() {
  const characterPositionRef = useRef(null);

  return (<group>
    <ForwardedCharacterController ref={characterPositionRef}/>
    <GroundChunkManager characterPositionRef={characterPositionRef}/>
  </group>
  )
}
