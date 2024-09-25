import axios from 'axios';
import React, { useState, useRef } from 'react'
import {ReactComponent as Star} from '../starFull.svg'
import confetti from 'canvas-confetti';

const ItemRewardPopupWarehouse = ({setShowItemPopup, username, item, setReFetch, setDisplayReward, value, eatItem}) => {

  const [isUnwrapping, setIsUnwrapping] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [showCurrency, setShowCurrency] = useState(false);
  const [showExp, setShowExp] = useState(false);
  const [showItem, setShowItem] = useState(false);
  const [loot, setLoot] = useState([]);
  const [remaining, setRemaining] = useState(0);
  const [delay, setDelay] = useState(false);
  const [showOverview, setShowOverview] = useState(false);

  // For overview opacity appearance
  const [overview0, setOverview0] = useState(false);
  const [overview1, setOverview1] = useState(false);
  const [overview2, setOverview2] = useState(false);
  const [overview3, setOverview3] = useState(false);
  const [overview4, setOverview4] = useState(false);

  const [showSticker0, setShowSticker0] = useState(false);
  const [showSticker1, setShowSticker1] = useState(false);
  const [showSticker2, setShowSticker2] = useState(false);
  const [showSticker3, setShowSticker3] = useState(false);
  const [showSticker4, setShowSticker4] = useState(false);

  const audioRefCoins = useRef(null);

  const playAudioRefCoins = () => {
    audioRefCoins.current.volume = 0.1;
    audioRefCoins.current.play();
  };

  setDisplayReward(true);

  const triggerConfetti = () => {
    // Top-left corner
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0, y: 0 }
    });

    // Top-right corner
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 1, y: 0 }
    });

    // Bottom-left corner
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0, y: 1 }
    });

    // Bottom-right corner
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 1, y: 1 }
    });

    // Center
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

  };

  const handleUnwrap = async() => {

    setIsUnwrapping(true);

    const popup = document.getElementsByClassName('item-reward-popup')[0];
    popup.style.width = '100%';

    const elem = document.getElementsByClassName('item-reward-icon')[0];

    elem?.classList?.add('item-reward-icon-unwrap');
    elem?.classList?.remove('item-reward-icon');

    try {

      if (item != 14 && item != 15){

        let res = await axios.get('http://localhost:4000/fetch-tier-items', {
          params: {
            username,
            itemNum: item,
            eatItem: eatItem ? 0 : 1
          }
        });

        setLoot(res.data);
        setRemaining(res.data.length - 1);

        setTimeout(() => {
          setShowIcon(false);
          setShowCurrency(true);
          playAudioRefCoins();
        }, 290)


      } else {

        let res = await axios.get('http://localhost:4000/fetch-sticker-purchase', {
          params: {
            username,
            random: item == 14 ? 1 : 0,
            value
          }
        })

        setLoot(res.data);
        setRemaining(res.data.length - 1);

        setTimeout(() => {
          setShowIcon(false);
          setShowSticker0(true);
          playAudioRefCoins();
        }, 290)

        setReFetch(prev => !prev);

        setTimeout(() => {
          triggerConfetti();
        })

      }

    } catch(e) {

    }

    document.getElementsByClassName('item-reward-popup')[0].style.cursor = 'pointer';


  }


  const nextReward = () => {

    try {

    if (item !== 14 && item !== 15){

      setTimeout(() => {

      const elem = document?.getElementsByClassName('item-reward-icon-no-anim')[0];

      if (!showExp && !showItem && !showOverview){
        elem?.classList?.remove('item-reward-icon-no-anim');
        elem?.classList?.add('item-reward-icon-unwrap');
      }
        if (showCurrency){
          setTimeout(() => {
            setShowCurrency(false);
            setRemaining(prev => prev - 1);
            setShowExp(true);
            playAudioRefCoins();
          }, 290)
        } else if (showExp){
          setTimeout(() => {
            setShowExp(false);
            playAudioRefCoins();
            setRemaining(prev => prev - 1);
            setShowItem(true);
            triggerConfetti();
            setTimeout(() => {
              setDelay(true);
              setTimeout(() => {
                const temp = document.getElementsByClassName('item-reward-icon-no-anim')[0];
                temp?.classList?.remove('item-reward-icon-no-anim');
                temp?.classList?.add('item-reward-icon-showcase');

                  setTimeout(() => {
                    confetti({
                      particleCount: 100,
                      spread: 70,
                      origin: { x: 0, y: 0.5 }
                    });
                    setTimeout(() => {
                      confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { x: 1, y: 0.5 }
                      });
                    }, 3000)
                  }, 3000)
                
              }, 1000)
            }, 1000)
          }, 290)
        } else if (showItem){

          setShowItem(false);
          setShowOverview(true);

          setTimeout(() => {
            setOverview0(true);
            setTimeout(() => {
              setOverview1(true);
              setTimeout(() => {
                setOverview2(true);
              }, 300)
            }, 300)
          }, 300)

        } else if (showOverview){
          document?.getElementsByClassName('item-reward-popup')[0]?.classList?.add('close-popup');
          setReFetch(prev => !prev);
          setTimeout(() => {
            setDisplayReward(false);
            setShowItemPopup(false);
          }, 280)
        }

      }, 100) 

    } else {

      if (showSticker0){
        setTimeout(() => {
          setShowSticker0(false);
          playAudioRefCoins();
          setRemaining(prev => prev - 1);
          if (loot.length > 1){
            setShowSticker1(true);
          } else {
            setShowOverview(true);
            setTimeout(() => {
              setOverview0(true);
            }, 300)
          }
        }, 290)
      }
      if (showSticker1){
        setShowSticker1(false);
        playAudioRefCoins();
        setRemaining(prev => prev - 1);
        if (loot.length > 2){
          setShowSticker2(true);
        } else {
          setShowOverview(true);
          setTimeout(() => {
            setOverview0(true);
            setTimeout(() => {
              setOverview1(true);
            }, 300)
          }, 300)
        }
      }
      if (showSticker2){
        setShowSticker2(false);
        playAudioRefCoins();
        setRemaining(prev => prev - 1);
        if (loot.length > 3){
          setShowSticker3(true);
        } else {
          setShowOverview(true);
          setTimeout(() => {
            setOverview0(true);
            setTimeout(() => {
              setOverview1(true);
              setTimeout(() => {
                setOverview2(true);
              }, 300)
            }, 300)
          }, 300)
        }
      }
      if (showSticker3){
        setShowSticker3(false);
        playAudioRefCoins();
        setRemaining(prev => prev - 1);
        if (loot.length > 4){
          setShowSticker4(true);
        } else {
          setShowOverview(true);
          setTimeout(() => {
            setOverview0(true);
            setTimeout(() => {
              setOverview1(true);
              setTimeout(() => {
                setOverview2(true);
                setTimeout(() => {
                  setOverview3(true);
                }, 300)
              }, 300)
            }, 300)
          }, 300)
        }
      }
      if (showSticker4){
        setShowSticker4(false);
        setRemaining(prev => prev - 1);
          setShowOverview(true);
          setTimeout(() => {
            setOverview0(true);
            setTimeout(() => {
              setOverview1(true);
              setTimeout(() => {
                setOverview2(true);
                setTimeout(() => {
                  setOverview3(true);
                  setTimeout(() => {
                    setOverview4(true);
                  }, 300)
                }, 300)
              }, 300)
            }, 300)
          }, 300)
      }
      if (showOverview){
        document?.getElementsByClassName('item-reward-popup')[0]?.classList?.add('close-popup');
          setReFetch(prev => !prev);
          setTimeout(() => {
            setShowItemPopup(false);
            setDisplayReward(false);
          }, 280)
      }

    }
    } catch(e) {

    }

  }

  return (

      <div className='item-reward-popup' onClick={() => nextReward()}>

        <audio ref={audioRefCoins} src="/coins-sound.ogg" />
   

        <div className='item-reward-container'>
          {!isUnwrapping && (<div className='ir-1'>{item == 9 ? 'Package' : item == 8 ? 'Neatly Wrapped Present' : item == 7 ? 'Tiny Envelope' : item == 14 ? 'Sticker Basket I' : 'Sticker Basket II'}</div>)}

          {showCurrency && (<div className='ir-title'>Currency</div>)}
          {showExp && (<div className='ir-title'>Experience</div>)}
          {showItem && loot[0].rarity && (<div className='ir-title'>Lost File</div>)}

          {showOverview && (
            <div className='overview-rewards'>{"Rewards"}</div>
          )}

          {showOverview && (
            <div className='show-overview-flex'>

              {item != 14 && item != 15 && (<>

                {overview0 && (
                  <div className='show-overview-container'>
                    <img src='/coin.png' style={{height: '2.6rem'}}/>
                    <div className='show-overview-bot'>{loot[1]} coins</div>
                  </div>
                )}

                {overview1 && (
                  <div className='show-overview-container' style={{marginLeft: '0.4rem'}}>
                    <img src='/medal.png' style={{height: '2.6rem'}}/>
                    <div className='show-overview-bot'>+{loot[2]} xp</div>
                  </div>
                )}

                {overview2 && (
                  <div className='show-overview-container-loot' style={{marginLeft: '0.4rem'}}>
                      <img src={`/${loot[0]?.display ? loot[0].display : loot[0].sticker_name}.png`} className='show-overview-img'/>
                    <div className='show-overview-bot'>{loot[0]?.display ? 'Loot' : 'Sticker'}</div>
                  </div>
                )}

              </>)

              }

              {(item == 14 || item == 15) && (
                <>
                {overview0 && (
                  <div className='show-overview-container' style={{marginRight: '0.2rem'}}>
                    <img src={`/${loot[0].sticker_name}.png`} style={{height: '2.6rem'}}/>
                    <div className='show-overview-bot'>{loot[0].sticker_display}</div>
                  </div>
                )}
                {overview1 && (
                  <div className='show-overview-container'>
                    <img src={`/${loot[1].sticker_name}.png`} style={{height: '2.6rem'}}/>
                    <div className='show-overview-bot'>{loot[1].sticker_display}</div>
                  </div>
                )}
                {overview2 && (
                  <div className='show-overview-container'>
                    <img src={`/${loot[2].sticker_name}.png`} style={{height: '2.6rem'}}/>
                    <div className='show-overview-bot'>{loot[2].sticker_display}</div>
                  </div>
                )}
                {overview3 && (
                  <div className='show-overview-container'>
                    <img src={`/${loot[3].sticker_name}.png`} style={{height: '2.6rem'}}/>
                    <div className='show-overview-bot'>{loot[3].sticker_display}</div>
                  </div>
                )}
                {overview4 && (
                  <div className='show-overview-container'>
                    <img src={`/${loot[4].sticker_name}.png`} style={{height: '2.6rem'}}/>
                    <div className='show-overview-bot'>{loot[4].sticker_display}</div>
                  </div>
                )}
                </>
              )}
                
                
                
            </div>
          )}
          {showSticker0 && (
            <>
              <div className='new-sticker-found'>
                <div style={{display: 'flex', marginRight: '0.3rem'}} className='star-shake'><Star /> </div>
                  New Sticker Found
                <div style={{display: 'flex', marginLeft: '0.3rem'}} className='star-shake'><Star /> </div>
              </div>
              <img src={`/${loot[0]?.sticker_name}.png`} className='item-reward-icon-no-anim'/>
              <div style={{marginTop: '1rem', fontSize: '1rem', fontWeight: '500'}}>{`${loot[0]?.sticker_display} Sticker`}</div>
            </>
          )}
          {showSticker1 && (
            <>
              <div className='new-sticker-found'>
                <div style={{display: 'flex', marginRight: '0.3rem'}} className='star-shake'><Star /> </div>
                  New Sticker Found
                <div style={{display: 'flex', marginLeft: '0.3rem'}} className='star-shake'><Star /> </div>
              </div>
              <img src={`/${loot[1]?.sticker_name}.png`} className='item-reward-icon-no-anim'/>
              <div style={{marginTop: '1rem', fontSize: '1rem', fontWeight: '500'}}>{`${loot[1]?.sticker_display} Sticker`}</div>
            </>
          )}
          {showSticker2 && (
            <>
              <div className='new-sticker-found'>
                <div style={{display: 'flex', marginRight: '0.3rem'}} className='star-shake'><Star /> </div>
                  New Sticker Found
                <div style={{display: 'flex', marginLeft: '0.3rem'}} className='star-shake'><Star /> </div>
              </div>
              <img src={`/${loot[2]?.sticker_name}.png`} className='item-reward-icon-no-anim'/>
              <div style={{marginTop: '1rem', fontSize: '1rem', fontWeight: '500'}}>{`${loot[2]?.sticker_display} Sticker`}</div>
            </>
          )}
          {showSticker3 && (
            <>
              <div className='new-sticker-found'>
                <div style={{display: 'flex', marginRight: '0.3rem'}} className='star-shake'><Star /> </div>
                  New Sticker Found
                <div style={{display: 'flex', marginLeft: '0.3rem'}} className='star-shake'><Star /> </div>
              </div>
              <img src={`/${loot[3]?.sticker_name}.png`} className='item-reward-icon-no-anim'/>
              <div style={{marginTop: '1rem', fontSize: '1rem', fontWeight: '500'}}>{`${loot[3]?.sticker_display} Sticker`}</div>
            </>
          )}
          {showSticker4 && (
            <>
              <div className='new-sticker-found'>
                <div style={{display: 'flex', marginRight: '0.3rem'}} className='star-shake'><Star /> </div>
                  New Sticker Found
                <div style={{display: 'flex', marginLeft: '0.3rem'}} className='star-shake'><Star /> </div>
              </div>
              <img src={`/${loot[4]?.sticker_name}.png`} className='item-reward-icon-no-anim'/>
              <div style={{marginTop: '1rem', fontSize: '1rem', fontWeight: '500'}}>{`${loot[4]?.sticker_display} Sticker`}</div>
            </>
          )}

          {!showIcon && !showOverview && (<div className='ir-remaining'>
            <div>Remaining: </div>
            <div className='ir-quantity'>{remaining}</div>
          </div>)}

          <div className='ir-img-cont'>
            {showCurrency && (
              <>
                <img src='/coin.png' className='item-reward-icon-no-anim'/>
              </>
            )}
            {showExp && (
              <>
                <img src='/medal.png' className='item-reward-icon-no-anim'/>
              </>
            )}
            {showItem && loot[0]?.rarity && (
              
              <div className={!showItem ? 'sir' : 'item-reward-icon-slide'}>
                <img src={`/${loot[0]?.display}.png`} className={'item-reward-icon-no-anim'}/>

                {delay && (
                    <div className='show-item-abs' style={{right: `${loot[0]?.rarity === 'Common' ? '-8rem' : '-7rem'}`}}>
                    <div className='idc-2' style={{color: `${loot[0]?.rarity === 'Common' ? '#7fd394' : loot[0]?.rarity === 'Rare' ? '#6488b4' : '#a577c0'}`}}>
                      {loot[0]?.name}
                    </div>
                      <div className='idc-0'>
                        <div className='idc-1'>Rarity:&nbsp; </div>
                        <div className='idc-rarity' style={{color: `${loot[0]?.rarity === 'Common' ? '#7fd394' : loot[0]?.rarity === 'Rare' ? '#6488b4' : '#a577c0'}`}}>{loot[0]?.rarity}</div>
                      </div>
                      <div className='idc-0' style={{marginTop: '0.2rem'}}>
                        <div className='idc-1'>Value:&nbsp; </div>
                        <div className='idc-rarity'>
                          <img src='/coin.png' style={{height: '1.2rem', marginRight: '0.2rem'}}/>
                          <div>24</div>
                        </div>
                      </div>
                    </div>
                )}
                
              </div>
            )}

            {showItem && loot[0]?.sticker_name && (
              <>
                <div className='new-sticker-found'>
                  <div style={{display: 'flex', marginRight: '0.3rem'}} className='star-shake'><Star /> </div>
                    New Sticker Found
                  <div style={{display: 'flex', marginLeft: '0.3rem'}} className='star-shake'><Star /> </div>
                </div>
                <img src={`/${loot[0]?.sticker_name}.png`} className='item-reward-icon-no-anim'/>
                <div style={{marginTop: '1rem', fontSize: '1rem', fontWeight: '500'}}>{`${loot[0]?.sticker_display} Sticker`}</div>
              </>
            )}

            {showIcon && (
              <img src={item == 9 ? '/package_icon.png' : item == 8 ? '/present_icon.png' : item == 7 ? '/mail_icon.png' : item == 14 ? '/basket.png' : '/basket2.png'} className='item-reward-icon' onClick={() => handleUnwrap()}/>
            )}
            {!isUnwrapping && (
            <>
              <div className='tap1'>Tap</div>
              <div className='tap2'>Tap</div>
              <div className='tap3'>Tap</div>
            </>
            )}
            
          </div>
          {showCurrency && (
            <div className='coins-amount'>x{loot[1]} Coins</div>
          )}
          {showExp && (
            <div className='coins-amount'>x{loot[2]} Exp</div>
          )}
          {showItem && (
            <div className='desc-item-reward'>{loot[0]?.desc}</div>
          )}
          {!isUnwrapping && (
            <div className='ir-2'>
              Tear it open and uncover secrets, surprises, or maybe just suspense. What's inside? Only one way to find out!
            </div>
          )}
          
        </div>


      
    </div>

  )
}

export default ItemRewardPopupWarehouse