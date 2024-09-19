import React from 'react'
import '../entrytimeline.css'

function TimelineSection() {

  const removeEntry = () => {}

  const handleDetailedView = () => {}

  return (

    <div className='e-timeline-card-flex'>
        <div className='e-timeline-container'>
            <div className='e-dot'>
              <div className='e-time'>July 5, 7:45 PM</div>
            </div>
            <div className='e-line'/>
            <div className='e-dot2'>
              <div className='e-time'>July 5, 4:35 PM</div>
            </div>
            <div className='e-line-separate'/>
        </div>
        <div className='e-timeline-card'>
            <div className='e-timeline-item-info-main' style={{color: '#a577c0'}}>Love Letter &#183; Epic</div>
            <div className='e-timeline-card-flex2'>
                <img src='/file_3.png' className='e-timeline-item-info-icon'/>
                <div className='timeline-entry-info-grid' style={{marginLeft: '0.2rem'}}>
                <div className='tei-0'>Entry Info:</div>
                <div className='tei-1'>{'June 25, 2024 (52 pages)'}</div>
                <div className='tei-0'>Streak: </div>
                <div className='tei-1'>{'2 days! (June 16 - June 17)'}</div>
            </div>
            </div>
            <div className='e-timeline-remove'>
              <button id='info-button-detailed' className='tei-b0' onClick={() => handleDetailedView()}>Detailed View</button>
              <button id='info-button' className='tei-b1' onClick={() => removeEntry()}>Remove</button>
            </div>
        </div>
    </div>
  )
}

export default TimelineSection