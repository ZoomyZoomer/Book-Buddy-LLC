import React, { useContext, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as Logo } from '../logo.svg';
import { useEffect } from 'react';
import '../registerstyles.css';
import RegisterForum_0 from '../components/RegisterForum_0';
import RegisterForum_1 from '../components/RegisterForum_1';
import RegisterForum_2 from '../components/RegisterForum_2';
import RegisterForum_3 from '../components/RegisterForum_3';

function SignUpPage() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const [userInfo, setUserInfo] = useState({});
    const [currPage, setCurrPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);

    const [avid, setAvid] = useState(null);

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

      const handleCircleClick = (num) => {

        if (num <= maxPage) {
            setMaxPage(Math.max(maxPage, currPage));
            setCurrPage(num);
        }

      }


    /*
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
        
        

    }*/


    return (
        <div className="n-register-bg">
    
            
            <section className='n-register-box'>

                <div className='n-register-box2'>

                <div className='n-register-logo-section' onClick={() => navigate('/')}>

                    <img src='/bb-logo.png' style={{height: '2.2rem', width: '2.2rem', cursor: 'pointer'}}/>
                    <div className='logo-title'>BOOK <strong>BUDDY</strong></div>

                </div>

                <div className='n-register-progress-section'>

                    <div className='n-register-progress-box'>

                        <div className={maxPage >= 1 ? 'n-progress-circle_0' : 'n-progress-circle_1'} onClick={() => handleCircleClick(1)}>1</div>
                        <div className={maxPage >= 1 ? 'n-progress-line_0' : 'n-progress-line_1'}/>

                        <div className={maxPage >= 2 ? 'n-progress-line_0' : 'n-progress-line_1'}/>
                        <div className={maxPage >= 2 ? 'n-progress-circle_0' : 'n-progress-circle_1'} onClick={() => handleCircleClick(2)}>2</div>
                        <div className={maxPage >= 2 ? 'n-progress-line_0' : 'n-progress-line_1'}/>

                        <div className={maxPage >= 3 ? 'n-progress-line_0' : 'n-progress-line_1'}/>
                        <div className={maxPage >= 3 ? 'n-progress-circle_0' : 'n-progress-circle_1'} onClick={() => handleCircleClick(3)}>3</div>
                        <div className={maxPage >= 3? 'n-progress-line_0' : 'n-progress-line_1'}/>

                        <div className={maxPage >= 4 ? 'n-progress-line_0' : 'n-progress-line_1'}/>
                        <div className={maxPage >= 4 ? 'n-progress-circle_0' : 'n-progress-circle_1'} onClick={() => handleCircleClick(4)}>4</div>

                    </div>

                </div>

                {(() => {
                    switch (currPage) {
                    case 1:
                        return (
                        <RegisterForum_0
                            setCurrPage={setCurrPage}
                            email={email}
                            setEmail={setEmail}
                            username={username}
                            setUsername={setUsername}
                            password={password}
                            setPassword={setPassword}
                            setMaxPage={setMaxPage}
                            maxPage={maxPage}
                        />
                        );
                    case 2:
                        return (
                        <RegisterForum_1
                            email={email}
                            username={username}
                            password={password}
                            setCurrPage={setCurrPage}
                            currPage={currPage}
                            setMaxPage={setMaxPage}
                            maxPage={maxPage}
                        />
                        )
                    case 3:
                        return (
                        <RegisterForum_2 
                            setMaxPage={setMaxPage}
                            setCurrPage={setCurrPage}
                            avid={avid}
                            setAvid={setAvid}
                            email={email}
                        />
                        )
                    case 4:
                        return (
                        <RegisterForum_3 
                            username={username}
                        />
                        )
                    }
                })()}

                </div>

            </section>
    
        </div>
      )
    }

export default SignUpPage