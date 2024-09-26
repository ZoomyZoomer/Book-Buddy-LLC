import React, { useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as Logo } from '../logo.svg';
import { useEffect, useContext } from 'react';
import { UserContext } from '../components/UserContext';


function LoginPage() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const response = await axios.get('/api/profile', {
              withCredentials: true,
            });
            setUserInfo(response.data.user);

            if (response.data.user){
            
            }
            
          } catch (e) {
            console.log(e);
          }
        };
    
        fetchProfile();
      }, []);

    async function submit(e){

        e.preventDefault();

        try {
            const response = await axios.post("/api/signin", {
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.status === 200) {
                console.log("Login successful");
                navigate('/library');
            } else {
                alert("Login failed");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Login failed. Please try again.");
        }

    }


  return (
    <div className="loginGrid">

        <div style={{marginBottom: '-30px'}}>
            <div className="flexMiddle" style={{marginBottom: '-20px'}}>
                <Link id="home" to="/"style={{transform: 'scale(0.8)', cursor: 'pointer'}}>
                    <Logo />
                </Link>
            </div>

            <div className="flexMiddle">
                <h1 style={{fontSize: '26px', fontWeight: '200', color: '#06ab78'}}>
                    Sign in to <strong>Book Buddy</strong>
                </h1>
            </div>
        </div>

       

            <form className="loginGrid" action="POST">

            <div className="loginContainer">
                <div style={{fontWeight: '400', fontSize: '14px'}}>
                    Username or email address
                </div>

                <input className="inputBox" type="username" style={{marginBottom: '25px'}} onChange={(e) => {setUsername(e.target.value)}}></input>

                <div className="flexMiddle" style={{fontWeight: '400', fontSize: '14px'}}>

                    <div style={{display: 'flex', justifyContent: 'left', width:'214px'}}>
                        Password
                    </div>

                    <a href="mailto:kcw90@scarletmail.rutgers.edu?subject=Password%20Reset%20Request&body=Body%20Here" className="flexRight" style={{fontSize: '12px', color: '#0969da', cursor: 'pointer'}}>
                        Forgot password?
                    </a>
                
                </div>

                <input className="inputBox" type="password" style={{marginBottom: '25px'}} onChange={(e) => {setPassword(e.target.value)}}></input>

                <div className="flexMiddle">
                    <button className={"submitButton"} type="submit" onClick={submit}>
                        Log in
                    </button>
                </div>
            </div>

            </form>

            <div className="flexMiddle">
                <div className="newUserContainer">

                    <div className="flexMiddle" style={{fontSize: '12px'}}>
                        Can't sign in? - <a href="mailto:kcw90@scarletmail.rutgers.edu?subject=Password%20Reset%20Request&body=Body%20Here" className="clickLink" style={{marginLeft: '5px'}}>Contact us</a>
                    </div>

                    <div className="flexMiddle">

                        <div className="circle" />
                        <div className="separator" />
                        <div className="circle" />

                    </div>

                    <div className="flexMiddle" style={{fontSize: '12px', marginTop: '5px'}}>
                        New users can <Link id="register" to="/register" className="clickLink" style={{marginLeft: '5px', textDecoration: 'none'}}> Create an account</Link>
                    </div>

                </div>
            </div>


    </div>
  )
}

export default LoginPage