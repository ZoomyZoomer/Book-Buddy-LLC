import React from 'react'
import {ReactComponent as Close} from '../close_icon.svg'
import {ReactComponent as Star} from '../starFull.svg'
import { useState, useEffect } from 'react';

const ItemInfoPopup = ({setShowPopup, market, username, setShowItemPopup, value, setShowPickSticker}) => {

    const [isAnimating, setIsAnimating] = useState(false);
    const [purchasedMarket, setPurchasedMarket] = useState(undefined);
    const params = new URLSearchParams(window.location.search);
    const marketString = params.get('market');

    useEffect(() => {
        if (marketString) {
            setPurchasedMarket(JSON.parse(decodeURIComponent(marketString)));
        }
    }, [])

    const handleUseItem = async() => {


        if (purchasedMarket.id == '15'){

            setShowPickSticker(true);
            setShowPopup(false);

        } else {

            setShowItemPopup(true);
            setShowPopup(false);

        }

    }

  return (
    <div className={purchasedMarket ? 'market-item-info-container-purchased' : 'market-item-info-container'}>

        <div className='miic-dupe'>

            {purchasedMarket && (
                <div className='item-purchased'>
                    <div style={{display: 'flex', marginRight: '0.3rem'}} className='star-shake'><Star /> </div>
                    {`Item Purchased ${value > 1 ? `x${value}` : ''}`}
                    <div style={{display: 'flex', marginLeft: '0.3rem'}} className='star-shake'><Star /> </div>
                </div>
            )}

            <div className='mii-cont'>
                <div className='mii-circle'><img src={`/${purchasedMarket ? purchasedMarket.img : market?.img}.png`} style={{height: '5rem', cursor: 'pointer'}} className={isAnimating ? 'mii-img mii-anim' : 'mii-img'} onClick={() => {setIsAnimating(true); setTimeout(() => setIsAnimating(false), 1700);}}/></div>
                <div className='mii-text'>
                    <div className='mii-test'>{purchasedMarket ? purchasedMarket.item_name : market.item_name}</div>
                    <div className='mii-text-0'>Item Type: &nbsp; <div className='mii-text-1'>{purchasedMarket ? purchasedMarket.type : market.type}</div></div>
                    <div className='mii-text-0'>Market Value: &nbsp; <div className='mii-text-1'>{purchasedMarket ? (purchasedMarket.cost?.coins ? <div style={{display: 'flex'}}><img src='/coin.png' style={{height: '1rem', marginRight: '0.2rem'}}/></div> : purchasedMarket?.cost?.file ? <div style={{display: 'flex'}}><img src={`/${purchasedMarket?.cost?.file}.png`} style={{height: '1rem', marginRight: '0.2rem'}}/></div> : '$') : market?.cost?.coins ? <div style={{display: 'flex'}}><img src='/coin.png' style={{height: '1rem', marginRight: '0.2rem'}}/></div> : market?.cost?.file ? <div style={{display: 'flex'}}><img src={`/${market?.cost?.file}.png`} style={{height: '1rem', marginRight: '0.2rem'}}/></div> : '$'}{purchasedMarket ? purchasedMarket.cost.amount : market?.cost?.amount}</div></div>
                    <div className='mii-text-0'>In Filing Cabinet: &nbsp; <div className='mii-text-1'>3</div></div>
                </div>
            </div>
            <div className='mii-text-0' style={{color: '#06AB78', marginTop: '1.5rem', fontWeight: '600'}}>Use: &nbsp;
                <div className='mii-text-1' style={{color: '#78C6A3', fontSize: '0.9rem'}}>{purchasedMarket ? purchasedMarket.use : market?.use}</div>
            </div>
            <div className='mii-text-1' style={{marginTop: '0.4rem'}}>"{purchasedMarket ? purchasedMarket.desc : market?.desc}"</div>

            {purchasedMarket && (
                <div className='purchased-market-buttons-container'>
                    <button style={{marginRight: '0.7rem'}} className='to-inventory' onClick={() => setShowPopup(false)}>Add to Inventory</button>
                    <button className='market-purchase' style={{width: '26%', fontSize: '0.9rem'}} onClick={() => handleUseItem()}>{value > 1 ? `Use Items (${value})` : 'Use Item'}</button>
                </div>
            )}

        <div className='mii-close' onClick={() => setShowPopup(false)}><Close /></div>
        <div className='bg-0'/>
        <div className='bg-1'/>
        <div className='bg-2'/>
        </div>
    </div>
  )
}

export default ItemInfoPopup