import './videoItem.css';
import { Link } from 'react-router-dom';
import React from 'react';

function VideoItem({ nameVideo, nickName, date, views, likes, image, file, comments, id }) {
  const newViews = views + 1;
  const addView = async () => {
    try {
      const currToken = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:90/api/videos/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${currToken}`,
          'Content-Type': 'application/json',  // Added Content-Type header
        },
        body: JSON.stringify({  // Convert body to JSON string
          key: "views",
          change: newViews,
        }),
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
}
return (
  <div className="videoItem">
    <Link className="card" to={`/VideoPage/${id}`} state={{ viewUpdate: newViews }} onClick={addView}>
      <img src={image} className="card-img-top"></img>
      <div className="card-body">
        <h5 className="card-title mb-0">{nameVideo}</h5>
        <span className="small-text">{nickName}</span>
        <div className="card-text">
          <span className="small-text">{date} ~ </span>
          <span className="small-text">{likes} likes </span>
          <span className="small-text">{views} views</span>
        </div>
      </div>
    </Link>
  </div>
);
}
export default VideoItem;