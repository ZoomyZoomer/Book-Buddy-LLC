import React, { useState, useEffect } from 'react'
import '../ticketportal.css'
import {ReactComponent as Close} from '../n-notif-close.svg'
import {ReactComponent as Ticket} from '../n-ticket-icon.svg'
import {ReactComponent as Add} from '../n-ticket-add.svg'
import {ReactComponent as Clock} from '../n-ticket-clock.svg'
import {ReactComponent as UserCircle} from '../user-circle-icon.svg'
import {ReactComponent as DollarCircle} from '../dollar-circle.svg'
import {ReactComponent as QuestionCircle} from '../question-circle.svg'
import {ReactComponent as Document} from '../document-icon.svg'
import CreateSupportTicket from './CreateSupportTicket'
import axios from 'axios'
import SupportTicketChat from './SupportTicketChat'

const TicketPortal = ({username, setShowTicketPortal}) => {

    const [isMakingTicket, setIsMakingTicket] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [viewTicket, setViewTicket] = useState(null);

    const fetchTickets = async() => {

        const res = await axios.get('/api/fetchSupportTickets', {
            params: {
                username
            }
        })

        setTickets(res.data);

    }

    useEffect(() => {
        if (username){
            fetchTickets();
        }
    }, [isMakingTicket, username])

  return (
    <div className='n-tickets-container'>

        <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '100%', fontWeight: '600', fontSize: '0.9rem'}}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '0.4rem'}}><Ticket /></div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{viewTicket ? `Ticket ST#${viewTicket.ticketId}` : (isMakingTicket ? 'CREATE SUPPORT TICKET' : 'SUPPORT TICKET PORTAL')}</div>
            <div style={{position: 'absolute', right: '2rem'}} onClick={() => setShowTicketPortal(prev => !prev)} className='exit-notif'><Close /></div>
        </div>

        {viewTicket && (
            <>
                <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '100%', marginTop: '4rem', position: 'relative'}}>
                    <div style={{display: 'flex', marginRight: '0.4rem'}}><Document /></div>
                    <div style={{display: 'flex'}}><strong>{viewTicket.ticketInfo.ticketName}</strong></div>
                </div>

                <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '100%', fontSize: '0.8125rem', color: '#8892A2', marginTop: '0.2rem'}}>
                    Submitted by: {viewTicket.sentBy}
                </div>

                <div style={{height: '1px', width: '100%', backgroundColor: '#D9D9D9', marginBottom: '2rem', marginTop: '2rem'}}/>

                {viewTicket?.ticketStatus === 'Resolved' && <SupportTicketChat ticket={viewTicket} isUser={false}/>}
                {viewTicket?.ticketStatus === 'Resolved' && <div style={{height: '1px', width: '100%', backgroundColor: '#F7F7F7'}}/>}
                <SupportTicketChat ticket={viewTicket} isUser={true} />

                <div className='ticket-status-box'>
                    {viewTicket.ticketStatus === 'In Progress' ? 'Your ticket is waiting to be reviewed' : 'Your ticket has been marked as resolved'}
                </div>
            </>
        )}

        {!isMakingTicket && !viewTicket && (
            <>
                <div className='n-create-ticket-box' onClick={() => setIsMakingTicket(prev => !prev)}>
                    <div className='n-ticket-circle'><img src='/tickets.png' className='n-ticket-img'/></div>
                    <div style={{color: '#52637D', fontWeight: '500', fontSize: '0.9rem', marginTop: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <div style={{display: 'flex', marginRight: '0.4rem'}}><Add /></div>
                        <div style={{display: 'flex'}}>CLICK TO CREATE A NEW TICKET</div>
                    </div>
                    <div style={{color: '#9BA4B6', fontWeight: '400', fontSize: '0.76rem', marginTop: '0.2rem'}}>or view your current ticket status below</div>
                </div>

                <div style={{display: 'flex', justifyContent: 'left', flexDirection: 'column', width: '100%', marginTop: '2.5rem', height: '14rem'}}>
                    <div style={{display: 'flex', justifyContent: 'left', fontSize: '0.9rem', fontWeight: '600'}}>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '0.4rem'}}><Clock /></div>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>RECENT TICKET HISTORY</div>
                    </div>
                    <div className='n-ticket-history-box'>

                        {tickets.map((ticket, id) =>(
                            <>
                                <div className='n-ticket-entry' onClick={() => setViewTicket(ticket)}>
                                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'left'}}>
                                        <div className='n-history-0'>ST#{ticket.ticketId}</div>
                                        <div className='n-history-1'>Support ticket No.</div>
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'left', width: '5.5rem'}}>
                                        <div className='n-history-0'>
                                            <div style={{display: 'flex', marginRight: '0.2rem'}}>{ticket.ticketInfo.issueType === 'ACCOUNT' ? <UserCircle /> : ticket.ticketInfo.issueType === 'PURCHASE' ? <DollarCircle /> : <QuestionCircle />}</div>
                                            <div style={{display: 'flex'}}>{ticket.ticketInfo.issueType}</div>
                                        </div>
                                        <div className='n-history-1'>Issue Type</div>
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'left'}}>
                                        <div className='n-history-0'>{`${new Date(ticket.dateSent).getMonth() + 1}/${new Date(ticket.dateSent).getDate()}/${new Date(ticket.dateSent).getFullYear()}`}</div>
                                        <div className='n-history-1'>Date</div>
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'left', width: '6rem'}}>
                                        <div className='n-history-0'>
                                            <div style={{height: '0.9rem', width: '0.9rem', borderRadius: '100%', backgroundColor: ticket.ticketStatus === 'In Progress' ? '#E89C51' : '#27AE85', marginRight: '0.4rem'}}/>
                                            <div style={{color: ticket.ticketStatus === 'In Progress' ?'#E89C51' : '#27AE85'}}>{ticket.ticketStatus}</div>
                                        </div>
                                        <div className='n-history-1'>Ticket Status</div>
                                    </div>
                                </div>
                                <div className='n-ticket-sep'/>
                            </>
                        ))}

                    </div>
                </div>
            </>
        )}

        {isMakingTicket && (
            <CreateSupportTicket setIsMakingTicket={setIsMakingTicket} username={username}/>
        )}

    </div>
  )
}

export default TicketPortal