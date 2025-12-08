"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"

interface PostContentProps {
  post: any
  authorName: string
  formattedDate: string
  prevPost: any
  nextPost: any
}

export default function PostContent({ post, authorName, formattedDate, prevPost, nextPost }: PostContentProps) {
  if (!post) return null

  return (
    <motion.article
      className="max-w-3xl mx-auto px-4 prose dark:prose-invert prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 prose-iframe:rounded-xl prose-iframe:shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Title */}
      <motion.h1
        className="font-serif text-5xl md:text-6xl font-extrabold mb-4 leading-tight"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {post.title}
      </motion.h1>

      {/* Subtitle */}
      {post.subtitle && (
        <motion.h2
          className="font-serif text-2xl text-gray-600 dark:text-gray-300 mb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {post.subtitle}
        </motion.h2>
      )}

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-12">
        <span>By <span className="font-medium">{authorName}</span></span>
        <span>•</span>
        <span>{formattedDate}</span>
      </div>

      {/* Content */}
      <motion.div
        className="medium-content prose prose-lg dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      />

      {/* Navigation */}
      <div className="flex justify-between mt-16 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        {prevPost ? (
          <motion.div whileHover={{ x: -5 }} transition={{ type: "spring", stiffness: 200 }}>
            <Link href={`/blog/${prevPost.slug}`} className="hover:underline">
              ← {prevPost.title}
            </Link>
          </motion.div>
        ) : <div />}

        {nextPost ? (
          <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 200 }}>
            <Link href={`/blog/${nextPost.slug}`} className="hover:underline">
              {nextPost.title} →
            </Link>
          </motion.div>
        ) : <div />}
      </div>
    </motion.article>
  )
}
