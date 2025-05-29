import { useNavigate } from 'react-router-dom';
import { ReactComponent as YouTubeLogo } from '../YouTube-Logo.wine.svg';
import './EditUser.css';
import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import LeftMenu from '../buttons_items/LeftMenu';
import Profile from '../buttons_items/Profile';

function EditUser({ currentUser, token, setToken, setUser }) {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const userNameRef = useRef(null);
    const passwordRef = useRef(null);
    const verifyPasswordRef = useRef(null);
    const nickNameRef = useRef(null);
    const profilePictureRef = useRef(null);

    const [mode, setMode] = useState(0);
    const changMode = () => {
        if (!mode) {
            setMode(1);
        } else {
            setMode(0);
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currToken = sessionStorage.getItem('token');
                const response = await fetch('http://localhost:90/api/current', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${currToken}`,
                    },
                });

                const data = await response.json();
                const user = data.user
                console.log(data.videos)
                setUser(user);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUser()
    }, []);

    const EditUserReact = async () => {
        const userName = userNameRef.current.value;
        const password = passwordRef.current.value;
        const verifyPassword = verifyPasswordRef.current.value;
        const nickName = nickNameRef.current.value;
        const picture = profilePictureRef.current.files[0];

        const handleFetchRequest = async (base64String) => {
            const requestBody = {
                userName,
                password,
                verifyPassword,
                nickName,
                profilePicture: base64String,
            };

            try {
                const currToken = sessionStorage.getItem('token');
                const response = await fetch(`http://localhost:90/api/users/${currentUser.userName}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${currToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                const data = await response.json();
                if (response.ok) {
                    setToken(data.token);
                    sessionStorage.setItem('token', data.token);
                    setUser(data.user);
                    navigate('/');
                } else {
                    setErrorMessage(data.error);
                }
            } catch (error) {
                console.error('Error:', error);
                setErrorMessage('Something went wrong, please try again.');
            }
        };

        if (picture) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                handleFetchRequest(base64String);
            };
            reader.readAsDataURL(picture);
        } else {
            handleFetchRequest(null);
        }
    };

    const DeleteUserReact = async () => {
        console.log('DeleteUserReact called');
        const userName = userNameRef.current.value;
        const requestBody = {
            userName
        };

        try {
            console.log('DeleteUserReact try');
            const response = await fetch(`http://localhost:90/api/users/${currentUser.userName}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            if (response.ok) {
                sessionStorage.removeItem('token')
                setUser(null);
                navigate('/');
            } else {
                setErrorMessage(data.error);
            }
        } catch (error) {
            console.log('DeleteUserReact catch');
            console.error('Error:', error);
            setErrorMessage('Something went wrong, please try again.');
        }
    };

    return (

        <div className={mode ? "EditUser bg-dark" : "EditUser bg-light"}>
            <div className="logo-container">
                <YouTubeLogo className="youtube-logo" />
            </div>
            <button id='mode' onClick={changMode} className={mode ? 'mode btn btn-light' : 'mode btn btn-dark'}>{mode ? 'light' : 'dark'} </button>
            <Profile currentUser={currentUser} />
            <div className="row justify-content-center">
                <div className="col-md-2 left-menu-container">
                    <LeftMenu currentUser={currentUser} setUser={setUser} />
                </div>
            </div>
            <span id='big'> Edit details</span>
            <span id='little'>Please fill in the following details inorder to update your details</span>
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

            <div className="button-container" style={{ display: 'flex', gap: '10px' }}>
                <button className='btn btn-primary' onClick={EditUserReact}>Update</button>
                
                <button className='btn btn-danger' onClick={DeleteUserReact}>Delete User</button>
            </div>
            {errorMessage && (<p className="error"> {errorMessage} </p>)}
        </div>
    );
}

export default EditUser;
