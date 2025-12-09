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
  const username = formData.get("username")?.toString() || "";
  const bio = formData.get("bio")?.toString() || "";
  const avatarFile = formData.get("avatar") as File | null;

   if (username) {
    const existing = await User.findOne({ username, _id: { $ne: session.user.id } });
    if (existing) return new Response("Username taken", { status: 400 });
  }

  let updateData: any = { username, bio };

   if (avatarFile) {
    const buffer = Buffer.from(await avatarFile.arrayBuffer());
    const filename = `${Date.now()}-${avatarFile.name.replace(/\s+/g, "-")}`;
    const filepath = path.join(process.cwd(), "public", "uploads", filename);
    await fs.writeFile(filepath, buffer);
    updateData.avatar = `/uploads/${filename}`;
  }

  await User.findByIdAndUpdate(session.user.id, updateData);

  return new Response("OK", { status: 200 });
}