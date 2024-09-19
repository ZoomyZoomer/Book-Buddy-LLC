import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import check from "../check.mp3"

function Checkmark() {
    const [isChecked, setIsChecked] = useState(false);

    const playCheck = () => {
        setTimeout(() => {
            const audio = new Audio(check);
            audio.volume = 0.3;
            audio.play();
        }, 700);
        
    };

    return (
        <div className="flexMiddle" style={{position: 'relative'}}>
            <svg className={isChecked ? 'checkmark' : ''} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className={isChecked ? "checkmark__circle" : ''} cx="26" cy="26" r="25" fill="none"/>
                <path className={isChecked ? "checkmark__check" : ''} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            {!isChecked && (
                <div className={"emptyCheckBox" + " " + "flexMiddle" } onClick={() => {playCheck(); setIsChecked(true);}}>
                    <div className="checkStar" style={{marginTop: '5px'}}>
                        <FontAwesomeIcon icon={faStar} color="#7ac142" />
                    </div>
                </div>
            )}
        </div>
    );
}
export default Checkmark