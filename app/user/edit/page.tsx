// app/user/edit/page.tsx
"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);
    if (fileInputRef.current?.files?.[0]) {
      formData.append("avatar", fileInputRef.current.files[0]);
    }

    const res = await fetch("/api/user/update", {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      alert("Profile updated!");
      router.refresh(); // reload current page data
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit Profile</h1>
      
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 border rounded"
      />
      
      <textarea
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full p-2 border rounded"
        rows={3}
      />

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        className="w-full py-2 bg-primary text-white rounded hover:opacity-90"
      >
        Save
      </button>
    </form>
  );
}