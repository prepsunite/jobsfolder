import { createClient } from '@supabase/supabase-js';
import { signCodingVerdict } from './_examSecurity.js';

const MAX_SOURCE_CODE_BYTES = 65536; // 64 KB cap
const MAX_CUSTOM_STDIN_BYTES = 16384; // 16 KB cap

// Judge0 Standard Language IDs
const JUDGE0_LANGUAGE_IDS = {
  python: 71, // Python 3.8.1
  cpp: 54,    // C++ (GCC 9.2.0)
  java: 62,   // Java (OpenJDK 13.0.1)
  c: 50,      // C (GCC 9.2.0)
};

// ─── Phase 1B: Per-User Rate Limit Store ─────────────────────────────────────
// In-memory map: userEmail (or IP) → last request timestamp.
// Works per Vercel function instance. For cross-instance limits, swap this for
// Upstash Redis when scaling to 10k+ students.
const recentRequests = new Map();
const USER_COOLDOWN_MS = 3000; // 3 seconds between runs per user

// ─── Phase 1C: Judge0 Host Fallback Chain ────────────────────────────────────
// Primary: your own private Judge0 server (set JUDGE0_URL in Vercel env vars).
// Secondary: RapidAPI hosted Judge0 (set RAPIDAPI_JUDGE0_URL + RAPIDAPI_KEY).
// Tertiary: Public community edition (free, rate-limited, last resort).
function buildJudge0HostChain() {
  const hosts = [];

  // 1. Private dedicated server (Phase 2 upgrade: compiler.prepunite.com)
  if (process.env.JUDGE0_URL && !process.env.JUDGE0_URL.includes('ce.judge0.com')) {
    hosts.push({
      url: process.env.JUDGE0_URL,
      authToken: process.env.JUDGE0_API_KEY || null,
      rapidApiKey: null,
      rapidApiHost: null,
      label: 'private',
    });
  }

  // 2. RapidAPI Judge0 CE (paid, no rate limit — backup)
  if (process.env.RAPIDAPI_JUDGE0_URL && process.env.RAPIDAPI_KEY) {
    hosts.push({
      url: process.env.RAPIDAPI_JUDGE0_URL,
      authToken: null,
      rapidApiKey: process.env.RAPIDAPI_KEY,
      rapidApiHost: process.env.RAPIDAPI_HOST || 'judge0-ce.p.rapidapi.com',
      label: 'rapidapi',
    });
  }

  // 3. Public CE fallback (always last — always available but rate-limited)
  hosts.push({
    url: 'https://ce.judge0.com',
    authToken: process.env.JUDGE0_API_KEY || null,
    rapidApiKey: null,
    rapidApiHost: null,
    label: 'public-ce',
  });

  return hosts;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function encodeBase64(str) {
  if (!str) return '';
  return Buffer.from(str, 'utf-8').toString('base64');
}

function decodeBase64(b64) {
  if (!b64) return '';
  return Buffer.from(b64, 'base64').toString('utf-8');
}

function normalizeOutput(str) {
  if (!str) return '';
  return str
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((l) => l.trimEnd())
    .join('\n')
    .trim();
}

function stripQuotes(str) {
  if (!str) return '';
  const trimmed = str.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}

function compareOutputs(actualRaw, expectedRaw) {
  if (actualRaw === expectedRaw) return true;
  if (!actualRaw && !expectedRaw) return true;

  const actual = (actualRaw || '').trim();
  const expected = (expectedRaw || '').trim();

  // 1. Direct match
  if (actual === expected) return true;

  // 2. Normalized newline & trailing space match
  const normActual = normalizeOutput(actual);
  const normExpected = normalizeOutput(expected);
  if (normActual === normExpected) return true;

  // 3. String Quote Tolerance (e.g. "Hello World" vs Hello World, "fl" vs fl, "" vs "")
  if (stripQuotes(normActual) === stripQuotes(normExpected)) return true;

  // If one is empty and stripQuotes didn't match, they cannot match on booleans, JSON or numbers
  if (!normActual || !normExpected) return false;

  // 4. Boolean Case-Insensitive Tolerance (e.g. Python True vs Java/C++ true)
  if (/^(?:true|false)$/i.test(normActual) && /^(?:true|false)$/i.test(normExpected)) {
    if (normActual.toLowerCase() === normExpected.toLowerCase()) return true;
  }

  // 5. JSON / Array whitespace & format tolerance (e.g. [0,1] vs [0, 1], {"a":1} vs {"a": 1})
  if (
    (normActual.startsWith('[') && normActual.endsWith(']')) ||
    (normActual.startsWith('{') && normActual.endsWith('}'))
  ) {
    try {
      const parsedActual = JSON.parse(normActual.replace(/'/g, '"'));
      const parsedExpected = JSON.parse(normExpected.replace(/'/g, '"'));
      if (deepEqual(parsedActual, parsedExpected)) return true;
    } catch {}
  }

  // 6. Number tolerance (e.g. 1.0 vs 1)
  const numActual = Number(normActual);
  const numExpected = Number(normExpected);
  if (!isNaN(numActual) && !isNaN(numExpected) && normActual.length < 20 && normExpected.length < 20) {
    if (Math.abs(numActual - numExpected) < 1e-7) return true;
  }

  return false;
}

function normalizeStdin(rawStdin) {
  if (!rawStdin) return '';
  const trimmed = rawStdin.trim();
  if (!trimmed) return '';

  const hasVariableAssignment = /(?:^|[\n,;])\s*[A-Za-z_]\w*\s*=\s*[^=]/m.test(trimmed);
  if (!hasVariableAssignment) {
    return rawStdin;
  }

  const lines = trimmed.split(/\r?\n/);
  const normalizedLines = lines.map((line) => {
    if (/(?:^|[,;])\s*[A-Za-z_]\w*\s*=\s*/.test(line)) {
      const parts = line.split(/[,;]\s*(?=[A-Za-z_]\w*\s*=)/);
      const extracted = parts.map((part) => {
        const val = part.replace(/^\s*[A-Za-z_]\w*\s*=\s*/, '').trim();
        return val.replace(/^['"](.*)['"]$/, '$1');
      });
      return extracted.join(' ');
    }
    return line;
  });

  return normalizedLines.join('\n');
}

// ─── Single Judge0 Host Executor ─────────────────────────────────────────────
async function executeOnHost(host, stdinText, sourceCode, langId) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (host.authToken) {
    headers['X-Auth-Token'] = host.authToken;
  }
  if (host.rapidApiKey) {
    headers['X-RapidAPI-Key'] = host.rapidApiKey;
    headers['X-RapidAPI-Host'] = host.rapidApiHost;
  }

  const payload = {
    source_code: encodeBase64(sourceCode),
    language_id: langId,
    stdin: encodeBase64(stdinText || ''),
    cpu_time_limit: 2.0,    // 2.0s CPU limit
    memory_limit: 256000,   // 256MB memory limit
    wall_time_limit: 5.0,   // 5.0s wall limit
  };

  const judgeRes = await fetch(`${host.url}/submissions/?base64_encoded=true&wait=true`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30000), // 30s — covers 5s wall limit + queue wait under heavy campus drive traffic
  });

  if (!judgeRes.ok) {
    const text = await judgeRes.text();
    const err = new Error(`[${host.label}] Compiler gateway error (${judgeRes.status}): ${text.slice(0, 150)}`);
    err.statusCode = judgeRes.status;
    throw err;
  }

  const data = await judgeRes.json();
  return {
    stdout: decodeBase64(data.stdout || ''),
    stderr: decodeBase64(data.stderr || ''),
    compileOutput: decodeBase64(data.compile_output || ''),
    statusId: data.status?.id || 0,
    statusDesc: data.status?.description || 'Unknown',
    timeMs: data.time ? Math.round(parseFloat(data.time) * 1000) : 0,
    memoryKb: data.memory || 0,
  };
}

// ─── Phase 1C: Fallback Chain Executor ───────────────────────────────────────
// Tries each Judge0 host in order. Falls through on 429 (rate-limit) or 503.
// Throws on the last host or on unrecoverable errors (4xx other than 429).
async function executeJudge0WithFallback(stdinText, sourceCode, langId, hosts) {
  let lastErr = null;

  for (const host of hosts) {
    try {
      return await executeOnHost(host, stdinText, sourceCode, langId);
    } catch (err) {
      lastErr = err;
      const isRetryable =
        err.statusCode === 429 ||   // Rate limited
        err.statusCode === 503 ||   // Service unavailable
        err.message?.includes('fetch failed') ||
        err.message?.includes('ECONNREFUSED') ||
        err.message?.includes('ETIMEDOUT');

      if (isRetryable) {
        console.warn(`[api/execute-code] Host "${host.label}" failed (${err.statusCode || 'network'}), trying next...`);
        continue;
      }
      // Non-retryable error (compile error, bad request, etc.) — throw immediately
      throw err;
    }
  }

  throw new Error(`All compiler endpoints are currently busy. Please try again in a moment. (${lastErr?.message})`);
}

// ─── Phase 1A: Result Assembler for Parallel Execution ───────────────────────
// Converts a settled Promise result into a standard runRes shape (never throws).
function settledToRunRes(settled, stdinText) {
  if (settled.status === 'fulfilled') {
    return settled.value;
  }
  const err = settled.reason;
  return {
    stdout: '',
    stderr: err?.message || 'Execution error',
    compileOutput: '',
    statusId: 11, // Runtime Error (matches Judge0 status schema)
    statusDesc: 'Runtime Error',
    timeMs: 0,
    memoryKb: 0,
  };
}

export async function resolveServerTestCases(supabaseAdmin, problemId) {
  if (!problemId || !supabaseAdmin) return [];
  try {
    const { data: problem, error: probError } = await supabaseAdmin
      .from('technical_problems')
      .select('id, test_cases, sample_cases, hidden_test_cases')
      .eq('id', problemId)
      .maybeSingle();

    if (!problem || probError) return [];

    const sampleList =
      Array.isArray(problem.sample_cases) && problem.sample_cases.length > 0
        ? problem.sample_cases
        : Array.isArray(problem.test_cases)
          ? problem.test_cases.filter((tc) => !tc?.is_hidden)
          : [];
    const hiddenList =
      Array.isArray(problem.hidden_test_cases) && problem.hidden_test_cases.length > 0
        ? problem.hidden_test_cases
        : Array.isArray(problem.test_cases)
          ? problem.test_cases.filter((tc) => Boolean(tc?.is_hidden))
          : [];

    const normalizedSamples = sampleList.map((tc) => ({ ...tc, is_hidden: false }));
    const normalizedHidden = hiddenList.map((tc) => ({ ...tc, is_hidden: true }));
    return [...normalizedSamples, ...normalizedHidden];
  } catch (dbErr) {
    console.warn('[api/execute-code] DB problem lookup error:', dbErr?.message);
    return [];
  }
}

export async function executeProblemAgainstDb({
  supabaseAdmin,
  problemId,
  language = 'python',
  sourceCode,
  userEmail = null,
  attemptId = null,
  examMode = false,
  isSubmit = false,
  clientTestCases = null,
  customStdin = null,
}) {
  const langKey = String(language || 'python').toLowerCase().trim();
  const langId = JUDGE0_LANGUAGE_IDS[langKey] || 71;
  const hosts = buildJudge0HostChain();

  if (customStdin !== undefined && !problemId && (!clientTestCases || clientTestCases.length === 0)) {
    const customRes = await executeJudge0WithFallback(String(customStdin), sourceCode, langId, hosts);
    return {
      isCustom: true,
      stdout: customRes.stdout,
      stderr: customRes.stderr || customRes.compileOutput,
      timeMs: customRes.timeMs,
      memoryKb: customRes.memoryKb,
      status: customRes.statusDesc,
    };
  }

  let testCases = [];
  if (problemId && supabaseAdmin) {
    // Authoritative Postgres test cases ONLY when problemId is provided (ignores clientTestCases)
    testCases = await resolveServerTestCases(supabaseAdmin, problemId);
  }
  if (testCases.length === 0 && !problemId && !attemptId && !examMode && Array.isArray(clientTestCases)) {
    testCases = clientTestCases.slice(0, 15);
  }

  if (testCases.length === 0) {
    return {
      status: 'NO_TEST_CASES',
      passedCount: 0,
      totalCount: 0,
      isAllPassed: false,
      compileError: null,
      cases: [],
      verdictToken: null,
    };
  }

  const executeOne = (stdinText) => executeJudge0WithFallback(stdinText, sourceCode, langId, hosts);
  const firstSettled = (await Promise.allSettled([executeOne(normalizeStdin(testCases[0]?.input || ''))]))[0];
  const firstRunRes = settledToRunRes(firstSettled, testCases[0]?.input || '');
  const isCompileError =
    firstRunRes.statusId === 6 ||
    (firstRunRes.compileOutput && firstRunRes.compileOutput.trim().length > 0);

  const settledResults = [firstSettled];
  if (!isCompileError && testCases.length > 1) {
    const remainingCases = testCases.slice(1);
    const CHUNK_SIZE = 3;
    for (let i = 0; i < remainingCases.length; i += CHUNK_SIZE) {
      const chunk = remainingCases.slice(i, i + CHUNK_SIZE);
      const chunkSettled = await Promise.allSettled(
        chunk.map((tc) => executeOne(normalizeStdin(tc?.input || '')))
      );
      settledResults.push(...chunkSettled);
    }
  }

  const evaluatedCases = [];
  let passedCount = 0;
  let compileError = null;
  let overallStatus = 'ACCEPTED';
  let maxRuntimeMs = 0;
  let maxMemoryKb = 0;
  const isMockExamEval = Boolean(attemptId || examMode);

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i] || {};
    const isHidden = Boolean(tc.is_hidden);
    const expectedOut = normalizeOutput(
      tc.expected_output || tc.output || tc.expectedOutput || tc.expected || ''
    );

    if (isCompileError && i > 0) {
      evaluatedCases.push({
        caseIndex: i + 1,
        isHidden,
        status: 'SKIPPED',
        passed: false,
        actual: isHidden ? undefined : 'Skipped due to compilation error.',
        timeMs: 0,
        memoryKb: 0,
      });
      continue;
    }

    const runRes = settledToRunRes(settledResults[i], tc.input || '');
    maxRuntimeMs = Math.max(maxRuntimeMs, runRes.timeMs);
    maxMemoryKb = Math.max(maxMemoryKb, runRes.memoryKb);

    if (runRes.statusId === 6 || (runRes.compileOutput && runRes.compileOutput.trim().length > 0)) {
      compileError = runRes.compileOutput || runRes.stderr;
      overallStatus = 'COMPILATION_ERROR';
      evaluatedCases.push({
        caseIndex: i + 1,
        isHidden,
        status: 'COMPILATION_ERROR',
        passed: false,
        error: compileError,
        timeMs: runRes.timeMs,
      });
      break;
    }

    if (runRes.statusId === 5) {
      overallStatus = 'TIME_LIMIT_EXCEEDED';
      evaluatedCases.push({
        caseIndex: i + 1,
        isHidden,
        status: 'TIME_LIMIT_EXCEEDED',
        passed: false,
        timeMs: runRes.timeMs,
      });
      continue;
    }

    if (runRes.statusId >= 7 && runRes.statusId <= 12) {
      overallStatus = 'RUNTIME_ERROR';
      evaluatedCases.push({
        caseIndex: i + 1,
        isHidden,
        status: 'RUNTIME_ERROR',
        passed: false,
        error: isHidden ? 'Runtime error on hidden test case.' : (runRes.stderr || 'Runtime error.'),
        timeMs: runRes.timeMs,
      });
      continue;
    }

    const actualOut = normalizeOutput(runRes.stdout);
    const isMatch = compareOutputs(actualOut, expectedOut);

    if (isMatch) {
      passedCount++;
      evaluatedCases.push({
        caseIndex: i + 1,
        isHidden,
        status: 'PASSED',
        passed: true,
        ...(isHidden ? {} : { input: tc.input || '', expected: expectedOut, actual: actualOut }),
        timeMs: runRes.timeMs,
      });
    } else {
      if (overallStatus === 'ACCEPTED') overallStatus = 'WRONG_ANSWER';
      evaluatedCases.push({
        caseIndex: i + 1,
        isHidden,
        status: 'WRONG_ANSWER',
        passed: false,
        ...(isHidden
          ? {}
          : { input: tc.input || '', expected: expectedOut, actual: actualOut || '[No output]' }),
        timeMs: runRes.timeMs,
      });
      // Practice submits stop on first failure; exam evaluations MUST run all cases for partial credit
      if (isSubmit && !isMockExamEval) break;
    }
  }

  let submissionRecord = null;
  if ((isSubmit || isMockExamEval) && problemId && userEmail && supabaseAdmin) {
    try {
      const { data: rpcRes, error: rpcErr } = await supabaseAdmin.rpc('record_verified_coding_submission', {
        p_user_email: userEmail,
        p_problem_id: problemId,
        p_language: langKey,
        p_source_code: sourceCode,
        p_status: overallStatus,
        p_runtime_ms: maxRuntimeMs,
        p_memory_kb: maxMemoryKb,
        p_passed_cases: passedCount,
        p_total_cases: testCases.length,
        p_error_output: compileError,
      });
      if (!rpcErr) submissionRecord = rpcRes;
    } catch {}
  }

  const verdictToken =
    attemptId && problemId && userEmail
      ? signCodingVerdict({
          attemptId,
          problemId,
          langKey,
          sourceCode,
          passedCount,
          totalCount: testCases.length,
          userEmail,
        })
      : null;

  return {
    status: overallStatus,
    passedCount,
    totalCount: testCases.length,
    isAllPassed: passedCount === testCases.length && testCases.length > 0,
    compileError,
    cases: evaluatedCases,
    submission: submissionRecord,
    verdictToken,
  };
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

    let supabaseAdmin = null;
    if (supabaseUrl && supabaseServiceKey) {
      try {
        supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
      } catch (clientErr) {
        console.warn('[api/execute-code] Supabase admin client initialization warning:', clientErr?.message);
      }
    }

    // 1. Session Authentication
    let userEmail = null;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ') && supabaseAdmin) {
      const token = authHeader.substring(7);
      try {
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
        if (!authError && user?.email) {
          userEmail = user.email.toLowerCase().trim();
        }
      } catch (authErr) {
        console.warn('[api/execute-code] JWT authentication error:', authErr?.message);
      }
    }

    // ─── Phase 1B: Per-User / Per-IP Rate Limiting ──────────────────────────
    // Key by authenticated email; fall back to sanitized client IP for unauthenticated "Run" clicks.
    const clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
                     req.headers['x-real-ip'] ||
                     req.socket?.remoteAddress ||
                     'anon';
    const rateLimitKey = userEmail ? `user_${userEmail}` : `ip_${clientIp}`;
    const effectiveCooldownMs = userEmail ? USER_COOLDOWN_MS : 8000; // 8s cooldown for unauthenticated runs

    const now = Date.now();
    const lastRun = recentRequests.get(rateLimitKey) || 0;

    if (now - lastRun < effectiveCooldownMs) {
      const waitMs = effectiveCooldownMs - (now - lastRun);
      res.setHeader('Retry-After', Math.ceil(waitMs / 1000));
      return res.status(429).json({
        error: `Please wait ${Math.ceil(waitMs / 1000)}s before running again.${!userEmail ? ' Sign in for shorter cooldowns.' : ''}`,
        retryAfterMs: waitMs,
      });
    }
    recentRequests.set(rateLimitKey, now);

    // Prevent memory leak: clean entries older than 5 minutes
    if (recentRequests.size > 5000) {
      const cutoff = now - 300000;
      for (const [key, ts] of recentRequests.entries()) {
        if (ts < cutoff) recentRequests.delete(key);
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

    const {
      problemId,
      language = 'python',
      sourceCode,
      customStdin,
      testCases: clientTestCases,
      isSubmit = false,
      attemptId = null,
      examMode = false,
    } = req.body || {};

    if (!sourceCode || typeof sourceCode !== 'string' || sourceCode.trim().length === 0) {
      return res.status(400).json({ error: 'Source code cannot be empty.' });
    }
    if (Buffer.byteLength(sourceCode, 'utf8') > MAX_SOURCE_CODE_BYTES) {
      return res.status(413).json({ error: 'Source code exceeds the 64 KB limit.' });
    }
    if (customStdin !== undefined && customStdin !== null) {
      if (typeof customStdin !== 'string' || Buffer.byteLength(customStdin, 'utf8') > MAX_CUSTOM_STDIN_BYTES) {
        return res.status(413).json({ error: 'Custom stdin exceeds the 16 KB limit.' });
      }
    }

    // Submitting a formal solution or evaluating inside an active mock exam requires auth
    if ((isSubmit || attemptId || examMode) && !userEmail) {
      return res.status(401).json({ error: 'Please sign in to submit or verify exam solutions.' });
    }
    if ((attemptId || examMode) && !problemId) {
      return res.status(400).json({ error: 'Problem identifier is required for exam execution.' });
    }

    const result = await executeProblemAgainstDb({
      supabaseAdmin,
      problemId,
      language,
      sourceCode,
      userEmail,
      attemptId,
      examMode,
      isSubmit,
      clientTestCases,
      customStdin,
    });

    if (result?.isCustom) {
      return res.status(200).json(result);
    }

    if (result?.status === 'NO_TEST_CASES') {
      return res.status(422).json({
        error: 'No server-verified test cases configured for this problem.',
        status: 'NO_TEST_CASES',
        passedCount: 0,
        totalCount: 0,
        isAllPassed: false,
        cases: [],
      });
    }

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('[api/execute-code] Execution error:', error);
    return res.status(500).json({ error: error.message || 'Compiler execution error.' });
  }
}
