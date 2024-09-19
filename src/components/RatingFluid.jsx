import React, { useEffect } from 'react'
import { useState } from 'react'
import { ReactComponent as StarFull } from '../starFull.svg'
import { ReactComponent as StarEmpty } from '../starEmpty.svg'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const RatingFluid = ({ tabName, volumeId, username, book_name, fluidRating, setUpdatedRating}) => {

    const [ratingValue, setRatingValue] = useState(0);
    const [userInfo, setUserInfo] = useState({});

    const navigate = useNavigate('/');

   
    const handle_change = async() => {

      try{
        await axios.post('http://localhost:4000/updateRating',{
          tab_name: tabName,
          volume_id: volumeId,
          rating: ratingValue,
          username: username,
          book_name: book_name
        })

        setUpdatedRating(prev => !prev);
        fluidRating(false);

      } catch(e) {
        console.error({error: e});
      }
    }


  return (
    <div style={{display: 'flex'}}>
        <div className="flexMiddle" onMouseOver={() => setRatingValue(1)} onMouseOut={() => setRatingValue(0)} onClick={() => handle_change()}>
            {ratingValue >= 1 ? <StarFull /> : <StarEmpty />}
        </div>
        <div className="flexMiddle" onMouseOver={() => setRatingValue(2)} onMouseOut={() => setRatingValue(0)} onClick={() => handle_change()}>
            {ratingValue >= 2 ? <StarFull /> : <StarEmpty />}
        </div>
        <div className="flexMiddle" onMouseOver={() => setRatingValue(3)} onMouseOut={() => setRatingValue(0)} onClick={() => handle_change()}>
            {ratingValue >= 3 ? <StarFull /> : <StarEmpty />}
        </div>
        <div className="flexMiddle" onMouseOver={() => setRatingValue(4)} onMouseOut={() => setRatingValue(0)} onClick={() => handle_change()}>
            {ratingValue >= 4 ? <StarFull /> : <StarEmpty />}
        </div>
        <div className="flexMiddle" onMouseOver={() => setRatingValue(5)} onMouseOut={() => setRatingValue(0)} onClick={() => handle_change()}>
            {ratingValue >= 5 ? <StarFull /> : <StarEmpty />}
        </div>
    </div>
  )
}

export default RatingFluid