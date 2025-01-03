import React, { useContext, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {ReactComponent as User} from '../n-user-reg.svg'
import {ReactComponent as UserWhite} from '../n-user-reg-white.svg'
import {ReactComponent as Email} from '../n-email-reg.svg'
import {ReactComponent as EmailWhite} from '../n-email-reg-white.svg'
import {ReactComponent as Question} from '../n-question-reg.svg'
import {ReactComponent as QuestionWhite} from '../n-question-reg-white.svg'
import {ReactComponent as Checkmark} from '../n-checkmark-reg.svg'
import {ReactComponent as CheckmarkWhite} from '../n-checkmark-reg-white.svg'
import {ReactComponent as LeftArrow} from '../n-left-reg.svg'
import { useEffect } from 'react';
import '../registerstyles.css';
import '../loginstyles.css';
import RegisterForum_0 from '../components/RegisterForum_0';
import RegisterForum_1 from '../components/RegisterForum_1';
import RegisterForum_2 from '../components/RegisterForum_2';
import RegisterForum_3 from '../components/RegisterForum_3';

function SignUpPage() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const [userInfo, setUserInfo] = useState({});
    const [currPage, setCurrPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);

    const [avid, setAvid] = useState(null);

    const location = useLocation();  // Get the location object
    const { auth_email } = location.state || {};  // Extract the parameters from state

      const handleCircleClick = (num) => {

        if (num <= maxPage) {
            setMaxPage(Math.max(maxPage, currPage));
            setCurrPage(num);
        }

      }


    /*
    async function submit(e){

        e.preventDefault();

        try {
            const response = await axios.post("/api/register", {
                username,
                password,
                email
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.status === 201) {
                alert("Registration successful");
                navigate('/signin');
            } else {
                alert("Registration failed");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Registration failed. Please try again.");
        }
        
        

    }*/

        useEffect(() => {
            if (auth_email){
                setEmail(auth_email);
                setMaxPage(3);
                setCurrPage(3);
            }
        }, [auth_email])


    return (
        <div className="n-register-bg">
    
            <div className='n-register-box'>

                <div className='n-register-left-sec'>

                    <div style={{display: 'flex', justifyContent: 'left', flexDirection: 'column', height: '100%', position: 'relative', width: '20rem'}}>

                    <img src='/bb-logo.png' className='n-register-shadow-logo'/>

                    <div style={{height: '100%', width: '75%', display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'center'}}>

                        <div className='n-register-logo-section' onClick={() => navigate('/')}>
                            <img src='/bb-logo.png' style={{height: '2.2rem', width: '2.2rem', cursor: 'pointer'}}/>
                            <div className='logo-title'>BOOK <strong>BUDDY</strong></div>
                        </div>

                        <div className='n-register-sections-container'>

                            <div className='n-register-lvl-flex'>

                                <div className={maxPage === 1 ? 'n-register-lvl-box-current' : 'n-register-lvl-box-complete'}>
                                    {maxPage <= 1 ? <User /> : <UserWhite />}
                                    <div className={maxPage <= 1 ? 'n-register-lvl-line-incomplete' : 'n-register-lvl-line-complete'}/>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'left', marginLeft: '1.6rem'}}>
                                    <div className={maxPage < 1 ? 'n-register-lvl-0-incomplete' : 'n-register-lvl-0-complete'}>Your details</div>
                                    <div className={maxPage < 1 ? 'n-register-lvl-1-incomplete' : 'n-register-lvl-1-complete'}>Provide an email & password</div>
                                </div>

                            </div>

                            <div style={{height: '2.4375rem', width: '100%'}}/>

                            <div className='n-register-lvl-flex'>

                                <div className={maxPage < 2 ? 'n-register-lvl-box' : maxPage === 2 ? 'n-register-lvl-box-current' : 'n-register-lvl-box-complete'}>
                                    {maxPage <= 2 ? <Email /> : <EmailWhite />}
                                    <div className={maxPage <= 2 ? 'n-register-lvl-line-incomplete' : 'n-register-lvl-line-complete'}/>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'left', marginLeft: '1.6rem'}}>
                                    <div className={maxPage < 2 ? 'n-register-lvl-0-incomplete' : 'n-register-lvl-0-complete'}>Verify your email</div>
                                    <div className={maxPage < 2 ? 'n-register-lvl-1-incomplete' : 'n-register-lvl-1-complete'}>Enter your verification code</div>
                                </div>

                            </div>

                            <div style={{height: '2.4375rem', width: '100%'}}/>

                            <div className='n-register-lvl-flex'>

                                <div className={maxPage < 3 ? 'n-register-lvl-box' : maxPage === 3 ? 'n-register-lvl-box-current' : 'n-register-lvl-box-complete'}>
                                {maxPage <= 3 ? <Question /> : <QuestionWhite />}
                                    <div className={maxPage <= 3 ? 'n-register-lvl-line-incomplete' : 'n-register-lvl-line-complete'}/>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'left', marginLeft: '1.6rem'}}>
                                    <div className={maxPage < 3 ? 'n-register-lvl-0-incomplete' : 'n-register-lvl-0-complete'}>Quick question</div>
                                    <div className={maxPage < 3 ? 'n-register-lvl-1-incomplete' : 'n-register-lvl-1-complete'}>Tell us about your reading habits</div>
                                </div>

                            </div>

                            <div style={{height: '2.4375rem', width: '100%'}}/>

                            <div className='n-register-lvl-flex'>

                                <div className={maxPage < 4 ? 'n-register-lvl-box' : maxPage === 4 ? 'n-register-lvl-box-current' : 'n-register-lvl-box-complete'}>
                                {maxPage <= 4 ? <Checkmark /> : <CheckmarkWhite />}
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'left', marginLeft: '1.6rem'}}>
                                    <div className={maxPage < 4 ? 'n-register-lvl-0-incomplete' : 'n-register-lvl-0-complete'}>Welcome!</div>
                                    <div className={maxPage < 4 ? 'n-register-lvl-1-incomplete' : 'n-register-lvl-1-complete'}>Begin your journey</div>
                                </div>

                            </div>


                        </div>

                    </div>

                        <div className='n-register-left-back' onClick={() => navigate('/')}><LeftArrow />&nbsp;Back to Home</div>
                        <div className='n-register-left-sign-in' onClick={() => navigate('/signin')}>Sign in</div>

                    </div>

                </div>

                <div className='n-register-right-sec'>

                {(() => {
                    switch (currPage) {
                        case 1:
                            return <RegisterForum_0 setMaxPage={setMaxPage} setCurrPage={setCurrPage} username={'null'} email={email} setEmail={setEmail} password={password} setPassword={setPassword}/>;
                        case 2:
                            return <RegisterForum_1 email={email} setCurrPage={setCurrPage} password={password} setMaxPage={setMaxPage}/>
                        case 3:
                            return <RegisterForum_2 setAvid={setAvid} email={email} avid={avid} setMaxPage={setMaxPage} setCurrPage={setCurrPage} setUsername={setUsername} username={username}/>
                        case 4:
                            return <RegisterForum_3 username={username} setMaxPage={setMaxPage} email={email}/>
                        default:
                            return null;
                    }
                })()}
                    

                </div>

            </div>
    
        </div>
      )
    }

export default SignUpPage