"use client"

import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaCode,
  FaMinus,
  FaHeading,
  FaParagraph,
  FaImage,
  FaYoutube,
} from "react-icons/fa"

export default function EditorToolbar({ editor }: { editor: any }) {
  if (!editor) return null

  const button = "p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"

  const setParagraph = () => editor.chain().focus().setParagraph().run()
  const toggleBold = () => editor.chain().focus().toggleBold().run()
  const toggleItalic = () => editor.chain().focus().toggleItalic().run()
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run()
  const toggleStrike = () => editor.chain().focus().toggleStrike().run()
  const toggleHeading = (level: number) =>
    editor.chain().focus().toggleHeading({ level }).run()
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run()
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run()
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run()
  const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run()
  const setHorizontalRule = () => editor.chain().focus().setHorizontalRule().run()

  const uploadImage = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result as string }).run()
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  const addYoutube = () => {
    const url = prompt("Paste a YouTube URL")
    if (!url) return
    try {
      const urlObj = new URL(url)
      if (
        urlObj.hostname === "www.youtube.com" ||
        urlObj.hostname === "youtube.com" ||
        urlObj.hostname === "youtu.be"
      ) {
        editor.commands.setYoutubeVideo({ src: url })
      } else {
        alert("Please enter a valid YouTube URL")
      }
    } catch {
      alert("Invalid URL")
    }
  }

  return (
    <div className="sticky top-0 z-50 editor-toolbar flex flex-wrap gap-1">
      <button type="button" className={button} onClick={setParagraph} title="Paragraph">
        <FaParagraph />
      </button>

      <button
        type="button"
        className={button}
        onClick={() => toggleHeading(1)}
        title="Heading 1"
      >
        <span className="text-lg font-bold">H1</span>
      </button>
      <button
        type="button"
        className={button}
        onClick={() => toggleHeading(2)}
        title="Heading 2"
      >
        <span className="text-lg font-semibold">H2</span>
      </button>

      <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700 my-auto"></div>

      <button type="button" className={button} onClick={toggleBold} title="Bold">
        <FaBold />
      </button>
      <button type="button" className={button} onClick={toggleItalic} title="Italic">
        <FaItalic />
      </button>
      <button type="button" className={button} onClick={toggleUnderline} title="Underline">
        <FaUnderline />
      </button>
      <button type="button" className={button} onClick={toggleStrike} title="Strikethrough">
        <FaStrikethrough />
      </button>

      <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700 my-auto"></div>

      <button type="button" className={button} onClick={toggleBulletList} title="Bullet List">
        <FaListUl />
      </button>
      <button type="button" className={button} onClick={toggleOrderedList} title="Ordered List">
        <FaListOl />
      </button>
      <button type="button" className={button} onClick={toggleBlockquote} title="Blockquote">
        <FaQuoteLeft />
      </button>
      <button type="button" className={button} onClick={toggleCodeBlock} title="Code Block">
        <FaCode />
      </button>
      <button type="button" className={button} onClick={setHorizontalRule} title="Divider">
        <FaMinus />
      </button>

      <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700 my-auto"></div>

      <button type="button" className={button} onClick={uploadImage} title="Image">
        <FaImage />
      </button>
      <button type="button" className={button} onClick={addYoutube} title="YouTube">
        <FaYoutube />
      </button>
    </div>
  )
}