// lib/posts.ts

import Post from "@/models/postmodel";
import { connectDB } from "./db";

export interface SerializedPost {
    _id: string;
    title: string;
    slug: string;
    subtitle: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
    authorId: { _id: string; username: string } | null;
    likes: number;
}

function serializePost(post: any): SerializedPost | null {
    if (!post) return null

    return {
        _id: post._id.toString(),
        title: post.title,
        slug: post.slug,
        content: post.content,
        subtitle: post.subtitle,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt?.toISOString(),

        authorId: post.authorId
            ? {
                _id: post.authorId._id.toString(),
                username: post.authorId.username || "Anonymous",
            }
            : null,

        likes: Array.isArray(post.likes) ? post.likes.length : 0,
    }
}

// lib/posts.ts → getAllPosts & getPostsByAuthor
export async function getAllPosts(limit?: number) {
  await connectDB();
  let query = Post.find()
    .populate("authorId", "username isDeleted") // 👈 include isDeleted
    .sort({ createdAt: -1 });
  if (limit) query = query.limit(limit);
  const posts = await query.lean();

  // 👇 FILTER OUT DELETED AUTHORS
  return posts
    .filter(post => !post.authorId?.isDeleted)
    .map(serializePost)
    .filter((p): p is SerializedPost => p !== null);
}

export async function getPostBySlug(slug: string) {
    await connectDB();
    const post = await Post.findOne({ slug }).populate("authorId", "username").lean({ virtuals: true });
    return serializePost(post);
}

export async function getPostsByAuthor(userId: string, limit?: number) {
    await connectDB()
    let query = Post.find({ authorId: userId })
        .sort({ createdAt: -1 })
        .populate("authorId", " username")

    if (limit) query = query.limit(limit)
    const posts = await query.lean()
    return posts
        .map(serializePost)
        .filter((p): p is SerializedPost => p !== null)
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

// ✅ Raw post fetcher (for auth logic)
export async function getRawPostBySlug(slug: string) {
    await connectDB()
    return await Post.findOne({ slug }).populate("authorId", "username").exec()
}

// ✅ Safe serialization for client (likes as number)
export function serializeForClient(post: any): SerializedPost {
    if (!post) return null as any
    return {
        _id: post._id.toString(),
        title: post.title,
        slug: post.slug,
        content: post.content,
        subtitle: post.subtitle,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt?.toISOString(),
        authorId: post.authorId
            ? {
                _id: post.authorId._id.toString(),
                username: post.authorId.username || "Anonymous",
            }
            : null,
        likes: Array.isArray(post.likes) ? post.likes.length : 0,
    }
}