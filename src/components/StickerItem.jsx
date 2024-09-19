import axios from 'axios';
import React, { useState, useEffect } from 'react'
import {ReactComponent as Star} from '../star-small.svg'

const StickerItem = ({sticker, hidden, username, isPreview, activeStickers, setReFetchStickers, volume_id}) => {

    const [isHovering, setIsHovering] = useState(false);
    const [date, setDate] = useState('none');

    const fetchDateAcquired = async() => {

        try {

            const res = await axios.get('http://localhost:4000/fetch-date-acquired', {
                params: {
                    username,
                    sticker_id: sticker.sticker_id
                }
            })

            setDate(res.data);

        } catch(e){
            console.error({error: e});
        }

    }

    const handleClick = async() => {

        try {

            if (isPreview){
                await axios.post('http://localhost:4000/set-active-sticker', {
                    username,
                    sticker,
                    volumeId: volume_id
                })

                setReFetchStickers(prev => !prev);
            }

        } catch(e) {
            if (e.response.status === 400){

            }
        }

        

    }

    useEffect(() => {
        if (username !== undefined && sticker.sticker_id !== undefined){
            fetchDateAcquired();
        }
    }, [username, sticker])

  return (
    <div className={!hidden && !isPreview ? 'sticker-item' : !isPreview ? 'sticker-item-hidden' : activeStickers.find(stickery => stickery.sticker_id === sticker.sticker_id) ? 'sticker-item-active' : activeStickers.find(stickery => stickery.location == sticker.location) ? 'sticker-item-hidden' : 'sticker-item'} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} onClick={() => handleClick()}>
        <img src={`/${sticker.sticker_name}.png`} style={{height: '2.6rem'}} className={hidden ? 'sticker-img-hidden' : 'sticker-img'}/>
        {isHovering && (activeStickers ? (!activeStickers.find(stickery => stickery.sticker_id === sticker.sticker_id) && !activeStickers.find(stickery => stickery.location == sticker.location)): true) && (
            <div className='sticker-item-info'>
                <div className='sticker-item-flex' style={{fontWeight: '500'}}>
                    <img src={`/${sticker?.sticker_name}.png`} style={{height: '1.2rem'}}/>
                    <div style={{marginLeft: '0.3rem', marginRight: '0.3rem'}}>{sticker?.sticker_display}</div>
                    &#183;
                    <div style={{marginLeft: '0.3rem'}}>{`${sticker?.sticker_set?.set} Collection (${sticker?.sticker_set.set_item_id + 1}/2)`}</div>
                </div>
                <div className='sticker-item-flex' style={{marginTop: '0.3rem', fontSize: '0.8125rem'}}>
                    <Star />
                    <div style={{marginLeft: '0.3rem'}}>{date !== 'none' ? `Acquired on ${date}` : 'Acquired on ???'}</div>
                </div>
            </div>
        )}
        {isHovering && (activeStickers ? (!activeStickers.find(stickery => stickery.sticker_id === sticker.sticker_id) && !activeStickers.find(stickery => stickery.location == sticker.location)): true) && (
            <div className='sii-triangle'/>
        )}
    </div>
  )
}

export default StickerItem