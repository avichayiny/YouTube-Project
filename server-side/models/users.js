import mongoose from "mongoose";

const schema = mongoose.Schema

const userSchema = new schema({
    userName: {
        type : String,
        required: true
    },
    password: {
        type : String,
        required: true
    },
    nickName: {
        type : String,
        required: true
    },
    profilePicture: {
        type : String,
        required: true
    }
},{ collection: 'users' })

const User = mongoose.model('User', userSchema)

export default User
    