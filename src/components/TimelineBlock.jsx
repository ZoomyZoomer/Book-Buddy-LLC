import React, { useRef } from 'react'
import '../timeline.css';
import { useState, useEffect } from 'react';
import {ReactComponent as Centerdot} from '../center_dot.svg'
import {ReactComponent as CloseIcon} from '../close_icon.svg'
import {ReactComponent as FireIcon} from '../fire_icon_black.svg'

function TimelineBlock({icon, streak, date, pages_added, new_page_total, index, lastElem, setShowPopup, removeEntry, popUp, viewItem, alert}) {

  const [showIcon, setShowIcon] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const firstMount = useRef(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowIcon(true);
    }, 140 * index); // Adjust the timeout duration as needed

    return () => clearTimeout(timeout); // Clean up timeout on unmount or state change
  }, []); // Run effect only once on component mount

  useEffect(() => {
    if (firstMount.current) {
      setTimeout(() => {
        firstMount.current = false;
      }, 1000)
    }
  }, []);

  const activate_block = () => {

    if (icon !== undefined){
      document.getElementById(`block_${index}`).classList.add('timeline_block_active');
      document?.getElementById(`block_info_${index}`)?.classList?.remove('no_opacity');
      document?.getElementById(`block_info_${index}`)?.classList?.add('info_active');
    }

    

  }

  const handle_show_info = () => {

    document.getElementById('chatbox-rect').classList.add('chatbox-rect-extend');
    document.getElementsByClassName('chatbox-container')[0].classList.add('info_container_extend');
    setShowInfo(true);

  }

  const handle_close = () => {

    document.getElementById('chatbox-rect').classList.remove('chatbox-rect-extend');
    document.getElementsByClassName('chatbox-container')[0].classList.remove('info_container_extend');
    document?.getElementsByClassName('info_active')[0]?.classList?.add('no_opacity');
    setTimeout(() => {
      document?.getElementsByClassName('info_active')[0]?.classList?.remove('info_active');
    }, 40)
    
    setShowInfo(false);

  }


  return (
    <div id={`block_${index}`} className="timeline_block" onClick={() => activate_block()}>
      {showIcon && icon && firstMount.current ? 
      <img id={`timeline_icon_${index}`}src={`/${icon?.name}.png`} className="timeline_icon" /> :
       showIcon && icon && <img id={`timeline_icon_${index}`}src={`/${icon?.name}.png`} className="timeline_icon_no_anim" />}
       

        <div  id={`block_info_${index}`} className={"timeline_block_info_container" + " " + "no_opacity"}>
        <div id="box" className="chatbox-container">
          <div  id="chatbox-rect" className="chatbox-rect">
            <div id="box" className="chatbox-grid">
              
              <div id="box" className="chatbox-maintext">
                
                <div id="box">{icon?.display}</div>
                <div id="box" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-6px', marginRight: '-6px'}}><Centerdot /></div> 
                Tier {icon?.tier}
                <div id="box" className={`chatbox-rarity-${icon?.rarity}`}>
                  <div id="box" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                    {icon?.rarity}
                  </div>
                </div>
        
              </div>
              
              <div id="box" className="chatbox-info-container">
                <div id='box' style={{display: 'flex', justifyContent: 'left', alignItems: 'center', marginTop: '14px'}}>

                  <div id='box' style={{display: 'flex', justifyContent: 'left', alignItems: 'center', marginLeft: '-8px'}}>
                    <img id='box' src={`/${icon?.name}.png`} style={{height: '96px'}}/>
                  </div>

                  <div id='box' style={{display: 'flex', justifyContent: 'left', alignItems: 'left', flexDirection: 'column', marginLeft: '12px'}}>

                      <div id='box' className="chatbox-entry-info">
                        <div id='box'>Entry Info:</div>
                      </div>
                      <div id='box' className="date">{`${date?.month} ${date?.day}, ${date?.year} (${pages_added} pages)`} </div>
                      <div id='box' className="streak">
                        <div id='box' style={{display: 'flex'}}><FireIcon /></div>
                        <div id='box'>Streak:</div>
                      </div>
                      <div id='box' className="date">
                        {`${streak} ${streak > 1 ? 'days!!!' : streak === 1 ? 'day!' : 'days'} (${date?.month} ${date?.day} - ${date?.month} ${date?.day - streak})`}
                      </div>
              
                  </div>
                </div>
                <div id='box' className='remove-entry-container'>
                  <div id='box' className="view-item" onClick={() => viewItem(index)}>View Item</div>
                  <button id='box' onClick={() => removeEntry(index)}>Remove Entry</button>
                </div>
              </div>
                
            </div>
            <div id="chatbox-close" className="chatbox-close" onClick={() => handle_close()}>
              <CloseIcon />
            </div>
          </div>
          <div id='triangle' className="chatbox-triangle"></div>
        </div>
       </div>
       
    </div>
  )
}

export default TimelineBlock