// app/user/[username]/UserProfileClient.tsx
"use client";

import { motion } from "framer-motion"; 
import FollowButton from "@/componenets/buttons/FollowButton"; 
import type { SerializedPost } from "@/lib/posts";
import { FaPencilAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import EditProfile from "@/componenets/EditProfile";

interface UserProfileClientProps {
  user: {
    _id: string;
    username: string;
    bio?: string;
    avatar?: string;
    followers?: any[];
    following?: any[];
    isLoggedIn: boolean
};
posts: SerializedPost[];
isMe: boolean;
isLoggedIn: boolean

}

export default function UserProfileClient({
  user,
  posts,
  isMe,
  isLoggedIn
}: UserProfileClientProps) {
      const [isModalOpen, setIsModalOpen] = useState(false);
      
        const [localFollowersCount, setLocalFollowersCount] = useState(user.followers?.length ?? 0);
  const [localIsFollowing, setLocalIsFollowing] = useState(false);
  // ✅ Fixed useEffect
useEffect(() => {
  // Only fetch if logged in AND not viewing self
  if (isLoggedIn && !isMe && user._id) {
    const check = async () => {
      try {
        const res = await fetch(`/api/user/${user._id}/follow`);
        if (res.ok) {
          const { isFollowing } = await res.json();
          setLocalIsFollowing(isFollowing);
        }
        // If not ok (e.g., 401), that's fine — just leave as false
      } catch (err) {
        console.error("Failed to fetch follow status", err);
      }
    };
    check();
  }
}, [user._id, isMe, isLoggedIn]);
 

  const handleFollowToggle = (isNowFollowing: boolean) => {
    setLocalIsFollowing(isNowFollowing);
    setLocalFollowersCount(prev => isNowFollowing ? prev + 1 : prev - 1);
  };

  return (
    <motion.div initial="initial"  animate="animate" variants={{ initial: {}, animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1,}, }, }} className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8 mb-12" >
       <motion.div variants={{
          initial: { scale: 0.8, opacity: 0, y: 20 },
          animate: { scale: 1, opacity: 1, y: 0 },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }} className="flex-shrink-0 w-24 h-24 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-lg" >
        {user.avatar ? (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            src={user.avatar}
            alt={`${user.username}'s avatar`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
            <motion.span
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="text-2xl font-bold text-primary"
            >
              {user.username.charAt(0).toUpperCase()}
            </motion.span>
          </div>
        )}
      </motion.div>

       <motion.div
        variants={{
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
        }}
        className="flex-1 min-w-0"
      >
        <div className="flex flex-wrap items-center gap-4 mb-3">
          <motion.h1
            variants={{
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
            }}
            className="text-3xl md:text-4xl font-black tracking-tight"
          >
            {user.username}
          </motion.h1> 
          {isMe && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
              className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full"
            >
              You
            </motion.span>
          )}
        </div>
    {isMe && (
        <div className="mt-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <FaPencilAlt className="h-4 w-4" />
            Edit Profile
          </button>
        </div>
      )}
      <EditProfile isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={user} />
        {user.bio && (
          <motion.p
  variants={{
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  }}
  transition={{ delay: 0.15 }}
  className="text-gray-800 dark:text-gray-300 mb-4 max-w-2xl leading-relaxed"
>
  {user.bio}
</motion.p>
        )}

        <motion.div
          variants={{
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
          }}
          transition={{ delay: 0.2 }}
  className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6" 
        >
           <span>
    <strong className="text-gray-900 dark:text-white">
      {localFollowersCount}
    </strong>{" "}
    followers
  </span>
  <span>
    <strong className="text-gray-900 dark:text-white">
      {user.following?.length ?? 0}
    </strong>{" "}
    following
  </span>
  <span>
    <strong className="text-blue-900 dark:text-white">
      {posts.length}
    </strong>{" "}
    posts
  </span>
        </motion.div>

        {!isMe && (
          <motion.div
            variants={{
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
            }}
            transition={{ delay: 0.25, type: "spring", stiffness: 400 }}
            className="mt-2"
          >
 {!isMe && isLoggedIn && (
  <FollowButton targetUserId={user._id} onToggle={handleFollowToggle }/>
)}         </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}