import LeftMenu from "../buttons_items/LeftMenu";
import SearchButton from "../buttons_items/SearchButton";
import Profile from "../buttons_items/Profile";
import './uploadVideo.css';
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router";


function UploadVideo({ videoList, setVideo, currentUser, setUser }) {
    const [errorMessage, setErrorMessage] = useState('');
    const nameVideoRef = useRef(null);
    const imageRef = useRef(null);
    const fileRef = useRef(null);
    const descriptionRef = useRef(null)
    const navigate = useNavigate();

    // const [maxId, setMaxId] = useState(0);
    // useEffect(() => {
    //     if (videoList.length > 0) {
    //         setMaxId(Math.max(...videoList.map(video => video.id)));
    //     }
    // }, [videoList]);

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
    },[]);


    const addVideo = async (event) => {
        console.log('addVideo callled')
        event.preventDefault();
        if (!currentUser) {
            return;
        }


        const currentDate = new Date();
        const date = currentDate.toISOString().slice(0, 10);
        const userName = currentUser ? currentUser.userName : '';
        const nickName = currentUser ? currentUser.nickName : '';
        const nameVideo = nameVideoRef.current.value;
        const description = descriptionRef.current.value;
        const image = imageRef.current.files[0];
        let fileVid = fileRef.current.files[0];

        const imageReader = new FileReader();

        imageReader.addEventListener(
            "load",
            async () => {
                const imageDataUrl = imageReader.result;
                const formData = new FormData();
                formData.append('nameVideo', nameVideo);  // Add other fields
                formData.append('description', description);
                formData.append('imageDataUrl', imageDataUrl);  // Assuming this is a base64 string or a URL
                formData.append('fileVid', fileVid);  // Add the video file
                formData.append('uploaderPic', currentUser.profilePicture);
                        try {
                            const currToken = sessionStorage.getItem('token');
                            const response = await fetch('http://localhost:90/api/users/:id/videos', {
                                
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${currToken}`,

                                },
                                body: formData,
                            });
                            console.log('fetch')
                            const data = await response.json();
                            console.log(data.video);
                            //setVideo(data.video);
                            console.log('navigate')
                            navigate('/');
                        } catch (error) {
                            console.error('Error:', error);
                            setErrorMessage('Something went wrong, please try again.');
                        }
                    },
                    false,
                );
        if (image) {
            imageReader.readAsDataURL(image);
        }

    }

    const [mode, setMode] = useState(0);
    const changMode = () => {
        if (!mode) {
            setMode(1);
        } else {
            setMode(0);
        }
    }
    return (
        <div className={mode ? "upload bg-dark" : "upload bg-light"}>
            <div className="container-fluid">
                <button id='mode' onClick={changMode} className={mode ? 'mode btn btn-light' : 'mode btn btn-dark'}>{mode ? 'light' : 'dark'} </button>
                <SearchButton />
                <Profile currentUser={currentUser} />
                <div className="row justify-content-center">
                    <div className="col-md-2 left-menu-container">
                        <LeftMenu currentUser={currentUser} setUser={setUser} />
                    </div>
                </div>
                <div className="upload-container">
                    <title>Please upload your video</title>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 mx-auto">
                                <div>{errorMessage && (<p className="error"> {errorMessage} </p>)}</div>
                                <h1 className="mb-4 text-center">Upload Video</h1>
                                <form >
                                    <div className="form-group">
                                        <label >Select Video File</label>
                                        <input type="file" className="form-control-file" id="videoFile" name="videoFile" ref={fileRef}></input>
                                    </div>
                                    <div className="form-group">
                                        <label >Video Name</label>
                                        <input type="text" className="form-control" id="videoName" name="videoName" ref={nameVideoRef}></input>
                                    </div>
                                    <div className="form-group">
                                        <label >description</label>
                                        <input type="text" className="form-control" id="videoName" name="videoName" ref={descriptionRef}></input>
                                    </div>
                                    <div className="form-group">
                                        <label >Select Image File</label>
                                        <input type="file" className="form-control-file" id="imageFile" name="imageFile" ref={imageRef}></input>
                                    </div>
                                    <button type="submit" className="btn btn-danger btn-block" onClick={addVideo}>Upload</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default UploadVideo;