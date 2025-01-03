import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import {ReactComponent as Email} from '../n-email.svg'
import {ReactComponent as Lock} from '../n-lock.svg'
import GoogleSignIn from './GoogleSignIn';

const RegisterForum_0 = ({setCurrPage, setMaxPage, maxPage, email, setEmail, username, setUsername, password, setPassword}) => {

    const [usernameEmpty, setUsernameEmpty] = useState(false);
    const [emailEmpty, setEmailEmpty] = useState(false);
    const [passwordEmpty, setPasswordEmpty] = useState(false);

    const [usernameTaken, setUsernameTaken] = useState(false);
    const [emailTaken, setEmailTaken] = useState(false);

    const submitForum = async() => {

        setUsernameEmpty(false);
        setEmailEmpty(false);
        setPasswordEmpty(false);
        setUsernameTaken(false);
        setEmailTaken(false);

        let res = [0, 0];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.length > 0){

            // Check if all fields are filled properly
            res = await axios.get('/api/fetch-valid-account', {
                params: {
                    email,
                    username
                }
            })


            if (res.data[1]){
                setEmailTaken(true);
            }

        }

        if ((email.length === 0) || !emailRegex.test(email)){
            setEmailEmpty(true);
        }

        if (password.length === 0){
            setPasswordEmpty(true);
        }

        if (email.length > 0 && password.length > 0 && !res.data[1] && emailRegex.test(email)){
            setTimeout(() => {
                setMaxPage(2);
                setCurrPage(2);
            }, 450)
        }
    
    }

  return (
    <>

        <div className='n-register-right-content'>

            <img src='/bb-logo.png' style={{width: '4rem', marginTop: '4rem'}}/>
            <div className='n-register-top-0'>Create a free Account</div>
            <div className='n-register-top-1'>Provide your credentials to create an account.</div>

            <GoogleSignIn />

            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '2.4rem'}}>
                <div className='n-email-seg'/>
                    <div style={{color: '#727E90', fontSize: '0.625rem', width: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>or continue with email</div>
                <div className='n-email-seg'/>
            </div>

            <div style={{position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2.4rem'}}>
                <input className={(!emailEmpty && !emailTaken) ? 'n-login-input' : 'n-login-input-error'}
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div style={{position: 'absolute', left: '5%', display: 'flex'}}><Email /></div>

                {emailEmpty && <div className='n-register-error'>Enter a valid email</div>}
                {emailTaken && <div className='n-register-error'>Email is already in use</div>}

            </div>

            <div style={{position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1.8125rem'}}>
                <input className={!passwordEmpty ? 'n-login-input' : 'n-login-input-error'}
                    placeholder='Password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div style={{position: 'absolute', left: '5%', display: 'flex'}}><Lock /></div>

                {passwordEmpty && <div className='n-register-error'>Enter a valid password</div>}

            </div>

            <button className='n-log-in-btn' style={{marginTop: '2.4rem'}} onClick={() => {submitForum()}}>Continue</button>

            <div className='n-register-right-progress-flex'>
                <div className='n-progress-active'/>
                <div className='n-progress-inactive'/>
                <div className='n-progress-inactive'/>
                <div className='n-progress-inactive'/>
            </div>

        </div>        

    </>
  )
}

export default RegisterForum_0