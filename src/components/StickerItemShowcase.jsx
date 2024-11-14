import React, { useState } from 'react'

const StickerItemShowcase = ({sticker, stickers, setStickers}) => {

    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {

        if (stickers.find(item => item.location === sticker.location) && !isClicked) return;
    
        if (!isClicked){

            setStickers(prev => [...prev, sticker]);

        } else {

            setStickers(prevItems => prevItems.filter(item => !(item.sticker_id === sticker.sticker_id)));

        }

        setIsClicked(prev => !prev);

    }

  return (
    <div className={isClicked ? 'landing-sticker-active' : stickers.find(item => item.location === sticker.location) ? 'landing-sticker-item-null' : 'landing-sticker-item'} onClick={() => handleClick()}>
        <img src={`/${sticker?.sticker_name}.png`} style={{height: '2.4rem'}}/>
    </div>
  )
}

export default StickerItemShowcase