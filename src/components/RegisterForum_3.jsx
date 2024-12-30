import React from 'react'
import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const RegisterForum_3 = ({username}) => {

    const audioRef = useRef(null);
    const navigate = useNavigate('/');

    const playAudio = () => {
        audioRef.current.volume = 0.1;
        audioRef.current.play();
    };

    useEffect(() => {
        setTimeout(() => {
            playAudio();
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
              });
        }, 850)
    }, [])

  return (
    <>

        <audio ref={audioRef}>
            <source src="scribble.wav" type="audio/wav" />
            Your browser does not support the audio element.
        </audio>

        <div class="wrapper"> 
            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"> <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/> <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
        </div>
    
        <div className='n-register-main-text'>
            <div>Congratulations, {username}!</div>
            <div style={{fontSize: '0.7em', color: '#8B8C8D', fontWeight: '400', marginTop: '0.425rem'}}>You’ve successfully created your account. Let’s get reading!</div>
        </div>

        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '1rem'}}>
            <button className='n-confirm-btn' onClick={() => navigate('/library')}>Start Your Journey</button>
        </div>
    


    </>
  )
}

export default RegisterForum_3