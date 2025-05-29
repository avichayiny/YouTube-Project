import { getError, setNewUser, userExists } from '../services/users.js'

import jwt from "jsonwebtoken";
import { setUser, checkUserExist, getDetails, currentLog, updateUserModels, deleteUserModels } from '../services/users.js';
import { getAllVideos, getAllVideos1 } from '../services/videos.js';

const key = "trying to login"

async function login(req, res) {
    const result = await userExists(req.body.userName, req.body.password)

    if (result) {
        const data = { username: req.body.userName }
        const token = jwt.sign(data, key)
        console.log(token)
        res.status(200).json({ token });
    } else {
        res.status(404).json({ error: 'Invalid username and/or password' })
    }

}

const isLoggedIn = async (req, res) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        console.log(req.headers.authorization)
        try {
            // Verify the token is valid
            const data = jwt.verify(token, key);
            console.log(data.username);
            const user = await getDetails(data.username);
            res.json({
                user: {
                    "userName": user.userName,
                    "nickName": user.nickName,
                    "profilePicture": user.profilePicture
                }, videos: await getAllVideos()
            })

            return;
        } catch (err) {
            return res.status(401).send("Invalid Token");
        }
    }
    else
        return res.status(403).send('Token required');
}



const addUser = async (req, res) => {
    const { userName, password, verifyPassword, nickName, profilePicture } = req.body;

    if (await checkUserExist(userName)) {
        return res.status(409).json({ error: 'User with this userName already exists' });
    }

    const error = getError(userName, password, verifyPassword, nickName, profilePicture)
    if (error)
        return res.status(400).json({ error: error });

    const user = {
        userName,
        password,
        nickName,
        profilePicture,
    };

    await setNewUser(user)
    setUser(user)
    res.status(200).json({ user });
};

async function updateUser(req, res) {
    const userId = req.params.id;
    const userName = req.body.userName;
    const dataForToken = { username: req.body.userName };
    const token = dataForToken.username ? jwt.sign(dataForToken, key) : req.headers.authorization.split(" ")[1];
    const password = req.body.password;
    const verifyPassword = req.body.verifyPassword;
    const nickName = req.body.nickName;
    const profilePicture = req.body.profilePicture;
    const result = await updateUserModels(userId, userName, password, verifyPassword, nickName, profilePicture);

    console.log(result)
    if (result.success) {
        res.status(200).json({
            user: result.user,
            token: token,
            videos: await getAllVideos()

        });
    } else {
        res.status(400).json({ error: result.message });
    }


};

async function deleteUser(req, res) {
    const userId = req.params.id;
    const result = await deleteUserModels(userId);
    if (result) {
        res.status(200).json({ message: 'User deleted successfully' });
    } else {
        res.status(400).json({ error: 'There is a problem. please try again.' });
    }

}

async function getUserFromToken(req) {
    console.log("get token is = " + req.headers.authorization)
    const token = req.headers.authorization.split(" ")[1];
    try {
        const data = jwt.verify(token, key);
        const user = await getDetails(data.username);
        return user;
    } catch (err) {
        return null;
    }
}


export {
    login, isLoggedIn, addUser, getUserFromToken, deleteUser, updateUser
}





