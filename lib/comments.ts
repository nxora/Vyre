import mongoose from "mongoose";
import { connectDB } from "./db";
import Comment from "@/models/commentmodel";

export interface CommentInput {
  postId: string;
  authorId: string;
  content: string;
}
export async function getAllPostComments(id: string) {
    await connectDB()
    return Comment.find({postId: id})
}

export async function createComment(data: CommentInput){
    await connectDB()
    return Comment.create(data)
}

export async function deleteComment(id: string){
    await connectDB()
    return Comment.findByIdAndDelete(id)
}

export async function UpdateComment(id: string){
    await connectDB()
    return Comment.findByIdAndUpdate(id, DataTransfer,{new: true})
}
