import { Object3D } from "three";
import { create } from "zustand";

export const useGlobalStore = create((set) => ({
  playerPositionRef: null,
  setPlayerPositionRef: (ref : Object3D) => set({ playerPositionRef: ref}),
}))