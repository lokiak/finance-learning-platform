import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { RichTextContent } from '@finance-platform/shared';

interface JournalEditorProps {
  content: RichTextContent | null;
  onChange: (content: RichTextContent, wordCount: number) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

const JournalEditor: React.FC<JournalEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start writing...',
  className = '',
  minHeight = '300px',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
    ],
    content: content || undefined,
    editorProps: {
      attributes: {
        class: `prose prose-sage max-w-none focus:outline-none ${className}`,
      },
    },
    onUpdate: ({ editor: updatedEditor }) => {
      const json = updatedEditor.getJSON();
      const words = updatedEditor.storage.characterCount.words();
      onChange(json as RichTextContent, words);
    },
  });

  useEffect(() => {
    if (editor && content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const MenuBar = () => {
    return (
      <div className="flex flex-wrap items-center gap-1 p-2 bg-sage-50 border-b border-sage-200 rounded-t-gentle">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`
            p-2 rounded-soft transition-all duration-200
            ${
              editor.isActive('bold')
                ? 'bg-sage-600 text-white'
                : 'text-earth-700 hover:bg-sage-100'
            }
            disabled:opacity-30 disabled:cursor-not-allowed
          `}
          aria-label="Bold"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h6m0 0h6m-6 0V6m0 6v6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`
            p-2 rounded-soft transition-all duration-200
            ${
              editor.isActive('italic')
                ? 'bg-sage-600 text-white'
                : 'text-earth-700 hover:bg-sage-100'
            }
            disabled:opacity-30 disabled:cursor-not-allowed
          `}
          aria-label="Italic"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m2 8l-5 5m0 0l-5-5" />
          </svg>
        </button>

        <div className="w-px h-6 bg-sage-200 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`
            px-3 py-2 rounded-soft font-semibold text-sm transition-all duration-200
            ${
              editor.isActive('heading', { level: 1 })
                ? 'bg-sage-600 text-white'
                : 'text-earth-700 hover:bg-sage-100'
            }
          `}
          aria-label="Heading 1"
        >
          H1
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`
            px-3 py-2 rounded-soft font-semibold text-sm transition-all duration-200
            ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-sage-600 text-white'
                : 'text-earth-700 hover:bg-sage-100'
            }
          `}
          aria-label="Heading 2"
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`
            px-3 py-2 rounded-soft font-semibold text-sm transition-all duration-200
            ${
              editor.isActive('heading', { level: 3 })
                ? 'bg-sage-600 text-white'
                : 'text-earth-700 hover:bg-sage-100'
            }
          `}
          aria-label="Heading 3"
        >
          H3
        </button>

        <div className="w-px h-6 bg-sage-200 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`
            p-2 rounded-soft transition-all duration-200
            ${
              editor.isActive('bulletList')
                ? 'bg-sage-600 text-white'
                : 'text-earth-700 hover:bg-sage-100'
            }
          `}
          aria-label="Bullet list"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`
            p-2 rounded-soft transition-all duration-200
            ${
              editor.isActive('orderedList')
                ? 'bg-sage-600 text-white'
                : 'text-earth-700 hover:bg-sage-100'
            }
          `}
          aria-label="Ordered list"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`
            p-2 rounded-soft transition-all duration-200
            ${
              editor.isActive('blockquote')
                ? 'bg-sage-600 text-white'
                : 'text-earth-700 hover:bg-sage-100'
            }
          `}
          aria-label="Blockquote"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>

        <div className="flex-1" />

        <div className="text-xs text-earth-500 px-2">
          {editor.storage.characterCount.words()} words
        </div>
      </div>
    );
  };

  return (
    <div className={`rounded-gentle border border-sage-200 bg-white shadow-soft overflow-hidden ${className}`}>
      <MenuBar />
      <div
        className="p-4 overflow-y-auto scrollbar-thin"
        style={{ minHeight }}
      >
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .ProseMirror {
          min-height: ${minHeight};
        }

        .ProseMirror:focus {
          outline: none;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #b9a484;
          float: left;
          height: 0;
          pointer-events: none;
        }

        .ProseMirror h1 {
          font-size: 2em;
          font-weight: 700;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          color: #2d4d2d;
        }

        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          color: #365f36;
        }

        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          color: #457845;
        }

        .ProseMirror p {
          margin: 0.75em 0;
          color: #52443c;
          line-height: 1.7;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.75em 0;
        }

        .ProseMirror li {
          margin: 0.25em 0;
        }

        .ProseMirror blockquote {
          border-left: 4px solid #7dad7d;
          padding-left: 1em;
          margin: 1em 0;
          color: #625046;
          font-style: italic;
        }

        .ProseMirror strong {
          font-weight: 600;
          color: #2d4d2d;
        }

        .ProseMirror em {
          font-style: italic;
        }

        .ProseMirror code {
          background-color: #f6f8f6;
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
      `}</style>
    </div>
  );
};

export default JournalEditor;
