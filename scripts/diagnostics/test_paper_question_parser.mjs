import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

function cleanHtmlTags(html) {
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

function parseTestCasesFromBlock(blockText) {
  if (!blockText) return [];
  
  // 1. Check for data-cases in HTML
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
        return parsed.map((tc, i) => ({
          title: tc.title || `Test Case ${i + 1}`,
          input: (tc.input || '').trim(),
          output: (tc.output || '').trim(),
          explanation: tc.explanation || ''
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
        output: outMatch ? outMatch[1].trim() : ''
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
      output: outMatch ? outMatch[1].trim() : ''
    }];
  }

  return [];
}

function parsePaperQuestions(rawContent) {
  if (!rawContent || typeof rawContent !== 'string') return [];
  const content = rawContent.trim();
  if (!content) return [];

  const questions = [];

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
      const constraints = [];
      const constraintsMatch = b.match(/<h[2-4][^>]*>Constraints<\/h[2-4]>([\s\S]*?)<\/ul>/i);
      if (constraintsMatch) {
        const liMatches = [...constraintsMatch[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
        liMatches.forEach(li => constraints.push(cleanHtmlTags(li[1])));
      }

      // Extract description
      let desc = '';
      const descMatch = b.match(/<div class="[^"]*font-sans[^"]*">([\s\S]*?)<\/div>/i);
      if (descMatch) {
        desc = cleanHtmlTags(descMatch[1]);
      } else {
        // Fallback: extract text before constraints
        const beforeConstraints = b.split(/<h[2-4][^>]*>Constraints/i)[0];
        desc = cleanHtmlTags(beforeConstraints).replace(rawTitle, '').trim();
      }

      const testCases = parseTestCasesFromBlock(b);

      // Infer difficulty based on problem type
      let difficulty = 'MEDIUM';
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
        rawContent: b
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
      const constraints = [];
      const constraintsMatch = blockContent.match(/(?:Constraints|<strong>Constraints:?<\/strong>)([\s\S]*?)(?:Test\s*Cases|Example|$)/i);
      if (constraintsMatch) {
        const text = cleanHtmlTags(constraintsMatch[1]);
        text.split('\n').map(l => l.replace(/^[-*•]\s*/, '').trim()).filter(Boolean).forEach(c => constraints.push(c));
      }

      // Extract description
      const descText = cleanHtmlTags(blockContent).replace(rawTitle, '').split(/Constraints/i)[0].trim();
      const testCases = parseTestCasesFromBlock(blockContent);

      let difficulty = 'MEDIUM';
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
        rawContent: blockContent
      });
    }

    if (questions.length > 0) return questions;
  }

  return [];
}

async function verifyAllExams() {
  const { data: exams } = await supabase
    .from('exams')
    .select('id, name, paper_tabs')
    .eq('is_deleted', false);

  console.log('Testing full question parsing across all 17 active exams:\n');
  let totalParsedQuestions = 0;

  for (const e of exams) {
    const tabs = e.paper_tabs || [];
    for (const t of tabs) {
      if (!t.content) continue;
      const qs = parsePaperQuestions(t.content);
      if (qs.length > 0) {
        totalParsedQuestions += qs.length;
        console.log(`Exam: "${e.name}" -> Tab "${t.title}": ${qs.length} questions parsed!`);
        console.log(`   Sample Q1: "${qs[0].title}" [${qs[0].difficulty}]`);
        console.log(`   Description length: ${qs[0].description.length} chars`);
        console.log(`   Constraints: ${qs[0].constraints.length} items (${qs[0].constraints.slice(0, 2).join('; ')})`);
        console.log(`   Test Cases: ${qs[0].testCases.length} cases`);
        if (qs[0].testCases.length > 0) {
          console.log(`     - TC1 In: ${JSON.stringify(qs[0].testCases[0].input.slice(0, 30))} -> Out: ${JSON.stringify(qs[0].testCases[0].output.slice(0, 30))}`);
        }
      }
    }
  }

  console.log(`\nTotal questions parsed across entire archive: ${totalParsedQuestions}`);
}

verifyAllExams().catch(console.error);
