import React from 'react'
import {ReactComponent as Logo} from '../book_logo.svg'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../bookbuddy-navbar.css'

const BookBuddyNavbar = ({tab, currency}) => {

    const navigate = useNavigate('/');
    const [showXp, setShowXp] = useState(false);

    const fillXpBar = (xp) => {
        document.getElementsByClassName('xp-bar')[0].style.width = `${xp % 100}%`;
    }

    useEffect(() => {
        fillXpBar(currency[1]);
    }, [currency])

  return (
    <div className='bb-nav-container'>
        <div className='bb-nav-0'>
            <div className={tab === 0 ? 'bb-nav-active' : 'bb-nav-inactive'} onClick={() => navigate('/library')}><Logo /></div>
            <div className={tab === 0 ? 'bb-nav-active' : 'bb-nav-inactive'} onClick={() => navigate('/library')}>
                    <img src='/book-filled.png' className={tab === 0 ? 'bb-nav-img-active' : 'bb-nav-img'}/>
                    LIBRARY
            </div>
            <div className={tab === 1 ? 'bb-nav-active' : 'bb-nav-inactive'} onClick={() => navigate('/rewards')}>
                    <img src='/coupon-filled.png' className={tab === 1 ? 'bb-nav-img-active' : 'bb-nav-img'}/>
                    REWARDS
            </div>
            <div className={tab === 2 ? 'bb-nav-active' : 'bb-nav-inactive'} onClick={() => navigate('/storage')}>
                    <img src='/package-filled.png' className={tab === 2 ? 'bb-nav-img-active' : 'bb-nav-img'}/>
                    STORAGE
            </div>
       </div>
       <div className='bb-nav-1'>
       <div className='sn-1'>
                <div style={{display: 'flex', justifyContent: 'right', alignItems: 'center', fontWeight: '500', marginRight: '2%', width: '100%'}}>
                    <div style={{marginRight: '2%', color: '#06AB78'}}>Lvl {Math.floor(currency[1] / 100)}</div>
                    <div className='xp-bar-container' style={{marginRight: '5%'}} onMouseEnter={() => setShowXp(true)} onMouseLeave={() => setShowXp(false)}>
                        <div className='xp-bar'/>
                        {showXp && (<div className='showXp'>{`${currency[1] % 100} / 100 xp`}</div>)}
                    </div>
                    <div style={{display: 'flex', marginRight: '2%'}}>
                        <img src='/file_5.png' style={{height: '1.4rem', marginRight: '0.2rem'}}/>
                        {currency[2] === undefined ? 0 : currency[2]}
                    </div>
                    <img src='/coin.png' style={{height: '1.4rem', marginTop: '-0.15rem', marginRight: '0.2rem'}}/>
                    {currency[0]}
                </div>
            </div>
       </div>
    </div>
  )
}

export default BookBuddyNavbar