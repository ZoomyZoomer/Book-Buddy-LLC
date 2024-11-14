import React, { useState, useRef } from 'react'
import {ReactComponent as OpenBook} from '../n-open-book.svg'
import axios from 'axios'

const ReadingEntryItem = ({index, entry, username}) => {

  const audioRefCheck = useRef(null);

    const playAudioRefCheck = () => {
        audioRefCheck.current.volume = 0.2;
        audioRefCheck.current.play();
    };

  const [wasClicked, setWasClicked] = useState(false);

  const claimFile = async() => {

    if (entry?.is_claimed) return;
    if (!entry) return;

    await axios.post('/api/claim-file', {
      username,
      new_file: {id: entry.id},
      index: [-1,-1],
      notWarehouse: true,
      entry
    })

    setWasClicked(true);
    playAudioRefCheck();

  }

  return (
    <div className='reading-entry-item-cont' style={{backgroundColor: index % 2 === 0 ? '#F2F2F2' : '#FAFAFA'}}>

        <audio ref={audioRefCheck} src="/pop.mp3" />

        <div className='n-reading-entry-flex'>
            <div className='n-reading-entry-circle' style={{backgroundColor: (entry?.is_claimed || wasClicked) ? '#78C6A3' : '#E4E4E4'}} onClick={() => claimFile()}>
                <img src={`/${entry?.icon ? entry.icon.name : 'no_file'}.png`} style={{height: '3.1rem', marginTop: '0.4rem'}} className={entry && !entry?.is_claimed && !wasClicked ? 'n-file-claim' : ''} />
                {!entry?.is_claimed && !wasClicked && (<div className='n-claim-circle'/>)}
            </div>
            <div className='n-reading-entry-info'>
                <div className='n-ret'>
                  {entry?.title ? entry.title : entry && "Unmarked Reading Entry"}
                  {entry === null && (
                    <div class="loader3"></div>
                  )}
                  </div>
                  {entry?.pages_added && (
                    <div className='n-tag'><OpenBook />&nbsp; {entry.pages_added} pages</div>
                  )}
                  {!entry?.pages_added && entry && (
                    <div className='n-tag'><OpenBook />&nbsp; No pages</div>
                  )}
                  {!entry && (<div class="loader3_small" style={{marginTop: '0.4rem'}}></div>)}

                  {entry?.title && (
                    <div className='n-entry-date'>{entry?.date && `${entry.date.month} ${entry.date.day}, ${entry.date.year}`}</div>
                  )}

            </div>
        </div>
    </div>
  )
}

export default ReadingEntryItem