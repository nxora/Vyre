// components/EditProfileModal.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function EditProfile ({ isOpen, onClose, user }: { isOpen: boolean; onClose: () => void; user: any }) {
  const [username, setUsername] = useState(user.username || "");
  const [bio, setBio] = useState(user.bio || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const formData = new FormData();
  const originalUsername = user.username;
  if (username.trim()) formData.append("username", username.trim());
  formData.append("bio", bio);
  if (fileInputRef.current?.files?.[0]) {
    formData.append("avatar", fileInputRef.current.files[0]);
  }

  const res = await fetch("/api/user/update", {
    method: "PUT",
    body: formData,
  });

  if (res.ok) {
    const data = await res.json();
    alert("Profile updated!");

    onClose();

    // ✅ If username changed, redirect to new profile
    if (data.newUsername && data.newUsername !== originalUsername) {
      window.location.href = `/user/${data.newUsername}`;
    } else {
      router.refresh(); // just refresh if no username change
    }
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded"
          />

          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded"
            rows={3}
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:opacity-90"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}