import './RecommendVideos.css';
import VideoItem from '../videos/VideoItem';
import React from 'react';

function RecommendVideos({ videos }) {

    return (
        <div className="recommendVideos">
            <div className="col">
                {videos.map((videoItem) => (
                        <VideoItem {...videoItem} />
                ))}
            </div>
        </div>
    );
}
export default RecommendVideos;