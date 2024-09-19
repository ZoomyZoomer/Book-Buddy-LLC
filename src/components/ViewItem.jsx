import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import {ReactComponent as SquigglyArrow} from '../squigglyArrow.svg'
import {ReactComponent as Centerdot} from '../center_dot.svg'
import {ReactComponent as CloseIcon} from '../close_icon.svg'
import {ReactComponent as CheckMark} from '../check.svg'
import {ReactComponent as StarIcon} from '../starFull.svg'
import confetti from 'canvas-confetti';
import '../viewItem.css'

const ViewItem = ({popUp, setReFetchEntries, alert}) => {

  const [data, setData] = useState({});
  const {username, tab_name, volume_id, index, endView} = popUp.current;
  const [showButton, setShowButton] = useState(true);
  const [showCheck, setShowCheck] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [newImage, setNewImage] = useState('');
  const [showInfoGrid, setShowInfoGrid] = useState(false);
  const first = useRef(false);
  const getOnce = useRef(false);
  const fill_bar = useRef(false);

  const file_items = new Map([
    ['File', '"A mysterious file: Handle with care—could be a game changer or just more paperwork."'],
    ['Certificate', '"A certificate: Proof that you’ve mastered something—at least on paper!"'],
    ['Love Letter', '"A love letter: More powerful than any spell, but handle with care—hearts are fragile!"']
  ]);

  const getEntry = async() => {

    const res = await axios.get('http://localhost:4000/get-entry', {
        params: {
            username,
            tab_name,
            volume_id,
            index
        } 
    })

    setData(res.data);
    if (!first.current){
      setNewImage(res.data[0].image);
      first.current = true;
    }
    
    fill_bar.current = false;

}

const updateEntry = async() => {

    const res = await axios.post('http://localhost:4000/update-entry', {
      username,
      tab_name,
      volume_id,
      index
    })

    setReFetchEntries(prev => !prev);
    console.log(res.data);
    setData(res.data);
    return res.data;

}

useEffect(() => {

    if (!getOnce.current){
        getEntry();
        document?.getElementsByClassName('info_active')[0]?.classList.add('no_opacity');
        document?.getElementsByClassName('info_active')[0]?.classList.remove('info_active');
        document?.getElementsByClassName('timeline_block_active')[0]?.classList?.remove('timeline_block_active');
        getOnce.current = true;
    }

})

const validateButton = () => {

  if (data[0]?.quantity >= data[0]?.max) {

    document.getElementById('vi-button').classList.add('vi-button-active');
    document.getElementById('vi-button').classList.remove('vi-button-unactive');

  }

}

const fillBar = () => {

  const amount = data[0]?.quantity / data[0]?.max;

  if (amount > 1){
    document.getElementsByClassName('progress_container_fill')[0].style.width = `${(1) * 100}%`;
  } else {
    document.getElementsByClassName('progress_container_fill')[0].style.width = `${(data[0]?.quantity / data[0]?.max) * 100}%`;
  }

}

useEffect(() => {

  if (!fill_bar.current){
    fillBar();
    validateButton();
    fill_bar.current = true;
  }

}, [data])

const handleClick = () => {

  if (data[0]?.quantity >= data[0]?.max){

    document.getElementById('load-button').classList.add('button-load');
    document.getElementById('load-button').classList.remove('no_opacity');
    document.getElementById('vi-button').classList.add('vi-button-loading');
    setShowButton(false);

    setTimeout(() => {
      setShowCheck(true);
      document.getElementById('check').classList.add('checkmark2');

      setTimeout(async() => {
        const res = await updateEntry();
        setIsRefining(true);
        
        setTimeout(() => {
          document.getElementById('ref-img').classList.add('ref-anim');

          setTimeout(() => {
            document.getElementsByClassName('ref-1')[0].classList.remove('no_opacity');
            document.getElementsByClassName('ref-2')[0].classList.remove('no_opacity');
            document.getElementsByClassName('ref-3')[0].classList.remove('no_opacity');
            document.getElementsByClassName('bar')[0].classList.remove('no_opacity');
            document.getElementsByClassName('vi-close')[0].classList.remove('no_opacity');
            
            setTimeout(() => {
              document.getElementById('ref-img').classList.add('showStats');
              setTimeout(() => {
                setShowInfoGrid(true);
              }, 999)
              
            }, 2000)

          }, 4000)

          setTimeout(() => {
            console.log(res);
            setNewImage(`${res?.name}`);
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }, 2380)

        }, 100)
        
      }, 2000)

    }, 5000)

  } else {
    alert.current = {header: 'Not enough duplicates', message: `You need to collect ${data[0]?.max - data[0]?.quantity} more ${data[0]?.item}s`}
  }

}

  return (
    <div className="popup-item">
      <div className="cont">

      {isRefining && (
        <div className='ref-cont'>
          <div className='ref-0'>
            <div className={'ref-1' + " " + "no_opacity"}>
              <div style={{marginRight: '6px'}}><StarIcon /></div>
               New Item Discovered
            </div>
            <div className={'ref-2' + " " + "no_opacity"}>
              <div className={'vi-3-title'}>
                {data?.item}
              </div>
              <div className='vi-0-1' style={{marginLeft: '-4px', marginRight: '-4px'}}>
                <Centerdot />
              </div>
              <div className='vi-3-title'>
                {`Tier ${data?.tier}`}
              </div>
            </div>
            <div className={'bar' + " " + 'no_opacity'}/>
          </div>
          <div id='ref-img'>
            <img id='myimg' src={`/${newImage}.png`} style={{height: '100px'}}/>
            {showInfoGrid && (
              <div className='vi-3-grid'>

              <div className='vi-2-val'>
                 <div className='vi-2-val'>Value: &nbsp;</div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '6px'}}><img src='/coin.png' style={{height: '22px', marginRight: '4px'}}/></div>
                <div className='vi-2-subval'>{data?.value} coins</div>
              </div>
  
              <div className='vi-2-val'>
                <div className='vi-2-val'>Quantity: &nbsp;</div>
                <div className='vi-2-subval'>{data?.quantity} collected</div>
              </div>
  
              <div className='vi-2-val' style={{marginTop: '4px'}}>
                <div className='vi-2-val'>Rarity: &nbsp;</div>
                <div className={`vi-2-subval ${data?.rarity === 'Common' ? 'rarity-Common2' : data?.rarity === 'Rare' ? 'rarity-Rare2' : 'rarity-Epic2'}`}>{data?.rarity}</div>
              </div>
  
            </div>
            )}
          
          </div>
          <div className={"ref-3" + " " + "no_opacity"}>
            {data?.desc}
          </div>
          <div className={"vi-close" + ' ' + 'no_opacity'} onClick={() => {setIsRefining(false); endView()}}>
            <CloseIcon />
          </div>
        </div>
      )}

      {!isRefining && (
        <>

        <div className="vi-0">
        <div className='vi-0-1' style={{marginRight: '8px'}}>
          <img src={`/${data[0]?.image}.png`} style={{height: '30px'}}/>
        </div>
        <div className='vi-0-2'>
          {data[0]?.item}
        </div>
        <div className='vi-0-1' style={{marginLeft: '-4px', marginRight: '-4px'}}>
          <Centerdot />
        </div>
        <div className='vi-0-2'>
          {`Tier ${data[0]?.tier}`}
        </div>
      </div>

      <div className="progress_container">
        <div className="progress_container_fill"/>
      </div>

      <div className='vi-d'>{data[0]?.quantity}/{data[0]?.max} duplicates collected</div>

      <div className="vi-desc">
        {data[0]?.desc}
      </div>

      <div className='vi-1'>

          <div className='vi-1-item-container'>
              <div className='vi-0'>
                <img id="myItem" src={`/${data[0]?.image}.png`} style={{height: '80px', position: 'relative', zIndex: '10'}}/>
                <div className='vi-1-abs'>
                  <div class="rectangle"></div>
                  <div class="triangle-top-left"></div>
                </div>
                
              </div>
          </div>

          <div className='vi-2-grid'>

            <div className='vi-2-val'>
               <div className='vi-2-val'>Value: &nbsp;</div>
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '6px'}}><img src='/coin.png' style={{height: '22px', marginRight: '4px'}}/></div>
              <div className='vi-2-subval'>{data[0]?.value} coins</div>
            </div>

            <div className='vi-2-val'>
              <div className='vi-2-val'>Quantity: &nbsp;</div>
              <div className='vi-2-subval'>{data[0]?.value} collected</div>
            </div>

            <div className='vi-2-val' style={{marginTop: '4px'}}>
              <div className='vi-2-val'>Rarity: &nbsp;</div>
              <div className={`vi-2-subval ${data[0]?.rarity === 'Common' ? 'rarity-Common2' : data[0]?.rarity === 'Rare' ? 'rarity-Rare2' : 'rarity-Epic2'}`}>{data[0]?.rarity}</div>
            </div>

          </div>

      </div>

      <div className="vi-3">
        <button id='vi-button' className="vi-button-unactive" onClick={() => handleClick()}>{showButton && `Upgrade Tier - ${data[0]?.quantity > data[0]?.max ? data[0]?.max : data[0]?.quantity}/${data[0]?.max}`}</button>
        <div id='load-button' className="no_opacity" />
        <div id='check'>
          {showCheck && <CheckMark />}
        </div>
      </div>     

      <div className="vi-close" onClick={() => endView()}>
        <CloseIcon />
      </div>
      </>

      )}

    
      </div>

    </div>
  )
}

export default ViewItem