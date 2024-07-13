
import * as THREE from 'three';
import { useEffect } from "react";
import { useGlobalStore } from "../store/GlobalStore";
import windAmbientSound from '/assets/audio/WindSfx.mp3?url';
import { useThree } from '@react-three/fiber';

export function SoundManager(){
  const { experienceStarted } = useGlobalStore();
  const { camera } = useThree();
  useEffect(() => {
    if(experienceStarted) {
      // create an AudioListener and add it to the camera
      const listener = new THREE.AudioListener();
      camera.add( listener );
      // create a global audio source
      const sound = new THREE.Audio( listener );
      // load a sound and set it as the Audio object's buffer
      const audioLoader = new THREE.AudioLoader();
      audioLoader.load( windAmbientSound, function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.setVolume( 0.5 );
        sound.play();
      });
    }
  }, [experienceStarted])

  return(
    null
  );
}