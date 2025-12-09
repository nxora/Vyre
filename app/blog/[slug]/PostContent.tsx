"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import Comments from "@/componenets/Comment"
import { FaHeart } from "react-icons/fa"
import { SerializedPost } from "@/lib/posts"
import BackButton from "@/app/user/[username]/BackButton"
 
interface PostContentProps {
  post: SerializedPost & { currentUserLiked?: boolean } // 👈
  authorName: string
  formattedDate: string
  prevPost: any
  nextPost: any
}

// Helper: Split content into blocks and wrap each in a motion div
const AnimatedContent = ({ htmlString }: { htmlString: string }) => {
  const blockTags = ["p", "h2", "h3", "h4", "ul", "ol", "blockquote", "pre", "figure"];
  const regex = /<(p|h2|h3|h4|ul|ol|blockquote|pre|figure)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi;
  const blocks: string[] = [];
  let match;

  while ((match = regex.exec(htmlString)) !== null) {
    if (blockTags.includes(match[1])) {
      blocks.push(match[0]); // full matched HTML
    }
  }

  return (
    <>
      {blocks.map((html, index) => (
        <motion.div
          key={`block-${index}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: index * 0.05 }}
          dangerouslySetInnerHTML={{ __html: html }}
          className="mb-6 last:mb-0"
        />
      ))}
    </>
  );
};

export default function PostContent({
  post,
  authorName,
  formattedDate,
  prevPost,
  nextPost,
}: PostContentProps) {
  if (!post) return null

  const progressRef = useRef<HTMLDivElement>(null)

  // ✅ likes is a NUMBER (like count), not an array
  const [likes, setLikes] = useState(post.likes) // ← just the number
  // ✅ isLiked comes from server-provided boolean
  const [isLiked, setIsLiked] = useState(!!post.currentUserLiked)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!progressRef.current) return
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPosition = window.scrollY
      const scrollPercent = (scrollPosition / totalHeight) * 100
      progressRef.current.style.width = `${Math.min(scrollPercent, 100)}%`
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

const toggleLike = async () => {
    console.log("toggleLike called");
  if (!hasInteracted) setHasInteracted(true)

  const newLikedState = !isLiked
  const optimisticLikesCount = newLikedState ? likes + 1 : likes - 1

  // Optimistic update
  setIsLiked(newLikedState)
  setLikes(optimisticLikesCount)

  try {
    const res = await fetch("/api/posts/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post._id }),
    })

    if (!res.ok) {
      // Revert on error
      setIsLiked(!newLikedState)
      setLikes(likes)
      return
    }

    // ✅ On SUCCESS: use the server's true like count
    const data = await res.json()
    setLikes(data.likesCount)
    setIsLiked(data.liked)

  } catch (err) {
    // Revert on network error
    setIsLiked(!newLikedState)
    setLikes(likes)
  }
}

  return (
    <>
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 z-50 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150 ease-out"
        ref={progressRef}
        style={{ width: "0%" }}
      />

      <motion.article
        className="max-w-3xl mx-auto px-4 prose dark:prose-invert prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 prose-iframe:rounded-xl prose-iframe:shadow-lg relative"
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

        {/* Meta + Like Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500 mb-6">
          <div>
            <span>
By{" "}
<Link
  href={`/user/${post.authorId?.username}`}
  className="font-medium hover:underline"
>
  {authorName}
</Link>
            </span>
            <span className="mx-2">•</span>
            <span>{formattedDate}</span>
          </div>

          <button
            onClick={toggleLike}
            aria-label={isLiked ? "Unlike post" : "Like post"}
            className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
              isLiked
                ? "text-red-500 bg-red-50/20 hover:bg-red-50/30"
                : "text-gray-500 hover:text-red-500 hover:bg-red-50/10"
            }`}
          >
            <FaHeart className={isLiked ? "fill-current" : ""} />
            {/* ✅ Just show the number — no .length! */}
            <span>{hasInteracted ? likes : post.likes}</span>
          </button>
        </div>

        {/* Content */}
        <div className="medium-content prose prose-lg dark:prose-invert">
          <AnimatedContent htmlString={post.content} />
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-16 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
          {prevPost ? (
            <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 200 }}>
              <Link href={`/blog/${prevPost.slug}`} className="hover:underline underline-offset-4">
                ← {prevPost.title}
              </Link>
            </motion.div>
          ) : <div />}

          {nextPost ? (
            <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 200 }}>
              <Link href={`/blog/${nextPost.slug}`} className="hover:underline underline-offset-4">
                {nextPost.title} →
              </Link>
            </motion.div>
          ) : <div />}
        </div>

        <Comments postId={post._id} />
        <div className="mt-4">

        <BackButton/>
        </div>
      </motion.article>
    </>
  )
}