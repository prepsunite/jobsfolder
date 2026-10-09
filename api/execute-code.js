import { createClient } from '@supabase/supabase-js';

// Judge0 Standard Language IDs
const JUDGE0_LANGUAGE_IDS = {
  python: 71, // Python 3.8.1
  cpp: 54,    // C++ (GCC 9.2.0)
  java: 62,   // Java (OpenJDK 13.0.1)
  c: 50,      // C (GCC 9.2.0)
};

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

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
    const judge0ApiKey = process.env.JUDGE0_API_KEY || process.env.RAPIDAPI_KEY || process.env.VITE_JUDGE0_API_KEY;
    const judge0BaseUrl = process.env.JUDGE0_URL || 'https://ce.judge0.com';

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[api/execute-code] Database credentials missing.');
      return res.status(500).json({ error: 'Server database credentials not configured.' });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 1. Session Authentication
    let userEmail = null;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
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

    const {
      problemId,
      language = 'python',
      sourceCode,
      customStdin,
      testCases: clientTestCases,
      isSubmit = false,
    } = req.body || {};

    // Submitting a formal solution strictly requires authenticated user session
    if (isSubmit && !userEmail) {
      return res.status(401).json({ error: 'Please sign in to submit verified solutions.' });
    }

    if (!sourceCode || sourceCode.trim().length === 0) {
      return res.status(400).json({ error: 'Source code cannot be empty.' });
    }

    const langKey = String(language).toLowerCase().trim();
    const langId = JUDGE0_LANGUAGE_IDS[langKey] || JUDGE0_LANGUAGE_IDS.python;

    // Helper: Execute single test case against Judge0 with resource constraints [P1-03]
    const executeJudge0 = async (stdinText) => {
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      if (judge0ApiKey) {
        headers['X-Auth-Token'] = judge0ApiKey;
        headers['X-RapidAPI-Key'] = judge0ApiKey;
      }
      if (process.env.RAPIDAPI_HOST) {
        headers['X-RapidAPI-Host'] = process.env.RAPIDAPI_HOST;
      }

      const payload = {
        source_code: encodeBase64(sourceCode),
        language_id: langId,
        stdin: encodeBase64(stdinText || ''),
        cpu_time_limit: 2.0,       // 2.0s CPU limit
        memory_limit: 256000,      // 256MB memory limit
        wall_time_limit: 5.0,      // 5.0s wall limit
      };

      const judgeRes = await fetch(`${judge0BaseUrl}/submissions/?base64_encoded=true&wait=true`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      if (!judgeRes.ok) {
        const text = await judgeRes.text();
        throw new Error(`Compiler gateway error (${judgeRes.status}): ${text.slice(0, 150)}`);
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
    };

    // 2. Handle Custom Input Execution
    if (customStdin !== undefined && !problemId && (!clientTestCases || clientTestCases.length === 0)) {
      const customRes = await executeJudge0(customStdin);
      return res.status(200).json({
        isCustom: true,
        stdout: customRes.stdout,
        stderr: customRes.stderr || customRes.compileOutput,
        timeMs: customRes.timeMs,
        memoryKb: customRes.memoryKb,
        status: customRes.statusDesc,
      });
    }

    // 3. Resolve Test Cases (From DB by problemId, or from request for mock exam)
    let testCases = [];

    if (problemId) {
      const { data: problem, error: probError } = await supabaseAdmin
        .from('technical_problems')
        .select('id, test_cases, sample_cases, hidden_test_cases')
        .eq('id', problemId)
        .maybeSingle();

      if (probError || !problem) {
        return res.status(404).json({ error: 'Problem not found.' });
      }

      if (Array.isArray(problem.sample_cases) && problem.sample_cases.length > 0) {
        testCases = [
          ...problem.sample_cases,
          ...(Array.isArray(problem.hidden_test_cases) ? problem.hidden_test_cases : []),
        ];
      } else if (Array.isArray(problem.test_cases) && problem.test_cases.length > 0) {
        testCases = problem.test_cases;
      }
    } else if (Array.isArray(clientTestCases) && clientTestCases.length > 0) {
      testCases = clientTestCases;
    }

    if (testCases.length === 0) {
      return res.status(400).json({ error: 'No test cases configured for this problem.' });
    }

    // 4. Run Test Cases with Compiler Sandboxing & Hidden Case Masking [P0-02, P1-03]
    const evaluatedCases = [];
    let passedCount = 0;
    let compileError = null;
    let overallStatus = 'ACCEPTED';
    let maxRuntimeMs = 0;
    let maxMemoryKb = 0;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const isHidden = Boolean(tc.is_hidden);
      const expectedOut = normalizeOutput(tc.expected_output || tc.output || '');

      let runRes;
      try {
        runRes = await executeJudge0(tc.input || '');
      } catch (execErr) {
        runRes = {
          stdout: '',
          stderr: execErr.message || 'Execution error',
          compileOutput: '',
          statusId: 11,
          statusDesc: 'Runtime Error',
          timeMs: 0,
          memoryKb: 0,
        };
      }

      maxRuntimeMs = Math.max(maxRuntimeMs, runRes.timeMs);
      maxMemoryKb = Math.max(maxMemoryKb, runRes.memoryKb);

      // Check Compilation Error
      if (runRes.statusId === 6 || runRes.compileOutput.trim().length > 0) {
        compileError = runRes.compileOutput || runRes.stderr;
        overallStatus = 'COMPILATION_ERROR';
        evaluatedCases.push({
          caseIndex: i + 1,
          status: 'COMPILATION_ERROR',
          passed: false,
          error: compileError,
          timeMs: runRes.timeMs,
        });
        break; // Stop running further tests on compile error
      }

      // Check Time Limit Exceeded
      if (runRes.statusId === 5) {
        overallStatus = 'TIME_LIMIT_EXCEEDED';
        evaluatedCases.push({
          caseIndex: i + 1,
          status: 'TIME_LIMIT_EXCEEDED',
          passed: false,
          timeMs: runRes.timeMs,
        });
        if (isSubmit) break;
        continue;
      }

      // Check Runtime Error
      if (runRes.statusId >= 7 && runRes.statusId <= 12) {
        overallStatus = 'RUNTIME_ERROR';
        evaluatedCases.push({
          caseIndex: i + 1,
          status: 'RUNTIME_ERROR',
          passed: false,
          error: isHidden ? '[Runtime Error on Hidden Case]' : runRes.stderr,
          timeMs: runRes.timeMs,
        });
        if (isSubmit) break;
        continue;
      }

      const actualOut = normalizeOutput(runRes.stdout);
      const isMatch = actualOut === expectedOut;

      if (isMatch) {
        passedCount++;
        evaluatedCases.push({
          caseIndex: i + 1,
          status: 'PASSED',
          passed: true,
          input: isHidden ? '[Hidden Test Case]' : tc.input,
          expected: isHidden ? '[Hidden Expected Output]' : expectedOut,
          actual: isHidden ? '[Output Matched]' : actualOut,
          timeMs: runRes.timeMs,
        });
      } else {
        if (overallStatus === 'ACCEPTED') overallStatus = 'WRONG_ANSWER';
        evaluatedCases.push({
          caseIndex: i + 1,
          status: 'WRONG_ANSWER',
          passed: false,
          input: isHidden ? '[Hidden Test Case]' : tc.input,
          expected: isHidden ? '[Hidden Expected Output]' : expectedOut,
          actual: isHidden ? '[Hidden Output Mismatch]' : actualOut,
          timeMs: runRes.timeMs,
        });
        if (isSubmit) break;
      }
    }

    // 5. If this was a formal Submission, record in database ledger via Atomic RPC [P0-03, P1-02]
    let submissionRecord = null;
    if (isSubmit && problemId && userEmail) {
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

      if (rpcErr) {
        console.error('[api/execute-code] RPC submission record failed:', rpcErr.message);
      } else {
        submissionRecord = rpcRes;
      }
    }

    return res.status(200).json({
      success: true,
      status: overallStatus,
      passedCount,
      totalCount: testCases.length,
      isAllPassed: passedCount === testCases.length && testCases.length > 0,
      compileError,
      cases: evaluatedCases,
      submission: submissionRecord,
    });
  } catch (error) {
    console.error('[api/execute-code] Execution error:', error);
    return res.status(500).json({ error: error.message || 'Compiler execution error.' });
  }
}
