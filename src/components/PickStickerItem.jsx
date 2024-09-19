import React, { useState } from 'react'

const PickStickerItem = ({sticker, index, setStickerList, stickerList, value}) => {

    const [selected, setSelected] = useState(false);

    const setSticker = () => {

        if (!selected){
            if (stickerList.length < value){
                setSelected(true);
                setStickerList(prev => [...prev, {sticker: sticker, index: index}]);
            }
        } else {
            setSelected(false);
            let myInd = -1;
            stickerList.forEach((sticker, ind) => sticker.index == index ? myInd = ind: undefined);
            setStickerList(array => [...array.slice(0, myInd), ...array.slice(myInd + 1)]);
        }

    }

  return (
    <div className={selected ? 'achievement-item-container-select' : 'achievement-item-container'} style={{width: '2.9rem'}} onClick={() => setSticker()}>
        <img src={`/${sticker.sticker_name}.png`} style={{height: '2.4rem'}} className='ach-i-pop'/>
    </div>
  )
}

export default PickStickerItem