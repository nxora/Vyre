// app/api/user/[id]/follow/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/usermodel";
import { Types } from "mongoose"; // ✅ Import Types

function jsonError(message: string, status = 401) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Validate ObjectId format
function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return Response.json({ isFollowing: false });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !isValidObjectId(session.user.id)) {
    return Response.json({ isFollowing: false });
  }

  await connectDB();
  const user = await User.findById(id).select("followers");
  const isFollowing = user?.followers?.map(String).includes(session.user.id) || false;
  return Response.json({ isFollowing });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return jsonError("Authentication required", 401);
  }

  // Validate IDs
  if (!isValidObjectId(id) || !isValidObjectId(session.user.id)) {
    return jsonError("Invalid user ID", 400);
  }

  const currentUserId = session.user.id; // string
  const targetUserId = id; // string

  await connectDB();

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) return jsonError("User not found", 404);

  // Safely extract followers as string array
  const followers = Array.isArray(targetUser.followers)
    ? targetUser.followers.map(String)
    : [];

  const isCurrentlyFollowing = followers.includes(currentUserId);

  if (isCurrentlyFollowing) {
    // Unfollow
    await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });
    await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });
    return Response.json({ isFollowing: false });
  } else {
    // Follow
    await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } });
    await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } });
    return Response.json({ isFollowing: true });
  }
}