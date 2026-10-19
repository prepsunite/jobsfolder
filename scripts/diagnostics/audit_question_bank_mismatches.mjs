import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import {
  FALLBACK_APTITUDE_TOPICS,
  TECHNICAL_MCQ_SUBJECTS,
  CODING_CATEGORIES,
  BUILTIN_BLUEPRINTS
} from '../frontend/src/services/mockExamBlueprint.service.js';
import { expandTopicAliases, resolveTopicSlug, TOPIC_SLUG_MAP, TOPIC_ALIAS_FAMILIES } from '../frontend/src/services/topicMap.js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function runAudit() {
  console.log('===============================================================');
  console.log('AUDITING QUESTION BANK & DB TOPIC NAME MATCHING');
  console.log('===============================================================\n');

  // 1. Fetch DB topic questions
  const dbTopicQuestionsSet = new Set();
  let from = 0;
  const step = 1000;
  while (true) {
    const { data } = await supabase.from('topic_questions').select('topic_id').range(from, from + step - 1);
    if (!data || data.length === 0) break;
    data.forEach(r => dbTopicQuestionsSet.add(r.topic_id));
    if (data.length < step) break;
    from += step;
  }
  console.log(`[DB] Found ${dbTopicQuestionsSet.size} unique topic_ids in topic_questions`);

  // Check FALLBACK_APTITUDE_TOPICS
  const missingFromDb = [];
  const matchedWithAliases = [];
  const fullyMatched = [];

  for (const topic of FALLBACK_APTITUDE_TOPICS) {
    if (dbTopicQuestionsSet.has(topic.id)) {
      fullyMatched.push(topic.id);
    } else {
      const aliases = expandTopicAliases([topic.id]);
      const matchedAlias = aliases.find(a => dbTopicQuestionsSet.has(a));
      if (matchedAlias) {
        matchedWithAliases.push({ topicId: topic.id, matchedAlias });
      } else {
        missingFromDb.push(topic.id);
      }
    }
  }

  console.log(`[FALLBACK_APTITUDE_TOPICS] Total: ${FALLBACK_APTITUDE_TOPICS.length}`);
  console.log(` - Exact DB match: ${fullyMatched.length}`);
  console.log(` - Matched via aliases: ${matchedWithAliases.length}`, matchedWithAliases);
  console.log(` - Missing from DB (0 questions): ${missingFromDb.length}`, missingFromDb);

  // 2. Check technical_mcqs
  const { data: techMcqs } = await supabase.from('technical_mcqs').select('topic_id');
  const dbTechTopics = new Set(techMcqs?.map(t => t.topic_id));
  console.log(`\n[DB] Found ${dbTechTopics.size} unique topic_ids in technical_mcqs:`, Array.from(dbTechTopics));

  const techMissing = [];
  for (const s of TECHNICAL_MCQ_SUBJECTS) {
    if (!dbTechTopics.has(s.id)) {
      const aliases = expandTopicAliases([s.id]);
      const match = aliases.find(a => dbTechTopics.has(a));
      if (!match) techMissing.push(s.id);
    }
  }
  console.log(`[TECHNICAL_MCQ_SUBJECTS] Total: ${TECHNICAL_MCQ_SUBJECTS.length}, Missing:`, techMissing);

  // 3. Check technical_problems
  const { data: codingData } = await supabase.from('technical_problems').select('id, category, topic_id, track');
  const dbCodingCategories = new Set(codingData?.map(c => c.category));
  const dbCodingTopicIds = new Set(codingData?.map(c => c.topic_id));
  console.log(`\n[DB] Found ${dbCodingCategories.size} categories and ${dbCodingTopicIds.size} topic_ids in technical_problems`);

  // 4. Check all Blueprint sections
  console.log(`\n[BLUEPRINTS] Checking all section topic_ids across ${BUILTIN_BLUEPRINTS.length} blueprints...`);
  const blueprintIssues = [];
  for (const bp of BUILTIN_BLUEPRINTS) {
    for (const sec of bp.sections) {
      if (sec.topic_ids && sec.topic_ids.length > 0) {
        for (const t of sec.topic_ids) {
          const isCoding = sec.section_type === 'CODING' || sec.category === 'coding';
          const isTech = sec.section_type === 'TECHNICAL_MCQ' || sec.category === 'technical-mcqs' || sec.category?.startsWith('mcq-');
          if (isCoding) {
            // Check if matches DB category or topic_id or can be mapped
            const expanded = expandTopicAliases([t]);
            const match = expanded.some(a => dbCodingCategories.has(a) || dbCodingCategories.has(a.toUpperCase()) || dbCodingTopicIds.has(a));
            if (!match) {
              blueprintIssues.push({ blueprint: bp.name, section: sec.name, topic: t, type: 'CODING' });
            }
          } else if (isTech) {
            const expanded = expandTopicAliases([t]);
            const match = expanded.some(a => dbTechTopics.has(a));
            if (!match) {
              blueprintIssues.push({ blueprint: bp.name, section: sec.name, topic: t, type: 'TECH_MCQ' });
            }
          } else {
            const expanded = expandTopicAliases([t]);
            const match = expanded.some(a => dbTopicQuestionsSet.has(a));
            if (!match) {
              blueprintIssues.push({ blueprint: bp.name, section: sec.name, topic: t, type: 'APTITUDE_MCQ' });
            }
          }
        }
      }
    }
  }
  console.log(`[BLUEPRINTS] Found ${blueprintIssues.length} unmapped topics in blueprints:`, blueprintIssues);
}

runAudit();
