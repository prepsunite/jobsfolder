/**
 * Paper Question Parser Utility
 * Extracts individual placement problems, constraints, and test cases from 
 * company placement papers, supporting HTML question-blocks, headings, and Markdown.
 */

export interface PaperTestCase {
  title: string;
  input: string;
  output: string;
  explanation?: string;
}

export interface PaperQuestion {
  id: string;
  number: number;
  title: string;
  cleanTitle: string;
  difficulty: 'BASIC' | 'MEDIUM' | 'HARD';
  description: string;
  constraints: string[];
  testCases: PaperTestCase[];
  rawContent?: string;
}

export function cleanHtmlTags(html?: string): string {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .trim();
}

function parseTestCasesFromBlock(blockText: string): PaperTestCase[] {
  if (!blockText) return [];

  // 1. Check for data-cases attribute
  const dataCasesMatch = blockText.match(/data-cases=['"](.*?)['"]/i);
  if (dataCasesMatch) {
    try {
      const decoded = dataCasesMatch[1]
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      const parsed = JSON.parse(decoded);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((tc: any, i: number) => ({
          title: tc.title || `Test Case ${i + 1}`,
          input: (tc.input || '').trim(),
          output: (tc.output || '').trim(),
          explanation: tc.explanation || '',
        }));
      }
    } catch {}
  }

  // 2. Check for manual Test Case / Example regex
  const text = cleanHtmlTags(blockText);
  const regex = /(?:^|\n)\s*(?:Test\s*Case|Example|Sample)\s*(\d+)?[:\s*#]*\n*([\s\S]*?)(?=(?:\n\s*(?:Test\s*Case|Example|Sample)\s*(?:\d+|[:\s*#])|$))/gi;
  const matches = [...text.matchAll(regex)];
  if (matches.length > 0) {
    return matches.map((m, idx) => {
      const num = m[1] || `${idx + 1}`;
      const content = m[2].trim();
      const inMatch = content.match(/Input:?\s*([\s\S]*?)(?=Output:|$)/i);
      const outMatch = content.match(/Output:?\s*([\s\S]*?)$/i);
      return {
        title: `Test Case ${num}`,
        input: inMatch ? inMatch[1].trim() : '',
        output: outMatch ? outMatch[1].trim() : '',
      };
    }).filter(tc => tc.input || tc.output);
  }

  // 3. Fallback: single Input: ... Output: ...
  const inMatch = text.match(/Input:?\s*([\s\S]*?)(?=Output:|$)/i);
  const outMatch = text.match(/Output:?\s*([\s\S]*?)$/i);
  if (inMatch || outMatch) {
    return [{
      title: 'Test Case 1',
      input: inMatch ? inMatch[1].trim() : '',
      output: outMatch ? outMatch[1].trim() : '',
    }];
  }

  return [];
}

export function parsePaperQuestions(rawContent?: string): PaperQuestion[] {
  if (!rawContent || typeof rawContent !== 'string') return [];
  const content = rawContent.trim();
  if (!content) return [];

  const questions: PaperQuestion[] = [];

  // Strategy A: HTML <div class="question-block ...">
  if (content.includes('question-block')) {
    const rawBlocks = content.split(/(?=<div[^>]*class="[^"]*question-block[^"]*")/gi);
    let qIdx = 1;
    for (const b of rawBlocks) {
      if (!b.includes('question-block')) continue;

      const titleMatch = b.match(/<(?:h[1-3]|strong)[^>]*>([\s\S]*?)<\/(?:h[1-3]|strong)>/i);
      const rawTitle = titleMatch ? cleanHtmlTags(titleMatch[1]) : `Question ${qIdx}`;

      const numMatch = rawTitle.match(/^Q(\d+)[\.:\s\-]/i) || rawTitle.match(/^Question\s*(\d+)[\.:\s\-]/i);
      const qNum = numMatch ? parseInt(numMatch[1], 10) : qIdx;
      const cleanTitle = rawTitle.replace(/^Q\d+[\.:\s\-]\s*/i, '').replace(/^Question\s*\d+[\.:\s\-]\s*/i, '').trim();

      // Extract constraints
      const constraints: string[] = [];
      const constraintsMatch = b.match(/<h[2-4][^>]*>Constraints<\/h[2-4]>([\s\S]*?)<\/ul>/i);
      if (constraintsMatch) {
        const liMatches = [...constraintsMatch[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
        liMatches.forEach(li => {
          const c = cleanHtmlTags(li[1]);
          if (c && !c.includes('🧪')) constraints.push(c);
        });
      }

      // Extract description
      let desc = '';
      const descMatch = b.match(/<div class="[^"]*font-sans[^"]*">([\s\S]*?)<\/div>/i);
      if (descMatch) {
        desc = cleanHtmlTags(descMatch[1]);
      } else {
        const beforeConstraints = b.split(/<h[2-4][^>]*>Constraints/i)[0];
        desc = cleanHtmlTags(beforeConstraints).replace(rawTitle, '').trim();
      }

      const testCases = parseTestCasesFromBlock(b);

      let difficulty: 'BASIC' | 'MEDIUM' | 'HARD' = 'MEDIUM';
      if (/easy|basic|simple|palindrome|two sum/i.test(cleanTitle)) difficulty = 'BASIC';
      else if (/hard|advanced|lru cache|median|trapping/i.test(cleanTitle)) difficulty = 'HARD';

      questions.push({
        id: `q-${qNum}-${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        number: qNum,
        title: rawTitle,
        cleanTitle: cleanTitle || rawTitle,
        difficulty,
        description: desc,
        constraints,
        testCases,
        rawContent: b,
      });
      qIdx++;
    }

    if (questions.length > 0) return questions;
  }

  // Strategy B: HTML Headings (<h2>Q1. ...</h2> or <h1>Q1. ...</h1>)
  const headingRegex = /<(h[1-3])[^>]*>(\s*(?:Q\d+|Question\s*\d+)[\.:\s\-][\s\S]*?)<\/\1>/gi;
  const headingMatches = [...content.matchAll(headingRegex)];
  if (headingMatches.length > 0) {
    for (let i = 0; i < headingMatches.length; i++) {
      const match = headingMatches[i];
      const rawTitle = cleanHtmlTags(match[2]);
      const startIndex = match.index;
      const endIndex = (i < headingMatches.length - 1) ? headingMatches[i + 1].index : content.length;
      const blockContent = content.substring(startIndex, endIndex);

      const numMatch = rawTitle.match(/^Q(\d+)[\.:\s\-]/i) || rawTitle.match(/^Question\s*(\d+)[\.:\s\-]/i);
      const qNum = numMatch ? parseInt(numMatch[1], 10) : i + 1;
      const cleanTitle = rawTitle.replace(/^Q\d+[\.:\s\-]\s*/i, '').replace(/^Question\s*\d+[\.:\s\-]\s*/i, '').trim();

      // Extract constraints
      const constraints: string[] = [];
      const constraintsMatch = blockContent.match(/(?:Constraints|<strong>Constraints:?<\/strong>)([\s\S]*?)(?:Test\s*Cases|Example|$)/i);
      if (constraintsMatch) {
        const text = cleanHtmlTags(constraintsMatch[1]);
        text.split('\n')
          .map(l => l.replace(/^[-*•]\s*/, '').trim())
          .filter(Boolean)
          .forEach(c => {
            if (!c.includes('🧪')) constraints.push(c);
          });
      }

      // Extract description
      const descText = cleanHtmlTags(blockContent).replace(rawTitle, '').split(/Constraints/i)[0].trim();
      const testCases = parseTestCasesFromBlock(blockContent);

      let difficulty: 'BASIC' | 'MEDIUM' | 'HARD' = 'MEDIUM';
      if (/easy|basic|simple|palindrome|two sum/i.test(cleanTitle)) difficulty = 'BASIC';
      else if (/hard|advanced|lru cache|median|trapping/i.test(cleanTitle)) difficulty = 'HARD';

      questions.push({
        id: `q-${qNum}-${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        number: qNum,
        title: rawTitle,
        cleanTitle: cleanTitle || rawTitle,
        difficulty,
        description: descText,
        constraints,
        testCases,
        rawContent: blockContent,
      });
    }

    if (questions.length > 0) return questions;
  }

  // Strategy C: Markdown Headings (# Q1. ... or ### Q1. ...)
  const mdRegex = /(?:^|\n)\s*#{1,4}\s*((?:Q\d+|Question\s*\d+)[\.:\s\-][^\n]+)/gi;
  const mdMatches = [...content.matchAll(mdRegex)];
  if (mdMatches.length > 0) {
    for (let i = 0; i < mdMatches.length; i++) {
      const match = mdMatches[i];
      const rawTitle = match[1].trim();
      const startIndex = match.index;
      const endIndex = (i < mdMatches.length - 1) ? mdMatches[i + 1].index : content.length;
      const blockContent = content.substring(startIndex, endIndex);

      const numMatch = rawTitle.match(/^Q(\d+)[\.:\s\-]/i) || rawTitle.match(/^Question\s*(\d+)[\.:\s\-]/i);
      const qNum = numMatch ? parseInt(numMatch[1], 10) : i + 1;
      const cleanTitle = rawTitle.replace(/^Q\d+[\.:\s\-]\s*/i, '').replace(/^Question\s*\d+[\.:\s\-]\s*/i, '').trim();

      const testCases = parseTestCasesFromBlock(blockContent);
      const descText = cleanHtmlTags(blockContent).replace(rawTitle, '').split(/Constraints/i)[0].trim();

      let difficulty: 'BASIC' | 'MEDIUM' | 'HARD' = 'MEDIUM';
      if (/easy|basic|simple|palindrome|two sum/i.test(cleanTitle)) difficulty = 'BASIC';
      else if (/hard|advanced|lru cache|median|trapping/i.test(cleanTitle)) difficulty = 'HARD';

      questions.push({
        id: `q-${qNum}-${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        number: qNum,
        title: rawTitle,
        cleanTitle: cleanTitle || rawTitle,
        difficulty,
        description: descText,
        constraints: [],
        testCases,
        rawContent: blockContent,
      });
    }

    if (questions.length > 0) return questions;
  }

  return [];
}
