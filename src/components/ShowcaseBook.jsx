import React from 'react'
import { useState } from 'react';

const ShowcaseBook = ({book}) => {

    const [currReadingColor, setCurrReadingColor] = useState('#FFA9A9');

    function lightenColor(color, percent) {
        // Extract the RGB values
        const num = parseInt(color?.slice(1), 16);
        let r = (num >> 16) + Math.round(255 * percent);
        let g = ((num >> 8) & 0x00FF) + Math.round(255 * percent);
        let b = (num & 0x0000FF) + Math.round(255 * percent);
    
        // Ensure values are within the 0-255 range
        r = Math.min(255, r);
        g = Math.min(255, g);
        b = Math.min(255, b);
    
        // Convert back to hex
        const newColor = (r << 16) | (g << 8) | b;
        return `#${newColor.toString(16).padStart(6, '0')}`;
      }

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', transform: 'scale(0.7)', marginLeft: '-5rem'}}>
                    <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center'}}>
                        <div className={'library-book-circle'}>
                            <div style={{height: 'fit-content', width: 'fit-content', position: 'absolute', top: '4%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <div style={{position: 'relative'}}>
                                    {(
                                        <>
                                            <img src={book?.volumeInfo?.imageLinks?.thumbnail ? book.volumeInfo.imageLinks.thumbnail : (book?.cover ? book.cover : 'http://books.google.com/books/publisher/content?id=Z5nYDwAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&imgtk=AFLRE71w0_tgIHfDMwhEsvV-pEgZJhDOzyolKwNKjxdBne8QcH_cUZmfHby5Yem38_R8itwP5Oa0wKe2ygqV8APiUmP35Fpb568w3g-eGs5-5rc5zVgNLHRfTotPzpj7QrrfoYrtIp-9&source=gbs_api')} className='library-cover'/>
                                        {book?.active_stickers?.find(sticker => sticker?.location == 0) && (
                                            <img 
                                                src={`/${book?.active_stickers?.find(sticker => sticker?.location == 0)?.sticker_name}-i.png`}
                                                className={book?.active_stickers?.find(sticker => sticker?.location == 0)?.sticker_id == ('7') ? 'sticker0z-abs' : 'sticker0-abs'}
                                            />
                                        )}
                                        {book?.active_stickers.find(sticker => sticker.location == 1) && (
                                            <img 
                                                src={`/${book?.active_stickers?.find(sticker => sticker?.location == 1)?.sticker_name}-i.png`}
                                                className={book?.active_stickers?.find(sticker => sticker?.location == 1)?.sticker_id == '6' ? 'sticker1z-abs' : 'sticker1-abs'}
                                            />
                                        )}
                                        {book?.active_stickers.find(sticker => sticker?.location == 2) && (
                                            <img 
                                                src={`/${book?.active_stickers?.find(sticker => sticker?.location == 2)?.sticker_name}-i.png`}
                                                className='sticker2-abs'
                                            />
                                        )}
                                        </>
                                    )}

                                    
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='library-book-info'>
                        <div className='library-book-title'>{book?.title ? book.title : (book?.volumeInfo?.title ? book.volumeInfo.title : (<div class="loader3" />))}</div>
                        <div className='library-book-author'>{(book?.author ? book.author : (book?.volumeInfo?.authors ? book.volumeInfo.authors[0] : (book?.volumeInfo ? 'No Author' : <div class='loader3_thin'/>)))}</div>
                        
                        {book?.title ? <div className='library-book-genre-tag' style={{color: currReadingColor, borderColor: currReadingColor, backgroundColor: lightenColor(currReadingColor, 0.28)}}>
                            <div className='library-book-genre-circle' style={{backgroundColor: currReadingColor}}/>
                            {book?.genre}
                        </div>
                        : !book?.volumeInfo && (<div class='loader3_thin' style={{marginTop: '0.2rem'}}/>)}

                        {book?.volumeInfo && (
                            <div className='n-add-to-library' onClick={() => addBook()}><div style={{marginRight: '0.4rem', display: 'flex'}}><Add /></div>Click to Add Book</div>
                        )}
                        

                    </div>

                </div>
  )
}

export default ShowcaseBook