import { useKeyboardControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber";
import { useJoystickControls } from "ecctrl";
import { MutableRefObject, useEffect } from "react";
import { PositionalAudio } from "three";

type AudioControllerProps = {
  positionalAudioRef: MutableRefObject<PositionalAudio>;
}

export default function CharacterAudioController(props: AudioControllerProps) {
  const [,get] = useKeyboardControls();
  const jsControls = useJoystickControls();
  const {positionalAudioRef} = props;

  useEffect(() => {
    if(positionalAudioRef) {
      // console.log(positionalAudioRef.current.getVolume())
      positionalAudioRef.current.setVolume(1.2)
    }
  }, [positionalAudioRef])

  useFrame(() => {
    const movement = { x: 0, z: 0};
    const { joystickDis } = jsControls.getJoystickValues()
    // console.log(joystickDis)
    if (get().forward) movement.z = 1;
    if (get().backward) movement.z = -1;
    if (get().leftward) movement.x = 1;
    if (get().rightward) movement.x = -1;
    if(movement.x !== 0 || movement.z !== 0 || joystickDis) {
      if(positionalAudioRef){
        positionalAudioRef.current.play();
        positionalAudioRef.current.setLoop(true);
      }
    } else {
      if(positionalAudioRef){
        positionalAudioRef.current.pause(); // Pause instead of stop to avoid sawtooth
      }
    }
  })
  return (null)
}
