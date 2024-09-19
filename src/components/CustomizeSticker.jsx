import React from 'react'
import {ReactComponent as Triangle} from '../triangle-down.svg'
import { useState } from 'react';

const CustomizeSticker = ({stickers, direction, setSticker, topSticker, bottomSticker, activeSticker, setActiveSticker}) => {

    const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className='customize-top' onClick={() => setShowDropdown(prev => !prev)} style={{zIndex: direction === 'Top' ? '5' : direction === 'Bottom' ? '4' : '3', marginTop: direction === 'Top' ? '0' : '1rem'}}>

        <div className='ccc-0'>{direction} {direction !== 'Border' ? 'Cover' : ' Color'}</div>

        <div className='ccc-input'>

            <div className='ccc-input-container'>
                {activeSticker?.sticker_name !== undefined ? (
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <img src={`/${activeSticker?.sticker_name}.png`} style={{height: '1.1rem', width: '1.1rem', marginRight: '0.3rem'}}/>
                        <div>{`${activeSticker?.sticker_display} - `}&nbsp;</div>
                        <div style={{color: activeSticker?.sticker_set?.border_color}}>{`${activeSticker?.sticker_set?.set} set`}</div>
                    </div>
                ): direction === 'Border' && (activeSticker !== undefined) && (activeSticker !== null) && topSticker?.sticker_set?.set === bottomSticker?.sticker_set?.set ? (
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <div style={{color: topSticker?.sticker_set?.border_color}}>{topSticker?.sticker_set?.unique_color_name !== undefined && activeSticker !== undefined && activeSticker !== null ? topSticker?.sticker_set?.unique_color_name : 'None'}</div>
                    </div>
                ): 
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <div>None</div>
                    </div>
                }
                
            </div>
              
        {showDropdown && (
            <div className='ccc-input-dropdown'>
                
                {direction !== 'Border' ? stickers.map((sticker, index) => (
                    <div className='ccc-input-container2' onClick={() => setActiveSticker(sticker)}>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.8rem'}}>
                            <img src={`/${sticker?.sticker_name}.png`} style={{height: '1.1rem', width: '1.1rem', marginRight: '0.3rem'}}/>
                            <div>{`${sticker?.sticker_display} - `}&nbsp;</div>
                            <div style={{color: sticker?.sticker_set?.border_color}}>{`${sticker?.sticker_set?.set} set`}</div>
                        </div>
                    </div>
                )): topSticker?.sticker_set?.set === bottomSticker?.sticker_set?.set && topSticker?.sticker_set.set !== undefined ? (
                    <div className='ccc-input-container2' onClick={() => setActiveSticker(topSticker?.sticker_set?.border_color)}>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.8rem'}}>
                            <div style={{color: topSticker?.sticker_set?.border_color}}>{`${topSticker?.sticker_set?.unique_color_name}`}</div>
                        </div>
                    </div>
                ): <></>
                }
                    <div className='ccc-input-container2' onClick={() => setActiveSticker(undefined)}>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.8rem'}}>
                            <div>None</div>
                        </div>
                    </div>
                

            </div>
        )}
              
        </div>
    </div>
  )
}

export default CustomizeSticker