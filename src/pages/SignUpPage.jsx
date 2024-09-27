import React, { useContext, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as Logo } from '../logo.svg';
import { useEffect } from 'react';

function SignUpPage() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

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

            console.log(userInfo);
            
          } catch (e) {
            console.log(e);
          }
        };
    
        fetchProfile();
      }, []);



    
    async function submit(e){

        e.preventDefault();

        try {
            const response = await axios.post("/api/register", {
                username,
                password,
                email
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.status === 201) {
                alert("Registration successful");
                navigate('/signin');
            } else {
                alert("Registration failed");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Registration failed. Please try again.");
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
                        Register on <strong>Book Buddy</strong>
                    </h1>
                </div>
            </div>
    
           
    
                <form className="loginGrid" action="POST">
    
                <div className="loginContainer">
                    <div style={{fontWeight: '400', fontSize: '14px'}}>
                        Username
                    </div>
    
                    <input className="inputBox" type="username" style={{marginBottom: '25px'}} onChange={(e) => {setUsername(e.target.value)}}></input>

                    <div style={{fontWeight: '400', fontSize: '14px'}}>
                        Email address
                    </div>
    
                    <input className="inputBox" type="email" style={{marginBottom: '25px'}} onChange={(e) => {setEmail(e.target.value)}}></input>
    
    
                    <div className="flexMiddle" style={{fontWeight: '400', fontSize: '14px'}}>
    
                        <div style={{display: 'flex', justifyContent: 'left', width:'314px'}}>
                            Password
                        </div>
                    
                    </div>
    
                    <input className="inputBox" type="password" style={{marginBottom: '25px'}} onChange={(e) => {setPassword(e.target.value)}}></input>
    
                    <div className="flexMiddle">
                        <button className={"submitButton"} type="submit" onClick={submit}>
                            Register
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
                            Existing users can <Link id="signin" to="/signin" className="clickLink" style={{marginLeft: '5px', textDecoration: 'none'}}> Log in</Link>
                        </div>
    
                    </div>
                </div>
    
            
    
    
        </div>
      )
    }

export default SignUpPage