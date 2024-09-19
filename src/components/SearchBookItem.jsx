import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import RatingStatic from './RatingStatic'
import RatingFluid from './RatingFluid'
import {ReactComponent as ThreeDots} from '../threeDots.svg'

const SearchBookItem = ({title, author, cover, genre}) => {



  return (
    <>
    

        <div className="bookitem_container">

        <div className="book_cover">
          <img src={cover} draggable="false" />
        </div>
          <div className="book_contents">

            <div className="book_title">
              {title}
            </div>
            <div className="book_author">
              {author}
            </div>


          </div>
          
        </div>


      
    </>
  )
}

export default SearchBookItem