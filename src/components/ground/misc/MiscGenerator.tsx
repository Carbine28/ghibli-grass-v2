import { useThree } from '@react-three/fiber';
import { MutableRefObject, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GenerateIntRange } from '../../../utils/GenerateIntRange';
import { BerryFlower } from './berryFlower';
import { GreenFlower } from './greenFlower';
import { RedFlower } from './RedFlower';
import { VioletFlower } from './violetFlower';
import { YellowBerryFlower } from './yellowBerryFlower';
import { YellowFlower } from './yellowFlower';

type MiscGeneratorProps = {
  groundGeoRef: MutableRefObject<THREE.PlaneGeometry>
}

export default function MiscGenerator(props: MiscGeneratorProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const numMiscs = useRef(Math.floor(Math.random() * 4))
  const canGenerateMiscs = useRef(Math.random() * 2);
  const numMiscsRef = useRef<[]>([]);
  const {groundGeoRef} = props;

  // useEffect(() => {
  //   const generateMisc = (posArray: THREE.TypedArray[] ) => {
  //     const len = Math.floor(posArray.length / 3);
  //     const xInd = GenerateIntRange(0, len - 1);
  //     const xPos = posArray[xInd];
  //     const yPos = posArray[xInd + 2];
  //     const zPos = posArray[xInd + 1];
  //     const miscItem = GenerateIntRange(0, 5);
      // switch(miscItem){
      //   case 0:
      //     break;
      //   case 1:
      //     break;
      //   case 2:
      //     break;
      //   case 3:
      //     break;
      //   case 4:
      //     break;
      //   case 5:
      //     break;
  //     }
  //   }

  //   if(groundGeoRef){
  //     if(canGenerateMiscs.current > 1.0){
  //       const posArr = groundGeoRef.current.getAttribute('position').array;
  //       while(numMiscs.current){
  //         generateMisc(posArr);
  //         numMiscs.current -= 1;
  //       }
  //       console.log('finished generating misc');
  //     }
  //   }
  //   return () => {
  //     // Dispose of any props here
  //     if(groupRef){
  //       const group = groupRef.current;
  //       scene.remove(group);
  //     }
  //   }
  // }, [groundGeoRef])

  const generateItems = () => {
    if(!groundGeoRef && (canGenerateMiscs.current < 1)) return null;
    const posArr = groundGeoRef.current.getAttribute('position').array;
    const len = Math.floor(posArr.length / 3);
    const xInd = GenerateIntRange(0, len - 1);
    const xPos = posArr[xInd];
    const yPos = posArr[xInd + 2];
    const zPos = posArr[xInd + 1];
    const miscItem = GenerateIntRange(0, 5);
    switch(miscItem){
      case 0:
        return (<BerryFlower key={`${xPos}-${yPos}-${zPos}`} position={[xPos, yPos, zPos]}/>)
      case 1:
        return (<GreenFlower key={`${xPos}-${yPos}-${zPos}`}  position={[xPos, yPos, zPos]}/>)
      case 2:
        return (<RedFlower key={`${xPos}-${yPos}-${zPos}`} position={[xPos, yPos, zPos]}/>)
      case 3:
        return (<VioletFlower key={`${xPos}-${yPos}-${zPos}`} position={[xPos, yPos, zPos]}/>)
      case 4:
        return (<YellowBerryFlower key={`${xPos}-${yPos}-${zPos}`} position={[xPos, yPos, zPos]}/>)
      case 5:
        return (<YellowFlower key={`${xPos}-${yPos}-${zPos}`}  position={[xPos, yPos, zPos]}/>)
      default:
        return (null)
    }
  }
  return (<group ref={groupRef}>
    // * Method doesnt work due to react rerendering when chunks gets updated. every chunk will get rerendered atm
    {/* {Array(numMiscsRef.current).fill(0).map((_,) => (
      generateItems()
    ))
    } */}
  </group>
  )
}
