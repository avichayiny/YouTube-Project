import list from '../VideosList.json'  assert { type: 'json' };
import { getDetails } from './users.js';
import Video from '../models/videos.js';

//let videosList = list

async function getAllVideos(){
    return await Video.find({})
}

async function getAllVideos1() {
    let videosList = await Video.find({})
    // Step 1: Sort the videosList by views in descending order
    let sortedVideos = [...videosList].sort((a, b) => b.views - a.views);

    // Step 2: Get the top 10 videos with the highest number of views
    let top10Videos = sortedVideos.slice(0, 10);

    // Step 3: Get the remaining videos that are not in the top 10
    let remainingVideos = sortedVideos.slice(10);

    // Step 4: Randomly select 10 videos from the remaining videos
    let additional10Videos = remainingVideos.sort(() => 0.5 - Math.random()).slice(0, 10);

    // Step 5: Combine the top 10 videos and the additional 10 videos
    let resultVideos = [...top10Videos, ...additional10Videos];

    return resultVideos;
}

async function userListVideosModels(userName) {
    /*let userVideos = []
    for (let video of videosList) {
        if (video.userName === userName) {
            userVideos.push(video)
        }
    }*/
    return await Video.find({ userName });
};

async function uploadVideoModels(videoName, nickName, userName, image, file, description, uploaderPic) {
    //const id = videosList[videosList.length - 1].id + 1;
    const currentDate = new Date();
    const date = currentDate.toISOString().slice(0, 10);

    const video = new Video({
        "nameVideo": videoName,
        "userName": userName,
        "nickName": nickName,
        "date": date,
        "views": 0,
        "likes": 0,
        "image": image,
        "file": "../uploads/videos/" + file,
        "comments": [],
        "description": description,
        //"id": id,
        "usersLikes": [],
        "uploaderPic": uploaderPic
    });
    await video.save();
    //videosList = [...videosList, video]
};

async function getVid(id) {
    //const video = videosList.find((item) => { return item.id == id });
    const video = await Video.findOne({id : id})
    return video;
}


async function deleteVideo(videoId, userName) {
    const video = await Video.findOne({id : videoId})
    if (video.userName === userName) {
        await Video.deleteOne({id: videoId})
        return true
    } else {
        return false;
    }
}

async function addComment(comment, video, userName) {
    let comments = video.comments
    let id
    if (comments.length > 0) {
        id = 1 + (Math.max(...comments.map(com => com.id)));
    } else {
        id = 1
    }
    const user = await getDetails(userName)
    const newComment = {
        "nickName": user.nickName,
        "comment": comment,
        "id":id,
        "userName" : userName
    }
    comments.push(newComment)
}

function editComment(newComment, video, userName) {
    video.comments = video.comments.map(comment => 
        comment.id === newComment.id ? newComment : comment
      );
      
}

function addLike(video, userName) {
    const userExists = video.usersLikes.some(user => user === userName);
    if(userExists) {
        video.usersLikes = video.usersLikes.filter(temp => temp !== userName)
        video.likes = video.likes - 1
    } else {
        video.usersLikes.push(userName)
        video.likes = video.likes + 1
    }
}

const editKinds =  {
    title: (video, value, userName) => video.userName === userName ? video.nameVideo = value : video.nameVideo,
    description: (video, value, userName) => video.userName === userName ? video.description = value : video.description,
    image: (video, value, userName) => video.userName === userName ? video.image = value : video.image,
    file: (video, value, userName) => video.userName === userName ? video.file = "../uploads/videos/" + value : video.file,
    likes: (video, value, userName) => addLike(video, userName),
    addComment: async (video, value, userName) => await addComment(value, video, userName),
    editComm:(video, value, userName) => editComment(value, video, userName),
    deleteComm: (video, value, userName) => video.comments = video.comments.filter(temp => temp.id !== value),
    views: (video, value, userName) => video.views = value
};


async function editvideoInList(key, change, userName, videoId) {
    //const video = videosList.find((item) => { return item.id == videoId });
    const video = await Video.findOne({id: videoId})
    const edit = editKinds[key];
    if (edit) {
        await edit(video, change, userName)
        await Video.findOneAndReplace(
            {id: videoId} ,
        video,
        { new: true, runValidators: true })
    }
}

async function getVideosOfUser(userId) {
    //const userVideos = videosList.filter(video => video.userName === userId)
    return await Video.find({ userName });
}

async function getVidFirst(id) {
    const video = await Video.findOne({id : id})
    //video.views = video.views + 1
    return video;
}

export {
    getAllVideos, uploadVideoModels, getAllVideos1,
     deleteVideo, editvideoInList, getVideosOfUser, getVid, userListVideosModels, getVidFirst
}