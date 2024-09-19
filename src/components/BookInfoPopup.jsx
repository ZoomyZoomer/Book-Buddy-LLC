import React from 'react'
import { useEffect } from 'react';
import {ReactComponent as Close} from '../close_icon.svg'
import '../bookinfopopup.css'

const BookInfoPopup = ({summary, setBookInfoPopup, bookData}) => {

    useEffect(() => {
        const popup = document.querySelector('.book-info-popup');
        const handleScroll = () => {
          const navbar = document.querySelector('.book-info-main');
          if (popup.scrollTop > 50) {
            navbar.classList.add('scrolling');
          } else {
            navbar.classList.remove('scrolling');
          }
        };
    
        popup.addEventListener('scroll', handleScroll);
    
        // Cleanup the event listener on component unmount
        return () => {
          popup.removeEventListener('scroll', handleScroll);
        };
      }, []);

  return (
    <div className='book-info-popup'>
        <div className='book-info-container'>
            <div className='book-info-main'>
                <div className='bi-0'>
                    {bookData?.volumeInfo.title}
                    <div className='book-info-close' onClick={() => setBookInfoPopup(false)}><Close /></div>
                </div>
                <div className='bi-1'>Summary</div>
            </div>

            <div className='summary-contents'>
                <div className='sum'>{summary[0]}</div>
                <br></br>
                <div className='sum'>{summary[1]}</div>
                <br></br>
                <div className='sum'>{summary[2]}</div>
                <div className='bi-sep' />
            </div>

            

            <div className='details-contents'>
                <div className='detail-entry'>
                    <div className='dc-0'>Title</div>
                    <div className='dc-1'>{bookData?.volumeInfo.title}</div>
                </div>
                <div className='detail-entry'>
                    <div className='dc-0'>Author</div>
                    <div className='dc-1'>{bookData?.volumeInfo.authors[0]}</div>
                </div>
                <div className='detail-entry'>
                    <div className='dc-0'>Number of Pages</div>
                    <div className='dc-1'>{bookData?.volumeInfo.pageCount}</div>
                </div>
                <div className='detail-entry'>
                    <div className='dc-0'>Language</div>
                    <div className='dc-1'>{bookData?.volumeInfo.language === 'en' ? 'English' : bookData?.volumeInfo.language}</div>
                </div>
                <div className='detail-entry'>
                    <div className='dc-0'>ISBN-13</div>
                    <div className='dc-1'>{bookData?.volumeInfo.industryIdentifiers[0].identifier}</div>
                </div>
                <div className='detail-entry'>
                    <div className='dc-0'>Publisher</div>
                    <div className='dc-1'>{bookData?.volumeInfo.publisher}</div>
                </div>
                <div className='detail-entry'>
                    <div className='dc-0'>Publish Date</div>
                    <div className='dc-1'>{bookData?.volumeInfo.publishedDate}</div>
                </div>
                <div className='detail-entry'>
                    <div className='dc-0'>Category</div>
                    <div className='dc-1'>{bookData?.volumeInfo.categories[0]}</div>
                </div>
            </div>

        </div>
        
    </div>
  )
}

export default BookInfoPopup