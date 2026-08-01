import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle, Color } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { marked } from 'marked';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, CheckSquare,
  Quote, Code, FileCode,
  Table as TableIcon,
  Link as LinkIcon, Image as ImageIcon,
  Minus, AlignLeft, AlignCenter, AlignRight,
  IndentIncrease, IndentDecrease,
  Undo2, Redo2, Maximize2, Minimize2,
  RotateCcw, Copy, Check, Eye, Edit3, Columns, Sparkles,
  ChevronDown, Type, Search, X, Upload, ExternalLink,
  Palette, Highlighter,
  TableRowsSplit, Columns2, Trash2, Plus,
} from 'lucide-react';

// ─── Props ────────────────────────────────────────────────────────────────────
export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  title?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const TB = 'p-1.5 rounded-lg transition-all flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed text-[#747878] dark:text-[#a6adbb] hover:bg-[#f6ece6] dark:hover:bg-[#2b2d31] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]';
const TB_ON = 'p-1.5 rounded-lg transition-all flex-shrink-0 bg-[#006c49]/15 text-[#006c49] dark:bg-[#6cf8bb]/15 dark:text-[#6cf8bb]';
const SEP = 'w-px self-stretch bg-[#e2d8d2] dark:bg-[#2b2d31] mx-0.5 flex-shrink-0';

const TEXT_COLORS = [
  { label: 'Red',     v: '#dc2626' }, { label: 'Orange',  v: '#ea580c' },
  { label: 'Amber',   v: '#d97706' }, { label: 'Green',   v: '#16a34a' },
  { label: 'Teal',    v: '#0d9488' }, { label: 'Blue',    v: '#2563eb' },
  { label: 'Purple',  v: '#7c3aed' }, { label: 'Pink',    v: '#db2777' },
  { label: 'Gray',    v: '#374151' }, { label: 'Black',   v: '#000000' },
];

const HL_COLORS = [
  { label: 'Yellow', v: '#fef08a' }, { label: 'Green',  v: '#bbf7d0' },
  { label: 'Blue',   v: '#bfdbfe' }, { label: 'Pink',   v: '#fbcfe8' },
  { label: 'Orange', v: '#fed7aa' }, { label: 'Purple', v: '#ddd6fe' },
];

const escapeRx = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ─── Helpers ──────────────────────────────────────────────────────────────────
function looksLikeMarkdown(text: string): boolean {
  if (!text?.trim()) return false;
  if (text.trim().startsWith('<')) return false; // Already HTML
  return /^#{1,6}\s|^\*{1,2}|^_{1,2}|\[.+\]\(.+\)|^- |^\d+\. |^```|^>/m.test(text);
}

function parseToHTML(value: string): string {
  if (!value?.trim()) return '';
  if (value.trim().startsWith('<')) return value;
  if (looksLikeMarkdown(value)) return String(marked.parse(value));
  return `<p>${value.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
}

// ─── Custom ResizableImage Extension ─────────────────────────────────────────
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (el) => el.getAttribute('width') || el.style.width || null,
        renderHTML: (attrs) => {
          if (!attrs.width) return {};
          return { width: attrs.width, style: `width: ${attrs.width}; max-width: 100%;` };
        },
      },
      'data-selected': {
        default: null,
        parseHTML: () => null,
        renderHTML: () => ({}),
      },
    };
  },
  addNodeView() {
    return ({ node, editor, getPos }) => {
      const container = document.createElement('div');
      container.style.cssText = 'display: inline-block; position: relative; max-width: 100%;';
      container.setAttribute('data-image-container', 'true');

      const img = document.createElement('img');
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || '';
      if (node.attrs.width) {
        img.style.width = node.attrs.width;
        img.style.maxWidth = '100%';
      }
      img.style.borderRadius = '6px';
      img.style.display = 'block';

      // Resize handle bar
      const bar = document.createElement('div');
      bar.style.cssText = 'position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); display: flex; gap: 4px; background: rgba(0,0,0,0.7); border-radius: 6px; padding: 3px 6px; opacity: 0; transition: opacity 0.15s; pointer-events: auto;';

      const sizes = ['25%', '50%', '75%', '100%'];
      sizes.forEach(s => {
        const btn = document.createElement('button');
        btn.textContent = s;
        btn.style.cssText = 'color: white; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; cursor: pointer; border: none; background: transparent; transition: background 0.1s;';
        btn.addEventListener('mouseover', () => { btn.style.background = 'rgba(255,255,255,0.2)'; });
        btn.addEventListener('mouseout', () => { btn.style.background = 'transparent'; });
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          img.style.width = s;
          const pos = typeof getPos === 'function' ? getPos() : undefined;
          if (typeof pos === 'number') {
            editor.commands.updateAttributes('image', { width: s });
          }
        });
        bar.appendChild(btn);
      });

      container.appendChild(img);
      container.appendChild(bar);

      container.addEventListener('mouseenter', () => { bar.style.opacity = '1'; });
      container.addEventListener('mouseleave', () => { bar.style.opacity = '0'; });

      return { dom: container };
    };
  },
});

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing — paste from Docs, drag images, use the toolbar…',
  minHeight = '320px',
  title = 'Content Editor',
}: RichTextEditorProps) {

  // ── UI State ─────────────────────────────────────────────────────────────
  const [mode, setMode] = useState<'write' | 'preview' | 'split'>('write');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Pickers
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHlPicker, setShowHlPicker] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);

  // Link modal
  const [showLink, setShowLink] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('https://');
  const linkUrlRef = useRef<HTMLInputElement>(null);

  // Image modal
  const [showImage, setShowImage] = useState(false);
  const [imgUrl, setImgUrl] = useState('https://');
  const [imgAlt, setImgAlt] = useState('');
  const [imgWidth, setImgWidth] = useState(100);
  const imgUrlRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find & Replace
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [findCount, setFindCount] = useState(0);

  // Picker refs for outside-click close
  const colorRef = useRef<HTMLDivElement>(null);
  const hlRef = useRef<HTMLDivElement>(null);
  const formatRef = useRef<HTMLDivElement>(null);

  // Track if we're updating externally to prevent feedback loops
  const updatingExternally = useRef(false);

  // ── TipTap Editor ────────────────────────────────────────────────────────
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true, keepAttributes: true },
        orderedList: { keepMarks: true, keepAttributes: true },
        link: false,
        underline: false,
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph', 'image'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'tiptap-link', rel: 'noopener noreferrer' },
      }),
      ResizableImage.configure({ inline: false, allowBase64: true }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      Superscript,
      Subscript,
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content: parseToHTML(value),
    onUpdate: ({ editor }) => {
      if (updatingExternally.current) return;
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content',
        spellcheck: 'true',
      },
      transformPastedHTML(html) {
        // 1. Strip Google Docs inline black text colors, hardcoded white backgrounds & black borders that break Dark Mode
        let cleaned = html
          .replace(/color:\s*(?:#000(?:000)?|rgb\(0,\s*0,\s*0\)|black);?/gi, '')
          .replace(/background-color:\s*(?:#fff(?:fff)?|rgb\(255,\s*255,\s*255\)|white);?/gi, '')
          .replace(/border(?:-[a-z]+)?:\s*[^;]*(?:#000(?:000)?|rgb\(0,\s*0,\s*0\))/gi, '');

        // 2. Unwrap Google Docs image wrapper spans (<span style="overflow:hidden; width:624px..."><img .../></span>)
        // These wrapper spans have fixed height/width & overflow:hidden that render as blank white boxes when external images fail
        cleaned = cleaned.replace(/<span[^>]*style="[^"]*overflow:\s*hidden[^"]*"[^>]*>\s*(<img[^>]+>)\s*<\/span>/gi, '$1');
        cleaned = cleaned.replace(/<div[^>]*style="[^"]*overflow:\s*hidden[^"]*"[^>]*>\s*(<img[^>]+>)\s*<\/div>/gi, '$1');

        return cleaned;
      },
      handlePaste(view, event) {
        const items = event.clipboardData?.items;
        if (!items) return false;

        let hasImage = false;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.indexOf('image') !== -1) {
            hasImage = true;
            const file = item.getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const src = e.target?.result as string;
                if (src && view.state.schema.nodes.image) {
                  const node = view.state.schema.nodes.image.create({ src, alt: file.name || 'pasted-image' });
                  const tr = view.state.tr.replaceSelectionWith(node);
                  view.dispatch(tr);
                }
              };
              reader.readAsDataURL(file);
            }
          }
        }
        // If we handled an image file from clipboard, return true to prevent default HTML paste of broken Google URLs
        return hasImage;
      },
    },
  });

  // Sync value changes from parent (e.g. switching exam in DocumentExplorer)
  useEffect(() => {
    if (!editor) return;
    if (editor.isFocused) return; // Do not overwrite while user is actively editing/focused
    const currentHTML = editor.getHTML();
    if (currentHTML === value) return;
    const parsed = parseToHTML(value);
    if (parsed === currentHTML) return;
    updatingExternally.current = true;
    editor.commands.setContent(parsed, { emitUpdate: false });
    updatingExternally.current = false;
  }, [value, editor]);

  // Fullscreen Escape key
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [isFullscreen]);

  // Outside-click to close pickers
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) setShowColorPicker(false);
      if (hlRef.current && !hlRef.current.contains(e.target as Node)) setShowHlPicker(false);
      if (formatRef.current && !formatRef.current.contains(e.target as Node)) setShowFormatMenu(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Find count update
  useEffect(() => {
    if (!editor || !findText) { setFindCount(0); return; }
    const text = editor.getText();
    const flags = caseSensitive ? 'g' : 'gi';
    const m = text.match(new RegExp(escapeRx(findText), flags));
    setFindCount(m?.length ?? 0);
  }, [findText, editor, caseSensitive]);

  // ── Link handlers ─────────────────────────────────────────────────────────
  const openLinkModal = useCallback(() => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, '');
    setLinkText(selectedText);
    const existing = editor.getAttributes('link').href || '';
    setLinkUrl(existing || 'https://');
    setShowLink(true);
    setTimeout(() => linkUrlRef.current?.focus(), 30);
  }, [editor]);

  const commitLink = useCallback(() => {
    if (!editor) return;
    const url = linkUrl.trim();
    if (!url || url === 'https://') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      setShowLink(false);
      return;
    }
    // If there's selected text, apply link to it; otherwise insert link text
    const { from, to } = editor.state.selection;
    const hasSelection = from !== to;
    if (hasSelection) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    } else if (linkText.trim()) {
      editor.chain().focus().insertContent(`<a href="${url}">${linkText || url}</a>`).run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
    setShowLink(false);
  }, [editor, linkUrl, linkText]);

  // ── Image handlers ────────────────────────────────────────────────────────
  const openImageModal = () => {
    setImgUrl('https://');
    setImgAlt('');
    setImgWidth(100);
    setShowImage(true);
    setTimeout(() => imgUrlRef.current?.focus(), 30);
  };

  const commitImage = useCallback(() => {
    if (!editor) return;
    const url = imgUrl.trim();
    if (!url || url === 'https://') { setShowImage(false); return; }
    const w = imgWidth < 100 ? `${imgWidth}%` : undefined;
    editor.chain().focus().setImage({ src: url, alt: imgAlt || 'image', ...(w ? { width: w } : {}) } as any).run();
    setShowImage(false);
  }, [editor, imgUrl, imgAlt, imgWidth]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result as string, alt: file.name }).run();
      setShowImage(false);
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  }, [editor]);

  // Drag & drop image support
  useEffect(() => {
    if (!editor) return;
    const el = editor.view.dom as HTMLElement;
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer?.files?.[0];
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result as string, alt: file.name }).run();
      };
      reader.readAsDataURL(file);
    };
    const handleDragOver = (e: DragEvent) => e.preventDefault();
    el.addEventListener('drop', handleDrop);
    el.addEventListener('dragover', handleDragOver);
    return () => {
      el.removeEventListener('drop', handleDrop);
      el.removeEventListener('dragover', handleDragOver);
    };
  }, [editor]);

  // ── Find & Replace ────────────────────────────────────────────────────────
  const handleReplaceAll = useCallback(() => {
    if (!editor || !findText) return;
    const html = editor.getHTML();
    const flags = caseSensitive ? 'g' : 'gi';
    // Replace only in text nodes (avoid replacing inside HTML attributes)
    const newHtml = html.replace(
      new RegExp(`(?<=>|^)([^<]*?)${escapeRx(findText)}`, flags),
      (_m, prefix) => prefix + replaceText,
    );
    editor.commands.setContent(newHtml);
    onChange(newHtml);
  }, [editor, findText, replaceText, caseSensitive, onChange]);

  // ── Utilities ─────────────────────────────────────────────────────────────
  const handleCopy = () => {
    if (!editor) return;
    navigator.clipboard.writeText(editor.getText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (!editor || !confirm('Clear all content?')) return;
    editor.commands.clearContent();
    onChange('');
  };

  // Stats
  const wordCount = editor?.storage.characterCount.words() ?? 0;
  const charCount = editor?.storage.characterCount.characters() ?? 0;

  // ── Table helpers ─────────────────────────────────────────────────────────
  const insertTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  // ── Format dropdown ───────────────────────────────────────────────────────
  const FORMAT_OPTS = [
    { lbl: 'Paragraph', cls: 'text-xs', action: () => { editor?.chain().focus().setParagraph().run(); setShowFormatMenu(false); } },
    { lbl: 'Heading 1', cls: 'text-lg font-black', action: () => { editor?.chain().focus().toggleHeading({ level: 1 }).run(); setShowFormatMenu(false); } },
    { lbl: 'Heading 2', cls: 'text-base font-bold', action: () => { editor?.chain().focus().toggleHeading({ level: 2 }).run(); setShowFormatMenu(false); } },
    { lbl: 'Heading 3', cls: 'text-sm font-semibold', action: () => { editor?.chain().focus().toggleHeading({ level: 3 }).run(); setShowFormatMenu(false); } },
  ];

  const isTableActive = editor?.isActive('table') ?? false;

  // ── Wrapper class ─────────────────────────────────────────────────────────
  const wrapCls = [
    'bg-white dark:bg-[#1e1f22] border border-[#eae1da] dark:border-[#2b2d31] shadow-sm flex flex-col',
    isFullscreen ? 'fixed inset-0 z-[9999] rounded-none border-0 shadow-2xl overflow-hidden' : 'rounded-[20px] overflow-hidden',
  ].join(' ');

  if (!editor) return <div className={wrapCls} style={{ minHeight }}><div className="flex-1 flex items-center justify-center text-xs text-[#747878]">Loading editor…</div></div>;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className={wrapCls}>

      {/* ── TOP BAR ─────────────────────────────────────────────────────── */}
      <div className="bg-[#f6ece6]/80 dark:bg-[#141517]/80 border-b border-[#e2d8d2] dark:border-[#2b2d31] px-3 py-2 flex items-center justify-between gap-2 flex-wrap flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#006c49]/15 dark:bg-[#6cf8bb]/15 flex items-center justify-center text-[#006c49] dark:text-[#6cf8bb]">
            <Sparkles className="w-3 h-3" />
          </div>
          <span className="text-xs font-bold text-[#1f1b17] dark:text-[#e3e3e3] uppercase tracking-wide">{title}</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-[#006c49]/10 text-[#006c49] dark:bg-[#6cf8bb]/10 dark:text-[#6cf8bb] rounded-md font-bold">WYSIWYG</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Mode toggle */}
          <div className="flex items-center gap-0.5 bg-white dark:bg-[#1e1f22] border border-[#e2d8d2] dark:border-[#2b2d31] p-0.5 rounded-xl">
            {([
              { k: 'write',   icon: <Edit3 className="w-3 h-3" />,  lbl: 'Edit' },
              { k: 'split',   icon: <Columns className="w-3 h-3" />, lbl: 'Split' },
              { k: 'preview', icon: <Eye className="w-3 h-3" />,     lbl: 'HTML' },
            ] as const).map(m => (
              <button key={m.k} type="button" onClick={() => setMode(m.k)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${mode === m.k ? 'bg-[#006c49] text-white' : 'text-[#747878] dark:text-[#a6adbb] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3]'}`}>
                {m.icon}<span>{m.lbl}</span>
              </button>
            ))}
          </div>

          {/* Fullscreen */}
          <button type="button" title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'} onClick={() => setIsFullscreen(v => !v)}
            className={TB}>
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ── LINK MODAL ──────────────────────────────────────────────────── */}
      {showLink && (
        <div className="flex-shrink-0 border-b border-[#eae1da] dark:border-[#2b2d31] bg-emerald-50 dark:bg-emerald-900/10 px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-extrabold text-[#006c49] dark:text-[#6cf8bb] uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
              <LinkIcon className="w-3 h-3" /> Link
            </span>
            <input type="text" placeholder="Display text" value={linkText} onChange={e => setLinkText(e.target.value)}
              className="min-w-[100px] flex-1 bg-white dark:bg-[#1e1f22] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#006c49]/40" />
            <input ref={linkUrlRef} type="url" placeholder="https://example.com" value={linkUrl} onChange={e => setLinkUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && commitLink()}
              className="min-w-[180px] flex-1 bg-white dark:bg-[#1e1f22] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#006c49]/40" />
            <div className="flex gap-1.5">
              <button type="button" onClick={commitLink} className="px-3 py-1.5 bg-[#006c49] hover:bg-[#005a3c] text-white rounded-xl text-xs font-bold transition-colors">Apply</button>
              {editor.isActive('link') && (
                <button type="button" onClick={() => { editor.chain().focus().unsetLink().run(); setShowLink(false); }}
                  className="px-3 py-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-xl text-xs font-bold transition-colors">Remove</button>
              )}
              <button type="button" onClick={() => setShowLink(false)} className="p-1.5 text-[#747878] hover:text-rose-500 transition-colors"><X className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>
      )}

      {/* ── IMAGE MODAL ─────────────────────────────────────────────────── */}
      {showImage && (
        <div className="flex-shrink-0 border-b border-[#eae1da] dark:border-[#2b2d31] bg-blue-50 dark:bg-blue-900/10 px-4 py-2.5 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
              <ImageIcon className="w-3 h-3" /> Image
            </span>
            <input ref={imgUrlRef} type="url" placeholder="https://image-url.jpg" value={imgUrl} onChange={e => setImgUrl(e.target.value)}
              className="min-w-[200px] flex-1 bg-white dark:bg-[#1e1f22] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400/50" />
            <input type="text" placeholder="Alt text" value={imgAlt} onChange={e => setImgAlt(e.target.value)}
              className="w-28 bg-white dark:bg-[#1e1f22] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl px-3 py-1.5 text-xs focus:outline-none" />
            {/* File upload */}
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl text-xs font-bold hover:bg-blue-200 transition-colors">
              <Upload className="w-3 h-3" /> Upload
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-semibold text-[#747878] dark:text-[#a6adbb] flex-shrink-0">
              Width: <b className="text-[#1f1b17] dark:text-[#e3e3e3]">{imgWidth}%</b>
            </span>
            <input type="range" min={25} max={100} step={5} value={imgWidth} onChange={e => setImgWidth(+e.target.value)} className="flex-1 max-w-xs accent-blue-600" />
            <div className="flex gap-1.5 ml-auto">
              <button type="button" onClick={commitImage} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors">Insert</button>
              <button type="button" onClick={() => setShowImage(false)} className="p-1.5 text-[#747878] hover:text-rose-500 transition-colors"><X className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>
      )}

      {/* ── FIND & REPLACE ───────────────────────────────────────────────── */}
      {showFindReplace && (
        <div className="flex-shrink-0 border-b border-[#eae1da] dark:border-[#2b2d31] bg-amber-50 dark:bg-amber-900/10 px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[11px] font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
              <Search className="w-3 h-3" /> Find &amp; Replace
            </span>
            <div className="relative">
              <input type="text" placeholder="Find…" value={findText} onChange={e => setFindText(e.target.value)}
                className="w-36 bg-white dark:bg-[#1e1f22] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/50 pr-8" />
              {findText && (
                <span className="absolute right-2 top-2 text-[9px] font-extrabold text-amber-600 dark:text-amber-400">{findCount}</span>
              )}
            </div>
            <input type="text" placeholder="Replace with…" value={replaceText} onChange={e => setReplaceText(e.target.value)}
              className="w-36 bg-white dark:bg-[#1e1f22] border border-[#c4c7c7] dark:border-[#383a40] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/50" />
            <label className="flex items-center gap-1 text-[11px] font-semibold text-[#747878] dark:text-[#a6adbb] cursor-pointer">
              <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} className="accent-amber-500" /> Aa
            </label>
            <div className="flex gap-1.5">
              <button type="button" onClick={handleReplaceAll} className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors">Replace All</button>
              <button type="button" onClick={() => setShowFindReplace(false)} className="p-1.5 text-[#747878] hover:text-rose-500 transition-colors"><X className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>
      )}

      {/* ── TABLE TOOLBAR (shows when cursor is inside a table) ──────────── */}
      {isTableActive && mode !== 'preview' && (
        <div className="flex-shrink-0 border-b border-[#eae1da] dark:border-[#2b2d31] bg-indigo-50 dark:bg-indigo-900/10 px-4 py-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-extrabold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mr-1 flex items-center gap-1 flex-shrink-0">
              <TableIcon className="w-3 h-3" /> Table:
            </span>
            <button type="button" onClick={() => editor.chain().focus().addRowBefore().run()} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold hover:bg-indigo-200 transition-colors">
              <Plus className="w-3 h-3" /> Row ↑
            </button>
            <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold hover:bg-indigo-200 transition-colors">
              <Plus className="w-3 h-3" /> Row ↓
            </button>
            <button type="button" onClick={() => editor.chain().focus().addColumnBefore().run()} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold hover:bg-indigo-200 transition-colors">
              <Plus className="w-3 h-3" /> Col ←
            </button>
            <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold hover:bg-indigo-200 transition-colors">
              <Plus className="w-3 h-3" /> Col →
            </button>
            <div className={SEP} />
            <button type="button" onClick={() => editor.chain().focus().deleteRow().run()} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 text-[11px] font-bold hover:bg-rose-200 transition-colors">
              <Trash2 className="w-3 h-3" /> Row
            </button>
            <button type="button" onClick={() => editor.chain().focus().deleteColumn().run()} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 text-[11px] font-bold hover:bg-rose-200 transition-colors">
              <Trash2 className="w-3 h-3" /> Col
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeaderRow().run()} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold hover:bg-indigo-200 transition-colors">
              Header Row
            </button>
            <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700 transition-colors ml-auto">
              <Trash2 className="w-3 h-3" /> Delete Table
            </button>
          </div>
        </div>
      )}

      {/* ── TOOLBAR ─────────────────────────────────────────────────────── */}
      {mode !== 'preview' && (
        <div className="bg-white dark:bg-[#1e1f22] border-b border-[#eae1da] dark:border-[#2b2d31] px-2 py-1.5 space-y-1 flex-shrink-0">

          {/* Row 1 */}
          <div className="flex items-center flex-wrap gap-0.5">
            {/* Undo / Redo */}
            <button type="button" title="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={TB}><Undo2 className="w-3.5 h-3.5" /></button>
            <button type="button" title="Redo (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={TB}><Redo2 className="w-3.5 h-3.5" /></button>
            <div className={SEP} />

            {/* Format dropdown */}
            <div className="relative" ref={formatRef}>
              <button type="button" onClick={() => setShowFormatMenu(v => !v)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold text-[#747878] dark:text-[#a6adbb] hover:bg-[#f6ece6] dark:hover:bg-[#2b2d31] hover:text-[#1f1b17] dark:hover:text-[#e3e3e3] transition-colors">
                <Type className="w-3 h-3" />
                <span>
                  {editor.isActive('heading', { level: 1 }) ? 'H1' :
                   editor.isActive('heading', { level: 2 }) ? 'H2' :
                   editor.isActive('heading', { level: 3 }) ? 'H3' : 'Para'}
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {showFormatMenu && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-[#2b2d31] border border-[#e2d8d2] dark:border-[#383a40] rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                  {FORMAT_OPTS.map(o => (
                    <button key={o.lbl} type="button" onClick={o.action}
                      className="flex items-center w-full px-3 py-2 text-[#1f1b17] dark:text-[#e3e3e3] hover:bg-[#f6ece6] dark:hover:bg-[#383a40] transition-colors">
                      <span className={o.cls}>{o.lbl}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className={SEP} />

            {/* Inline styles — TipTap isActive() gives TRUE active state */}
            <button type="button" title="Bold (Ctrl+B)"      onClick={() => editor.chain().focus().toggleBold().run()}          className={editor.isActive('bold')          ? TB_ON : TB}><Bold className="w-3.5 h-3.5" /></button>
            <button type="button" title="Italic (Ctrl+I)"    onClick={() => editor.chain().focus().toggleItalic().run()}        className={editor.isActive('italic')        ? TB_ON : TB}><Italic className="w-3.5 h-3.5" /></button>
            <button type="button" title="Underline (Ctrl+U)" onClick={() => editor.chain().focus().toggleUnderline().run()}     className={editor.isActive('underline')     ? TB_ON : TB}><UnderlineIcon className="w-3.5 h-3.5" /></button>
            <button type="button" title="Strikethrough"      onClick={() => editor.chain().focus().toggleStrike().run()}        className={editor.isActive('strike')        ? TB_ON : TB}><Strikethrough className="w-3.5 h-3.5" /></button>
            <div className={SEP} />

            {/* Superscript / Subscript */}
            <button type="button" title="Superscript" onClick={() => editor.chain().focus().toggleSuperscript().run()} className={editor.isActive('superscript') ? TB_ON : TB}>
              <span className="text-[11px] font-black leading-none select-none">X<sup style={{fontSize:'7px'}}>2</sup></span>
            </button>
            <button type="button" title="Subscript" onClick={() => editor.chain().focus().toggleSubscript().run()} className={editor.isActive('subscript') ? TB_ON : TB}>
              <span className="text-[11px] font-black leading-none select-none">X<sub style={{fontSize:'7px'}}>2</sub></span>
            </button>
            <div className={SEP} />

            {/* Highlight picker */}
            <div className="relative" ref={hlRef}>
              <button type="button" title="Highlight" onClick={() => { setShowHlPicker(v => !v); setShowColorPicker(false); }} className={showHlPicker ? TB_ON : TB}>
                <Highlighter className="w-3.5 h-3.5" />
              </button>
              {showHlPicker && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-[#2b2d31] border border-[#e2d8d2] dark:border-[#383a40] rounded-xl shadow-xl z-50 flex gap-1.5 flex-wrap w-[152px]">
                  <span className="w-full text-[9px] font-bold text-[#747878] dark:text-[#a6adbb] uppercase">Highlight</span>
                  {HL_COLORS.map(c => (
                    <button key={c.v} type="button" title={c.label} onClick={() => { editor.chain().focus().toggleHighlight({ color: c.v }).run(); setShowHlPicker(false); }}
                      className="w-6 h-6 rounded-lg border-2 border-white dark:border-[#383a40] shadow-sm hover:scale-110 transition-transform" style={{ background: c.v }} />
                  ))}
                  <button onClick={() => { editor.chain().focus().unsetHighlight().run(); setShowHlPicker(false); }}
                    className="w-full text-[9px] text-rose-500 font-bold hover:underline pt-0.5">Remove highlight</button>
                </div>
              )}
            </div>

            {/* Text Color picker */}
            <div className="relative" ref={colorRef}>
              <button type="button" title="Text Color" onClick={() => { setShowColorPicker(v => !v); setShowHlPicker(false); }} className={showColorPicker ? TB_ON : TB}>
                <Palette className="w-3.5 h-3.5" />
              </button>
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-[#2b2d31] border border-[#e2d8d2] dark:border-[#383a40] rounded-xl shadow-xl z-50 flex gap-1.5 flex-wrap w-[152px]">
                  <span className="w-full text-[9px] font-bold text-[#747878] dark:text-[#a6adbb] uppercase">Text Color</span>
                  {TEXT_COLORS.map(c => (
                    <button key={c.v} type="button" title={c.label} onClick={() => { editor.chain().focus().setColor(c.v).run(); setShowColorPicker(false); }}
                      className="w-6 h-6 rounded-lg border-2 border-white dark:border-[#383a40] shadow-sm hover:scale-110 transition-transform" style={{ background: c.v }} />
                  ))}
                  <button onClick={() => { editor.chain().focus().unsetColor().run(); setShowColorPicker(false); }}
                    className="w-full text-[9px] text-rose-500 font-bold hover:underline pt-0.5">Remove color</button>
                </div>
              )}
            </div>
            <div className={SEP} />

            {/* Alignment */}
            <button type="button" title="Align Left"   onClick={() => editor.chain().focus().setTextAlign('left').run()}   className={editor.isActive({ textAlign: 'left' })   ? TB_ON : TB}><AlignLeft className="w-3.5 h-3.5" /></button>
            <button type="button" title="Align Center" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? TB_ON : TB}><AlignCenter className="w-3.5 h-3.5" /></button>
            <button type="button" title="Align Right"  onClick={() => editor.chain().focus().setTextAlign('right').run()}  className={editor.isActive({ textAlign: 'right' })  ? TB_ON : TB}><AlignRight className="w-3.5 h-3.5" /></button>
            <div className={SEP} />

            {/* Link */}
            <button type="button" title="Link (Ctrl+K)" onClick={openLinkModal} className={editor.isActive('link') ? TB_ON : TB}><LinkIcon className="w-3.5 h-3.5" /></button>
          </div>

          {/* Row 2 */}
          <div className="flex items-center flex-wrap gap-0.5">
            {/* Lists */}
            <button type="button" title="Bullet List"   onClick={() => editor.chain().focus().toggleBulletList().run()}  className={editor.isActive('bulletList')  ? TB_ON : TB}><List className="w-3.5 h-3.5" /></button>
            <button type="button" title="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? TB_ON : TB}><ListOrdered className="w-3.5 h-3.5" /></button>
            <button type="button" title="Task List"     onClick={() => editor.chain().focus().toggleTaskList().run()}    className={editor.isActive('taskList')    ? TB_ON : TB}><CheckSquare className="w-3.5 h-3.5" /></button>
            <div className={SEP} />

            {/* Indent / Outdent */}
            <button type="button" title="Indent" onClick={() => editor.chain().focus().sinkListItem('listItem').run()} disabled={!editor.can().sinkListItem('listItem')} className={TB}><IndentIncrease className="w-3.5 h-3.5" /></button>
            <button type="button" title="Outdent" onClick={() => editor.chain().focus().liftListItem('listItem').run()} disabled={!editor.can().liftListItem('listItem')} className={TB}><IndentDecrease className="w-3.5 h-3.5" /></button>
            <div className={SEP} />

            {/* Block elements */}
            <button type="button" title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? TB_ON : TB}><Quote className="w-3.5 h-3.5" /></button>
            <button type="button" title="Inline Code" onClick={() => editor.chain().focus().toggleCode().run()} className={editor.isActive('code') ? TB_ON : TB}><Code className="w-3.5 h-3.5" /></button>
            <button type="button" title="Code Block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? TB_ON : TB}><FileCode className="w-3.5 h-3.5" /></button>
            <div className={SEP} />

            {/* Insert */}
            <button type="button" title="Insert Table" onClick={insertTable} className={TB}><TableIcon className="w-3.5 h-3.5" /></button>
            <button type="button" title="Insert Image" onClick={openImageModal} className={showImage ? TB_ON : TB}><ImageIcon className="w-3.5 h-3.5" /></button>
            <button type="button" title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={TB}><Minus className="w-3.5 h-3.5" /></button>
            <div className={SEP} />

            {/* Find & Replace */}
            <button type="button" title="Find & Replace (Ctrl+F)" onClick={() => setShowFindReplace(v => !v)} className={showFindReplace ? TB_ON : TB}>
              <Search className="w-3.5 h-3.5" />
            </button>
            <div className={SEP} />

            {/* Utilities */}
            <button type="button" onClick={handleCopy}
              className={`${TB} flex items-center gap-1 text-[10px] font-bold px-2`}>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button type="button" onClick={handleClear} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors flex-shrink-0">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── BUBBLE MENU (floating mini-toolbar on text select) ───────────── */}
      {editor && mode !== 'preview' && (
        <BubbleMenu editor={editor}
          className="flex items-center gap-0.5 bg-[#1e1f22] dark:bg-[#f6ece6] rounded-xl p-1 shadow-2xl border border-[#383a40] dark:border-[#e2d8d2]">
          {[
            { label: 'B', title: 'Bold', active: editor.isActive('bold'), action: () => editor.chain().focus().toggleBold().run(), cls: 'font-black' },
            { label: 'I', title: 'Italic', active: editor.isActive('italic'), action: () => editor.chain().focus().toggleItalic().run(), cls: 'italic' },
            { label: 'U', title: 'Underline', active: editor.isActive('underline'), action: () => editor.chain().focus().toggleUnderline().run(), cls: 'underline' },
            { label: 'S', title: 'Strike', active: editor.isActive('strike'), action: () => editor.chain().focus().toggleStrike().run(), cls: 'line-through' },
          ].map(b => (
            <button key={b.label} type="button" title={b.title} onClick={b.action}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${b.active ? 'bg-[#006c49] text-white' : 'text-white dark:text-[#1e1f22] hover:bg-white/10 dark:hover:bg-black/10'} ${b.cls}`}>
              {b.label}
            </button>
          ))}
          <div className="w-px self-stretch bg-[#383a40] dark:bg-[#e2d8d2] mx-0.5" />
          <button type="button" title="Link" onClick={openLinkModal}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${editor.isActive('link') ? 'bg-[#006c49] text-white' : 'text-white dark:text-[#1e1f22] hover:bg-white/10 dark:hover:bg-black/10'}`}>
            <LinkIcon className="w-3 h-3" />
          </button>
        </BubbleMenu>
      )}

      {/* ── EDITOR BODY ──────────────────────────────────────────────────── */}
      <div className={[
        'grid flex-1 min-h-0',
        mode === 'split' ? 'grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#eae1da] dark:divide-[#2b2d31]' : 'grid-cols-1',
      ].join(' ')}>

        {/* TipTap WYSIWYG area */}
        {mode !== 'preview' && (
          <div className={`overflow-y-auto bg-white dark:bg-[#1e1f22] ${isFullscreen ? 'flex-1' : ''}`} style={{ minHeight }}>
            <EditorContent editor={editor} className="h-full tiptap-wrapper" />
          </div>
        )}

        {/* HTML source / Preview panel */}
        {mode !== 'write' && (
          <div className={`overflow-y-auto bg-[#f6ece6]/20 dark:bg-[#141517]/20 p-4 ${isFullscreen ? 'flex-1' : 'max-h-[600px]'}`}>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#006c49] dark:text-[#6cf8bb] mb-3 pb-1 border-b border-[#eae1da] dark:border-[#2b2d31]">
              HTML Output
            </div>
            <pre className="text-[10px] font-mono text-[#444748] dark:text-[#a6adbb] whitespace-pre-wrap break-all leading-relaxed">
              {editor.getHTML()}
            </pre>
          </div>
        )}
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-[#f6ece6]/40 dark:bg-[#141517]/40 border-t border-[#eae1da] dark:border-[#2b2d31] px-3 py-1 flex items-center justify-between text-[10px] font-mono text-[#747878] dark:text-[#6e7278]">
        <div className="flex items-center gap-3">
          <span>Words: <b className="text-[#1f1b17] dark:text-[#e3e3e3]">{wordCount}</b></span>
          <span>Chars: <b className="text-[#1f1b17] dark:text-[#e3e3e3]">{charCount}</b></span>
        </div>
        <div className="flex items-center gap-2">
          {isTableActive && <span className="text-indigo-600 dark:text-indigo-400 font-bold">In Table — use toolbar above ↑</span>}
          <span className="text-[#006c49] dark:text-[#6cf8bb] font-bold">TipTap WYSIWYG</span>
          {isFullscreen && (
            <button type="button" onClick={() => setIsFullscreen(false)} className="px-2 py-0.5 bg-[#eae1da] dark:bg-[#2b2d31] rounded text-[10px] font-bold">Esc to exit</button>
          )}
        </div>
      </div>
    </div>
  );
}
