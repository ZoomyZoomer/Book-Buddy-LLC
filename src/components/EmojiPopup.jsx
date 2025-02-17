import React, { useEffect, useState } from 'react'
import '../emojistyles.css'
import axios from 'axios'
import { useRef } from 'react'

const EmojiPopup = ( {popupInfo, setPopupInfo, username, setFetchPopup}) => {

  const [reward, setReward] = useState(null);
  const [openedReward, setOpenedReward] = useState(false);
  const [file, setFile] = useState(null);
  const [showReward, setShowReward] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const audioRef = useRef(null);
  const audioRef2 = useRef(null);
  const [mutex, setMutex] = useState(false);
  const [displayDelay, setDisplayDelay] = useState(true);

  const rewards = new Map([
    [0, {name: 'Shopping Bag', desc: 'An abnormally light shopping bag... Is it empty?', color: '#918FF3', img: 'shopping-bag', id: 0}],
    [1, {name: 'Small Present', desc: 'A tiny present holding a tiny reward... probably', color: '#FE8BA9', img: 'present_icon', id: 1}]
  ])

  const fileMap = new Map([
    [0, {name: 'Certificate', id: '20', value: 28, rarity: 'Rare', display: 'file_2', desc: `"Proof that you’ve mastered something—at least on paper!"`}],
    [1, {name: 'Diploma', id: '40', value: 58, rarity: 'Epic', display: 'file_5', desc: `"A rare testament to your dedication and achievement, a symbol of hard-earned knowledge and success."`}]
  ])

  const handleClick = async() => {

    if (popupInfo.reward){
      setReward(rewards.get(1));
      return;
    }

    await axios.post('/api/updatePopup', {
      username,
      id: popupInfo.id
    })

    setPopupInfo(null);
    setFetchPopup(prev => !prev);

  }

  const playAudio = () => {
    try {
        audioRef.current.volume = 0.1;
        audioRef.current.play();
    } catch (e) {
        console.error("Error playing audio", e);
    }
  };

  const playAudio2 = () => {
    try {
        audioRef2.current.volume = 0.1;
        audioRef2.current.play();
    } catch (e) {
        console.error("Error playing audio", e);
    }
  };

  const openReward = async() => {

    setOpenedReward(true);
    playAudio2();

    const file_item = fileMap.get(Math.round(Math.random()));
    setFile(file_item);

    setTimeout(() => {
      setOpenedReward(false);
      setReward(null);
      setShowReward(true);
      setTimeout(() => {
        setIsHovering(true);
      }, 1000)
      setTimeout(() => {
        setDisplayDelay(false);
        playAudio();
      }, 260)
    }, 2800)

    // Register item as claimed
    await axios.post('/api/addFile', {
      username,
      id: file_item.id,
      quantity: 1
    })

    await axios.post('/api/updatePopup', {
      username,
      id: popupInfo.id
    })


  }

  useEffect(() => {
    if (!mutex){
      setMutex(true);
      playAudio();
    }
  },[])

  const closeReward = async() => {

    await axios.post('/api/updatePopup', {
      username,
      id: popupInfo.id
    })

    setPopupInfo(null);
    setFetchPopup(prev => !prev);

  }


  return (
    <div className='n-emoji-container' style={{width: reward && '20rem', height: showReward ? '21rem' : openedReward ? ' 16rem' : reward && '20rem'}}>

      <audio ref={audioRef}>
        <source src="popup-sound.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      <audio ref={audioRef2}>
        <source src="popon-sound.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

        {!reward && !showReward && (<div style={{height: '100%', width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

            <div style={{bottom: '80%', position: 'absolute', display: 'flex'}}>

              <img src={`/${popupInfo.img}.png`} style={{height: '7rem'}}/>

              <div className='emoji-partcle-0' style={{backgroundColor: popupInfo.colors.c_0}}/>
              <div className='emoji-partcle-0-1' style={{backgroundColor: popupInfo.colors.c_1}}/>
              <div className='emoji-partcle-1' style={{backgroundColor: popupInfo.colors.c_2}}/>
              <img src={`/mini_star_${popupInfo.id}_0.png`} className='emoji-partcle-1-1'/>
              <div className='emoji-partcle-2' style={{backgroundColor: popupInfo.colors.c_1}}/>
              <div className='emoji-partcle-2-1' style={{backgroundColor: popupInfo.colors.c_3}}/>
              <img src={`/mini_star_${popupInfo.id}_1.png`} className='emoji-partcle-3-0'/>
              <div className='emoji-partcle-3-1' style={{backgroundColor: popupInfo.colors.c_4}}/>

            </div>

            <div className='n-emoji-title' style={{color: popupInfo.colors.main}}>{popupInfo.name}</div>
            <div className='n-emoji-desc'>{popupInfo.desc}</div>
            <button className='n-emoji-btn' style={{backgroundColor: popupInfo.colors.main}} onClick={() => handleClick()}>{popupInfo.button_desc}</button>

        </div>)}

        {reward && (
          <>
            {!openedReward && <div className='n-emoji-title' style={{marginTop: '2rem', color: reward.color}}>{reward.name}</div>}
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '4rem', position: 'relative'}}>
              <img src={`/${reward.img}.png`} style={{height: '6rem', zIndex: '89', cursor: 'pointer', marginTop: openedReward && '1rem'}} className={openedReward ? 'n-open-reward' : 'gift-active'} onClick={() => openReward()}/>
              <div className='strobe-anim-3' style={{position: 'absolute', left: '-2rem', bottom: '1.6rem', height: '5.4rem', width: '5.4rem', borderRadius: '100%', backgroundColor: '#FE8BA9', opacity: '0.25'}}/>
              <div className='strobe-anim-2' style={{position: 'absolute', right: '-2rem', bottom: '0.2rem', height: '6.4rem', width: '6.4rem', borderRadius: '100%', backgroundColor: '#918FF3', opacity: '0.25'}}/>
              <div className='strobe-anim' style={{position: 'absolute', right: '0rem', bottom: '4rem', height: '4.4rem', width: '4.4rem', borderRadius: '100%', backgroundColor: '#80D1B4', opacity: '0.25'}}/>
            </div>
            {!openedReward && <div className='n-emoji-desc' style={{marginTop: '2rem'}}>{reward.desc}</div>}
          </>
        )}

        {showReward && !displayDelay && (
          <>
            <div className='n-emoji-title' style={{marginTop: '2rem'}}>★ {file.name} ★</div>
            <div style={{color: '#918FF3', marginTop: '0.2rem'}}>{file.rarity}</div>
            <div style={{position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <img src={`/${file.display}.png`} className={!isHovering ? 'n-emoji-reward' : 'n-emoji-reward-hover'}/>
              <div className='hover-shadow'/>
            </div>
            <button className='n-emoji-btn' style={{marginTop: '4rem'}} onClick={() => closeReward()}>Wowow</button>
          </>
        )}

    </div>
  )
}

export default EmojiPopup