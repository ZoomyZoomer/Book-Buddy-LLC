import React from 'react'
import RatingStatic from './RatingStatic'
import {ReactComponent as ThreeDots} from '../threeDots.svg'
import {ReactComponent as PlusGreen} from '../plus-green.svg'
import axios from 'axios'
import { useEffect } from 'react'

const BookItemAdd = ({book, tab_name, index, username, setIsAddingBook, addBookRef, setSearchCollection}) => {

  const handleAddBook = () => {

    
    axios.post('http://localhost:4000/addBook', {
      volumeId: book.id,
      title: book.volumeInfo.title,
      author: Array.isArray(book?.volumeInfo?.authors) ? book?.volumeInfo?.authors[0] : 'No listed author',
      cover: book.volumeInfo.imageLinks?.smallThumbnail !== undefined ? book.volumeInfo.imageLinks?.smallThumbnail : 'http://books.google.com/books/publisher/content?id=Z5nYDwAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&imgtk=AFLRE71w0_tgIHfDMwhEsvV-pEgZJhDOzyolKwNKjxdBne8QcH_cUZmfHby5Yem38_R8itwP5Oa0wKe2ygqV8APiUmP35Fpb568w3g-eGs5-5rc5zVgNLHRfTotPzpj7QrrfoYrtIp-9&source=gbs_api',
      genre: book.volumeInfo?.categories !== undefined ? book.volumeInfo?.categories : 'No genres',
      pages: book?.volumeInfo?.pageCount !== undefined ? book?.volumeInfo?.pageCount : 'No listed pages',
      tabName: tab_name,
      username: username
    }).then(() => {
      addBookRef.current = false;
      setSearchCollection([]);
      setIsAddingBook(false);
    })

  }

  return (
    <>
        <div className='bookitem-other-cont'>

        <div className='bookitem-rel-cont'>
        <div className="bookitem_container">

        

        <div className="book_cover">
          <img src={book.volumeInfo.imageLinks?.smallThumbnail !== undefined ? book.volumeInfo.imageLinks?.smallThumbnail :
            'http://books.google.com/books/publisher/content?id=Z5nYDwAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&imgtk=AFLRE71w0_tgIHfDMwhEsvV-pEgZJhDOzyolKwNKjxdBne8QcH_cUZmfHby5Yem38_R8itwP5Oa0wKe2ygqV8APiUmP35Fpb568w3g-eGs5-5rc5zVgNLHRfTotPzpj7QrrfoYrtIp-9&source=gbs_api'
          } draggable="false" />
        </div>
        
          <div className="book_contents" >

            <div className="book_title">
              {book.volumeInfo.title}
            </div>
            <div className="book_author">
              {Array.isArray(book?.volumeInfo?.authors) ? book?.volumeInfo?.authors[0] : 'No listed author'}
            </div>
          <div className='book-stuff'>
            <div className="book_rating">
                <RatingStatic tabName={tab_name} volumeId={book.id} rating={book?.volumeInfo?.averageRating}/>
            </div>
            {book?.volumeInfo?.averageRating === undefined ? <div className='no-rating'>No listed rating</div> : <></>}
            <div className="genre_tag2">
              <div className="genre_circle2"/>
              <div className="genre_text2">
                  {book.volumeInfo?.categories !== undefined ? book.volumeInfo?.categories : 'No genres'} 
              </div>
            </div>
            </div>


          </div>

          <div className={"book_options"}>

              <ThreeDots />
              
          </div>

          <div className="book_page_count">

                <div className='page-count'>{`${book?.volumeInfo?.pageCount !== undefined ? book?.volumeInfo?.pageCount : 'No listed '} pages`}</div>

          </div>
          <div className='bookitem-status-container2'>
            <div className='add-booky' style={{marginLeft: '-4%'}} onClick={() => handleAddBook()}><PlusGreen /></div>
          </div>
          
        </div>
          
        </div>

      </div>
    </>
  )
}

export default BookItemAdd