// components/FollowButton.tsx
"use client";

import { useState, useEffect } from "react";
import { FaUserPlus, FaCheck } from "react-icons/fa";

export default function FollowButton({ targetUserId }: { targetUserId: string }) {
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);

  // Optional: Fetch initial follow state on mount
  useEffect(() => {
    const fetchFollowing = async () => {
      const res = await fetch(`/api/users/${targetUserId}/follow`);
      const data = await res.json();
      setIsFollowing(data.isFollowing);
    };
    fetchFollowing();
  }, [targetUserId]);

  const toggleFollow = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${targetUserId}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setIsFollowing(data.isFollowing);
    } catch (err) {
      console.error("Follow failed", err);
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