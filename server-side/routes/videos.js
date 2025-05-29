import express from 'express';
import { editVideo, getVideo, getVideos, removeVideo } from '../controllers/videos.js';
const router = express.Router();

router.get(`/`, getVideos)
router.delete(`/:pid`, removeVideo)
router.put(`/:pid`, editVideo)
router.get(`/:pid`, getVideo)
//router.get(`/:pid/:comId`, getcomment)

 export default router;