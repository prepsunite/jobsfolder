import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('frontend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function auditQuestionBank() {
  console.log('--- Fetching technical_problems from Supabase ---');
  let allRows = [];
  let page = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('technical_problems')
      .select('id, title, topic_id, category, category_label, track, level, is_deleted, test_cases, sample_cases, hidden_test_cases')
      .range(page * pageSize, (page + 1) * pageSize - 1);
    
    if (error) {
      console.error('Fetch error:', error);
      break;
    }
    allRows = allRows.concat(data || []);
    if (!data || data.length < pageSize) break;
    page++;
  }

  console.log(`Total rows in technical_problems: ${allRows.length}`);
  const activeRows = allRows.filter(r => !r.is_deleted);
  console.log(`Active rows: ${activeRows.length}`);

  // Tally topic_ids and categories
  const topicIdCounts = {};
  const categoryCounts = {};
  const categoryLabelCounts = {};
  const trackCounts = {};
  const levelCounts = {};

  let emptyTestCases = 0;
  let populatedTestCases = 0;

  activeRows.forEach(r => {
    topicIdCounts[r.topic_id] = (topicIdCounts[r.topic_id] || 0) + 1;
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
    categoryLabelCounts[r.category_label] = (categoryLabelCounts[r.category_label] || 0) + 1;
    trackCounts[r.track] = (trackCounts[r.track] || 0) + 1;
    levelCounts[r.level] = (levelCounts[r.level] || 0) + 1;

    let hasTc = false;
    if (Array.isArray(r.test_cases) && r.test_cases.length > 0) hasTc = true;
    else if (typeof r.test_cases === 'string' && r.test_cases.trim().startsWith('[') && r.test_cases.length > 10) hasTc = true;

    if (hasTc) populatedTestCases++;
    else emptyTestCases++;
  });

  console.log('\n--- TOPIC_ID DISTRIBUTION IN DB ---');
  console.table(topicIdCounts);

  console.log('\n--- CATEGORY DISTRIBUTION IN DB ---');
  console.table(categoryCounts);

  console.log('\n--- CATEGORY_LABEL DISTRIBUTION IN DB ---');
  console.table(categoryLabelCounts);

  console.log('\n--- TRACK DISTRIBUTION IN DB ---');
  console.table(trackCounts);

  console.log(`\nTest cases in DB: ${populatedTestCases} populated, ${emptyTestCases} empty`);

  // Inspect the lc- rows in DB specifically
  const lcRows = activeRows.filter(r => r.id.startsWith('lc-'));
  console.log(`\nTotal lc-* rows in DB: ${lcRows.length}`);
  const lcTopicIds = {};
  const lcCategories = {};
  const lcCategoryLabels = {};
  lcRows.forEach(r => {
    lcTopicIds[r.topic_id] = (lcTopicIds[r.topic_id] || 0) + 1;
    lcCategories[r.category] = (lcCategories[r.category] || 0) + 1;
    lcCategoryLabels[r.category_label] = (lcCategoryLabels[r.category_label] || 0) + 1;
  });
  console.log('LC topic_id in DB:', lcTopicIds);
  console.log('LC category in DB:', lcCategories);
  console.log('LC category_label in DB:', lcCategoryLabels);

  // Check how blueprints or TPO exam creation queries technical_problems!
}

auditQuestionBank();
