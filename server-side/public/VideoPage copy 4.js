import LeftMenu from "../buttons_items/LeftMenu";
import SearchButton from "../buttons_items/SearchButton";
import Profile from "../buttons_items/Profile";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import './VideoPage.css';
import { useEffect, useState, useRef } from "react";
import Comment from "./Comment";
import React from 'react';

function VideoPage({ currentUser, setUser }) {

    const navigate = useNavigate()
    const location = useLocation();
    const viewsUpdate = location.state ? location.state.viewUpdate : 90;
    const [video, setVideo] = useState();
    const { id } = useParams();

    useEffect(() => {

        const fetchVideo = async () => {
            try {
                const currToken = sessionStorage.getItem('token');
                const response = await fetch(`http://localhost:90/api/videos/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${currToken}`,
                    },
                });
                const data = await response.json();
                const video = data.video
                const user = data.user
                setVideo(video);
                setUser(user)
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
        fetchVideo();
    }, [id])


    let VideoComments = [];
    const nick = currentUser ? currentUser.nickName : '';
    video ? VideoComments = video.comments : VideoComments = [];
    const [comments, setComment] = useState([]);

    useEffect(() => {
        setComment(VideoComments);
    }, [VideoComments]);

    const commentRef = useRef(null);

    const addComment = (event) => {
        event.preventDefault();


        if (!currentUser) {
            return;
        }
        const comment = commentRef.current.value.trim();

        fetchEdit("addComment", comment)
        commentRef.current.value = "";

    }

    const addLike = () => {
        if (!currentUser) {
            return;
        }

        fetchEdit("likes", 0)
    };


    const [mode, setMode] = useState(0);
    const changMode = () => {
        if (!mode) {
            setMode(1);
        } else {
            setMode(0);
        }
    }

    const deleteVideo = async () => {
        if (!currentUser || currentUser.userName != video.userName) {
            return;
        } else {
            try {
                const currToken = sessionStorage.getItem('token');
                const response = await fetch(`http://localhost:90/api/videos/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${currToken}`,
                    },
                });
                if (response.status == 200) {
                    navigate('/');
                } else {
                    const error = await response.json();
                }


            } catch (error) {
                console.error('Error fetching user data:', error);
            }

        }
    }

    const [edit, setEdit] = useState(0);
    const newNameRef = useRef(null)
    const newFileRef = useRef(null)
    const newImageRef = useRef(null)
    const newDesRef = useRef(null)
    const editVideoName = () => {
        if (edit) {
            const newName = newNameRef.current.value;
            fetchEdit("title", newName);
            setEdit(0);
        } else {
            setEdit(1);
        }
    }

    const [editDes, setEditDes] = useState(0);
    const editDesc = () => {
        if (editDes) {
            const newDes = newDesRef.current.value;
            fetchEdit("description", newDes)
            setEditDes(0);
        } else {
            setEditDes(1);
        }
    }


    const [editVid, setEditVid] = useState(0);
    const editVideo = async () => {
        if (editVid) {
            const newFile = newFileRef.current.files[0];
            const formData = new FormData();
            formData.append('change', newFile);
            formData.append('key', "file");
            const fileReader = new FileReader();
            /*
            const response = await fetch(`http://localhost:90/api/videos/${id}`, {
                method: 'PUT',
                headers: {
                      'Authorization': `Bearer ${currToken}`
                },
                body: formData
            });*/


            fileReader.addEventListener(
                "load",
                () => {
                    const fileDataUrl = fileReader.result;
                    fetchEdit("file", formData)
                },
                false,
            );
            if (newFile) {
                fileReader.readAsDataURL(newFile);
            }
            setEditVid(0);

        } else {
            setEditVid(1);
        }
    }

    const [editImg, setEditImg] = useState(0);
    const editImage = () => {
        if (editImg) {
            const newImage = newImageRef.current.files[0];

            const imageReader = new FileReader();
            imageReader.addEventListener(
                "load",
                () => {
                    const imageDataUrl = imageReader.result;
                    fetchEdit("image", imageDataUrl)
                },
                false,
            );
            if (newImage) {
                imageReader.readAsDataURL(newImage);
            }
            setEditImg(0);
            console.log(newImage)
            navigate('/')
        } else {
            setEditImg(1);
        }
    }

    const fetchEdit = async (key, change) => {
        const k = key
        const c = change
        try {
            const currToken = sessionStorage.getItem('token');
            console.log(key + change)
            const response = await fetch(`http://localhost:90/api/videos/${id}`, {
                method: 'PUT',
                headers: 
                    k === 'file' ? {  'Authorization': `Bearer ${currToken}`, } : {'Content-Type': 'application/json', 'Authorization': `Bearer ${currToken}` },
                body: k === "file" ? change : JSON.stringify({
                    key: k,
                    change: c,
                }),
            });

            const data = await response.json();
            const video = data.video
            setVideo(video);
            setComment(video.comments)
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    return (
        video ?
            <div className={mode ? "videoPage container-fluid bg-dark" : "videoPage container-fluid bg-light"} >
                <button id='mode' onClick={changMode} className={mode ? 'mode btn btn-light' : 'mode btn btn-dark'}>{mode ? 'light' : 'dark'} </button>
                <div className="container-fluid">
                    <SearchButton />
                    <Profile currentUser={currentUser} />
                    <div className="row justify-content-center">
                        <div className="col-md-2 left-menu-container">
                            <LeftMenu currentUser={currentUser} setUser={setUser} />
                        </div>
                        <div className="video-display-container" data-bs-theme={mode ? 'dark' : 'light'}>

                            <nav className="bg-body-tertiary">
                                <div className="container-fluid">
                                    {edit ? <textarea className="form-control navbar-brand" id="commentInput" rows="3" ref={newNameRef}>{video.name}</textarea> : <span className="navbar-brand mb-0 h1">{video.nameVideo}</span>}
                                    {currentUser ? <button className="editB btn bt-sm btn-outline-info d-flex-right " onClick={editVideoName}>
                                        <i className="bi bi-pen"></i></button> : <span></span>}
                                </div>
                            </nav>

                            <div className="video-wrapper ratio ratio-16x9">
                                <video controls>
                                    <source src={video.file} type="video/mp4" />
                                </video>
                            </div>
                            <div>
                                <nav className="navbar bg-body-tertiary">
                                    <div className="container-fluid">
                                        <Link className="linkUserVideoList" to={`/UserVideoList/${video.userName}`}>
                                            <nav className="navbar-brand mb-0 h1">
                                                <img src={video.uploaderPic} style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
                                                {video.nickName}
                                            </nav>
                                        </Link>
                                        {editVid ? <div className="mb-3">
                                            <input className="form-control" type="file" id="formFile" ref={newFileRef}></input>
                                            <button className="editB btn bt-sm btn-outline-info d-flex-right" onClick={editVideo}>
                                                <i className="bi bi-pen"></i></button>
                                        </div> : <span></span>}
                                        {editImg ? <div className="mb-3">
                                            <input class="form-control" type="file" id="formFile" ref={newImageRef}></input>
                                            <button className="editB btn bt-sm btn-outline-info d-flex-right" onClick={editImage}>
                                                <i className="bi bi-pen"></i></button>
                                        </div> : <span></span>}
                                        {currentUser && editVid === 0 && editImg === 0 ? <div className="dropdown">
                                            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                edit Video
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li><button className="dropdown-item" onClick={editVideo}>edit file</button></li>
                                                <li><button className="dropdown-item" onClick={editImage}>edit image</button></li>
                                            </ul>
                                        </div> : <span></span>}
                                        <button onClick={deleteVideo} className="btn btn-outline-danger btn-sm ">delete video</button>
                                    </div>
                                </nav>
                            </div>
                            <ul className="list-group list-group-horizontal">

                                <button className="list-group-item btn btn-light d-flex flex-column align-items-center p-3 custom-width" onClick={addLike}>
                                    {currentUser && video.usersLikes.some(user => user === currentUser.userName) ?
                                        <i id="myIcon" className="bi bi-hand-thumbs-up-fill mb-1"></i>
                                        : <i id="myIcon" className="bi bi-hand-thumbs-up mb-1"></i>}
                                    {video.likes} Like
                                </button>
                                <div className="dropdown">
                                    <button className="list-group-item btn btn-light d-flex flex-column align-items-center dropdown-toggle p-3 custom-width" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="bi bi-share mb-1"></i>
                                        Share
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item" href="#">whatapp</a></li>
                                        <li><a className="dropdown-item" href="#">facebook</a></li>
                                    </ul>
                                </div>
                                <button className="list-group-item btn btn-light d-flex flex-column align-items-center p-3 custom-width">
                                    <i className="bi bi-eye mb-1"></i>
                                    {video.views} Views
                                </button>

                            </ul>
                            <div className="container-fluid">
                                <nav className="navbar bg-body-tertiary">

                                    <span className="navbar-brand float-left">Upload Date: {video.date}</span>

                                </nav>

                                <nav className="navbar bg-body-tertiary">
                                    {editDes ? <textarea className="form-control navbar-brand" id="commentInput" rows="3" ref={newDesRef}>{video.description}</textarea> : <span className="description navbar-brand float-left">{video.description}</span>}
                                    {currentUser ? <button className="editB btn bt-sm btn-outline-info d-flex-right " onClick={editDesc}>
                                        <i className="bi bi-pen"></i></button> : <span></span>}

                                </nav>
                            </div>
                            <div className="comments">
                                <form onSubmit={addComment}>
                                    <label className="form-label"></label>
                                    <textarea className="form-control" id="commentInput" rows="3" ref={commentRef}></textarea>
                                    <button type="submit" className="btn btn-primary" >Submit</button>
                                </form>
                            </div>
                            {
                                comments && comments.map((comment) =>
                                    <Comment {...comment} currentUser={currentUser} video={video} setVideo={setVideo} comments={comments} setComments={setComment} editComments={fetchEdit} />
                                )
                            }
                        </div>
                    </div>
                </div>

            </div> : "Video not found"
    );
}
export default VideoPage;