// lib/posts.ts

import Post from "@/models/postmodel";
import { connectDB } from "./db";
import sanitizeHtml from "sanitize-html"; 

// Define a proper non-null post type
export interface SerializedPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  authorId: { _id: string; username: string } | null;
}

function serializePost(post: any): SerializedPost | null {
  if (!post) return null;
   let processedContent = post.content;
//   if (typeof post.content === 'string') {
//     processedContent = post.content.replace(
//       /<img([^>]*?)>/g,
//       '<img$1 class="mx-auto my-6 max-w-full rounded-lg shadow-md" />'
//     );
//   }
  return {
    _id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    content: processedContent,
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

// Now explicitly type the return
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

  const sanitizedContent = sanitizeHtml(data.content, {
  allowedTags: [
    'h1', 'h2', 'h3', 'p', 'br', 'img', 'a', 'ul', 'ol', 'li', 'blockquote',
    'strong', 'em', 'u', 's', 'hr', 'iframe', 'div', 'span', 'code', 'pre'
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height', 'class'],
    iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
    div: ['class'],
    span: ['class'],
    p: ['class'],
    h1: ['class'],
    h2: ['class'],
    h3: ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowVulnerableTags: false,

  // ✅ ADD THIS: Transform all <img> tags to include your desired classes
  transformTags: {
    img: (tagName, attribs) => {
      return {
        tagName: 'img',
        attribs: {
          ...attribs,
          class: `${attribs.class || ''} mx-auto my-6 max-w-full rounded-lg shadow-md`.trim()
        }
      };
    }
  }
});
  const post = await Post.create({...data, content: sanitizedContent});
  return post.toObject(); // optional, but consistent
}

export async function deletePost(id: string) {
  await connectDB();
  return await Post.findOneAndDelete({ _id: id });
}


 