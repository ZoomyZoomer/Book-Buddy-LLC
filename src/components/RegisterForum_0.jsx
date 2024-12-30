import React from 'react'
import { useState } from 'react'
import axios from 'axios';

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

        if (email.length > 0 && username.length > 0){

            // Check if all fields are filled properly
            res = await axios.get('/api/fetch-valid-account', {
                params: {
                    email,
                    username
                }
            })

            if (res.data[0]){
                setUsernameTaken(true);
            }

            if (res.data[1]){
                setEmailTaken(true);
            }

        }

        if (username.length === 0){
            setUsernameEmpty(true);
        }

        if (email.length === 0){
            setEmailEmpty(true);
        }

        if (password.length === 0){
            setPasswordEmpty(true);
        }

        if (username.length > 0 && email.length > 0 && password.length > 0 & !res.data[0] && !res.data[1]){
            setTimeout(() => {
                setMaxPage(2);
                setCurrPage(prev => prev + 1);
            }, 450)
        }
    
    }

  return (
    <>

        <div className='n-register-main-text'>
            <div>Let's get the pages turning...</div>
            <div style={{fontSize: '0.7em', color: '#8B8C8D', fontWeight: '400', marginTop: '0.425rem'}}>First, we need some basic information.</div>
        </div>

        <div className='n-register-input-boxes'>

            <div style={{width: '22rem', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>

            <div className='n-register-input-info'>Email address</div>

            <input className={(emailEmpty || emailTaken) ? 'n-register-input-invalid' : 'n-register-input'}
                placeholder='your-email@gmail.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            {emailEmpty && <div className='input-error'>Enter a valid email</div>}
            {emailTaken && <div className='input-error'>This email is already in use</div>}

            <div className='n-register-input-info' style={{marginTop: '1.8125rem'}}>Username</div>

            <input className={(usernameEmpty || usernameTaken) ? 'n-register-input-invalid' : 'n-register-input'}
                placeholder='WholeMilky'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            {usernameEmpty && <div className='input-error'>Enter a valid username</div>}
            {usernameTaken && <div className='input-error'>This username is already in use</div>}

            <div className='n-register-input-info' style={{marginTop: '1.8125rem'}}>Password</div>

            <input className={(passwordEmpty) ? 'n-register-input-invalid' : 'n-register-input'}
                placeholder='*********'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {passwordEmpty && <div className='input-error'>Enter a valid password</div>}

            <button className='n-register-btn' onClick={() => submitForum()}>Create Account</button>

            </div>

        </div>
    </>
  )
}

export default RegisterForum_0