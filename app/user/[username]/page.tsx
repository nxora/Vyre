// app/user/[username]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserByUsername } from "@/lib/user";
import { getPostsByAuthor } from "@/lib/posts";
import Container from "@/componenets/Container"; // ✅ fix typo
import { notFound } from "next/navigation";
import UserProfileClient from "./UserProfileClient";
import PostCard from "@/componenets/PostCard"; // ✅ fix typo
import ThemeToggle from "@/componenets/ThemeToggle"; // ✅ fix typo
import BackButton from "./BackButton"; // 👈 NEW
import Profile from "@/componenets/buttons/Profile";

export default async function UserProfile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await getServerSession(authOptions);
  const user = await getUserByUsername(username);

  if (!user) notFound();

  const postLimit = session ? undefined : 5;
  const posts = await getPostsByAuthor(user._id.toString(), postLimit);
  const isMe = session?.user?.id === user._id.toString();

  return (
    <Container className="max-w-4xl mx-auto py-8 md:py-12 px-4">
      {/* 👇 BACK BUTTON (CLIENT COMPONENT) */}
      <div className="mb-6">
        <BackButton />
      </div>

      {/* 👇 THEME TOGGLE */}
      <div className="absolute top-4 right-4 z-10 g flex gap-4">
        <ThemeToggle />
        <Profile/>
      </div>

      {/* 👇 PROFILE CONTENT */}
      <UserProfileClient user={user} posts={posts} isMe={isMe} />

      {/* 👇 POSTS SECTION */}
      <div className="border-t border-neutral-200/50 dark:border-neutral-800/50 pt-8">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          Posts by {user.username}
        </h2>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No posts yet.</p>
            {isMe && (
              <a
                href="/blog/new"
                className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
              >
                Create a Post
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}