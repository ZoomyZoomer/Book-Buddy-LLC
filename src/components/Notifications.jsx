import react, { useState, useEffect } from 'react'
import '../notifications.css'
import {ReactComponent as Alert} from '../n-bell-icon.svg'
import {ReactComponent as BigAlert} from '../n-bell-icon-large.svg'
import {ReactComponent as Close} from '../n-notif-close.svg'
import {ReactComponent as Star} from '../n-notif-star.svg'
import {ReactComponent as StarWhite} from '../n-notif-starwhite.svg'
import {ReactComponent as Key} from '../n-notif-key.svg'
import {ReactComponent as KeyWhite} from '../n-notif-keywhite.svg'
import NotificationItem from './NotificationItem'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Notifications = ({username, setFetchPopup, popupInfo, setShowNotifications}) => {

    const [notifications, setNotifications] = useState([]);
    const [reFetchNotifs, setReFetchNotifs] = useState(false);
    const [newNotifications, setNewNotifications] = useState([]);
    const [importantNotifications, setImportantNotifications] = useState([]);
    const [notifSelect, setNotifSelect] = useState(0);

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
    let globalNotificationsClaimed = [];
    let importantNotifs = [];
    let newNotifs = [];
    globalNotifs.forEach((notif, notifId) => {
        if (!res.data[1].some((noti) => noti.id === notifId)) {
            globalNotifications.push({...notif, important: res.data[1].find((noti) => noti.id === notifId)?.important});
            newNotifs.push({...notif, important: res.data[1].find((noti) => noti.id === notifId)?.important});
            if (res.data[1].find((noti) => noti.id === notifId)?.important) {
                importantNotifs.push({...notif, important: true});
            }
        } else {
            globalNotificationsClaimed.push({...notif, seen: true, important: res.data[1].find((noti) => noti.id === notifId)?.important, claimed: res.data[1].find((noti) => noti.id === notifId)?.claimed});
            if (res.data[1].find((noti) => noti.id === notifId)?.important) {
                importantNotifs.push({...notif, seen: true, important: true, claimed: res.data[1].find((noti) => noti.id === notifId)?.claimed});
            }
        }
    });
    

    setNotifications([...globalNotifications, ...globalNotificationsClaimed, ...res.data[0]]);
    setNewNotifications(newNotifs);
    setImportantNotifications(importantNotifs);

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
                <div className={notifSelect === 0 ? 'n-notif-select-active' : 'n-notif-select'} onClick={() => setNotifSelect(0)}>All {`(${notifications.length})`}</div>
                <div className={notifSelect === 1 ? 'n-notif-select-active' : 'n-notif-select'} onClick={() => setNotifSelect(1)}>
                    {notifSelect !== 1 ? <Star /> : <StarWhite />}
                    <div style={{marginLeft: '0.3rem'}}>New {`(${newNotifications.length})`}</div>
                    {newNotifications.length > 0 && <div style={{position: 'absolute', right: '-0.3rem', top: '-0.3rem', backgroundColor: '#27AE85', height: '0.6rem', width: '0.6rem', borderRadius: '100%', border: '1px solid #048D63'}}/>}
                </div>
                <div className={notifSelect === 2 ? 'n-notif-select-active' : 'n-notif-select'} onClick={() => setNotifSelect(2)}>{notifSelect !== 2 ? <Key /> : <KeyWhite />}<div style={{marginLeft: '0.3rem'}}>Important {`(${importantNotifications.length})`}</div></div>
            </div>

            <div className='notif-bar' style={{marginTop: '1rem', marginBottom: '1rem'}}/>

            <div style={{width: '100%', height: '100%', overflowY: 'auto', overFlowX: 'hidden', display: 'flex', flexDirection: 'column'}} className='n-notif-body'>
                {notifSelect === 0 && notifications.map((notif, ind) => (
                    <>
                        {ind !== 0 && <div className='notif-bar' style={{backgroundColor: '#ececec'}}/>}
                        <NotificationItem notif={notif} key={ind} username={username} setFetchPopup={setFetchPopup} setReFetchNotifs={setReFetchNotifs}/>
                    </>
                ))}
                {notifSelect === 1 && newNotifications.map((notif, ind) => (
                    <>
                        {ind !== 0 && <div className='notif-bar' style={{backgroundColor: '#ececec'}}/>}
                        <NotificationItem notif={notif} key={ind} username={username} setFetchPopup={setFetchPopup} setReFetchNotifs={setReFetchNotifs}/>
                    </>
                ))}
                {notifSelect === 2 && importantNotifications.map((notif, ind) => (
                    <>
                        {ind !== 0 && <div className='notif-bar' style={{backgroundColor: '#ececec'}}/>}
                        <NotificationItem notif={notif} key={ind} username={username} setFetchPopup={setFetchPopup} setReFetchNotifs={setReFetchNotifs}/>
                    </>
                ))}
                {notifSelect === 0 && notifications.length === 0 && (
                    <div style={{display: 'flex', justifyContent: 'center', width: '100%', marginTop: '6rem'}}>
                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#7983A6'}}>
                            <div style={{fontWeight: '600', fontSize: '1.4rem'}}>No New Notifications</div>
                            <div style={{fontWeight: '400', marginTop: '0.2rem', color: '#9BA4B6'}}>Stay tuned for more!</div>
                            <div style={{marginTop: '3rem', transform: 'rotate(-25deg)'}}><BigAlert /></div> 
                        </div>
                    </div>
                )}
                {notifSelect === 1 && newNotifications.length === 0 && (
                    <div style={{display: 'flex', justifyContent: 'center', width: '100%', marginTop: '6rem'}}>
                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#7983A6'}}>
                            <div style={{fontWeight: '600', fontSize: '1.4rem'}}>No New Notifications</div>
                            <div style={{fontWeight: '400', marginTop: '0.2rem', color: '#9BA4B6'}}>Stay tuned for more!</div>
                            <div style={{marginTop: '3rem', transform: 'rotate(-25deg)'}}><BigAlert /></div> 
                        </div>
                    </div>
                )}
                {notifSelect === 2 && importantNotifications.length === 0 && (
                    <div style={{display: 'flex', justifyContent: 'center', width: '100%', marginTop: '6rem'}}>
                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#7983A6'}}>
                            <div style={{fontWeight: '600', fontSize: '1.4rem'}}>No Important Notifications</div>
                            <div style={{fontWeight: '400', marginTop: '0.2rem', color: '#9BA4B6'}}>Add using the three dots menu!</div>
                            <div style={{marginTop: '3rem', transform: 'rotate(-25deg)'}}><BigAlert /></div> 
                        </div>
                    </div>
                )}
            </div>

        </div>
    )

}

export default Notifications