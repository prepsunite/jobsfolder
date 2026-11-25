/**
 * Server-Authoritative & Balanced Mock Exam Question Pooling Engine
 *
 * Uses `supabaseAdmin` (via /api/campus-exams) so TPOs and Pro/Ultra students
 * can pool from protected tables (technical_problems, technical_mcqs, topic_questions)
 * without exposing raw answer keys, explanations, or hidden test cases to the browser.
 *
 * Also guarantees balanced round-robin mixing across all selected topics/domains
 * so multi-topic exams accurately reflect every topic requested by the TPO.
 */

export const DEFAULT_PASSAGE_TOPICS = new Set([
  'reading-comprehension',
  'cloze-test',
  'table-charts',
  'line-charts',
  'bar-charts',
  'pie-charts',
  'caselet-di',
  'missing-di',
  'radar-web-charts',
  'scatter-bubble-charts',
  'floor-scheduling-puzzles',
  'games-and-tournaments',
  'logical-games',
  'machine-input-output',
  'making-judgments',
]);

export const TECHNICAL_APTITUDE_TO_MCQ_MAP = {
  'pseudocode-tracing': ['mcq-pseudo-code'],
  'bitwise-operators': ['mcq-c-programming', 'mcq-cpp-programming'],
  'recursion-functions': ['mcq-c-programming', 'mcq-data-structures'],
  'attention-to-detail': ['mcq-pseudo-code', 'mcq-oops-concepts'],
  'code-debugging-logic': ['mcq-c-programming', 'mcq-cpp-programming', 'mcq-java-programming'],
  'cloud-networking-basics': ['mcq-computer-networks'],
};

export const ALL_CORE_CS_MCQ_TOPICS = [
  'mcq-c-programming',
  'mcq-cpp-programming',
  'mcq-java-programming',
  'mcq-python-programming',
  'mcq-oops-concepts',
  'mcq-database-systems',
  'mcq-operating-systems',
  'mcq-computer-networks',
  'mcq-data-structures',
  'mcq-pseudo-code',
];

export const APTITUDE_CATEGORY_VARIANTS = {
  'arithmetic-aptitude': ['arithmetic-aptitude', 'quantitative-aptitude', 'quant', 'numbers'],
  'quantitative-aptitude': ['arithmetic-aptitude', 'quantitative-aptitude', 'quant', 'numbers'],
  quant: ['arithmetic-aptitude', 'quantitative-aptitude', 'quant', 'numbers'],
  'data-interpretation': ['data-interpretation', 'di'],
  di: ['data-interpretation', 'di'],
  'logical-reasoning': ['logical-reasoning', 'logic', 'reasoning'],
  logic: ['logical-reasoning', 'logic', 'reasoning'],
  reasoning: ['logical-reasoning', 'logic', 'reasoning'],
  'verbal-reasoning': ['verbal-reasoning', 'vr'],
  vr: ['verbal-reasoning', 'vr'],
  'verbal-ability': ['verbal-ability', 'verbal', 'english'],
  verbal: ['verbal-ability', 'verbal', 'english'],
  english: ['verbal-ability', 'verbal', 'english'],
  'nonverbal-reasoning': ['nonverbal-reasoning', 'non-verbal-reasoning', 'nonverbal', 'non-verbal', 'nv'],
  'non-verbal-reasoning': ['nonverbal-reasoning', 'non-verbal-reasoning', 'nonverbal', 'non-verbal', 'nv'],
  nonverbal: ['nonverbal-reasoning', 'non-verbal-reasoning', 'nonverbal', 'non-verbal', 'nv'],
  'technical-aptitude': ['technical-aptitude', 'tech-aptitude'],
  'tech-aptitude': ['technical-aptitude', 'tech-aptitude'],
};

export const CODING_TOPIC_TO_DB_CATEGORIES = {
  TWO_POINTERS: ['POINTERS_ARRAYS', 'TWO_POINTERS'],
  SLIDING_WINDOW: ['POINTERS_ARRAYS', 'SLIDING_WINDOW'],
  POINTERS_ARRAYS: ['POINTERS_ARRAYS', 'TWO_POINTERS', 'SLIDING_WINDOW'],
  LINKED_LISTS: ['LINEAR_STRUCTURES', 'LINKED_LISTS'],
  STACKS_QUEUES: ['LINEAR_STRUCTURES', 'STACKS_QUEUES'],
  LINEAR_STRUCTURES: ['LINEAR_STRUCTURES', 'LINKED_LISTS', 'STACKS_QUEUES'],
  TREES_BINARY_TREES: ['HIERARCHICAL_STRUCTURES', 'TREES_BINARY_TREES'],
  HIERARCHICAL_STRUCTURES: ['HIERARCHICAL_STRUCTURES', 'TREES_BINARY_TREES'],
  SEARCH_INTERVALS: ['SEARCH_INTERVALS', 'SEARCHING', 'SEARCHING_SORTING'],
  SEARCHING_SORTING: ['SEARCHING', 'SEARCH_INTERVALS', 'SEARCHING_SORTING'],
  EXHAUSTIVE_SEARCH_DP: ['EXHAUSTIVE_SEARCH_DP', 'DYNAMIC_PROGRAMMING'],
  DYNAMIC_PROGRAMMING: ['EXHAUSTIVE_SEARCH_DP', 'DYNAMIC_PROGRAMMING'],
  NETWORK_GRAPH_ALGORITHMS: ['NETWORK_GRAPH_ALGORITHMS', 'GRAPHS'],
  GRAPHS: ['NETWORK_GRAPH_ALGORITHMS', 'GRAPHS'],
  ARRAYS: ['ARRAYS', 'POINTERS_ARRAYS'],
  STRINGS: ['STRINGS'],
  SYNTAX_BASICS: ['SYNTAX_BASICS'],
  NUMBER_LOGIC: ['NUMBER_LOGIC'],
  PATTERNS: ['PATTERNS'],
  MATRICES: ['MATRICES', 'ARRAYS'],
  RECURSION: ['RECURSION', 'EXHAUSTIVE_SEARCH_DP'],
  BIT_MANIPULATION: ['BIT_MANIPULATION'],
  SEARCHING: ['SEARCHING', 'SEARCH_INTERVALS', 'SEARCHING_SORTING'],
};

export const CODING_TOPIC_TITLE_KEYWORDS = {
  LINKED_LISTS: ['list', 'linked list', 'node', 'cycle', 'reverse list', 'sort list', 'merge list', 'reorder list'],
  STACKS_QUEUES: ['stack', 'queue', 'parentheses', 'histogram', 'polish', 'greater element', 'temperatures'],
  TWO_POINTERS: ['pointer', 'two sum', '3sum', 'water', 'duplicate', 'palindrome', 'sorted', 'reverse'],
  SLIDING_WINDOW: ['window', 'subarray', 'substring', 'longest', 'k distinct', 'minimum window'],
  TREES_BINARY_TREES: ['tree', 'bst', 'binary tree', 'traversal', 'depth', 'diameter', 'ancestor', 'invert'],
  DYNAMIC_PROGRAMMING: ['dp', 'knapsack', 'subsequence', 'coin', 'jump', 'stock', 'path', 'climb', 'house robber'],
  SEARCHING_SORTING: ['search', 'binary search', 'sort', 'rotated', 'median', 'peak', 'find minimum'],
};

const TOPIC_ALIAS_LOOKUP = {
  'vr-blood-relations': ['vr-blood-relations', 'blood-relations'],
  'vr-seating-arrangement': ['vr-seating-arrangement', 'seating-arrangement'],
  'vr-direction-sense': ['vr-direction-sense', 'direction-sense'],
  'vr-dice-cube': ['vr-dice-cube', 'cubes-and-dice'],
  'vr-analogy': ['vr-analogy', 'analogies'],
  'vr-syllogism': ['vr-syllogism', 'syllogisms', 'syllogism'],
  'vr-cause-effect': ['vr-cause-effect', 'cause-and-effect'],
  'vr-arguments': ['vr-arguments', 'statement-and-argument'],
  'vr-assumptions': ['vr-assumptions', 'statement-and-assumption'],
  'vr-conclusions': ['vr-conclusions', 'statement-and-conclusion'],
  'hcf-lcm': ['hcf-lcm', 'hcf-and-lcm', 'hcf and lcm'],
  'surds-and-indices': ['surds-and-indices', 'surds-indices'],
  'surds-indices': ['surds-indices', 'surds-and-indices'],
  'scatter-bubble-charts': ['scatter-bubble-charts', 'scatter-plots'],
  'scatter-plots': ['scatter-plots', 'scatter-bubble-charts'],
  'syllogisms': ['syllogisms', 'syllogism'],
};

export function fisherYatesShuffle(items) {
  const arr = [...(items || [])];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function expandTopicAliasesServer(topicIds) {
  const result = new Set();
  for (const raw of topicIds || []) {
    if (!raw) continue;
    const clean = String(raw).trim();
    const lower = clean.toLowerCase();
    result.add(clean);
    result.add(lower);
    result.add(lower.replace(/-/g, ' '));
    result.add(lower.replace(/-/g, '_'));
    result.add(lower.replace(/_/g, '-'));
    if (TOPIC_ALIAS_LOOKUP[lower]) {
      for (const a of TOPIC_ALIAS_LOOKUP[lower]) result.add(a);
    }
  }
  return Array.from(result);
}

/**
 * Deals items evenly round-robin across topic buckets so mixed sections reflect
 * all selected topics proportionally instead of being dominated by the largest/first topic.
 */
export function roundRobinSampleFromBuckets(bucketsMap, neededCount, usedIds) {
  const picked = [];
  const entries = Array.from(bucketsMap.entries()).map(([k, list]) => ({
    key: k,
    queue: list.filter((row) => row?.id && !usedIds.has(row.id)),
    idx: 0,
  }));
  const active = fisherYatesShuffle(entries);

  let progressed = true;
  while (picked.length < neededCount && progressed) {
    progressed = false;
    for (const bucket of active) {
      while (bucket.idx < bucket.queue.length && usedIds.has(bucket.queue[bucket.idx].id)) {
        bucket.idx += 1;
      }
      if (bucket.idx < bucket.queue.length) {
        const item = bucket.queue[bucket.idx++];
        usedIds.add(item.id);
        picked.push(item.id);
        progressed = true;
        if (picked.length >= neededCount) break;
      }
    }
  }
  return picked;
}

function stratifyDifficultyList(rows) {
  const easy = fisherYatesShuffle(rows.filter((r) => ['EASY', 'BASIC'].includes(String(r.difficulty || r.level || '').toUpperCase())));
  const hard = fisherYatesShuffle(rows.filter((r) => String(r.difficulty || r.level || '').toUpperCase() === 'HARD'));
  const med = fisherYatesShuffle(rows.filter((r) => !['EASY', 'BASIC', 'HARD'].includes(String(r.difficulty || r.level || '').toUpperCase())));

  // Interleave Easy/Med/Hard proportionally so taking prefix N preserves difficulty balance
  const merged = [];
  const total = rows.length || 1;
  let ei = 0;
  let mi = 0;
  let hi = 0;
  while (merged.length < total && (ei < easy.length || mi < med.length || hi < hard.length)) {
    if (mi < med.length) merged.push(med[mi++]);
    if (ei < easy.length) merged.push(easy[ei++]);
    if (mi < med.length) merged.push(med[mi++]);
    if (hi < hard.length) merged.push(hard[hi++]);
  }
  return merged;
}

function matchesDifficulty(rawLevel, targetDiff) {
  const diff = String(targetDiff || 'ALL').toUpperCase();
  if (!diff || diff === 'ALL') return true;
  const lvl = String(rawLevel || '').toUpperCase();
  if (diff === 'EASY') return lvl === 'EASY' || lvl === 'BASIC';
  return lvl === diff;
}

function hasUsableCodingTests(q) {
  return (
    (Array.isArray(q?.test_cases) && q.test_cases.length > 0) ||
    (Array.isArray(q?.sample_cases) && q.sample_cases.length > 0) ||
    Boolean(q?.sample_input || q?.sample_output)
  );
}

/**
 * Authoritative server pooling for a single mock exam section.
 */
export async function poolSectionQuestionsServer(
  supabaseAdmin,
  sec,
  neededCount,
  usedQuestionIds,
  serveCountForPassages
) {
  const topicIds = Array.isArray(sec?.topic_ids) ? sec.topic_ids.filter(Boolean) : [];
  const nameLower = String(sec?.name || '').toLowerCase();
  const isCodingSection = sec?.section_type === 'CODING' || sec?.category === 'coding';
  const isExplicitTechMcq =
    !isCodingSection &&
    (sec?.section_type === 'TECHNICAL_MCQ' ||
      sec?.category === 'technical-mcqs' ||
      Boolean(sec?.category?.startsWith('mcq-')) ||
      topicIds.some((t) => String(t).startsWith('mcq-')) ||
      nameLower.includes('technical mcq'));
  const isTechAptitudeOrPseudo =
    !isCodingSection &&
    !isExplicitTechMcq &&
    (sec?.category === 'technical-aptitude' ||
      sec?.category === 'tech-aptitude' ||
      topicIds.some((t) => t in TECHNICAL_APTITUDE_TO_MCQ_MAP || String(t).includes('pseudo') || String(t).includes('code-debug') || String(t).includes('bitwise')) ||
      nameLower.includes('technical &') ||
      nameLower.includes('technical pseudocode') ||
      nameLower.includes('pseudocode') ||
      nameLower.includes('pseudo-code'));

  // -------------------------------------------------------------------------
  // 1. CODING SECTION
  // -------------------------------------------------------------------------
  if (isCodingSection) {
    const { data: allProblems, error: cpErr } = await supabaseAdmin
      .from('technical_problems')
      .select('id, title, category, topic_id, track, level, test_cases, sample_cases, sample_input, sample_output')
      .or('is_deleted.is.null,is_deleted.eq.false')
      .or('is_hidden.is.null,is_hidden.eq.false')
      .limit(500);

    if (cpErr || !Array.isArray(allProblems) || allProblems.length === 0) {
      return { questionIds: [], isCodingSection: true, isTechnicalMcq: false };
    }

    const testableAll = allProblems.filter(hasUsableCodingTests);
    const workingPool = testableAll.length > 0 ? testableAll : allProblems;

    const targetDiff = String(sec?.difficulty || 'ALL').toUpperCase();
    const diffFiltered =
      targetDiff !== 'ALL' ? workingPool.filter((p) => matchesDifficulty(p.level, targetDiff)) : workingPool;
    const primaryPool = diffFiltered.length > 0 ? diffFiltered : workingPool;

    const questionIds = [];

    if (topicIds.length > 0) {
      const buckets = new Map();
      for (const reqTopic of topicIds) {
        const upper = String(reqTopic).toUpperCase();
        const expanded = new Set(
          (CODING_TOPIC_TO_DB_CATEGORIES[upper] || [reqTopic, upper, String(reqTopic).toLowerCase()]).map((s) =>
            String(s).toUpperCase()
          )
        );
        const keywords = CODING_TOPIC_TITLE_KEYWORDS[upper] || [];

        const domainMatches = primaryPool.filter((p) => {
          const catU = String(p.category || '').toUpperCase();
          const topU = String(p.topic_id || '').toUpperCase();
          return expanded.has(catU) || expanded.has(topU);
        });

        // Respect coding_track if it yields matches for this domain; otherwise accept cross-track domain matches
        const trackMatched = sec?.coding_track
          ? domainMatches.filter((p) => String(p.track || '').toUpperCase() === String(sec.coding_track).toUpperCase())
          : domainMatches;
        const chosen = trackMatched.length > 0 ? trackMatched : domainMatches;

        const prioritized = [];
        const rest = [];
        for (const p of fisherYatesShuffle(chosen)) {
          const tl = String(p.title || '').toLowerCase();
          if (keywords.length > 0 && keywords.some((kw) => tl.includes(kw))) prioritized.push(p);
          else rest.push(p);
        }
        buckets.set(reqTopic, [...prioritized, ...rest]);
      }

      questionIds.push(...roundRobinSampleFromBuckets(buckets, neededCount, usedQuestionIds));
    } else {
      const trackPool = sec?.coding_track
        ? primaryPool.filter((p) => String(p.track || '').toUpperCase() === String(sec.coding_track).toUpperCase())
        : primaryPool;
      const effectivePool = trackPool.length > 0 ? trackPool : primaryPool;

      const byCat = new Map();
      for (const p of effectivePool) {
        const key = `${p.track || 'ALL'}::${p.category || 'GENERAL'}`;
        if (!byCat.has(key)) byCat.set(key, []);
        byCat.get(key).push(p);
      }
      for (const [k, list] of byCat.entries()) {
        byCat.set(k, stratifyDifficultyList(list));
      }
      questionIds.push(...roundRobinSampleFromBuckets(byCat, neededCount, usedQuestionIds));
    }

    // Fallback relaxation if selected track/topic/difficulty pool < neededCount
    if (questionIds.length < neededCount) {
      const fallbackOrder = [
        ...(sec?.coding_track
          ? workingPool.filter((p) => String(p.track || '').toUpperCase() === String(sec.coding_track).toUpperCase())
          : []),
        ...workingPool,
      ];
      for (const p of fisherYatesShuffle(fallbackOrder)) {
        if (!usedQuestionIds.has(p.id)) {
          usedQuestionIds.add(p.id);
          questionIds.push(p.id);
          if (questionIds.length >= neededCount) break;
        }
      }
    }

    return { questionIds, isCodingSection: true, isTechnicalMcq: false };
  }

  // -------------------------------------------------------------------------
  // 2. APTITUDE & REASONING (PRIMARY topic_questions)
  // -------------------------------------------------------------------------
  const questionIds = [];
  if (!isExplicitTechMcq) {
    let topicGroups = []; // Array<{ key: string; variants: string[] }>

    if (topicIds.length > 0) {
      topicGroups = topicIds.map((t) => ({
        key: t,
        variants: expandTopicAliasesServer([t]),
      }));
    } else if (sec?.category && sec.category !== 'all') {
      const cleanCat = String(sec.category).toLowerCase().trim();
      const catVariants = APTITUDE_CATEGORY_VARIANTS[cleanCat] || [cleanCat];
      const { data: topicRows } = await supabaseAdmin
        .from('aptitude_topics')
        .select('id, category_slug')
        .in('category_slug', catVariants)
        .or('is_hidden.is.null,is_hidden.eq.false');
      const ids = (topicRows || []).map((r) => r.id).filter(Boolean);
      topicGroups = fisherYatesShuffle(ids).map((id) => ({
        key: id,
        variants: expandTopicAliasesServer([id]),
      }));
    } else {
      // "All Domains" / Auto-Pool All: query directly per aptitude category so every category
      // is guaranteed representation, then mix round-robin at question level.
      const { data: allTopicsRows } = await supabaseAdmin
        .from('aptitude_topics')
        .select('id, category_slug')
        .or('is_hidden.is.null,is_hidden.eq.false');

      // Group topic IDs by category
      const topicsByCat = new Map();
      for (const row of allTopicsRows || []) {
        const c = row.category_slug || 'other';
        if (!topicsByCat.has(c)) topicsByCat.set(c, []);
        topicsByCat.get(c).push(row.id);
      }

      // Per category, fetch questions directly, then round-robin across categories at question level
      const perCatLimit = Math.max(60, Math.ceil((neededCount * 3) / Math.max(topicsByCat.size, 1)));
      const targetDiff = String(sec?.difficulty || 'ALL').toUpperCase();
      const catQuestionBuckets = new Map();

      await Promise.all(
        Array.from(topicsByCat.entries()).map(async ([cat, topicIds]) => {
          let q = supabaseAdmin
            .from('topic_questions')
            .select('id, question_number, topic_id, difficulty, structured_explanation')
            .in('topic_id', topicIds)
            .or('is_deleted.is.null,is_deleted.eq.false')
            .or('is_hidden.is.null,is_hidden.eq.false');
          if (targetDiff !== 'ALL') q = q.eq('difficulty', targetDiff);
          const { data } = await q.limit(perCatLimit);
          let rows = data || [];
          // Fallback: relax difficulty if no results
          if (rows.length === 0 && targetDiff !== 'ALL') {
            const { data: relaxed } = await supabaseAdmin
              .from('topic_questions')
              .select('id, question_number, topic_id, difficulty, structured_explanation')
              .in('topic_id', topicIds)
              .or('is_deleted.is.null,is_deleted.eq.false')
              .or('is_hidden.is.null,is_hidden.eq.false')
              .limit(perCatLimit);
            rows = relaxed || [];
          }
          if (rows.length > 0) {
            catQuestionBuckets.set(cat, targetDiff === 'ALL' ? stratifyDifficultyList(rows) : fisherYatesShuffle(rows));
          }
        })
      );

      // Round-robin across categories at question level to guarantee all categories represented
      const perCatQuota = Math.max(2, Math.ceil(neededCount / Math.max(catQuestionBuckets.size, 1)));
      for (const [cat, rows] of fisherYatesShuffle(Array.from(catQuestionBuckets.entries()))) {
        let added = 0;
        for (const q of rows) {
          if (!usedQuestionIds.has(q.id) && questionIds.length < neededCount && added < perCatQuota) {
            usedQuestionIds.add(q.id);
            questionIds.push(q.id);
            added++;
          }
        }
      }
      // Top up if we're still short (second pass, no per-cat limit)
      if (questionIds.length < neededCount) {
        for (const rows of catQuestionBuckets.values()) {
          for (const q of rows) {
            if (!usedQuestionIds.has(q.id) && questionIds.length < neededCount) {
              usedQuestionIds.add(q.id);
              questionIds.push(q.id);
            }
          }
          if (questionIds.length >= neededCount) break;
        }
      }
      return { questionIds, isCodingSection: false, isTechnicalMcq: false };
    }

    if (topicGroups.length > 0) {
      // Cap groups queried when very large while keeping balanced category representation
      const activeGroups = topicGroups.length > 36 ? fisherYatesShuffle(topicGroups).slice(0, 36) : topicGroups;
      const targetDiff = String(sec?.difficulty || 'ALL').toUpperCase();
      const perGroupFetchLimit = Math.max(60, Math.min(250, Math.ceil((neededCount * 4) / activeGroups.length)));

      // Fetch per group in parallel batches of 6 so zero topic gets truncated by PostgREST 1000-row limit
      const rowsByGroup = new Map();
      for (let i = 0; i < activeGroups.length; i += 6) {
        const batch = activeGroups.slice(i, i + 6);
        const batchResults = await Promise.all(
          batch.map(async (grp) => {
            const isPassageTopic = DEFAULT_PASSAGE_TOPICS.has(grp.key);
            let q = supabaseAdmin
              .from('topic_questions')
              .select('id, question_number, topic_id, difficulty, structured_explanation')
              .in('topic_id', grp.variants)
              .or('is_deleted.is.null,is_deleted.eq.false')
              .or('is_hidden.is.null,is_hidden.eq.false');
            if (!isPassageTopic && targetDiff !== 'ALL') {
              q = q.eq('difficulty', targetDiff);
            }
            const { data } = await q.limit(perGroupFetchLimit);
            let rows = data || [];
            if (rows.length === 0 && !isPassageTopic && targetDiff !== 'ALL') {
              const { data: relaxed } = await supabaseAdmin
                .from('topic_questions')
                .select('id, question_number, topic_id, difficulty, structured_explanation')
                .in('topic_id', grp.variants)
                .or('is_deleted.is.null,is_deleted.eq.false')
                .or('is_hidden.is.null,is_hidden.eq.false')
                .limit(perGroupFetchLimit);
              rows = relaxed || [];
            }
            return { key: grp.key, rows };
          })
        );
        for (const res of batchResults) {
          if (res.rows.length > 0) rowsByGroup.set(res.key, res.rows);
        }
      }

      // Separate each topic group into cohesive passage blocks vs standalone solo rows
      // and enforce fair per-topic quotas so passage topics never crowd out standalone topics.
      const nonEmptyGroups = Array.from(rowsByGroup.entries());
      if (nonEmptyGroups.length > 0) {
        const perGroupTarget = Math.max(1, Math.floor(neededCount / nonEmptyGroups.length));
        const soloBuckets = new Map();
        const extraPassages = [];

        for (const [grpKey, rows] of fisherYatesShuffle(nonEmptyGroups)) {
          const passageBlocks = {};
          const soloRows = [];

          for (const q of rows) {
            let se = q.structured_explanation;
            if (typeof se === 'string') {
              try {
                se = JSON.parse(se);
              } catch {}
            }
            const isPassage = DEFAULT_PASSAGE_TOPICS.has(q.topic_id) || Boolean(se?.passage || se?.passageTitle);
            if (isPassage) {
              const title = se?.passageTitle && se.passageTitle !== 'none' ? se.passageTitle : null;
              const blockKey = title || `${q.topic_id}-block-${Math.floor(((q.question_number || 1) - 1) / 5)}`;
              if (!passageBlocks[blockKey]) passageBlocks[blockKey] = [];
              passageBlocks[blockKey].push(q);
            } else {
              soloRows.push(q);
            }
          }

          const blockKeys = fisherYatesShuffle(Object.keys(passageBlocks));
          if (blockKeys.length > 0) {
            let addedForGroup = 0;
            // Allow at least 1 complete passage block up to fair share (bounded so solo topics stay well represented)
            const maxForGroup = Math.max(perGroupTarget, Math.min(neededCount, Math.max(serveCountForPassages > 5 ? 10 : 5, perGroupTarget)));
            for (const bk of blockKeys) {
              const sortedBlock = passageBlocks[bk]
                .sort((a, b) => (a.question_number || 0) - (b.question_number || 0))
                .filter((q) => !usedQuestionIds.has(q.id));
              if (sortedBlock.length === 0) continue;
              if (addedForGroup === 0 || (addedForGroup + sortedBlock.length <= maxForGroup && questionIds.length + sortedBlock.length <= neededCount)) {
                if (questionIds.length === 0 || questionIds.length + sortedBlock.length <= neededCount) {
                  for (const q of sortedBlock) {
                    usedQuestionIds.add(q.id);
                    questionIds.push(q.id);
                  }
                  addedForGroup += sortedBlock.length;
                } else {
                  extraPassages.push(sortedBlock);
                }
              } else {
                extraPassages.push(sortedBlock);
              }
              if (addedForGroup >= perGroupTarget) break;
            }
          }

          if (soloRows.length > 0) {
            soloBuckets.set(grpKey, targetDiff === 'ALL' ? stratifyDifficultyList(soloRows) : fisherYatesShuffle(soloRows));
          }
        }

        // Fill remaining slots round-robin evenly across ALL standalone topic buckets
        if (questionIds.length < neededCount && soloBuckets.size > 0) {
          questionIds.push(...roundRobinSampleFromBuckets(soloBuckets, neededCount - questionIds.length, usedQuestionIds));
        }

        // Top up with unused passage blocks only if slots remain
        if (questionIds.length < neededCount && extraPassages.length > 0) {
          for (const blk of extraPassages) {
            const unused = blk.filter((q) => !usedQuestionIds.has(q.id));
            if (unused.length > 0 && questionIds.length + unused.length <= neededCount) {
              for (const q of unused) {
                usedQuestionIds.add(q.id);
                questionIds.push(q.id);
              }
            }
            if (questionIds.length >= neededCount) break;
          }
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // 3. TECHNICAL MCQs (explicit OR technical-aptitude fallback)
  // -------------------------------------------------------------------------
  if (isExplicitTechMcq || (isTechAptitudeOrPseudo && questionIds.length < neededCount)) {
    const mappedTopics = new Set();
    for (const t of topicIds) {
      if (String(t).startsWith('mcq-')) mappedTopics.add(t);
      else if (TECHNICAL_APTITUDE_TO_MCQ_MAP[t]) {
        for (const m of TECHNICAL_APTITUDE_TO_MCQ_MAP[t]) mappedTopics.add(m);
      }
    }
    if (mappedTopics.size === 0) {
      if (sec?.category?.startsWith('mcq-')) mappedTopics.add(sec.category);
      else if (nameLower.includes('pseudocode') || nameLower.includes('pseudo-code')) {
        ['mcq-pseudo-code', 'mcq-data-structures', 'mcq-c-programming', 'mcq-cpp-programming'].forEach((t) =>
          mappedTopics.add(t)
        );
      } else if (nameLower.includes('data structure') || nameLower.includes('dsa')) {
        ['mcq-data-structures', 'mcq-pseudo-code', 'mcq-c-programming', 'mcq-cpp-programming', 'mcq-java-programming', 'mcq-oops-concepts'].forEach((t) =>
          mappedTopics.add(t)
        );
      } else {
        ALL_CORE_CS_MCQ_TOPICS.forEach((t) => mappedTopics.add(t));
      }
    }

    const allowedTech = expandTopicAliasesServer(Array.from(mappedTopics));
    const targetDiff = String(sec?.difficulty || 'ALL').toUpperCase();

    const { data: techData } = await supabaseAdmin
      .from('technical_mcqs')
      .select('id, topic_id, difficulty')
      .in('topic_id', allowedTech)
      .or('is_deleted.is.null,is_deleted.eq.false')
      .or('is_hidden.is.null,is_hidden.eq.false')
      .limit(1000);

    const rows = Array.isArray(techData) ? techData : [];
    const diffFiltered =
      targetDiff !== 'ALL' ? rows.filter((r) => matchesDifficulty(r.difficulty, targetDiff)) : rows;
    const activeRows = diffFiltered.length > 0 ? diffFiltered : rows;

    const bySubject = new Map();
    for (const r of activeRows) {
      const k = r.topic_id || 'mcq-general';
      if (!bySubject.has(k)) bySubject.set(k, []);
      bySubject.get(k).push(r);
    }
    for (const [k, list] of bySubject.entries()) {
      bySubject.set(k, targetDiff === 'ALL' ? stratifyDifficultyList(list) : fisherYatesShuffle(list));
    }

    const remainingNeeded = Math.max(0, neededCount - questionIds.length);
    questionIds.push(...roundRobinSampleFromBuckets(bySubject, remainingNeeded, usedQuestionIds));

    // Top up across unfiltered difficulty if strict difficulty was short
    if (questionIds.length < neededCount && rows.length > activeRows.length) {
      const fallbackMap = new Map();
      for (const r of rows) {
        const k = r.topic_id || 'mcq-general';
        if (!fallbackMap.has(k)) fallbackMap.set(k, []);
        fallbackMap.get(k).push(r);
      }
      for (const [k, list] of fallbackMap.entries()) fallbackMap.set(k, fisherYatesShuffle(list));
      questionIds.push(...roundRobinSampleFromBuckets(fallbackMap, neededCount - questionIds.length, usedQuestionIds));
    }

    return { questionIds, isCodingSection: false, isTechnicalMcq: true };
  }

  return { questionIds, isCodingSection: false, isTechnicalMcq: isExplicitTechMcq };
}
