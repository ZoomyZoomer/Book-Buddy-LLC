import React from 'react'

const RegisterForum_0 = ({setCurrPage, setMaxPage, maxPage, email, setEmail, username, setUsername, password, setPassword}) => {

    const submitForum = () => {

        setTimeout(() => {
            setMaxPage(2);
            setCurrPage(prev => prev + 1);
        }, 450)
    
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

            <input className='n-register-input'
                placeholder='your-email@gmail.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <div className='n-register-input-info' style={{marginTop: '1.8125rem'}}>Username</div>

            <input className='n-register-input'
                placeholder='WholeMilky'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <div className='n-register-input-info' style={{marginTop: '1.8125rem'}}>Password</div>

            <input className='n-register-input'
                placeholder='*********'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className='n-register-btn' onClick={() => submitForum()}>Create Account</button>

            </div>

        </div>
    </>
  )
}

export default RegisterForum_0