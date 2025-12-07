"use client"

import React, { useState, useEffect } from 'react'
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
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import HorizontalRule from '@tiptap/extension-horizontal-rule'

export default function CreatePostPage() {
  const { data: session } = useSession()
  const [message, setMessage] = useState('')

  

  // We'll extract title/subtitle from editor content later
  const editor = useEditor({
    extensions: [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    // StarterKit already includes: bold, italic, bulletList, orderedList, listItem, blockquote, codeBlock, horizontalRule
  }),
  Underline,
  Strike,
  Image.configure({
    inline: false,
    allowBase64: true,
    HTMLAttributes: {
      class: 'medium-image',
    },
  }),
  Link,
  Youtube.configure({ controls: false }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === 'heading') return 'Enter your title...'
      if (node.type.name === 'paragraph') return 'Start writing your story…'
      return ''
    },
  }),
],
    content: `
      <h1>Enter your title...</h1> 
      <p>Write your subtitle here — optional.</p>
      <p><br></p>
    `, //could this be the probem
    immediatelyRender: false,
  })

  // Extract title & subtitle from editor content
  const getTitle = () => {
    const html = editor?.getHTML()
    if (!html) return ''

    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html

    const h1 = tempDiv.querySelector('h1')
    return h1?.innerText || ''
  }

  const getSubtitle = () => {
    const html = editor?.getHTML()
    if (!html) return ''

    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html

    const pAfterH1 = Array.from(tempDiv.querySelectorAll('p')).find(p => {
      const prev = p.previousElementSibling
      return prev && prev.tagName === 'H1'
    })

    return pAfterH1?.innerText || ''
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!editor) return

    const title = getTitle()
    const subtitle = getSubtitle()

    if (!title) {
      setMessage('Please enter a title')
      return
    }

    try {
      const content = editor.getHTML()
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          slug: slugify(title, { lower: true, strict: true }),
          content,
          authorId: session?.user.id,
        }),
      })

      if (!res.ok) throw new Error('Failed to create post')

      setMessage('Post created successfully!')
      editor.commands.setContent(`
        <h1>Enter your title...</h1>
        <p>Write your subtitle here — optional.</p>
        <p><br></p>
      `)
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

        {/* Editor */}
        <div className="relative">
          <EditorToolbar editor={editor} />
          <EditorContent
            editor={editor}
            className="medium-editor prose max-w-none dark:prose-invert"
            //  prose-headings:font-serif prose-p:font-serif prose-p:leading-relaxed prose-p:my-5 prose-blockquote:my-6 prose-blockquote:border-l-4 prose-blockquote:pl-6 prose-ul:my-5 prose-ol:my-5"
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