import React from 'react'

const GoogleSignIn = () => {

    const handleSignInClick = () => {
        const clientId = '511471509653-1ealvmjfb3tj7lpu15b01n2fd0g7o0tm.apps.googleusercontent.com';
        const redirectUri = 'http://localhost:3000/auth'; // Change to your redirect URI
        const scope = 'email profile'; // Permissions you need
        const state = 'random_state_string'; // Optionally include a state parameter

        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
            redirectUri
        )}&scope=${encodeURIComponent(scope)}&state=${state}`;

        window.location.href = googleAuthUrl; // Redirect to Google Sign-In
    };

    return (
        <button className='sign-in-google' onClick={handleSignInClick}>
            <img src='/google-icon.png' style={{height: '1.8rem', marginRight: '0.2rem'}}/> Sign in with Google
        </button>
    );
};

export default GoogleSignIn;
