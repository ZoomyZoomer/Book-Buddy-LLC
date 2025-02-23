import React from 'react'

const SupportTicketChat = ({ticket, isUser}) => {
  return (
    <div className='n-ticket-stuff-box'>

                <div style={{display: 'flex', justifyContent: 'left', width: '100%'}}>

                    <div style={{width: '3.4rem'}}>
                        <div style={{height: '3.2rem', width: '3.2rem', borderRadius: '100%', backgroundColor: 'white', border: '1px solid #83878C', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <img src='/lion-0.png' style={{height: '2rem'}}/>
                        </div>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: '1rem', width: '100%'}}>
                        <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', fontSize: '0.8125rem', width: '100%', position: 'relative'}}>
                            <div style={{fontWeight: '600', marginRight: '0.4rem'}}>{isUser ? `@${ticket.sentBy}` : '@BookBuddySupport'}</div>
                            <div style={{color: '#52637D'}}>{isUser ? 'created a ticket' : 'reviewed your ticket'}</div>
                        </div>
                        <div style={{color: '#8892A2', fontSize: '0.7rem', marginTop: '0.2rem', fontWeight: '400'}}>{new Intl.DateTimeFormat('en-US', {weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: true}).format(isUser ? new Date(ticket?.dateSent) : new Date(ticket?.repsonseDate))}</div>
                    </div>
                </div>

                <div style={{display: 'flex', justifyContent: 'left', width: '100%', marginTop: '1rem'}}>
                    <div style={{height: '4rem', width: '3.4rem'}}/>
                    <div className='n-ticket-message' style={{backgroundColor: '#F9F9F9', lineHeight: '1.4rem'}}>
                        <div>{isUser ? ticket.ticketInfo.ticketDescription : ticket.ticketResponse}</div>
                    </div>
                </div>

            </div>
  )
}

export default SupportTicketChat