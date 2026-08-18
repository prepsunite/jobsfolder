/**
 * ContentRenderer — Smart HTML / Markdown renderer
 *
 * TipTap outputs raw HTML (starts with '<'). ReactMarkdown is a Markdown
 * parser — passing HTML through it mangles base64 img src attributes and
 * drops complex markup. This component detects the format and routes
 * accordingly:
 *
 *  - HTML  -> dangerouslySetInnerHTML  (full fidelity, images/tables/base64 work)
 *  - Markdown -> ReactMarkdown         (backward-compatible with legacy content)
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export interface ContentRendererProps {
  content: string;
  className?: string;
  emptyText?: string;
}

function isHTML(str: string): boolean {
  if (!str?.trim()) return false;
  return str.trim().startsWith('<');
}

function sanitizeSpacing(html: string): string {
  if (!html) return '';
  return html
    .replace(/(<p>\s*<br\s*\/?>\s*<\/p>)+/gi, '')
    .replace(/(<p>\s*<\/p>)+/gi, '');
}

export default function ContentRenderer({
  content,
  className = '',
  emptyText,
}: ContentRendererProps) {
  const wrapCls =
    'prose prose-sm max-w-none dark:prose-invert ' +
    'prose-p:my-1 prose-p:leading-snug ' +
    'prose-headings:font-bold prose-h1:text-xl prose-h2:text-lg ' +
    'prose-h3:text-base prose-h3:text-[#006c49] dark:prose-h3:text-[#6cf8bb] ' +
    'prose-a:text-[#0284c7] dark:prose-a:text-[#38bdf8] prose-a:no-underline hover:prose-a:underline ' +
    'prose-img:rounded-xl prose-img:max-w-full prose-img:h-auto ' +
    'prose-table:w-full prose-th:bg-[#f6ece6] dark:prose-th:bg-[#2b2d31] ' +
    'prose-td:border prose-td:border-[#e2d8d2] dark:prose-td:border-[#383a40] ' +
    'prose-blockquote:border-l-4 prose-blockquote:border-[#006c49] dark:prose-blockquote:border-[#6cf8bb] ' +
    'prose-code:text-[#006c49] dark:prose-code:text-[#6cf8bb] ' +
    'prose-code:bg-[#f6ece6] dark:prose-code:bg-[#2b2d31] ' +
    'text-[#1f1b17] dark:text-[#e3e3e3] ' +
    className;

  if (!content?.trim()) {
    if (emptyText) {
      return <p className="text-xs text-[#747878] dark:text-[#6e7278] italic">{emptyText}</p>;
    }
    return null;
  }

  // TipTap HTML output
  if (isHTML(content)) {
    return (
      <div
        className={wrapCls}
        dangerouslySetInnerHTML={{ __html: sanitizeSpacing(content) }}
      />
    );
  }

  // Legacy Markdown
  return (
    <div className={wrapCls}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ children, ...props }) => (
            <pre className="test-case p-4 bg-[#141517] dark:bg-[#101113] text-[#6cf8bb] dark:text-[#6cf8bb] rounded-xl border border-[#383a40] overflow-x-auto text-xs font-mono whitespace-pre-wrap leading-relaxed my-3" {...props}>
              {children}
            </pre>
          ),
          code: ({ inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <code className="px-1.5 py-0.5 rounded bg-[#f6ece6] dark:bg-[#2b2d31] text-[#006c49] dark:text-[#6cf8bb] text-xs font-mono font-semibold" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className={`font-mono text-xs text-inherit whitespace-pre-wrap ${className || ''}`} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}