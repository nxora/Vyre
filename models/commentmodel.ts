import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    postId: {type:mongoose.Schema.Types.ObjectId, ref: "Post"},
    authorId: {type: String, ref: "User"},
    content: {type: String}
}, {timestamps: true})

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema)
export default Comment