// app/api/user/[id]/follow/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/usermodel";

function jsonError(message: string, status = 401) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ Promise
) {
  const { id } = await params; // ✅ await
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ isFollowing: false });
  }

  await connectDB();
  const user = await User.findById(id).select("followers");
  const isFollowing = user?.followers?.includes(session.user.id) || false;
  return Response.json({ isFollowing });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ Promise
) {
  const { id } = await params; // ✅ await
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return jsonError("Authentication required", 401);
  }

  await connectDB();
  const currentUserId = session.user.id;
  const targetUserId = id;

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) return jsonError("User not found", 404);

  const isCurrentlyFollowing = targetUser.followers.includes(currentUserId);

  if (isCurrentlyFollowing) {
    await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });
    await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });
    return Response.json({ isFollowing: false });
  } else {
    await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } });
    await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } });
    return Response.json({ isFollowing: true });
  }
}