// app/api/posts/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/postmodel";

export async function POST(req: Request) {
  await connectDB();
  const { title, slug, content, authorId } = await req.json();

  try {
    const post = await Post.create({ title, slug, content, authorId });
    return NextResponse.json(post, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
