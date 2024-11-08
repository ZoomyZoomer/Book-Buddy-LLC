import React from 'react'
import {ReactComponent as OpenBook} from '../n-open-book.svg'

function ReadingEntryItem() {
  return (
    <div className='reading-entry-item-cont'>
        <div className='n-reading-entry-flex'>
            <div className='n-reading-entry-circle'>
                <img src='/file_4.png' style={{height: '3.1rem', marginTop: '0.4rem'}}/>
            </div>
            <div className='n-reading-entry-info'>
                <div className='n-ret'>Harry Potter and the Sorcerer's Stone</div>
                <div className='n-tag'><OpenBook />&nbsp; 68 pages</div>
            </div>
        </div>
    </div>
  )
}

export default ReadingEntryItem