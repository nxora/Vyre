"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"

export default function CreatePostPage() {
    const router = useRouter()
    const { data: session } = useSession()

    const [title, setTitle] = useState("")
    const [slug, setSlug] = useState("")
    const [content, setContent] = useState("")
    const [message, setMessage] = useState("")

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!session?.user) {
            alert("You must be logged in to create a post")
            return
        }

        const res = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                slug,
                content,
                authorId: session.user.id
            }),
        })

        if (res.ok) {
            setMessage("Post created successfully!")
            router.push(`/posts/${slug}`)
        } else {
            const data = await res.json()
            setMessage(data.error || "Failed to create post")
        }
    }

    return (
        <div className="max-w-2xl mx-auto pt-20">
            <h1 className="text-2xl font-bold mb-6">Create Post</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="border p-2 rounded h-40"
                    required
                />
                <button className="bg-gray-600 text-white py-2 rounded hover:bg-gray-500">
                    Create Post
                </button>
            </form>
            {message && <p className="mt-4">{message}</p>}
        </div>
    )
}
