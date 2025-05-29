import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import LeftMenu from "../buttons_items/LeftMenu";
import SearchButton from "../buttons_items/SearchButton";
import Profile from "../buttons_items/Profile";
import './UserVideoList.css';
import VideoItem from '../videos/VideoItem';

function UserVideoList({currentUser , setUser}) {
    console.log("öpoppop")
    const { userName } = useParams();
    const [mode, setMode] = useState(0);
    const changMode = () => {
        if (!mode) {
            setMode(1);
        } else {
            setMode(0);
        }
    }

    console.log("first")
    const [videoList, setList] = useState([]);

    useEffect(() => {
        console.log('use effect is called');
        const userVideos = async () => {
            console.log('user videos is called')
            try {
                const currToken = sessionStorage.getItem('token');
                const response = await fetch(`http://localhost:90/api/users/${userName}/videos`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${currToken}`,
                    },
                });


                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const videos = data.videos
                const user = data.user
                setList(videos);
                setUser(user)
                console.log(videos);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
        userVideos();

    }, [setList]);

console.log("1000")
    return (
        <div id="general" className={mode ? "container-fluid videosScreen bg-dark" : "container-fluid videosScreen bg-lightk"} >
            <button id='mode' onClick={changMode} className={mode ? 'mode btn btn-light' : 'mode btn btn-dark'}>{mode ? 'light' : 'dark'} </button>
            <div className="row justify-content-center" data-bs-theme={mode ? 'dark' : 'light'}>
                <div className="col-12">
                    <SearchButton />
                </div>
                <div className="col-12">
                    <Profile currentUser={currentUser} />
                </div>
                <div className="col-md-2 left-menu-container">
                    <LeftMenu currentUser={currentUser} setUser={setUser} />
                </div>
                <h1 id = "list" className="mb-4 text-center">{userName}'s videos</h1>
                <div className="col-md-10 offset-md-2 video-items-container">
                    <div className="row">
                        {console.log(videoList)}  {videoList.length > 0 ? videoList.map((videoItem) => (
                            <div className="col-md-4 mb-4">
                                <VideoItem {...videoItem} />
                            </div>
                        )) : "not found"}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserVideoList;
