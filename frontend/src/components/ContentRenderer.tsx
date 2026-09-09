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

function parseTestCasesFromText(rawText: string) {
  if (!rawText?.trim()) return [];
  const regex = /(?:Test\s*Case\s*(\d+)[:\s]*)([\s\S]*?)(?=(?:Test\s*Case\s*\d+|$))/gi;
  const matches = [...rawText.matchAll(regex)];

  if (matches.length === 0) {
    const inputMatch = rawText.match(/Input:?\s*([\s\S]*?)(?=Output:|$)/i);
    const outputMatch = rawText.match(/Output:?\s*([\s\S]*?)$/i);
    if (inputMatch || outputMatch) {
      return [{
        title: 'Test Case 1',
        input: inputMatch ? inputMatch[1].trim() : '',
        output: outputMatch ? outputMatch[1].trim() : '',
      }];
    }
    return [];
  }

  return matches.map((m, idx) => {
    const caseNum = m[1] || `${idx + 1}`;
    const content = m[2].trim();
    const inputMatch = content.match(/Input:?\s*([\s\S]*?)(?=Output:|$)/i);
    const outputMatch = content.match(/Output:?\s*([\s\S]*?)$/i);

    return {
      title: `Test Case ${caseNum}`,
      input: inputMatch ? inputMatch[1].trim() : '',
      output: outputMatch ? outputMatch[1].trim() : '',
    };
  });
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
    'prose-h3:text-base prose-h3:text-[#FD4A32] dark:prose-h3:text-[#FD4A32] ' +
    'prose-a:text-[#0284c7] dark:prose-a:text-[#38bdf8] prose-a:no-underline hover:prose-a:underline ' +
    'prose-img:rounded-xl prose-img:max-w-full prose-img:h-auto ' +
    'prose-table:w-full prose-th:bg-[#F8F9FA] dark:prose-th:bg-[#2b2d31] ' +
    'prose-td:border prose-td:border-[#E9ECEF] dark:prose-td:border-[#383a40] ' +
    'prose-blockquote:border-l-4 prose-blockquote:border-[#FD4A32] dark:prose-blockquote:border-[#FD4A32] ' +
    'prose-code:text-[#FD4A32] dark:prose-code:text-[#FD4A32] ' +
    'prose-code:bg-[#F8F9FA] dark:prose-code:bg-[#2b2d31] ' +
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
          pre: ({ children, ...props }: any) => {
            const rawText = React.Children.toArray(children)
              .map((child: any) => (typeof child === 'string' ? child : child?.props?.children || ''))
              .join('');

            const cases = (rawText.includes('Test Case') || (rawText.includes('Input:') && rawText.includes('Output:')))
              ? parseTestCasesFromText(rawText)
              : [];

            if (cases.length > 0) {
              return (
                <div className="test-case-group" data-type="test-case-box">
                  <div className="test-case-group-title">🧪 Test Cases</div>
                  {cases.map((c, idx) => (
                    <div key={idx} className="test-case-item" data-type="test-case">
                      <div className="test-case-header">{c.title || `Test Case ${idx + 1}`}</div>
                      <div className="test-case-io-grid">
                        <div className="test-case-section">
                          <span className="test-case-label">Input</span>
                          <pre className="test-case-code test-case-input-val">{c.input}</pre>
                        </div>
                        <div className="test-case-section">
                          <span className="test-case-label">Output</span>
                          <pre className="test-case-code test-case-output-val">{c.output}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <pre className="test-case p-4 bg-[#141517] dark:bg-[#101113] text-[#FD4A32] dark:text-[#FD4A32] rounded-xl border border-[#383a40] overflow-x-auto text-xs font-mono whitespace-pre-wrap leading-relaxed my-3" {...props}>
                {children}
              </pre>
            );
          },
          code: ({ inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <code className="px-1.5 py-0.5 rounded bg-[#F8F9FA] dark:bg-[#2b2d31] text-[#FD4A32] dark:text-[#FD4A32] text-xs font-mono font-semibold" {...props}>
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