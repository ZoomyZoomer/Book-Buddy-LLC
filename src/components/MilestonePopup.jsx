import React, { useEffect, useRef, useState } from 'react'
import '../milestones.css'
import {ReactComponent as CloseIcon} from '../close_icon.svg';
import MilestoneInfoSection from './MilestoneInfoSection'
import axios from 'axios';
import NoMoreRewards from './NoMoreRewards';

const MilestonePopup = ({username, volume_id, tab_name, title, setMilestonePopup}) => {

  const executed = useRef(false);
  const [tierInfo, setTierInfo] = useState([]);

  const getTierInfo = async() => {

    const res = await axios.get('http://localhost:4000/get-tier-info', {
      params: {
        username,
        volume_id,
        tab_name
      }
    })

    setTierInfo(res.data);

  }

  useEffect(() => {

    if (!executed.current){
      executed.current = true;
      getTierInfo();
    }

  })

  useEffect(() => {
    const popup = document.querySelector('.milestone-popup-container');
    const handleScroll = () => {
      const navbar = document.querySelector('.mp-cont');
      if (popup.scrollTop > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    popup.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      popup.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div className='milestone-popup-container'>

      

        <div className='milestone-popup-grid'>
          <div className='new-cont'>
            <div className='mp-cont'>
              <div className='mp-0'>Reading Milestone Progress</div>
              <div className='mp-1'>{title}</div>
              <div className='milestone-close' onClick={() => setMilestonePopup(false)}><CloseIcon /></div>
            </div>
          </div>

          <div className='mp-sep'/>

          {tierInfo.map((tier, index) => (
            <>
              {tier?.name !== undefined ? (<MilestoneInfoSection info={tier}/>) :
              index + 1 === tierInfo.length ?
               (<NoMoreRewards tierInfo={tierInfo}/>) : <></>
               }
            </>
            
          ))}

        </div>

    </div>
  )
}

export default MilestonePopup