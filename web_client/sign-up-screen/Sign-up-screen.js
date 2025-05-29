import { useNavigate } from 'react-router-dom';
import { ReactComponent as YouTubeLogo } from '../YouTube-Logo.wine.svg';
import './sign-up-screen.css';
import React from 'react';
import { useState, useRef } from 'react';

function SignUpScreen({ }) {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const userNameRef = useRef(null);
    const passwordRef = useRef(null);
    const verifyPasswordRef = useRef(null);
    const nickNameRef = useRef(null);
    const profilePictureRef = useRef(null);

    const AddUserReact = async () => {
        const userName = userNameRef.current.value;
        const password = passwordRef.current.value;
        const verifyPassword = verifyPasswordRef.current.value;
        const nickName = nickNameRef.current.value;
        const picture = profilePictureRef.current.files[0];
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result;
            const requestBody = {
                userName,
                password,
                verifyPassword,
                nickName,
                profilePicture: base64String,
            };

            try {
                const response = await fetch('http://localhost:90/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                const data = await response.json();
                if (response.ok) {
                    navigate('/log-in');
                } else {
                    setErrorMessage(data.error);
                }
            } catch (error) {
                console.log('catch')
                console.error('Error:', error);
                setErrorMessage('Something went wrong, please try again.');
            }
        };

        if (picture) {
            reader.readAsDataURL(picture);
        }
    };

    return (
        <div className="SignUpScreen">
            <div className="logo-container">
                <YouTubeLogo className="youtube-logo" />
            </div>
            <span id='big'> Welcome!</span>
            <span id='little'>Please fill in the following details to enjoy our videos</span>
            <div className="col g-3">
                <div className="col">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="First name"
                        aria-label="First name"
                        ref={userNameRef}
                    />
                </div>
                <div className="col">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="password"
                        aria-label="Password"
                        ref={passwordRef}
                    />
                    <small className="password-hint">Must be 8-20 characters long, include a-z, A-Z, 1-9.</small>
                </div>
                <div className="col">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="verify password"
                        aria-label="Verify password"
                        ref={verifyPasswordRef}
                    />
                </div>
                <div className="col">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="nick name"
                        aria-label="Nick name"
                        ref={nickNameRef}
                    />
                </div>
                <div className="mb-3">
                    <input
                        className="form-control photo-upload"
                        type="file"
                        id="formFile"
                        accept="image/*"
                        ref={profilePictureRef}
                    />
                </div>
            </div>

            <button className='btn btn-danger' onClick={AddUserReact}>sign up</button>
            {errorMessage && (<p className="error"> {errorMessage} </p>)}
        </div>
    );
}

export default SignUpScreen;
