import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import RatingStatic from './RatingStatic'
import RatingFluid from './RatingFluid'
import {ReactComponent as ThreeDots} from '../threeDots.svg'
import {ReactComponent as DotsGrid} from '../dotsGrid.svg'
import {ReactComponent as Completed} from '../completed.svg'
import {ReactComponent as Reading} from '../reading.svg'
import {ReactComponent as Delete} from '../delete-option.svg'
import {ReactComponent as Gift} from '../gift-option.svg'
import {ReactComponent as Heart} from '../heart.svg'

const BookItem = ({book, index, volume_id, tab_name, username, setCustomizePopup, customizeRef, setActiveDropdown, activeDropdown, stickerChanged, remountComponent, setFavoriteChanged}) => {

  const [isMounted, setIsMounted] = useState(true);
  const [fluidRating, setFluidRating] = useState(false);
  const ratingEffectRan = useRef(false)
  const [moveActive, setMoveActive] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [activeStickers, setActiveStickers] = useState([null, null]);
  const [visualRating, setVisualRating] = useState(book.rating);


  const navigate = useNavigate('/');

  const handle_dropdown = () => {

    if (activeDropdown){
      document.getElementById("dropdown_" + index).classList.add("book_options_dropdown_unactive");
      document.getElementById("dropdown_" + index).classList.remove("book_options_dropdown_active");
      document.getElementById("book_options_" + index).classList.remove("book_options_open");
      document.getElementById("book_options_" + index).classList.add("book_options_closed");
      document.getElementById("container_" + index).classList.remove("z-index");
      setActiveDropdown(false);
    } else {
      document.getElementById("dropdown_" + index).classList.add("book_options_dropdown_active");
      document.getElementById("dropdown_" + index).classList.remove("book_options_dropdown_unactive");
      document.getElementById("book_options_" + index).classList.add("book_options_open");
      document.getElementById("book_options_" + index).classList.remove("book_options_closed");
      document.getElementById("container_" + index).classList.add("z-index");
      setActiveDropdown(true);
    }
    
  }

  const handle_unmount = async() => {
    try {

      await axios.post('http://localhost:4000/deleteBook', {
        volume_id,
        tab_name,
        username
      })

      remountComponent();
      setIsMounted(false);

    } catch (e) {
      console.error('Error deleting book:', e);
    }
  };


  function lightenColor(color, percent) {
    // Extract the RGB values
    const num = parseInt(color.slice(1), 16);
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

  const getGenreColor = async() => {

    try {

      const res = await axios.get('http://localhost:4000/getGenreColor', {
        params: {
          username: username,
          genre: book.genre,
        }
      })


      const lightColor = lightenColor(res.data.color, 0.28);
      document.getElementById("genre_tag_" + index).style.backgroundColor = lightColor;
      document.getElementById("genre_text_"+index).style.color = res.data.color;
      document.getElementById("genre_circle_"+index).style.backgroundColor = res.data.color;


    } catch(e) {
      console.error({error: e});
    }

  }

  const getRating = async() => {

    try {

      const res = await axios.get('http://localhost:4000/getRating', {
        params: {
          username,
          volume_id,
          tab_name
        }
      })

      setVisualRating(res.data);

    } catch(e){
      console.log({error: e});
    }

  }

  const getActiveStickers = async() => {

    const res = await axios.get('http://localhost:4000/get-active-stickers', {
      params: {
        username,
        volume_id,
        tab_name
      }
    })

    setActiveStickers(res.data);
    console.log(res.data);

  }

  const check_redirect = (id) => {

    if (id !== 'star' && id !== `book_options_${index}` && id !== 'dot' && id !== 'heart'){
      navigate(`/book-contents/${tab_name}/${volume_id}`);
    }

  }

  const fetchLibraryData = async() => {

    try {

      const res = await axios.get('http://localhost:4000/fetch-library-data', {
        params: {
          username,
          tab_name
        }
      })

      console.log(res.data);

    } catch(e){
      console.error({error: e});
    }

  }

  const fetchFavorites = async() => {

    try {

      const res = await axios.get('http://localhost:4000/fetch-favorites', {
        params: {
          username,
          volume_id,
          tab_name
        }
      })

      setHeartActive(res.data);

    } catch(e){
      console.error({error: e});
    }

  }

  useEffect(() => {
    getActiveStickers();
  }, [stickerChanged, book])

  useEffect(() => {
      getGenreColor();
      getRating();
      fetchFavorites();
      fetchLibraryData();
  }, [book])
  
  const [heartActive, setHeartActive] = useState(false);



  const setFavorite = async() => {

    try {
      
      await axios.post('http://localhost:4000/set-favorite', {
          username,
          volume_id,
          tab_name,
          favorite: !heartActive
      })

      fetchFavorites();
      setFavoriteChanged(prev => !prev);

    } catch(e) {
      console.error({error: e})
    }

  }

  return (
    <>

      {isMounted && (
        <div className='bookitem-other-cont'>

        <div className='bookitem-rel-cont'>
        <div id={"container_" + index} className="bookitem_container" style={{borderColor: activeStickers[2]}} onClick={(e) => check_redirect(e.target.id)}>

        

        <div className="book_cover">
          <img src={book.cover} draggable="false" />
          <div className='top-sticker-absolute'>
                {activeStickers[0] !== null ? (
                  <img src={`/${activeStickers[0].sticker_name}-i.png`} className='top-sticker-img'/>
                ) : <></>}
              </div>
              <div className='bottom-sticker-absolute'>
                {activeStickers[1] !== null ? (
                  <img src={`/${activeStickers[1].sticker_name}-i.png`} className='bottom-sticker-img'/>
                ) : <></>}
              </div>
        </div>
        
          <div className="book_contents" >

            <div className="book_title">
              {book.title}
            </div>
            <div className="book_author">
              {book.author}
            </div>
          <div className='book-stuff'>
            <div className="book_rating" onClick={() => setFluidRating(true)}>
              {!fluidRating && (
                <RatingStatic tabName={tab_name} volumeId={volume_id} rating={visualRating}/>
              )}
              {fluidRating && (() => {
                ratingEffectRan.current = false;
                return <RatingFluid tabName={tab_name} volumeId={volume_id} book_name={book.title} username={username} fluidRating={setFluidRating} setVisualRating={setVisualRating}/>;
              })()}
              
            </div>
            <div id={"genre_tag_" + index} className="genre_tag">
              <div id={"genre_circle_" + index} className="genre_circle"/>
              <div id={"genre_text_" + index} className="genre_text">
                  {book.genre}
              </div>
            </div>
            </div>


          </div>

          <div id={"book_options_" + index} className={"book_options"} onClick={() => handle_dropdown()}>

              <ThreeDots />
              
            <div id={"dropdown_" + index} className={"book_options_dropdown_unactive"}>
                <div id='dot' className="option_customize_book" onClick={() => {customizeRef.current = book; setCustomizePopup(true)}}>
                  <Gift />
                  <div id='dot' style={{marginLeft: '0.2rem'}}>Customize</div>
                </div>

                <div id='dot' className="option_delete_book" onClick={() => handle_unmount()}>
                    <Delete /> 
                    <div id='dot' style={{marginLeft: '0.2rem'}}>Delete Book</div>
                </div>
            </div>
          </div>

          <div className="book_page_count">

                <div className='page-count'>
                  {`${book.pages_read} / ${book.total_pages}`}
                  <div id='dot' className='book-page-count-abs' onClick={() => setFavorite()}>
                    {!heartActive ? (
                      <div id='dot' style={{marginBottom: '0.1rem'}}>
                        <Heart />
                      </div>
                    ): (
                      <div id='heart'/>
                    )}
                    
                  </div>
                </div>

          </div>
          <div className='bookitem-status-container' style={{borderColor: activeStickers[2]}}>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: book.pages_read / book.total_pages === 1 ? '0' : '0.2rem'}}>
              {book.pages_read / book.total_pages === 1 ? <Completed /> : <Reading />}
            </div>
          </div>
          
        </div>
          
        </div>

      </div>
      )}
    </>
  )
}

export default BookItem