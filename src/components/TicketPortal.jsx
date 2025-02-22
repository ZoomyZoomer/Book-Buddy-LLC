import React, { useState } from 'react'
import '../ticketportal.css'
import {ReactComponent as Close} from '../n-notif-close.svg'
import {ReactComponent as Ticket} from '../n-ticket-icon.svg'
import {ReactComponent as Add} from '../n-ticket-add.svg'
import {ReactComponent as Clock} from '../n-ticket-clock.svg'

const TicketPortal = ({username, setShowTicketPortal}) => {

    const [isMakingTicket, setIsMakingTicket] = useState(false);

  return (
    <div className='n-tickets-container'>

        <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '100%', fontWeight: '600', fontSize: '0.9rem'}}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '0.4rem'}}><Ticket /></div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{isMakingTicket ? 'CREATE SUPPORT TICKET' : 'SUPPORT TICKET PORTAL'}</div>
            <div style={{position: 'absolute', right: '2rem'}} onClick={() => setShowTicketPortal(prev => !prev)} className='exit-notif'><Close /></div>
        </div>

        <div className='n-create-ticket-box' onClick={() => setIsMakingTicket(prev => !prev)}>
            <div className='n-ticket-circle'><img src='/tickets.png' className='n-ticket-img'/></div>
            <div style={{color: '#52637D', fontWeight: '500', fontSize: '0.9rem', marginTop: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{display: 'flex', marginRight: '0.4rem'}}><Add /></div>
                <div style={{display: 'flex'}}>CLICK TO CREATE A NEW TICKET</div>
            </div>
            <div style={{color: '#9BA4B6', fontWeight: '400', fontSize: '0.76rem', marginTop: '0.2rem'}}>or view your current ticket status below</div>
        </div>

        <div style={{display: 'flex', justifyContent: 'left', flexDirection: 'column', width: '100%', marginTop: '3rem', height: '14rem'}}>
            <div style={{display: 'flex', justifyContent: 'left', fontSize: '0.9rem', fontWeight: '600'}}>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '0.4rem'}}><Clock /></div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>RECENT TICKET HISTORY</div>
            </div>
            <div className='n-ticket-history-box'>
                <div className='n-ticket-entry'>
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'left'}}>
                        <div className='n-history-0'>ST#134768293</div>
                        <div className='n-history-1'>Support ticket No.</div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'left'}}>
                        <div className='n-history-0'>Account Issue</div>
                        <div className='n-history-1'>Issue Type</div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'left'}}>
                        <div className='n-history-0'>2/21/2025</div>
                        <div className='n-history-1'>Date</div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'left'}}>
                        <div className='n-history-0'>
                            <div style={{height: '0.9rem', width: '0.9rem', borderRadius: '100%', backgroundColor: '#27AE85', marginRight: '0.4rem'}}/>
                            <div style={{color: '#27AE85'}}>In Progress</div>
                        </div>
                        <div className='n-history-1'>Ticket Status</div>
                    </div>
                </div>
                <div className='n-ticket-sep'/>
            </div>
        </div>

    </div>
  )
}

export default TicketPortal