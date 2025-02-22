import react, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import {ReactComponent as Dots} from '../n-notif-dots.svg'

const NotificationItem = ({notif, key, username, setFetchPopup, setReFetchNotifs}) => {

    const notificationTypes = new Map([
        [220, {id: 220, header: 'sent an accouncement', type: 'Automated Message', clickable: true}]
    ])

    const [relNotif, setRelNotif] = useState(notif);
    const [dotsDrop, setDotsDrop] = useState(false);

    useEffect(() => {
        if (!notif?.id){
            setRelNotif(notificationTypes.get(notif));
        }
    }, [])

    const audioRef = useRef(null);

    const playAudio = () => {
        try {
            audioRef.current.volume = 0.1;
            audioRef.current.play();
        } catch (e) {
            console.error("Error playing audio", e);
        }
      };

    const claimGift = async() => {

        if (notif?.claimed) return;

        await axios.post('/api/claim-gift', {
            username,
            rel_id: notif?.id
        })

        playAudio();

        setTimeout(() => {
            setFetchPopup(prev => !prev);
        }, 500)

        setReFetchNotifs(prev => !prev);

    }

    const pressButton = async() => {

        if (notif?.seen) return;

        await axios.post('/api/mark-notif-seen', {
            username,
            rel_id: notif?.id
        })

        setFetchPopup(prev => !prev);
        setReFetchNotifs(prev => !prev);

    }

    const handleImportant = async() => {

        await axios.post('/api/handle-important', {
            username,
            isImportant: notif?.important,
            rel_id: notif?.id
        })

        setFetchPopup(prev => !prev);
        setReFetchNotifs(prev => !prev);

    }

    return (
            <div className='n-notification-box'>

                {notif?.hasGift && (
                    <audio ref={audioRef}>
                        <source src="popon-sound.mp3" type="audio/mp3" />
                        Your browser does not support the audio element.
                    </audio>
                )}

                {!notif?.seen && <div className='n-new-circle'/>}

                <div style={{display: 'flex', justifyContent: 'left', width: '100%'}}>

                    <div style={{width: '3.4rem'}}>
                        <div style={{height: '3.2rem', width: '3.2rem', borderRadius: '100%', backgroundColor: 'white', border: '1px solid #83878C', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <img src='/lion-0.png' style={{height: '2rem'}}/>
                        </div>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: '1rem', width: '100%'}}>
                        <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', fontSize: '0.8125rem', width: '100%', position: 'relative'}}>
                            <div style={{fontWeight: '600', marginRight: '0.4rem'}}>@BookBuddyOfficial</div>
                            <div style={{color: '#52637D'}}>{notif?.header}</div>
                            <div className='n-notif-dots' onClick={() => setDotsDrop(prev => !prev)} onMouseLeave={() => setDotsDrop(false)}>
                                <div style={{position: 'relative', width: '100%', height: '100%'}}>
                                    <Dots />
                                    {dotsDrop && 
                                    <div className='n-notif-chart-item' onClick={() => handleImportant()}>{notif?.important ? 'Unmark Important' : 'Mark Important'}</div>}
                                </div>
                            </div>
                        </div>
                        <div style={{color: '#8892A2', fontSize: '0.7rem', marginTop: '0.2rem', fontWeight: '400'}}>{notif?.timeSent?.toLocaleDateString('en-US', { weekday: 'long' })} {notif?.timeSent?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} · {notif?.type}</div>
                    </div>
                </div>

                <div style={{display: 'flex', justifyContent: 'left', width: '100%', marginTop: '1rem'}}>
                    <div style={{height: '4rem', width: '3.4rem'}}/>
                    <div className='n-notif-message'>
                        <div>{notif?.messageContents}</div>
                        {notif?.hasButton && <button className={notif?.seen ? 'n-notif-message-button-claimed' : 'n-notif-message-button'} onClick={() => pressButton()}>{notif?.seen ? 'UNAVAILABLE' : 'START TUTORIAL'}</button>}
                        {notif?.hasGift && 
                        <div className={notif?.claimed ? 'n-gift-container-claimed' : 'n-gift-container'} onClick={() => claimGift()}>
                            <img src='/present_icon.png' style={{height: '2.2rem'}}/>
                            <div className={notif?.claimed ? 'n-gift-status-claimed' : 'n-gift-status'}>
                                <div style={{height: '100%', width: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <div style={{color: notif?.claimed ? '#454b54' : 'white'}}>{notif?.claimed ? 'Gift Claimed' : 'Unclaimed Gift'}</div>
                                    <div className='n-gift-arrow' style={{backgroundColor: notif?.claimed ? '#e2e2e2' : '#27AE85'}}/>
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>

            </div>
    )
}

export default NotificationItem