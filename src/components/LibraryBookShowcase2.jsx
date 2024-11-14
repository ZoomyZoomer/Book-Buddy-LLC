import React from 'react'
import RatingStatic from './RatingStatic'

const LibraryBookShowcase2 = ({value, explore, stickers, book}) => {

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
    <div className='library-book-container'>

        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}>
                <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center'}}>
                    <div className='library-book-circle'>
                        <div style={{height: 'fit-content', width: 'fit-content', position: 'absolute', top: '4%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <div style={{position: 'relative'}}>
                                <img src={book?.cover ? book.cover : 'http://books.google.com/books/publisher/content?id=Z5nYDwAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&imgtk=AFLRE71w0_tgIHfDMwhEsvV-pEgZJhDOzyolKwNKjxdBne8QcH_cUZmfHby5Yem38_R8itwP5Oa0wKe2ygqV8APiUmP35Fpb568w3g-eGs5-5rc5zVgNLHRfTotPzpj7QrrfoYrtIp-9&source=gbs_api'} className='library-cover'/>
                                {!explore && (
                                    <>
                                        <img 
                                            src={`/dapper-bird-i.png`}
                                            className={'sticker0-abs'}
                                        />
                                        <img 
                                            src={`/holly-i.png`}
                                            className={'sticker1-abs'}
                                        />
                                    </>
                                )}
                                {explore && (
                                    <>
                                        {stickers.find(item => item.location === 0)?.sticker_name && (
                                            <img 
                                                src={`/${stickers.find(item => item.location === 0)?.sticker_name}-i.png`}
                                                className={stickers.find(item => item.location === 0)?.sticker_id === '7' ? 'sticker0z-abs' : stickers.find(item => item.location === 0)?.sticker_id === '8' ? 'sticker0y-abs' : 'sticker0-abs'}
                                            />
                                        )}

                                        {stickers.find(item => item.location === 1)?.sticker_name && (
                                            <img 
                                                src={`/${stickers.find(item => item.location === 1)?.sticker_name}-i.png`}
                                                className={stickers.find(item => item.location === 1)?.sticker_id === '4' || stickers.find(item => item.location === 1)?.sticker_id === '6' || stickers.find(item => item.location === 1)?.sticker_id === '9' ? 'sticker1y-abs' : 'sticker1-abs'}
                                            />
                                        )}

                                        {stickers.find(item => item.location === 2)?.sticker_name && (
                                            <img 
                                                src={`/${stickers.find(sticker => sticker.location === 2)?.sticker_name}-i.png`}
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
                    <div className='library-book-title'>{book?.title ? book.title : (<div class="loader3" />)}</div>
                    <div className='library-book-author'>{book?.author ? book.author : (<div class="loader3_thin" />)}</div>
                    {book?.title ? (
                        <div id='star' style={{marginTop: '0.625rem', width: 'fit-content'}}>{<RatingStatic rating={book?.rating}/>}</div>
                    ) : (<div class='loader3_med' style={{marginTop: '0.4rem'}}/>)}
                    

                    {book?.title ? (
                        <div className='library-book-genre-tag' style={{color: 'rgb(255, 169, 169)', borderColor: 'rgb(255, 169, 169)'}}>
                            <div className='library-book-genre-circle' style={{backgroundColor: 'rgb(255, 169, 169)'}}/>
                            {book?.genre}
                        </div>
                    ) : (<div class='loader3_thin' style={{marginTop: '0.2rem'}}/>)}
                    
                </div>


                    <div className='library-vert-bar-container'>
                        <div className='library-vert-bar'>
                            <div id={`fill${!explore ? 0 : 1}`} className='library-vert-bar-fill'/>
                        </div>
                    </div>
            

            </div>

            {value !== -9 && (
                <div id='star' className='library-page-abs' style={{marginRight: '0.6rem'}}>{value !== -1 ? value : 0}/{242} </div>
            )}

            {value === -9 && (
                <div id='star' className='library-page-abs' style={{marginRight: '0.8rem', marginBottom: '0.6rem'}}>Preview</div>
            )}

    </div>
  )
}

export default LibraryBookShowcase2