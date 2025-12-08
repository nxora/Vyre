"use client"

import React from "react"
import Link from "next/link"

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
    <article className="prose max-w-none dark:prose-invert">
      {/* Title & Subtitle */}
      <h1 className="font-serif text-4xl font-bold mb-2">{post.title}</h1>
      {post.subtitle && <h2 className="font-serif text-xl text-gray-600 mb-8">{post.subtitle}</h2>}

      {/* Meta Info */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-12">
        <span>By {authorName}</span>
        <span>•</span>
        <span>{formattedDate}</span>
      </div>

      {/* Content */}
      <div
        className="medium-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Navigation */}
      <div className="flex justify-between mt-12 border-t pt-6 text-sm text-gray-600">
        {prevPost ? (
          <Link href={`/blog/${prevPost.slug}`} className="hover:underline">
            ← {prevPost.title}
          </Link>
        ) : <div />}
        {nextPost ? (
          <Link href={`/blog/${nextPost.slug}`} className="hover:underline">
            {nextPost.title} →
          </Link>
        ) : <div />}
      </div>
    </article>
  )
}
