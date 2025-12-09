"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { useState, useOptimistic } from "react";

function stripHtml(html: string, length = 140) {
  return html.replace(/<[^>]*>/g, "").slice(0, length);
}

function extractImage(html: string): string | null {
  const match = html.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

export default function PostCard({ post }: { post: any }) {
  const preview = stripHtml(post.content);
  const image = extractImage(post.content);

  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);  

  const toggleLike = async () => {
    const newIsLiked = !isLiked;
    const optimisticLikes = newIsLiked ? likes + 1 : likes - 1;

    setIsLiked(newIsLiked);
    setLikes(optimisticLikes);

    try {
      const res = await fetch("/api/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post._id }),
      });

      if (!res.ok) throw new Error("Failed to update like");

      const data = await res.json();
      setLikes(data.likesCount);
      setIsLiked(data.liked);
    } catch (err) {
      setIsLiked(!newIsLiked);
      setLikes(likes);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 30 }}
      transition={{ duration: 0.35 }}
      className="relative border-l border-neutral-300/40 dark:border-neutral-700/40 pl-6 py-6 group"
    >
    <h2 className="text-2xl font-extrabold mb-2"> <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors" > {post.title} </Link> </h2>

  <p className="max-w-2xl text-sm opacity-75"> {preview}…  </p>

  <div className="mt-3 text-xs opacity-50 flex gap-4 uppercase tracking-wider">
    <Link href={`/user/${post.authorId?.username}`}  className="hover:underline hover:opacity-80"  > {post.authorId?.username ?? "Anonymous"} </Link>
    <span>{new Date(post.createdAt).getFullYear()}</span>
  </div>
 
       {image && ( <img src={image}  alt="" className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-20 object-cover opacity-0 group-hover:opacity-60 transition-opacity duration-300 hidden md:block" /> )}

       <button onClick={(e) => {  e.preventDefault(); toggleLike();  }}  aria-label={isLiked ? "Unlike post" : "Like post"} className={`mt-2 flex items-center gap-1 text-sm transition-colors ${
          isLiked
            ? "text-red-500"
            : "text-gray-500 hover:text-red-500"}`}><FaHeart className={isLiked ? "fill-current" : ""} /> {likes}</button>
    </motion.article>
  );
}