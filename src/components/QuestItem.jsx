import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'

const QuestItem = ({index, quest, activeQuest, setShowItemPopup, username, setReFetchQuests}) => {

    useEffect(() => {

        if (!quest || !activeQuest) return;
        document.getElementById(`quest-bar-${index}`).style.width = `${(activeQuest.quantity_achieved / quest.quantity_required) > 1 ? 1 * 100 : (activeQuest.quantity_achieved / quest.quantity_required) * 100}%`;

    }, [quest, index])

    const handleClick = async() => {

        if (activeQuest.quantity_achieved / quest.quantity_required >= 1 ) {

            if (!activeQuest.claimed){
                setShowItemPopup(true);

                await axios.post('/api/markClaimed', {
                    username,
                    index
                })

                setReFetchQuests(prev => !prev);

            }

        }

    }


  return (
    <div className='quest-item-container' onClick={() => handleClick()}>

        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'center', width: '75%'}}>
            <div className='qi-0'>
                <div>{quest ? quest.title : 'Quest'}:&nbsp;</div>
                <div className='qi-2'>{quest ? quest.quest : 'Loading Details...'}</div>
            </div>
            <div className='quest-item-flex'>
                <div className='quest-item-bar'>
                    <div id={`quest-bar-${index}`} className='quest-item-bar-abs'/>
                </div>
            </div>
            <div className='qi-3'>
                {activeQuest ? activeQuest.quantity_achieved : '?'}/{quest ? quest.quantity_required : '??'}
            </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '25%'}}>
            {quest && activeQuest && (
                <div className={`${(activeQuest.quantity_achieved / quest.quantity_required) >= 1 ? 'claim-quest-item-background' : 'quest-item-background'}`} style={{marginLeft: '10%'}}>
                    <img src={activeQuest.claimed ? '/package_opened.png' : '/package_icon.png'} style={{marginTop: '0.2rem'}} draggable='false' className={`${(activeQuest.quantity_achieved / quest.quantity_required) >= 1 && !activeQuest.claimed ? 'claim-quest-item quest-img-0' : 'quest-img-0'}`}/>
                </div>
            )}
            {(!quest || !activeQuest) && (
                <div className='quest-item-background' style={{marginLeft: '10%'}}>
                    <img src='package_icon.png' style={{marginTop: '0.2rem'}} draggable='false' className='quest-img-0'/>
                </div>
            )}
            
        </div>

    </div>
  )
}

export default QuestItem