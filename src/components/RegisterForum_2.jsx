import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import {ReactComponent as User} from '../n-user.svg'

const RegisterForum_2 = ({setMaxPage, setCurrPage, avid, setAvid, email, setUsername, username}) => {

    const [readingLevel, setReadingLevel] = useState([0,0,0]);
    const [isModified, setIsModified] = useState(false);
    const [usernameTaken, setUsernameTaken] = useState(false);
    const [usernameEmpty, setUsernameEmpty] = useState(false);

    const handleClick = (index) => {

        setIsModified(true);

        if (index === 0) {
            setReadingLevel([1,0,0]);
            setAvid(0);
        } else if (index === 1) {
            setReadingLevel([0,1,0]);
            setAvid(1);
        } else {
            setReadingLevel([0,0,1]);
            setAvid(2);
        }

    }

    const confirmAnswer = async() => {

        let res = [0, 0];
        setUsernameTaken(false);
        setUsernameEmpty(false);

        try {

            res = await axios.get('/api/fetch-valid-account', {
                params: {
                    email,
                    username
                }
            })

            if (res.data[0]){
                setUsernameTaken(true);
            }

            if (username.length === 0){
                setUsernameEmpty(true);
            }

            await axios.post('/api/set-avid', {
                email,
                avid: avid === 0 ? 'Newcomer' : avid === 1 ? 'Hobbyist' : 'Veteran'
            })

            if (username.length > 0 && !res.data[0] && isModified){
                setMaxPage(4);
                setCurrPage(4);
            }

        } catch(e) {

        }

        

    }

    useEffect(() => {
        if (avid !== null){
            handleClick(avid);
        }
    }, [])

  return (
    <>

        <div className='n-register-right-content' style={{width: '80%'}}>

            <img src='/bb-logo.png' style={{width: '4rem', marginTop: '4rem'}}/>
            <div className='n-register-top-0'> Answer a Quick Question</div>
            <div className='n-register-top-1'>We want to know about your habits</div>
    
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'left', width: '24rem'}}>
                <div style={{fontWeight: '600', marginTop: '3rem'}}>1. Select a display name</div>
                <div style={{position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem'}}>
                <input className={(!usernameEmpty && !usernameTaken) ? 'n-login-input' : 'n-login-input-error'}
                    placeholder='Display Name'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <div style={{position: 'absolute', left: '5%', display: 'flex'}}><User /></div>

                {usernameEmpty && <div className='n-register-error'>Enter a valid username</div>}
                {usernameTaken && <div className='n-register-error'>Username is already in use</div>}

                </div>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'left', width: '24rem'}}>
                <div style={{fontWeight: '600', marginTop: '3rem'}}>2. How long have you been an avid reader for?</div>
            </div>


        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '1.8125rem'}}>
            <div className={readingLevel[0] ? 'n-avid-box-active' : 'n-avid-box'} onClick={() => handleClick(0)}>
                <img src='/avid_0.png' style={{width: '1.8rem'}}/>
                <div style={{marginTop: '1rem', fontSize: '0.9rem', fontWeight: '600', color: readingLevel[0] ? '#06AB78' : '#454b54'}}>Newcomer</div>
                <div style={{color: '#8B8C8D', marginTop: '0.4rem', fontSize: '0.625rem'}}>{'I don’t read books very often. I’m just getting into reading. (0-3 books/yr)'}</div>
            </div>
            <div className={readingLevel[1] ? 'n-avid-box-active' : 'n-avid-box'} onClick={() => handleClick(1)}>
                <img src='/avid_1.png' style={{width: '1.8rem'}}/>
                <div style={{marginTop: '1rem', fontSize: '0.9rem', fontWeight: '600', color: readingLevel[1] ? '#06AB78' : '#454b54'}}>Hobbyist</div>
                <div style={{color: '#8B8C8D', marginTop: '0.4rem', fontSize: '0.625rem'}}>{'I like to read as a hobby. It’s something I enjoy.'}<br></br>{' (4-11 books/yr)'}</div>
            </div>
            <div className={readingLevel[2] ? 'n-avid-box-active' : 'n-avid-box'} onClick={() => handleClick(2)}>
                <img src='/avid_2.png' style={{width: '1.8rem'}}/>
                <div style={{marginTop: '1rem', fontSize: '0.9rem', fontWeight: '600', color: readingLevel[2] ? '#06AB78' : '#454b54'}}>Veteran</div>
                <div style={{color: '#8B8C8D', marginTop: '0.4rem', fontSize: '0.625rem'}}>{'I always read during my free time. I can’t live without it. (12+ books/yr)'}</div>
            </div>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'left', width: '24rem', marginTop: '1rem'}}>
            <button className={(isModified && username.length > 0) ? 'n-log-in-btn' : 'n-log-in-btn-null'} onClick={() => confirmAnswer()}>Confirm Answer</button>
        </div>

        <div className='n-register-right-progress-flex'>
            <div className='n-progress-active'/>
            <div className='n-progress-active'/>
            <div className='n-progress-active'/>
            <div className='n-progress-inactive'/>
        </div>

        </div>
    
    </>
  )
}

export default RegisterForum_2