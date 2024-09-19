import React, { useEffect } from 'react'
import { ReactComponent as StarFull } from '../starFull.svg'
import { ReactComponent as StarEmpty } from '../starEmpty.svg'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RatingFluid from './RatingFluid';


const RatingStatic = ({volumeId, rating}) => {

  return (
    <div style={{display: 'flex', width: 'fit-content'}}>
        <div className="flexMiddle" >
            {rating >= 1 ? <StarFull /> : <StarEmpty />}
        </div>
        <div className="flexMiddle" >
            {rating >= 2 ? <StarFull /> : <StarEmpty />}
        </div>
        <div className="flexMiddle" >
            {rating >= 3 ? <StarFull /> : <StarEmpty />}
        </div>
        <div className="flexMiddle" >
            {rating >= 4 ? <StarFull /> : <StarEmpty />}
        </div>
        <div className="flexMiddle" >
            {rating >= 5 ? <StarFull /> : <StarEmpty />}
        </div>
    </div>
  )
}

export default RatingStatic