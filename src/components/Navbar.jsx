import React, { useContext, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { ReactComponent as MySlash } from '../slash.svg'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'



function Navbar() {

  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:4000/profile', {
          withCredentials: true,
        });
        setUserInfo(response.data.user);
      } catch (e) {
        console.log(e);
      }
    };

    fetchProfile();
  }, []);

  async function logout() {


    try {

      await axios.post('http://localhost:4000/logout');

      setUserInfo('');
      navigate('/');

    } catch(e){
      console.log(e);
    }

  }
  console.log(userInfo.username);

  return (
    <>
    <div className="navBar" style={{marginTop: '10px'}}>

      <div className="flexLeft">
        <div className="optionsGear">
          <FontAwesomeIcon icon={faGear} size="lg" color='#969696' style={{marginLeft: '40px', cursor: 'pointer'}}/>
        </div>
      </div>
     
      <div className="flexMiddle">

        <div className="unactiveBlack">
          <div>
            REWARDS
          </div>
          
        </div>

        <MySlash />

        <div className="unactiveBlack">
          <div>
            ROBOT
          </div>
        </div>

        <MySlash />

        <div className="activeGreen">
          <div>
            HOME
          </div>
        </div>

        <MySlash />

        <div className="unactiveBlack">
          <Link className="unactiveBlack" to="/bookshelf">
            BOOKSHELF
          </Link>
        </div>

        <MySlash />
        
        <div className="unactiveBlack">
          <div>
            TIMER
          </div>
        </div>


      </div>

      <div className="flexRight" style={{width: '100%'}}>

        <div className="flexRight" style={{marginRight: '40px'}}>
          {(Object.keys(userInfo).length <= 0) && 
          <Link id="signin" to="/signin">
            <button className="loginButton" style={{ fontSize: '12px', fontWeight: 'bold', cursor: 'pointer'}}>
              SIGN IN
            </button>
          </Link>
          }
          {(Object.keys(userInfo).length > 0) && 
            <button className="loginButton" onClick={logout} style={{ fontSize: '12px', fontWeight: 'bold', cursor: 'pointer'}}>
              LOG OUT
            </button>
          }

            <FontAwesomeIcon 
                icon={faUser} size="xl" 
                style={{color: "#06ab78", marginLeft: '10px', cursor: 'pointer'}}
            />
        </div>

      </div>

        



        
    </div>
    </>
  )
}

export default Navbar