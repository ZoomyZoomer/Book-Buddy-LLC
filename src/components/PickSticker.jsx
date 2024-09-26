import axios from 'axios';
import React, { useState, useEffect } from 'react'
import PickStickerItem from './PickStickerItem';

const PickSticker = ({setShowPickSticker, setDisplayReward, username, setShowItemPopup, value}) => {

    setDisplayReward(true);
    const [stickers, setStickers] = useState([]);
    const [stickerList, setStickerList] = useState([]);

    const fetchStickers = async() => {

        const res = await axios.get('/api/fetch-unowned-stickers', {
            params: {
                username
            }
        })

        setStickers(res.data);

    }

    const handleConfirm = async() => {

        await axios.post('/api/confirm-picked-stickers', {
            username,
            stickerList
        })

        setShowItemPopup(true);
        setShowPickSticker(false);

    }

    useEffect(() => {
        fetchStickers();
    }, [])

  return (

    <div className='pick-sticker-popup'>

        <div className='pick-more'>
            <div>{`Pick ${value - stickerList.length} more ${value - stickerList.length != 1 ? 'stickers' : 'sticker'}`}</div>
            <div className='pick-more-tiny'>To add to your collection</div>
        </div>

        <div className='pick-sticker-cont'>
            {stickers.map((sticker, index) => (
                <PickStickerItem sticker={sticker} value={value} setStickerList={setStickerList} stickerList={stickerList} index={index}/>
            ))}
        </div>

        <div className='pick-sticker-buttons'>
            <button style={{marginRight: '1rem'}} className='pick-sticker-cancel' onClick={() => {setDisplayReward(false); setShowPickSticker(false)}}>Cancel</button>
            <button style={{marginRight: '1rem', paddingLeft: '1rem', paddingRight: '1rem'}} className='market-purchase' onClick={() => handleConfirm()}>Confirm</button>
        </div>

    </div>
  )
}

export default PickSticker