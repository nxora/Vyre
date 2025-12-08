// app/user/[username]/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getUserByUsername } from "@/lib/user"
import { getPostsByAuthor } from "@/lib/posts"
import Container from "@/componenets/Container"
import FollowButton from "@/componenets/FollowButton"
import PostCard from "@/componenets/PostCard"
import { notFound } from "next/navigation"

export default async function UserProfile({
  params,
}: {
  params: Promise<{ username: string }>
}) {
      const { username } = await params  
  const session = await getServerSession(authOptions)
  const user = await getUserByUsername(username)

  if (!user) notFound()

  const posts = await getPostsByAuthor(user._id.toString())

  const isMe = session?.user?.id === user._id.toString()

  return (
    <Container>
      {/* PROFILE HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black">{user.username}</h1>
          {user.bio && (
            <p className="opacity-70 mt-1 max-w-md">{user.bio}</p>
          )}

          <div className="flex gap-6 text-sm mt-3">
            <span>
              <strong>{user.followers?.length ?? 0}</strong> followers
            </span>
            <span>
              <strong>{user.following?.length ?? 0}</strong> following
            </span>
          </div>
        </div>

        {!isMe && session && (
          <FollowButton targetUserId={user._id.toString()} />
        )}
      </div>

      {/* POSTS */}
      <div className="space-y-6">
        {posts.length === 0 && (
          <p className="opacity-60">No posts yet.</p>
        )}

        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </Container>
  )
}
