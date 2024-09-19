import React from 'react'
import Checkmark from './Checkmark'
import { ReactComponent as Emoji1 } from '../emoji1.svg'

function Quest() {
  return (

    <div className="questToken">

      <div className="flexLeft" style={{marginLeft: '30px', position: 'relative'}}>

        <div className={"ribbon" + " " + "ribbon-top-left" + " " + "ribbonScale"}>
          <span>
            COMPLETED
            </span>
        </div>

        <Emoji1 />

        <div style={{marginLeft: "20px"}}>
          Login to Book Buddy: 0/1
        </div>

      </div>
                
      <div className="flexRight" style={{marginRight: '30px'}}>

        <div className="flexRight">

          <div>
            <Checkmark />
          </div>
                       
        </div>
                    
      </div>

    </div>

  
  )
}

export default Quest