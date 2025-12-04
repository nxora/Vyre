import { connectDB } from "./db";
import  Post  from "@/models/postmodel";

export interface PostInput {
    title: string;
    slug: string;
    content: string;
    authorId?: string;
}

export async function getAllPosts() {
    await connectDB()
    return Post.find().sort({createdAt: -1})
}
export async function getPostBySlug(slug: string) {
    await connectDB()
    return Post.find({ slug })

}
export async function createPost(data: PostInput) {
  await connectDB();
  return Post.create(data);
}
export async function deletePost(id: string) {
    await connectDB()
    return Post.findOneAndDelete({_id: id})
}
