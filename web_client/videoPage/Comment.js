import { useRef, useState } from "react";

function Comment({ nickName, comment,   id, userName, currentUser, video, videosList, setVideo, setNewVideo, comments, setComments , editComments}) {
    const [edit, setEdit] = useState(0);
    const commentRef = useRef(null);
    const [current, setCurrent] = useState({"nickName": nickName, "comment": comment,"id": id});
/*
    const [comment, setComment] = useState([])
    useEffect(() => {

        const fetchComment = async () => {
            try {
                const currToken = sessionStorage.getItem('token');
                    const response = await fetch(`http://localhost:90/api/videos/${id}/${cId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${currToken}`,
                        },
                    });
    
                        const data = await response.json();
                        const comment = data.comment
                        setComments(comment)       
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
       fetchComment();

        //const video = videosList.find((item) => { return item.id == id });
        //if (video && currentUser) {
          //  fetchEdit("views", viewsUpdate)
        //}
        //setVideo(video);
    }, [id, cId])
    */
    const editComm = () => {
        if (edit) {
            const commentUp = commentRef.current.value.trim();

            const newComment = {
                "nickName": nickName,
                "comment": commentUp,
                "id": id,
                "userName": userName
            }
            editComments("editComm", newComment)
            setCurrent(newComment)
            console.log(video)
/*
            setCurrent(newComment)
            
            const updatedComments = comments.map(co => co.id === current.id ? newComment : co);
            setComments(updatedComments);
            console.log(comment)

            const updateVideo = { ...video, comments: updatedComments };
            setVideo(updateVideo);
            console.log(current.id)
            const updatedVideosList = videosList.map(v => v.id === video.id ? updateVideo : v);
            setNewVideo(updatedVideosList);
            */
            setEdit(0)
        } else {
            setEdit(1)
        }
    }

    const deleteComm = () => {
            
             editComments("deleteComm", id)
             /*
            let updatedComments = comments.filter(temp => temp.id !== id);
            setComments(updatedComments)

            const updateVideo = { ...video, comments: updatedComments };
            setVideo(updateVideo);

            const updatedVideosList = videosList.map(v => v.id === video.id ? updateVideo : v);
            setNewVideo(updatedVideosList);
            */

    }

    return (
        <div className="comment">
            <nav className="navbar bg-body-tertiary">
                <div className="text-primary">@{nickName}</div>
                <div className="container-fluid">
                    {edit ? <textarea className="form-control" id="commentInput" rows="3" ref={commentRef}>{current.comment}</textarea> : current.comment}
                </div>
                <div>
                    {currentUser && currentUser.userName === userName ? <button className="btn bt-sm btn-outline-info float-right" onClick={editComm}>
                    <i className="bi bi-pen"></i></button>
                        : <span></span>}
                </div>
            </nav>
            <div>
            {currentUser && currentUser.userName === userName ? <button onClick={deleteComm} className="btn btn-outline-danger btn-sm ">delete comment</button>
            :<span></span>}
            </div>
        </div>
    )
};
export default Comment;