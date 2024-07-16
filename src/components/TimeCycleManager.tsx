import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react";
import { useGlobalStore } from "../store/GlobalStore";


const DAYDURATION = 60 * 2.5;
const NIGHTDURATION = 60 * 2.5;
const TOTAL_DURATION =  DAYDURATION + NIGHTDURATION;

export default function TimeCycleManager() {
  const { experienceStarted } = useGlobalStore();
  const currentTime = useRef(0);
 
  useFrame((state, delta) => {
    if(experienceStarted){
      currentTime.current += delta;
      const timeOfDay = currentTime.current % TOTAL_DURATION;
      if(timeOfDay < DAYDURATION){
        // console.log('day time')
      } else {
        // console.log('night time');
      }
    }
  })
  
  return ( null )
}
