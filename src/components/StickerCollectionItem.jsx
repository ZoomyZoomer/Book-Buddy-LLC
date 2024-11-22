import React, { useState, useEffect } from 'react'
import {ReactComponent as Expand} from '../n-expand.svg'
import StickerItem from './StickerItem';

const StickerCollectionItem = ({index, unlockedStickers, username, activeDrop, setActiveDrop, swap, setSwap, lockedStickers}) => {

    const [isHovered, setIsHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [numLocked, setNumLocked] = useState(null);

    const stickerCollections = [
        {collection_name: 'The Underwater Collection', collection_stickers: ['4', '5'], collection_stickers_names: 'Crabby Carl and Fishy Fred', icon: 'n-life-saver'},
        {collection_name: 'The Cool Vibes Collection', collection_stickers: ['2', '3'], collection_stickers_names: 'Eagle Edward and Leafy Larry', icon: 'n-lettuce'},
        {collection_name: 'The Winter Time Collection', collection_stickers: ['0', '1'], collection_stickers_names: 'Holly Hank and Darwin the Dapper Bird', icon: 'n-mountains'},
        {collection_name: 'The Outer Space Collection', collection_stickers: ['6', '7'], collection_stickers_names: 'Planet Phil and Rocket Ricky', icon: 'n-planet'}
    ]

    const handleClick = () => {

        if (activeDrop && isExpanded){
            setIsExpanded(false);
            setActiveDrop(false);
        }

        if (activeDrop && !isExpanded){
            setSwap(prev => !prev);
            setTimeout(() => {setIsExpanded(true);}, 200);
        }

        if (!activeDrop){
            setActiveDrop(true);
            setIsExpanded(true);
        }

    }

    useEffect(() => {
        // Calculate the number of locked stickers that match
        const count = lockedStickers.filter(sticker =>
          stickerCollections[index].collection_stickers.includes(sticker.sticker_id)
        ).length;
    
        // Update state
        setNumLocked(count);
      }, [lockedStickers]);

    useEffect(() => {
        if (isExpanded){
            setIsExpanded(false);
        }
    }, [swap])

    useEffect(() => {
        if (numLocked !== null) {
          const progressBar = document.getElementById(`collection-bar-${index}`);
          if (progressBar) {
            const totalStickers = stickerCollections[index].collection_stickers.length;
            const percentage = ((totalStickers - numLocked) / totalStickers) * 100;
            progressBar.style.width = `${percentage}%`;
          }
        }
      }, [numLocked, index, stickerCollections]);


  return (
    <div style={{position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: 'fit-content', height: 'fit-content', marginTop: '0.625rem'}}>
        <div className={(!isHovered || isExpanded) ? 'n-collection-container' : 'n-collection-container-fade'} style={{zIndex: '999'}}onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={() => handleClick()}>
            <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '100%'}}>
                <img src={`/${stickerCollections[index].icon}.png`} style={{height: '3.6rem'}}/>
                <div className='n-collection-info'>
                    <div>{stickerCollections[index].collection_name}</div>
                    <div className='n-ci-0'>Collection Includes: {stickerCollections[index].collection_stickers_names}</div>
                </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', marginTop: '0.8125rem'}}>
                <div className='n-collection-bar'>
                    <div id={`collection-bar-${index}`} className='n-collection-bar-fill'/>
                </div>
                <div style={{fontSize: '0.7rem', marginLeft: '0.4rem'}}>{stickerCollections[index].collection_stickers.length - numLocked}/{stickerCollections[index].collection_stickers.length} owned</div>
            </div>

            {isExpanded && (
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>

                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '1rem'}}>

                        <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '30%'}}>
                            <div style={{height: '1px', width: '3rem', backgroundColor: '#D9D9D9'}}/>
                            <div style={{height: '6px', width: '6px', borderRadius: '100%', backgroundColor: '#D9D9D9', marginLeft: '0.2rem'}}/>
                        </div>
                        <div style={{fontSize: '0.8125rem', color: '#D9D9D9', width: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Collection Details</div>
                        <div style={{display: 'flex', justifyContent: 'right', alignItems: 'center', width: '30%'}}>
                        <div style={{height: '6px', width: '6px', borderRadius: '100%', backgroundColor: '#D9D9D9', marginRight: '0.2rem'}}/>
                            <div style={{height: '1px', width: '3rem', backgroundColor: '#D9D9D9'}}/>
                        </div>

                    </div>

                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '1rem'}}>
                        {unlockedStickers.map((sticker) => stickerCollections[index].collection_stickers.includes(sticker.sticker_id) && (
                            <div style={{marginRight: '0.625rem'}}>
                                <StickerItem sticker={sticker} hidden={false} username={username} isPreview={false}/>
                            </div>
                        ))}
                        {lockedStickers.map((sticker) => stickerCollections[index].collection_stickers.includes(sticker.sticker_id) && (
                            <div style={{marginRight: '0.625rem'}}>
                                <StickerItem sticker={sticker} hidden={true} username={username} isPreview={false}/>
                            </div>
                        ))}
                        
                    </div>

                </div>
            )}

        </div>
        {isHovered && !isExpanded && (<div className='n-expand-icon'>Expand <div style={{display: 'flex', marginLeft: '0.4rem'}}><Expand /></div></div>)}
    </div>
  )

}

export default StickerCollectionItem