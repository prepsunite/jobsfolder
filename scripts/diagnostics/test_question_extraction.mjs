import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

function extractQuestionsFromContent(htmlOrMd) {
  if (!htmlOrMd || typeof htmlOrMd !== 'string') return [];
  const text = htmlOrMd.trim();
  if (!text) return [];

  const questions = [];

  // Pattern 1: <div class="question-block ...">
  if (text.includes('question-block')) {
    // Split by <div class="question-block
    const blocks = text.split(/(?=<div[^>]*class="[^"]*question-block[^"]*")/gi);
    for (const b of blocks) {
      if (!b.includes('question-block')) continue;
      // Extract title from <h2> or <h1> or <h3>
      const titleMatch = b.match(/<(?:h[1-3]|strong)[^>]*>([\s\S]*?)<\/(?:h[1-3]|strong)>/i);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'Practice Problem';

      // Extract test cases if any
      const tcMatch = b.match(/data-cases='([^']+)'/i) || b.match(/data-cases="([^"]+)"/i);
      let testCases = [];
      if (tcMatch) {
        try {
          testCases = JSON.parse(tcMatch[1].replace(/&#39;/g, "'").replace(/&quot;/g, '"'));
        } catch {}
      }

      questions.push({
        type: 'question-block',
        title,
        hasTestCases: testCases.length,
        length: b.length
      });
    }
    if (questions.length > 0) return questions;
  }

  // Pattern 2: HTML <h2>Q...</h2> or <h1>Q...</h1>
  const headingRegex = /<(h[1-3])[^>]*>(\s*Q\d+[\.:\s\-][\s\S]*?)<\/\1>/gi;
  const matches = [...text.matchAll(headingRegex)];
  if (matches.length > 0) {
    for (const m of matches) {
      questions.push({
        type: 'html-heading',
        title: m[2].replace(/<[^>]+>/g, '').trim(),
        hasTestCases: 0,
        length: 0
      });
    }
    return questions;
  }

  // Pattern 3: Markdown ### Q... or # Q...
  const mdRegex = /(?:^|\n)\s*#{1,4}\s*(Q\d+[\.:\s\-][^\n]+)/gi;
  const mdMatches = [...text.matchAll(mdRegex)];
  if (mdMatches.length > 0) {
    for (const m of mdMatches) {
      questions.push({
        type: 'md-heading',
        title: m[1].trim(),
        hasTestCases: 0,
        length: 0
      });
    }
    return questions;
  }

  return [];
}

async function testExtraction() {
  const { data: exams } = await supabase
    .from('exams')
    .select('id, name, paper_tabs')
    .eq('is_deleted', false);

  console.log('Testing question extraction across all active papers:\n');
  for (const e of exams) {
    const tabs = e.paper_tabs || [];
    for (const t of tabs) {
      if (!t.content) continue;
      const qs = extractQuestionsFromContent(t.content);
      console.log(`Exam "${e.name}" -> Tab "${t.title}": detected ${qs.length} questions`);
      if (qs.length > 0) {
        qs.slice(0, 3).forEach(q => console.log(`   • [${q.type}] ${q.title} (TestCases: ${q.hasTestCases})`));
        if (qs.length > 3) console.log(`   ... and ${qs.length - 3} more`);
      }
    }
  }
}

testExtraction().catch(console.error);
