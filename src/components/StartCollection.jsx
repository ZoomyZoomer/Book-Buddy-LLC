import React from 'react'
import { useNavigate } from 'react-router-dom'

const StartCollection = ({tab, setIsAddingBook}) => {

    const navigate = useNavigate('/');

  return (
    <div className='startCollection-container'>
        <div className='startCollection-text'>
          <div className='sc-0'>Start your collection</div>
          <div className='sc-1'>From a wide variety of books, see what peaks your interest</div>
          <button className='sc-2' onClick={() => setIsAddingBook(true)}>Add a book</button>
        </div>
        <div className='kat-container'>
            <img src='/kitty_think.png' className='kat'/>
        </div>
    </div>
  )
}

export default StartCollection