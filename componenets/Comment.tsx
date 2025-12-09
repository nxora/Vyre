// components/Comment.tsx (or wherever your Comments component lives)

"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaComment } from "react-icons/fa";

interface Comment {
  _id: string;
  content: string;
  authorId: { username?: string } | null; // 👈 allow null or missing username
  createdAt: string;
}

interface Props {
  postId: string;
}

export default function Comments({ postId }: Props) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchComments() {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      
      if (!res.ok) {
        console.error("Failed to fetch comments:", res.status, res.statusText);
        return;
      }

      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }

  useEffect(() => {
    fetchComments();
  }, [postId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !session?.user?.id) return; 

    setLoading(true);

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        authorId: session.user.id,
        content,
      }),
    });

    if (res.ok) {
      setContent("");
      fetchComments(); // refetch to get populated author
    }

    setLoading(false);
  }

  return (
    <div className="mt-6"> 
      <h4 className="font-semibold mb-3">Comments ({comments.length})</h4>

      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c._id} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
             <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>
                {c.authorId?.username || "Deleted User"}
              </strong>
              {" • "}
              {new Date(c.createdAt).toLocaleString()}
            </p>
            <p className="text-gray-800 dark:text-gray-200">{c.content}</p>
          </div>
        ))}
      </div>

      {session ? (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600"
          />
          <button
            type="submit"
            className="bg-gray-600 text-white px-4 rounded hover:bg-gray-500 cursor-pointer"
            disabled={loading}
          >
            <FaComment/>
          </button>
        </form>
      ) : (
        <a className="mt-2 text-sm opacity-70" href="/register">Log in to comment</a>
      )}
    </div>
  );
}