"use client"
import Link from "next/link"
import { motion } from "framer-motion"

function stripHtml(html: string, length = 140) {
  return html.replace(/<[^>]*>/g, "").slice(0, length)
}

function extractImage(html: string): string | null {
  const match = html.match(/<img[^>]+src="([^">]+)"/)
  return match ? match[1] : null
}

export default function PostCard({ post }: { post: any }) {
  const preview = stripHtml(post.content)
  const image = extractImage(post.content)

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 6 }}
      transition={{ duration: 0.35 }}
      className="relative border-l border-neutral-300/40 dark:border-neutral-700/40 pl-6 py-6 group"
    >
      <Link href={`/blog/${post.slug}`} className="block">
      
        {/* TITLE */}
        <h2 className="text-2xl font-extrabold tracking-tight leading-tight mb-2 
          group-hover:text-primary transition-colors">
          {post.title}
        </h2>

        {/* PREVIEW */}
        <p className="max-w-2xl text-sm opacity-75 leading-relaxed">
          {preview}…
        </p>

        {/* META */}
        <div className="mt-3 text-xs opacity-50 flex gap-4 uppercase tracking-wider">
          <span>{post.authorId?.username ?? "Anonymous"}</span>
          <span>{new Date(post.createdAt).getFullYear()}</span>
        </div>
      </Link>

      {/* IMAGE – subtle + optional */}
      {image && (
        <img
          src={image}
          alt=""
          className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-20 object-cover 
          opacity-0 group-hover:opacity-60 transition-opacity duration-300
          hidden md:block"
        />
      )}
    </motion.article>
  )
}
