import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';

const RegisterForum_2 = ({setMaxPage, setCurrPage, avid, setAvid, email}) => {

    const [readingLevel, setReadingLevel] = useState([0,0,0]);
    const [isModified, setIsModified] = useState(false);

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

        try {

            await axios.post('/api/set-avid', {
                email,
                avid: avid === 0 ? 'Newcomer' : avid === 1 ? 'Hobbyist' : 'Veteran'
            })

            setMaxPage(4);
            setCurrPage(prev => prev + 1);

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
    
        <div className='n-register-main-text'>
            <div>Just a quick question about you...</div>
            <div style={{fontSize: '0.7em', color: '#8B8C8D', fontWeight: '400', marginTop: '0.425rem'}}>How long have you been an avid reader for?</div>
        </div>

        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '3rem'}}>
            <div className={readingLevel[0] ? 'n-avid-box-active' : 'n-avid-box'} onClick={() => handleClick(0)}>
                <img src='/avid_0.png' style={{width: '2rem'}}/>
                <div style={{marginTop: '1rem', fontSize: '0.9rem', fontWeight: '600', color: readingLevel[0] ? '#06AB78' : '#454b54'}}>Newcomer</div>
                <div style={{color: '#8B8C8D', marginTop: '0.4rem', fontSize: '0.625rem'}}>{'I don’t read books very often. I’m just getting into reading. (0-3 books/yr)'}</div>
            </div>
            <div className={readingLevel[1] ? 'n-avid-box-active' : 'n-avid-box'} onClick={() => handleClick(1)}>
                <img src='/avid_1.png' style={{width: '2rem'}}/>
                <div style={{marginTop: '1rem', fontSize: '0.9rem', fontWeight: '600', color: readingLevel[1] ? '#06AB78' : '#454b54'}}>Hobbyist</div>
                <div style={{color: '#8B8C8D', marginTop: '0.4rem', fontSize: '0.625rem'}}>{'I like to read as a hobby. It’s something I enjoy.'}<br></br>{' (4-11 books/yr)'}</div>
            </div>
            <div className={readingLevel[2] ? 'n-avid-box-active' : 'n-avid-box'} onClick={() => handleClick(2)}>
                <img src='/avid_2.png' style={{width: '2rem'}}/>
                <div style={{marginTop: '1rem', fontSize: '0.9rem', fontWeight: '600', color: readingLevel[2] ? '#06AB78' : '#454b54'}}>Veteran</div>
                <div style={{color: '#8B8C8D', marginTop: '0.4rem', fontSize: '0.625rem'}}>{'I always read during my free time. I can’t live without it. (12+ books/yr)'}</div>
            </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
            <button className={isModified ? 'n-confirm-btn' : 'n-confirm-btn-null'} onClick={() => confirmAnswer()}>Confirm Answer</button>
        </div>
    
    </>
  )
}

export default RegisterForum_2