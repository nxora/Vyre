// Supports:
// GET  → check if current user follows target
// POST → toggle follow

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/usermodel";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ isFollowing: false });
  }

  await connectDB();
  const user = await User.findById(params.id).select("followers");
  const isFollowing = user?.followers?.includes(session.user.id) || false;

  return Response.json({ isFollowing });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  await connectDB();
  const currentUserId = session.user.id;
  const targetUserId = params.id;

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) return new Response("User not found", { status: 404 });

  // Check if already following
  const isCurrentlyFollowing = targetUser.followers.includes(currentUserId);

  if (isCurrentlyFollowing) {
    // Unfollow
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUserId },
    });
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: targetUserId },
    });
    return Response.json({ isFollowing: false });
  } else {
    // Follow
    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: currentUserId },
    });
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: targetUserId },
    });
    return Response.json({ isFollowing: true });
  }
}