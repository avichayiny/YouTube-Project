import { getAllVideos } from "./videos.js";
import User from "../models/users.js"
import Video from "../models/videos.js";
import { sendDeleteRequestToCppServer } from "./videos.js";
import net from 'net';

//let users = [];
let loggedUser = null;


const checkUserExist = async (userName) => {
    //return users.some(user => user.userName === userName);
    const user = await User.findOne({ userName: userName });
    console.log(user)
    if (user) {
        return true;
    } else {
        return false;
    }
};

const getError = (userName, password, verifyPassword, nickName, profilePicture) => {
    if (!userName || !password || !nickName || !profilePicture) {
        return 'All fields are required'
    }

    if (password !== verifyPassword) {
        return 'Passwords do not match!'
    }

    if (checkPasswordLength(password)) {
        return 'Password must be at least 8 characters long!'
    }

    if (!checkPasswordStrength(password)) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, and one number!'
    }
    return null
}

function setUser(user) {
    loggedUser = user
}
async function userExists(userName, pass) {
    //const user = users.find(user => user.userName === userName && user.password === pass);
    const user = await User.findOne({ userName: userName, password: pass });
    if (user) {
        return true;
    } else {
        return false;
    }
}

async function getDetails(userName) {
    //console.log(users);
    //const user = users.find(user => user.userName === userName);
    const user = await User.findOne({ userName: userName });
    loggedUser = user;
    return user;
}

function currentLog() {
    return loggedUser;
}

async function setNewUser(user) {
    //users.push(user);
    const newUser = new User({ ...user })
    await newUser.save()
}

const checkPasswordLength = (password) => {
    return password.length < 8;
};

const checkPasswordStrength = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return hasUpperCase && hasLowerCase && hasNumber;
};

async function updateUserModels(userId, userName, password, verifyPassword, nickName, profilePicture) {
    //console.log(videosList)


    let videosList = await Video.find({})
    const errorMessage = await getErrorUpdateUser(userId, userName, password, verifyPassword, nickName, profilePicture)
    if (errorMessage) {
        return { success: false, message: errorMessage };
    }

    let users = await User.find({})
    console.log(users)
    for (let user of users) {
        console.log("in for")
        if (userId === user.userName) {
            if (userName) {
                user.userName = userName;
                for (let video of videosList) {
                    for (let likeUser of video.usersLikes) {
                        if (likeUser === userId) {
                            video.usersLikes = video.usersLikes.filter(item => item != likeUser)
                            video.usersLikes.push(userName)
                        }
                    }
                    await Video.findOneAndReplace(
                        { id: video.id },
                        video,
                        { new: true, runValidators: true })
                }
                for (let video of videosList) {
                    for (let comment of video.comments) {
                        if (comment.userName === userId) {
                            comment.userName = userName
                        }
                    }
                    await Video.findOneAndReplace(
                        { id: video.id },
                        video,
                        { new: true, runValidators: true })
                }
            }
            if (nickName) {
                user.nickName = nickName;
                const checkName = userName ? userName : userId
                for (let video of videosList) {
                    for (let comment of video.comments) {
                        if (comment.userName === checkName) {
                            comment.nickName = nickName
                        }
                    }
                    await Video.findOneAndReplace(
                        { id: video.id },
                        video,
                        { new: true, runValidators: true })
                }
            }
            if (profilePicture) {
                const checkName = userName ? userName : userId
                user.profilePicture = profilePicture;
                for (let video of videosList) {
                    if (video.userName === checkName) {
                        video.uploaderPic = profilePicture
                    }
                    await Video.findOneAndReplace(
                        { id: video.id },
                        video,
                        { new: true, runValidators: true })
                        console.log("cha")
                }
            }

            for (let video of videosList) {
                if (video.userName === userId) {
                    if (userName) {
                        video.userName = userName;
                    }
                    if (nickName) {
                        video.nickName = nickName;
                    }
                }
                await Video.findOneAndReplace(
                    { id: video.id },
                    video,
                    { new: true, runValidators: true })
            }
            if(password) {
                user.password = password
            }
            const update = await User.findOneAndReplace(
                { userName: userId },
                user,
                { new: true, runValidators: true }
            );
            return {
                success: true, user: update
            };
        }
        else {
            continue
        }
    }
    return { success: false, message: 'An error occurred, please try again later' };
};

const getErrorUpdateUser = async (userId, userName, password, verifyPassword, nickName, profilePicture) => {

    if (userId != userName) {
        const isUserExist = await checkUserExist(userName);
        if (isUserExist) {
            return 'this user name exist alredy'
        }
    }


    if (!userName && !password && !nickName && !profilePicture) {
        return 'No change done'
    }

    if (password !== verifyPassword) {
        return 'Passwords do not match!'
    }

    if (password) {
        if (checkPasswordLength(password)) {
            return 'Password must be at least 8 characters long!'
        }

        if (!checkPasswordStrength(password)) {
            return 'Password must contain at least one uppercase letter, one lowercase letter, and one number!'
        }

    }


    return null
}


async function deleteUserModels(userId) {

    const user = await User.find({ userId })
    console.log(user)
    if (!user) {
        return false
    }
    await User.deleteOne({ userName: userId })

    // Find all videos uploaded by the user
    const videos = await Video.find({ userName: userId });

    // Send delete requests for each video to the C++ server
    console.log("videos: ", videos)
    const deleteVideoPromises = videos.map(video => sendDeleteRequestToCppServer(video.id));
    await Promise.all(deleteVideoPromises);

    // Send delete user request to the C++ server
    await sendDeleteUserToCppServer(userId);

    await Video.deleteMany({ userName: userId })
    await Video.updateMany(
        {}, // Match all documents
        { $pull: { usersLikes: userId } } // Pull the specific userName from the likes array
    );
    await Video.updateMany(
        { 'comments.userName': userId },  // Match documents where the `likes` array contains an object with the specific `userName`
        { $pull: { comments: { userName: userId } } } // Pull the specific userName from the likes array
    );
    return true

    /*
    const userIndex = users.findIndex(user => user.userName === userId);
    if (userIndex !== -1) {
        // Remove the user from the users array
        users.splice(userIndex, 1);

        // Remove videos associated with the user
        for (let i = videosList.length - 1; i >= 0; i--) {
            if (videosList[i].userName === userId) {
                videosList.splice(i, 1);
            }
}

        
        for (let video of videosList) {
            const update = video.usersLikes.filter(item => item != userId)
            video.usersLikes = update
        }
        for (let video of videosList) {
            const update = video.comments.filter(item => item.userName != userId)
            video.comments = update
        }

        return true;
    }
    return false;
    */
}

function sendDeleteUserToCppServer(userId) {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        client.connect(5555, '192.168.205.145', () => {
            const message = `USER_DELETE,${userId}`;
            client.write(message);
        });

        client.on('data', (data) => {
            console.log('Received: ' + data);
            client.destroy(); // Close the connection
            resolve(true); // Resolve the promise
        });

        client.on('error', (err) => {
            console.error('Connection error: ', err);
            client.destroy(); // Close the connection
            reject(err); // Reject the promise
        });

        client.on('close', () => {
            console.log('Connection closed');
        });
    });
}




export {
    setNewUser, checkUserExist, setUser, userExists, getDetails, currentLog, getError, updateUserModels,
    deleteUserModels
}
