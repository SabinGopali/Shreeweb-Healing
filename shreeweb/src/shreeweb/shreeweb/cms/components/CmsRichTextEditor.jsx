import React, { useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { cmsTheme } from '../shreewebCmsTheme';

const minHeights = {
  sm: 'min-h-[72px]',
  md: 'min-h-[160px]',
  lg: 'min-h-[240px]',
};

/** Plain text / legacy entries → safe initial HTML for TipTap */
export function plainToHtml(text) {
  if (text == null) return '';
  const s = String(text);
  if (!s.trim()) return '';
  if (/^\s*</.test(s)) return s;
  return s
    .split(/\n\n+/)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br />')}</p>`)
    .join('');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function ToolbarButton({ onClick, active, disabled, children, title }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-2 py-1.5 text-xs font-medium transition sm:text-sm ${
        active ? 'bg-stone-800 text-white' : 'bg-white text-stone-700 hover:bg-stone-100'
      } ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
    >
      {children}
    </button>
  );
}

export default function CmsRichTextEditor({
  id,
  label,
  value,
  onChange,
  placeholder = 'Start typing…',
  minHeight = 'md',
  className = '',
}) {
  const mh = minHeights[minHeight] || minHeights.md;
  const lastFromEditorRef = useRef('');

  const normalizeHtml = useCallback((html) => {
    // TipTap output is stable, but whitespace/newlines can differ depending on how content was stored.
    // Normalize a bit so we don't "fight" the user's typing with setContent loops.
    return String(html ?? '')
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: true, allowBase64: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-amber-900 underline decoration-amber-700/80' },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: plainToHtml(value),
    editorProps: {
      attributes: {
        class: `prose prose-stone max-w-none focus:outline-none ${mh} px-3 py-3 sm:px-4 sm:py-3`,
        id: id || undefined,
      },
    },
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      lastFromEditorRef.current = html;
      if (normalizeHtml(html) !== normalizeHtml(value)) {
        onChange(html);
      }
    },
  });

  const syncExternal = useCallback(() => {
    if (!editor) return;
    const incoming = plainToHtml(value);
    const cur = editor.getHTML();

    // If the editor is focused, avoid overwriting while the user types.
    if (editor.isFocused) return;

    // If this value is simply reflecting the last onUpdate we emitted, don't resync.
    if (normalizeHtml(incoming) === normalizeHtml(lastFromEditorRef.current)) return;

    if (normalizeHtml(incoming) !== normalizeHtml(cur)) {
      editor.commands.setContent(incoming, false);
    }
  }, [editor, value, normalizeHtml]);

  useEffect(() => {
    syncExternal();
  }, [syncExternal]);

  const setLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href;
    const url = window.prompt('Link URL', prev || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    if (!editor) return;
    const url = window.prompt('Image URL');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  if (!editor) {
    return (
      <div className={className}>
        {label ? <label className={cmsTheme.label}>{label}</label> : null}
        <div className={`${cmsTheme.input} ${mh} animate-pulse bg-stone-100`} aria-hidden />
      </div>
    );
  }

  return (
    <div className={`cms-rich-editor ${className}`}>
      {label ? (
        <label className={cmsTheme.label} htmlFor={id}>
          {label}
        </label>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm ring-stone-800/10 focus-within:border-stone-400 focus-within:ring-2">
        <div className="flex flex-wrap items-center gap-1 border-b border-stone-200 bg-[#F4EFE6]/90 px-2 py-2 sm:gap-1.5 sm:px-3">
          <ToolbarButton
            title="Undo"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            active={false}
          >
            ↺
          </ToolbarButton>
          <ToolbarButton
            title="Redo"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            active={false}
          >
            ↻
          </ToolbarButton>
          <span className="mx-1 h-5 w-px bg-stone-300" />
          <ToolbarButton title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')}>
            <span className="underline">U</span>
          </ToolbarButton>
          <ToolbarButton title="Strike" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')}>
            S̶
          </ToolbarButton>
          <span className="mx-1 h-5 w-px bg-stone-300" />
          <ToolbarButton title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })}>
            H1
          </ToolbarButton>
          <ToolbarButton title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>
            H2
          </ToolbarButton>
          <ToolbarButton title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}>
            H3
          </ToolbarButton>
          <ToolbarButton title="Paragraph" onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive('paragraph') && !editor.isActive('heading')}>
            P
          </ToolbarButton>
          <span className="mx-1 h-5 w-px bg-stone-300" />
          <ToolbarButton title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
            •
          </ToolbarButton>
          <ToolbarButton title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
            1.
          </ToolbarButton>
          <ToolbarButton title="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}>
            “
          </ToolbarButton>
          <ToolbarButton title="Code" onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')}>
            {'</>'}
          </ToolbarButton>
          <span className="mx-1 h-5 w-px bg-stone-300" />
          <ToolbarButton title="Align left" onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })}>
            L
          </ToolbarButton>
          <ToolbarButton title="Align center" onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })}>
            C
          </ToolbarButton>
          <ToolbarButton title="Align right" onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })}>
            R
          </ToolbarButton>
          <span className="mx-1 h-5 w-px bg-stone-300" />
          <ToolbarButton title="Link" onClick={setLink} active={editor.isActive('link')}>
            🔗
          </ToolbarButton>
          <ToolbarButton title="Image from URL" onClick={addImage} active={false}>
            🖼
          </ToolbarButton>
          <ToolbarButton title="Clear formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} active={false}>
            Clear
          </ToolbarButton>
        </div>

        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 120 }}
          className="flex gap-1 rounded-lg border border-stone-200 bg-white p-1 shadow-lg"
        >
          <ToolbarButton title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton title="Link" onClick={setLink} active={editor.isActive('link')}>
            🔗
          </ToolbarButton>
        </BubbleMenu>

        <EditorContent editor={editor} className="cms-rich-editor-content bg-white" />
      </div>

      <style>{`
        .cms-rich-editor-content .ProseMirror { outline: none; }
        .cms-rich-editor-content .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #a8a29e;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}
