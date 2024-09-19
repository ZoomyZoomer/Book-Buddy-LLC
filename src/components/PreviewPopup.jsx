import React from 'react'
import { useState } from 'react'
import {ReactComponent as FireIcon} from '../fire_icon_black.svg'
import {ReactComponent as Close} from '../close_icon_red.svg'
import {ReactComponent as CheckMark} from '../check.svg'
import axios from 'axios'

const PreviewPopup = ({setPreviewPopup, entryDate, pages_added, total_pages_read, streak, username, tab_name, volume_id, hasFetchedProfile}) => {

    const [feeling, setFeeling] = useState('');
    const [showText, setShowText] = useState(true);
    const [showCheck, setShowCheck] = useState(false);

    const submitEntry = async() => {

        await axios.post('http://localhost:4000/send-entry', {
            username,
            tab_name,
            volume_id,
            pages_added,
            total_pages_read: Number(total_pages_read),
            feeling
        })

        setShowText(false);

        document.getElementsByClassName('entry-load-bar')[0].classList.add('load-anim')

        setTimeout(() => {

            document.getElementsByClassName('entry-load-bar')[0].style.width = '100%';
            setShowCheck(true);

            setTimeout(() => {
                document?.getElementById('item_0')?.classList?.remove('timeline-item-icon');
                document?.getElementById('item_0')?.classList?.add('timeline-item-icon-no-anim');
                setTimeout(() => {
                    document?.getElementById('item_0')?.classList?.remove('timeline-item-icon-no-anim');
                    document?.getElementById('item_0')?.classList?.add('timeline-item-icon');
                }, 10)
                hasFetchedProfile.current = false;
                setPreviewPopup(false);
            }, 1999)
            

        }, 2990)

        

    
        

        

    }

  return (
    <div className='preview-popup-container'>
        <div className='preview-popup-holder'>
        <div className='border-grid'>
            <div className='border-top-cont'>
                <div className='border-top'/>
            </div>
            <div className='border-flex'>
                <div className='border-left'/>
                <div className='pp-0'>
                    <div>
                            <img src='/file_1.png' style={{height: '80px'}}/>
                    </div>
                    <div className='pp-grid'>
                            <div className='pp-mini-grid'>
                                <div className='pp-bold'>Entry Info:</div>
                                <div className='pp-norm'>{`${entryDate} (${pages_added} pages)`}</div>
                            </div>
                            <div className='pp-mini-grid' style={{marginTop: '0.4rem'}}>
                                <div className='pp-bold'>
                                    <div className='pp-fire'><FireIcon /> </div>
                                    Streak:</div>
                                <div className='pp-norm'>{`${streak === 1 ? `${streak} day!` : `${streak} days!`} (June 16 - June 17)`}</div>
                            </div>
                    </div>
                </div>
                <div className='border-right-cont'>
                    <div className='border-right'/>
                </div>
            </div>
            <div className='border-bot-cont'>
                <div className='border-bot'/>
            </div>
        </div>
        <div className='entry-input-container'>
            <div className='feeling-text'>Your one sentence summary 🤔</div>
            <input 
                className='feeling-input'
                value={feeling}
                placeholder='It was exciting when...'
                onChange={(e) => setFeeling(e.target.value)}
            />
            
        </div>
            <div className='send-entry-button-container'>
                <div className='container-but'>
                    <button className='send-entry-button' onClick={() => submitEntry()}>{showText && 'Submit Entry'}</button>
                    <div className='entry-load-bar'/>
                    {showCheck && (<div className='entry-checkmark'><CheckMark /></div>)}
                    <div className='entry-close' onClick={() => setPreviewPopup(false)}>
                        <Close />
                    </div>
                </div>
                
            </div>
        </div>
    </div>
  )
}

export default PreviewPopup