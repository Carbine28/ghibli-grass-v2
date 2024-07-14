import './credits.css';
import githubIcon from '/assets/credits/githubIcon96.png';

export default function Credits() {
  return (<div className='creditsContainer'>
    <div className='iconContainer'><a target='_blank' href='https://github.com/Carbine28'><img className='iconImg' src={githubIcon}/></a></div>
  </div>
  )
}

// * For later on for assets credits
//<a target="_blank" href="https://icons8.com/icon/AZOZNnY73haj/github">GitHub</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>