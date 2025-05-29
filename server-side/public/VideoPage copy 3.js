import LeftMenu from "../buttons_items/LeftMenu";
import SearchButton from "../buttons_items/SearchButton";
import Profile from "../buttons_items/Profile";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import './VideoPage.css';
import { useEffect, useState, useRef } from "react";
import Comment from "./Comment";
import React from 'react';

function VideoPage({ videosList, setNewVideo, currentUser, setUser }) {
    const navigate = useNavigate()
    const location = useLocation();
    const viewsUpdate = location.state ? location.state.viewUpdate : 90;
    const [like, setLike] = useState(0);
    const [video, setVideo] = useState();
    const { id } = useParams();

    useEffect(() => {
        const video = videosList.find((item) => { return item.id == id });
        if (video && currentUser) {
            video.views = viewsUpdate;
        }
        setVideo(video);
    }, [])



    let VideoComments = [];
    const nick = currentUser ? currentUser.nickName : '';
    video ? VideoComments = video.comments : VideoComments = [];
    const [comments, setComment] = useState([]);
    const [maxIdcomm, setMaxIdcomm] = useState(0);
    useEffect(() => {
        if (comments.length > 0) {
            setMaxIdcomm(Math.max(...comments.map(video => video.id)));
        }
    }, [comments]);


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

        const newComment = {
            "nickName": nick,
            "comment": comment,
            "id": maxIdcomm + 1
        }
        console.log(videosList);
        const updatedComments = [...comments, newComment];
        setComment(updatedComments);

        const updateVideo = { ...video, comments: updatedComments };
        setVideo(updateVideo);

        const updatedVideosList = videosList.map(v => v.id === video.id ? updateVideo : v);
        setNewVideo(updatedVideosList);

        commentRef.current.value = "";
    }

    const addLike = () => {
        if (!currentUser) {
            return;
        }
        let nLikes = video ? video.likes : 0;
        var iconElement = document.getElementById('myIcon');
        if (like) {
            nLikes -= 1;
            setLike(0);
            iconElement.className = 'bi bi-hand-thumbs-up mb-1'
        } else {
            nLikes += 1;
            setLike(1);
            iconElement.className = 'bi bi-hand-thumbs-up-fill mb-1';
        }

        const newVideo = { ...video, likes: nLikes };
        setVideo(newVideo);
        const newList = videosList.map(vid => vid.id === video.id ? newVideo : vid);
        setNewVideo(newList);
    };


    const [mode, setMode] = useState(0);
    const changMode = () => {
        if (!mode) {
            setMode(1);
        } else {
            setMode(0);
        }
    }

    const deleteVideo = () => {
        if (!currentUser) {
            navigate('log-in');
        } else {
            const updatedList = videosList.filter(temp => temp.id !== video.id);
            setNewVideo(updatedList);
            navigate('/');
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
            const newVideo = { ...video, nameVideo: newName };
            setVideo(newVideo);
            const newList = videosList.map(vid => vid.id === video.id ? newVideo : vid);
            setNewVideo(newList);
            setEdit(0);
        } else {
            setEdit(1);
        }
    }

    const [editDes, setEditDes] = useState(0);
    const editDesc = () => {
        if (editDes) {
            const newDes = newDesRef.current.value;
            const newVideo = { ...video, description: newDes };
            setVideo(newVideo);
            const newList = videosList.map(vid => vid.id === video.id ? newVideo : vid);
            setNewVideo(newList);
            setEditDes(0);
        } else {
            setEditDes(1);
        }
    }


    const [editVid, setEditVid] = useState(0);
    const editVideo = () => {
        if (editVid) {
            const newFile = newFileRef.current.files[0];
            const fileReader = new FileReader();
            fileReader.addEventListener(
                "load",
                () => {
                    const fileDataUrl = fileReader.result;
                    const newVideo = { ...video, file: fileDataUrl };
                    setVideo(newVideo);
                    const newList = videosList.map(vid => vid.id === video.id ? newVideo : vid);
                     setNewVideo(newList);
                },
                false,
            );
            if (newFile) {
                fileReader.readAsDataURL(newFile);
            }
            navigate(`/`)
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
                    const newVideo = { ...video, image: imageDataUrl };
                    setVideo(newVideo);
                    const newList = videosList.map(vid => vid.id === video.id ? newVideo : vid);
                     setNewVideo(newList);
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
                                <nav class="navbar bg-body-tertiary">
                                    <div class="container-fluid">
                                        <span class="navbar-brand mb-0 h1">@{video.nickName}</span>
                                        {editVid ? <div className="mb-3">
                                            <input class="form-control" type="file" id="formFile" ref={newFileRef}></input>
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
                                    <i id="myIcon" className="bi bi-hand-thumbs-up mb-1"></i>
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
                                    <Comment {...comment} currentUser={currentUser} video={video} videosList={videosList} setVideo={setVideo} setNewVideo={setNewVideo} comments={comments} setComments={setComment} />
                                )
                            }
                        </div>
                    </div>
                </div>

            </div> : "Video not found"
    );
}
export default VideoPage;