import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export interface QuestionRichContentProps {
  content: string;
  className?: string;
  isOption?: boolean;
}

function sanitizeRichHtml(html: string): string {
  if (!html) return '';

  let sanitized = html
    // Strip script blocks and contents
    .replace(/<script\b[\s\S]*?(?:<\/script>|$)/gi, '')
    // Strip iframe, embed, object, form blocks and contents
    .replace(/<(iframe|embed|object|form|applet|meta|link|style|base)\b[\s\S]*?(?:<\/\1>|$)/gi, '')
    .replace(/<(iframe|embed|object|form|applet|meta|link|style|base)[^>]*\/?>/gi, '');

  // Strip event handlers with any leading delimiter (whitespace, slash, quotes, or tag start)
  // e.g. <svg/onload=...>, <div onclick=...>, <img onerror = ...>
  sanitized = sanitized.replace(/[\s\/>]on[a-zA-Z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, ' ');

  // Decode common HTML entities in URI attributes (href, src, xlink:href) to prevent obfuscated javascript: attacks
  for (let i = 0; i < 3; i++) {
    sanitized = sanitized.replace(
      /(href|src|xlink:href|action)\s*=\s*(['"]?)([\s\S]*?)\2(?=[\s\/>])/gi,
      (match, attr, quote, val) => {
        const decoded = val
          .replace(/&#(\d+);?/g, (_: string, num: string) => String.fromCharCode(parseInt(num, 10)))
          .replace(/&#x([0-9a-f]+);?/gi, (_: string, hex: string) => String.fromCharCode(parseInt(hex, 16)))
          .replace(/&tab;/gi, '')
          .replace(/&newline;/gi, '')
          .replace(/[\u0000-\u001F\s]/g, '');

        const lowerDecoded = decoded.toLowerCase();
        if (
          lowerDecoded.startsWith('javascript:') ||
          lowerDecoded.startsWith('vbscript:') ||
          (lowerDecoded.startsWith('data:') && !lowerDecoded.startsWith('data:image/'))
        ) {
          return `${attr}="#"`;
        }
        return match;
      }
    );
  }

  // Final sweep for unquoted or remaining javascript/data URIs
  sanitized = sanitized
    .replace(/(href|src|xlink:href)\s*=\s*['"]?\s*javascript:[^'"]*['"]?/gi, '$1="#"')
    .replace(/(href|src|xlink:href)\s*=\s*['"]?\s*data:(?!image\/)[^'"]*['"]?/gi, '$1="#"');

  return sanitized;
}

export default function QuestionRichContent({
  content,
  className = '',
  isOption = false,
}: QuestionRichContentProps) {
  if (!content) return null;

  // 1. If content contains inline SVG or raw HTML tags, render with high-fidelity direct HTML/SVG parser
  const lowerContent = content.toLowerCase();
  if (lowerContent.includes('<svg') || lowerContent.includes('<img') || lowerContent.includes('<table') || lowerContent.includes('<div')) {
    // Convert markdown image syntax to HTML if mixed: ![alt](url) -> <img ... />
    const imgClass = isOption
      ? 'max-h-16 sm:max-h-20 w-auto max-w-full object-contain rounded border border-[#E9ECEF] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] p-1 shadow-xs inline-block my-0.5'
      : 'max-h-72 sm:max-h-96 w-auto max-w-full object-contain rounded-lg border border-[#E9ECEF] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] p-2 shadow-xs mx-auto block my-2';

    const processed = content.replace(
      /!\[(.*?)\]\((.*?)\)/g,
      `<img src="$2" alt="$1" class="${imgClass}" />`
    );

    // Split text and HTML/SVG/Table tags so text retains whitespace-pre-line and SVGs render as clean interactive vector elements
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
            <span key={idx} className={isOption ? 'text-inherit inline-block' : 'whitespace-pre-line text-inherit inline-block w-full'}>
              {part}
            </span>
          );
        })}
      </div>
    );
  }

  // 2. If content contains markdown image syntax ![alt](url)
  if (content.includes('![')) {
    return (
      <div className={`question-rich-content text-inherit leading-relaxed ${isOption ? 'inline-block w-full' : ''} ${className}`}>
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children, ...props }) => (
              <p className={isOption ? 'inline-block my-0 text-inherit' : 'my-1 text-inherit leading-relaxed'} {...props}>
                {children}
              </p>
            ),
            img: ({ src, alt, ...props }) => (
              <span className="block my-2 text-center">
                <img
                  src={src}
                  alt={alt || 'Question Diagram'}
                  className="max-h-60 sm:max-h-72 w-auto max-w-full object-contain rounded-lg border border-[#E9ECEF] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] p-2 shadow-xs mx-auto inline-block"
                  loading="lazy"
                  {...props}
                />
              </span>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  // 3. Clean fallback for standard plain text
  return (
    <span className={`whitespace-pre-line leading-relaxed ${className}`}>
      {content}
    </span>
  );
}
