import React, { useState, useEffect } from 'react';
import LeftMenu from "../buttons_items/LeftMenu";
import SearchButton from "../buttons_items/SearchButton";
import Profile from "../buttons_items/Profile";
import './videosScreen.css'; 
import VideoItem from '../videos/VideoItem';

function VideosScreen({ currentUser , setUser}) {
    console.log('VideosScreen is called')
    //console.log(videosList);
    const [mode, setMode] = useState(0);
    const changMode = () => {
            if(!mode) {
        setMode(1);
    } else {
        setMode(0);
    }
    }

    const [videoList, setList] = useState([])
    useEffect( () => {
       
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
                        const videos = data.videos
                        console.log(data.videos)
                        setUser(user);
                        console.log(videoList);
                        setList(videos);
                        console.log(videoList);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchDeafult = async () => {
            console.log("jkjkj")
            try {
                    const response = await fetch('http://localhost:90/api/videos', {
                        method: 'GET',
                    });
    
                    console.log("plplp")
                        const data = await response.json();
                        const videos = data.videos
                        console.log(videoList);
                        setList(videos);
                        console.log(videoList);
                
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const savedToken = sessionStorage.getItem('token');
        console.log(savedToken)
        if (savedToken) {
            //setToken(savedToken);
              fetchUser();  
        } else {
            console.log("909000")
             fetchDeafult();
        }

        
    }, [setUser, setList]);


  

    console.log(videoList);
    return (
        <div id = "general" className= {mode ? "container-fluid videosScreen bg-dark" : "container-fluid videosScreen bg-lightk"} >
            <button id='mode' onClick={changMode} className={mode ? 'mode btn btn-light' : 'mode btn btn-dark'}>{mode ? 'light' : 'dark'} </button>
            <div className="row justify-content-center" data-bs-theme = {mode ? 'dark' : 'light'}>
                <div className="col-12">
                    <SearchButton />
                </div>
                <div className="col-12">
                    <Profile currentUser={currentUser}/>
                </div>
                <div className="col-md-2 left-menu-container">
                    <LeftMenu currentUser={currentUser} setUser={setUser}/>
                </div>
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

export default VideosScreen;
