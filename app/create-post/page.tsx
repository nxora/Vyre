"use client"

import React, { useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import slugify from 'slugify'
import { useSession } from 'next-auth/react'
import ThemeToggle from '@/componenets/ThemeToggle'
import EditorToolbar from '@/componenets/EditorToolbar'
import Placeholder from "@tiptap/extension-placeholder"
import Youtube from "@tiptap/extension-youtube"

export default function CreatePostPage() {
  const { data: session } = useSession()
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')

  const editor = useEditor({
    extensions: [StarterKit, Image, Link, Placeholder.configure({
      placeholder: "Start writing your story…",
      }),
    Youtube.configure({ controls:false})],
    content: '',
    immediatelyRender: false
  })
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  if (!title || !editor) return

  try {
    const content = editor.getHTML()
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug: slugify(title, { lower: true }), content, authorId: session?.user.id })
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
      <div className="flex items-center justify-between mb-3">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <ThemeToggle/>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {message && <p className="text-green-500">{message}</p>}
        <div
  contentEditable
  suppressContentEditableWarning
  data-placeholder="Post title..."
  onInput={(e) =>
    setTitle((e.target as HTMLDivElement).innerText)
  }
className="relative text-4xl font-serif font-bold outline-none mb-6 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none"></div>
<hr />

<div className="bg-white rounded-xl shadow-sm px-10 py-12">
  <EditorToolbar editor={editor} />

  <EditorContent
  editor={editor}
  className="
    prose dark:prose-invert max-w-none
    min-h-[300px]
    outline-none
    focus:outline-none
    prose-p:leading-relaxed
    prose-headings:font-serif
  "
/>

</div>

        <button className="bg-gray-600 text-white py-2 rounded hover:bg-gray-500">
          Publish
        </button>
      </form>
    </div>
  )
}
