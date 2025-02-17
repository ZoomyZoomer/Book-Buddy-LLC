import react, { useState, useEffect } from 'react'
import '../notifications.css'
import {ReactComponent as Alert} from '../n-bell-icon.svg'
import {ReactComponent as Close} from '../n-notif-close.svg'
import NotificationItem from './NotificationItem'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Notifications = ({username, setFetchPopup, popupInfo, setShowNotifications}) => {

    const [notifications, setNotifications] = useState([]);
    const [reFetchNotifs, setReFetchNotifs] = useState(false);

    const globalNotifs = new Map([
        [0, {id: 0, header: 'sent an accouncement', type: 'Automated Message', hasButton: true, hasGift: false, messageContents: 'Welcome to Book Buddy! If you haven’t done so already, take a look at our site tutorial. 😊', timeSent: new Date('2025-02-16T22:56:00-05:00'), sentBy: 'BookBuddyOfficial'}],
        [1, {id: 1, header: 'sent you a present', type: 'Automated Message', hasButton: false, hasGift: true, messageContents: "We're glad to see you starting your journey with us.. and for that, we think you deserve a present! 😉", timeSent: new Date('2025-02-16T22:56:00-05:00'), sentBy: 'BookBuddyOfficial'}],
    ])

    const fetchNotifs = async() => {

        const res = await axios.get('/api/fetch-notifs', {
            params: {
                username
            }
        })

    let globalNotifications = [];
    let globalNotificationsClaimed = []
    globalNotifs.forEach((notif, notifId) => {
        if (!res.data[1].includes(notifId)) {
            globalNotifications.push(notif);
        } else {
            globalNotificationsClaimed.push({...notif, seen: true});
        }
    });

    setNotifications([...globalNotifications, ...globalNotificationsClaimed, ...res.data[0]]);


    }

    useEffect(() => {
        if (username){
           fetchNotifs();
        }
    }, [username, reFetchNotifs])


    return (
        <div className='n-notifications-container' style={{filter: popupInfo ? 'brightness(0.3)' : '', pointerEvents: popupInfo ? 'none' : 'all'}}>

            <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '100%', fontWeight: '600', fontSize: '0.8125rem'}}>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '0.4rem'}}><Alert/></div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>NOTIFICATIONS</div>
                <div style={{position: 'absolute', right: '2rem'}} onClick={() => setShowNotifications(prev => !prev)} className='exit-notif'><Close /></div>
            </div>

            <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '100%', marginTop: '1.5rem'}}>
                <div className='n-notif-select'>New</div>
                <div className='n-notif-select'>Seen</div>
                <div className='n-notif-select'>Starred</div>
            </div>

            <div className='notif-bar' style={{marginTop: '1rem', marginBottom: '1rem'}}/>

            <div style={{width: '100%', height: '100%', overflowY: 'auto', overFlowX: 'hidden', display: 'flex', flexDirection: 'column'}} className='n-notif-body'>
                {notifications.map((notif, ind) => (
                    <>
                        {ind !== 0 && <div className='notif-bar' style={{backgroundColor: '#ececec'}}/>}
                        <NotificationItem notif={notif} key={ind} username={username} setFetchPopup={setFetchPopup} setReFetchNotifs={setReFetchNotifs}/>
                    </>
                ))}
            </div>

        </div>
    )

}

export default Notifications