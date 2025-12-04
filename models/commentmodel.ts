import mongoose from "mongoose";

export const commentSchema = new mongoose.Schema({
    postId: {type:mongoose.Schema.Types.ObjectId, ref: "Post"},
    userId: {type: String, ref: "User"},
    content: {type: String}
}, {timestamps: true})