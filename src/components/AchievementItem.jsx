import React from 'react'
import {ReactComponent as Notepad} from '../notepad.svg'
import { useState, useEffect } from 'react'
import axios from 'axios'

const AchievementItem = ({achievement, index, clientAchievements, isCompleted, username, setReFetchAchievements, errorRef, setShowError, playAudioRefPop}) => {


    const handleClick = () => {
        if (document.getElementById(`achieve-${index}`)?.classList?.contains('valid')){
            document.getElementById(`achieve-${index}`)?.classList?.remove('valid');
            document.getElementById(`achieve-${index}`)?.classList?.add('invalid');
        } else {
            document.getElementsByClassName('valid')[0]?.classList?.add('invalid');
            document.getElementsByClassName('valid')[0]?.classList?.remove('valid');
            document.getElementById(`achieve-${index}`)?.classList?.remove('invalid');
            document.getElementById(`achieve-${index}`)?.classList?.add('valid');
        }
    }

    const fillBar = () => {
        try {
            if (clientAchievements?.quantity){
                if (clientAchievements?.quantity >= achievement.quantity){
                    document.getElementById(`achieve-bar-${index}`).style.width = `${100}%`;
                document.getElementById(`achieve-bg-${index}`).style.width = `${100}%`;
                } else {
                    document.getElementById(`achieve-bar-${index}`).style.width = `${(clientAchievements?.quantity / (achievement?.quantity)) * 100}%`;
                    document.getElementById(`achieve-bg-${index}`).style.width = `${(clientAchievements?.quantity / (achievement?.quantity)) * 100}%`;
                }
            } else if (!isCompleted) {
                document.getElementById(`achieve-bar-${index}`).style.width = `${0}%`;
                document.getElementById(`achieve-bg-${index}`).style.width = `${0}%`;
            } else {
                document.getElementById(`achieve-bar-${index}`).style.width = `${100}%`;
                document.getElementById(`achieve-bg-${index}`).style.width = `${100}%`;
            }
        } catch(e) {

        }
    }

    const handleClaim = async() => {
        try {

            await axios.post('/api/claim-achievement', {
                username,
                achievement,
                clientAchievement: clientAchievements,
                isCompleted
            })

            setReFetchAchievements(prev => !prev);
            playAudioRefPop();

        } catch(e) {
            if (e.response.status === 400){
                errorRef.current = {title: 'Achievement Incomplete', message: 'You have not met the requirements to complete this achievement'};
                setShowError(true);
            } else if (e.response.status === 401){
                errorRef.current = {title: 'Achievement Already Claimed', message: "You've already claimed this achievement"};
                setShowError(true);
            } else {
                console.error({error: e});
            }
        }
    }
    
    useEffect(() => {
        fillBar();
    }, [achievement, index])

  return (
    <div className={isCompleted || clientAchievements?.quantity >= achievement?.quantity ? 'achievement-item-container-complete' : (achievement ? 'achievement-item-container' : 'achievement-item-container-load')} onClick={() => handleClick()}>

        <div id={`achieve-bg-${index}`} className='achievement-container-fill'/>

        {achievement && (<img src={`/${achievement.icon}.png`} style={{zIndex: '3'}} draggable='false' className={clientAchievements?.quantity >= achievement?.quantity && !isCompleted ? 'claim-achievement-anim achi-img' : 'achi-img'}/>
)}
        {!achievement && (<div class="loader" />)}
        
        <div id={`achieve-${index}`} className='achievement-info invalid'>
            <div className='achievement-title'>
                <div style={{display: 'flex'}}><img src={`/${achievement?.icon}.png`} style={{height: '1.2rem'}}/></div>
                <div style={{marginLeft: '0.4rem'}}>{achievement?.achievement_name} &#183; {achievement?.difficulty}</div>
            </div>
            <div className='warehouse-sep'/>
            <div className='achievement-desc'>
                <div style={{display: 'flex', marginRight: '0.2rem'}}><Notepad /></div>
                <div>{achievement?.description}</div>
            </div>
            <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '100%'}}>
                <div className='achievement-bar'>
                    <div id={`achieve-bar-${index}`} className='achievement-fill'/>
                </div>
                <div className='achievement-quant'>{isCompleted ? achievement.quantity : clientAchievements ? (clientAchievements.quantity > achievement?.quantity ? achievement?.quantity : clientAchievements.quantity) : 0}/{achievement?.quantity}</div>
            </div>
            <div className='achievement-button'>
                <button className={clientAchievements?.quantity >= achievement?.quantity ? 'add-file' : 'add-file-blocked'} onClick={() => handleClaim()}>{isCompleted ? 'Claimed' : (<>Claim &nbsp; <img src={`/${achievement?.reward?.file ? achievement?.reward.file : achievement?.reward?.item}.png`} style={{height: '1rem'}}/></> )}</button>
            </div>
        </div>
    </div>
  )
}

export default AchievementItem