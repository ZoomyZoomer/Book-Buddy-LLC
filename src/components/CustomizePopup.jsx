import React from 'react'
import RatingStatic from './RatingStatic'
import {ReactComponent as Info} from '../info.svg'
import {ReactComponent as ThreeDots} from '../threeDots.svg'
import {ReactComponent as Close} from '../close_icon.svg'
import { useRef, useEffect, useState } from 'react'
import '../customizestyles.css'
import axios from 'axios'
import CustomizeSticker from './CustomizeSticker'

const CustomizePopup = ({customizeRef, tab_name, username, setCustomizePopup, setStickerChanged}) => {

  const [stickers, setStickers] = useState([]);
  const [topSticker, setTopSticker] = useState(undefined);
  const [bottomSticker, setBottomSticker] = useState(undefined);
  const [backgroundColor, setBackgroundColor] = useState({border_color: '#DFE1E5', background_color: 'white'});

  const [activeTop, setActiveTop] = useState(null);
  const [activeBottom, setActiveBottom] = useState(null);
  const [activeBorder, setActiveBorder] = useState(null);

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
          genre: customizeRef.genre,
        }
      })


      const lightColor = lightenColor(res.data.color, 0.28);
      document.getElementById("genre_tag_temp").style.backgroundColor = lightColor;
      document.getElementById("genre_text_temp").style.color = res.data.color;
      document.getElementById("genre_circle_temp").style.backgroundColor = res.data.color;


    } catch(e) {
      console.error({error: e});
    }

  }

  const fetchStickers = async() => {

    const res = await axios.get('http://localhost:4000/get-stickers', {
      params: {
        username
      }
    })

    setStickers(res.data);

  }

  const getActiveStickers = async() => {

    const res = await axios.get('http://localhost:4000/get-active-stickers', {
      params: {
        username,
        tab_name,
        volume_id: customizeRef.volume_id
      }
    })

  setActiveTop(res.data[0]);
  setTopSticker(res.data[0]);
  console.log(res.data[0]);
  setActiveBottom(res.data[1]);
  setBottomSticker(res.data[1]);
  setActiveBorder(res.data[2]);
  setBackgroundColor(res.data[2]);
  console.log(res.data[2]);


    

  }

  const checkRef = useRef(false);

  useEffect(() => {
    if (!checkRef.current){
      checkRef.current = true;
      getGenreColor();
      fetchStickers();
      getActiveStickers();
    }
  })

  useEffect(() => {
    setBackgroundColor({border_color: '#DFE1E5', background_color: 'white'});
  }, [topSticker, bottomSticker])

  const sendStickers = async() => {

    await axios.post('http://localhost:4000/send-stickers', {
      username,
      tab_name,
      volume_id: customizeRef.volume_id,
      top_sticker: activeTop,
      bottom_sticker: activeBottom,
      border: activeTop?.sticker_set?.set === activeBottom?.sticker_set?.set && activeTop?.sticker_set?.set !== undefined ? activeBorder : '#DFE1E5'
    })

    setCustomizePopup(false);
    setStickerChanged(prev => !prev);

  }

  console.log(backgroundColor);

  return (
    
    <div className='customize-popup'>

      <div className='customize-container'>

      <div className='customize-close' onClick={() => setCustomizePopup(false)}><Close /></div>

        <div className='customize-header'>
          <div>Book Customization</div>
          <div className='ch-0'>Add stickers to you books!</div>
        </div>

      <div className='customize-flex'>

        <div className='customize-grid'>
          <div className='bookitem_container_preview' style={{borderColor: activeTop?.sticker_set?.set === activeBottom?.sticker_set?.set && activeTop?.sticker_set?.set !== undefined ? activeBorder : '#DFE1E5'}}>
            <div className="book_cover">
              <img src={customizeRef.cover} draggable="false" />
              <div className='top-sticker-absolute'>
                {activeTop !== undefined  && activeTop !== null? (
                  <img src={`/${activeTop?.sticker_name}-i.png`} className='top-sticker-img'/>
                ) : <></>}
              </div>
              <div className='bottom-sticker-absolute'>
                {activeBottom !== undefined & activeBottom !== null ? (
                  <img src={`/${activeBottom?.sticker_name}-i.png`} className='bottom-sticker-img'/>
                ) : <></>}
              </div>
            </div>
            <div className="book_contents" >

              <div className="book_title">
                {customizeRef.title}
              </div>
              <div className="book_author">
                {customizeRef.author}
              </div>
            <div className='book-stuff'>
              <div className="book_rating">
                  <RatingStatic tabName={tab_name} volumeId={customizeRef.volume_id} rating={customizeRef.rating}/>
              </div>
              <div id='genre_tag_temp' className="genre_tag">
                <div id='genre_circle_temp' className="genre_circle"/>
                <div id='genre_text_temp' className="genre_text">
                    {customizeRef.genre}
                </div>
              </div>
              </div>

            </div>

            <div className={"book_options"}>

                <ThreeDots />
                
            </div>

            <div className="book_page_count">
              <div className='page-count'>{`Preview`}</div>
            </div>
          </div>
          <div className='cg-0'>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '0.3rem'}}><Info /></div>
            Apply stickers from the same set for a unique border color
          </div>
        </div>

        <div className='customize-choose-container'>

          <CustomizeSticker stickers={stickers[0]} direction={'Top'} setSticker={setTopSticker} setBackgroundColor={setBackgroundColor} activeSticker={activeTop} setActiveSticker={setActiveTop}/>

          <CustomizeSticker stickers={stickers[1]} direction={'Bottom'} setSticker={setBottomSticker} setBackgroundColor={setBackgroundColor} activeSticker={activeBottom} setActiveSticker={setActiveBottom}/>
          
          <CustomizeSticker stickers={stickers[0]} direction={'Border'} setSticker={setBackgroundColor} topSticker={activeTop} bottomSticker={activeBottom} activeSticker={activeBorder} setActiveSticker={setActiveBorder}/>

          <div className='ccc-buttons'>
            <button className='ccc-clear' onClick={() => {setActiveTop(null); setTopSticker(undefined); setActiveBottom(null); setBottomSticker(undefined); setActiveBorder(undefined)}}>Clear</button>
            <button className='ccc-save' onClick={() => sendStickers()}>Save</button>
          </div>

        </div>

      </div>

      

      </div>
    </div>
  )
}

export default CustomizePopup