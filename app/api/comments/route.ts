import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Comment from "@/models/commentmodel";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json([], { status: 200 });
  }

  const comments = await Comment.find({ postId })
    .populate("authorId", "username")
    .sort({ createdAt: 1 });

  return NextResponse.json(comments);
}

export async function POST(req: Request) {
  await connectDB();

  const { postId, authorId, content } = await req.json();

  if (!postId || !authorId || !content?.trim()) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const comment = await Comment.create({
    postId,
    authorId,
    content,
  });

  return NextResponse.json(comment, { status: 201 });
}
