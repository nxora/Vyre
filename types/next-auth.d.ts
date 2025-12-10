import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      email: string;
      username: string;
    }
  }

  interface User {
    id: string;
    email: string;
    username: string;
    bio: string
    avatar: string
    isDeleted: boolean
    followers: string[]  // ✅ string[], not ObjectId[]
    following: string[]  // ✅ string[], not ObjectId[]
    createdAt: string
    updatedAt: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
  }
}
