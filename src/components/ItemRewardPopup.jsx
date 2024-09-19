import axios from 'axios';
import React, { useState } from 'react'
import confetti from 'canvas-confetti';

const ItemRewardPopup = ({tier, setItemRewardPopup, username, volume_id, tab_name}) => {

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

  const handleUnwrap = async() => {

    setIsUnwrapping(true);

    const popup = document.getElementsByClassName('item-reward-popup')[0];
    popup.style.width = '32rem';

    const elem = document.getElementsByClassName('item-reward-icon')[0];

    elem?.classList?.add('item-reward-icon-unwrap');
    elem?.classList?.remove('item-reward-icon');

    const res = await axios.get('http://localhost:4000/fetch-tier-items', {
      params: {
        username
      }
    });

    setLoot(res.data);
    setRemaining(res.data.length - 1);

    await axios.post('http://localhost:4000/set-tier-info', {
      username,
      tab_name,
      volume_id,
      tier,
      info: {
        coins: res.data[1],
        xp: res.data[2],
        name: res.data[0].name,
        display: res.data[0].display,
        loot: {
          name: res.data[0].display,
          rarity: res.data[0].rarity,
          value: res.data[0].value,
          desc: res.data[0].desc
        }
      }
    })

    document.getElementsByClassName('item-reward-popup')[0].style.cursor = 'pointer';


    setTimeout(() => {
      setShowIcon(false);
      setShowCurrency(true);
    }, 290)

  }

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

  const nextReward = () => {

    if (showIcon){
      return;
    }

    setTimeout(() => {

    const elem = document.getElementsByClassName('item-reward-icon-no-anim')[0];

    if (!showExp && !showItem && !showOverview){
      elem?.classList?.remove('item-reward-icon-no-anim');
      elem?.classList?.add('item-reward-icon-unwrap');
    }
      if (showCurrency){
        setTimeout(() => {
          setShowCurrency(false);
          setRemaining(prev => prev - 1);
          setShowExp(true);
        }, 290)
      } else if (showExp){
        setTimeout(() => {
          setShowExp(false);
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
        setTimeout(() => {
          setItemRewardPopup(false);
        }, 280)
      }

    }, 100) 

  }

  return (

      <div className='item-reward-popup' onClick={() => nextReward()}>
   

        <div className='item-reward-container'>
          {!isUnwrapping && (<div className='ir-1'>{tier == 1 ? 'Envelope' : tier == 2 ? 'Package' : tier == 3 ? 'Supply Drop' : 'Neatly Wrapped Present'}</div>)}

          {showCurrency && (<div className='ir-title'>Currency</div>)}
          {showExp && (<div className='ir-title'>Experience</div>)}
          {showItem && (<div className='ir-title'>Entry Item</div>)}

          {showOverview && (
            <div className='overview-rewards'>Rewards</div>
          )}

          {showOverview && (
            <div className='show-overview-flex'>

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
                    <img src={`/${loot[0].display}.png`} className='show-overview-img'/>
                  <div className='show-overview-bot'>Loot</div>
                </div>
              )}
                
                
                
            </div>
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
            {showItem && (
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

            {showIcon && (
              <img src={tier == 1 ? '/mail_icon.png' : tier == 2 ? '/package_icon.png' : tier == 3 ? '/crate_drop.png' : '/present_icon.png'} className='item-reward-icon' onClick={() => handleUnwrap()}/>
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
            {tier === 1 ? `"Tear it open and uncover secrets, surprises, or maybe just suspense. What's inside? Only one way to find out!"`
            : tier === 2 ? `"Bulky and brimming with possibilities. Crack it open to reveal wonders or wild surprises!"`
            : tier === 3 ? `"Sky-delivered and ready for action—open it up to discover what's been air-dropped just for you!"`
            : `"Wrapped in mystery and tied with excitement, this gift holds the promise of joy and surprise—unwrap it to find out!"`}
            </div>
          )}
          
        </div>


      
    </div>

  )
}

export default ItemRewardPopup