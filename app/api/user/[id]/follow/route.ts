// app/api/user/[id]/follow/route.ts
export const runtime = "nodejs";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/usermodel";
import mongoose, { Types } from "mongoose"; // ✅ Import Types
import { revalidatePath } from "next/cache";

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
  console.log("session.user:", session.user);


  if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(session.user.id)) {
    return jsonError("Invalid user ID", 400);
  }

  await connectDB();

  const currentUserId = new Types.ObjectId(session.user.id);
  const targetUserId = new Types.ObjectId(id);

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) return jsonError("User not found", 404);

  const isCurrentlyFollowing = targetUser.followers?.some(
    (fid: Types.ObjectId) => fid.equals(currentUserId)
  );

  if (isCurrentlyFollowing) {
    await User.updateOne(
      { _id: targetUserId },
      { $pull: { followers: currentUserId } }
    );
    await User.updateOne(
      { _id: currentUserId },
      { $pull: { following: targetUserId } }
    );
  } else {
    await User.updateOne(
      { _id: targetUserId },
      { $addToSet: { followers: currentUserId } }
    );
    await User.updateOne(
      { _id: currentUserId },
      { $addToSet: { following: targetUserId } }
    );
  }
  revalidatePath(`/user/${targetUser.username}`);
console.log("✅ Follow operation completed");

// Verify the update worked:
const updatedTarget = await User.findById(targetUserId).select('followers');
const updatedCurrent = await User.findById(currentUserId).select('following');
console.log("Target followers:", updatedTarget.followers);
console.log("Current following:", updatedCurrent.following);
  return Response.json({ isFollowing: !isCurrentlyFollowing });
}
