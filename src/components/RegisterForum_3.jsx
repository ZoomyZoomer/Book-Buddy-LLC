import React from 'react'
import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import axios from 'axios';

const RegisterForum_3 = ({ username, setMaxPage, email, password }) => {

    const audioRef = useRef(null);
    const navigate = useNavigate();

    const playAudio = () => {
        try {
            audioRef.current.volume = 0.1;
            audioRef.current.play();
        } catch (e) {
            console.error("Error playing audio", e);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            playAudio();
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6, x: 0.6 },
            });
        }, 850);
    }, []);

    const handleStart = async () => {
        try {

            await axios.post('/api/set-username', {
                email,
                username
            });

            await axios.post('/api/register', {
                email,
                username
            })

            setMaxPage(5);
            setTimeout(async() => { 

                try {
                    await axios.post("/api/signin", {
                        email,
                        password
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    navigate('/library');
                } catch(e){

                }

             }, 2000);

        } catch (e) {
            console.error("Error in handleStart", e);
        }
    };

    return (
        <>
            <audio ref={audioRef}>
                <source src="scribble.wav" type="audio/wav" />
                Your browser does not support the audio element.
            </audio>

            <div className='n-register-right-content' style={{ width: '65%' }}>
                <img src='/bb-logo.png' style={{ width: '4rem', marginTop: '4rem' }} />
                <div className='n-register-top-0'>Welcome to Book Buddy!</div>
                <div className='n-register-top-1' style={{ marginBottom: '4rem' }}>Get ready to begin your journey</div>

                <div className="wrapper">
                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                        <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
                </div>

                <div className='n-register-main-text'>
                    <div>Congratulations, {username}!</div>
                    <div style={{ fontSize: '0.7em', color: '#727E90', fontWeight: '400', marginTop: '0.425rem' }}>
                        You’ve successfully created your account. Let’s get reading!
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '1rem' }}>
                    <button className='n-log-in-btn' onClick={handleStart}>Start Your Journey</button>
                </div>
            </div>
        </>
    );
};

export default RegisterForum_3;
