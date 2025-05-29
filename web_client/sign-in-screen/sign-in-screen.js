import { ReactComponent as YouTubeLogo } from '../YouTube-Logo.wine.svg';
import React, { useState, useRef } from 'react';
import './sign-in-screen.css';
import { Link, useNavigate } from 'react-router-dom';

function SignInScreen({ userList, currentUser, setUser, setToken }) {
    const userNameRef = useRef(null);
    const passwordRef = useRef(null);

    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const isUserRegister = async () => {
        const userName = userNameRef.current.value;
        const password = passwordRef.current.value;

        try {
            const result = await fetch('http://localhost:90/api/tokens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: userName,
                    password: password,
                }),
            });

            const data = await result.json();

            if (result.status === 200) {
                const move = await fetch(`http://localhost:90/api/users/${userName}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                    },
                });

                const user = await move.json();

                if (user) {
                    setUser(user);
                    setToken(data.token);
                    sessionStorage.setItem('token', data.token);
                    console.log(sessionStorage.getItem('token') + "((((")
                    navigate('/');
                } else {
                    setErrorMessage('User name or password incorrect');
                }
            } else {
                console.log("else")
                setErrorMessage(data.error);
            }
        } catch (err) {
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className='Sign-in-screen d-flex flex-column align-items-center'>
            <YouTubeLogo />
            <div className="col g-3">
                <div className="col">
                    <input
                        type="text"
                        className="form-control"
                        placeholder='User Name'
                        ref={userNameRef}
                    />
                </div>
                <div className="col">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        ref={passwordRef}
                    />
                </div>
            </div>
            <button onClick={isUserRegister} type="button" className="btn btn-danger">log in</button>
            <span>Don't have an account?</span>
            <Link to={`/sign_up`}>sign up</Link>
            {errorMessage && (<p className="error"> {errorMessage} </p>)}
        </div>
    );
}

export default SignInScreen;
