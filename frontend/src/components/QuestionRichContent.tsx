import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import DOMPurify from 'dompurify';
import { Terminal, Copy, Check } from 'lucide-react';

export interface QuestionRichContentProps {
  content: string;
  className?: string;
  isOption?: boolean;
}

const DOMPURIFY_CONFIG = {
  USE_PROFILES: { html: true, svg: true, mathMl: true },
  ALLOWED_TAGS: [
    'p', 'span', 'b', 'strong', 'i', 'em', 'u', 's', 'sub', 'sup',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'hr',
    'pre', 'code', 'blockquote',
    'ul', 'ol', 'li',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'img', 'svg', 'g', 'path', 'circle', 'rect', 'line', 'polygon', 'polyline', 'text', 'defs', 'marker',
    'math', 'mrow', 'mi', 'mn', 'mo', 'msup', 'msub', 'mfrac', 'mroot', 'msqrt', 'mtable', 'mtr', 'mtd', 'div'
  ],
  ALLOWED_ATTR: [
    'class', 'className', 'id', 'style', 'src', 'alt', 'title', 'width', 'height',
    'viewBox', 'xmlns', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin',
    'd', 'r', 'cx', 'cy', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'points', 'transform',
    'colspan', 'rowspan', 'border', 'align'
  ],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|data:image\/):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'link', 'style', 'base', 'meta', 'applet'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onmouseenter', 'onchange', 'action', 'formaction', 'xlink:href'],
};

function sanitizeRichHtml(html: string): string {
  if (!html) return '';
  if (typeof window === 'undefined') {
    // Basic fallback for server environments
    return html.replace(/<script\b[\s\S]*?(?:<\/script>|$)/gi, '').replace(/[\s\/>]on[a-zA-Z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, ' ');
  }
  return String(DOMPurify.sanitize(html, DOMPURIFY_CONFIG as any));
}

function formatLanguageBadge(rawLang?: string): string {
  if (!rawLang) return 'CODE';
  const l = rawLang.trim().toUpperCase();
  if (l === 'CPP' || l === 'C++') return 'C++';
  if (l === 'C') return 'C';
  if (l === 'JAVA') return 'JAVA';
  if (l === 'PYTHON' || l === 'PY') return 'PYTHON';
  if (l === 'PSEUDO' || l === 'PSEUDOCODE' || l === 'PSEUDO-CODE') return 'PSEUDO-CODE';
  if (l === 'SQL') return 'SQL';
  if (l === 'JS' || l === 'JAVASCRIPT') return 'JAVASCRIPT';
  if (l === 'TS' || l === 'TYPESCRIPT') return 'TYPESCRIPT';
  if (l === 'HTML') return 'HTML';
  if (l === 'CSS') return 'CSS';
  return l;
}

function CodeBlockSnippet({
  code,
  language,
  isOption,
}: {
  code: string;
  language?: string;
  isOption?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      navigator.clipboard?.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (isOption) {
    return (
      <div className="my-1 p-2 rounded-lg bg-[#141518] text-[#f4f4f5] font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre border border-neutral-800">
        <code>{code}</code>
      </div>
    );
  }

  const displayLang = formatLanguageBadge(language);

  return (
    <div className="my-3 rounded-xl border border-neutral-800 dark:border-[#2b2d33] overflow-hidden shadow-xs bg-[#141518] text-[#f4f4f5] text-left">
      {/* Code Header Bar */}
      <div className="px-3.5 py-1.5 bg-[#1b1c20] border-b border-neutral-800 flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-neutral-300 bg-neutral-800/90 px-2 py-0.5 rounded border border-neutral-700/60">
            {displayLang}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-[11px] font-sans font-medium text-neutral-400 hover:text-white transition-colors px-2 py-0.5 rounded hover:bg-neutral-800 cursor-pointer"
          title="Copy Code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-neutral-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <pre className="p-3.5 sm:p-4 text-xs sm:text-[13px] font-mono leading-relaxed overflow-x-auto custom-scrollbar text-[#f4f4f5] bg-[#141518] whitespace-pre selection:bg-[#FD4A32]/30 selection:text-white">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function preprocessMarkdown(raw: string): string {
  if (!raw) return '';
  let text = raw;

  // 1. Ensure a space after heading hashes if missing: e.g. "##Problem Statement" -> "## Problem Statement"
  text = text.replace(/^(#{1,6})([^\s#])/gm, '$1 $2');

  // 2. Ensure a blank line before headings so CommonMark reliably parses them as headings
  // e.g. "Previous line\n## Heading" -> "Previous line\n\n## Heading"
  text = text.replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2');

  // 3. Ensure code fences have clean newlines before and after
  // e.g. "code:```c" -> "code:\n\n```c"
  text = text.replace(/([^\n])\n?(```[a-z0-9_-]*)/gi, '$1\n\n$2');
  text = text.replace(/(```)\n?([^\n\s`])/gi, '$1\n\n$2');

  return text;
}

function MarkdownBody({
  content,
  isOption,
  className = '',
}: {
  content: string;
  isOption: boolean;
  className?: string;
}) {
  const preprocessed = useMemo(() => {
    const raw = preprocessMarkdown(content);
    return sanitizeRichHtml(raw);
  }, [content]);

  return (
    <div className={`question-rich-content text-inherit leading-relaxed ${isOption ? 'inline-block w-full' : ''} ${className}`}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children, ...props }) => (
            <h1 className="text-base sm:text-lg font-black text-gray-900 dark:text-white mt-4 mb-2 tracking-tight flex items-center gap-2" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mt-3.5 mb-1.5 tracking-tight flex items-center gap-1.5" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FD4A32] dark:text-[#FD4A32] mt-3.5 mb-1.5 flex items-center gap-1.5" {...props}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FD4A32] shrink-0 inline-block" />
              <span>{children}</span>
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mt-2.5 mb-1" {...props}>
              {children}
            </h4>
          ),
          p: ({ children, ...props }) => {
            if (isOption) {
              return (
                <span className="inline text-inherit leading-snug" {...props}>
                  {children}
                </span>
              );
            }
            return (
              <p className="my-1.5 text-inherit leading-relaxed" {...props}>
                {children}
              </p>
            );
          },
          ul: ({ children, ...props }) => (
            <ul className="list-disc pl-5 my-2 space-y-1 text-inherit" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal pl-5 my-2 space-y-1 text-inherit" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="text-inherit leading-relaxed" {...props}>
              {children}
            </li>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-3 border-[#FD4A32] pl-3 py-1.5 my-2.5 italic text-gray-700 dark:text-gray-300 bg-[#FD4A32]/5 dark:bg-[#FD4A32]/10 rounded-r text-xs sm:text-sm" {...props}>
              {children}
            </blockquote>
          ),
          strong: ({ children, ...props }) => (
            <strong className="font-bold text-gray-900 dark:text-white" {...props}>
              {children}
            </strong>
          ),
          hr: ({ ...props }) => (
            <hr className="my-3 border-gray-200 dark:border-gray-800" {...props} />
          ),
          table: ({ children, ...props }) => (
            <div className="my-3 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
              <table className="w-full text-xs border-collapse divide-y divide-gray-200 dark:divide-gray-800" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-gray-50 dark:bg-[#1c1d20] text-gray-700 dark:text-gray-300 font-semibold" {...props}>
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th className="p-2.5 text-left font-bold text-gray-900 dark:text-white" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="p-2.5 text-gray-800 dark:text-gray-200 border-t border-gray-100 dark:border-gray-800/60" {...props}>
              {children}
            </td>
          ),
          pre: ({ children }: any) => {
            if (isOption) {
              return <span className="inline-block my-0.5">{children}</span>;
            }
            return <div className="my-2">{children}</div>;
          },
          code: ({ className: codeClassName, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(codeClassName || '');
            const codeText = String(children || '').replace(/\n$/, '');
            const isMultiLine = codeText.includes('\n');

            if (match || isMultiLine) {
              return (
                <CodeBlockSnippet
                  code={codeText}
                  language={match ? match[1] : undefined}
                  isOption={isOption}
                />
              );
            }

            return (
              <code
                className={
                  isOption
                    ? 'font-mono text-[11px] px-1.5 py-0.5 rounded font-semibold bg-neutral-200/60 dark:bg-[#25262a] text-[#FD4A32] dark:text-[#ff6550] border border-neutral-300/60 dark:border-[#383a40]'
                    : 'font-mono text-xs px-1.5 py-0.5 rounded-md font-semibold bg-neutral-100 dark:bg-[#1f2024] text-[#FD4A32] dark:text-[#ff6550] border border-neutral-200/80 dark:border-neutral-800'
                }
                {...props}
              >
                {children}
              </code>
            );
          },
          img: ({ src, alt, ...props }) => (
            <span className={isOption ? 'inline-block my-0.5' : 'block my-2.5 text-center'}>
              <img
                src={src}
                alt={alt || 'Question Diagram'}
                className={
                  isOption
                    ? 'max-h-16 sm:max-h-20 w-auto max-w-full object-contain rounded border border-[#E9ECEF] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] p-1 shadow-xs inline-block'
                    : 'max-h-72 sm:max-h-80 w-auto max-w-full object-contain rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#16171a] p-2 shadow-xs mx-auto inline-block'
                }
                loading="lazy"
                {...props}
              />
            </span>
          ),
        }}
      >
        {preprocessed}
      </ReactMarkdown>
    </div>
  );
}

export default function QuestionRichContent({
  content,
  className = '',
  isOption = false,
}: QuestionRichContentProps) {
  if (!content) return null;

  // 1. If content contains inline SVG or raw HTML tags, preserve direct high-fidelity SVG/HTML rendering
  const lowerContent = content.toLowerCase();
  if (lowerContent.includes('<svg') || lowerContent.includes('<img') || lowerContent.includes('<table') || lowerContent.includes('<div')) {
    const imgClass = isOption
      ? 'max-h-16 sm:max-h-20 w-auto max-w-full object-contain rounded border border-[#E9ECEF] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] p-1 shadow-xs inline-block my-0.5'
      : 'max-h-72 sm:max-h-96 w-auto max-w-full object-contain rounded-lg border border-[#E9ECEF] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] p-2 shadow-xs mx-auto block my-2';

    const processed = content.replace(
      /!\[(.*?)\]\((.*?)\)/g,
      `<img src="$2" alt="$1" class="${imgClass}" />`
    );

    // Split text and HTML/SVG/Table tags so text gets rich Markdown parsing and SVGs render cleanly
    const parts = processed.split(/(<svg[\s\S]*?<\/svg>|<img[\s\S]*?>|<table[\s\S]*?<\/table>)/gi);

    return (
      <div className={`question-rich-content text-inherit ${isOption ? 'inline-flex items-center gap-2 flex-wrap text-left w-full my-0' : `leading-relaxed ${className}`}`}>
        {parts.map((part, idx) => {
          if (!part) return null;
          const trimmed = part.trim();
          const lower = trimmed.toLowerCase();
          if (lower.startsWith('<svg') || lower.startsWith('<img') || lower.startsWith('<table')) {
            return (
              <div
                key={idx}
                className={
                  isOption
                    ? 'my-0.5 inline-flex items-center justify-start text-left [&_svg]:max-h-14 sm:[&_svg]:max-h-16 [&_svg]:w-auto [&_svg]:h-auto [&_img]:max-h-14 sm:[&_img]:max-h-16 [&_img]:w-auto'
                    : 'my-3 w-full overflow-x-auto flex justify-center items-center text-center [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:rounded-lg [&_img]:max-w-full [&_img]:h-auto [&_table]:w-full [&_table]:border-collapse'
                }
                dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(part) }}
              />
            );
          }
          return (
            <MarkdownBody
              key={idx}
              content={part}
              isOption={isOption}
              className={isOption ? 'inline-block' : 'w-full'}
            />
          );
        })}
      </div>
    );
  }

  // 2. Default: Full Rich Markdown Rendering (code blocks, headers, inline code, bold, lists)
  return (
    <MarkdownBody
      content={content}
      isOption={isOption}
      className={className}
    />
  );
}
