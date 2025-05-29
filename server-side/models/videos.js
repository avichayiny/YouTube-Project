import mongoose from "mongoose";

const schema = mongoose.Schema

const videoSchema = new schema({
    nameVideo: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    nickName: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true,
        default: Date.now
    },
    views: {
        type: Number,
        required: true,
        default: 0
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    },
    image: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    },
    comments: {
        type: Array,
        required: true,
        default: []
    },
    description: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        sparse: true,
        unique: true
    },
    usersLikes: {
        type: Array,
        required: true,
        default: []
    },
    uploaderPic: {
        type: String,
        required: true
    }
}, { collection: 'video' })

videoSchema.pre('save', async function (next) {
    if (this.isNew) {
        const maxIdDoc = await this.constructor.findOne().sort('-id').exec();
        this.id = maxIdDoc ? maxIdDoc.id + 1 : 1;
    }
    next();
});

const Video = mongoose.model('Video', videoSchema)

export default Video;