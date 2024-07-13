export type SoundData = {
  [id: string]: { assetUrl: string;}
}

const SOUNDS: SoundData = {
  // treeChopBig: { assetUrl: '/public/assets/audio/treeChop.mp3'},
  // treeChopSmall: { assetUrl: '/public/assets/audio/treeChop.mp3'},
  // ambientWaveSound: { assetUrl: '/public/assets/audio/wave_bg.mp3'}
}

export const GLOBAL_ASSETS = { SOUNDS}