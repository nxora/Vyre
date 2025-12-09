// components/NewPost.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaUser } from "react-icons/fa";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (status === "loading") return;

    if (session?.user?.username) {
      // ✅ Go to user profile if logged in
      router.push(`/user/${session.user.username}`);
    } else {
      // ✅ Go to register if not logged in
      router.push("/register");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={status === "loading"}
      className="px-4 py-2 rounded-lg border border-foreground/20 hover:bg-foreground/10 transition cursor-pointer hover:scale-110 disabled:opacity-50"
      aria-label="Go to profile or register"
    >
      <FaUser />
    </button>
  );
}