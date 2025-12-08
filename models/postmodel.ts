import mongoose from "mongoose"
import User from "./usermodel"

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
    subtitle: { type: String },
     content: {
          type: String,
          required: true,
        },
        authorId: {
          type: mongoose.Schema.Types.ObjectId, 
          required: false,
          ref: "User"
        },
        like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
},
{timestamps: true})

const Post = mongoose.models.Post || mongoose.model("Post", postSchema)
export default Post