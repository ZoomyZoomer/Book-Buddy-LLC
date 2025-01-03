import React, { useState, useRef } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as Logo } from '../logo.svg';
import { useEffect, useContext } from 'react';
import { UserContext } from '../components/UserContext';
import {ReactComponent as Email} from '../n-email.svg'
import {ReactComponent as Lock} from '../n-lock.svg'
import {ReactComponent as Check} from '../n-checkm.svg'
import { Helmet } from 'react-helmet';

import '../loginstyles.css'
import GoogleSignIn from '../components/GoogleSignIn';


function LoginPage() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [userInfo, setUserInfo] = useState({});

    const [checkBox, setCheckBox] = useState(false);
    const audioRef = useRef(null);

    const playAudio = () => {
        setTimeout(() => {
            audioRef.current.volume = 0.05;
            audioRef.current.play();
        }, 300)
    };

      const handleRemember = async(isRemembered) => {

        await axios.post("/api/set-email-cookie", {
            email,
            setCookie: isRemembered
        })

    }

   async function submit(){

        try {
            const response = await axios.post("/api/signin", {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.status === 200) {
                console.log("Login successful");
                handleRemember(checkBox);
                navigate('/library');
            } else {
                alert("Login failed");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Login failed. Please try again.");
        }

    }

    const getCookie = async() => {
        
        try {

            const res = await axios.get('/api/fetch-email-cookie');
 
            setEmail(res.data.email);
            if (res.data.email){
                setCheckBox(true);
            }

        } catch(e) {
            console.error({error: 'Could not fetch cookie'});
        }

    };

    useEffect(() => {
        getCookie();
    }, [])


  return (
    <div className="n-login-bg">

        <audio ref={audioRef}>
            <source src="scribble.wav" type="audio/wav" />
            Your browser does not support the audio element.
        </audio>

        <div className='n-login-box'>

            <div className='n-login-section'>

                <div className='n-login-m-sec'>

                    <div className='n-register-logo-section2' onClick={() => navigate('/')}>
                        <img src='/bb-logo.png' style={{height: '2.2rem', width: '2.2rem', cursor: 'pointer'}}/>
                        <div className='logo-title'>BOOK <strong>BUDDY</strong></div>
                    </div>

                    <div className='n-login-main-text'>Log in to your Account</div>
                    <div className='n-login-sub-text'>Welcome back! Select a method to log in:</div>

                    <GoogleSignIn />

                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem', marginBottom: '2rem', width: '100%'}}>

                        <div className='n-email-seg'/>
                        <div style={{color: '#727E90', fontSize: '0.625rem', width: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>or continue with email</div>
                        <div className='n-email-seg'/>

                    </div>

                    <div style={{position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <input className='n-login-input'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div style={{position: 'absolute', left: '5%', display: 'flex'}}><Email /></div>
                    </div>

                    <div style={{position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1.3rem'}}>
                        <input className='n-login-input'
                            placeholder='Password'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div style={{position: 'absolute', left: '5%', display: 'flex'}}><Lock /></div>
                    </div>

                    <div style={{marginTop: '1.4rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

                        <div style={{width: '50%', display: 'flex', justifyContent: 'left', alignItems: 'center'}}>
                            {!checkBox ? 
                                <div className='n-checkbox' onClick={() => {setCheckBox(prev => !prev); playAudio()}}></div> : 
                                <div className='n-checkbox-filled' onClick={() => {setCheckBox(prev => !prev)}}>
                                    <div className='n-checkbox-bg'/>
                                    <div className='n-check-icon'><Check /></div>
                                </div>}
                            <div style={{color: '#727E90', marginLeft: '0.625rem', fontSize: '0.8125rem'}}>Remember me</div>
                        </div>

                        <div style={{width: '50%', display: 'flex', justifyContent: 'right', alignItems: 'center'}}>
                            <div style={{color: '#4792F4', fontSize: '0.8125rem', cursor: 'pointer'}}>Forgot password?</div>
                        </div>

                    </div>

                    <button className='n-log-in-btn' onClick={() => submit()}>Log in</button>

                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.8125rem', marginTop: '1.8125rem'}}>
                        <div>Don’t have an account?</div>
                        <div style={{color: '#4792F4', marginLeft: '1rem', cursor: 'pointer'}} onClick={() => navigate("/register")}>Create an account</div>
                    </div>

                </div>

            </div>

            <div className='n-login-section' style={{width: '40%'}}>
                <img src='/login-bg.png' style={{height: '96%', borderRadius: '2rem', width: '96%', marginRight: '1rem'}}/>
            </div>

            <div style={{position: 'absolute', bottom: '5%'}}>

                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                    <div className='patch_0' style={{zIndex: '200'}}>
                        <div className='patch_0_sub' style={{zIndex: '200'}}>
                            <div style={{backgroundColor: '#E6E6E6', height: '60%', width: '60%', borderRadius: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginTop: '0.4rem', marginLeft: '0.4rem', zIndex: '200'}}>
                                <img src='/patch_0.png' style={{position: 'absolute', height: '3.6rem', bottom: '10%', transform: 'rotate(-20deg)', right: '10%', zIndex: '200'}}/>
                            </div>
                            
                        </div>
                    </div>
                    <div className='patch_0_shadow'/>
                </div>

            </div>

            <div style={{position: 'absolute', bottom: '30%', left: '3%'}}>

                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                    <div className='patch_2' style={{zIndex: '200'}}>
                        <div className='patch_2_sub' style={{zIndex: '200'}}>
                            <div style={{backgroundColor: '#E6E6E6', height: '70%', width: '70%', borderRadius: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginTop: '0.2rem', zIndex: '200'}}>
                                <img src='/patch_2.png' style={{position: 'absolute', height: '1.8rem', bottom: '12%', transform: 'rotate(5deg)', right: '0%', zIndex: '200'}}/>
                            </div>
                            
                        </div>
                    </div>
                    <div className='patch_2_shadow'/>
                </div>

            </div>

            <div style={{position: 'absolute', bottom: '24%', left: '5%'}}>

                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                    <div className='patch_1' style={{zIndex: '200'}}>
                        <div className='patch_1_sub' style={{zIndex: '200'}}>
                            <div style={{backgroundColor: '#E6E6E6', height: '60%', width: '60%', borderRadius: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginTop: '0.4rem', marginLeft: '0.4rem', zIndex: '200'}}>
                                <img src='/patch_1.png' style={{position: 'absolute', height: '3.2rem', bottom: '4%', transform: 'rotate(15deg)', right: '0%', zIndex: '200'}}/>
                            </div>
                            
                        </div>
                    </div>
                    <div className='patch_1_shadow'/>
                </div>

            </div>

        

            <div style={{position: 'absolute', top: '12%'}}>

                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                    <div className='patch_3' style={{zIndex: '200'}}>
                        <div className='patch_3_sub' style={{zIndex: '200'}}>
                            <div style={{backgroundColor: '#E6E6E6', height: '60%', width: '60%', borderRadius: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginTop: '0.4rem', marginLeft: '0.4rem', zIndex: '200'}}>
                                <img src='/patch_3.png' style={{position: 'absolute', height: '2.6rem', bottom: '4%', transform: 'rotate(-40deg)', right: '7%', zIndex: '200'}}/>
                            </div>
                            
                        </div>
                    </div>
                    <div className='patch_3_shadow'/>
                </div>

            </div>

        </div>

    </div>
  )
}

export default LoginPage