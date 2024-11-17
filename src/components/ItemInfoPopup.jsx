import React from 'react'
import {ReactComponent as Close} from '../close_icon.svg'
import {ReactComponent as Star} from '../starFull.svg'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ItemInfoPopup = ({setShowPopup, market, username, setShowItemPopup, value, setShowPickSticker}) => {

    const [isAnimating, setIsAnimating] = useState(false);
    const [purchasedMarket, setPurchasedMarket] = useState(undefined);
    const params = new URLSearchParams(window.location.search);
    const marketString = params.get('market');
    const sessionString = params.get('session_id');

    const navigate = useNavigate('/');

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

            {!purchasedMarket && (
                <div className='item-purchased'>
                    Item Info
                <div className='n-item-purchased-underline'/>
            </div>
            )}

            <div className='n-item-purchased-use'>Use: &nbsp; <div style={{color: '#78C6A3', fontWeight: '400'}}>{purchasedMarket ? purchasedMarket?.use : market?.use}</div></div>

            <div className='mii-cont' style={{marginTop: '2rem', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                <div style={{display: 'flex', justifyContent: 'left', alignItems: 'left', width: '100%'}}>
                    <div className='mii-circle'><img src={`/${purchasedMarket ? purchasedMarket.img : market?.img}.png`} style={{height: '4rem', cursor: 'pointer'}} className={isAnimating ? 'mii-img mii-anim' : 'mii-img'} onClick={() => {setIsAnimating(true); setTimeout(() => setIsAnimating(false), 1700);}}/></div>
                    <div className='mii-text'>
                        <div className='mii-test'>{purchasedMarket ? purchasedMarket.item_name : market.item_name}</div>
                        <div className='mii-text-0'>Item Type: &nbsp; <div className='mii-text-1'>{purchasedMarket ? purchasedMarket.type : market.type}</div></div>
                        <div className='mii-text-0'>Market Value: &nbsp; <div className='mii-text-1'>{purchasedMarket ? (purchasedMarket.cost?.coins ? <div style={{display: 'flex'}}><img src='/coin.png' style={{height: '1rem', marginRight: '0.2rem'}}/></div> : purchasedMarket?.cost?.file ? <div style={{display: 'flex'}}><img src={`/${purchasedMarket?.cost?.file}.png`} style={{height: '1rem', marginRight: '0.2rem'}}/></div> : '$') : market?.cost?.coins ? <div style={{display: 'flex'}}><img src='/coin.png' style={{height: '1rem', marginRight: '0.2rem'}}/></div> : market?.cost?.file ? <div style={{display: 'flex'}}><img src={`/${market?.cost?.file}.png`} style={{height: '1rem', marginRight: '0.2rem'}}/></div> : '$'}{purchasedMarket ? purchasedMarket.cost.amount : market?.cost?.amount}</div></div>
                        <div className='mii-text-0'>Amount Left in Stock: &nbsp; <div className='mii-text-1'>{purchasedMarket?.stock ? purchasedMarket.stock : (market ? market.stock : 0)}</div></div>
                    </div>
                    
                </div>

                {purchasedMarket && (<button className='market-purchase2' onClick={() => handleUseItem()}>{value > 1 ? `Use Items (${value})` : 'Use Item'}</button>)}
                {!purchasedMarket && (<button className='market-purchase2' onClick={() => navigate('/storage')}>View In Storage</button>)}
                
                </div>

            </div>

            <div className='n-market-desc'>"{market.desc}"</div>

        <div className='mii-close' onClick={() => setShowPopup(false)}><Close /></div>
        {purchasedMarket && (<div className='transaction_id'><strong>Transaction ID:</strong> {sessionString.slice(-25)}</div>)}
        </div>
    </div>
  )
}

export default ItemInfoPopup