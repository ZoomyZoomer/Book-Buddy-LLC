import React from 'react'
import '../entrytimeline.css'
import TimelineSection from './TimelineSection'

const EntryTimelinePopup = ({entryData}) => {
  return (
    <div className='entry-timeline-popup-container'>
        <div className='e-timeline-flex'>

            <div className='e-timeline-grid'>

            <div className='e-timeline-top-container'>
              <div className='e-timeline-top'>
                <div className='mp-0'>Reading Timeline</div>
                <div className='mp-1'>Harry Potter and the Sorcerer's Stone</div>
              </div>
            </div>

              <div className='e-timeline-section-contents'>
                <TimelineSection />
                <TimelineSection />
                <TimelineSection />
                <TimelineSection />
              </div>

            </div>

        </div>
    </div>
  )
}

export default EntryTimelinePopup