import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";
import grassHIGHMODEL from '/assets/grass/iGrass2.glb?url';

const LODDISTANCETHRESHHOLD = 501;

export function useGrassLOD(chunkPos: {x: number, y: number, z: number} ){
  const grassHIGHLOD = useGLTF(grassHIGHMODEL);
  const grassGeometry = useRef(grassHIGHLOD.nodes.grass.geometry);
  // const { camera } = useThree();
  // const grassLOWLOD = useGLTF('/assets/grass/grassLowLOD1.glb');

  // const cameraPos = new Vector3();
  // camera.getWorldPosition(cameraPos);
  // const distanceFromPlayer = cameraPos.distanceToSquared(chunkPos);
  // if(distanceFromPlayer >= LODDISTANCETHRESHHOLD ){
  //   grassGeometry.current = grassLOWLOD.nodes.grassLowLOD1.geometry
  // }
  return grassGeometry;
}