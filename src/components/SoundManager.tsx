
import * as THREE from 'three';
import { useEffect, useRef } from "react";
import { useGlobalStore } from "../store/GlobalStore";
import windAmbientSound from '/assets/audio/WindSfx.mp3?url';
import { useThree } from '@react-three/fiber';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap/gsap-core';

export function SoundManager(){
  const { experienceStarted } = useGlobalStore();
  const { camera } = useThree();
  const { contextSafe } = useGSAP();
  const windVolume = useRef(0.3);
  useEffect(() => {
    if(experienceStarted) {
      // create an AudioListener and add it to the camera
      const listener = new THREE.AudioListener();
      camera.add( listener );
      // create a global audio source
      const sound = new THREE.Audio( listener );
      const fadeInSound = contextSafe(() => {
        sound.setVolume(0.0);
        gsap.to(windVolume, {
          current: 0.6,
          duration: 15,
          onUpdate: () => {
            sound.setVolume(windVolume.current)
          },
          onComplete: () => {
            sound.setVolume(0.6);
          },
          ease: 'power1.in'
        })
      })
      // load a sound and set it as the Audio object's buffer
      const audioLoader = new THREE.AudioLoader();
      audioLoader.load( windAmbientSound, function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.setVolume(0.0);
        sound.play();
      });
      fadeInSound()
    }
  }, [experienceStarted])

  return(
    null
  );
}