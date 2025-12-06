export default function EditorToolbar({ editor }: { editor: any }) {
  if (!editor) return null

  return (
    <div className="flex gap-2 border-b pb-2 mb-4 text-sm">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'font-bold' : ''}>B</button>

      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'italic' : ''}>I</button>

      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>
        • List
      </button>

      <button type="button" onClick={() => {
        const url = prompt("Image URL")
        if (url) editor.chain().focus().setImage({ src: url }).run()
      }}>
        Image
      </button>
      <button
  type="button"
  onClick={() =>
    editor.chain().focus().toggleHeading({ level: 2 }).run()
  }
>
  H2
</button>

<button
  type="button"
  onClick={() =>
    editor.chain().focus().toggleBlockquote().run()
  }
>
  ❝ Quote
</button>

<button
  type="button"
  onClick={() => {
    const url = prompt("YouTube URL")
    if (url)
      editor.commands.setYoutubeVideo({
        src: url,
      })
  }}
>
  ▶ Video
</button>


    </div>
  )
}
