import * as THREE from 'three';
import { useEffect, useRef, useState } from "react";
import { useHelper } from "@react-three/drei";
import { DirectionalLight } from "three";
import { useControls } from 'leva';
import { useFrame } from '@react-three/fiber';
import { EVENTS } from '../../data/EVENTS';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { GLOBAL_CONFIG } from '../../data/GLOBAL_CONFIG';

const SUNPOSITION = {
  x: -237,
  y: 240,
  z: -141
}
const SUN_DOWN_YPOSITION = -10;

const MOON_POSITION = {
  x: 2,
  y: 141,
  z: 240
}
const MOON_DOWN_YPOSITION = -10;

const DAY_INTENSITY = 1.4;
const NIGHT_INTENSITY = 0.4;

export function Lights() {  
  const dayDirectionalLight = useRef<DirectionalLight>(null!);
  const nightDirectionalLight = useRef<DirectionalLight>(null!);
  const ambientRef = useRef<THREE.AmbientLight>(null!);

  const dayGroup = useRef<THREE.Group>(null!);
  const nightGroup = useRef<THREE.Group>(null!);
  // const {x, y, z} = useControls('Light Controls', {
  //   x: {value: 0, step: 1},
  //   y: {value: 0, step: 1},
  //   z: {value: 0, step: 1},
  // })
  // const {x, y, z} = useControls('Light Controls', {
  //   x: {value: -237, step: 1, onChange: (x) => {
  //     dayDirectionalLight.current.position.x = x;
  //   }},
  //   y: {value: 240,  step: 1, onChange: (y) => {
  //     dayDirectionalLight.current.position.y = y;
  //   }},
  //   z: {value: -141,  step: 1, onChange: (z) => {
  //     dayDirectionalLight.current.position.z = z;
  //   }},
  // })

  const cameraPos = useRef(new THREE.Vector3());
  const target = useRef<THREE.Group>(null!);
  const updateTarget = useRef<number>();
  const { contextSafe} = useGSAP();

  // Update the shadow camera of directional light periodically, better than settings massive values for shadowcamera.
  useEffect(() => {
    const modifyTargetPosition = () => {
      if(target.current){
        dayDirectionalLight.current.target = target.current;
        nightDirectionalLight.current.target = target.current;
      }
    }
    updateTarget.current = window.setInterval(modifyTargetPosition, 1000 );
    return () => {
      window.clearInterval(updateTarget.current);
    }
  }, [])
  
  useEffect(() => {
    if(nightGroup.current) {
      nightGroup.current.visible = false;
    }
    const changeLightsToDay = contextSafe(() => {
      dayGroup.current.visible = true;
      //
      gsap.to(nightDirectionalLight.current.position, { y: MOON_DOWN_YPOSITION, duration: GLOBAL_CONFIG.DAYNIGHTCONFIG.NIGHT_TO_DAY_TRANSITION,
        onComplete: () => {
          nightGroup.current.visible = false;
        }
      });
      //
      dayDirectionalLight.current.visible = true;
      gsap.to(ambientRef.current, {intensity: DAY_INTENSITY, duration: GLOBAL_CONFIG.DAYNIGHTCONFIG.NIGHT_TO_DAY_TRANSITION})
      gsap.to(dayDirectionalLight.current.position, { y: SUNPOSITION.y, duration: GLOBAL_CONFIG.DAYNIGHTCONFIG.NIGHT_TO_DAY_TRANSITION,
        onComplete: () => {
          dayDirectionalLight.current.visible = true;
        }
      });
    })

    const changeLightsToNight = contextSafe(() => {
      nightGroup.current.visible = true;
      gsap.to(dayDirectionalLight.current.position, { y: SUN_DOWN_YPOSITION, duration: GLOBAL_CONFIG.DAYNIGHTCONFIG.DAY_TO_NIGHT_TRANSITION, 
        onComplete: () => {
          dayGroup.current.visible = false;
        }
      });
      //
      gsap.to(ambientRef.current, {intensity: NIGHT_INTENSITY, duration: GLOBAL_CONFIG.DAYNIGHTCONFIG.DAY_TO_NIGHT_TRANSITION})
      gsap.to(nightDirectionalLight.current.position, { y: MOON_POSITION.y, duration: GLOBAL_CONFIG.DAYNIGHTCONFIG.DAY_TO_NIGHT_TRANSITION});

    })

    window.addEventListener(EVENTS.dayTime, changeLightsToDay);
    window.addEventListener(EVENTS.nightTime, changeLightsToNight);
    return () => {
      window.removeEventListener(EVENTS.dayTime, changeLightsToDay);
      window.removeEventListener(EVENTS.nightTime, changeLightsToNight);
    }
  }, [])


  useFrame(({camera}) => {
    if(cameraPos.current) {
      camera.getWorldPosition(cameraPos.current)
      target.current.position.set(cameraPos.current.x, cameraPos.current.y,  cameraPos.current.z);
    }
  })
  
  // useHelper(dayDirectionalLight, THREE.DirectionalLightHelper, 1.0);
  // useHelper(nightDirectionalLight, THREE.DirectionalLightHelper, 1.0);

  return <>
    <ambientLight ref={ambientRef} intensity={DAY_INTENSITY}/>
    <group ref={dayGroup} name="dayLights">
      <directionalLight name='sun' castShadow ref={dayDirectionalLight} position={[SUNPOSITION.x, SUNPOSITION.y, SUNPOSITION.z]}
      intensity={2.2} />
      {/* /* <directionalLight castShadow ref={dayDirectionalLight} position={[x * SUNDISTANCE, y * SUNDISTANCE, z * SUNDISTANCE]}  */}
    </group>
    <group ref={nightGroup} name="nightLights">
      <directionalLight name='moon' castShadow ref={nightDirectionalLight} position={[MOON_POSITION.x, MOON_POSITION.y, MOON_POSITION.z]}
      intensity={NIGHT_INTENSITY}
      />
    </group>
    <group ref={target} name='target'></group>
  </>
}