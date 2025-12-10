import { connectDB } from "@/lib/db"
import User from "@/models/usermodel"
 
export async function getUserByUsername(username: string) {
  await connectDB()

  const user = await User.findOne({ username }).lean()
  if (!user) return null

  return {
    _id: user._id.toString(),
    username: user.username,
    email: user.email,
    bio: user.bio || "",
    avatar: user.avatar || "",
    isDeleted: user.isDeleted || false,
    followers: (user.followers || []).map((id: any) => id.toString()),
    following: (user.following || []).map((id: any) => id.toString()),
    createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
  }
}

