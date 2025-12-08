// lib/posts.ts

import Post from "@/models/postmodel";
import { connectDB } from "./db";

// Define a proper non-null post type
export interface SerializedPost {
  _id: string;
  title: string;
  slug: string;
  subtitle: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  authorId: { _id: string; username: string } | null;
}

function serializePost(post: any): SerializedPost | null {
  if (!post) return null; 
  return {
    _id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    content: post.content,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt?.toISOString(),
    authorId: post.authorId
      ? {
          _id: post.authorId._id?.toString(),
          username: post.authorId.username || 'Anonymous',
        }
      : null,
  };
}

 export async function getAllPosts(limit?: number): Promise<SerializedPost[]> {
  await connectDB();
  let query = Post.find().populate("authorId", "username").sort({ createdAt: -1 });
  if (limit) query = query.limit(limit);
  const posts = await query.lean({ virtuals: true });
  return posts.map(serializePost).filter((p): p is SerializedPost => p !== null);
}

export async function getPostBySlug(slug: string) {
  await connectDB();
  const post = await Post.findOne({ slug }).populate("authorId", "username").lean({ virtuals: true });
  return serializePost(post);
}

export async function getAuthor(authorId: string) {
  await connectDB();
  return await Post.find({ _id: authorId }).lean();
}

export async function createPost(data: SerializedPost) {
  await connectDB();
   const post = await Post.create(data);
  return post.toObject();  
}

export async function deletePost(id: string) {
  await connectDB();
  return await Post.findOneAndDelete({ _id: id });
}
 