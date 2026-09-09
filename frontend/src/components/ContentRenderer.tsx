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
import { marked } from 'marked';

export interface ContentRendererProps {
  content: string;
  className?: string;
  emptyText?: string;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseTestCasesFromText(rawText: string) {
  if (!rawText?.trim()) return [];
  const clean = rawText
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p>/gi, '\n\n')
    .replace(/<\/?p>/gi, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();

  const regex = /(?:(?:Test\s*Case|Example|Sample)\s*(\d+)[:\s]*)([\s\S]*?)(?=(?:(?:Test\s*Case|Example|Sample)\s*\d+|$))/gi;
  const matches = [...clean.matchAll(regex)];

  if (matches.length === 0) {
    const inputMatch = clean.match(/Input:?\s*([\s\S]*?)(?=Output:|$)/i);
    const outputMatch = clean.match(/Output:?\s*([\s\S]*?)$/i);
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

function generateTestCaseBoxHtml(cases: Array<{ title: string; input: string; output: string }>): string {
  if (!cases || cases.length === 0) return '';
  const caseCards = cases.map((c, idx) => `
<div class="test-case-item" data-type="test-case">
<div class="test-case-header">${escapeHtml(c.title || `Test Case ${idx + 1}`)}</div>
<div class="test-case-io-grid">
<div class="test-case-section">
<span class="test-case-label">Input:</span>
<pre class="test-case-code test-case-input-val">${escapeHtml(c.input)}</pre>
</div>
<div class="test-case-section">
<span class="test-case-label">Output:</span>
<pre class="test-case-code test-case-output-val">${escapeHtml(c.output)}</pre>
</div>
</div>
</div>`).join('\n');

  return `
<div class="test-case-group" data-type="test-case-box" data-cases='${JSON.stringify(cases).replace(/'/g, '&#39;')}'>
<div class="test-case-group-title">🧪 Test Cases</div>
${caseCards}
</div>`;
}

export function transformRawMarkdownToBeautifulHtml(raw: string): string {
  if (!raw?.trim()) return '';

  // 1. Strip delimiter lines (==== or ----) so they never render as ugly text lines or setext headings
  let text = raw.replace(/^[=\-]{5,}\s*$/gm, '').trim();

  // 2. Also strip Setext markdown heading underlines where a line of text is immediately followed by ===== or -----
  text = text.replace(/^([^\n]+)\n[=\-]{5,}\s*$/gm, '## $1');

  // 3. Convert any Test Cases blocks (### Test Cases, ## Test Cases, **Test Cases**, Test Cases\n, Test Cases<br>) into styled HTML cards
  text = text.replace(/(?:(?:^|\n|<p>|<br\s*\/?>)(?:#{1,4}|\*\*|)\s*(?:Test\s*Cases|Example\s*Cases|Examples)\s*:?\s*\*?\*?\s*(?:\n|<br\s*\/?>))([\s\S]*?)(?=(?:\n#{1,4}\s*|\n[=\-]{5,}|$|<\/p>|<\/div>|<div class="question-block))/gi, (match, caseBlock) => {
    // If it already contains test-case-group, do not re-transform
    if (caseBlock.includes('test-case-group') || caseBlock.includes('data-type="test-case-box"')) {
      return match;
    }
    const cases = parseTestCasesFromText(caseBlock);
    if (cases.length > 0) {
      return generateTestCaseBoxHtml(cases);
    }
    return match;
  });

  // 4. Convert any <pre><code> test cases that might be in legacy content
  text = text.replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (match, innerText) => {
    const unescaped = innerText
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
    if (unescaped.includes('Test Case') || unescaped.includes('Example') || (unescaped.includes('Input:') && unescaped.includes('Output:'))) {
      const cases = parseTestCasesFromText(unescaped);
      if (cases.length > 0) {
        return generateTestCaseBoxHtml(cases);
      }
    }
    return match;
  });

  return text;
}

function sanitizeSpacing(html: string): string {
  if (!html) return '';
  return html
    .replace(/(<p>\s*<br\s*\/?>\s*<\/p>)+/gi, '')
    .replace(/(<p>\s*<\/p>)+/gi, '');
}

function renderContentToHTML(content: string): string {
  if (!content?.trim()) return '';
  const preprocessed = transformRawMarkdownToBeautifulHtml(content.trim());

  // If it's already pure HTML and has no top-level markdown headers
  if (preprocessed.startsWith('<') && !/^#{1,6}\s/m.test(preprocessed)) {
    return sanitizeSpacing(preprocessed);
  }

  // If it contains markdown headers, formatting, or mixed HTML
  try {
    const parsed = String(marked.parse(preprocessed));
    return sanitizeSpacing(parsed);
  } catch {
    return sanitizeSpacing(preprocessed);
  }
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

  return (
    <div
      className={wrapCls}
      dangerouslySetInnerHTML={{ __html: renderContentToHTML(content) }}
    />
  );
}