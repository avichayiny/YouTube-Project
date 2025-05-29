import { editvideoInList, getAllVideos, getAllVideos1, getVidFirst, recommend } from '../services/videos.js';
import { getUserFromToken } from './users.js';
import { uploadVideoModels } from '../services/videos.js';
import { deleteVideo, getVid, getVideosOfUser, userListVideosModels } from '../services/videos.js';
import upload from '../config/multer.js';


async function getVideos(req, res) {
    console.log("getvideos")
    res.json({ videos: await getAllVideos() })
}
async function userListVideos(req, res) {
    const userName = req.params.id;
    const videoUserList = await userListVideosModels(userName);
    const user = await getUserFromToken(req);
    res.status(200).json({ videos: videoUserList, user: user });
};

const uploadVideo = [
    upload.single('fileVid'),
    async (req, res) => {
        const user = await getUserFromToken(req);
        const userName = user.userName;
        const nickName = user.nickName;
        const videoName = req.body.nameVideo;
        const description = req.body.description;
        const pic = req.body.imageDataUrl;
        const file = req.body.fileDataUrl;
        console.log(req.body.fileVid)
        console.log(req.file)
        const filePath = req.file.filename;
        const uploader = req.body.uploaderPic
        await uploadVideoModels(videoName, nickName, userName, pic, filePath, description, uploader);
        const updateVideoList = await getAllVideos();
        res.status(200).json({ video: updateVideoList });
    }
];
async function removeVideo(req, res) {
    const videoId = req.params.pid;
    const userName = await getUserFromToken(req)
    const result = await deleteVideo(videoId, userName.userName)
    if (result) {
        const updateVideoList = await getAllVideos();
        res.status(200).json({ videos: updateVideoList })
    } else {
        res.status(401).json({ error: "it's not your video" })
    }
}

const editVideo = [
    upload.single('change'),
    async (req, res) => {
        const user = await getUserFromToken(req)
        const videoId = req.params.pid;
        const key = req.body.key;
        let change = req.body.change;
        const userName = user ? user.userName : "guest"
        let videosRecommend = []
       if (key === "file") {
           change = req.file.filename
        }

        await editvideoInList(key, change, userName, videoId)
        const video = await getVid(videoId)
        res.json({ video: video })
    }
];

/*
async function editVideo(req, res) {
    const user = await getUserFromToken(req)
    const videoId = req.params.pid;
    const key = req.body.key;
    let change = req.body.change;
    const userName = user ? user.userName : "guest"
    if(key === "file") {
        editFile;
        change = req.file.filename
    }
    await editvideoInList(key, change, userName, videoId)
    const video = await getVid(videoId)
    res.json({ video: video })
}
*/
async function getUserVid(req, res) {
    const userId = req.params.id
    const videos = await getVideosOfUser(userId)
    res.json({ videos })
}

async function getVideo(req, res) {
    const id = req.params.pid
    console.log(id);
    let user;
    console.log("token: ", req.headers.authorization)
    //req.headers.authorization !== undefined ? user = await getUserFromToken(req) : user = null
    if(req.headers.authorization !== undefined){
        console.log("not undefined")
        user = await getUserFromToken(req);
    }
    else{
        console.log("undefined")
        user = null
    }
    
    const video = await getVidFirst(id)
    const views = video.views;
    console.log("hi")
    const videosRecommend =  await recommend(id, user ? user.userName : null, views);
    console.log("bye")
    //const videosRecommend =  await getAllVideos();
    if (video){
        console.log("success")
        // console.log("video: ", video);
        // console.log("user", user);
        // console.log("id: ", id);
         console.log("videos controlers: ", videosRecommend);
        res.status(200).json({ video, user: user , videosRecommend})
    }
    else
        console.log("fail")
        // console.log("video: ", video);
        // console.log("user", user);
        // console.log("id: ", id);
        console.log("videos controlers: ", videosRecommend);
        res.status(404)
}


export { userListVideos, uploadVideo, getVideos, removeVideo, editVideo, getUserVid, getVideo }