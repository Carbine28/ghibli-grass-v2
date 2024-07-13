import { useRef } from "react";
import ForwardedCharacterController from "./CharacterController";
import { GroundChunkManager } from "./ground/GroundChunkManager";
import ForwardedECharacterController from "./CharacterController/ECharacterController";

export default function PhysicsWorldManager() {
  const characterPositionRef = useRef(null);

  return (<group>
    {/* <ForwardedCharacterController ref={characterPositionRef}/> */}
    <ForwardedECharacterController ref={characterPositionRef}/>
    <GroundChunkManager characterPositionRef={characterPositionRef}/>
  </group>
  )
}
