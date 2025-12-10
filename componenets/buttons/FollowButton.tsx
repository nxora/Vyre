// components/FollowButton.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUserPlus, FaCheck } from "react-icons/fa";

export default function FollowButton({ targetUserId, onToggle }: { targetUserId: string, onToggle?: (isNowFollowing: boolean) => void }) {
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFollowing = async () => {
      const res = await fetch(`/api/user/${targetUserId}/follow`);
      if (!res.ok) return; // guest → isFollowing = null
      const data = await res.json();
      setIsFollowing(data.isFollowing);
    };
    fetchFollowing();
  }, [targetUserId]);

  const toggleFollow = async () => {
    console.log("Following user ID:", targetUserId);
      if (!targetUserId || targetUserId.length < 10) {
    console.error("Invalid user ID:", targetUserId);
    alert("Invalid user.");
    return;
  }
    setLoading(true);
    try {
      const res = await fetch(`/api/user/${targetUserId}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("Invalid response");
      }

      const data = await res.json();

      if (res.status === 401 && data.error === "Authentication required") {
        // ✅ Redirect to login
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to follow");
      }

      setIsFollowing(data.isFollowing);
      onToggle?.(data.isFollowing); 
    } catch (err) {
      console.error("Follow failed:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 ${
        isFollowing
          ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 cursor-default"
          : "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
      }`}
    >
      {isFollowing ? (
        <>
          <FaCheck size={12} />
          Following
        </>
      ) : (
        <>
          <FaUserPlus size={12} />
          Follow
        </>
      )}
    </button>
  );
}