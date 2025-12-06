// app/create-post/CreatePostEditor.tsx
"use client"

import React, { useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { useSession } from 'next-auth/react'
import slugify from 'slugify'

export default function CreatePostEditor() {
  const { data: session } = useSession()
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')

  const editor = useEditor({
    extensions: [StarterKit, Image, Link],
    content: '',
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!title || !editor) return

    const slug = slugify(title, { lower: true })
    const content = editor.getHTML()
    const authorId = session?.user.id

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, content, authorId }),
      })
      if (!res.ok) throw new Error("Failed to create post")

      setMessage("Post created successfully!")
      setTitle("")
      editor.commands.setContent("")
    } catch (err: any) {
      setMessage(err.message || "Something went wrong")
    }
  }

  return (
    <div className="max-w-3xl mx-auto pt-10">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {message && <p className="text-green-500">{message}</p>}
        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
        />
        <div className="border p-2 rounded">
          <EditorContent editor={editor} />
        </div>
        <button className="bg-gray-600 text-white py-2 rounded hover:bg-gray-500">
          Publish
        </button>
      </form>
    </div>
  )
}
