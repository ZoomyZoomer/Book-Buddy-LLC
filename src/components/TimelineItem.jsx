import React, { useState } from 'react'
import axios from 'axios'
import '../timelineitem.css'

const TimelineItem = ({icon, entry, index, username, tab_name, volume_id, fetchData, getPages, numEntries}) => {

  const [showDetailedView, setShowDetailedView] = useState(false);

  console.log(entry);

  const handleClick = () => {

    setTimeout(() => {
      document.getElementsByClassName('timeline-item-active')[0]?.classList?.remove('timeline-item-active');

      document.getElementById(`timeline-item-${index}`).classList.add('timeline-item-active');

      document.getElementById(`timeline-item-info-${index}`).classList.add('timeline-item-info-active');
    }, 10)

  }

  const removeEntry = async() => {

    await axios.post('http://localhost:4000/remove-entry', {
      username,
      tab_name,
      volume_id,
      index
    })

    fetchData(username);
    getPages(username);

  }

  const handleDetailedView = () => {

    document.getElementsByClassName('timeline-item-info-active')[0].style.height = '9.6rem';
    document.getElementsByClassName('timeline-item-info-active')[0].style.top = '-10.2rem';

    setTimeout(() => {
      setShowDetailedView(true);
    }, 300)
    
  }

  const hideDetails = () => {

    setShowDetailedView(false);

    document.getElementsByClassName('timeline-item-info-active')[0].style.height = '7rem';
    document.getElementsByClassName('timeline-item-info-active')[0].style.top = '-7.6rem';


  }

  return (
    <>
    {icon?.name != undefined ? (
      <div id={`timeline-item-${index}`} className={index === numEntries - 1 ? 'timeline-item-outer' : 'timeline-item'} onClick={() => handleClick()}>
        <img id={`item_${index}`} src={`/${icon?.name}.png`} className='timeline-item-icon'/>
          <div id={`timeline-item-info-${index}`} className='timeline-item-info-box'>
            {showDetailedView && (
              <>
                <div className='timeline-item-info-main' style={{color: `${icon?.rarity === 'Common' ? '#7fd394' : icon?.rarity === 'Rare' ? '#6488b4' : '#a577c0'}`}}>{icon?.display} &#183; {icon?.rarity} {icon?.rarity === 'Epic' ? '(1/1)' : '(1/2)'}</div>
                <div className='timeline-item-info-curr-set'>Current set: Files</div>
              </>
            )}
            <div className='timeline-item-info-flex'>
              <img src={`/${icon?.name}.png`} className='timeline-item-info-icon'/>
              <div className='timeline-entry-info-grid' style={{marginLeft: '0.2rem'}}>
                <div className='tei-0'>Entry Info:</div>
                <div className='tei-1'>{`${entry.date.month} ${entry.date.day}, ${entry.date.year} (${entry.pages_added} pages)`}</div>
                <div className='tei-0'>Streak: </div>
                <div className='tei-1'>{`${entry.streak.days} ${entry.streak.days !== 1 ? 'days!!' : 'day!!'} (${entry.streak.dates[0]} - ${entry.streak.dates[entry.streak.dates.length - 1]})`}</div>
              </div>
            </div>
            <div className='timeline-item-info-flex' style={{marginTop: '0.6rem'}}>
              {!showDetailedView && (
                <button id='info-button-detailed' className='tei-b0' onClick={() => handleDetailedView()}>Detailed View</button>
              )}
              {showDetailedView && (
                <button id='info-button-detailed' className='tei-b0' onClick={() => hideDetails()}>Hide Details</button>
              )}
              <button id='info-button' className='tei-b1' onClick={() => removeEntry()}>Remove</button>
            </div>
          </div>
      </div>
    ): <div className={index === 5 ? 'timeline-item-outer' : 'timeline-item'} />}
    </>
    
  )
}

export default TimelineItem