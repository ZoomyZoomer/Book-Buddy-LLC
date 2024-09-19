import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as ErrorIcon } from '../error.svg'

function ErrorPage() {
  return (
    <div className="errorGrid">
        <div className="flexMiddle" style={{marginBottom: '50px'}}>
            <ErrorIcon />
        </div>
        <div className="errorHeading">We couldn't find what you're looking for.</div>
        <div className="errorSubText"> 
            This is a 404 error, so you've either clicked on a bad link or entered an invalid URL.
        </div>
        <div className="errorSubText"> 
            Try going back to the <Link style={{textDecoration: 'underline', color: '#06ab78'}}to='/'>home</Link> page or contact us if this issue persists
        </div>
            
  
    </div>
  )
}

export default ErrorPage