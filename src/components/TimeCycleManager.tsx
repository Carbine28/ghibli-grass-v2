import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react";
import { useGlobalStore } from "../store/GlobalStore";
import { EVENTS } from "../data/EVENTS";


const DAYDURATION = 60 * 0.5;
const NIGHTDURATION = 60 * 0.5;
const TOTAL_DURATION =  DAYDURATION + NIGHTDURATION;

export default function TimeCycleManager() {
  const { experienceStarted, time, setTime } = useGlobalStore();
  const currentTime = useRef(0);
 
  useFrame((state, delta) => {
    if(experienceStarted){
      currentTime.current += delta;
      const timeOfDay = currentTime.current % TOTAL_DURATION;
      if(timeOfDay < DAYDURATION){
        // console.log('day time')
        if(time === "night"){
          const dayEvent = new Event(EVENTS.dayTime);
          window.dispatchEvent(dayEvent);
          setTime("day");
        }
      } else {
        // console.log('night time');
        if(time === "day"){
          const nightEvent = new Event(EVENTS.nightTime);
          window.dispatchEvent(nightEvent);
          setTime("night");
        }
      }
    }
  })
  
  return ( null )
}
