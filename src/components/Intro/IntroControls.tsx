import { useState, useEffect } from 'react';
import { useGlobalStore } from '../../store/GlobalStore';
import cursorImg from '/assets/totoro/cursorImg.png';
import cursor2Img from '/assets/totoro/dustBunny.png';
import './IntroControls.css'
import { EVENTS } from '../../data/EVENTS';

export default function IntroControls() {
  const [ cursorPosition, setCursorPosition ] = useState({x: (window.innerWidth/ 2), y: (window.innerHeight/2)})
  const [ transitioned, setTransitioned ] = useState(false);
  const { toggleExperienceStarted } = useGlobalStore();

  useEffect(() => {
    const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
      if(transitioned) return;
      setCursorPosition({x:e.clientX, y:e.clientY});
    }
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [transitioned])

  const handleExperienceStart = () => {
    // console.log('Starting Experience!');
    const pointerElement = document.querySelector('.pointer') as HTMLElement;
    if(pointerElement){
      pointerElement.classList.add('hidden');
      window.setTimeout(() => {
        pointerElement.style.visibility = 'hidden';
      }, 1000)
    }
    
    setTimeout(() => {
      const transitionOut = new Event(EVENTS.outlineTransitionOut);
      window.dispatchEvent(transitionOut);
    }, 300)

    setTimeout(() => {
      setTransitioned(true);
      const toPerspective = new Event(EVENTS.perspective);
      window.dispatchEvent(toPerspective);
      toggleExperienceStarted();
    }, 1300)
  }

  if(transitioned) return null;

  return (
    <div className='pointer' style={{position: 'absolute', left: `${cursorPosition.x}px`, top: `${cursorPosition.y - 15}px`}}>
      <div className='pointerButtonContainer'><button className='pointerButton' onClick={handleExperienceStart}></button></div>
      <div className='imageContainer'>
        <img className='cursorEyesImg' src={cursor2Img}/>
        <img className='cursorTotoroImg' src={cursorImg}/>
      </div>
    </div>
  )
}
