// lib/user.ts
import { connectDB } from "@/lib/db"
import User from "@/models/usermodel"
 
export async function getUserByUsername(username: string) {
  await connectDB()

  const user = await User.findOne({ username }).lean()
  if (!user) return null

  return {
    ...user,
    _id: user._id.toString(),
  }
}

