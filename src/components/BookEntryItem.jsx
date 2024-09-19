import React, { useState } from 'react'
import {ReactComponent as BookIcon} from '../book_icon2.svg'
import '../bookspecificstats.css'

function BookEntryItem({index, pages, date, percent}) {

    const [showFire, setShowFire] = useState(false);
    const [showPercentage, setShowPercentage] = useState(false);

    const handleHover = () => {

        setTimeout(() => {
            setShowFire(true);
            document?.getElementById('fire' + `${index}`)?.classList?.remove('no_opacity');
        }, 500)
        

        setTimeout(() => {

            document?.getElementById('fire' + `${index}`)?.classList?.add('no_opacity');

            setTimeout(() => {
                setShowFire(false);
                setShowPercentage(true);
            }, 300)

        }, 1200)
        
    }

  return (
    <>
        <div class={"container" + " " + "slideInAnimation"} onMouseEnter={() => handleHover()} onMouseLeave={() => {setShowPercentage(false); setTimeout(() => {setShowFire(false)}, 300); document?.getElementById('fire' + `${index}`)?.classList?.add('no_opacity')}}>
            <div class="main-box">
                <div class="box-content">
                <div class="svg">
                    <BookIcon />
                </div>
                <div class="text">
                    <div class="title">{pages} </div>
                    <div style={{display: 'flex', alignItems: 'left', justifyContent: 'left', fontWeight: '600', color: '#454B54'}}>{date}</div>
                </div>
                <div class="dots">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                </div>

            </div>

            <div className={"fire_percent"}>
                {showFire ? (<div id={"fire" + `${index}`} style={{display: 'grid', justifyContent: 'center', alignItems: 'center', marginTop: '10px', color: 'white', fontFamily: "Inter"}}><div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px'}}>Streak!!!</div></div>) : ''}
                {showPercentage ? (<div id={"percent" + `${index}`} style={{fontSize: '28px', fontWeight: '600', marginTop: '24px', marginLeft: '0px', color: 'white', fontFamily: "Inter"}}>{percent}%</div>): ''}
            </div>

        </div>
    </>
  )
}

export default BookEntryItem