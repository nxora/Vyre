import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
     content: {
          type: String,
          required: true,
        },
        authorId: {
          type: mongoose.Schema.Types.ObjectId, // or mongoose.Schema.Types.ObjectId if using users
          required: false,
          ref: "User"
        },
},
{timestamps: true})

const Post = mongoose.models.Post || mongoose.model("Post", postSchema)
export default Post