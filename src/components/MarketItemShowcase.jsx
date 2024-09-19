import React, { useState, useRef, useEffect } from 'react'
import {ReactComponent as InfoCircle} from '../info-circle.svg'

const MarketItemShowcase = ({market, type, coupon, setReFetchItem}) => {

    const [value, setValue] = useState(5);
    const [quantity, setQuantity] = useState(5);
    const [showPop, setShowPop] = useState(false);
    const [showPop0, setShowPop0] = useState(false);
    const [showPop1, setShowPop1] = useState(false);
    const [showPop2, setShowPop2] = useState(false);
    const [showPop3, setShowPop3] = useState(false);
    const [showPop4, setShowPop4] = useState(false);
    const audioRefCoins = useRef(null);

    useEffect(() => {
        setQuantity(5);
        setValue(1);
    }, [market])

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

    function multiplyDollarValue(dollarValue, x) {
        // Convert to cents
        const cents = Math.round(dollarValue * 100);
        
        // Multiply by x
        const resultCents = cents * x;
        
        // Convert back to dollars and round to two decimal places
        const resultDollars = (resultCents / 100).toFixed(2);
        
        return resultDollars;
      }

    const handlePurchase = () => {

        if (value > 0){
            setQuantity(prev => prev - value);
            if (quantity - value > 0){
                setValue(1);
            } else {
                setValue(0);
                setTimeout(() => {
                    document.getElementById('showcase-item').classList.remove('market-item-large-container-sold-out');
                    document.getElementById('showcase-item').classList.add('showcase-item-throw');
                    setTimeout(() => {
                        document.getElementById('bg0').classList.add('bgpop');
                    }, 400)
                
                }, 200)
                setTimeout(() => {
                    setReFetchItem(prev => !prev);
                    document.getElementById('bg0').classList.remove('bgpop');
                    
                    setTimeout(() => {
                        document.getElementById('showcase-item').classList.remove('showcase-item-throw');
                    }, 60)
                }, 870)
            }
            playAudioCoins();
            popAnimation();
        }
        
    }

  return (
    <div id='showcase-item' className={quantity > 0 ? 'market-item-large-container' : 'market-item-large-container-sold-out'}>

        <audio ref={audioRefCoins} src="/coins.wav" />

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
                <div style={{display: 'flex', marginRight: '0.4rem', cursor: 'pointer'}}><InfoCircle /></div>
                <button className={(type == 2 || type == 3) ? 'market-purchase-sold-out' : (value >= 1 ? 'market-purchase' : 'market-purchase-sold-out')} onClick={() => handlePurchase()}>{(type == 2 || type == 3) ? 'Sold Out' : (value >= 0 ? (market?.cost?.dollar ? `Purchase ${value} for $${multiplyDollarValue(market?.cost?.amount, value)}` : `Purchase ${value}`) : 'Sold Out')}</button>
            </div>
        </div>
        {(type != 2 && type != 3) && quantity !== 1 ? (
            <div className="slider-container">

                <div className='slidecontainer'>
                    <input type="range" min="1" max={quantity} step={1} value={value} class="market-slider" id="myRange" onChange={(e) => setValue(e.target.value)}/>
                </div>

            </div>
        ): <></>}
        {type === 0 || type === 1 ? (
            <div className={type === 1 ? 'market-cost-abs-large' : type === 0 && 'market-cost-abs-small'}>
                <img src={market?.cost?.coins ? '/coin.png' : `/${market?.cost?.file}.png`} style={{height: '50%'}}/>
                <div className='market-cost-text' style={{fontSize: market?.cost?.coins ? '1rem' : '1.125rem'}}>{`x${!coupon ? market?.cost?.amount * (value >= 1 ? value : 1) : market?.cost?.discounted_amount * (value >= 1 ? value : 1)}`}</div>
            </div>
        ): <></>}

        <img src='/coupon.png' style={{height: '2rem'}} className='type1coupon' />
        
    </div>
  )
}

export default MarketItemShowcase