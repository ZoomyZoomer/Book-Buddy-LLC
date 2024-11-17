import React from 'react'
import {ReactComponent as InfoCircle} from '../info-circle.svg'
import { useState, useEffect, useRef } from 'react'
import {ReactComponent as Arrow} from '../pointer-arrow.svg'
import axios from 'axios'


const MarketItem = ({type, market, setShowPopup, itemInfoRef, setReFetchMarket, username, errorRef, setShowError, coupon, stripePromise, numStickers}) => {

    const [value, setValue] = useState(1);
    const [showPop, setShowPop] = useState(false);
    const [showPop0, setShowPop0] = useState(false);
    const [showPop1, setShowPop1] = useState(false);
    const [showPop2, setShowPop2] = useState(false);
    const [showPop3, setShowPop3] = useState(false);
    const [showPop4, setShowPop4] = useState(false);
    const audioRefCoins = useRef(null);

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const playAudioCoins = () => {
        audioRefCoins.current.volume = 0.2;
        audioRefCoins.current.play();
    };

    const popAnimation = () => {
        setShowPop(true);

        console.log(value);

        if (type === 1){
            if (value == 1){
                setShowPop0(true);
            } 
            if (value == 2){
                setShowPop0(true);
                setTimeout(() => {
                    setShowPop1(true);
                }, 150)
            } 
            if (value == 3){
                setShowPop0(true);
                setTimeout(() => {
                    setShowPop1(true);
                }, 150)
                setTimeout(() => {
                    setShowPop2(true);
                }, 300)
            } 
            if (value == 4){
                setShowPop0(true);
                setTimeout(() => {
                    setShowPop1(true);
                }, 150)
                setTimeout(() => {
                    setShowPop2(true);
                }, 300)
                setTimeout(() => {
                    setShowPop3(true);
                }, 450)
            }
             if (value == 5){
                setShowPop0(true);
                setTimeout(() => {
                    setShowPop1(true);
                }, 150)
                setTimeout(() => {
                    setShowPop2(true);
                }, 300)
                setTimeout(() => {
                    setShowPop3(true);
                }, 450)
                setTimeout(() => {
                    setShowPop4(true);
                }, 600)
            }
        }

        setTimeout(() => {
            setShowPop(false);
            setShowPop0(false);
            setShowPop1(false);
            setShowPop2(false);
            setShowPop3(false);
            setShowPop4(false);
        }, 1450)

    }

    const handlePurchase = async() => {

        if (type != 2 && type != 3){

            if (value >= 1){

                try {

                    if (username){
                        await axios.post('/api/purchase-item', {
                            username,
                            market,
                            value,
                            type
                        })
                        setReFetchMarket(prev => !prev);
                        playAudioCoins();
                        popAnimation();
                    }

                } catch(e) {
                    if (e?.response?.status === 400){
                        errorRef.current = {title: 'Insufficient Resources', message: "You lack the currency to make this purchase"};
                        setShowError(true);
                    } else {
                        console.error({error: e});
                    }
                }

            }

        } else {

            if ((type == 2 || type == 3) && (12 - numStickers == 0)){
                return;
            }
            
            const stripe = await stripePromise;

            try {

                const response = await axios.post('/api/create-checkout-session', {
                    item_name: market.item_name,
                    cost: Number(market.cost.amount) * 100,
                    market,
                    value
                });

                const session = response.data;

                const result = await stripe.redirectToCheckout({
                    sessionId: session.id,
                });

                if (result.error) {
                    console.error(result.error.message);
                }

            } catch(e) {
                console.error('Error creating checkout session:', e);
            }

        }

    }

    useEffect(() => {
        if (market?.stock <= 0){
            setValue(0);
        } else {
            if (type != 2 && type != 3){
                setValue(1);
            }
            
        }
        
    }, [market])

    function multiplyDollarValue(dollarValue, x) {
        // Convert to cents
        const cents = Math.round(dollarValue * 100);
        
        // Multiply by x
        const resultCents = cents * x;
        
        // Convert back to dollars and round to two decimal places
        const resultDollars = (resultCents / 100).toFixed(2);
        
        return resultDollars;
      }

  return (
    <div className={(type == 2 || type == 3) && (12 - numStickers == 0) ? 'market-item-large-container-sold-out' : (value >= 1 ? 'market-item-large-container' : 'market-item-large-container-sold-out')}>
        <audio ref={audioRefCoins} src="/coins.wav" />

        {type === 1 && (
            <div className='arrow-abs'>
                <div style={{fontSize: '0.9rem', fontWeight: '500', width: 'max-content', marginRight: '0.2rem', marginBottom: '0.5rem'}}>Price Label</div>
                <Arrow />
            </div>
        )}
    
        {showPop && type === 0 && (
            <img id={`m${type}-market-0`} src={`/${market?.img}.png`} style={{height: '1rem'}}/>
        )}

        {showPop && type === 1 && (
            <>
                {showPop0 && <img id={`m${type}-market-0`} src={`/${market?.img}.png`} style={{height: '1rem'}}/>}
                {showPop1 && <img id={`m${type}-market-1`} src={`/${market?.img}.png`} style={{height: '1rem'}}/>}
                {showPop2 && <img id={`m${type}-market-2`} src={`/${market?.img}.png`} style={{height: '1rem'}}/>}
                {showPop3 && <img id={`m${type}-market-3`} src={`/${market?.img}.png`} style={{height: '1rem'}}/>}
                {showPop4 && <img id={`m${type}-market-4`} src={`/${market?.img}.png`} style={{height: '1rem'}}/>}
            </>
        )}

        <div className='market-item-grid'>
            <div className='market-flex'>
                <div className='market-circle-bg'><img src={`/${market?.img}.png`} className='market-img'/></div>
                <div className='market-text'>
                    <div className={type === 1 ? 'mt-0' : 'mt-0-small'}>{market?.item_name}</div>
                    <div className={type === 1 ? 'mt-1' : 'mt-1-small'}>{market?.desc}</div>
                </div>
            </div>
            <div className='market-buttons-container'>
                <div style={{display: 'flex', marginRight: '0.4rem', cursor: 'pointer'}} onClick={() => {itemInfoRef.current = market; setShowPopup(true)}}><InfoCircle /></div>
                <button className={(type == 2 || type == 3) && (12 - numStickers == 0) ? 'market-purchase-sold-out' : (value >= 1 ? 'market-purchase' : 'market-purchase-sold-out')} onClick={() => handlePurchase()}>{(type == 2 || type == 3) && (2 - numStickers == 0) ? 'Sold Out' : (value >= 1 ? (market?.cost?.coins ? 'Purchase' : market?.cost?.dollar ? `Purchase ${value} for $${multiplyDollarValue(market?.cost?.amount, value)}` : `Purchase ${value}`) : 'Sold Out')}</button>
            </div>
        </div>

        {(type != 2 && type != 3) && market?.stock > 1 ? (
            <div className="slider-container">

                <div className='slidecontainer'>
                    <input type="range" min="1" max={(type == 2 || type == 3) ? (numStickers > 5 ? 5 : numStickers) : market?.stock} step={1} value={value} class="market-slider" id="myRange" onChange={(e) => handleChange(e)}/>
                </div>

            </div>
        ): <></>}

        {(type == 2 || type == 3) && (12 - numStickers > 1) && (
            <div className="slider-container">

                <div className='slidecontainer'>
                    <input type="range" min="1" max={(type == 2 || type == 3) ? (12 - numStickers > 5 ? 5 : 12 - numStickers) : market?.stock} step={1} value={value} class="market-slider" id="myRange" onChange={(e) => handleChange(e)}/>
                </div>

            </div>
        )}
        
        {type === 0 || type === 1 ? (
            <div className={type === 1 ? 'market-cost-abs-large' : type === 0 && 'market-cost-abs-small'}>
                <img src={market?.cost?.coins ? '/coin.png' : `/${market?.cost?.file}.png`} style={{height: '50%'}}/>
                <div className='market-cost-text' style={{fontSize: market?.cost?.coins ? '1rem' : '1.125rem'}}>{market?.cost?.coins ? (!coupon ? market?.cost?.amount : market?.cost?.discounted_amount) : `x${!coupon ? market?.cost?.amount * (value >= 1 ? value : 1) : market?.cost?.discounted_amount * (value >= 1 ? value : 1)}`}</div>
            </div>
        ): <></>}
        

        {type === 1 && coupon && (
            <img src='/coupon.png' style={{height: '2rem'}} className='type1coupon' />
        )}
        {type === 0 && coupon && (
            <img src='/coupon.png' style={{height: '2rem'}} className='type0coupon' />
        )}

    </div>
  )
}

export default MarketItem