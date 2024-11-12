import React from 'react'
import {ReactComponent as OpenBook} from '../n-open-book.svg'

const ReadingEntryItem = ({index, entry}) => {
  return (
    <div className='reading-entry-item-cont' style={{backgroundColor: index % 2 === 0 ? '#F2F2F2' : '#FAFAFA'}}>
        <div className='n-reading-entry-flex'>
            <div className='n-reading-entry-circle' style={{backgroundColor: entry?.is_claimed ? '#78C6A3' : '#E4E4E4'}}>
                <img src={`/${entry?.icon ? entry.icon.name : 'no_file'}.png`} style={{height: '3.1rem', marginTop: '0.4rem'}}/>
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