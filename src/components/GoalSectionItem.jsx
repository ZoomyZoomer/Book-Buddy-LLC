import React from 'react'
import {ReactComponent as Book} from '../goal-book-open.svg'
import { useRef, useState } from 'react'
import axios from 'axios'

const GoalSectionItem = ({entry, index, username, setReFetchEntries}) => {

  const audioRefPop = useRef(null);

  const playAudioRefPop = () => {
    audioRefPop.current.volume = 0.1;
    audioRefPop.current.play();
  };

  const [entryClaimed, setEntryClaimed] = useState(false);

  const claimEntry = async() => {

    try {

      await axios.post('http://localhost:4000/claim-entry-item', {
          username,
          index
      })

      playAudioRefPop();
      setEntryClaimed(true);

    } catch(e){

    }

    setReFetchEntries(prev => !prev);

  }

  return (
    <div className={(entry && !entry.is_claimed) ? 'goal-sec-item-claim' : 'goal-sec-item-container'} onClick={() => claimEntry()}>

        {entryClaimed && (
          <img src={`/${entry.icon.name}.png`} className='mini-file0'/>
        )}

        {entry && !entry.is_claimed && (
          <div className='circle-click'/>
        )}

        <audio ref={audioRefPop} src="/coins.wav" />

        <div className={entry && entry?.is_claimed ? 'goal-sec-item-circle' : 'goal-sec-item-circle-null'}><img src={`/${entry?.icon?.name ? entry.icon.name : 'no_file'}.png`} className={entry?.icon && !entry?.is_claimed ? 'goal-section-file' : 'goal-section-file-null'}/></div>
        <div className='goal-sec-item-info'>
            <div>{entry?.title ? entry.title : "Unmarked Reading Entry"}</div>
            <div className='goal-sec-item-tag'>
                <div style={{display: 'flex', marginRight: '0.3rem'}}><Book /></div>
                {entry?.pages_added ? (entry?.pages_added != 1 ? `${entry?.pages_added} pages` : `${entry?.pages_added} page`) : 'Pages Here'}
            </div>
        </div>

        <div className='goal-sec-date'>{entry?.date ? (`${entry?.date.month} ${entry?.date.day}, ${entry?.date.year}`) : ''}</div>

    </div>
  )
}

export default GoalSectionItem