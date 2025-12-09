"use client"

import React, { useState, useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Strike from "@tiptap/extension-strike"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Youtube from "@tiptap/extension-youtube"
import Placeholder from "@tiptap/extension-placeholder"
import slugify from "slugify"
import { useSession } from "next-auth/react"
import ThemeToggle from "@/componenets/ThemeToggle"
import EditorToolbar from "@/componenets/EditorToolbar"

export default function CreatePostPage() {
  const { data: session } = useSession()
  const [message, setMessage] = useState("")

  // Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { HTMLAttributes: { class: "medium-codeblock" } },
        blockquote: { HTMLAttributes: { class: "medium-blockquote" } },
      }),
      Underline,
      Strike,
      Link,
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: { class: "medium-image mx-auto my-6 rounded-lg shadow-md " },
      }),
      Youtube.configure({ controls: true, HTMLAttributes: { class: "medium-youtube mx-auto my-6" } }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") return "Enter your title..."
          if (node.type.name === "paragraph") return "Start writing your story…"
          return ""
        },
      }),
    ],
    content: `
      <h1>Enter your title...</h1>
      <h2>Write your subtitle here — optional.</h2>
      <p><br></p>
    `,
    immediatelyRender: false
  })

  // Extract title/subtitle
  const getTitle = () => {
    const html = editor?.getHTML()
    if (!html) return ""
    const temp = document.createElement("div")
    temp.innerHTML = html
    return temp.querySelector("h1")?.innerText || ""
  }

  const getSubtitle = () => {
    const html = editor?.getHTML()
    if (!html) return ""
    const temp = document.createElement("div")
    temp.innerHTML = html
    return temp.querySelector("h2")?.innerText || ""
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!editor) return

    const title = getTitle()
    const subtitle = getSubtitle()
    if (!title) {
      setMessage("Please enter a title")
      return
    }

    try {
 const fullHtml = editor.getHTML()

 const tempDiv = document.createElement('div')
tempDiv.innerHTML = fullHtml

 const h1 = tempDiv.querySelector('h1')
const title = h1?.innerText || ''

 const h2 = Array.from(tempDiv.querySelectorAll('h2')).find(el => {
  const prev = el.previousElementSibling
  return prev && prev.tagName === 'H1'
})
const subtitle = h2?.innerText || ''

if (h1) h1.remove()
if (h2) h2.remove()

const content = tempDiv.innerHTML     
 const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subtitle,
          slug: slugify(title, { lower: true, strict: true }),
          content,
          authorId: session?.user?.id,
        }),
      })

      if (!res.ok) throw new Error("Failed to create post")

      setMessage("Post created successfully!")
      editor.commands.setContent(`
        <h1>Enter your title...</h1>
        <h2>Write your subtitle here — optional.</h2>
        <p><br></p>
      `)
    } catch (err: any) {
      setMessage(err.message || "Something went wrong")
    }
  }

  return (
    <div className="max-w-3xl mx-auto pt-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create Post</h1>
        <ThemeToggle />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {message && <p className="text-green-500">{message}</p>}

        <EditorToolbar editor={editor} />

        <EditorContent
          editor={editor}
          className="medium-editor prose max-w-none dark:prose-invert"
        />

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
