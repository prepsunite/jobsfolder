import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export interface QuestionRichContentProps {
  content: string;
  className?: string;
  isOption?: boolean;
}

export default function QuestionRichContent({
  content,
  className = '',
  isOption = false,
}: QuestionRichContentProps) {
  if (!content) return null;

  // 1. If content contains inline SVG or raw HTML tags, render with high-fidelity direct HTML/SVG parser
  if (content.includes('<svg') || content.includes('<img') || content.includes('<table') || content.includes('<div')) {
    // Convert markdown image syntax to HTML if mixed: ![alt](url) -> <img ... />
    const processed = content.replace(
      /!\[(.*?)\]\((.*?)\)/g,
      '<img src="$2" alt="$1" class="max-h-60 sm:max-h-72 w-auto max-w-full object-contain rounded-lg border border-[#E9ECEF] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] p-2 shadow-xs mx-auto block my-2" />'
    );

    // Split text and HTML/SVG tags so text retains whitespace-pre-line and SVGs render as clean interactive vector elements
    const parts = processed.split(/(<svg[\s\S]*?<\/svg>|<img[\s\S]*?>)/gi);

    return (
      <div className={`question-rich-content leading-relaxed text-inherit ${className}`}>
        {parts.map((part, idx) => {
          if (!part) return null;
          const trimmed = part.trim();
          if (trimmed.startsWith('<svg') || trimmed.startsWith('<img')) {
            return (
              <div
                key={idx}
                className="my-3 overflow-x-auto text-center flex justify-center items-center [&_svg]:max-h-60 sm:[&_svg]:max-h-72 [&_svg]:w-auto [&_svg]:h-auto [&_img]:max-h-60 sm:[&_img]:max-h-72 [&_img]:w-auto"
                dangerouslySetInnerHTML={{ __html: part }}
              />
            );
          }
          return (
            <span key={idx} className="whitespace-pre-line text-inherit inline-block w-full">
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
