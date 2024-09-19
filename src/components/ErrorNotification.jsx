import React, { useEffect } from 'react'
import '../errorNotifStyles.css'
import {ReactComponent as Warning} from '../warning.svg'

const ErrorNotification = ({errorRef, setShowError}) => {

    useEffect(() => {
        setTimeout(() => {
            setShowError(false);
        }, 3500)   
    })

  return (
    <div className='error-notif-container'>
        
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Warning />
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'left', marginLeft: '0.8rem'}}>
                <div className='enc-0'>{errorRef.current?.title}</div>
                <div className='enc-1'>{errorRef.current?.message}</div>
            </div>
        </div>
        <div className='enc-bar'/>
    </div>
  )
}

export default ErrorNotification