import React, { useState } from 'react'
import {ReactComponent as UserCircle} from '../user-circle-icon.svg'
import {ReactComponent as UserCircleWhite} from '../user-circle-icon-white.svg'
import {ReactComponent as DollarCircle} from '../dollar-circle.svg'
import {ReactComponent as DollarCircleWhite} from '../dollar-circle-white.svg'
import {ReactComponent as QuestionCircle} from '../question-circle.svg'
import {ReactComponent as QuestionCircleWhite} from '../question-circle-white.svg'
import {ReactComponent as ChevDownFilled} from '../n-chevron-down-black.svg'
import axios from 'axios'

const CreateSupportTicket = ({setIsMakingTicket, username}) => {

    const [issueType, setIssueType] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(false);
    const [reason, setReason] = useState(null);

    const [nameText, setNameText] = useState('');
    const [descriptionText, setDescriptionText] = useState('');

    const [errorDisplay, setErrorDisplay] = useState(false);

    const submitTicket = async() => {

       if (!issueType || !reason || nameText.length < 6 || descriptionText.length < 10){
        setErrorDisplay(true);
        return;
       }

       await axios.post('/api/sendSupportTicket', {
        username,
        ticketInfo: {ticketName: nameText, issueType, ticketReason: reason, ticketDescription: descriptionText}
       })

       setIsMakingTicket(false);

    }

  return (
    <div className='n-create-ticket-input-box'>
        <div className='n-ticket-input-header'>Ticket Name</div>
        <div style={{width: '100%', position: 'relative'}}>
            <input 
                className='n-ticket-input'
                placeholder='Brief reason for inquiry'
                style={{borderColor: nameText.length < 6 && errorDisplay && 'rgb(235, 59, 59)', outlineColor: nameText.length < 6 && errorDisplay && 'rgb(235, 59, 59)'}}
                value={nameText}
                onChange={(e) => setNameText(e.target.value)}
            />
           {nameText.length < 6 && errorDisplay && <div className='n-ticket-error'>Please enter a valid ticket name (6+ characters)</div>}
        </div>

        <div className='n-ticket-input-header' style={{marginTop: '2rem'}}>Issue Type</div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '0.625rem', position: 'relative'}}>
            <div className={issueType === 'ACCOUNT' ? 'n-ticket-option-item-active' : 'n-ticket-option-item'} style={{borderColor: !issueType && errorDisplay && 'rgb(235, 59, 59)'}} onClick={() => {setIssueType('ACCOUNT'); setReason(null)}}>
                <div style={{display: 'flex', marginRight: '0.3rem'}}>{issueType === 'ACCOUNT' ? <UserCircleWhite /> : <UserCircle />}</div>
                <div style={{display: 'flex'}}>ACCOUNT</div>
            </div>
            <div className={issueType === 'PURCHASE' ? 'n-ticket-option-item-active' : 'n-ticket-option-item'} style={{borderColor: !issueType && errorDisplay && 'rgb(235, 59, 59)'}} onClick={() => {setIssueType('PURCHASE'); setReason(null)}}>
                <div style={{display: 'flex', marginRight: '0.3rem'}}>{issueType === 'PURCHASE' ? <DollarCircleWhite /> : <DollarCircle />}</div>
                <div style={{display: 'flex'}}>PURCHASE</div>
            </div>
            <div className={issueType === 'OTHER' ? 'n-ticket-option-item-active' : 'n-ticket-option-item'} style={{borderColor: !issueType && errorDisplay && 'rgb(235, 59, 59)'}} onClick={() => {setIssueType('OTHER'); setReason(null)}}>
                <div style={{display: 'flex', marginRight: '0.3rem'}}>{issueType === 'OTHER' ? <QuestionCircleWhite /> : <QuestionCircle />}</div>
                <div style={{display: 'flex'}}>OTHER</div>
            </div>
            {!issueType && errorDisplay && <div className='n-ticket-error'>Please select an issue type</div>}
        </div>

        <div className='n-ticket-input-header' style={{marginTop: '2rem'}}>Reason</div>
        <div className='n-ticket-dropdown' onClick={() => {issueType && setActiveDropdown(prev => !prev)}} style={{backgroundColor: !issueType && '#f5f5f7', cursor: !issueType && 'not-allowed', borderColor: !reason && errorDisplay && 'rgb(235, 59, 59)'}}>
            <div style={{color: !reason ? '#A3A6AB' : '#454b54', fontWeight: '400', display: 'flex', justifyContent: 'left', alignItems: 'center'}}>{!reason ? 'Reason for ticket' : reason}</div>
            <div style={{position: 'absolute', right: '1rem', marginTop: '0.2rem'}}><ChevDownFilled /></div>
            {activeDropdown && (
                <div className='n-ticket-dropdown-container'>
                    {issueType === 'ACCOUNT' && (
                        <>
                            <div onClick={() => setReason('Signin / Signout Issue')}>Signin / Signout Issue</div>
                            <div onClick={() => setReason('Notifications Issue')}>Notifications Issue</div>
                            <div onClick={() => setReason('Profile Issue')}>Profile Issue</div>
                        </>
                    )}
                    {issueType === 'PURCHASE' && (
                        <>
                            <div onClick={() => setReason('Unable to purchase item(s)')}>Unable to purchase item(s)</div>
                            <div onClick={() => setReason("Didn't receive purchased item")}>Didn't receive purchased item</div>
                        </>
                    )}   
                    {issueType === 'OTHER' && (
                        <>
                            <div onClick={() => setReason('Issue with adding or interacting w/ books')}>Issue with adding or interacting w/ books</div>
                            <div onClick={() => setReason('Page elements not loading')}>Page elements not loading</div>
                            <div onClick={() => setReason('Incorrect data being displayed')}>Incorrect data being displayed</div>
                            <div onClick={() => setReason('Other')}>Other</div>
                        </>
                    )}
                </div>
            )}
            {!reason && errorDisplay && <div className='n-ticket-error'>Please select a reason for your ticket (Select an issue first)</div>}
        </div>

        <div className='n-ticket-input-header' style={{marginTop: '2rem'}}>Description</div>
        <div style={{width: '100%', position: 'relative'}}>
            <textarea 
                className='n-ticket-input'
                style={{height: '6rem', textAlign: 'left', verticalAlign: 'top', paddingTop: '0.7rem', paddingBottom: '0.7rem', borderColor: descriptionText.length < 10 && errorDisplay && 'rgb(235, 59, 59)', outlineColor: descriptionText.length < 10 && errorDisplay && 'rgb(235, 59, 59)'}}
                placeholder='Describe your issue in detail.'
                value={descriptionText}
                onChange={(e) => setDescriptionText(e.target.value)}
            />
            {descriptionText.length < 10 && errorDisplay && <div className='n-ticket-error'>Please enter a valid ticket description (10+ characters)</div>}
        </div>

        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', position: 'absolute', bottom: '0', left: '0', paddingLeft: '0.7rem', paddingRight: '0.7rem', paddingBottom: '1.4rem', boxSizing: 'border-box'}}>
            <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '50%'}}>
                <button className='n-cancel-ticket' onClick={() => setIsMakingTicket(false)}>CANCEL</button>
            </div>
            <div style={{display: 'flex', justifyContent: 'right', alignItems: 'center', width: '50%'}}>
                <button className='n-submit-ticket' onClick={() => submitTicket()}>SUBMIT TICKET</button>
            </div>
        </div>

    </div>
  )
}

export default CreateSupportTicket