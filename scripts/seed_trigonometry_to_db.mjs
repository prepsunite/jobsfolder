import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const filePath = path.resolve('database/datasets/trigonometry_all_50.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const questions = JSON.parse(rawData);

  console.log(`Loaded ${questions.length} questions from ${filePath}`);

  // Map to exact database schema
  const rows = questions.map((q) => ({
    id: q.id,
    topic_id: q.topic_id || 'trigonometry',
    company_slug: q.company_slug || 'general',
    statement: q.statement,
    options: JSON.stringify(q.options),
    correct_answer: q.correct_answer,
    explanation: q.explanation,
    structured_explanation: JSON.stringify(q.structured_explanation),
    difficulty: q.difficulty,
    difficulty_level: q.difficulty_level,
    question_number: q.question_number,
    is_hidden: false,
    is_deleted: false
  }));

  const { data, error } = await supabase
    .from('topic_questions')
    .upsert(rows, { onConflict: 'id' });

  if (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }

  console.log(`Successfully seeded ${rows.length} questions for trigonometry into topic_questions!`);

  // Verify
  const { count, error: countErr } = await supabase
    .from('topic_questions')
    .select('*', { count: 'exact', head: true })
    .eq('topic_id', 'trigonometry')
    .eq('is_deleted', false);

  if (countErr) {
    console.error('Count error:', countErr);
  } else {
    console.log(`Verified total active questions in DB for 'trigonometry': ${count}`);
  }
}

seed();
