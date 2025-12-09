//app/blog/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getAllPosts } from "@/lib/posts"
import Container from "@/componenets/Container"
import Rotate from "@/componenets/Rotate"
import ThemeToggle from "@/componenets/ThemeToggle"
import PostCard from "@/componenets/PostCard"
import Link from "next/link"
import NewPost from "@/componenets/buttons/NewPost"
 
export default async function Page() {
  const session = await getServerSession(authOptions)

  // ✅ limit posts if logged out
  const posts = session
    ? await getAllPosts()
    : await getAllPosts(5)

  return (
    <>
      <Rotate />

      <Container className="relative z-10 p-6 bg-white/80 dark:bg-gray-900/80 rounded-xl backdrop-blur-sm">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black tracking-tight">Vyre</h1>
          <div className="flex gap-5">
          <ThemeToggle />
          <NewPost />
          </div>
          
        </div>

        <p className="text-lg opacity-80 mb-10">What Are You Thinking About Today?</p>
        <div className="flex items-center hover:underline" >
         </div>

        {/* ✅ Posts preview */}
        <div className="space-y-4">
          {posts.length === 0 && (
            <p className="opacity-60">No posts yet.</p>
          )}

          {posts.map((post) => (
            <PostCard key={post._id.toString()} post={post} />
          ))}
        </div>

        {!session && (
          <Link
            href="/register"
            className="inline-block mt-6 underline text-primary"
          >
            Read all posts →
          </Link>
        )}
      </Container>
    </>
  )
}
