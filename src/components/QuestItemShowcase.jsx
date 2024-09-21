import React from 'react'
import { useState, useRef } from 'react';

const QuestItemShowcase = ({quest, index}) => {

    const [questClaimed, setQuestClaimed] = useState(false);

    const handleClaim = () => {
        if (!questClaimed){
            const elem = document.getElementById(`landing-quest-${index}`);
            elem.classList.remove('claim-quest-item');
            elem.classList.add('landing-unbox');

            setTimeout(() => {
                playAudioRefPop();
                setQuestClaimed(true);
            }, 900)

        }
    }

    const audioRefPop = useRef(null);
    const playAudioRefPop = () => {
        audioRefPop.current.volume = 0.1;
        audioRefPop.current.play();
    };

return (
    <div className='quest-item-container2' onClick={() => handleClaim()}>

        <audio ref={audioRefPop} src="/pop.mp3" />

        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'center', width: '75%'}}>
            <div className='qi-0'>
                <div>{quest.title}:&nbsp;</div>
                <div className='qi-2'>{quest.quest}</div>
            </div>
            <div className='quest-item-flex'>
                <div className='quest-item-bar'>
                    <div id={`quest-bar-${index}`} className='quest-item-bar-abs'/>
                </div>
            </div>
            <div className='qi-3'>
                {quest.quantity_required}/{quest.quantity_required}
            </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '25%'}}>
            <div className={`${(quest.quantity_required / quest.quantity_required) >= 1 ? 'claim-quest-item-background' : 'quest-item-background'}`} style={{marginLeft: '10%'}}>
                <img id={`landing-quest-${index}`} src={questClaimed ? '/package_opened.png' : '/package_icon.png'} style={{height: '3rem', marginTop: '0.2rem'}} draggable='false' className={`${(quest.quantity_required / quest.quantity_required) >= 1 && !questClaimed ? 'claim-quest-item' : ''}`}/>
            </div>
        </div>

    </div>
)

}

export default QuestItemShowcase