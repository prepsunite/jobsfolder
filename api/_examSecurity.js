import crypto from 'crypto';

const VERDICT_VERSION = 1;
const DEFAULT_MAX_TOKEN_AGE_MS = 6 * 60 * 60 * 1000; // 6 hours

export function getVerdictSigningKey(secretOverride) {
  const raw =
    secretOverride ||
    process.env.EXAM_VERDICT_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.RAZORPAY_KEY_SECRET ||
    '';

  if (!raw) return null;
  return crypto
    .createHmac('sha256', 'prepunite-exam-verdict-hmac-v1')
    .update(String(raw), 'utf8')
    .digest();
}

export function hashCodeSha256(sourceCode) {
  return crypto
    .createHash('sha256')
    .update(String(sourceCode || ''), 'utf8')
    .digest('hex');
}

export function normalizePasscodePin(pin) {
  return String(pin || '').trim().toUpperCase();
}

export function hashPasscodePin(pin) {
  const clean = normalizePasscodePin(pin);
  if (!clean) return '';
  return crypto.createHash('sha256').update(clean, 'utf8').digest('hex');
}

export function extractPasscodeMarker(instructions) {
  if (!instructions || typeof instructions !== 'string') return '';
  const match = instructions.match(/<!--PASSCODE:(.*?)-->/i);
  return match?.[1] ? normalizePasscodePin(match[1]) : '';
}

export function stripPasscodeMarker(instructions) {
  if (!instructions || typeof instructions !== 'string') return instructions || '';
  return instructions.replace(/<!--PASSCODE:.*?-->\r?\n?/gi, '').trim();
}

export function signCodingVerdict(
  { attemptId, problemId, langKey, sourceCode, passedCount, totalCount, userEmail, issuedAt },
  secretOverride
) {
  const key = getVerdictSigningKey(secretOverride);
  if (!key) return null;

  const claims = {
    v: VERDICT_VERSION,
    attemptId: String(attemptId || ''),
    problemId: String(problemId || ''),
    langKey: String(langKey || 'python').toLowerCase(),
    codeSha256: hashCodeSha256(sourceCode),
    passedCount: Math.max(0, Number(passedCount) || 0),
    totalCount: Math.max(0, Number(totalCount) || 0),
    userEmail: String(userEmail || '').trim().toLowerCase(),
    issuedAt: Number(issuedAt) || Date.now(),
  };

  const payloadB64 = Buffer.from(JSON.stringify(claims), 'utf8').toString('base64url');
  const sigB64 = crypto.createHmac('sha256', key).update(payloadB64, 'utf8').digest('base64url');
  return `${payloadB64}.${sigB64}`;
}

export function verifyCodingVerdict(token, expected = {}, secretOverride) {
  const key = getVerdictSigningKey(secretOverride);
  if (!key) {
    return { valid: false, reason: 'Server verdict signing secret not configured' };
  }
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return { valid: false, reason: 'Missing or malformed verdict token' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, reason: 'Invalid verdict token segment count' };
  }

  const [payloadB64, sigB64] = parts;
  const expectedSigB64 = crypto
    .createHmac('sha256', key)
    .update(payloadB64, 'utf8')
    .digest('base64url');

  const sigBuf = Buffer.from(sigB64, 'utf8');
  const expectedBuf = Buffer.from(expectedSigB64, 'utf8');
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return { valid: false, reason: 'Verdict signature mismatch' };
  }

  let claims;
  try {
    claims = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch {
    return { valid: false, reason: 'Corrupt verdict token payload' };
  }

  if (!claims || claims.v !== VERDICT_VERSION) {
    return { valid: false, reason: 'Unsupported verdict version' };
  }
  if (expected.attemptId && String(claims.attemptId) !== String(expected.attemptId)) {
    return { valid: false, reason: 'Verdict token belongs to a different attempt' };
  }
  if (expected.problemId && String(claims.problemId) !== String(expected.problemId)) {
    return { valid: false, reason: 'Verdict token belongs to a different problem' };
  }
  if (expected.userEmail && String(claims.userEmail) !== String(expected.userEmail).trim().toLowerCase()) {
    return { valid: false, reason: 'Verdict token belongs to a different user' };
  }
  if (expected.langKey && String(claims.langKey) !== String(expected.langKey).trim().toLowerCase()) {
    return { valid: false, reason: 'Verdict token language mismatch' };
  }
  if (expected.sourceCode !== undefined && claims.codeSha256 !== hashCodeSha256(expected.sourceCode)) {
    return { valid: false, reason: 'Source code modified after execution verdict' };
  }

  const maxAgeMs = Number(expected.maxAgeMs) > 0 ? Number(expected.maxAgeMs) : DEFAULT_MAX_TOKEN_AGE_MS;
  const ageMs = Date.now() - Number(claims.issuedAt || 0);
  if (!Number.isFinite(ageMs) || ageMs < -60_000 || ageMs > maxAgeMs) {
    return { valid: false, reason: 'Verdict token expired' };
  }

  return {
    valid: true,
    passedCount: Math.max(0, Number(claims.passedCount) || 0),
    totalCount: Math.max(1, Number(claims.totalCount) || 1),
    issuedAt: claims.issuedAt,
    langKey: claims.langKey,
  };
}

export function fnv1aSeed(str) {
  let h = 2166136261 >>> 0;
  const s = String(str || 'prepunite-seed');
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seedInt) {
  let a = seedInt >>> 0;
  return function nextRand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function deterministicShuffle(items, seedString) {
  const arr = [...(items || [])];
  if (arr.length <= 1) return arr;
  const rng = mulberry32(fnv1aSeed(seedString));
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function parseStructuredExplanation(raw) {
  if (!raw) return null;
  if (typeof raw === 'object') return raw;
  if (typeof raw === 'string' && raw.trim().startsWith('{')) {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Selects up to `serveCount` questions from `orderedIds` while keeping
 * multi-question passage blocks (Reading Comprehension / Cloze Test) together.
 */
export function assignSectionQuestionSubset(orderedIds, metaById, serveCount, seedString, shouldShuffle = true) {
  const uniqueIds = [];
  const seen = new Set();
  for (const id of orderedIds || []) {
    if (!id || seen.has(id)) continue;
    seen.add(id);
    uniqueIds.push(id);
  }

  const targetCount =
    typeof serveCount === 'number' && serveCount > 0 && serveCount < uniqueIds.length
      ? serveCount
      : uniqueIds.length;

  // Group items that share the same normalized passage stimulus into atomic blocks
  const blocks = [];
  const passageIndexByKey = new Map();

  for (const qId of uniqueIds) {
    const meta = metaById?.get ? metaById.get(qId) : metaById?.[qId];
    const se = parseStructuredExplanation(meta?.structured_explanation);
    const passageText = String(meta?.passage || se?.passage || '').trim();

    if (passageText) {
      const pKey = `${meta?.topic_id || 'topic'}::${passageText.slice(0, 180)}`;
      if (passageIndexByKey.has(pKey)) {
        blocks[passageIndexByKey.get(pKey)].push(qId);
      } else {
        passageIndexByKey.set(pKey, blocks.length);
        blocks.push([qId]);
      }
    } else {
      blocks.push([qId]);
    }
  }

  const orderedBlocks = shouldShuffle
    ? deterministicShuffle(blocks, seedString)
    : blocks;

  const picked = [];
  for (const blk of orderedBlocks) {
    if (picked.length >= targetCount) break;
    // Keep entire passage block intact whenever at least one slot remains
    if (blk.length > 1 && picked.length + blk.length <= targetCount) {
      picked.push(...blk);
    } else if (blk.length > 1 && picked.length === 0) {
      picked.push(...blk.slice(0, targetCount));
    } else if (blk.length === 1) {
      picked.push(blk[0]);
    }
  }

  // Top up if passage blocks left remaining slots unfilled
  if (picked.length < targetCount) {
    const pickedSet = new Set(picked);
    for (const blk of orderedBlocks) {
      for (const id of blk) {
        if (picked.length >= targetCount) break;
        if (!pickedSet.has(id)) {
          picked.push(id);
          pickedSet.add(id);
        }
      }
      if (picked.length >= targetCount) break;
    }
  }

  return picked;
}

export function parseCorrectAnswerIndex(raw) {
  if (raw === null || raw === undefined || raw === '') return -1;
  if (typeof raw === 'number' && Number.isFinite(raw)) return Math.trunc(raw);
  const clean = String(raw).trim().toUpperCase();
  if (/^-?\d+$/.test(clean)) return parseInt(clean, 10);
  if (/^[A-F]$/.test(clean)) return clean.charCodeAt(0) - 65;
  return -1;
}

export function sanitizeMockExamRecord(exam, { isPrivileged = false, hasSecretRecord = false } = {}) {
  if (!exam || typeof exam !== 'object') return exam;
  const hadPasscodeMarker = Boolean(extractPasscodeMarker(exam.instructions));
  const sanitized = {
    ...exam,
    instructions: stripPasscodeMarker(exam.instructions),
    enable_passcode_lock: Boolean(
      exam.enable_passcode_lock || exam.access_passcode_hash || hasSecretRecord || hadPasscodeMarker
    ),
  };

  if (!isPrivileged) {
    delete sanitized.access_passcode;
    delete sanitized.access_passcode_hash;
  } else {
    delete sanitized.access_passcode_hash;
  }
  return sanitized;
}

export function sanitizeExamQuestionRow(row, kind) {
  if (!row) return null;

  if (kind === 'topic_questions') {
    const se = parseStructuredExplanation(row.structured_explanation);
    const passage = row.passage || se?.passage || undefined;
    const passageTitle = row.passageTitle || se?.passageTitle || undefined;
    return {
      id: row.id,
      topic_id: row.topic_id,
      question_number: row.question_number,
      statement: row.statement,
      options: row.options,
      difficulty: row.difficulty || 'MEDIUM',
      sample_input: row.sample_input,
      sample_output: row.sample_output,
      ...(passage ? { passage } : {}),
      ...(passageTitle ? { passageTitle } : {}),
      ...(passage || passageTitle
        ? { structured_explanation: { passage: passage || null, passageTitle: passageTitle || null } }
        : {}),
    };
  }

  if (kind === 'technical_mcqs') {
    return {
      id: row.id,
      topic_id: row.topic_id,
      statement: row.question,
      code_snippet: row.code_snippet,
      options: row.options,
      difficulty: row.difficulty || 'MEDIUM',
      isTechnicalMcq: true,
    };
  }

  if (kind === 'technical_problems') {
    const rawSamples =
      Array.isArray(row.sample_cases) && row.sample_cases.length > 0
        ? row.sample_cases
        : Array.isArray(row.test_cases)
          ? row.test_cases.filter((tc) => !tc?.is_hidden)
          : [];

    const visibleSamples = rawSamples.map((tc, idx) => ({
      input: String(tc?.input ?? ''),
      output: String(tc?.expected_output ?? tc?.output ?? ''),
      expected_output: String(tc?.expected_output ?? tc?.output ?? ''),
      is_hidden: false,
      explanation: tc?.explanation || `Sample case ${idx + 1}`,
    }));

    return {
      id: row.id,
      title: row.title,
      statement: row.description,
      description: row.description,
      options: [],
      difficulty: row.level || 'MEDIUM',
      topic_id: row.category || 'coding',
      constraints: row.constraints,
      sample_input: row.sample_input,
      sample_output: row.sample_output,
      test_cases: visibleSamples,
      isCodingProblem: true,
    };
  }

  return null;
}
