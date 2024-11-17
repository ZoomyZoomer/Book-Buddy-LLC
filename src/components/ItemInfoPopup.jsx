import React from 'react'
import {ReactComponent as Close} from '../close_icon.svg'
import {ReactComponent as Star} from '../starFull.svg'
import { useState, useEffect } from 'react';

const ItemInfoPopup = ({setShowPopup, market, username, setShowItemPopup, value, setShowPickSticker}) => {

    const [isAnimating, setIsAnimating] = useState(false);
    const [purchasedMarket, setPurchasedMarket] = useState(undefined);
    const params = new URLSearchParams(window.location.search);
    const marketString = params.get('market');
    const sessionString = params.get('session_id');

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
                    {`Item Purchased ${value > 1 ? `x${value}` : ''}`}
                    <div className='n-item-purchased-underline'/>
                </div>
            )}

            <div className='n-item-purchased-use'>Use: &nbsp; <div style={{color: '#78C6A3', fontWeight: '400'}}>{purchasedMarket?.use}</div></div>

            <div className='mii-cont' style={{marginTop: '2rem', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                <div style={{display: 'flex', justifyContent: 'left', alignItems: 'left', width: '100%'}}>
                    <div className='mii-circle'><img src={`/${purchasedMarket ? purchasedMarket.img : market?.img}.png`} style={{height: '4rem', cursor: 'pointer'}} className={isAnimating ? 'mii-img mii-anim' : 'mii-img'} onClick={() => {setIsAnimating(true); setTimeout(() => setIsAnimating(false), 1700);}}/></div>
                    <div className='mii-text'>
                        <div className='mii-test'>{purchasedMarket ? purchasedMarket.item_name : market.item_name}</div>
                        <div className='mii-text-0'>Item Type: &nbsp; <div className='mii-text-1'>{purchasedMarket ? purchasedMarket.type : market.type}</div></div>
                        <div className='mii-text-0'>In Storage: &nbsp; <div className='mii-text-1'>3</div></div>
                        <div className='mii-text-0'>Market Value: &nbsp; <div className='mii-text-1'>{purchasedMarket ? (purchasedMarket.cost?.coins ? <div style={{display: 'flex'}}><img src='/coin.png' style={{height: '1rem', marginRight: '0.2rem'}}/></div> : purchasedMarket?.cost?.file ? <div style={{display: 'flex'}}><img src={`/${purchasedMarket?.cost?.file}.png`} style={{height: '1rem', marginRight: '0.2rem'}}/></div> : '$') : market?.cost?.coins ? <div style={{display: 'flex'}}><img src='/coin.png' style={{height: '1rem', marginRight: '0.2rem'}}/></div> : market?.cost?.file ? <div style={{display: 'flex'}}><img src={`/${market?.cost?.file}.png`} style={{height: '1rem', marginRight: '0.2rem'}}/></div> : '$'}{purchasedMarket ? purchasedMarket.cost.amount : market?.cost?.amount}</div></div>
                    </div>
                    
                </div>
                <button className='market-purchase2' style={{fontSize: '0.9rem'}} onClick={() => handleUseItem()}>{value > 1 ? `Use Items (${value})` : 'Use Item'}</button>
                </div>

            </div>

        <div className='mii-close' onClick={() => setShowPopup(false)}><Close /></div>
        <div className='transaction_id'><strong>Transaction ID:</strong> {sessionString.slice(-25)}</div>
        </div>
    </div>
  )
}

export default ItemInfoPopup