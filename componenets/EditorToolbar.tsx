"use client"

import {
  FaBold,
  FaItalic,
  FaImage,
  FaQuoteLeft,
  FaYoutube,
} from "react-icons/fa"

export default function EditorToolbar({ editor }: { editor: any }) {
  if (!editor) return null

  const button =
    "p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800"

  const uploadImage = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result }).run()
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  const addYoutube = () => {
    const url = prompt("YouTube link")
    if (!url) return
    editor.commands.setYoutubeVideo({ src: url })
  }

  return (
    <div className="sticky top-0 z-50 backdrop-blur bg-white/70 dark:bg-black/70 border-b px-4 py-2 flex gap-2 justify-center">
      <button className={button} onClick={() => editor.chain().focus().toggleBold().run()}>
        <FaBold />
      </button>
      <button className={button} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <FaItalic />
      </button>
      <button className={button} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <FaQuoteLeft />
      </button>
      <button className={button} onClick={uploadImage}>
        <FaImage />
      </button>
      <button className={button} onClick={addYoutube}>
        <FaYoutube />
      </button>
    </div>
  )
}
