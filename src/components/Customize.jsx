import React, { useState } from 'react'
import '../customize_styles.css'
import {ReactComponent as ExpandRight} from '../expandRight.svg'

export default function Customize() {

    const [isCustomizing, setIsCustomizing] = useState(false);

    const handle_customize = () => {
        if (!isCustomizing){
            document.getElementById("stats_section").style.width = "45%";
            document.getElementById("book_section").style.width = "55%";
            document.getElementById("books_container").style.gridTemplateColumns = "1fr 1fr";
            setIsCustomizing(true)
        } else {
            document.getElementById("stats_section").style.width = "20%";
            document.getElementById("book_section").style.width = "80%";
            document.getElementById("books_container").style.gridTemplateColumns = "1fr 1fr 1fr";
            setIsCustomizing(false);
        }
    }

  return (
    <div className={isCustomizing ? "customize_tab_active" : "customize_tab"} onClick={() => {handle_customize()}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <img className="stickyNote" src="./stickyNotes.png" />
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <ExpandRight />
        </div> 
    </div>
  )
}
