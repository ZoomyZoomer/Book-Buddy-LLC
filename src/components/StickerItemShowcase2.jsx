import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios';

const StickerItemShowcase2 = ({sticker, stickers, setStickers, volume_id, username}) => {

    const [isClicked, setIsClicked] = useState(false);

    const audioRefStickerPlace = useRef(null);

    const playAudioRefStickerPlace = () => {
        audioRefStickerPlace.current.volume = 0.2;
        audioRefStickerPlace.current.play();
    };

    const audioRefStickerRemove = useRef(null);

    const playAudioRefStickerRemove = () => {
        audioRefStickerRemove.current.volume = 0.2;
        audioRefStickerRemove.current.play();
    };

    useEffect(() => {
        if (stickers.find(stick => stick.sticker_id === sticker.sticker_id)){
            setIsClicked(true);
        }
    }, [stickers])

    const handleClick = async() => {

        if (!username) return;

        if (stickers.find(item => item.location === sticker.location) && !isClicked) return;

        await axios.post('/api/set-active-sticker', {
            username,
            volumeId: volume_id,
            sticker
        })
    
        if (!isClicked){

            setStickers(prev => [...prev, sticker]);
            playAudioRefStickerPlace();

        } else {

            setStickers(prevItems => prevItems.filter(item => !(item.sticker_id === sticker.sticker_id)));
            playAudioRefStickerRemove();

        }

        setIsClicked(prev => !prev);

    }

  return (
    <div className={isClicked ? 'landing-sticker-active' : stickers.find(item => item.location === sticker.location) ? 'landing-sticker-item-null' : 'landing-sticker-item'} onClick={() => handleClick()}>
        <audio ref={audioRefStickerPlace} src="/sticker-place.mp3" />
        <audio ref={audioRefStickerRemove} src="/sticker-remove.mp3" />
        {sticker ? <img src={`/${sticker?.sticker_name}.png`} style={{height: '2.4rem'}}/> : <div class="loader"></div>}
    </div>
  )
}

export default StickerItemShowcase2