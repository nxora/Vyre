// app/api/user/update/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/usermodel";
import fs from "fs/promises";
import path from "path";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  await connectDB();
  const formData = await request.formData();

  // Only update fields that are provided
  const updateData: any = {};

  const username = formData.get("username")?.toString().trim();
  const bio = formData.get("bio")?.toString().trim();
  const avatarFile = formData.get("avatar") as File | null;

  if (username) {
    const existing = await User.findOne({ username, _id: { $ne: session.user.id } });
    if (existing) return new Response("Username taken", { status: 400 });
    updateData.username = username;
  }

  if (bio !== undefined) { 
    updateData.bio = bio;  
  }

  if (avatarFile) {
    const buffer = Buffer.from(await avatarFile.arrayBuffer());
    const filename = `${Date.now()}-${avatarFile.name.replace(/\s+/g, "-")}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    
     await fs.mkdir(uploadsDir, { recursive: true });
    
    const filepath = path.join(uploadsDir, filename);
    await fs.writeFile(filepath, buffer);
    updateData.avatar = `/uploads/${filename}`;
  }

  await User.findByIdAndUpdate(session.user.id, updateData);

  return new Response("OK", { status: 200 });
}