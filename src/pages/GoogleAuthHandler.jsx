import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const GoogleAuthHandler = () => {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({ email: '', name: '' });
    let mutex = false;

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    code: code,
                    client_id: '511471509653-1ealvmjfb3tj7lpu15b01n2fd0g7o0tm.apps.googleusercontent.com',
                    client_secret: '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',
                    redirect_uri: 'https://book-buddy-app.com/auth',
                    grant_type: 'authorization_code',
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log('Tokens:', data);

                    // Fetch user info
                    return fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
                        headers: { Authorization: `Bearer ${data.access_token}` },
                    });
                })
                .then((res) => res.json())
                .then(async(userInfo) => {
                    
                    if (!mutex){

                        mutex = true;

                        // Set email and name in state
                        setUserDetails({ email: userInfo.email, name: userInfo.name });

                        const res = await axios.get('/api/google-login', {
                            params: {
                                email: userInfo.email,
                                name: userInfo.name
                            }
                        })

                        if (res.data === 1){
                            navigate('/library');
                        } else if (res.data === 0){
                            navigate('/register', {state: {auth_email: userInfo.email}});
                        } else if (res.data === 2){
                            navigate('/signin');
                        }

                    }

                })
                .catch((error) => {
                });
        } else {
            console.error('No code found in URL');
            navigate('/error'); // Handle missing code
        }
    }, [navigate]);

    return (
        <div>
            <h2>Authenticating...</h2>
            {userDetails.email && userDetails.name && (
                <div>
                    <p>Email: {userDetails.email}</p>
                    <p>Name: {userDetails.name}</p>
                </div>
            )}
        </div>
    );
};

export default GoogleAuthHandler;
