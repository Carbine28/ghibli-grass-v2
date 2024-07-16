import { GroundChunkManager } from "./ground/GroundChunkManager";
import { ECharacterController } from "./CharacterController/ECharacterController";

export default function PhysicsWorldManager() {
  return (<group>
    <ECharacterController/>
    <GroundChunkManager/>
  </group>
  )
}
