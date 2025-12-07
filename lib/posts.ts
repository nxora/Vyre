// lib/posts.ts
import { connectDB } from "./db";
import Post from "@/models/postmodel";

export interface PostInput {
  title: string;
  slug: string;
  content: string;
  authorId?: string;
}

export async function getAllPosts(limit?: number) {
  await connectDB();
  let query = Post.find().populate("authorId", "username").sort({ createdAt: -1 });
  if (limit) query = query.limit(limit);
  // ✅ Convert to plain JavaScript objects
  return await query.lean(); // <<--- THIS IS CRITICAL
}

export async function getPostBySlug(slug: string) {
  await connectDB();
  const post = await Post.findOne({ slug }).populate("authorId", "username").lean();
  return post;
}

export async function getAuthor(authorId: string) {
  await connectDB();
  return await Post.find({ _id: authorId }).lean();
}

export async function createPost(data: PostInput) {
  await connectDB();
  const post = await Post.create(data);
  return post.toObject(); // optional, but consistent
}

export async function deletePost(id: string) {
  await connectDB();
  return await Post.findOneAndDelete({ _id: id });
}