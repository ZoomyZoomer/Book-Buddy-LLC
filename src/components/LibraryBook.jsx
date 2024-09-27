import React, { useState, useRef, useEffect } from 'react'
import RatingStatic from './RatingStatic'
import {ReactComponent as Check} from '../library-check.svg'
import {ReactComponent as PinEmpty} from '../library-pin-empty.svg'
import {ReactComponent as PinFull} from '../library-pin-filled.svg'
import {ReactComponent as Plus} from '../library-plus.svg'
import {ReactComponent as HeartEmpty} from '../library-heart-empty.svg'
import {ReactComponent as HeartFull} from '../library-heart-full.svg'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import RatingFluid from './RatingFluid'
import BookBuddyNavbar from './BookBuddyNavbar'

const LibraryBook = ({book, addingBook, username, setIsAddingBook, volumeId, setUpdatedRating, index, isPreview, reFetchStickers}) => {

    const [showCheck, setShowCheck] = useState(false);
    const [loadBook, setLoadBook] = useState(false);
    const [fluidRating, setFluidRating] = useState(false);
    const [isPinned, setIsPinned] = useState(book?.is_pinned ? book.is_pinned : false);
    const [isFavorite, setIsFavorite] = useState(book?.is_favorite ? book.is_favorite : false);
    const [isHolding, setIsHolding] = useState(false);
    const [mouseDownTime, setMouseDownTime] = useState(null);
    const [activeStickers, setActiveStickers] = useState([]);
    const [duration, setDuration] = useState(null);
    const timerRef = useRef(null);
    const navigate = useNavigate('/');

    const audioRefPin = useRef(null);

    const playAudioRefPin = () => {
        audioRefPin.current.volume = 0.15;
        audioRefPin.current.play();
    };

    const audioRefHeart = useRef(null);

    const playAudioRefHeart = () => {
        audioRefHeart.current.volume = 0.1;
        audioRefHeart.current.play();
    };

    const addBook = async() => {

        if (addingBook){

            setLoadBook(true);

            await axios.post('/api/addBook', {
                volumeId: volumeId,
                title: book?.title,
                author: book?.authors[0] ? book.authors[0] : 'No author',
                cover: book?.imageLinks?.thumbnail ? book.imageLinks.thumbnail : 'http://books.google.com/books/publisher/content?id=Z5nYDwAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&imgtk=AFLRE71w0_tgIHfDMwhEsvV-pEgZJhDOzyolKwNKjxdBne8QcH_cUZmfHby5Yem38_R8itwP5Oa0wKe2ygqV8APiUmP35Fpb568w3g-eGs5-5rc5zVgNLHRfTotPzpj7QrrfoYrtIp-9&source=gbs_api',
                genre: book?.categories ? book.categories : 'No Genre',
                pages: book?.pageCount,
                tabName: 'Favorites',
                username
            })


            setTimeout(() => {
                setLoadBook(false);
                playAudioRefHeart();
                setTimeout(() => {
                    setIsAddingBook(false);
                }, 200)
            }, 500)

        }

        if (!addingBook){

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
       

    }

    const callPin = async() => {

        if (addingBook || isPreview){
            return;
        }


        await axios.post('/api/pin-book', {
            username,
            volumeId
        })

        if (!isPinned){
            playAudioRefPin();
        }

        setIsPinned(prev => !prev);

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

    const [currReadingColor, setCurrReadingColor] = useState('#b1e4d4');

    const getGenreColor = async() => {

      const res = await axios.get('/api/getGenreColor', {
        params: {
          username: username,
          genre: book.genre
        }
      })

      setCurrReadingColor(res.data.color);

    }

    useEffect(() => {
        setIsFavorite(book?.is_favorite ? book.is_favorite : false);
        setIsPinned(book?.is_pinned ? book.is_pinned : false);
    }, [book])

    const fillBar = () => {
        
        document.getElementById(`fill${index}`).style.height = `${(book.pages_read / book.total_pages) * 100}%`;
        
    }

    useEffect(() => {
        if (!addingBook){
            fillBar();
            getGenreColor();
        }
    }, [book])

    const checkRedirect = (e) => {

        if (e.target.id !== 'star' && !isHolding){
            if (duration < 500){
                navigate(`/create-entry/${volumeId}`);
            }
            
        }

    }

    const handleMouseDown = (e) => {
        if (e.target.id != 'star' && !addingBook && !isPreview){
            setMouseDownTime(Date.now());
            setIsHolding(true);
            timerRef.current = setTimeout(() => {
                addBook();
                setIsHolding(false);
            }, 2000);
        }
      };
    
    const handleMouseUpOrLeave = () => {
        setIsHolding(false);
        const mouseUpTime = Date.now();
        setDuration(mouseUpTime - mouseDownTime);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
    };

    const fetchActiveStickers = async() => {

        try {

            const res = await axios.get('/api/fetchActiveStickers', {
                params: {
                    username,
                    volumeId
                }
            })

            setActiveStickers(res.data);

        } catch(e) {
            
        }

    }

    useEffect(() => {
        if (!addingBook){
            fetchActiveStickers();
        }
    }, [reFetchStickers])

  return (
    <div style={{marginTop: '1rem', border: addingBook ? '1px solid #d2d4d8' : (book.pages_read / book.total_pages) == 1 ? '1px solid #78C6A3' : '1px solid #d2d4d8'}} className={(isHolding) ? 'library-hold-container' : (!addingBook && (book.pages_read / book.total_pages == 1) ? 'library-book-completed' : 'library-book-container')} onClick={(e) => checkRedirect(e)} onMouseDown={(e) => handleMouseDown(e)} onMouseUp={handleMouseUpOrLeave} onMouseLeave={handleMouseUpOrLeave}>

        {isFavorite && !addingBook && (
            <img src='/heart-icon.png' className='heart-icon'/>
        )}

            <audio ref={audioRefHeart} src="/pop.mp3" />

        {!addingBook && isHolding && (
            <div className='favorite-progress'/>
        )}
        
        <div style={{zIndex: '4000'}}>

            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}>
                <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center'}}>
                    <div className='library-book-circle'>
                        <div style={{height: 'fit-content', width: 'fit-content', position: 'absolute', top: '4%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <div style={{position: 'relative'}}>
                                <img src={addingBook ? (book?.imageLinks?.thumbnail ? book.imageLinks.thumbnail : 'http://books.google.com/books/publisher/content?id=Z5nYDwAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&imgtk=AFLRE71w0_tgIHfDMwhEsvV-pEgZJhDOzyolKwNKjxdBne8QcH_cUZmfHby5Yem38_R8itwP5Oa0wKe2ygqV8APiUmP35Fpb568w3g-eGs5-5rc5zVgNLHRfTotPzpj7QrrfoYrtIp-9&source=gbs_api') : book?.cover} className='library-cover'/>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
        
        {!addingBook && (
            <>
                <div id='star' className='library-page-abs' style={{color: (book.pages_read / book.total_pages) < 1 ? '#5A5A5A' : '#06AB78'}}>{book.pages_read}/{book.total_pages} {isPinned ? <div id='star' className='library-pin' style={{display: 'flex', marginLeft: '0.3rem', marginBottom: '0.1rem'}} onClick={() => callPin()}><PinFull /></div> : <div id='star' className='library-pin' style={{display: 'flex', marginLeft: '0.3rem', marginBottom: '0.1rem'}} onClick={() => callPin()}><PinEmpty /></div>}</div>
                <audio ref={audioRefPin} src="/staple.mp3" />
            </>
        )}

        {addingBook && (
            <div className='library-page-abs'>{book.pageCount} pages</div>
        )}

    </div>
  )
}

export default LibraryBook