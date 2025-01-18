import React, { useState, useRef, useEffect } from 'react'
import '../goalstyles.css'
import {ReactComponent as Notification} from '../n-notification.svg'
import {ReactComponent as Check} from '../n-checkm.svg'
import {ReactComponent as ChevDown} from '../n-chev-down-inactive.svg'
import {ReactComponent as Close} from '../n-close-goal-xd.svg'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const SetGoals = () => {

    const [checkBox, setCheckBox] = useState(false);
    const [checkBox2, setCheckBox2] = useState(false);
    const [readingSpeed, setReadingSpeed] = useState(0);
    const [graphItem, setGraphItem] = useState('Veteran');
    const [showDropDown, setShowDropDown] = useState(false);
    const [publicClicked, setPublicClicked] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate('/');
    const audioRef = useRef(null);

    const playAudio = () => {
        setTimeout(() => {
            audioRef.current.volume = 0.05;
            audioRef.current.play();
        }, 300)
    };

    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const response = await axios.get('/api/profile', {
              withCredentials: true,
            });
            setUserInfo(response.data.user);
          } catch (error) {
            // Check if error response status is 401
            if (error.response && error.response.status === 401) {
              // Navigate to the sign-in page
              navigate('/signin');
            } else {
              // Handle other errors
              console.error('Error fetching profile:', error);
            }
          }
        };
    
        fetchProfile();
      }, []);

    const discardChanges = () => {
        setCheckBox(false);
        setCheckBox2(false);
        setReadingSpeed(0);
        setGraphItem('Veteran');
        setIsPublic(false);
        document.getElementById("toggleSwitch").checked = false;
    }

    const setHabits = async() => {

        try {

            await axios.post('/api/set-habits', {
                username: userInfo?.username,
                info: {
                    reading_speed: readingSpeed,
                    preferred_time: checkBox ? 'Weekdays' : 'Weekends',
                    skill_level: graphItem,
                    enable_notifications: document.getElementById("toggleSwitch").checked,
                    is_public: isPublic
                }
            })

            navigate('/library');

        } catch(e) {

        }

    }

  return (
    <div className='n-goal-container'>

        <audio ref={audioRef}>
            <source src="scribble.wav" type="audio/wav" />
        </audio>

        <div className='n-goal-box'>

            <div style={{width: '45%'}}>
                <img src='/book-image.png' style={{height: '44rem', borderRadius: '2rem'}}/>
            </div>

            <div style={{width: '55%', display: 'flex', height: '100%'}} className='n-goals-right'>


                <div style={{marginTop: '2rem', display: 'flex', height: 'fit-content', position: 'relative', width: '100%'}}>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Notification /></div>
                    <div style={{display: 'flex', marginLeft: '0.4rem', fontWeight: '600', justifyContent: 'center', alignItems: 'center'}}>Set Reading Goals</div>
                    <div style={{position: 'absolute', right: '0', top: '-0.4rem'}} className='n-goal-close-btn' onClick={() => navigate('/library')}><Close /></div>
                </div>

                <div style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'left', marginTop: '3rem'}}>
                    <div className='n-goals-title'>Reading Habits</div>
                    <div style={{width: '28rem'}}>
                        <div className='n-goal-border' style={{marginTop: '1rem', borderBottomLeftRadius: '0rem', borderBottomRightRadius: '0rem'}}>
                            <div>Reading speed</div>
                            <div className='n-goals-abs'>
                                <button className={readingSpeed === 175 ? 'wpm-btn-active' :'wpm-btn'} onClick={() => setReadingSpeed(175)} style={{borderTopRightRadius: '0rem', borderBottomRightRadius: '0rem'}}>175 WPM</button>
                                <button className={readingSpeed === 250 ? 'wpm-btn-active' :'wpm-btn'} onClick={() => setReadingSpeed(250)} style={{borderTopRightRadius: '0rem', borderBottomRightRadius: '0rem', borderBottomLeftRadius: '0rem', borderTopLeftRadius: '0rem'}}>250 WPM</button>
                                <button className={readingSpeed === 300 ? 'wpm-btn-active' :'wpm-btn'} onClick={() => setReadingSpeed(300)} style={{borderBottomLeftRadius: '0rem', borderTopLeftRadius: '0rem'}}> 300 WPM</button>
                            </div>
                        </div>
                        <div className='n-goal-border' style={{borderTopLeftRadius: '0rem', borderTopRightRadius: '0rem', borderBottomLeftRadius: '0rem', borderBottomRightRadius: '0rem', borderTop: 'none'}}>
                            <div>Preferred reading time</div>
                            <div className='n-goals-abs'>
                                {!checkBox ? <div className='n-checkbox' onClick={() => {setCheckBox(prev => !prev); playAudio(); setCheckBox2(false)}}></div> : 
                                <div className='n-checkbox-filled' onClick={() => {setCheckBox(prev => !prev)}}>
                                    <div className='n-checkbox-bg'/>
                                    <div className='n-check-icon'><Check /></div>
                                </div>}
                                <div style={{marginLeft: '0.4rem', marginRight: '0.8125rem'}}>Weekdays</div>
                                {!checkBox2 ? <div className='n-checkbox' onClick={() => {setCheckBox2(prev => !prev); playAudio(); setCheckBox(false)}}></div> : 
                                <div className='n-checkbox-filled' onClick={() => {setCheckBox2(prev => !prev)}}>
                                    <div className='n-checkbox-bg'/>
                                    <div className='n-check-icon'><Check /></div>
                                </div>}
                                <div style={{marginLeft: '0.4rem'}}>Weekends</div>
                            </div>
                        </div>
                        <div className='n-goal-border' style={{borderTopLeftRadius: '0rem', borderTopRightRadius: '0rem', borderTop: 'none'}}>
                            <div>Reading skill level</div>
                            <div className='n-goals-abs'>
                                <div className='n-goal-dropdown' onClick={() => setShowDropDown(prev => !prev)} onMouseLeave={() => setShowDropDown(false)}>
                                    <div style={{display: 'flex', marginLeft: '0.4rem'}}>{graphItem}</div>
                                    <div style={{display: 'flex', marginLeft: '1.4rem'}}><ChevDown /></div>
                                    {showDropDown && <div className='n-chart-dropdown' style={{borderColor: '#B8C0CC'}}>
                                        {graphItem !== 'Newcomer' && <div className='n-chart-item' onClick={() => setGraphItem('Newcomer')}>
                                        <div style={{marginLeft: '0.7rem'}}>Newcomer</div>
                                        </div>}
                                        {graphItem !== 'Hobbyist' && <div className='n-chart-item' onClick={() => setGraphItem('Hobbyist')}>
                                        <div style={{marginLeft: '0.7rem'}}>Hobbyist</div>
                                        </div>}
                                        {graphItem !== 'Veteran' && <div className='n-chart-item' onClick={() => setGraphItem('Veteran')}>
                                        <div style={{marginLeft: '0.7rem'}}>Veteran</div>
                                        </div>}
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'left', marginTop: '1.5rem'}}>
                    <div className='n-goals-title'>Accessibility</div>
                    <div style={{width: '28rem'}}>
                    <div className='n-goal-border' style={{marginTop: '1rem', borderBottomLeftRadius: '0rem', borderBottomRightRadius: '0rem'}}>
                            <div style={{display: 'flex', justifyContent: 'left', flexDirection: 'column'}}>
                                <div>Enable reading notifications</div>
                                <div style={{color: '#9BA4B6', fontSize: '0.8125rem', fontWeight: '400'}}>On-site reminders to complete goals.</div>
                            </div>
                            <div className='n-goals-abs' style={{bottom: '60%', right: '1rem'}}>
                                <label class="switch">
                                    <input id='toggleSwitch' type="checkbox"/>
                                    <span class="slider round"></span>
                                </label>
                            </div>
                        </div>
                        <div className='n-goal-border' style={{borderTopLeftRadius: '0rem', borderTopRightRadius: '0rem', borderTop: 'none'}}>
                        <div style={{display: 'flex', justifyContent: 'left', flexDirection: 'column'}}>
                                <div>Reading progress visibility</div>
                                <div style={{color: '#9BA4B6', fontSize: '0.8125rem', fontWeight: '400'}}>Make your progress public on your profile.</div>
                            </div>
                            <div className='n-goals-abs'>
                                <button className='n-make-public' onClick={() => {setPublicClicked(prev => !prev); setTimeout(() => setPublicClicked(false) , 1000); setIsPublic(prev => !prev)}}>
                                    {!publicClicked && (isPublic ? 'Make private' : 'Make public')}
                                    {publicClicked && <div className="loader-circle"></div>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '4rem'}}>
                    <button className='n-discard-btn' onClick={() => discardChanges()}>DISCARD CHANGES</button>
                    <button className='n-create-habit-btn' style={{marginLeft: '1.4rem'}} onClick={() => setHabits()}>CREATE HABITS</button>
                </div>

            </div>
            

        </div>

    </div>
  )
}

export default SetGoals