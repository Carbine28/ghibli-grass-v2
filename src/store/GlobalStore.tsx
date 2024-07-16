import { create } from "zustand";
import { GLOBAL_ASSETS } from "../data/ASSETS";
import { MutableRefObject } from "react";
import { Group } from "three";

interface AudioCache {
  [key: string]: AudioBuffer;
}

type GlobalState = {
  experienceStarted: boolean;
  toggleExperienceStarted: () => void;
  playerMeshRef: MutableRefObject<Group> | null;
  setPlayerMeshRef: (ref: MutableRefObject<Group>) => void;
}

export const useGlobalStore = create<GlobalState>()((set) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const audioCache: AudioCache = {};
  return {
    experienceStarted: false,
    toggleExperienceStarted: () => set((state) => ({experienceStarted: !state.experienceStarted})),

    playerMeshRef: null,
    setPlayerMeshRef: (ref) => set(() => ({playerMeshRef: ref})),

    playSoundEffect: async (soundId: string | undefined) => {
      try {
        if(!soundId) return;
        if(!useGlobalStore.getState().experienceStarted) return;
        // Ensure AudioContext is resumed if suspended
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        
        const sound = GLOBAL_ASSETS.SOUNDS[soundId];
        const soundPath = sound.assetUrl;

        let audioBuffer = audioCache[soundPath];
        if (!audioBuffer) {
          // Fetch and decode the audio file
          const response = await fetch(soundPath);
          const arrayBuffer = await response.arrayBuffer();
          audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          audioCache[soundPath] = audioBuffer;
        }

        // Create a buffer source
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        // // Add pitch variance
        // const minPitch = sound?.lowPitch ? sound.lowPitch : 0.8; // Adjust as needed
        // const maxPitch = sound?.highPitch ? sound.highPitch : 1.1;

        // const randomPitch = Math.random() * (maxPitch - minPitch) + minPitch;
        // source.playbackRate.value = randomPitch;

        // Connect the source to the audio context's destination (speakers)
        source.connect(audioContext.destination);

        // Start playing the sound
        source.start(0);
      } catch (error) {
        console.log(`Error playing sound: ${error}`)
      }
      
    },
  }
})