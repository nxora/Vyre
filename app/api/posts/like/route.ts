import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/postmodel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache" ;

export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId } = await req.json();
  if (!postId) {
    return NextResponse.json({ error: "Missing postId" }, { status: 400 });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const userId = session.user.id;

  // ✅ SAFE: Ensure likes is an array (handle undefined or missing field)
  const likesArray = Array.isArray(post.likes) ? post.likes : [];

  const alreadyLiked = likesArray.includes(userId);

  if (alreadyLiked) {
    post.likes.pull(userId);
  } else {
    post.likes.push(userId);
  }

  await post.save();

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);

  return NextResponse.json({
    liked: !alreadyLiked,
    likesCount: Array.isArray(post.likes) ? post.likes.length : 0,
  });
}