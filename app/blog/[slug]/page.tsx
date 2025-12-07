// app/blog/[slug]/page.tsx
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import Container from "@/componenets/Container";
import ThemeToggle from "@/componenets/ThemeToggle";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostContent from "./PostContent"; // ✅ Client Component

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return notFound();

  const formattedDate = new Date(post.createdAt).toLocaleDateString();
  const authorName = post.authorId?.username || "Anonymous";

  const posts = await getAllPosts();
  const currentIndex = posts.findIndex((p) => p.slug === slug);//p is possibly null
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <Container className="max-w-3xl mx-auto py-12 px-6 relative z-10">
      <div className="flex justify-between items-center mb-12">
        <Link href="/blog" className="text-sm underline text-primary hover:opacity-80">
          ← Back to all posts
        </Link>
        <ThemeToggle />
      </div>

      {/* ✅ All animations now in client component */}
      <PostContent
        post={post}
        authorName={authorName}
        formattedDate={formattedDate}
        prevPost={prevPost}
        nextPost={nextPost}
      />
    </Container>
  );
}