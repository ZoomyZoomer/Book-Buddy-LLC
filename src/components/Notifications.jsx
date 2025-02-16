import react from 'react'
import '../notifications.css'
import {ReactComponent as Alert} from '../n-bell-icon.svg'
import NotificationItem from './NotificationItem'

const Notifications = () => {


    return (
        <div className='n-notifications-container'>

            <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '100%', fontWeight: '600', fontSize: '0.8125rem'}}>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '0.4rem'}}><Alert/></div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>NOTIFICATIONS</div>
            </div>

            <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '100%', marginTop: '1.5rem'}}>
                <div className='n-notif-select'>New</div>
                <div className='n-notif-select'>Seen</div>
                <div className='n-notif-select'>Starred</div>
            </div>

            <NotificationItem />

        </div>
    )

}

export default Notifications