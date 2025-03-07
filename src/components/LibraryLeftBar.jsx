import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {ReactComponent as CheckList} from '../n-checklist.svg'
import {ReactComponent as CheckListFilled} from '../n-checklist-filled.svg'
import {ReactComponent as Chat} from '../n-chat.svg'
import {ReactComponent as ChatFilled} from '../n-chat-filled.svg'
import {ReactComponent as Inbox} from '../n-inbox.svg'
import {ReactComponent as InboxFilled} from '../n-inbox-filled.svg'
import {ReactComponent as Medal} from '../n-medal.svg'
import {ReactComponent as MedalFilled} from '../n-medal-filled.svg'
import {ReactComponent as ChevDown} from '../n-chev-down.svg'
import {ReactComponent as UserCircle} from '../user-circle-icon.svg'
import {ReactComponent as Alert} from '../n-bell-icon.svg'
import {ReactComponent as Alert2} from '../n-bell-bing.svg'
import {ReactComponent as Ticket} from '../n-ticket-icon.svg'
import {ReactComponent as Settings} from '../n-settings.svg'
import {ReactComponent as Logout} from '../n-log-out.svg'

const LibraryLeftBar = ({userInfo, setShowTicketPortal, setShowNotifications, setShowProfile, newNotifs}) => {

    const navigate = useNavigate('/');
    const location = useLocation();


  return (
    <div className='n-library-left-bar'>

            <div style={{display: 'flex', flexDirection: 'column'}} className='n-left-bar-0'>

              <div style={{height: '8%', display: 'flex', flexDirection: 'column', justifyContent: 'left', width: '100%'}}>

                <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '100%', height: '100%', marginTop: '1.5rem'}}>
                  <img src='/bb-logo.png' style={{height: '2rem', width: '2rem', cursor: 'pointer'}}/>
                  <div className='logo-title' style={{fontSize: '0.9rem'}}>BOOK <strong>BUDDY</strong></div>
                </div>

                <div className='n-navbar-separator'/>

              </div>

              <div className='n-main-menu-sec'>
                <div className='n-navbar-main-txt'>MAIN MENU</div>
                <button className={location.pathname.slice(0,8) === '/library' ? 'n-main-menu-btn-active' : 'n-main-menu-btn'} style={{marginTop: '1rem'}} onClick={() => navigate('/library')}>
                  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{location.pathname.slice(0,8) === '/library' ? <CheckList /> : <CheckListFilled />}</div>
                  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.625rem'}}>Library</div>
                </button>
                <button className={location.pathname.slice(0,8) === '/rewards' ? 'n-main-menu-btn-active' : 'n-main-menu-btn'} onClick={() => navigate('/rewards')}>
                  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{location.pathname.slice(0,8) === '/rewards' ? <Medal /> : <MedalFilled />}</div>
                  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.625rem'}}>Rewards</div>
                </button>
                <button className='n-main-menu-btn-wip'>
                  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><InboxFilled /></div>
                  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.625rem'}}>Storage (Remodeling)</div>
                </button>
                <button className='n-main-menu-btn-wip'>
                  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><ChatFilled /></div>
                  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.625rem'}}>Social (Coming Soon)</div>
                </button>
              </div>

              

              <div className='n-main-menu-sec' style={{marginTop: '11rem'}}>
                <button className='n-main-menu-btn'>
                  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Logout /></div>
                  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.625rem'}}>Log out</div>
                </button>
                <div className='n-navbar-separator' style={{marginTop: '0rem'}}/>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: '#9BA4B6', fontSize: '0.8125rem', marginTop: '1rem'}}>© 2025 Book Buddy LLC</div>
              </div>

            </div>

            <div style={{height: '32%'}} className='n-left-bar-1'>

              <div style={{fontWeight: '600', fontSize: '0.8125rem', display: 'flex', justifyContent: 'left', alignItems: 'center', width: '100%', position: 'relative'}}>

                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.1rem'}}><UserCircle /></div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.4rem'}}>ACCOUNT</div>

                <div style={{position: 'absolute', right: '0', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

                  <div style={{position: 'relative'}}>
                    <div className='n-chart-date' style={{width: '2rem', borderLeft: '1px solid #8895AA', borderRadius: '0.4rem', height: '1.2rem'}} onClick={() => setShowNotifications(prev => !prev)}>
                      <div>{newNotifs ? <Alert2 /> : <Alert/>}</div>
                    </div>
                    {newNotifs && <div className='n-new-circle2'/>}
                  </div>
                  
                </div>

              </div>

              <div className='n-profile-box' onClick={() => setShowProfile(prev => !prev)}>

                <div>
                  <div className='n-profile-circle'>
                    <img src='/lion-0.png' style={{height: '2.2rem'}}/>
                    <div style={{position: 'absolute', right: '0', bottom: '0', height: '0.8125rem', width: '0.8125rem', borderRadius: '100%', backgroundColor: '#27AE85'}}/>
                  </div>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'left', width: '100%', marginLeft: '1rem'}}>
                  <div className='n-username-text'>{userInfo?.username}</div>
                  <div className='n-username-subtext'>☆ Novice Reader</div>
                </div>

              </div>

              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '1.25rem'}}>
                <div style={{height: '1px', backgroundColor: '#D9D9D9', width: '25%'}}/>
                <div style={{fontSize: '0.7rem', color: '#D9D9D9', width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Have a problem?</div>
                <div style={{height: '1px', backgroundColor: '#D9D9D9', width: '25%'}}/>
              </div>

              <button className='n-support-btn' onClick={() => setShowTicketPortal(prev => !prev)}>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '0.4rem', height: '100%'}}><Ticket /></div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', marginTop: '0.1rem'}}>Create Support Ticket</div>
              </button>

            </div>

          </div>
  )
}

export default LibraryLeftBar