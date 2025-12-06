"use client"

import React, { useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import slugify from 'slugify'
import { useSession } from 'next-auth/react'
import ThemeToggle from '@/componenets/ThemeToggle'
import EditorToolbar from '@/componenets/EditorToolbar'

export default function CreatePostPage() {
  const { data: session } = useSession()
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('') // Optional subtitle
  const [message, setMessage] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Image.configure({ inline: false, allowBase64: true }),
      Link,
      Youtube.configure({ controls: false }),
      Placeholder.configure({ placeholder: 'Start writing your story…' }),
    ],
    content: '',
    immediatelyRender: false,
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!title || !editor) return

    try {
      const content = editor.getHTML()
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle, // include if you save it
          slug: slugify(title, { lower: true, strict: true }),
          content,
          authorId: session?.user.id,
        }),
      })

      if (!res.ok) throw new Error('Failed to create post')

      setMessage('Post created successfully!')
      setTitle('')
      setSubtitle('')
      editor.commands.setContent('')
    } catch (err: any) {
      setMessage(err.message || 'Something went wrong')
    }
  }

  return (
    <div className="max-w-3xl mx-auto pt-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create Post</h1>
        <ThemeToggle />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {message && <p className="text-green-500">{message}</p>}

        {/* Title */}
        <div
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Post title…"
          onInput={(e) => setTitle((e.target as HTMLDivElement).innerText)}
          className="text-4xl font-bold font-serif outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none"
        />

        {/* Subtitle (optional) */}
        <div
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Subtitle …"
          onInput={(e) => setSubtitle((e.target as HTMLDivElement).innerText)}
          className="text-xl text-gray-600 font-serif outline-none mt-5 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none"
          />

        <hr className="border-gray-200 dark:border-gray-700" />
          <EditorToolbar editor={editor} />notice how this looks like an input and how images/videos fill the whole content which is un medium like remeber how medium has subtitle's for images 

        {/* Toolbar + Editor */}
        <div>
          <EditorContent
            editor={editor}
            className="medium-like-editor prose prose-stone max-w-none dark:prose-invert prose-img:rounded-lg prose-img:my-6 prose-img:mx-auto prose-headings:font-serif prose-p:font-serif prose-p:leading-relaxed prose-p:my-5 prose-blockquote:my-6 prose-blockquote:border-l-4 prose-blockquote:pl-6 prose-ul:my-5 prose-ol:my-5"
          />
        </div>

        <button
          type="submit"
          className="self-start bg-gray-800 text-white px-6 py-2.5 rounded-lg hover:bg-gray-700 transition"
        >
          Publish
        </button>
      </form>
    </div>
  )
}