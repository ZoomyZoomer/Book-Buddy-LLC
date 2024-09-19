import React from 'react'
import { useEffect } from 'react';
import {ReactComponent as Warning} from '../warning_icon.svg'
import '../alert.css';

const Alert = ({alert, setShowAlert}) => {

    const {header, message} = alert.current


    useEffect(() => {
        document.getElementById('alert').classList.remove('noalert');

        setTimeout(() => {
            document.getElementById('alert').classList.add('noalert');
            setTimeout(() => {
                setShowAlert(false);
            }, 290)
            
        }, 5000)

    }, [alert])



  return (
    <div id='alert' className='alert-box'>

        <div className='alert-flex'>
            <div className="alert-icon">
                <Warning />
            </div>
            <div className="alert-grid">
                <div className="alert-header">
                    {header}
                </div>
                <div className="alert-message">
                    {message}
                </div>
            </div>
        </div>

        <div className="alert-timer-container">
            <div className="alert-timer"/>
        </div>
        
    </div>
  )
}

export default Alert