import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { BUILTIN_BLUEPRINTS } from '../frontend/src/services/mockExamBlueprint.service.js';
import { expandTopicAliases } from '../frontend/src/services/topicMap.js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function testAllBlueprints() {
  console.log('======================================================');
  console.log(`TESTING ALL ${BUILTIN_BLUEPRINTS.length} BUILTIN BLUEPRINTS AGAINST REAL SUPABASE TABLES`);
  console.log('======================================================\n');

  let zeroCount = 0;
  let lowCount = 0;
  let passCount = 0;

  for (const bp of BUILTIN_BLUEPRINTS) {
    console.log(`📌 Blueprint: "${bp.name}" (${bp.sections.length} sections)`);

    for (let sIdx = 0; sIdx < bp.sections.length; sIdx++) {
      const sec = bp.sections[sIdx];
      const isCoding = sec.section_type === 'CODING';
      const isTechnicalMcq = sec.section_type === 'TECHNICAL_MCQ' ||
        sec.category === 'technical-mcqs' ||
        sec.category?.startsWith('mcq-');
      const isMcq = !isCoding && !isTechnicalMcq;

      let foundCount = 0;

      if (isCoding) {
        let codingQuery = supabase
          .from('technical_problems')
          .select('id, title, category, topic_id, level')
          .eq('is_deleted', false);

        if (sec.topic_ids && sec.topic_ids.length > 0) {
          const expanded = expandTopicAliases(sec.topic_ids);
          const targetCats = new Set();
          expanded.forEach(t => {
            targetCats.add(t);
            targetCats.add(t.toUpperCase());
            targetCats.add(t.toLowerCase());
          });
          codingQuery = codingQuery.in('category', Array.from(targetCats));
        }
        const { data } = await codingQuery.limit(100);
        foundCount = data ? data.length : 0;
      } else if (isTechnicalMcq) {
        let allowedTopics = sec.topic_ids && sec.topic_ids.length > 0
          ? expandTopicAliases(sec.topic_ids)
          : (sec.category && sec.category.startsWith('mcq-'))
          ? expandTopicAliases([sec.category])
          : [];

        if (allowedTopics.length === 0) {
          allowedTopics = [
            'mcq-c-programming', 'mcq-cpp-programming', 'mcq-java-programming', 'mcq-python-programming',
            'mcq-oops-concepts', 'mcq-database-systems', 'mcq-operating-systems', 'mcq-computer-networks',
            'mcq-data-structures', 'mcq-pseudo-code'
          ];
        }

        let mcqQuery = supabase
          .from('technical_mcqs')
          .select('id, topic_id')
          .eq('is_deleted', false);
        
        if (allowedTopics.length > 0) {
          mcqQuery = mcqQuery.in('topic_id', allowedTopics);
        }
        const { data } = await mcqQuery.limit(100);
        foundCount = data ? data.length : 0;
      } else {
        // Aptitude MCQ in topic_questions table
        const hasTopicIds = sec.topic_ids && sec.topic_ids.length > 0;
        const allowedTopicIds = hasTopicIds ? expandTopicAliases(sec.topic_ids) : [];

        let aptQuery = supabase
          .from('topic_questions')
          .select('id, topic_id')
          .eq('is_deleted', false);
        
        if (allowedTopicIds.length > 0) {
          aptQuery = aptQuery.in('topic_id', allowedTopicIds);
        }
        const { data } = await aptQuery.limit(100);
        foundCount = data ? data.length : 0;
      }

      let status = '✅ PASS';
      if (foundCount === 0) {
        status = '❌ ZERO';
        zeroCount++;
      } else if (foundCount < sec.question_count) {
        status = '⚠️ LOW';
        lowCount++;
      } else {
        passCount++;
      }

      console.log(`  Section ${sIdx + 1}: "${sec.name}" (${sec.section_type}) -> Needed: ${sec.question_count}, Found: ${foundCount} [${status}]`);
      if (foundCount === 0) {
        console.log(`     ⚠️ DETAILS: category="${sec.category}", topic_ids=${JSON.stringify(sec.topic_ids)}`);
      }
    }
    console.log('');
  }

  console.log(`======================================================`);
  console.log(`AUDIT SUMMARY: ${passCount} PASSED, ${lowCount} LOW, ${zeroCount} ZERO`);
  console.log(`======================================================`);
}

testAllBlueprints();
