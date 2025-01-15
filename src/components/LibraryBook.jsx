import React, { useState, useRef, useEffect } from 'react'
import RatingStatic from './RatingStatic'
import {ReactComponent as Check} from '../library-check.svg'
import {ReactComponent as PinEmpty} from '../library-pin-empty.svg'
import {ReactComponent as PinFull} from '../library-pin-filled.svg'
import {ReactComponent as Plus} from '../library-plus.svg'
import {ReactComponent as HeartEmpty} from '../library-heart-empty.svg'
import {ReactComponent as HeartFull} from '../library-heart-full.svg'
import {ReactComponent as Add} from '../n-add-circle.svg'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import RatingFluid from './RatingFluid'
import BookBuddyNavbar from './BookBuddyNavbar'

const LibraryBook = ({book, setSearchEntered, setIsDeleting, setBookDeleted, isDeleting, activeStickers, setText, setNoBooksFound, addingBook, username, setIsAddingBook, setAddingCollection, volumeId, index, isPreview, reFetchStickers}) => {

    const [showCheck, setShowCheck] = useState(false);
    const [loadBook, setLoadBook] = useState(false);
    const [rating, setRating] = useState(0);
    const [fluidRating, setFluidRating] = useState(false);
    const [isPinned, setIsPinned] = useState(book?.is_pinned ? book.is_pinned : false);
    const [isFavorite, setIsFavorite] = useState(book?.is_favorite ? book.is_favorite : false);
    const [isHolding, setIsHolding] = useState(false);
    const [duration, setDuration] = useState(null);
    const [isHovering, setIsHovering] = useState(false);
    const navigate = useNavigate('/');
    const [timer, setTimer] = useState(null);
    const [held, setHeld] = useState(false);

    const audioRefPin = useRef(null);

    const playAudioRefPin = () => {
        audioRefPin.current.volume = 0.15;
        audioRefPin.current.play();
    };

    useEffect(() => {
        setRating(book?.rating);
    }, [book])

    const audioRefHeart = useRef(null);

    const playAudioRefHeart = () => {
        audioRefHeart.current.volume = 0.1;
        audioRefHeart.current.play();
    };

    const addBook = async() => {

            setLoadBook(true);
            setSearchEntered(false);
            
            try {

                await axios.post('/api/addBook', {
                    volumeId: book?.id,
                    title: book?.volumeInfo?.title,
                    author: book?.volumeInfo?.authors[0] ? book.volumeInfo.authors[0] : 'No author',
                    cover: book?.volumeInfo?.imageLinks?.thumbnail ? book.volumeInfo.imageLinks.thumbnail : 'http://books.google.com/books/publisher/content?id=Z5nYDwAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&imgtk=AFLRE71w0_tgIHfDMwhEsvV-pEgZJhDOzyolKwNKjxdBne8QcH_cUZmfHby5Yem38_R8itwP5Oa0wKe2ygqV8APiUmP35Fpb568w3g-eGs5-5rc5zVgNLHRfTotPzpj7QrrfoYrtIp-9&source=gbs_api',
                    genre: book?.volumeInfo?.categories ? book.volumeInfo.categories : 'No Genre',
                    pages: book?.volumeInfo?.pageCount,
                    tabName: 'Favorites',
                    username
                })

                setTimeout(() => {
                    setTimeout(() => {
                        setText('');
                        setAddingCollection([null, null, null, null]);
                        setIsAddingBook(false);
                    }, 200)
                }, 500)

            } catch(e) {

            }


        

        
       

    }

    const callPin = async() => {

        if (addingBook || isPreview){
            return;
        }


  

            setLoadBook(true);

            await axios.post('/api/set-favorite', {
                username,
                volume_id: volumeId,
                tab_name: 'Favorites'
            })


                setLoadBook(false);
                if (!isFavorite){
                    playAudioRefHeart();
                }
                
                setIsFavorite(prev => !prev);


    }

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

    const [currReadingColor, setCurrReadingColor] = useState('#FFA9A9');

    useEffect(() => {
        setIsFavorite(book?.is_favorite ? book.is_favorite : false);
        setIsPinned(book?.is_pinned ? book.is_pinned : false);
    }, [book])

    const fillBar = () => {
        
        if (!book){
            document.getElementById(`fill${index}`).style.height = '0%';
        } else {
            document.getElementById(`fill${index}`).style.height = `${(book?.pages_read / book?.total_pages) * 100}%`;
        }

        
    }

    useEffect(() => {
        if (!addingBook){
            fillBar();
        }
    }, [book])

    const checkRedirect = (e) => {

        if (addingBook){
            addBook();
            return;
        }

        if (isPreview){
            return;
        }

        if (isDeleting){
            return;
        }

        if (e.target.id !== 'star' && !isHolding && !book?.volumeInfo){
            if (duration < 500){
                navigate(`/create-entry/${volumeId}`);
            }
            
        }

    }


    const deleteBook = async() => {

        try {

            await axios.post('/api/deleteBook', {
                volume_id: volumeId,
                tab_name: 'Favorites',
                username
            })

            setBookDeleted(prev => !prev);
            setIsDeleting(false);

        } catch(e){

        }

    }

    const handleMouseDown = () => {
        setHeld(true);
        const holdTime = setTimeout(() => {
          deleteBook();
        }, 3000); // 3000 milliseconds = 3 seconds
        setTimer(holdTime);
      };
    
      const handleMouseUp = () => {
        clearTimeout(timer); // Clear timeout if the mouse is released early
        setHeld(false); // Reset the state if needed
      };

  return (

    <div style={{position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center'}} onMouseDown={handleMouseDown} onMouseLeave={handleMouseUp} onMouseUp={handleMouseUp}>


        <div className={!isDeleting ? 'library-book-container' : (held ? 'library-book-container-held' : 'library-book-container-delete')} onClick={(e) => checkRedirect(e)}>

                <audio ref={audioRefHeart} src="/pop.mp3" />

            {isDeleting && held && <div className='n-library-book-fill'/>}

                

            {!addingBook && isHolding && (
                <div className='favorite-progress'/>
            )}
            
            <div style={{zIndex: '4000'}}>

                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}>
                    <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center'}}>
                        <div className={addingBook ? 'library-book-circle-gray' : 'library-book-circle'}>
                            <div style={{height: 'fit-content', width: 'fit-content', position: 'absolute', top: '4%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <div style={{position: 'relative'}}>
                                    <img src={book?.volumeInfo?.imageLinks?.thumbnail ? book.volumeInfo.imageLinks.thumbnail : (book?.cover ? book.cover : 'http://books.google.com/books/publisher/content?id=Z5nYDwAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&imgtk=AFLRE71w0_tgIHfDMwhEsvV-pEgZJhDOzyolKwNKjxdBne8QcH_cUZmfHby5Yem38_R8itwP5Oa0wKe2ygqV8APiUmP35Fpb568w3g-eGs5-5rc5zVgNLHRfTotPzpj7QrrfoYrtIp-9&source=gbs_api')} className='library-cover'/>
                                    {activeStickers?.length > 0 && activeStickers?.find(sticker => sticker?.location == 0) && (
                                        <img 
                                            src={`/${activeStickers?.find(sticker => sticker?.location == 0)?.sticker_name}-i.png`}
                                            className={activeStickers?.find(sticker => sticker?.location == 0)?.sticker_id == ('7') ? 'sticker0z-abs' : 'sticker0-abs'}
                                        />
                                    )}
                                    {activeStickers?.length > 0 && activeStickers.find(sticker => sticker.location == 1) && (
                                        <img 
                                            src={`/${activeStickers?.find(sticker => sticker?.location == 1)?.sticker_name}-i.png`}
                                            className={activeStickers?.find(sticker => sticker?.location == 1)?.sticker_id == '6' ? 'sticker1z-abs' : 'sticker1-abs'}
                                        />
                                    )}
                                    {activeStickers?.length > 0 && activeStickers.find(sticker => sticker?.location == 2) && (
                                        <img 
                                            src={`/${activeStickers?.find(sticker => sticker?.location == 2)?.sticker_name}-i.png`}
                                            className='sticker2-abs'
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='library-book-info'>
                        <div className='library-book-title'>{book?.title ? book.title : (book?.volumeInfo?.title ? book.volumeInfo.title : (<div class="loader3" />))}</div>
                        <div className='library-book-author'>{(book?.author ? book.author : (book?.volumeInfo?.authors ? book.volumeInfo.authors[0] : (book?.volumeInfo ? 'No Author' : <div class='loader3_thin'/>)))}</div>

                        {book?.title ? <div id='star' onMouseEnter={() => setFluidRating(true)} onMouseLeave={() => setFluidRating(false)} style={{marginTop: '0.625rem', width: 'fit-content'}} onClick={() => setFluidRating(prev => !prev)}>{((!fluidRating || isDeleting)) ? <RatingStatic rating={rating}/> : (!addingBook && !isDeleting && <RatingFluid tabName={'Favorites'} volumeId={book?.volume_id} username={username} setRating={setRating}/>)}</div>
                        : !book?.volumeInfo && (<div class='loader3_med' style={{marginTop: '0.4rem'}}/>)}

                        
                        {book?.title ? <div className='library-book-genre-tag' style={{color: currReadingColor, borderColor: currReadingColor, backgroundColor: lightenColor(currReadingColor, 0.28)}}>
                            <div className='library-book-genre-circle' style={{backgroundColor: currReadingColor}}/>
                            {addingBook ? (book?.categories ? book.categories : 'No genre') : book?.genre}
                        </div>
                        : !book?.volumeInfo && (<div class='loader3_thin' style={{marginTop: '0.2rem'}}/>)}

                        {book?.volumeInfo && (
                            <div className='n-add-to-library' onClick={() => addBook()}><div style={{marginRight: '0.4rem', display: 'flex'}}><Add /></div>Click to Add Book</div>
                        )}
                        

                    </div>

                    {(
                        <div className='library-vert-bar-container'>
                            <div className='library-vert-bar'>
                                <div id={`fill${index}`} className='library-vert-bar-fill'/>
                            </div>
                        </div>
                    )}

                </div>

            </div>
            
            {!addingBook && book?.title && (
                <>
                    <div id='star' className='library-page-abs' style={{color: (book?.pages_read / book?.total_pages) < 1 ? '#5A5A5A' : '#06AB78'}}>{book?.pages_read}/{book?.total_pages} </div>
                </>
            )}

            {!addingBook && !book?.title && !book?.volumeInfo && !isPreview && (
                <div id='star' className='library-page-abs' style={{marginBottom: '0.4rem', marginRight: '1rem'}}>
                    ?? / ???
                </div>
            )}

            {book?.volumeInfo && !isPreview &&(
                <div id='star' className='library-page-abs'>
                    {book?.volumeInfo.pageCount} pages
                </div>
            )}

        </div>
    </div>
  )
}

export default LibraryBook