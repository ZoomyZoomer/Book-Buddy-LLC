import react from 'react'

const NotificationItem = () => {

    return (
        <div>

            <div className='notif-bar'/>

            <div className='n-notification-box'>

                <div style={{display: 'flex', justifyContent: 'left', width: '100%'}}>

                    <div style={{width: '3.4rem'}}>
                        <div style={{height: '3.2rem', width: '3.2rem', borderRadius: '100%', border: '1px solid #83878C', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <img src='/lion-0.png' style={{height: '2rem'}}/>
                        </div>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: '1rem'}}>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.8125rem'}}>
                            <div style={{fontWeight: '600', marginRight: '0.4rem'}}>@BookBuddyOfficial</div>
                            <div style={{color: '#52637D'}}>sent an announcement</div>
                        </div>
                        <div style={{color: '#8892A2', fontSize: '0.7rem', marginTop: '0.2rem', fontWeight: '400'}}>Friday 5:31PM · Automated Message</div>
                    </div>
                </div>

                <div style={{display: 'flex', justifyContent: 'left', width: '100%', marginTop: '1rem'}}>
                    <div style={{height: '4rem', width: '3.4rem'}}/>
                    <div className='n-notif-message'>
                        <div>Welcome to Book Buddy! If you haven’t done so already, complete our site tutorial. 😊</div>
                        <button className='n-notif-message-button'>START TUTORIAL</button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default NotificationItem