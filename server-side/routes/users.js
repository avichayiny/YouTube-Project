import express from 'express';
import { login, isLoggedIn, addUser, updateUser, deleteUser } from '../controllers/users.js';
import { userListVideos, uploadVideo, getUserVid } from '../controllers/videos.js';
const router = express.Router();

router.post('/tokens', login);
router.get(`/users/:id`, isLoggedIn)
router.get('/current', isLoggedIn)
router.post('/users', addUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/users/:id/videos', userListVideos);
router.post('/users/:id/videos', uploadVideo);
//router.delete('/users/:id/videos/:pid', deleteVideo);
router.get(`/users/:id/videos`, getUserVid)
 export default router;