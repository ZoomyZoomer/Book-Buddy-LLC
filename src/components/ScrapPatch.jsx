import React from 'react'
import { useState } from 'react'

const ScrapPatch = ({patch, claimed, index}) => {

  const [patchClicked, setPatchClicked] = useState(false);
  const [showText, setShowText] = useState(false);

  const clickPatch = () => {
    if (claimed){
      if (patchClicked){
        closePatch();
      } else {
        setPatchClicked(prev => !prev);
        setTimeout(() => {
          setShowText(true);
        }, 450)
      }
    }
  }

  const closePatch = () => {
    document?.getElementsByClassName('n-patch-clicked')[0]?.classList.add('n-patch-close');
    document?.getElementsByClassName('n-patch-clicked-end')[0]?.classList.add('n-patch-close-end');
    document?.getElementsByClassName('n-patch-clicked')[0]?.classList.remove('n-patch-clicked');
    document?.getElementsByClassName('n-patch-clicked-end')[0]?.classList.remove('n-patch-clicked-end');
    setTimeout(() => {
      setShowText(false);
    }, 50)
    setTimeout(() => {
      setPatchClicked(false);
    }, 500)
  }

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', transform: 'scale(0.8125)', zIndex: patchClicked ? '20' : '2'}} className={claimed ? 'n-patch-claimed' : 'n-patch-unclaimed'} onMouseLeave={() => closePatch()} onClick={() => clickPatch()}>
        
        {patchClicked && (index === 0 ? true : index % 2 !== 0) && <div className='n-patch-clicked'>
          {showText && (
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'center', marginLeft: '2rem'}}>
              <div style={{fontWeight: '600'}}>★ {patch.name}</div>
              <div style={{fontWeight: '400', color: '#808893', fontSize: '0.8125rem', marginTop: '0.2rem'}}>{patch.desc}</div>
            </div>
          )}
          
        </div>}
        {patchClicked && (index === 0 ? false : index % 2 === 0) && <div className='n-patch-clicked-end'>
          {showText && (
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'center', marginRight: '2rem'}}>
              <div style={{fontWeight: '600'}}>★ {patch.name}</div>
              <div style={{fontWeight: '400', color: '#808893', fontSize: '0.8125rem', marginTop: '0.2rem'}}>{patch.desc}</div>
            </div>
          )}
        </div>}
        
        <div className='patch_1-alt' style={{zIndex: '200', animation: 'none'}}>
            <div className='patch_1_sub' style={{zIndex: '200'}}>
                <div style={{backgroundColor: '#E6E6E6', height: '60%', width: '60%', borderRadius: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginTop: '0.4rem', marginLeft: '0.4rem', zIndex: '200'}}>
                    <img src={`/${patch.src}.png`} style={{position: 'absolute', height: '3rem', bottom: '4%', right: '0%', zIndex: '200'}}/>
                </div>            
            </div>
        </div>
    </div>
  )
}

export default ScrapPatch