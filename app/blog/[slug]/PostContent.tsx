// app/blog/[slug]/PostContent.tsx
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { SerializedPost } from "@/lib/posts"; // post is declared locally but its not exported

interface PostContentProps {
  post: any;
  authorName: string;
  formattedDate: string;
  prevPost: any | null;
  nextPost: any | null;
}

export default function PostContent({
  post,
  authorName,
  formattedDate,
  prevPost,
  nextPost,
}: PostContentProps) {
  return (
    <>
      {/* Post Title + Meta */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="text-5xl font-extrabold leading-snug mb-4">{post.title}</h1>
        {post.subtitle && (
          <h2 className="text-xl text-neutral-600 dark:text-neutral-400 mb-4">
            {post.subtitle}
          </h2>
        )}
        <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
          <span>By {authorName}</span>
          <span>{formattedDate}</span>
        </div>
      </motion.div>

      {/* Reading Content */}
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="prose max-w-none dark:prose-invert prose-headings:font-serif prose-p:leading-relaxed prose-p:my-5 prose-blockquote:pl-6 prose-blockquote:border-l-4 prose-blockquote:border-neutral-300 dark:prose-blockquote:border-neutral-700"
      >
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </motion.article>

      {/* Pagination */}
      <motion.div
        className="flex justify-between mt-16 mb-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {prevPost ? (
          <Link
            href={`/blog/${prevPost.slug}`}
            className="underline text-primary hover:opacity-80"
          >
            ← {prevPost.title.slice(0, 30)}…
          </Link>
        ) : (
          <div />
        )}

        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="underline text-primary hover:opacity-80"
          >
            {nextPost.title.slice(0, 30)}… →
          </Link>
        ) : (
          <div />
        )}
      </motion.div>

      <ScrollProgressBar />
    </>
  );
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div
      style={{ width }}
      className="h-1 bg-primary fixed bottom-0 left-0 z-50"
    />
  );
}