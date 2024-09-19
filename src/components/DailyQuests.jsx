import React from 'react'
import { ReactComponent as Emoji1 } from '../emoji1.svg'
import Checkmark from './Checkmark'
import Quest from './Quest'

function DailyQuests() {


  return (
    <div className="dailyQuestsContainer">
        
        <div>
            
            <Quest />

            <Quest/>

            <Quest />
            
        </div>

    </div>
  )
}

export default DailyQuests