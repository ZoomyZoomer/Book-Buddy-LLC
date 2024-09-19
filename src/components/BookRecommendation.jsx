import React from 'react'
import {ReactComponent as Star} from '../starFullSmall.svg'

const BookRecommendation = ({book}) => {

    console.log(book);

  return (
    <div className='recommended-books'>

        <div>
            <img src={book?.volumeInfo?.imageLinks?.smallThumbnail} className='recommended-book-img'/>
        </div>

        <div className='recommended-info'>
            <div className='recommended-info'>
                <div className='recommended-title'>{book?.volumeInfo?.title}</div>
                <div className='recommended-author'>{book?.volumeInfo?.authors[0]}</div>
                <div className='recommended-other'>{!book?.volumeInfo?.averageRating ? 'None' : `${book?.volumeInfo.averageRating}`} 
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.2rem', marginRight: '0.2rem'}}><Star /></div>
                &#183; {book?.volumeInfo?.categories}</div>
            </div>
        </div>

    </div>
  )
}

export default BookRecommendation