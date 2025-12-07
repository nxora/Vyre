"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import React from 'react';

function extractTextPreview(html?: string, length = 120) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .slice(0, length)
    .trim();
}

function extractFirstImageUrl(html?: string): string | null {
  if (!html) return null;
  const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : null;
}

interface Author {
  _id: string;
  username: string;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string; // ISO string
  authorId: Author | null;
}

function PostCard({ post }: { post: Post }) {
  const imageUrl = extractFirstImageUrl(post.content);
  const previewText = extractTextPreview(post.content, 100);
  const authorName = post.authorId?.username || 'Anonymous';
  const formattedDate = new Date(post.createdAt).toLocaleDateString();

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 300, damping: 14 }}
      className="group overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-linear-to-br from-white/60 to-white/30 dark:from-gray-900/60 dark:to-gray-900/30 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {imageUrl ? (
          <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center bg-linear-to-r from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
            <span className="text-neutral-400 text-sm">No image</span>
          </div>
        )}

        <div className="p-5">
          <h3 className="text-xl font-bold mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          {previewText && (
            <p className="text-sm opacity-85 mb-3 line-clamp-2 text-foreground">
              {previewText}
            </p>
          )}
          <div className="flex justify-between items-center text-xs text-neutral-500 dark:text-neutral-400">
            <span>By {authorName}</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default PostCard;